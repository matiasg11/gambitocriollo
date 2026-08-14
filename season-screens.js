/**
 * PANTALLAS EDITABLES DE LAS DIEZ TEMPORADAS
 *
 * Podés cambiar chapter, title, text y buttonLabel libremente. En chapter y
 * text podés usar {season} y {level}. No cambies season ni elimines temporadas.
 */
export const seasonScreens = [
  {
    season: 1,
    chapter: 'Temporada {season} · Nivel actual {level}',
    title: 'El club de barrio',
    text: 'La carrera empieza entre tableros gastados, mates compartidos y rivales que ya conocen tus trucos.',
    buttonLabel: 'Empezar temporada →',
  },
  {
    season: 2,
    chapter: 'Temporada {season} · Nivel actual {level}',
    title: 'Primer abierto',
    text: 'Salís del club para medirte con jugadores desconocidos y aprender a competir lejos de casa.',
    buttonLabel: 'Empezar temporada →',
  },
  {
    season: 3,
    chapter: 'Temporada {season} · Nivel actual {level}',
    title: 'La liga municipal',
    text: 'Ahora defendés los colores del equipo y cada punto puede decidir una serie entera.',
    buttonLabel: 'Empezar temporada →',
  },
  {
    season: 4,
    chapter: 'Temporada {season} · Nivel actual {level}',
    title: 'El maestro visitante',
    text: 'Una figura del circuito llega a la ciudad y pone a prueba tu preparación y tu carácter.',
    buttonLabel: 'Empezar temporada →',
  },
  {
    season: 5,
    chapter: 'Temporada {season} · Nivel actual {level}',
    title: 'El Torneo Nacional',
    text: 'Las mesas se llenan de campeones provinciales y cada ronda empieza a tener repercusión.',
    buttonLabel: 'Empezar temporada →',
  },
  {
    season: 6,
    chapter: 'Temporada {season} · Nivel actual {level}',
    title: 'Viaje al interior',
    text: 'La carrera exige kilómetros, adaptación y concentración en condiciones siempre diferentes.',
    buttonLabel: 'Empezar temporada →',
  },
  {
    season: 7,
    chapter: 'Temporada {season} · Nivel actual {level}',
    title: 'Circuito federal',
    text: 'Ya te estudian antes de sentarse al tablero y cada decisión fuera de él pesa un poco más.',
    buttonLabel: 'Empezar temporada →',
  },
  {
    season: 8,
    chapter: 'Temporada {season} · Nivel actual {level}',
    title: 'La élite internacional',
    text: 'El circuito internacional te enfrenta con estilos, idiomas y preparaciones nuevas.',
    buttonLabel: 'Empezar temporada →',
  },
  {
    season: 9,
    chapter: 'Temporada {season} · Nivel actual {level}',
    title: 'La cima del circuito',
    text: 'La corona está cerca: la precisión importa tanto como la capacidad de soportar la presión.',
    buttonLabel: 'Empezar temporada →',
  },
  {
    season: 10,
    chapter: 'Temporada {season} · Nivel actual {level}',
    title: 'El legado',
    text: 'Llegó la temporada decisiva: conquistar la corona o demostrar que todavía sos quien manda.',
    buttonLabel: 'Empezar temporada →',
  },
];

export function seasonScreen(season) {
  return seasonScreens.find(screen => screen.season === season) ?? seasonScreens[0];
}
