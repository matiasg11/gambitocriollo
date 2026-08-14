# Situaciones de carrera

Todas las situaciones se guardan en `career-events.js`. La aplicación filtra el catálogo según la temporada y el nivel actuales, y luego elige una situación que todavía no haya aparecido en esa carrera.

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

El catálogo actual contiene 20 situaciones. Cada objeto declara explícitamente:

- `minSeason` y `maxSeason`: temporadas permitidas, de 1 a 10.
- `minLevel` y `maxLevel`: niveles permitidos, de 1 a 10.

Para agregar una situación, copiá uno de los objetos de `career-events.js`, asignale un `id` que no exista y ajustá sus cuatro límites.

## Catálogo actual

| ID | Situación | Temporadas | Niveles |
|---|---|---:|---:|
| `birthday-debut` | El cumpleaños y el debut | 1 | 1–10 |
| `first-open-road` | La ruta al primer abierto | 2 | 1–10 |
| `exposed-repertoire` | Tu repertorio quedó expuesto | 3 | 1–10 |
| `master-draw-offer` | La oferta del maestro | 4 | 1–10 |
| `presidential-first-move` | La primera jugada | 5 | 1–10 |
| `sponsor-contract` | El contrato del patrocinador | 6 | 1–10 |
| `shared-preparation` | Preparación compartida | 7 | 1–10 |
| `fever-before-qualifier` | Fiebre antes de la selección | 8 | 1–10 |
| `open-microphone` | El micrófono abierto | 9 | 1–10 |
| `last-draw-offer` | La última oferta de tablas | 10 | 1–10 |
| `blindfold-simultaneous` | La exhibición a ciegas | 1–3 | 1–3 |
| `dubious-gambit` | El gambito dudoso | 2–5 | 1–5 |
| `trainer-change` | Cambiar de entrenador | 3–6 | 2–6 |
| `team-board-order` | El primer tablero | 3–7 | 2–7 |
| `time-control-choice` | Dos torneos, un fin de semana | 4–8 | 3–8 |
| `seconds-advice` | El consejo del segundo | 5–9 | 4–9 |
| `streamer-invitation` | La invitación del streamer | 1–10 | 1–10 |
| `engine-accusation` | Sospecha de asistencia | 6–10 | 5–10 |
| `preparation-leak` | La filtración | 7–10 | 6–10 |
| `match-conditions` | Las condiciones del match | 8–10 | 8–10 |

## Después de editar

El servidor guarda una copia del catálogo para validar que nadie pueda inventar una alternativa desde el navegador. Después de cambiar `career-events.js`, sincronizá la copia con:

```powershell
powershell -File scripts/sync-game-data.ps1
```

Luego hay que volver a desplegar la función `game-api`. Si solo publicás el archivo de la web, los dilemas del servidor no cambiarán.
