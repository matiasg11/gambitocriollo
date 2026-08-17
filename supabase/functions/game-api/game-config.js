/**
 * REGLAS EDITABLES DEL JUEGO
 *
 * Para cambiar la banda de ELO de un nivel, editá los valores mínimo y máximo.
 * Mantené los niveles del 1 al 10 y los valores en orden ascendente.
 * Después ejecutá `powershell -File scripts/sync-game-data.ps1` para copiar
 * estas reglas al validador de Supabase antes de desplegarlo.
 */
export const MIN_LEVEL = 1;
export const MAX_LEVEL = 10;
export const START_LEVEL = 1;

export const ELO_BY_LEVEL = Object.freeze({
  1: 600,
  2: 800,
  3: 1000,
  4: 1200,
  5: 1400,
  6: 1750,
  7: 1900,
  8: 2150,
  9: 2350,
  10: 2400,
});

export const MAX_ELO_BY_LEVEL = Object.freeze({
  1: 2300,
  2: 2350,
  3: 2400,
  4: 2450,
  5: 2500,
  6: 2550,
  7: 2600,
  8: 2650,
  9: 2700,
  10: 2750,
});

/**
 * RANGO DE RATING LICHESS PARA LOS EJERCICIOS
 *
 * `min` y `max` son inclusivos y se refieren al rating original de Lichess,
 * antes de multiplicarlo por 1,5 para mostrarlo dentro del juego.
 */
export const EXERCISE_RATING_RANGES = Object.freeze({
  1: Object.freeze({ min: 600, max: 799 }),
  2: Object.freeze({ min: 800, max: 999 }),
  3: Object.freeze({ min: 1000, max: 1199 }),
  4: Object.freeze({ min: 1200, max: 1399 }),
  5: Object.freeze({ min: 1400, max: 1599 }),
  6: Object.freeze({ min: 1600, max: 1749 }),
  7: Object.freeze({ min: 1750, max: 1899 }),
  8: Object.freeze({ min: 1900, max: 1999 }),
  9: Object.freeze({ min: 2000, max: 2099 }),
  10: Object.freeze({ min: 2100, max: 2200 }),
});

/**
 * NOMBRES ESPECIALES DE NIVEL
 *
 * Cada nombre aparece únicamente cuando coinciden el nivel y la temporada
 * mínima. Antes de esa temporada se conserva el título normal de la pantalla.
 */
export const LEVEL_STAGE_RULES = Object.freeze({
  5: Object.freeze({ minSeason: 6, name: 'Torneo Nacional' }),
  6: Object.freeze({ minSeason: 7, name: 'Olimpiadas de ajedrez' }),
  8: Object.freeze({ minSeason: 8, name: 'Torneo de Candidatos' }),
  9: Object.freeze({ minSeason: 9, name: 'Campeonato del Mundo' }),
  10: Object.freeze({ minSeason: 10, name: 'Defendé la corona' }),
});

export function levelStageName(season, level) {
  const rule = LEVEL_STAGE_RULES[level];
  return rule && season >= rule.minSeason ? rule.name : null;
}

export function baseElo(level) {
  return ELO_BY_LEVEL[level] ?? ELO_BY_LEVEL[START_LEVEL];
}

export function maxElo(level) {
  return MAX_ELO_BY_LEVEL[level] ?? MAX_ELO_BY_LEVEL[START_LEVEL];
}

export function scoreElo(level, decisionElo = 0, exerciseElo = 0) {
  return Math.max(baseElo(level), Math.min(maxElo(level), baseElo(level) + decisionElo + exerciseElo));
}
