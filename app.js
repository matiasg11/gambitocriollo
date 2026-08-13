import { Chess } from 'https://cdn.jsdelivr.net/npm/chess.js@1.4.0/+esm';
import { exercises } from './exercises.js';
import { debugExercises } from './debug-exercises.js';
import { careerEvents } from './career-events.js';

const seasons = [
  'El club de barrio',
  'Primer abierto',
  'La liga municipal',
  'El maestro visitante',
  'El Torneo Nacional',
  'Viaje al interior',
  'Circuito federal',
  'La élite internacional',
  'La cima del circuito',
  'El legado'
];

const ELO_BASE = [600,800,1200,1400,1600,2000,2200,2350,2500,2600,2750];
const pieceName = { k:'rey', q:'dama', r:'torre', b:'alfil', n:'caballo', p:'peón' };
const $ = id => document.getElementById(id);

let state = {
  name:'', season:1, level:0, wins:0, decisionElo:0, exerciseElo:0, chessTitle:'', pendingAchievement:null,
  eventsDone:[], introsSeen:[], seasonAnswers:[], eventHistory:[], currentEventId:null
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

function isDebug(){ return state.name.trim().toUpperCase() === 'BOCA'; }
function adjustedElo(ex){ return Math.round(ex.rating * 1.5); }
function currentElo(){ return ELO_BASE[state.level] + state.decisionElo + state.exerciseElo; }
function displayName(){ return `${state.chessTitle ? state.chessTitle + ' ' : ''}${state.name}`; }
function stageName(){ return state.level === 10 ? 'Defendé la corona' : state.level === 9 ? 'Campeonato del Mundo' : state.level === 8 ? 'Torneo de Candidatos' : seasons[state.season - 1]; }
function persist(){ localStorage.setItem('gambito-v4', JSON.stringify(state)); }
function screens(active){ ['intro','puzzle','event','result','ending'].forEach(id => $(id).hidden = id !== active); }

function updateChessTitle(){
  const elo = currentElo();
  if(elo >= 2500 && state.chessTitle !== 'GM'){
    state.chessTitle = 'GM';
    return {title:'¡Felicitaciones, Gran Maestro!',text:'Alcanzaste 2500 de ELO. Desde ahora tu nombre lleva el título GM.'};
  }
  if(elo >= 2400 && state.chessTitle !== 'IM'){
    state.chessTitle = 'IM';
    return {title:'¡Felicitaciones, Maestro Internacional!',text:'Alcanzaste 2400 de ELO. Desde ahora tu nombre lleva el título IM.'};
  }
  if(elo >= 2300 && !state.chessTitle){
    state.chessTitle = 'FM';
    return {title:'¡Felicitaciones, Maestro FIDE!',text:'Alcanzaste 2300 de ELO. Desde ahora tu nombre lleva el título FM.'};
  }
  return null;
}

function showAchievement(award){
  $('achievement').hidden = !award;
  if(!award) return;
  $('achievementTitle').textContent = award.title;
  $('achievementText').textContent = award.text;
}

function stats(){
  $('player').textContent = displayName();
  $('season').textContent = Math.min(state.season, 10);
  $('elo').textContent = currentElo();
  $('wins').textContent = state.wins;
  $('level').textContent = state.level;
  $('eloBreakdown').textContent = `Base ${ELO_BASE[state.level]} · Decisiones ${state.decisionElo >= 0 ? '+' : ''}${state.decisionElo} · Ejercicios +${state.exerciseElo}`;
  $('debugBadge').hidden = !isDebug();
  const done = state.seasonAnswers.length;
  $('seasonProgress').textContent = `${done}/2`;
  $('bar').style.width = `${done / 2 * 100}%`;
  $('rank').textContent = state.chessTitle === 'GM' ? 'Gran Maestro' : state.chessTitle === 'IM' ? 'Maestro Internacional' : state.level >= 10 ? 'Campeón del mundo' : state.level === 9 ? 'Retador mundial' : state.level === 8 ? 'Candidato' : state.level >= 5 ? 'Figura nacional' : state.level >= 3 ? 'Talento regional' : 'Promesa del club';
}

function enterGame(){
  $('welcome').hidden = true;
  $('game').hidden = false;
  stats();
  route();
}

function getSeasonExercises(){
  const source = isDebug() ? debugExercises : exercises;
  const exerciseLevel = Math.max(1, state.level);
  const pool = source.filter(item => item.level === exerciseLevel);
  const offset = ((state.season - 1) * 2) % pool.length;
  return [pool[offset], pool[(offset + 1) % pool.length]];
}

function route(){
  if(state.season > 10) return ending();
  if(!state.introsSeen.includes(state.season)){
    screens('intro');
    $('chapter').textContent = `Temporada ${state.season} · Nivel actual ${state.level}`;
    $('introTitle').textContent = stageName();
    $('introText').textContent = `Esta temporada tiene un dilema y dos ejercicios de nivel ${state.level}. Dos aciertos te hacen subir; uno te mantiene; dos fallos te hacen bajar.`;
    $('continue').onclick = () => { state.introsSeen.push(state.season); persist(); route(); };
    return;
  }
  if(!state.eventsDone.includes(state.season)) return showEvent();
  const plan = getSeasonExercises();
  loadPuzzle(plan[state.seasonAnswers.length]);
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
  step = 0;
  attempts = 3;
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
    button.setAttribute('aria-label', piece ? `${squareName}, ${pieceName[piece.type]} ${piece.color === 'w' ? 'blanco' : 'negro'}` : squareName);
    button.onclick = () => tap(squareName);
    board.appendChild(button);
  }));
}

function normalized(s){ return s.replace(/[+#]/g,'').replace(/[!?]/g,''); }
function matchesExpected(move, expected){
  if(solutionMode === 'san') return normalized(move.san) === normalized(expected);
  return `${move.from}${move.to}${move.promotion || ''}` === expected;
}

function tap(squareName){
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

  const expected = sequence[step];
  const expectedUci = solutionMode === 'uci' ? expected : '';
  const promotion = expectedUci.startsWith(selected + squareName) && expectedUci[4] ? expectedUci[4] : 'q';
  let move;
  try { move = chess.move({from:selected, to:squareName, promotion}); }
  catch { move = null; }

  if(!move || !matchesExpected(move, expected)) return wrong();
  last = [move.from, move.to];
  selected = null;
  step++;
  feedback('¡Buena jugada! Calculando la respuesta…', 'good');
  render();
  setTimeout(opponentOrFinish, 650);
}

function opponentOrFinish(){
  if(step >= sequence.length) return solved();
  const reply = sequence[step];
  let move;
  try { move = playToken(chess, reply, solutionMode); }
  catch { move = null; }
  if(!move){ feedback(`No se pudo reproducir la respuesta ${reply}.`, 'bad'); return; }
  last = [move.from, move.to];
  step++;
  render();
  if(step >= sequence.length) return solved();
  feedback('El rival respondió. Encontrá la continuación.', '');
}

function wrong(){
  attempts--;
  if(attempts <= 0){
    feedback(`Sin intentos. Solución: ${solutionDisplay}. ${exercise.explanation}`, 'bad');
    $('hint').textContent = 'Continuar';
    $('hint').onclick = () => finishExercise(false);
    return;
  }
  feedback(`No es la línea buscada. Te quedan ${attempts} intentos; la posición vuelve al inicio.`, 'bad');
  setTimeout(() => { chess = new Chess(initialPuzzleFen); step = 0; selected = null; last = []; render(); }, 850);
}

function solved(){
  state.wins++;
  const exerciseReward = attempts === 3 ? 25 : attempts === 2 ? 15 : 5;
  state.exerciseElo += exerciseReward;
  const award = updateChessTitle();
  if(award) state.pendingAchievement = award;
  persist();
  stats();
  feedback(`${award ? award.title + ' ' : ''}¡Resuelto en el ${4 - attempts}.º intento! +${exerciseReward} ELO. ${exercise.explanation}`, 'good');
  $('hint').textContent = 'Continuar';
  $('hint').onclick = () => finishExercise(true);
}

function finishExercise(success){
  state.seasonAnswers.push(success);
  $('hint').textContent = 'Pedir una pista';
  if(state.seasonAnswers.length < 2){ persist(); stats(); return route(); }

  const completedSeason = state.season;
  const correct = state.seasonAnswers.filter(Boolean).length;
  const previousLevel = state.level;
  if(correct === 2) state.level = Math.min(10, state.level + 1);
  if(correct === 0) state.level = Math.max(0, state.level - 1);
  const movement = state.level > previousLevel ? 'up' : state.level < previousLevel ? 'down' : 'same';
  state.season++;
  state.seasonAnswers = [];
  const levelAward = updateChessTitle();
  const award = levelAward || state.pendingAchievement;
  state.pendingAchievement = null;
  persist();
  stats();
  screens('result');
  showAchievement(award);
  $('resultTag').textContent = `Temporada ${completedSeason} completada · ${correct}/2 correctos`;
  $('resultTitle').textContent = movement === 'up' ? `Subís al nivel ${state.level}` : movement === 'down' ? `Bajás al nivel ${state.level}` : `Te mantenés en el nivel ${state.level}`;
  $('resultText').textContent = correct === 2 ? 'Resolviste los dos ejercicios y avanzás un escalón.' : correct === 1 ? 'Un acierto y un fallo: conservás tu nivel para la próxima temporada.' : previousLevel === 0 ? 'Fallaste ambos ejercicios, pero el nivel 0 es el piso de la carrera.' : 'Los dos ejercicios quedaron sin resolver y retrocedés un nivel.';
  $('next').onclick = () => route();
}

function selectCareerEvent(){
  if(state.currentEventId){
    const savedEvent = careerEvents.find(event => event.id === state.currentEventId);
    if(savedEvent) return savedEvent;
  }
  let eligible = careerEvents.filter(event =>
    state.season >= event.minSeason && state.season <= event.maxSeason &&
    state.level >= event.minLevel && state.level <= event.maxLevel &&
    !state.eventHistory.includes(event.id)
  );
  if(!eligible.length){
    eligible = careerEvents.filter(event =>
      state.season >= event.minSeason && state.season <= event.maxSeason &&
      state.level >= event.minLevel && state.level <= event.maxLevel
    );
  }
  const selectedEvent = eligible[(state.season * 7 + state.level * 3 + state.eventHistory.length) % eligible.length];
  state.currentEventId = selectedEvent.id;
  persist();
  return selectedEvent;
}

function showEvent(){
  const event = selectCareerEvent();
  screens('event');
  $('eventTag').textContent = `Temporada ${state.season} · Situación de carrera`;
  $('eventTitle').textContent = event.title;
  $('eventText').textContent = event.text;
  const box = $('eventChoices');
  box.innerHTML = '';
  event.choices.forEach(choice => {
    const button = document.createElement('button');
    button.innerHTML = `<b>${choice.label}</b><span>${choice.description}</span>`;
    button.onclick = () => resolveEvent(choice);
    box.appendChild(button);
  });
}

function resolveEvent(choice){
  const success = Math.random() * 100 < choice.chance;
  const change = success ? choice.successElo : choice.failureElo;
  state.decisionElo += change;
  if(state.currentEventId && !state.eventHistory.includes(state.currentEventId)) state.eventHistory.push(state.currentEventId);
  state.currentEventId = null;
  if(!state.eventsDone.includes(state.season)) state.eventsDone.push(state.season);
  const award = updateChessTitle();
  persist();
  stats();
  screens('result');
  showAchievement(award);
  $('resultTag').textContent = success ? 'La decisión funciona' : 'La carrera se complica';
  $('resultTitle').textContent = success ? choice.successTitle : choice.failureTitle;
  $('resultText').textContent = `${success ? choice.successText : choice.failureText} Impacto: ${change >= 0 ? '+' : ''}${change} ELO.`;
  $('next').onclick = () => route();
}

function feedback(text, kind){ $('feedback').textContent = text; $('feedback').className = `feedback ${kind}`; }

function ending(){
  screens('ending');
  $('endingTitle').textContent = state.level >= 10 ? 'La corona queda en casa' : state.level >= 8 ? 'Entre los mejores del mundo' : 'Una carrera con carácter';
  $('endingText').textContent = `${displayName()} cierra diez temporadas en el nivel ${state.level}, con ${state.wins} de 20 ejercicios resueltos y ${currentElo()} de ELO.`;
  stats();
}

function reset(){
  if(!confirm('¿Borrar el progreso y comenzar de nuevo?')) return;
  localStorage.removeItem('gambito-v4');
  location.reload();
}

$('start').onsubmit = event => {
  event.preventDefault();
  state.name = $('name').value.trim();
  persist();
  enterGame();
};
$('reset').onclick = reset;
$('again').onclick = reset;

const saved = localStorage.getItem('gambito-v4');
if(saved){
  try { state = {...state, ...JSON.parse(saved)}; if(state.name) enterGame(); }
  catch { localStorage.removeItem('gambito-v4'); }
}
