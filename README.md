# Gambito Criollo

Juego narrativo de carrera ajedrecística con 10 temporadas, un dilema por temporada y 2 ejercicios tácticos fijos en cada una.

## Progresión

- 2 ejercicios correctos: sube un nivel.
- 1 correcto: mantiene el nivel.
- 0 correctos: baja un nivel, excepto cuando ya está en nivel 0.
- El ELO mostrado para cada ejercicio es el rating de origen multiplicado por 1,5.

Cada ejercicio resuelto también aporta ELO acumulativo:

- Primer intento: +12 ELO.
- Segundo intento: +6 ELO.
- Tercer intento: +3 ELO.
- Sin resolver: +0 ELO.

La fórmula completa es `ELO base del nivel + saldo de decisiones + ELO ganado en ejercicios`.

| Nivel | ELO base |
|---:|---:|
| 0 | 600 |
| 1 | 800 |
| 2 | 1200 |
| 3 | 1400 |
| 4 | 1600 |
| 5 | 2000 |
| 6 | 2200 |
| 7 | 2350 |
| 8 | 2500 |
| 9 | 2600 |
| 10 | 2750 |

Los nombres **Torneo de Candidatos**, **Campeonato del Mundo** y **Defendé la corona** aparecen únicamente cuando el jugador está en los niveles 8, 9 y 10, respectivamente.

Al superar 2300 de ELO se obtiene permanentemente el título **FM**; al superar 2400 se reemplaza por **IM** y al superar 2500 por **GM**. Los títulos no se pierden aunque luego baje el ELO.

Cada decisión suma o resta una cantidad aleatoria dentro de un margen de ±5 puntos respecto de su impacto base.

La pantalla final consulta un ranking global con la mejor carrera de cada participante. Incluye nombre, ELO y nivel máximos, decisiones positivas, ejercicios resueltos, cantidad de participantes, cantidad de carreras terminadas, posición, percentil e histograma de ELO.

## Validación y ranking

La progresión se valida en la función Edge `game-api`: el servidor asigna el dilema y los ejercicios, resuelve el azar, verifica cada jugada y calcula intentos, ELO, niveles y títulos. El navegador no puede enviar un puntaje final arbitrario.

Los datos se guardan en Supabase mediante las migraciones de `supabase/migrations`. Las tablas tienen RLS activado sin políticas públicas; el navegador solo accede a la función de juego usando un token aleatorio por instalación. No se solicitan correo ni datos personales.

“Participantes” cuenta instalaciones de navegador únicas que comenzaron una carrera normal, por lo que es una aproximación a personas. Cada jugador aparece una sola vez en el ranking, con su mejor carrera. Las carreras `BOCA` quedan fuera de todas las estadísticas globales.

## Situaciones

Las 20 situaciones de carrera están en `career-events.js`. Cada una declara temporadas y niveles permitidos. La guía para agregar nuevas situaciones está en `SITUACIONES.md`.

## Modo debug

Usá `BOCA` como nombre del jugador. El modo debug utiliza 50 ejercicios reales de mate en 1 con rating de origen 600–799, distribuidos artificialmente entre los niveles 1–10. Sus carreras no cuentan como participantes ni alteran el ranking o el histograma.

Los datos están en `data/debug_mates_50.json`. El banco normal de ejercicios permanece en `data/ejercicios_ajedrez_30.csv` y `data/ejercicios_ajedrez_30.md`.

## Piezas

El tablero usa localmente el set vectorial Cburnett incluido por Lichess. Los archivos se encuentran en `assets/pieces`.

## Ejecutar

Por usar módulos de JavaScript, abrí la carpeta con un servidor estático, por ejemplo Live Server de VS Code. En GitHub Pages funciona directamente.

## Publicar

Subí todos los archivos a un repositorio. En **Settings → Pages**, seleccioná **Deploy from a branch**, rama `main`, carpeta `/ (root)`.
