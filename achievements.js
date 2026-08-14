/**
 * Catálogo de logros de Gambito Criollo.
 *
 * Los logros vinculados a dilemas usan la clave "id-del-evento:id-de-la-elección".
 * De esta forma se pueden crear, quitar o renombrar logros sin modificar
 * career-events.js.
 */

const award = (id, title, text) => Object.freeze({ id, title, text });

export const DECISION_ACHIEVEMENTS = Object.freeze({
  'birthday-debut:play': award('decision-birthday-play', 'El Jinete de las Dos Fiestas', 'Jugaste el debut y todavía intentaste llegar al brindis familiar.'),
  'first-open-road:bus': award('decision-night-bus', 'Centauro de la Ruta Nocturna', 'Elegiste atravesar la noche para llegar al tablero.'),
  'exposed-repertoire:switch': award('decision-repertoire-switch', 'Arquitecto del Caos Teórico', 'Cambiaste de apertura cuando el rival creía conocerte de memoria.'),
  'master-draw-offer:reject': award('decision-reject-master-draw', 'Matagigantes sin Reloj', 'Rechazaste las tablas de un gran maestro con dos minutos en el reloj.'),
  'presidential-first-move:change': award('decision-presidential-change', 'Mariscal de la Soberanía del Tablero', 'Corregiste la jugada presidencial y defendiste tu preparación.'),
  'sponsor-contract:decline': award('decision-decline-sponsor', 'Guardián Eterno de la Camiseta', 'Elegiste seguir representando al club que te formó.'),
  'shared-preparation:share': award('decision-share-preparation', 'Gran Maestre de la Logia del Análisis', 'Abriste tu preparación secreta para fortalecer al equipo.'),
  'fever-before-qualifier:playSick': award('decision-play-with-fever', 'Paladín de los 38 Grados', 'Te sentaste a jugar el clasificatorio aun con fiebre.'),
  'open-microphone:speak': award('decision-open-microphone', 'La Voz que Hace Temblar los Salones', 'Dijiste en vivo lo que pensabas de la organización.'),
  'last-draw-offer:title': award('decision-play-for-title', 'Conquistador de la Última Frontera', 'Rechazaste el podio seguro para ir por el título.'),
  'blindfold-simultaneous:accept': award('decision-blindfold', 'Oráculo de las Sesenta y Cuatro Sombras', 'Aceptaste jugar sin mirar el tablero.'),
  'dubious-gambit:play-gambit': award('decision-dubious-gambit', 'Apóstol del Peón Sacrificado', 'Confiaste en la iniciativa aunque el motor desaprobara el gambito.'),
  'trainer-change:new-coach': award('decision-new-coach', 'Renacentista de las Sesenta y Cuatro', 'Te animaste a reconstruir tu juego con un método nuevo.'),
  'team-board-order:board-one': award('decision-board-one', 'Capitán del Primer Tablero', 'Aceptaste la responsabilidad más difícil del equipo.'),
  'time-control-choice:rapid': award('decision-rapid', 'Emperador del Reloj en Llamas', 'Elegiste el vértigo del torneo rápido y sus premios.'),
  'seconds-advice:own-plan': award('decision-own-plan', 'General de su Propio Plan', 'Sostuviste tu preparación frente a la advertencia de último minuto.'),
  'streamer-invitation:study': award('decision-study-offline', 'Monje del Tablero Apagado', 'Apagaste la cámara para estudiar y descansar.'),
  'engine-accusation:request-check': award('decision-request-checks', 'Custodio de la Pureza del Juego', 'Pediste garantías adicionales antes de sentarte a jugar.'),
  'preparation-leak:rewrite': award('decision-rewrite-preparation', 'Alquimista de la Novedad sobre la Novedad', 'Reescribiste la preparación después de la filtración.'),
  'match-conditions:public-stage': award('decision-public-stage', 'Gladiador de la Plaza Ajedrecística', 'Elegiste disputar el match frente a la multitud.'),
});

export const MILESTONE_ACHIEVEMENTS = Object.freeze({
  'first-exercise': award('milestone-first-exercise', 'Cazador de Tácticas', 'Resolviste tu primer ejercicio de la carrera.'),
  'ten-exercises': award('milestone-ten-exercises', 'Azote de los Problemas', 'Alcanzaste diez ejercicios resueltos.'),
  'twenty-exercises': award('milestone-twenty-exercises', 'Destructor de las Sesenta y Cuatro', 'Completaste los veinte ejercicios de una carrera perfecta.'),
  'first-positive-decision': award('milestone-first-positive-decision', 'El Destino Juega de tu Lado', 'Tu primera decisión favorable ya forma parte de la leyenda.'),
  'five-positive-decisions': award('milestone-five-positive-decisions', 'Oráculo de las Decisiones', 'Acertaste cinco decisiones fuera del tablero.'),
  'ten-positive-decisions': award('milestone-ten-positive-decisions', 'Señor Absoluto del Fuera de Tablero', 'Cerraste una carrera con diez decisiones favorables.'),
  'perfect-season': award('milestone-perfect-season', 'Dos Golpes, Ninguna Duda', 'Resolviste los dos ejercicios de una temporada.'),
  'level-6': award('milestone-level-6', 'Embajador de las Olimpiadas', 'Alcanzaste el nivel 6 de la carrera.'),
  'level-7': award('milestone-level-7', 'Señor del Territorio Nacional', 'Alcanzaste el nivel 7 de la carrera.'),
  'level-8': award('milestone-level-8', 'Elegido de los Candidatos', 'Alcanzaste el nivel 8 de la carrera.'),
  'level-9': award('milestone-level-9', 'Retador de los Siete Reinos', 'Alcanzaste el nivel 9 de la carrera.'),
  'level-10': award('milestone-level-10', 'Portador de la Corona', 'Alcanzaste el nivel 10 de la carrera.'),
  'career-complete': award('milestone-career-complete', 'Leyenda de Diez Temporadas', 'Completaste las diez temporadas de Gambito Criollo.'),
});

export function decisionAchievement(eventId, choiceId) {
  return DECISION_ACHIEVEMENTS[`${eventId}:${choiceId}`] ?? null;
}

export function milestoneAchievement(id) {
  return MILESTONE_ACHIEVEMENTS[id] ?? null;
}
