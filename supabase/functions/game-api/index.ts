import { createClient } from 'npm:@supabase/supabase-js@2';
import { Chess } from 'npm:chess.js@1.4.0';
import { exercises } from './exercises.js';
import { debugExercises } from './debug-exercises.js';
import { careerEvents } from './career-events.js';
import { MAX_LEVEL, MIN_LEVEL, START_LEVEL, baseElo } from './game-config.js';

const CLIENT_VERSION = '1.3.0';
const LEGACY_CLIENT_VERSION = '1.2.0';
const SUPPORTED_CLIENT_VERSIONS = new Set([LEGACY_CLIENT_VERSION, CLIENT_VERSION]);
const LEGACY_ELO_BASE = [600,800,1200,1400,1600,2000,2200,2350,2500,2600,2750];
const TITLE_RULES = [
  { code: 'FM', threshold: 2300, name: 'Maestro FIDE' },
  { code: 'IM', threshold: 2400, name: 'Maestro Internacional' },
  { code: 'GM', threshold: 2500, name: 'Gran Maestro' },
];
const ALLOWED_ORIGINS = new Set(['https://matiasg11.github.io']);

type JsonRecord = Record<string, unknown>;
type Session = Record<string, any>;

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function corsHeaders(request: Request) {
  const origin = request.headers.get('origin') || '';
  const local = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.has(origin) || local ? origin : 'https://matiasg11.github.io',
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}

function response(request: Request, body: JsonRecord, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(request), 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function randomInteger(min: number, max: number) {
  const range = max - min + 1;
  const limit = Math.floor(0x100000000 / range) * range;
  const values = new Uint32Array(1);
  do crypto.getRandomValues(values); while (values[0] >= limit);
  return min + (values[0] % range);
}

function createVisitorToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function tokenHash(token: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function resolveVisitor(admin: any, suppliedToken: unknown, createIfMissing: boolean) {
  const token = String(suppliedToken || '');
  if (/^[a-f0-9]{64}$/.test(token)) {
    const hash = await tokenHash(token);
    const { data, error } = await admin.from('gambito_visitors').select('id')
      .eq('token_hash', hash).maybeSingle();
    if (error) throw error;
    if (data) {
      await admin.from('gambito_visitors').update({ last_seen_at: new Date().toISOString() }).eq('id', data.id);
      return { visitorId: data.id as string, visitorToken: null };
    }
  }
  if (!createIfMissing) throw new ApiError(401, 'La identidad anónima del navegador no es válida.');
  const visitorToken = createVisitorToken();
  const hash = await tokenHash(visitorToken);
  const { data, error } = await admin.from('gambito_visitors').insert({ token_hash: hash }).select('id').single();
  if (error) throw error;
  return { visitorId: data.id as string, visitorToken };
}

function chanceSucceeds(chance: number) {
  return randomInteger(1, 100) <= chance;
}

function currentElo(session: Session) {
  const floor = session.client_version === LEGACY_CLIENT_VERSION
    ? LEGACY_ELO_BASE[session.level]
    : baseElo(session.level);
  return floor + session.decision_elo + session.exercise_elo;
}

function titleRank(code: string) {
  return TITLE_RULES.findIndex((rule) => rule.code === code);
}

function earnedTitle(elo: number, current: string) {
  const earned = [...TITLE_RULES].reverse().find((rule) => elo > rule.threshold);
  return earned && titleRank(earned.code) > titleRank(current) ? earned : null;
}

function publicSession(session: Session) {
  return {
    id: session.id,
    name: session.player_name,
    debug: session.debug,
    season: session.season,
    level: session.level,
    wins: session.wins,
    decisionElo: session.decision_elo,
    exerciseElo: session.exercise_elo,
    chessTitle: session.chess_title,
    decisionPositive: session.decision_positive,
    decisionTotal: session.decision_total,
    exerciseTotal: session.exercise_total,
    maxElo: session.max_elo,
    maxLevel: session.max_level,
    eventsDone: session.events_done,
    eventHistory: session.event_history,
    currentEventId: session.current_event_id,
    seasonAnswers: session.season_answers,
    currentExerciseId: session.current_exercise_id,
    exerciseAttempts: session.exercise_attempts,
    exerciseStep: session.exercise_step,
    currentElo: session.current_elo ?? currentElo(session),
    completed: Boolean(session.completed_at) || session.season > 10,
    clientVersion: session.client_version,
  };
}

function enrichProgress(session: Session, changes: Session) {
  const candidate = { ...session, ...changes };
  const elo = currentElo(candidate);
  const award = earnedTitle(elo, session.chess_title);
  if (award) changes.chess_title = award.code;
  changes.current_elo = elo;
  changes.max_elo = Math.max(session.max_elo, elo);
  changes.max_level = Math.max(session.max_level, candidate.level);
  return award ? {
    title: `¡Felicitaciones, ${award.name}!`,
    text: `Superaste los ${award.threshold} puntos de ELO. El título ${award.code} es permanente.`,
  } : null;
}

async function loadSession(admin: any, visitorId: string, sessionId: string) {
  if (!sessionId) throw new ApiError(400, 'Falta el identificador de la carrera.');
  const { data, error } = await admin.from('gambito_sessions').select('*')
    .eq('id', sessionId).eq('visitor_id', visitorId).maybeSingle();
  if (error) throw error;
  if (!data) throw new ApiError(404, 'La carrera no existe o no pertenece a este jugador.');
  return data;
}

async function casUpdate(admin: any, session: Session, changes: Session) {
  const { data, error } = await admin.from('gambito_sessions')
    .update({ ...changes, version: session.version + 1, updated_at: new Date().toISOString() })
    .eq('id', session.id).eq('visitor_id', session.visitor_id).eq('version', session.version)
    .select('*').maybeSingle();
  if (error) throw error;
  if (!data) throw new ApiError(409, 'La carrera cambió en otra pestaña. Recargá y volvé a intentar.');
  return data;
}

function eligibleEvents(session: Session) {
  return careerEvents.filter((event: any) =>
    session.season >= event.minSeason && session.season <= event.maxSeason &&
    session.level >= event.minLevel && session.level <= event.maxLevel
  );
}

function chooseEvent(session: Session) {
  const allEligible = eligibleEvents(session);
  const unused = allEligible.filter((event: any) => !session.event_history.includes(event.id));
  const pool = unused.length ? unused : allEligible;
  if (!pool.length) throw new ApiError(422, 'No existe una situación válida para esta temporada y nivel.');
  return pool[(session.season * 7 + session.level * 3 + session.event_history.length) % pool.length];
}

function publicEvent(event: any) {
  return {
    id: event.id,
    title: event.title,
    text: event.text,
    choices: event.choices.map((choice: any) => ({
      id: choice.id,
      label: choice.label,
      description: choice.description,
    })),
  };
}

function seasonExercises(session: Session) {
  const source = session.debug ? debugExercises : exercises;
  const exerciseLevel = session.level;
  const pool = source.filter((item: any) =>
    item.level === exerciseLevel &&
    (session.debug || session.client_version !== LEGACY_CLIENT_VERSION || item.legacy)
  );
  if (!pool.length) throw new ApiError(422, `No hay ejercicios para el nivel ${exerciseLevel}.`);
  const offset = ((session.season - 1) * 2) % pool.length;
  return [pool[offset], pool[(offset + 1) % pool.length]];
}

function exerciseId(exercise: any) {
  return exercise.id || exercise.source.split('/').pop();
}

function findExercise(session: Session, id: string) {
  const found = seasonExercises(session).find((item: any) => exerciseId(item) === id);
  if (!found) throw new ApiError(422, 'El ejercicio no corresponde a esta temporada y nivel.');
  return found;
}

function parseSanSolution(text: string) {
  return text.replaceAll('/', ' ').trim().split(/\s+/).filter(Boolean);
}

function uciMove(token: string) {
  return { from: token.slice(0, 2), to: token.slice(2, 4), promotion: token[4] || undefined };
}

function moveUci(move: any) {
  return `${move.from}${move.to}${move.promotion || ''}`;
}

function playToken(game: Chess, token: string, mode: 'uci' | 'san') {
  return mode === 'uci' ? game.move(uciMove(token)) : game.move(token);
}

function preparedExercise(exercise: any) {
  const game = new Chess(exercise.fen);
  if (exercise.moves) {
    const tokens = exercise.moves.trim().split(/\s+/);
    game.move(uciMove(tokens.shift()!));
    return { game, sequence: tokens, mode: 'uci' as const };
  }
  return { game, sequence: parseSanSolution(exercise.solution), mode: 'san' as const };
}

function solutionDisplay(exercise: any) {
  const prepared = preparedExercise(exercise);
  return prepared.sequence.map((token: string) => {
    try { return playToken(prepared.game, token, prepared.mode).san; }
    catch { return token; }
  }).join(' / ');
}

async function ensureCurrentExercise(admin: any, session: Session) {
  if (session.season > 10) return { session, exercise: null };
  if (!session.events_done.includes(session.season)) {
    throw new ApiError(409, 'Primero hay que resolver la situación de carrera.');
  }
  const exercise = seasonExercises(session)[session.season_answers.length];
  const id = exerciseId(exercise);
  if (session.current_exercise_id === id) return { session, exercise };
  session = await casUpdate(admin, session, {
    current_exercise_id: id,
    exercise_attempts: 3,
    exercise_step: 0,
  });
  return { session, exercise };
}

async function registerResult(admin: any, session: Session) {
  if (session.debug || !session.completed_at) return;
  const completion = await admin.rpc('gambito_finalize_result', { p_session_id: session.id });
  if (completion.error) throw completion.error;
}

async function publicStats(admin: any, visitorId: string) {
  const { data, error } = await admin.rpc('gambito_public_stats', { p_visitor_id: visitorId });
  if (error) throw error;
  return data;
}

async function completeExercise(admin: any, session: Session, success: boolean, reward: number) {
  const completedSeason = session.season;
  const previousLevel = session.level;
  const answers = [...session.season_answers, success];
  const changes: Session = {
    wins: session.wins + (success ? 1 : 0),
    exercise_elo: session.exercise_elo + reward,
    exercise_total: session.exercise_total + 1,
    season_answers: answers,
    current_exercise_id: null,
    exercise_attempts: 3,
    exercise_step: 0,
  };
  let seasonCompleted = false;
  let correct = answers.filter(Boolean).length;
  let movement = 'same';

  if (answers.length === 2) {
    seasonCompleted = true;
    let nextLevel = session.level;
    if (correct === 2) nextLevel = Math.min(MAX_LEVEL, nextLevel + 1);
    if (correct === 0) nextLevel = Math.max(MIN_LEVEL, nextLevel - 1);
    movement = nextLevel > previousLevel ? 'up' : nextLevel < previousLevel ? 'down' : 'same';
    changes.level = nextLevel;
    changes.season = session.season + 1;
    changes.season_answers = [];
    if (changes.season > 10) changes.completed_at = new Date().toISOString();
  }

  const award = enrichProgress(session, changes);
  const updated = await casUpdate(admin, session, changes);
  if (updated.completed_at) await registerResult(admin, updated);
  return { updated, award, seasonCompleted, completedSeason, previousLevel, correct, movement };
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return response(request, { ok: true });
  if (request.method !== 'POST') return response(request, { error: 'Método no permitido.' }, 405);

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const admin = createClient(supabaseUrl, serviceRole, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const payload = await request.json().catch(() => ({}));
    const action = String(payload.action || '');
    const requestedClientVersion = String(payload.clientVersion || '');
    if (!SUPPORTED_CLIENT_VERSIONS.has(requestedClientVersion)) {
      throw new ApiError(409, 'Hay una versión nueva del juego. Recargá la página para continuar.');
    }
    const visitor = await resolveVisitor(admin, payload.visitorToken, action === 'start');
    const visitorId = visitor.visitorId;

    if (action === 'start') {
      const name = String(payload.name || '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 18);
      if (!name) throw new ApiError(400, 'Ingresá un nombre para comenzar.');
      const debug = name.toUpperCase() === 'BOCA';
      const { data: session, error } = await admin.from('gambito_sessions').insert({
        visitor_id: visitorId,
        player_name: name,
        debug,
        level: START_LEVEL,
        max_level: START_LEVEL,
        max_elo: requestedClientVersion === LEGACY_CLIENT_VERSION
          ? LEGACY_ELO_BASE[START_LEVEL]
          : baseElo(START_LEVEL),
        current_elo: requestedClientVersion === LEGACY_CLIENT_VERSION
          ? LEGACY_ELO_BASE[START_LEVEL]
          : baseElo(START_LEVEL),
        client_version: requestedClientVersion,
      }).select('*').single();
      if (error) throw error;
      if (!debug) {
        const registration = await admin.rpc('gambito_register_start', { p_visitor_id: visitorId });
        if (registration.error) throw registration.error;
      }
      return response(request, { ok: true, visitorToken: visitor.visitorToken, state: publicSession(session) });
    }

    let session = await loadSession(admin, visitorId, String(payload.sessionId || ''));

    if (action === 'current') {
      if (session.completed_at) await registerResult(admin, session);
      return response(request, { ok: true, state: publicSession(session) });
    }

    if (action === 'event') {
      if (session.completed_at || session.season > 10) throw new ApiError(409, 'La carrera ya terminó.');
      if (session.events_done.includes(session.season)) throw new ApiError(409, 'La decisión de esta temporada ya fue tomada.');
      let event = session.current_event_id
        ? careerEvents.find((candidate: any) => candidate.id === session.current_event_id)
        : null;
      if (!event) {
        event = chooseEvent(session);
        session = await casUpdate(admin, session, { current_event_id: event.id });
      }
      return response(request, { ok: true, event: publicEvent(event), state: publicSession(session) });
    }

    if (action === 'decision') {
      if (!session.current_event_id || session.events_done.includes(session.season)) {
        throw new ApiError(409, 'No hay una decisión pendiente.');
      }
      const event = careerEvents.find((candidate: any) => candidate.id === session.current_event_id);
      const choice = event?.choices.find((candidate: any) => candidate.id === payload.choiceId);
      if (!event || !choice || !eligibleEvents(session).some((candidate: any) => candidate.id === event.id)) {
        throw new ApiError(422, 'La alternativa no corresponde a la situación actual.');
      }
      const success = chanceSucceeds(choice.chance);
      const baseChange = success ? choice.successElo : choice.failureElo;
      const varied = baseChange + randomInteger(-5, 5);
      const change = baseChange > 0 ? Math.max(1, varied) : baseChange < 0 ? Math.min(-1, varied) : varied;
      const changes: Session = {
        decision_elo: session.decision_elo + change,
        decision_total: session.decision_total + 1,
        decision_positive: session.decision_positive + (success ? 1 : 0),
        event_history: session.event_history.includes(event.id) ? session.event_history : [...session.event_history, event.id],
        events_done: session.events_done.includes(session.season) ? session.events_done : [...session.events_done, session.season],
        current_event_id: null,
      };
      const award = enrichProgress(session, changes);
      session = await casUpdate(admin, session, changes);
      return response(request, {
        ok: true, success, change, baseChange, award,
        outcome: {
          title: success ? choice.successTitle : choice.failureTitle,
          text: success ? choice.successText : choice.failureText,
        },
        state: publicSession(session),
      });
    }

    if (action === 'exercise') {
      const ensured = await ensureCurrentExercise(admin, session);
      session = ensured.session;
      return response(request, {
        ok: true,
        exerciseId: exerciseId(ensured.exercise),
        state: publicSession(session),
      });
    }

    if (action === 'move') {
      const ensured = await ensureCurrentExercise(admin, session);
      session = ensured.session;
      const exercise = findExercise(session, session.current_exercise_id);
      const submittedMove = String(payload.move || '').toLowerCase();
      if (!/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(submittedMove)) {
        throw new ApiError(400, 'La jugada no tiene un formato válido.');
      }

      const prepared = preparedExercise(exercise);
      for (let index = 0; index < session.exercise_step; index++) {
        playToken(prepared.game, prepared.sequence[index], prepared.mode);
      }
      const expectedMove = playToken(prepared.game, prepared.sequence[session.exercise_step], prepared.mode);
      const expectedUci = moveUci(expectedMove);

      if (submittedMove !== expectedUci) {
        const attempts = session.exercise_attempts - 1;
        if (attempts > 0) {
          session = await casUpdate(admin, session, { exercise_attempts: attempts, exercise_step: 0 });
          return response(request, { ok: true, status: 'wrong', attempts, state: publicSession(session) });
        }
        const completed = await completeExercise(admin, session, false, 0);
        return response(request, {
          ok: true, status: 'failed', attempts: 0,
          solution: solutionDisplay(exercise),
          explanation: exercise.explanation,
          ...completed,
          updated: undefined,
          state: publicSession(completed.updated),
          stats: completed.updated.completed_at ? await publicStats(admin, visitorId) : undefined,
        });
      }

      let nextStep = session.exercise_step + 1;
      let opponentMove: string | null = null;
      if (nextStep < prepared.sequence.length) {
        opponentMove = moveUci(playToken(prepared.game, prepared.sequence[nextStep], prepared.mode));
        nextStep++;
      }

      if (nextStep < prepared.sequence.length) {
        session = await casUpdate(admin, session, { exercise_step: nextStep });
        return response(request, {
          ok: true, status: 'continue', opponentMove,
          attempts: session.exercise_attempts,
          state: publicSession(session),
        });
      }

      const reward = session.exercise_attempts === 3 ? 12 : session.exercise_attempts === 2 ? 6 : 3;
      const completed = await completeExercise(admin, session, true, reward);
      return response(request, {
        ok: true, status: 'solved', opponentMove, reward,
        explanation: exercise.explanation,
        ...completed,
        updated: undefined,
        state: publicSession(completed.updated),
        stats: completed.updated.completed_at ? await publicStats(admin, visitorId) : undefined,
      });
    }

    if (action === 'stats') {
      return response(request, { ok: true, stats: await publicStats(admin, visitorId), state: publicSession(session) });
    }

    throw new ApiError(400, 'Acción desconocida.');
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500;
    console.error(error);
    return response(request, {
      error: status === 500 ? 'No se pudo procesar la carrera en el servidor.' : error.message,
    }, status);
  }
});
