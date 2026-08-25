import { exercises } from '../exercises.js';
import { EXERCISE_RATING_RANGES, MAX_LEVEL, MIN_LEVEL } from '../game-config.js';

const EXPECTED_PER_LEVEL = 100;
const MAX_PLAYER_MOVES = 3;
const failures = [];
const ids = new Set();
const report = {};

function playerMoveCount(exercise) {
  if (exercise.moves) {
    const tokens = exercise.moves.trim().split(/\s+/).filter(Boolean);
    return Math.ceil((tokens.length - 1) / 2);
  }
  const tokens = exercise.solution.replaceAll('/', ' ').trim().split(/\s+/).filter(Boolean);
  return Math.ceil(tokens.length / 2);
}

for (let level = MIN_LEVEL; level <= MAX_LEVEL; level++) {
  const range = EXERCISE_RATING_RANGES[level];
  const rows = exercises.filter(exercise => exercise.level === level);
  const ratings = rows.map(exercise => exercise.rating);
  const longest = Math.max(...rows.map(playerMoveCount));
  const maximumPredrawnUses = MAX_LEVEL + 1 - level;
  report[level] = {
    count: rows.length,
    ratingMin: Math.min(...ratings),
    ratingMax: Math.max(...ratings),
    maxPlayerMoves: longest,
    maximumPredrawnUses,
    repeatFreeCapacity: rows.length >= maximumPredrawnUses,
  };

  if (rows.length !== EXPECTED_PER_LEVEL) {
    failures.push(`Nivel ${level}: ${rows.length} ejercicios; se esperaban ${EXPECTED_PER_LEVEL}.`);
  }
  if (rows.length < maximumPredrawnUses) {
    failures.push(`Nivel ${level}: no alcanza para presortear ${maximumPredrawnUses} ejercicios sin repetir.`);
  }
  for (const exercise of rows) {
    if (exercise.rating < range.min || exercise.rating > range.max) {
      failures.push(`Nivel ${level}: ${exercise.id} tiene rating ${exercise.rating}, fuera de ${range.min}-${range.max}.`);
    }
    if (playerMoveCount(exercise) > MAX_PLAYER_MOVES) {
      failures.push(`Nivel ${level}: ${exercise.id} exige más de ${MAX_PLAYER_MOVES} jugadas del jugador.`);
    }
    if (ids.has(exercise.id)) failures.push(`ID repetido: ${exercise.id}.`);
    ids.add(exercise.id);
  }
}

if (ids.size !== exercises.length) failures.push('El banco contiene IDs repetidos entre niveles.');
console.log(JSON.stringify({ total: exercises.length, uniqueIds: ids.size, perLevel: report }, null, 2));
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
}
