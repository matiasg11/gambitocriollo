# Situaciones de carrera

Todas las situaciones se guardan en `career-events.js`. Al iniciar una carrera, el servidor filtra el catálogo para cada combinación posible de temporada y nivel y guarda un orden sorteado de situaciones válidas. Al llegar a cada casillero usa la primera que todavía no haya aparecido en esa carrera.

## Campos principales

```js
{
  id: 'identificador-unico',
  minSeason: 1,
  maxSeason: 4,
  minLevel: 1,
  maxLevel: 3,
  title: 'Título del dilema',
  text: 'Resumen breve de la situación',
  longText: `Desarrollo largo opcional del dilema.
Podés escribir varios párrafos o líneas para dar contexto histórico, político o ajedrecístico.`,
  spotifyUrl: 'https://open.spotify.com/episode/ID-DEL-EPISODIO',
  spotifyLabel: 'Escuchar la columna en Ciencia del Fin del Mundo',
  choices: [
    {
      id: 'opcion-a',
      label: 'Texto del botón',
      description: 'Consecuencia que conoce el jugador',
      chance: 65,
      successElo: 25,
      failureElo: -12,
      successTitle: 'Título si tiene éxito',
      successText: 'Resultado exitoso',
      failureTitle: 'Título si falla',
      failureText: 'Resultado fallido'
    }
  ]
}
```

`chance` es un porcentaje interno de 0 a 100 y no se muestra durante la elección. Los puntos `successElo` y `failureElo` se acumulan durante toda la carrera sobre el ELO base del nivel.

## Texto largo y columna de Spotify

- `text` es el resumen que aparece primero y conviene que tenga una o dos oraciones.
- `longText` es opcional. Puede ser una cadena normal o usar comillas invertidas para escribir varias líneas. Se muestra debajo del resumen y conserva los saltos de línea.
- `spotifyUrl` es opcional. Por seguridad, el juego solo acepta enlaces HTTPS de `open.spotify.com` y `spotify.link`.
- `spotifyLabel` es opcional. Si lo omitís, el botón dice **Escuchar la columna de Ciencia del Fin del Mundo en Spotify**.

Si no querés texto largo o audio en un dilema, podés omitir esos campos por completo.

## Disponibilidad

El catálogo actual contiene 24 situaciones. Cada objeto declara explícitamente:

- `minSeason` y `maxSeason`: temporadas permitidas, de 1 a 10.
- `minLevel` y `maxLevel`: niveles permitidos, de 1 a 10.

Para agregar una situación, copiá uno de los objetos de `career-events.js`, asignale un `id` que no exista y ajustá sus cuatro límites.

## Catálogo actual

| ID | Situación | Temporadas | Niveles |
|---|---|---:|---:|
| `birthday-debut` | El cumpleaños y el debut | 1–2 | 1–2 |
| `first-open-road` | La ruta al primer abierto | 1–3 | 1–10 |
| `exposed-repertoire` | Tu repertorio quedó expuesto | 2–7 | 1–10 |
| `master-draw-offer` | La oferta del maestro | 3–10 | 3–10 |
| `presidential-first-move` | La primera jugada | 4–10 | 1–10 |
| `sponsor-contract` | El contrato del patrocinador | 5–9 | 1–10 |
| `shared-preparation` | Preparación compartida | 3–9 | 1–10 |
| `fever-before-qualifier` | Fiebre antes de la selección | 3–9 | 1–10 |
| `open-microphone` | El micrófono abierto | 7–10 | 1–10 |
| `last-draw-offer` | La última oferta de tablas | 4–9 | 1–10 |
| `blindfold-simultaneous` | La exhibición a ciegas | 3–9 | 3–10 |
| `dubious-gambit` | El gambito dudoso | 2–10 | 1–10 |
| `trainer-change` | Cambiar de entrenador | 2–9 | 1–9 |
| `team-board-order` | El primer tablero | 2–8 | 1–8 |
| `time-control-choice` | Dos torneos, un fin de semana | 1–10 | 1–7 |
| `seconds-advice` | El consejo del segundo | 4–9 | 3–9 |
| `streamer-invitation` | La invitación del streamer | 3–10 | 1–10 |
| `engine-accusation` | Sospecha de asistencia | 5–10 | 4–10 |
| `preparation-leak` | La filtración | 4–10 | 4–10 |
| `cheating-offer` | La oferta imposible | 3–9 | 2–7 |
| `match-conditions` | Las condiciones del match | 6–9 | 5–10 |
| `final-legacy` | La última planilla | Final | 1–10 |
| `final-teach-or-play` | La mesa que queda libre | Final | 1–10 |
| `final-book-offer` | Las páginas de la carrera | Final | 1–10 |

`finalOnly: true` incorpora el dilema al sorteo especial que ocurre después de completar los dos ejercicios de la temporada 10 y lo excluye del sorteo normal. `maxLevelOnChoose: 6` marca la elección como un bloqueo permanente de ascenso; actualmente se usa para la alternativa de aceptar la trampa.

## Después de editar

Las carreras ya iniciadas conservan los IDs y el orden de su presorteo. Si editás el texto, los parámetros o las alternativas de una situación sin cambiar su `id`, ese cambio aparece donde el mismo ID ya estaba sorteado y no mueve los demás dilemas. Las situaciones nuevas participan únicamente en carreras nuevas. Si eliminás un ID, el servidor usa el siguiente suplente válido del casillero afectado.

El servidor guarda una copia del catálogo para validar que nadie pueda inventar una alternativa desde el navegador. Después de cambiar `career-events.js`, sincronizá la copia con:

```powershell
powershell -File scripts/sync-game-data.ps1
```

Luego hay que volver a desplegar la función `game-api`. Si solo publicás el archivo de la web, los dilemas del servidor no cambiarán.
