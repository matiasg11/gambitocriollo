/**
 * REGLAS EDITABLES DEL JUEGO
 *
 * Para cambiar el piso de ELO de un nivel, editá solamente el número de la
 * derecha. Mantené los niveles del 1 al 10 y los valores en orden ascendente.
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
  6: 1600,
  7: 1800,
  8: 1900,
  9: 2000,
  10: 2200,
});

/**
 * RANGO DE RATING LICHESS PARA LOS EJERCICIOS
 *
 * `min` y `max` son inclusivos y se refieren al rating original de Lichess,
 * antes de multiplicarlo por 1,5 para mostrarlo dentro del juego.
 */
export const EXERCISE_RATING_RANGES = Object.freeze({
  1: Object.freeze({ min: 600, max: 799 }),
  2: Object.freeze({ min: 800, max: 899 }),
  3: Object.freeze({ min: 900, max: 999 }),
  4: Object.freeze({ min: 1000, max: 1099 }),
  5: Object.freeze({ min: 1100, max: 1199 }),
  6: Object.freeze({ min: 1200, max: 1299 }),
  7: Object.freeze({ min: 1300, max: 1399 }),
  8: Object.freeze({ min: 1400, max: 1499 }),
  9: Object.freeze({ min: 1500, max: 1599 }),
  10: Object.freeze({ min: 1600, max: 1699 }),
});

// Estos nombres reemplazan al título de temporada cuando se alcanza el nivel.
export const LEVEL_STAGE_NAMES = Object.freeze({
  8: 'Torneo de Candidatos',
  9: 'Campeonato del Mundo',
  10: 'Defendé la corona',
});

export function baseElo(level) {
  return ELO_BY_LEVEL[level] ?? ELO_BY_LEVEL[START_LEVEL];
}
