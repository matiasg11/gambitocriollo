import { Chess } from 'https://cdn.jsdelivr.net/npm/chess.js@1.4.0/+esm';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import html2canvas from 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/+esm';
import { exercises } from './exercises.js?v=1.7.0';
import { debugExercises } from './debug-exercises.js';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './backend-config.js';
import { MAX_LEVEL, START_LEVEL, baseElo, maxElo, scoreElo, levelStageName } from './game-config.js?v=1.7.0';
import { seasonScreen } from './season-screens.js';
import { COUNTRIES, countryLabel } from './countries.js';

const GAME_KEY = 'gambito-v6';
const VISITOR_KEY = 'gambito-visitor-v1';
const CLIENT_VERSION = '1.8.0';
const GAME_URL = 'https://cienciadelfindelmundo.com.ar/ajedrez/';
const pieceName = { k:'rey', q:'dama', r:'torre', b:'alfil', n:'caballo', p:'peón' };
const $ = id => document.getElementById(id);
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

let state = {
  name:'', countryCode:'', season:1, level:START_LEVEL, wins:0, decisionElo:0, exerciseElo:0, chessTitle:'',
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
let endingScreenshotFile = null;
let endingScreenshotPromise = null;
let historicalRanking = [];
let historicalRankingLoaded = false;
let historicalRankingSort = {key:'position',direction:'asc'};
let rankingPreviousScreen = {welcome:true,game:false};
const eventPrefetches = new Map();
let currentRealStory = null;
let currentEventImage = '';

function renderEventImage(value){
  const wrap = $('eventImageWrap');
  const image = $('eventImage');

  if(!wrap || !image) return;

  const src = String(value || '').trim();

  if(!src){
    wrap.hidden = true;
    image.removeAttribute('src');
    image.alt = '';
    return;
  }

  image.src = src;
  image.alt = 'Imagen relacionada con la situación';
  wrap.hidden = false;
}

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
  const localOnly = {
    introsSeen:state.introsSeen,
  };
  state = {...state,...serverState,...localOnly,serverSessionId:serverState.id};
  attempts = state.exerciseAttempts ?? attempts;
  persist();
  stats();
}

function isDebug(){ return state.name.trim().toUpperCase() === 'BOCA'; }
function currentElo(){ return scoreElo(state.level,state.decisionElo,state.exerciseElo); }
function displayName(){ return `${state.chessTitle ? state.chessTitle + ' ' : ''}${state.name}`; }
function shareSummaryText(){
  const title = state.chessTitle ? `Título ${state.chessTitle}` : `Nivel ${state.level}`;
  return `${displayName()} terminó Ajedrez del Fin del Mundo · ${title} · ${state.wins}/${state.exerciseTotal} ejercicios · ${state.decisionPositive}/${state.decisionTotal} decisiones favorables · ${currentElo()} ELO`;
}
function shareInviteText(){
  return `${shareSummaryText()}\n\n¿Hasta dónde llegás vos? Jugá acá:`;
}
function stageName(){ return levelStageName(state.season,state.level) ?? seasonScreen(state.season).title; }
function safeSpotifyUrl(value){
  try {
    const url = new URL(String(value || ''));
    const hostname = url.hostname.toLowerCase();
    return url.protocol === 'https:' && (hostname === 'open.spotify.com' || hostname === 'spotify.link') ? url.href : '';
  } catch { return ''; }
}

function normalizeRealStory(value){
  if(!value || typeof value !== 'object') return null;

  const title =
    String(value.title ?? value.subtitle ?? value.name ?? '').trim();

  const description =
    String(value.description ?? value.text ?? '').trim();

  const spotifyUrl =
    safeSpotifyUrl(value.spotifyUrl ?? value.spotify ?? '');

  const image =
    String(value.image ?? '').trim();

  if(!title && !description && !spotifyUrl && !image) return null;

  return {
    title,
    description,
    spotifyUrl,
    image
  };
}

function hideRealStory(){
  const box = $('realStory');
  const list = $('realStoryList');
  if(!box || !list) return;

  box.hidden = true;
  list.innerHTML = '';
}

function renderRealStory(value, fallbackImage = ''){
  const story = normalizeRealStory(value);

  if(!story){
    hideRealStory();
    return;
  }
  const storyImage =
  story.image || String(fallbackImage || '').trim();
  
  const box = $('realStory');
  const list = $('realStoryList');

  if(!box || !list) return;

  const kicker = box.querySelector('.achievement-kicker');

  if(kicker){
    kicker.textContent = 'ESTO PASÓ REALMENTE';
  }

  list.innerHTML = '';

  const card = document.createElement('article');
  card.className = 'real-story-card';

  if(storyImage){
    const image = document.createElement('img');

    image.className = 'real-story-image';
    image.src = storyImage;

    image.alt =
      story.title ||
      'Imagen relacionada con la historia real';

    image.loading = 'lazy';

    card.appendChild(image);
  }

  const copy = document.createElement('div');
  copy.className = 'real-story-copy';

  if(story.title){
    const title = document.createElement('strong');
    title.textContent = story.title;
    copy.appendChild(title);
  }

  if(story.description){
    const description = document.createElement('span');
    description.textContent = story.description;
    copy.appendChild(description);
  }

  if(story.spotifyUrl){
    const link = document.createElement('a');

    link.className = 'spotify-link';
    link.href = story.spotifyUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Escuchar en Spotify ↗';

    copy.appendChild(link);
  }

  card.appendChild(copy);
  list.appendChild(card);

  box.hidden = false;
}

function persist(){ localStorage.setItem(GAME_KEY, JSON.stringify(state)); }
function screens(active){ ['intro','puzzle','event','result','ending'].forEach(id => $(id).hidden = id !== active); }

function eventPrefetchKey(){ return `${state.serverSessionId}:${state.season}:${state.level}`; }
function prefetchEvent(){
  if(!state.serverSessionId || state.season > 10 || state.eventsDone.includes(state.season)) return null;
  const key = eventPrefetchKey();
  if(!eventPrefetches.has(key)){
    const request = serverAction('event').then(result => {
      if(key === eventPrefetchKey()) applyServerState(result.state);
      return result;
    }).catch(error => {
      eventPrefetches.delete(key);
      throw error;
    });
    eventPrefetches.set(key,request);
  }
  return eventPrefetches.get(key);
}

function updatePeaks(){
  state.maxElo = Math.max(Number(state.maxElo) || 0, currentElo());
  state.maxLevel = Math.max(Number(state.maxLevel) || 0, state.level);
}

function stats(){
  updatePeaks();
  $('player').textContent = displayName();
  $('season').textContent = Math.min(state.season, 10);
  $('elo').textContent = currentElo();
  $('wins').textContent = state.wins;
  $('level').textContent = state.level;
  $('eloBreakdown').textContent = `Banda ${baseElo(state.level)}–${maxElo(state.level)} · Decisiones ${state.decisionElo >= 0 ? '+' : ''}${state.decisionElo} · Ejercicios +${state.exerciseElo}`;
  $('debugBadge').hidden = !isDebug();
  const done = state.seasonAnswers.length;
  $('seasonProgress').textContent = `${done}/1`;
  $('bar').style.width = `${done * 100}%`;
  $('rank').textContent = state.chessTitle === 'GM' ? 'Gran Maestro' : state.chessTitle === 'IM' ? 'Maestro Internacional' : state.chessTitle === 'FM' ? 'Maestro FIDE' : state.level >= 10 ? 'Campeón del mundo' : state.level === 9 ? 'Retador mundial' : state.level === 8 ? 'Candidato' : state.level >= 5 ? 'Figura nacional' : state.level >= 3 ? 'Talento regional' : 'Promesa del club';
}

async function showGameSplash(){
  const splash = $('gameSplash');

  if(!splash) return;

  splash.hidden = false;

  // Logo de presentación durante 3 segundos.
  await new Promise(resolve => setTimeout(resolve, 3000));

  splash.classList.add('leaving');

  await new Promise(resolve => setTimeout(resolve, 450));

  splash.hidden = true;
  splash.classList.remove('leaving');
}

async function enterGame(){
  $('welcome').hidden = true;
  $('game').hidden = false;

  stats();

  await showGameSplash();

  await route();
}

function findExerciseById(id){
  const source = isDebug() ? debugExercises : exercises;
  return source.find(item => (item.id || item.source.split('/').pop()) === id);
}

async function route(){
  if(state.season > 10) return state.completed ? ending() : showEvent(true);
  if(!state.introsSeen.includes(state.season)){
    screens('intro');
    const screen = seasonScreen(state.season);
    const introText = value => String(value ?? '').replaceAll('{season}',state.season).replaceAll('{level}',state.level);
    $('chapter').textContent = introText(screen.chapter);
    $('introTitle').textContent = stageName();
    $('introText').textContent = introText(screen.text);
    $('continue').textContent = introText(screen.buttonLabel);
    void prefetchEvent()?.catch(() => {});
    $('continue').onclick = () => { state.introsSeen.push(state.season); persist(); route(); };
    return;
  }
  if(!state.eventsDone.includes(state.season)) return showEvent();
  try {
    const result = await serverAction('exercise');
    applyServerState(result.state);
    const planned = findExerciseById(result.exerciseId);
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
  $('puzzleLevel').textContent = `Temporada ${state.season} · Ejercicio único`;
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
    if(result.seasonCompleted) void prefetchEvent()?.catch(() => {});

    if(result.status === 'wrong'){
      chess = new Chess(initialPuzzleFen); step = 0; selected = null; last = []; attempts = result.attempts;
      feedback(`❌ ¡INCORRECTO! Te quedan ${attempts} intentos. La posición vuelve al inicio.`, 'bad');
      render();
      return;
    }

    if(result.stats) latestGlobalStats = result.stats;
    persist();

    if(result.status === 'failed'){
      chess = new Chess(initialPuzzleFen); step = 0; selected = null; last = []; attempts = 0;
      render();
      feedback(`❌ SIN INTENTOS. Solución: ${result.solution}. ${result.explanation}`, 'bad');
      $('hint').textContent = 'Continuar';
      $('hint').onclick = () => finishExercise(result);
      return;
    }

    if(!move) throw new Error('El servidor aceptó una jugada que el tablero local no pudo reproducir.');
    last = [move.from,move.to];
    step++;
    attempts = attemptsBefore;
    feedback('✅ ¡CORRECTO! Calculando la respuesta del rival…','good');
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
    feedback(`✅ ¡RESUELTO! Lo lograste en el ${4 - attemptsBefore}.º intento. +${result.reward} ELO. ${result.explanation}`,'good');
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
  persist();
  stats();
  screens('result');
  hideRealStory();
  $('resultTag').textContent = `Temporada ${completedSeason} completada · ${correct}/1 ${correct === 1 ? 'correcto' : 'correctos'}`;
  $('resultTitle').textContent = movement === 'up' ? `Subís al nivel ${state.level}` : `Te mantenés en el nivel ${state.level}`;
  $('resultText').textContent = correct === 1 && previousLevel < MAX_LEVEL
    ? 'Resolviste el ejercicio y avanzás un nivel.'
    : correct === 1
      ? 'Resolviste el ejercicio y revalidás tu lugar en la cima.'
      : 'El ejercicio quedó sin resolver. Conservás tu nivel para la próxima temporada.';
  if(completedSeason === 10){
    $('resultTitle').textContent = 'Completaste la última temporada';
    $('resultText').textContent += ' Solo queda una decisión para cerrar tu carrera.';
    $('next').textContent = 'Ir al dilema final →';
  } else {
    $('next').textContent = 'Continuar →';
  }
  $('next').onclick = () => route();
}

async function showEvent(finalEvent = false){
  currentRealStory = null;
  currentEventImage = '';
  renderEventImage('');
  screens('event');
  const box = $('eventChoices');
  box.innerHTML = '<p>El servidor está preparando la situación…</p>';
  $('eventLongText').textContent = '';
  $('eventLongText').hidden = true;
  $('eventSpotify').hidden = true;
  $('eventSpotify').removeAttribute('href');
  try {
    const result = await (finalEvent ? serverAction('final-event') : (prefetchEvent() || serverAction('event')));
    applyServerState(result.state);
    const event = result.event;
    currentEventImage = event.image ?? '';
    renderEventImage(currentEventImage);
    currentRealStory = event.realStory ?? null;
    $('eventTag').textContent = finalEvent ? 'Dilema final · La última decisión' : `Temporada ${state.season} · Situación de carrera`;
    $('eventTitle').textContent = event.title;
    $('eventText').textContent = event.text;
    const longText = String(event.longText || '').trim();
    $('eventLongText').textContent = longText;
    $('eventLongText').hidden = !longText;
    const spotifyUrl = safeSpotifyUrl(event.spotifyUrl);
    $('eventSpotify').hidden = !spotifyUrl;
    if(spotifyUrl){
      $('eventSpotify').href = spotifyUrl;
      $('eventSpotify').textContent = event.spotifyLabel || 'Escuchar la columna de Ciencia del Fin del Mundo en Spotify ↗';
    } else {
      $('eventSpotify').removeAttribute('href');
    }
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
    persist();
    screens('result');
    renderRealStory(
      currentRealStory,
      currentEventImage
    );

    currentRealStory = null;
    currentEventImage = '';
    $('resultTag').textContent = result.success ? 'La decisión funciona' : 'La carrera se complica';
    $('resultTitle').textContent = result.outcome.title;
    $('resultText').textContent = `${result.outcome.text} Impacto: ${result.change >= 0 ? '+' : ''}${result.change} ELO.`;
    $('next').textContent = state.completed ? 'Finalizar Carrera' : 'Continuar →';
    $('next').onclick = () => route();
  } catch(error){
    buttons.forEach(button => button.disabled = false);
    showServerError(error);
  }
}

function feedback(text, kind){ $('feedback').textContent = text; $('feedback').className = `feedback ${kind}`; }

function appendRankingRows(body,entries,current){
  body.innerHTML = '';
  entries.forEach(entry => {
    const row = document.createElement('tr');
    if(current && entry.position === current.position) row.className = 'current-player';
    if(entry.position === 1) row.classList.add('ranking-winner');
    [entry.position,entry.name,countryLabel(entry.countryCode),entry.elo,entry.level,`${entry.decisionPositive}/${entry.decisionTotal}`,`${entry.exercisePositive}/${entry.exerciseTotal}`].forEach(value => {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.appendChild(cell);
    });
    body.appendChild(row);
  });
  if(!entries.length){
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 7; cell.textContent = 'Todavía no hay carreras clasificadas.';
    row.appendChild(cell); body.appendChild(row);
  }
}

function rankingMetric(entry,key){
  if(key === 'position' || key === 'elo' || key === 'level') return Number(entry[key]) || 0;
  if(key === 'name') return String(entry.name || '');
  if(key === 'country') return countryLabel(entry.countryCode);
  if(key === 'decisions') return entry.decisionTotal ? entry.decisionPositive / entry.decisionTotal : -1;
  if(key === 'exercises') return entry.exerciseTotal ? entry.exercisePositive / entry.exerciseTotal : -1;
  return 0;
}

function renderHistoricalRanking(){
  const {key,direction} = historicalRankingSort;
  const multiplier = direction === 'asc' ? 1 : -1;
  const entries = [...historicalRanking].sort((a,b) => {
    const left = rankingMetric(a,key);
    const right = rankingMetric(b,key);
    const comparison = typeof left === 'string'
      ? left.localeCompare(right,'es',{sensitivity:'base'})
      : left - right;
    return comparison * multiplier || a.position - b.position;
  });
  appendRankingRows($('historyRankingBody'),entries,null);
  document.querySelectorAll('[data-ranking-sort]').forEach(button => {
    const active = button.dataset.rankingSort === key;
    const arrow = button.querySelector('span');
    arrow.textContent = active ? (direction === 'asc' ? '↑' : '↓') : '↕';
    button.closest('th').setAttribute('aria-sort',active ? (direction === 'asc' ? 'ascending' : 'descending') : 'none');
  });
}

async function openHistoricalRanking(){
  if(!$('historyRanking').hidden) return;
  rankingPreviousScreen = {welcome:!$('welcome').hidden,game:!$('game').hidden};
  $('welcome').hidden = true;
  $('game').hidden = true;
  $('historyRanking').hidden = false;
  window.scrollTo({top:0,behavior:'smooth'});
  if(historicalRankingLoaded) return;
  $('historyRankingFeedback').hidden = false;
  $('historyRankingFeedback').textContent = 'Cargando ranking…';
  try {
    const result = await serverAction('ranking');
    historicalRanking = result.ranking || [];
    historicalRankingLoaded = true;
    renderHistoricalRanking();
    document.querySelector('.history-table-wrap').hidden = false;
    $('historyRankingFeedback').hidden = true;
  } catch(error){
    $('historyRankingFeedback').textContent = `No se pudo cargar el ranking. ${error.message}`;
  }
}

function closeHistoricalRanking(){
  $('historyRanking').hidden = true;
  $('welcome').hidden = !rankingPreviousScreen.welcome;
  $('game').hidden = !rankingPreviousScreen.game;
}

function sortHistoricalRanking(event){
  const key = event.currentTarget.dataset.rankingSort;
  historicalRankingSort = historicalRankingSort.key === key
    ? {key,direction:historicalRankingSort.direction === 'asc' ? 'desc' : 'asc'}
    : {key,direction:['name','country'].includes(key) ? 'asc' : 'desc'};
  renderHistoricalRanking();
}

function renderLeaderboard(globalStats){
  const current = globalStats?.currentPlayer;
  appendRankingRows($('leaderboardBody'),globalStats?.leaderboard || [],current);
  appendRankingRows($('nearbyLeaderboardBody'),globalStats?.nearby || [],current);
  $('nearbyLeaderboard').hidden = !current || !(globalStats?.nearby?.length);
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
    $('sharePlacement').textContent = 'Carrera completada · Modo debug';
  } else if(current){
    $('playerPlacement').textContent = `Puesto ${current.position} de ${current.rankedPlayers}`;
    $('playerPercentile').textContent = `Superaste al ${current.percentile}% de los jugadores clasificados.`;
    $('sharePlacement').textContent = `Puesto ${current.position} · Top ${Math.max(1,100-current.percentile)}%`;
  } else {
    $('playerPlacement').textContent = 'Sin clasificación';
    $('playerPercentile').textContent = 'No se pudo ubicar esta carrera.';
    $('sharePlacement').textContent = 'Carrera completada';
  }
  renderHistogram(globalStats);
  renderLeaderboard(globalStats);
}

function canvasBlob(canvas){
  return new Promise((resolve,reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('La captura quedó vacía.')), 'image/png'));
}

async function prepareEndingScreenshot(){
  if(endingScreenshotPromise) return endingScreenshotPromise;
  const button = $('share');
  endingScreenshotFile = null;
  button.disabled = true;
  button.textContent = 'Preparando captura…';
  delete button.dataset.screenshotReady;
  endingScreenshotPromise = (async () => {
    if(document.fonts?.ready) await document.fonts.ready;
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const background = getComputedStyle(document.body).backgroundColor || '#f3ead7';
    const canvas = await html2canvas($('shareCard'), {
      backgroundColor: background,
      scale: Math.min(2,window.devicePixelRatio || 1),
      useCORS: true,
      logging: false,
      scrollX: 0,
      scrollY: -window.scrollY,
    });
    const blob = await canvasBlob(canvas);
    endingScreenshotFile = new File([blob], 'Ajedrez-del-Fin-del-Mundo-resultado.png', {type:'image/png'});
    button.dataset.screenshotReady = 'true';
    return endingScreenshotFile;
  })().catch(error => {
    console.error('No se pudo preparar la captura final.',error);
    $('shareFeedback').textContent = 'No pudimos preparar la captura. Podés volver a intentar compartir.';
    endingScreenshotPromise = null;
    return null;
  }).finally(() => {
    button.disabled = false;
    button.textContent = 'Guardar imagen';
  });
  return endingScreenshotPromise;
}

function downloadScreenshot(file){
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  link.hidden = true;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url),1000);
}

async function shareResults(){
  $('shareFeedback').textContent = '';
  try {
    const file = endingScreenshotFile;
    if(!file){
      $('shareFeedback').textContent = 'La captura todavía se está preparando. Probá nuevamente en un instante.';
      prepareEndingScreenshot();
      return;
    }
    const shareText = shareInviteText();
    const shareData = {title:'Mi carrera en Ajedrez del Fin del Mundo',text:shareText,url:GAME_URL,files:[file]};
    if(navigator.share && navigator.canShare?.({files:[file]})){
      await navigator.share(shareData);
      $('shareFeedback').textContent = 'Captura, texto y enlace compartidos.';
      return;
    }
    downloadScreenshot(file);
    await navigator.clipboard.writeText(`${shareText}\n${GAME_URL}`);
    $('shareFeedback').textContent = 'Descargamos la captura y copiamos el texto con el enlace. Adjuntá la imagen en tu red social.';
  } catch(error){
    if(error?.name !== 'AbortError') $('shareFeedback').textContent = 'No se pudo compartir. Probá nuevamente o guardá la captura desde otro navegador.';
  }
}

async function shareToInstagram(){
  $('shareFeedback').textContent = '';
  const file = endingScreenshotFile || await prepareEndingScreenshot();
  if(!file) return;
  try {
    if(navigator.share && navigator.canShare?.({files:[file]})){
      await navigator.share({files:[file],title:'Mi carrera en Ajedrez del Fin del Mundo'});
      $('shareFeedback').textContent = 'Elegí Instagram y luego Historias para publicar tu resultado.';
      return;
    }
    downloadScreenshot(file);
    await navigator.clipboard?.writeText(`${shareInviteText()}\n${GAME_URL}`);
    $('shareFeedback').textContent = 'Guardamos la imagen. Abrí Instagram, creá una historia y agregala; el enlace quedó copiado.';
  } catch(error){
    if(error?.name !== 'AbortError') $('shareFeedback').textContent = 'No se pudo abrir el menú para compartir. Probá con “Guardar imagen”.';
  }
}

async function shareToWhatsapp(){
  $('shareFeedback').textContent = '';
  const file = endingScreenshotFile || await prepareEndingScreenshot();
  if(!file) return;
  try {
    if(navigator.share && navigator.canShare?.({files:[file]})){
      await navigator.share({files:[file],title:'Mi carrera en Ajedrez del Fin del Mundo',text:shareInviteText(),url:GAME_URL});
      $('shareFeedback').textContent = 'Elegí WhatsApp y el chat donde querés compartir el desafío.';
      return;
    }
    downloadScreenshot(file);
    window.open(`https://wa.me/?text=${encodeURIComponent(`${shareInviteText()}\n${GAME_URL}`)}`,'_blank','noopener,noreferrer');
    $('shareFeedback').textContent = 'Abrimos WhatsApp con el desafío y guardamos la imagen para que puedas adjuntarla.';
  } catch(error){
    if(error?.name !== 'AbortError') $('shareFeedback').textContent = 'No se pudo abrir WhatsApp. Probá con “Guardar imagen”.';
  }
}

function setupShareUI(){
  const cardFooter = document.createElement('div');
  cardFooter.className = 'career-card-footer';
  cardFooter.innerHTML = '<div class="career-card-cta"><small id="sharePlacement">Carrera completada</small><strong>¿Hasta dónde llegás vos?</strong><span>Jugá en cienciadelfindelmundo.com.ar/ajedrez</span></div>';
  cardFooter.prepend($('endingText'));
  $('shareCard').append(cardFooter);
  const actions = document.querySelector('.ending-actions');
  actions.insertAdjacentHTML('beforebegin','<div class="share-panel" data-html2canvas-ignore="true"><div class="share-panel-copy"><span>Compartí tu resultado</span><strong>Desafiá a tus amigos</strong><small>La imagen incluye tu carrera y el enlace para jugar.</small></div><div class="share-social-actions"><button id="shareInstagram" class="social-share instagram-share" type="button" aria-label="Compartir en Instagram Stories"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4.25"></circle><circle class="social-icon-dot" cx="17.4" cy="6.7" r="1"></circle></svg><span><small>Compartir en</small>Instagram Stories</span></button><button id="shareWhatsapp" class="social-share whatsapp-share" type="button" aria-label="Compartir en WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.7a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.4-4.9a8.4 8.4 0 1 1 16.1-3.9Z"></path><path d="M8.2 7.8c.2-.5.5-.5.8-.5h.4c.2 0 .4 0 .6.4l.8 1.9c.1.3.1.5-.1.7l-.6.8c-.2.2-.2.4 0 .7.5.9 1.2 1.7 2.1 2.3.8.5 1.4.7 1.7.8.3.1.5 0 .7-.2l.9-1c.2-.3.5-.3.7-.2l1.9.9c.3.1.4.3.4.5 0 .2-.1 1.2-.7 1.8-.6.6-1.5.9-2.5.7-1-.2-2.3-.7-4-1.6-2.4-1.3-3.9-3.7-4.1-4-.2-.3-1-1.5-1-2.8 0-1.3.7-2 1-2.2Z"></path></svg><span><small>Compartir en</small>WhatsApp</span></button></div></div>');
  $('share').textContent = 'Guardar imagen';
  $('share').classList.add('share-download');
  $('shareInstagram').onclick = shareToInstagram;
  $('shareWhatsapp').onclick = shareToWhatsapp;
}

async function ending(){
  screens('ending');
  endingScreenshotFile = null;
  endingScreenshotPromise = null;
  const titleNames = {FM:'Maestro FIDE',IM:'Maestro Internacional',GM:'Gran Maestro'};
  $('endingTitle').textContent = state.level >= 10 ? 'La corona queda en casa' : state.level >= 8 ? 'Entre los mejores del mundo' : 'Una carrera con carácter';
  $('finalPlayerName').textContent = displayName();
  $('finalChessTitle').textContent = state.chessTitle || '—';
  $('finalTitleName').textContent = titleNames[state.chessTitle] || 'Sin título oficial';
  $('finalExerciseScore').textContent = `${state.wins}/${state.exerciseTotal}`;
  $('finalDecisionScore').textContent = `${state.decisionPositive}/${state.decisionTotal}`;
  $('finalElo').textContent = currentElo();
  $('finalLevel').textContent = `Nivel ${state.level} · Máximo ${state.maxElo}`;
  $('endingText').textContent = 'Diez temporadas, veinte ejercicios y cada decisión tomada dentro y fuera del tablero.';
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
  await prepareEndingScreenshot();
}

function showServerError(error){
  screens('result');
  hideRealStory();
  currentRealStory = null;
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
  const countryCode = $('country').value;
  const button = $('start').querySelector('button');
  button.disabled = true; button.textContent = 'Conectando…';
  $('startFeedback').textContent = '';
  try {
    const result = await serverAction('start',{name,countryCode});
    state = {...state,name,countryCode,serverSessionId:result.state.id};
    applyServerState(result.state);
    await enterGame();
  } catch(error){
    $('startFeedback').textContent = error.message;
    button.disabled = false; button.textContent = 'Empezar →';
  }
};
COUNTRIES.forEach(country => {
  const option = document.createElement('option');
  option.value = country.code;
  option.textContent = `${country.flag} ${country.name}`;
  $('country').appendChild(option);
});
$('country').value = 'AR';
$('reset').onclick = reset;
$('again').onclick = playAgain;
$('openRanking').onclick = openHistoricalRanking;
$('closeRanking').onclick = closeHistoricalRanking;
document.querySelectorAll('[data-ranking-sort]').forEach(button => button.onclick = sortHistoricalRanking);
setupShareUI();
$('share').onclick = shareResults;

// const saved = localStorage.getItem(GAME_KEY);
// if(saved){
//   try {
//     state = {...state, ...JSON.parse(saved)};
//     if(state.name && state.serverSessionId){
//       serverAction('current').then(result => {
//         applyServerState(result.state);
//         enterGame();
//       }).catch(() => localStorage.removeItem(GAME_KEY));
//     }
//   }
//   catch { localStorage.removeItem(GAME_KEY); }
// }
// Cada vez que se abre la web, la carrera comienza desde cero.
// Esto NO afecta el autocompletado del navegador.
localStorage.removeItem(GAME_KEY);
// Si el navegador restaura la página desde su caché de navegación,
// forzamos una carga nueva para no volver a una partida empezada.
window.addEventListener('pageshow', event => {
  if(event.persisted){
    localStorage.removeItem(GAME_KEY);
    location.reload();
  }
});
