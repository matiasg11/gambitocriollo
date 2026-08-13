import { Chess } from 'https://cdn.jsdelivr.net/npm/chess.js@1.4.0/+esm';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { exercises } from './exercises.js';
import { debugExercises } from './debug-exercises.js';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './backend-config.js';
import { LEVEL_STAGE_NAMES, MAX_LEVEL, MIN_LEVEL, START_LEVEL, baseElo } from './game-config.js';
import { seasonScreen } from './season-screens.js';

const GAME_KEY = 'gambito-v6';
const VISITOR_KEY = 'gambito-visitor-v1';
const CLIENT_VERSION = '1.3.0';
const pieceName = { k:'rey', q:'dama', r:'torre', b:'alfil', n:'caballo', p:'peón' };
const $ = id => document.getElementById(id);
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

let state = {
  name:'', season:1, level:START_LEVEL, wins:0, decisionElo:0, exerciseElo:0, chessTitle:'', pendingAchievement:null,
  eventsDone:[], introsSeen:[], seasonAnswers:[], eventHistory:[], currentEventId:null,
  decisionPositive:0, decisionTotal:0, exerciseTotal:0, maxElo:baseElo(START_LEVEL), maxLevel:START_LEVEL,
  serverSessionId:null, exerciseAttempts:3, exerciseStep:0, completed:false
};

let chess;
let exercise;
let sequence = [];
let step = 0;
let attempts = 3;
let selected = null;
let last = [];
let boardOrientation = 'w';
let solutionMode = 'san';
let solutionDisplay = '';
let initialPuzzleFen = '';
let movePending = false;
let latestGlobalStats = null;

async function serverAction(action, values = {}){
  const visitorToken = localStorage.getItem(VISITOR_KEY);
  const {data,error} = await supabase.functions.invoke('game-api', {
    body:{action,sessionId:state.serverSessionId,visitorToken,clientVersion:CLIENT_VERSION,...values}
  });
  if(error){
    let serverMessage = data?.error;
    try {
      if(!serverMessage && error.context?.json) serverMessage = (await error.context.json())?.error;
    } catch {}
    throw new Error(serverMessage || error.message || 'No se pudo contactar al servidor del juego.');
  }
  if(data?.error) throw new Error(data.error);
  if(data?.visitorToken) localStorage.setItem(VISITOR_KEY,data.visitorToken);
  return data;
}

function applyServerState(serverState){
  if(!serverState) return;
  const localOnly = {introsSeen:state.introsSeen,pendingAchievement:state.pendingAchievement};
  state = {...state,...serverState,...localOnly,serverSessionId:serverState.id};
  attempts = state.exerciseAttempts ?? attempts;
  persist();
  stats();
}

function isDebug(){ return state.name.trim().toUpperCase() === 'BOCA'; }
function adjustedElo(ex){ return Math.round(ex.rating * 1.5); }
function currentElo(){ return baseElo(state.level) + state.decisionElo + state.exerciseElo; }
function displayName(){ return `${state.chessTitle ? state.chessTitle + ' ' : ''}${state.name}`; }
function stageName(){ return LEVEL_STAGE_NAMES[state.level] ?? seasonScreen(state.season).title; }
function persist(){ localStorage.setItem(GAME_KEY, JSON.stringify(state)); }
function screens(active){ ['intro','puzzle','event','result','ending'].forEach(id => $(id).hidden = id !== active); }

function updatePeaks(){
  state.maxElo = Math.max(Number(state.maxElo) || 0, currentElo());
  state.maxLevel = Math.max(Number(state.maxLevel) || 0, state.level);
}

function showAchievement(award){
  $('achievement').hidden = !award;
  if(!award) return;
  $('achievementTitle').textContent = award.title;
  $('achievementText').textContent = award.text;
}

function stats(){
  updatePeaks();
  $('player').textContent = displayName();
  $('season').textContent = Math.min(state.season, 10);
  $('elo').textContent = currentElo();
  $('wins').textContent = state.wins;
  $('level').textContent = state.level;
  $('eloBreakdown').textContent = `Base ${baseElo(state.level)} · Decisiones ${state.decisionElo >= 0 ? '+' : ''}${state.decisionElo} · Ejercicios +${state.exerciseElo}`;
  $('debugBadge').hidden = !isDebug();
  const done = state.seasonAnswers.length;
  $('seasonProgress').textContent = `${done}/2`;
  $('bar').style.width = `${done / 2 * 100}%`;
  $('rank').textContent = state.chessTitle === 'GM' ? 'Gran Maestro' : state.chessTitle === 'IM' ? 'Maestro Internacional' : state.chessTitle === 'FM' ? 'Maestro FIDE' : state.level >= 10 ? 'Campeón del mundo' : state.level === 9 ? 'Retador mundial' : state.level === 8 ? 'Candidato' : state.level >= 5 ? 'Figura nacional' : state.level >= 3 ? 'Talento regional' : 'Promesa del club';
}

async function enterGame(){
  $('welcome').hidden = true;
  $('game').hidden = false;
  stats();
  await route();
}

function getSeasonExercises(){
  const source = isDebug() ? debugExercises : exercises;
  const exerciseLevel = state.level;
  const pool = source.filter(item => item.level === exerciseLevel);
  const offset = ((state.season - 1) * 2) % pool.length;
  return [pool[offset], pool[(offset + 1) % pool.length]];
}

async function route(){
  if(state.season > 10) return ending();
  if(!state.introsSeen.includes(state.season)){
    screens('intro');
    $('chapter').textContent = `Temporada ${state.season} · Nivel actual ${state.level}`;
    const screen = seasonScreen(state.season);
    $('introTitle').textContent = stageName();
    $('introText').textContent = `${screen.text} Esta temporada tiene un dilema y dos ejercicios de nivel ${state.level}. Dos aciertos te hacen subir; uno te mantiene; dos fallos te hacen bajar.`;
    $('continue').onclick = () => { state.introsSeen.push(state.season); persist(); route(); };
    return;
  }
  if(!state.eventsDone.includes(state.season)) return showEvent();
  try {
    const result = await serverAction('exercise');
    applyServerState(result.state);
    const plan = getSeasonExercises();
    const planned = plan.find(item => (item.id || item.source.split('/').pop()) === result.exerciseId);
    if(!planned) throw new Error('El servidor indicó un ejercicio que no existe en esta versión del juego.');
    loadPuzzle(planned);
  } catch(error){ showServerError(error); }
}

function parseSanSolution(text){ return text.replaceAll('/',' ').trim().split(/\s+/).filter(Boolean); }
function uciMove(token){ return { from:token.slice(0,2), to:token.slice(2,4), promotion:token[4] || undefined }; }
function playToken(game, token, mode){ return mode === 'uci' ? game.move(uciMove(token)) : game.move(token); }

function loadPuzzle(ex){
  exercise = ex;
  solutionMode = ex.moves ? 'uci' : 'san';
  chess = new Chess(ex.fen);

  if(solutionMode === 'uci'){
    const moves = ex.moves.trim().split(/\s+/);
    chess.move(uciMove(moves.shift()));
    sequence = moves;
  } else {
    sequence = parseSanSolution(ex.solution);
  }

  initialPuzzleFen = chess.fen();
  const preview = new Chess(initialPuzzleFen);
  solutionDisplay = sequence.map(token => {
    try { return playToken(preview, token, solutionMode).san; }
    catch { return token; }
  }).join(' / ');

  boardOrientation = chess.turn();
  step = state.exerciseStep || 0;
  attempts = state.exerciseAttempts ?? 3;
  for(let index = 0; index < step; index++) playToken(chess, sequence[index], solutionMode);
  selected = null;
  last = [];
  screens('puzzle');
  const debugText = isDebug() ? ' · DEBUG 600–800' : '';
  $('puzzleLevel').textContent = `Temporada ${state.season} · ELO ${adjustedElo(ex)} · base ${ex.rating}${debugText}`;
  $('puzzleTitle').textContent = ex.title;
  $('objective').textContent = ex.objective;
  $('source').href = ex.source;
  $('hint').textContent = 'Pedir una pista';
  $('hint').onclick = () => feedback(ex.hint, '');
  feedback('', '');
  render();
}

function render(){
  $('attempts').textContent = '● '.repeat(attempts) + '○ '.repeat(3 - attempts);
  $('turn').textContent = `Juegan ${chess.turn() === 'w' ? 'blancas' : 'negras'} · Tu movimiento`;
  const isCheck = chess.isCheck();
  const checkedColor = isCheck ? chess.turn() : null;
  const ownKingInCheck = isCheck && checkedColor === boardOrientation;
  $('checkStatus').hidden = !isCheck;
  $('checkStatus').className = `check-status ${ownKingInCheck ? 'against' : 'given'}`;
  $('checkStatus').textContent = ownKingInCheck ? '⚠ Tu rey está en jaque' : '⚡ ¡Jaque al rival!';
  const board = $('board');
  board.innerHTML = '';
  const ranks = boardOrientation === 'w' ? [8,7,6,5,4,3,2,1] : [1,2,3,4,5,6,7,8];
  const files = boardOrientation === 'w' ? [...'abcdefgh'] : [...'hgfedcba'];

  ranks.forEach((rank, ri) => files.forEach((file, fi) => {
    const squareName = file + rank;
    const piece = chess.get(squareName);
    const button = document.createElement('button');
    const dark = (file.charCodeAt(0) - 97 + rank) % 2 === 1;
    button.className = `square ${dark ? 'dark' : 'light'}`;
    if(squareName === selected) button.classList.add('selected');
    if(last.includes(squareName)) button.classList.add('last');
    if(isCheck && piece?.type === 'k' && piece.color === checkedColor) button.classList.add('in-check');

    if(piece){
      const image = document.createElement('img');
      image.className = 'piece-image';
      image.src = `assets/pieces/${piece.color}${piece.type.toUpperCase()}.svg`;
      image.alt = '';
      image.draggable = false;
      button.appendChild(image);
    }
    if(ri === 7){ const label = document.createElement('span'); label.className = 'coordinate file'; label.textContent = file; button.appendChild(label); }
    if(fi === 0){ const label = document.createElement('span'); label.className = 'coordinate rank'; label.textContent = rank; button.appendChild(label); }
    button.setAttribute('aria-label', piece ? `${squareName}, ${pieceName[piece.type]} ${piece.color === 'w' ? 'blanco' : 'negro'}${button.classList.contains('in-check') ? ', en jaque' : ''}` : squareName);
    button.onclick = () => tap(squareName);
    board.appendChild(button);
  }));
}

async function tap(squareName){
  if(movePending) return;
  const piece = chess.get(squareName);
  if(!selected){
    if(!piece || piece.color !== chess.turn()) return;
    selected = squareName;
    render();
    return;
  }
  if(piece && piece.color === chess.turn()){
    selected = squareName;
    render();
    return;
  }

  const expected = sequence[step] || '';
  const expectedUci = solutionMode === 'uci' ? expected : '';
  const sanPromotion = expected.match(/=([QRBN])/i)?.[1]?.toLowerCase();
  const promotion = expectedUci.startsWith(selected + squareName) && expectedUci[4] ? expectedUci[4] : sanPromotion || 'q';
  const submittedMove = `${selected}${squareName}${promotion && (chess.get(selected)?.type === 'p' && ['1','8'].includes(squareName[1])) ? promotion : ''}`;
  let move;
  try { move = chess.move({from:selected, to:squareName, promotion}); }
  catch { move = null; }
  selected = null;
  const attemptsBefore = attempts;
  movePending = true;
  try {
    const result = await serverAction('move',{move:submittedMove});
    applyServerState(result.state);

    if(result.status === 'wrong'){
      chess = new Chess(initialPuzzleFen); step = 0; selected = null; last = []; attempts = result.attempts;
      feedback(`No es la línea buscada. Te quedan ${attempts} intentos; la posición vuelve al inicio.`, 'bad');
      render();
      return;
    }

    if(result.status === 'failed'){
      chess = new Chess(initialPuzzleFen); step = 0; selected = null; last = []; attempts = 0;
      render();
      feedback(`Sin intentos. Solución: ${result.solution}. ${result.explanation}`, 'bad');
      $('hint').textContent = 'Continuar';
      $('hint').onclick = () => finishExercise(result);
      return;
    }

    if(!move) throw new Error('El servidor aceptó una jugada que el tablero local no pudo reproducir.');
    last = [move.from,move.to];
    step++;
    attempts = attemptsBefore;
    feedback('¡Buena jugada! Calculando la respuesta…','good');
    render();

    if(result.opponentMove){
      await new Promise(resolve => setTimeout(resolve,650));
      const reply = chess.move(uciMove(result.opponentMove));
      last = [reply.from,reply.to];
      step++;
      render();
    }

    if(result.status === 'continue'){
      feedback('El rival respondió. Encontrá la continuación.','');
      return;
    }

    if(result.stats) latestGlobalStats = result.stats;
    if(result.award) state.pendingAchievement = result.award;
    persist();
    feedback(`${result.award ? result.award.title + ' ' : ''}¡Resuelto en el ${4 - attemptsBefore}.º intento! +${result.reward} ELO. ${result.explanation}`,'good');
    $('hint').textContent = 'Continuar';
    $('hint').onclick = () => finishExercise(result);
  } catch(error){
    chess = new Chess(initialPuzzleFen); step = state.exerciseStep || 0; selected = null; last = [];
    for(let index = 0; index < step; index++) playToken(chess,sequence[index],solutionMode);
    render();
    feedback(error.message,'bad');
  } finally { movePending = false; }
}

function finishExercise(result){
  $('hint').textContent = 'Pedir una pista';
  if(!result.seasonCompleted){ persist(); stats(); return route(); }

  const {completedSeason,correct,previousLevel,movement} = result;
  const award = result.award || state.pendingAchievement;
  state.pendingAchievement = null;
  persist();
  stats();
  screens('result');
  showAchievement(award);
  $('resultTag').textContent = `Temporada ${completedSeason} completada · ${correct}/2 correctos`;
  $('resultTitle').textContent = movement === 'up' ? `Subís al nivel ${state.level}` : movement === 'down' ? `Bajás al nivel ${state.level}` : `Te mantenés en el nivel ${state.level}`;
  $('resultText').textContent = correct === 2 && previousLevel < MAX_LEVEL ? 'Resolviste los dos ejercicios y avanzás un escalón.' : correct === 2 ? 'Resolviste los dos ejercicios y revalidás tu lugar en la cima.' : correct === 1 ? 'Un acierto y un fallo: conservás tu nivel para la próxima temporada.' : previousLevel === MIN_LEVEL ? `Fallaste ambos ejercicios, pero el nivel ${MIN_LEVEL} es el piso de la carrera.` : 'Los dos ejercicios quedaron sin resolver y retrocedés un nivel.';
  $('next').onclick = () => route();
}

async function showEvent(){
  screens('event');
  const box = $('eventChoices');
  box.innerHTML = '<p>El servidor está preparando la situación…</p>';
  try {
    const result = await serverAction('event');
    applyServerState(result.state);
    const event = result.event;
    $('eventTag').textContent = `Temporada ${state.season} · Situación de carrera`;
    $('eventTitle').textContent = event.title;
    $('eventText').textContent = event.text;
    box.innerHTML = '';
    event.choices.forEach(choice => {
      const button = document.createElement('button');
      button.innerHTML = `<b>${choice.label}</b><span>${choice.description}</span>`;
      button.onclick = () => resolveEvent(choice,box);
      box.appendChild(button);
    });
  } catch(error){ showServerError(error); }
}

async function resolveEvent(choice,box){
  const buttons = box.querySelectorAll('button');
  buttons.forEach(button => button.disabled = true);
  try {
    const result = await serverAction('decision',{choiceId:choice.id});
    applyServerState(result.state);
    screens('result');
    showAchievement(result.award);
    $('resultTag').textContent = result.success ? 'La decisión funciona' : 'La carrera se complica';
    $('resultTitle').textContent = result.outcome.title;
    $('resultText').textContent = `${result.outcome.text} Impacto: ${result.change >= 0 ? '+' : ''}${result.change} ELO.`;
    $('next').onclick = () => route();
  } catch(error){
    buttons.forEach(button => button.disabled = false);
    showServerError(error);
  }
}

function feedback(text, kind){ $('feedback').textContent = text; $('feedback').className = `feedback ${kind}`; }

function renderLeaderboard(globalStats){
  const body = $('leaderboardBody');
  body.innerHTML = '';
  const current = globalStats?.currentPlayer;
  const entries = [...(globalStats?.leaderboard || [])];
  if(current && !entries.some(entry => entry.position === current.position)) entries.push(current);
  entries.forEach(entry => {
    const row = document.createElement('tr');
    if(current && entry.position === current.position) row.className = 'current-player';
    [entry.position,entry.name,entry.elo,entry.level,`${entry.decisionPositive}/${entry.decisionTotal}`,`${entry.exercisePositive}/${entry.exerciseTotal}`].forEach(value => {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.appendChild(cell);
    });
    body.appendChild(row);
  });
  if(!entries.length){
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 6; cell.textContent = 'Todavía no hay carreras clasificadas.';
    row.appendChild(cell); body.appendChild(row);
  }
}

function renderHistogram(globalStats){
  const box = $('histogram');
  box.innerHTML = '';
  const bins = globalStats?.histogram || [];
  const maximum = Math.max(1,...bins.map(bin => bin.count));
  const playerElo = globalStats?.currentPlayer?.elo;
  bins.forEach(bin => {
    const bar = document.createElement('div');
    const current = playerElo >= bin.min && playerElo <= bin.max;
    bar.className = `histogram-bar ${current ? 'current' : ''}`;
    const count = document.createElement('strong'); count.textContent = bin.count;
    const column = document.createElement('i'); column.style.height = `${Math.max(3,bin.count / maximum * 145)}px`;
    const label = document.createElement('span'); label.textContent = `${bin.min}–${bin.max}`;
    const marker = document.createElement('em'); marker.textContent = current ? 'VOS' : '';
    bar.append(count,column,label,marker); box.appendChild(bar);
  });
  if(!bins.length) box.textContent = 'El histograma aparecerá cuando termine la primera carrera clasificada.';
}

function renderGlobalStats(globalStats){
  $('participantCount').textContent = globalStats?.participants ?? '—';
  $('careerCount').textContent = globalStats?.completedCareers ?? '—';
  const current = globalStats?.currentPlayer;
  if(state.debug){
    $('playerPlacement').textContent = 'Modo debug';
    $('playerPercentile').textContent = 'Las partidas BOCA no alteran el ranking.';
  } else if(current){
    $('playerPlacement').textContent = `Puesto ${current.position} de ${current.rankedPlayers}`;
    $('playerPercentile').textContent = `Superaste al ${current.percentile}% de los jugadores clasificados.`;
  } else {
    $('playerPlacement').textContent = 'Sin clasificación';
    $('playerPercentile').textContent = 'No se pudo ubicar esta carrera.';
  }
  renderHistogram(globalStats);
  renderLeaderboard(globalStats);
}

function resultShareText(){
  const position = latestGlobalStats?.currentPlayer?.position;
  return `${displayName()} terminó Gambito Criollo con ${state.maxElo} de ELO máximo, nivel ${state.maxLevel}, ${state.decisionPositive}/${state.decisionTotal} decisiones positivas y ${state.wins}/${state.exerciseTotal} ejercicios resueltos${position ? `, en el puesto ${position} del ranking global` : ''}.`;
}

async function shareResults(){
  const text = resultShareText();
  $('shareFeedback').textContent = '';
  try {
    if(navigator.share){
      await navigator.share({title:'Mi carrera en Gambito Criollo',text,url:location.href});
      $('shareFeedback').textContent = 'Resultados compartidos.';
      return;
    }
    await navigator.clipboard.writeText(`${text}\n${location.href}`);
    $('shareFeedback').textContent = 'Resultado y enlace copiados. Ya podés pegarlos en tu red social.';
  } catch(error){
    if(error?.name !== 'AbortError') $('shareFeedback').textContent = 'No se pudo abrir el menú para compartir. Copiá el enlace desde la barra del navegador.';
  }
}

async function ending(){
  screens('ending');
  $('endingTitle').textContent = state.level >= 10 ? 'La corona queda en casa' : state.level >= 8 ? 'Entre los mejores del mundo' : 'Una carrera con carácter';
  $('endingText').textContent = `${displayName()} cierra diez temporadas en el nivel ${state.level}, con ${state.wins} de ${state.exerciseTotal} ejercicios resueltos, ${currentElo()} de ELO final y un máximo de ${state.maxElo}.`;
  $('shareFeedback').textContent = '';
  stats();
  try {
    if(!latestGlobalStats){
      const result = await serverAction('stats');
      applyServerState(result.state);
      latestGlobalStats = result.stats;
    }
    renderGlobalStats(latestGlobalStats);
  } catch(error){
    renderGlobalStats(null);
    $('playerPlacement').textContent = 'Ranking no disponible';
    $('playerPercentile').textContent = error.message;
  }
}

function showServerError(error){
  screens('result');
  showAchievement(null);
  $('resultTag').textContent = 'Conexión con el servidor';
  $('resultTitle').textContent = 'No pudimos validar la jugada';
  $('resultText').textContent = `${error.message} El progreso no cambió.`;
  $('next').textContent = 'Reintentar →';
  $('next').onclick = () => { $('next').textContent = 'Continuar →'; route(); };
}

function reset(){
  if(!confirm('¿Borrar el progreso y comenzar de nuevo?')) return;
  localStorage.removeItem(GAME_KEY);
  location.reload();
}

function playAgain(){ localStorage.removeItem(GAME_KEY); location.reload(); }

$('start').onsubmit = async event => {
  event.preventDefault();
  const name = $('name').value.trim();
  const button = $('start').querySelector('button');
  button.disabled = true; button.textContent = 'Conectando…';
  $('startFeedback').textContent = '';
  try {
    const result = await serverAction('start',{name});
    state = {...state,name,serverSessionId:result.state.id};
    applyServerState(result.state);
    await enterGame();
  } catch(error){
    $('startFeedback').textContent = error.message;
    button.disabled = false; button.textContent = 'Empezar →';
  }
};
$('reset').onclick = reset;
$('again').onclick = playAgain;
$('share').onclick = shareResults;

const saved = localStorage.getItem(GAME_KEY);
if(saved){
  try {
    state = {...state, ...JSON.parse(saved)};
    if(state.name && state.serverSessionId){
      serverAction('current').then(result => {
        applyServerState(result.state);
        enterGame();
      }).catch(() => localStorage.removeItem(GAME_KEY));
    }
  }
  catch { localStorage.removeItem(GAME_KEY); }
}
