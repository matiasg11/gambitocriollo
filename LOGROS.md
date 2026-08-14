# Logros de Gambito Criollo

Los logros se definen en `achievements.js`. Están separados de los dilemas para que puedas editarlos sin tocar `career-events.js`.

## Logros por decisiones

| Dilema y elección | Título |
|---|---|
| Jugar el debut en el cumpleaños | El Jinete de las Dos Fiestas |
| Viajar de noche en micro | Centauro de la Ruta Nocturna |
| Cambiar la apertura expuesta | Arquitecto del Caos Teórico |
| Rechazar las tablas del gran maestro | Matagigantes sin Reloj |
| Corregir la jugada presidencial | Mariscal de la Soberanía del Tablero |
| Rechazar el contrato del patrocinador | Guardián Eterno de la Camiseta |
| Compartir la preparación secreta | Gran Maestre de la Logia del Análisis |
| Jugar el clasificatorio con fiebre | Paladín de los 38 Grados |
| Hablar frente al micrófono abierto | La Voz que Hace Temblar los Salones |
| Rechazar tablas para ir por el título | Conquistador de la Última Frontera |
| Aceptar la simultánea a ciegas | Oráculo de las Sesenta y Cuatro Sombras |
| Jugar el gambito dudoso | Apóstol del Peón Sacrificado |
| Cambiar de entrenador | Renacentista de las Sesenta y Cuatro |
| Aceptar el primer tablero | Capitán del Primer Tablero |
| Elegir el torneo rápido | Emperador del Reloj en Llamas |
| Mantener el plan propio | General de su Propio Plan |
| Apagar la cámara para estudiar | Monje del Tablero Apagado |
| Pedir controles adicionales | Custodio de la Pureza del Juego |
| Rehacer la preparación filtrada | Alquimista de la Novedad sobre la Novedad |
| Jugar el match frente al público | Gladiador de la Plaza Ajedrecística |
| Rechazar la oferta de trampa | La Mano Limpia |
| Jugar a ganar en La última planilla | Hasta la Última Casilla |
| Volver al club para enseñar | El Tablero se Multiplica |
| Proteger los secretos del equipo | Guardián de los Cuadernos |

Estos logros se conceden al tomar la decisión indicada, independientemente de que el azar posterior produzca un resultado positivo o negativo.

## Logros por hitos

| Hito | Título |
|---|---|
| Primer ejercicio resuelto | Cazador de Tácticas |
| 10 ejercicios resueltos | Azote de los Problemas |
| 20 ejercicios resueltos | Destructor de las Sesenta y Cuatro |
| Primera decisión positiva | El Destino Juega de tu Lado |
| 5 decisiones positivas | Oráculo de las Decisiones |
| 10 decisiones positivas | Señor Absoluto del Fuera de Tablero |
| Temporada con 2/2 ejercicios | Dos Golpes, Ninguna Duda |
| Alcanzar el nivel 6 | Embajador de las Olimpiadas |
| Alcanzar el nivel 7 | Señor del Territorio Nacional |
| Alcanzar el nivel 8 | Elegido de los Candidatos |
| Alcanzar el nivel 9 | Retador de los Siete Reinos |
| Alcanzar el nivel 10 | Portador de la Corona |
| Completar diez temporadas | Leyenda de Diez Temporadas |
| Superar los umbrales FM, IM y GM | El título oficial correspondiente |

## Cómo agregar uno

Para una decisión, agregá una entrada a `DECISION_ACHIEVEMENTS` con esta forma:

```js
'id-del-dilema:id-de-la-eleccion': award(
  'identificador-unico-del-logro',
  'Título rimbombante',
  'Texto breve que explica por qué se obtuvo.'
),
```

Los identificadores del dilema y de la elección se consultan en `career-events.js`, pero no hace falta modificar ese archivo. Para un hito general, agregá la entrada a `MILESTONE_ACHIEVEMENTS` y su condición en la función del servidor que procesa el evento correspondiente.

Después de editar el catálogo ejecutá:

```powershell
powershell -File scripts/sync-game-data.ps1
```

Así se copia el catálogo al validador de Supabase. Luego hay que volver a desplegar `game-api` y publicar la web.
