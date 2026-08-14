/**
 * Importa 100 ejercicios por nivel desde la base oficial CC0 de Lichess.
 * Requiere una versión de Node con soporte Zstandard en node:zlib.
 *
 * Uso: guardá lichess_db_puzzle.csv.zst dentro de data y ejecutá:
 *   node scripts/import-lichess-puzzles.mjs
 */
import { createInterface } from 'node:readline';
import { createZstdDecompress } from 'node:zlib';
import { createReadStream } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SOURCE_URL = 'https://database.lichess.org/lichess_db_puzzle.csv.zst';
const PER_LEVEL = 100;
const MAX_PLAYER_MOVES = 3;
const PINNED_PUZZLE_IDS = new Set(['00Zit']);
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const localArchive = resolve(projectRoot, 'data', 'lichess_db_puzzle.csv.zst');

const { EXERCISE_RATING_RANGES } = await import('../game-config.js');
const buckets = Object.fromEntries(
  Object.keys(EXERCISE_RATING_RANGES).map(level => [level, []]),
);

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = '';
  let quoted = false;
  for (let index = 0; index < text.length; index++) {
    const character = text[index];
    if (character === '"') {
      if (quoted && text[index + 1] === '"') {
        value += '"';
        index++;
      } else {
        quoted = !quoted;
      }
    } else if (character === ',' && !quoted) {
      row.push(value);
      value = '';
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && text[index + 1] === '\n') index++;
      row.push(value);
      if (row.some(cell => cell !== '')) rows.push(row);
      row = [];
      value = '';
    } else {
      value += character;
    }
  }
  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }
  return rows;
}

function rangeForRating(rating) {
  return Object.entries(EXERCISE_RATING_RANGES).find(([, range]) =>
    rating >= range.min && rating <= range.max
  );
}

const legacyCsv = await readFile(resolve(projectRoot, 'data', 'ejercicios_ajedrez_30.csv'), 'utf8');
const legacyExercises = parseCsv(legacyCsv).slice(1).map(columns => {
  const [, , ratingText, title, objective, fen, solution, , explanation, hint, source] = columns;
  const rating = Number(ratingText);
  const target = rangeForRating(rating);
  if (!target) return null;
  const [levelText, range] = target;
  return {
    id: source.split('/').pop(),
    level: Number(levelText),
    range: `${range.min}–${range.max}`,
    rating,
    title,
    objective,
    fen,
    solution,
    explanation,
    hint,
    source,
    legacy: true,
  };
}).filter(Boolean).filter(exercise => {
  const tokenCount = exercise.solution.replaceAll('/', ' ').trim().split(/\s+/).filter(Boolean).length;
  return Math.ceil(tokenCount / 2) <= MAX_PLAYER_MOVES;
});

const themeLabels = [
  ['mateIn1', ['Mate en 1', 'Da jaque mate en una jugada.', 'Revisá todos los jaques disponibles.']],
  ['mateIn2', ['Mate en 2', 'Encontrá la secuencia de mate en dos.', 'Calculá el jaque y la única defensa rival.']],
  ['mateIn3', ['Mate en 3', 'Encontrá la secuencia de mate en tres.', 'Buscá una cadena forzada de jaques.']],
  ['mateIn4', ['Mate en 4', 'Encontrá la secuencia de mate en cuatro.', 'Calculá primero jaques, capturas y amenazas.']],
  ['fork', ['Doble ataque', 'Creá dos amenazas al mismo tiempo.', 'Buscá una jugada que ataque dos objetivos.']],
  ['pin', ['Clavada', 'Aprovechá una pieza que no puede moverse.', 'Identificá qué pieza protege algo más valioso.']],
  ['skewer', ['Enfilada', 'Atacá dos piezas alineadas.', 'Observá filas, columnas y diagonales.']],
  ['discoveredAttack', ['Ataque descubierto', 'Liberá una línea de ataque decisiva.', 'Pensá qué pieza puede moverse ganando un tiempo.']],
  ['deflection', ['Desviación', 'Alejá una pieza defensora de su tarea.', 'Encontrá al defensor que sostiene la posición.']],
  ['attraction', ['Atracción', 'Atraé una pieza hacia una casilla vulnerable.', 'Buscá una captura o amenaza que fuerce la respuesta.']],
  ['sacrifice', ['Sacrificio', 'Entregá material para obtener una ventaja decisiva.', 'Calculá más allá de la primera captura.']],
  ['promotion', ['Promoción', 'Conseguí coronar el peón.', 'Revisá jaques intermedios y carreras de peones.']],
  ['endgame', ['Final', 'Encontrá la continuación precisa del final.', 'Contá tiempos y casillas clave.']],
];

function presentation(themes, side) {
  const match = themeLabels.find(([theme]) => themes.includes(theme));
  const [title, objective, hint] = match?.[1] ?? [
    'Ventaja decisiva',
    'Encontrá la mejor continuación de la posición.',
    'Empezá por jaques, capturas y amenazas directas.',
  ];
  return { title: `${title} — juegan ${side}`, objective, hint };
}

const useLocalArchive = true;
let compressed = createReadStream(localArchive);
// El archivo oficial empieza con un skippable frame de Zstandard de 12 bytes.
// Node no lo salta automáticamente, por eso adelantamos el stream local.
compressed.close();
compressed = createReadStream(localArchive, { start: 12 });
const decompressed = compressed.pipe(createZstdDecompress());
const lines = createInterface({ input: decompressed, crlfDelay: Infinity });
let selectionComplete = false;
decompressed.on('error', error => {
  if (!selectionComplete) console.error(`Error al descomprimir la base de Lichess: ${error.message}`);
});

let inspected = 0;
const selectedIds = new Set();
const pinnedExercises = new Map();
for await (const line of lines) {
  if (!line || line.startsWith('PuzzleId,')) continue;
  inspected++;
  const fields = line.split(',');
  if (fields.length < 9) continue;

  const [id, fen, moves, ratingText, deviationText, popularityText, playsText, themesText] = fields;
  if (selectedIds.has(id)) continue;
  const rating = Number(ratingText);
  const deviation = Number(deviationText);
  const popularity = Number(popularityText);
  const plays = Number(playsText);
  const target = rangeForRating(rating);
  if (!target) continue;

  const moveTokens = moves.trim().split(/\s+/).filter(Boolean);
  const playerMoveCount = Math.ceil((moveTokens.length - 1) / 2);
  if (playerMoveCount < 1 || playerMoveCount > MAX_PLAYER_MOVES) continue;

  const [levelText, range] = target;
  const level = Number(levelText);
  const pinned = PINNED_PUZZLE_IDS.has(id);
  if (buckets[level].length >= PER_LEVEL && !pinned) continue;
  if (deviation > 100 || popularity < 80 || plays < 50) continue;

  const themes = themesText.split(/\s+/).filter(Boolean);
  const turnBeforeOpponentMove = fen.split(' ')[1];
  const solverSide = turnBeforeOpponentMove === 'w' ? 'negras' : 'blancas';
  const copy = presentation(themes, solverSide);
  const exercise = {
    id,
    level,
    range: `${range.min}–${range.max}`,
    rating,
    title: copy.title,
    objective: copy.objective,
    fen,
    moves,
    themes,
    explanation: `Ejercicio oficial de Lichess (${rating}): la secuencia validada convierte la táctica en una ventaja concreta.`,
    hint: copy.hint,
    source: `https://lichess.org/training/${id}`,
  };
  if (pinned) pinnedExercises.set(id, exercise);
  if (buckets[level].length < PER_LEVEL) buckets[level].push(exercise);
  selectedIds.add(id);

  if (
    Object.values(buckets).every(bucket => bucket.length === PER_LEVEL) &&
    [...PINNED_PUZZLE_IDS].every(puzzleId => pinnedExercises.has(puzzleId))
  ) {
    selectionComplete = true;
    lines.close();
    decompressed.destroy();
    compressed.destroy();
    break;
  }
}

const incomplete = Object.entries(buckets).filter(([, bucket]) => bucket.length !== PER_LEVEL);
if (incomplete.length) {
  throw new Error(`No se completaron los niveles: ${incomplete.map(([level, rows]) => `${level} (${rows.length})`).join(', ')}`);
}
const missingPinned = [...PINNED_PUZZLE_IDS].filter(id => !pinnedExercises.has(id));
if (missingPinned.length) {
  throw new Error(`No se encontraron los ejercicios fijados: ${missingPinned.join(', ')}`);
}

const allLegacyIds = new Set(legacyExercises.map(exercise => exercise.id));
const exercises = Object.entries(buckets).flatMap(([level, rows]) => {
  const legacy = legacyExercises.filter(exercise => exercise.level === Number(level));
  const pinned = [...pinnedExercises.values()].filter(exercise => exercise.level === Number(level));
  const reservedIds = new Set([...allLegacyIds, ...pinned.map(exercise => exercise.id)]);
  return [...legacy, ...pinned, ...rows.filter(exercise => !reservedIds.has(exercise.id))].slice(0, PER_LEVEL);
});
const metadata = {
  source: SOURCE_URL,
  license: 'CC0',
  importedAt: new Date().toISOString(),
  inspectedRows: inspected,
  perLevel: PER_LEVEL,
  maxPlayerMoves: MAX_PLAYER_MOVES,
  pinnedPuzzleIds: [...PINNED_PUZZLE_IDS],
  ranges: EXERCISE_RATING_RANGES,
  exercises,
};

await writeFile(
  resolve(projectRoot, 'data', 'lichess_exercises_1000.json'),
  `${JSON.stringify(metadata, null, 2)}\n`,
  'utf8',
);
const moduleSource = `// Fuente: ${SOURCE_URL} (CC0). Generado por scripts/import-lichess-puzzles.mjs.\nexport const exercises = ${JSON.stringify(exercises)};\n`;
await writeFile(resolve(projectRoot, 'exercises.js'), moduleSource, 'utf8');
await writeFile(resolve(projectRoot, 'supabase', 'functions', 'game-api', 'exercises.js'), moduleSource, 'utf8');

console.log(JSON.stringify({
  total: exercises.length,
  inspected,
  perLevel: Object.fromEntries(Object.entries(buckets).map(([level, rows]) => [level, rows.length])),
}, null, 2));
