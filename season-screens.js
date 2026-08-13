/**
 * PANTALLAS EDITABLES DE LAS DIEZ TEMPORADAS
 *
 * Podés cambiar title y text libremente. No cambies season ni elimines
 * temporadas: el juego espera exactamente los números del 1 al 10.
 */
export const seasonScreens = [
  {
    season: 1,
    title: 'El club de barrio',
    text: 'La carrera empieza entre tableros gastados, mates compartidos y rivales que ya conocen tus trucos.',
  },
  {
    season: 2,
    title: 'Primer abierto',
    text: 'Salís del club para medirte con jugadores desconocidos y aprender a competir lejos de casa.',
  },
  {
    season: 3,
    title: 'La liga municipal',
    text: 'Ahora defendés los colores del equipo y cada punto puede decidir una serie entera.',
  },
  {
    season: 4,
    title: 'El maestro visitante',
    text: 'Una figura del circuito llega a la ciudad y pone a prueba tu preparación y tu carácter.',
  },
  {
    season: 5,
    title: 'El Torneo Nacional',
    text: 'Las mesas se llenan de campeones provinciales y cada ronda empieza a tener repercusión.',
  },
  {
    season: 6,
    title: 'Viaje al interior',
    text: 'La carrera exige kilómetros, adaptación y concentración en condiciones siempre diferentes.',
  },
  {
    season: 7,
    title: 'Circuito federal',
    text: 'Ya te estudian antes de sentarse al tablero y cada decisión fuera de él pesa un poco más.',
  },
  {
    season: 8,
    title: 'La élite internacional',
    text: 'El circuito internacional te enfrenta con estilos, idiomas y preparaciones nuevas.',
  },
  {
    season: 9,
    title: 'La cima del circuito',
    text: 'La corona está cerca: la precisión importa tanto como la capacidad de soportar la presión.',
  },
  {
    season: 10,
    title: 'El legado',
    text: 'Llegó la temporada decisiva: conquistar la corona o demostrar que todavía sos quien manda.',
  },
];

export function seasonScreen(season) {
  return seasonScreens.find(screen => screen.season === season) ?? seasonScreens[0];
}
