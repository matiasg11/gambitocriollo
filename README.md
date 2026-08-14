# Gambito Criollo

Juego narrativo de carrera ajedrecística con 10 temporadas, un dilema por temporada y 2 ejercicios tácticos en cada una.

## Progresión

- 2 ejercicios correctos: sube un nivel.
- 1 correcto: mantiene el nivel.
- 0 correctos: baja un nivel, excepto cuando ya está en nivel 1.
- El ELO mostrado para cada ejercicio es el rating de origen multiplicado por 1,5.

Cada ejercicio resuelto también aporta ELO acumulativo:

- Primer intento: +8 ELO.
- Segundo intento: +4 ELO.
- Tercer intento: +2 ELO.
- Sin resolver: +0 ELO.

La fórmula completa parte de `ELO base del nivel + saldo de decisiones + ELO ganado en ejercicios` y limita el resultado a la banda mínima y máxima del nivel.

| Nivel | ELO mínimo | ELO máximo |
|---:|---:|---:|
| 1 | 600 | 2300 |
| 2 | 800 | 2350 |
| 3 | 1000 | 2400 |
| 4 | 1200 | 2450 |
| 5 | 1400 | 2500 |
| 6 | 1750 | 2550 |
| 7 | 1900 | 2600 |
| 8 | 2550 | 2650 |
| 9 | 2650 | 2700 |
| 10 | 2700 | 2750 |

Los nombres especiales dependen del nivel y también de la temporada:

- Nivel 5 desde la temporada 6: **Torneo Nacional**.
- Nivel 6 desde la temporada 7: **Olimpiadas de ajedrez**.
- Nivel 8 desde la temporada 8: **Torneo de Candidatos**.
- Nivel 9 desde la temporada 9: **Campeonato del Mundo**.
- Nivel 10 desde la temporada 10: **Defendé la corona**.

Si el nivel se alcanza antes de su temporada mínima, la pantalla conserva el título normal de esa temporada.

La carrera comienza en nivel 1. Si el jugador resuelve todo correctamente, alcanza el nivel 10 al terminar la temporada 9 y disputa la temporada 10 para revalidar la corona.

Al superar 2300 de ELO se obtiene permanentemente el título **FM**; al superar 2400 se reemplaza por **IM** y al superar 2500 por **GM**. Los títulos no se pierden aunque luego baje el ELO.

Cada decisión suma o resta una cantidad aleatoria dentro de un margen de ±5 puntos respecto de su impacto base.

La pantalla final consulta un ranking global con la mejor carrera de cada participante. Incluye nombre, ELO y nivel máximos, decisiones positivas, ejercicios resueltos, cantidad de participantes, cantidad de carreras terminadas, posición, percentil e histograma de ELO.

También muestra los **Logros** conseguidos durante la partida, guardados dentro de un acordeón para no desplazar el resumen principal. Hay logros por elecciones especiales, ejercicios, decisiones favorables, temporadas perfectas, niveles, títulos oficiales y finalización de la carrera. La lista y la guía de edición están en `LOGROS.md`; el catálogo editable está en `achievements.js` y no requiere modificar los dilemas.

El botón para compartir prepara una tarjeta PNG compacta con el título FM/IM/GM, ejercicios, decisiones y ELO. En dispositivos compatibles envía la imagen junto con un resumen personalizado y el enlace del juego. En los demás navegadores descarga la captura y copia ese mismo texto para pegarlo en una red social.

## Validación y ranking

La progresión se valida en la función Edge `game-api`: el servidor asigna el dilema y los ejercicios, resuelve el azar, verifica cada jugada y calcula intentos, ELO, niveles y títulos. El navegador no puede enviar un puntaje final arbitrario.

Al crear una carrera, el servidor presortea el contenido de las 55 combinaciones de temporada y nivel que el jugador podría alcanzar. El plan guarda IDs, no copias de los objetos: recargar conserva el mismo sorteo, agregar contenido al catálogo no reordena una carrera iniciada y editar un ejercicio o dilema actualiza solamente las apariciones de ese ID. Si un ID sorteado se elimina, el servidor repara únicamente el casillero afectado.

Los datos se guardan en Supabase mediante las migraciones de `supabase/migrations`. Las tablas tienen RLS activado sin políticas públicas; el navegador solo accede a la función de juego usando un token aleatorio por instalación. No se solicitan correo ni datos personales.

“Participantes” cuenta instalaciones de navegador únicas que comenzaron una carrera normal, por lo que es una aproximación a personas. Cada jugador aparece una sola vez en el ranking, con su mejor carrera. Las carreras `BOCA` quedan fuera de todas las estadísticas globales.

## Situaciones

Las 24 situaciones de carrera están en `career-events.js`. Cada una declara temporadas y niveles permitidos y puede incluir un desarrollo largo más un enlace a una columna de Ciencia del Fin del Mundo en Spotify. El presorteo respeta esos cuatro límites y conserva un orden de suplentes para evitar repetir un dilema durante una carrera. La guía para agregar nuevas situaciones está en `SITUACIONES.md`.

Después de resolver los dos ejercicios de la temporada 10, el servidor elige uno de los dilemas marcados con `finalOnly: true`. La carrera y el ranking se cierran recién al tomar esa última decisión. La oferta de trampa puede fijar `maxLevelOnChoose: 6`: el servidor guarda esa decisión y bloquea permanentemente los ascensos por encima del nivel 6. El navegador precarga los dilemas normales durante la introducción y apenas termina la temporada anterior.

## Banco de ejercicios

El banco normal contiene 1.000 puzzles de la [base abierta de Lichess](https://database.lichess.org/#puzzles), publicada con licencia CC0: 100 ejercicios únicos para cada nivel. Cada ejercicio exige como máximo tres jugadas del jugador. El presorteo usa IDs sin repetir, por lo que una carrera normal no vuelve a presentar el mismo ejercicio.

Los rangos de rating original están en `EXERCISE_RATING_RANGES`, dentro de `game-config.js`: 600–799, 800–999, 1000–1199, 1200–1399, 1400–1599, 1600–1749, 1750–1899, 1900–1999, 2000–2099 y 2100–2200. La selección importada y sus metadatos quedan en `data/lichess_exercises_1000.json`; el juego carga la versión compacta de `exercises.js`.

Para regenerar el banco, descargá `lichess_db_puzzle.csv.zst` dentro de `data` y ejecutá `scripts/import-lichess-puzzles.mjs` con Node. El importador exige popularidad mínima 80, al menos 50 partidas y desviación de rating máxima 100. `PINNED_PUZZLE_IDS` conserva ejercicios puntuales que deban permanecer en el catálogo. Después podés auditar cantidad, unicidad, rangos y longitud con `scripts/validate-exercise-bank.mjs`.

La validación acepta la línea principal de la base y también cualquier jugada legal alternativa que termine inmediatamente en jaque mate. Así, en `00Zit`, tanto `Qxg4#` como `Qh1#` resuelven correctamente el ejercicio.

## Datos simulados del ranking

`scripts/seed-ranking-simulations.sql` genera de forma determinista 1.000 carreras ficticias completas. Usa 1.000 combinaciones únicas de nombres y apellidos habituales en Argentina, repartidas en partes iguales entre nombres de hombres y mujeres. Todos llevan `client_version = 'simulation-ranking-v1'`, que permite distinguirlos y eliminarlos sin afectar partidas reales.

Para retirar solamente ese lote de prueba usá `scripts/clear-ranking-simulations.sql`. Las partidas reales no se eliminan.

## Edición manual

- Bandas de ELO y nombres especiales de los niveles: `game-config.js`.
- Etiqueta, título, texto y botón de cada pantalla de temporada: `season-screens.js`. Los campos de texto aceptan `{season}` y `{level}`.
- Dilemas, texto largo, enlaces de Spotify, probabilidades, impactos y resultados: `career-events.js`.
- Explicación completa de cada campo de los dilemas: `SITUACIONES.md`.
- Logros por decisiones e hitos: `achievements.js`.
- Lista y guía para agregar logros: `LOGROS.md`.

Después de editar `game-config.js`, `career-events.js` o `achievements.js`, ejecutá:

```powershell
powershell -File scripts/sync-game-data.ps1
```

Esto actualiza la copia que usa el validador de Supabase. Después hay que volver a desplegar la función `game-api` y publicar la web.

## Codificación de textos

Todos los archivos editables usan UTF-8 y saltos de línea LF. El repositorio incluye `.editorconfig` y `.gitattributes` para conservar esa codificación al editar o publicar. Antes de subir cambios podés verificar los textos con:

```powershell
powershell -File scripts/check-utf8.ps1
```

## Modo debug

Usá `BOCA` como nombre del jugador. El modo debug utiliza 50 ejercicios reales de mate en 1 con rating de origen 600–799, distribuidos artificialmente entre los niveles 1–10. Sus carreras no cuentan como participantes ni alteran el ranking o el histograma.

Los datos están en `data/debug_mates_50.json`. El banco normal de ejercicios permanece en `data/ejercicios_ajedrez_30.csv` y `data/ejercicios_ajedrez_30.md`.

## Piezas

El tablero usa localmente el set vectorial Cburnett incluido por Lichess. Los archivos se encuentran en `assets/pieces`.

## Ejecutar

Por usar módulos de JavaScript, abrí la carpeta con un servidor estático, por ejemplo Live Server de VS Code. En GitHub Pages funciona directamente.

## Publicar

Subí todos los archivos a un repositorio. En **Settings → Pages**, seleccioná **Deploy from a branch**, rama `main`, carpeta `/ (root)`.
