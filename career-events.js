export const careerEvents = [

{id:'engine-team-suspicion',minSeason:6,maxSeason:10,minLevel:5,maxLevel:10,
  title:'La máquina sabía demasiado',text:'Participás de una exhibición contra un nuevo programa de ajedrez. Después de perder una partida decisiva, algunas de sus jugadas te parecen demasiado humanas. La empresa organizadora asegura que nadie intervino durante el encuentro.',
  realStory: {
    title: 'Kasparov acusa a IBM después de perder con Deep Blue (1997).',
    description: 'Tras caer ante la computadora, Kasparov insinuó que IBM podía haber recibido ayuda humana durante el match y pidió revisar los registros de cálculo. IBM negó la acusación, rechazó una revancha inmediata y desmontó la máquina, lo que alimentó todavía más las sospechas, nunca demostradas.',
    spotifyUrl: 'https://open.spotify.com/episode/1O5smllwNZhEZp4dGrEkBY?si=61324f73a55f4e4a'
  },
  choices:[
  {id:'demand-logs',
   label:'Pedir una auditoría',description:'Reclamás que publiquen los registros internos antes de aceptar el resultado.',chance:55,successElo:15,failureElo:-14,
   successTitle:'Las cuentas están claras',successText:'La empresa acepta una revisión independiente y tu reclamo termina mejorando las reglas de futuras exhibiciones.',
   failureTitle:'Una acusación sin pruebas',failureText:'No aparece ninguna irregularidad y quedás como alguien incapaz de aceptar una derrota.'},
  {id:'accept-machine',
   label:'Aceptar el resultado',description:'Felicitás al equipo y pedís una revancha en mejores condiciones.',chance:72,successElo:14,failureElo:-10,
   successTitle:'Otra oportunidad',successText:'Tu actitud abre la puerta a un segundo encuentro con condiciones mucho más transparentes.',
   failureTitle:'La duda no desaparece',failureText:'La empresa anuncia que el proyecto termina y nunca llegás a saber qué ocurrió detrás de escena.'}]},

{id:'coded-snack',minSeason:4,maxSeason:9,minLevel:3,maxLevel:10,
  title:'El café del segundo tablero',text:'Durante un match importante, el asistente de tu rival le alcanza siempre una bebida distinta antes de momentos críticos. Tu equipo sospecha que el tipo de bebida podría estar transmitiendo información.',
  realStory: {
    title: 'Karpov–Korchnoi y el “yogur codificado” (1978).',
    description: 'El equipo de Korchnoi denunció que el yogur entregado a Karpov podía transmitir instrucciones mediante su sabor o el momento de la entrega. El encuentro también tuvo disputas sobre banderas, apretones de manos, parapsicólogos y el gurú del equipo de Korchnoi.',
    spotifyUrl: 'https://open.spotify.com/episode/3XWFhAkJc4hPoYOsiFEr3C?si=GAa3g4epTYGXJz5OSOtmGA&utm_source=copy-link&sci=spotify%3Acard-config%3A1Lco8nfmQSqXgHm2YmY'
  },
  choices:[
  {id:'report-drinks',
   label:'Pedir que controlen las bebidas',description:'Solicitás que toda comida o bebida sea autorizada previamente por los árbitros.',chance:67,successElo:12,failureElo:-10,
   successTitle:'Todo sobre la mesa',successText:'Los árbitros establecen un protocolo común y desaparece cualquier posibilidad de transmitir señales.',
   failureTitle:'Paranoia en la sala',failureText:'No encuentran nada extraño y la protesta termina desconcentrándote más que la supuesta señal.'},
  {id:'ignore-drinks',
   label:'Ignorarlo y jugar',description:'Preferís concentrarte en el tablero mientras no haya pruebas.',chance:62,successElo:15,failureElo:-13,
   successTitle:'Solo importan las piezas',successText:'Ganás la partida y las teorías sobre bebidas quedan como una anécdota.',
   failureTitle:'Cada taza parece un mensaje',failureText:'Después de perder empezás a interpretar cada movimiento del asistente como una señal y ya no conseguís concentrarte.'}]},

{id:'championship-demands',minSeason:7,maxSeason:10,minLevel:6,maxLevel:10,
  title:'Las condiciones del campeón',text:'Sos campeón del circuito y llega el momento de defender el título. El reglamento nuevo no te convence y creés que favorece demasiado al retador. Podés exigir modificaciones, aunque la organización ya anunció la fecha del match.',
  finalCandidate:true,
  realStory: {
    title: 'Fischer pierde el título sin jugar (1975).',
    description: 'Fischer exigió un match ilimitado a diez victorias y que un empate 9–9 favoreciera al campeón. FIDE rechazó la última condición y Fischer no se presentó; Anatoly Karpov fue proclamado campeón mundial por defecto.',
    spotifyUrl: 'https://open.spotify.com/episode/3XWFhAkJc4hPoYOsiFEr3C?si=GAa3g4epTYGXJz5OSOtmGA&utm_source=copy-link&sci=spotify%3Acard-config%3A1Lco8nfmQSqXgHm2YmYfx'
  },
  choices:[
  {id:'hold-demands',
   label:'Mantener tus exigencias',description:'No jugás si el reglamento no cambia.',chance:38,successElo:15,failureElo:-15,
   successTitle:'La organización cede',successText:'La presión funciona y ambas partes acuerdan un formato intermedio antes del comienzo.',
   failureTitle:'Campeón sin corona',failureText:'La organización mantiene el reglamento y proclama campeón al retador sin que se juegue una sola partida.'},
  {id:'defend-title',
   label:'Aceptar el reglamento',description:'Jugás aunque consideres injustas algunas condiciones.',chance:68,successElo:15,failureElo:-12,
   successTitle:'El título se defiende jugando',successText:'Ganás el match y después conseguís cambiar parte del reglamento desde una posición de fuerza.',
   failureTitle:'Las condiciones pesan',failureText:'Perdés un encuentro ajustado y te queda la sensación de haber aceptado reglas que nunca quisiste.'}]},

{id:'forbidden-host-country',minSeason:6,maxSeason:10,minLevel:5,maxLevel:10,
  title:'El torneo prohibido',text:'Recibís una invitación extraordinaria para jugar un match muy lucrativo en un país sobre el que tu federación impuso restricciones. Te advierten oficialmente que participar podría traerte sanciones al regresar.',
  realStory: {
    title: 'Fischer juega en Yugoslavia pese a las sanciones (1992).',
    description: 'Fischer disputó una revancha contra Spassky en Yugoslavia pese a una orden del gobierno estadounidense que advertía que violaría las sanciones internacionales. Fischer escupió públicamente sobre la orden y después quedó expuesto a una acusación penal en Estados Unidos.',
    spotifyUrl: 'https://open.spotify.com/episode/48lSW6VSEhTh1zHy1Uebrg?si=ZfUPIv9_SLyi-9N95JlcwQ&utm_source=copy-link&sci=spotify%3Acard-config%3A7HZ6Cv9YqdJxBuHNjrM4CF'
  },
  choices:[
  {id:'play-anyway',
   label:'Jugar de todos modos',description:'Considerás que tu carrera deportiva está por encima del conflicto político.',chance:48,successElo:15,failureElo:-15,
   successTitle:'El match del año',successText:'El encuentro se convierte en un éxito deportivo y conseguís uno de los mayores premios de tu carrera.',
   failureTitle:'La factura llega después',failureText:'Volvés con el premio, pero también con una sanción que te impide competir durante meses.'},
  {id:'respect-ban',
   label:'Rechazar la invitación',description:'No arriesgás tu carrera por un solo torneo.',chance:82,successElo:10,failureElo:-8,
   successTitle:'Otra puerta se abre',successText:'Poco después recibís una invitación equivalente en una sede sin restricciones.',
   failureTitle:'Una oportunidad irrepetible',failureText:'El match se juega con otro participante y se convierte en el evento más comentado del año.'}]},

{id:'match-conditions',minSeason:6,maxSeason:10,minLevel:5,maxLevel:10,
  title:'Las condiciones del match',text:'Podés pedir una sala silenciosa y cerrada o aceptar un escenario con público para acercar el ajedrez a más gente.',
  finalCandidate:true,
  realStory: {
    title: 'Fischer–Spassky: el “Match del Siglo” (1972).',
    description: 'Fischer discutió premios, cámaras, iluminación, público y condiciones de juego; no se presentó a la segunda partida y la perdió por incomparecencia. El encuentro llegó a estar cerca de cancelarse y adquirió una enorme dimensión política por la Guerra Fría.',
    spotifyUrl: 'https://open.spotify.com/episode/48lSW6VSEhTh1zHy1Uebrg?si=ZfUPIv9_SLyi-9N95JlcwQ&utm_source=copy-link&sci=spotify%3Acard-config%3A7HZ6Cv9YqdJxBuHNjrM4CF'
  },
  choices:[
  {id:'quiet-room',
   label:'Pedir una sala cerrada',description:'Priorizás concentración y control.',chance:86,successElo:15,failureElo:-7,
   successTitle:'Cada pieza se escucha',successText:'El silencio te permite calcular con precisión durante horas.',
   failureTitle:'Demasiado aislado',failureText:'La atmósfera fría te quita energía en los momentos críticos.'},
  {id:'public-stage',
   label:'Jugar frente al público',description:'Aceptás ruido y presión a cambio de una gran vidriera.',chance:60,successElo:15,failureElo:-15,
   successTitle:'La multitud corea tu nombre',successText:'Convertís la presión en energía y ganás una partida histórica.',
   failureTitle:'El escenario pesa',failureText:'Cada movimiento provoca murmullos y perdés el hilo de la posición.'}]},

{id:'open-microphone',minSeason:7,maxSeason:10,minLevel:1,maxLevel:10,
  title:'El micrófono abierto',text:'Tus rivales arreglaron empatar entre sí para dejarte afuera a vos. Estás caliente como una pipa y te acercan un micrófono para que te descargues...',
  realStory: {
    title: 'Las acusaciones de colusión en Curazao (1962)',
    description: 'Bobby Fischer acusó a Petrosian, Keres y Geller de pactar tablas rápidas entre ellos para ahorrar energía y bloquear a los rivales no soviéticos. La controversia llevó a sustituir el gran torneo de Candidatos por encuentros eliminatorios ',
    spotifyUrl: 'https://open.spotify.com/episode/48lSW6VSEhTh1zHy1Uebrg?si=ZfUPIv9_SLyi-9N95JlcwQ&utm_source=copy-link&sci=spotify%3Acard-config%3A7HZ6Cv9YqdJxBuHNjrM4CF'
  },
  choices:[
  {id:'speak',
   label:'Decir todo lo que pensás',description:'Vas de frente aunque haya consecuencias.',chance:57,successElo:15,failureElo:-15,
   successTitle:'Alguien tenía que decirlo',successText:'Otros jugadores se suman y la organización corrige el reglamento.',
   failureTitle:'La frase recortada',failureText:'El video se viraliza sin contexto y recibís una sanción.'},
  {id:'calm',
   label:'Responder con calma',description:'Esperás a tener todos los datos.',chance:64,successElo:15,failureElo:-6,
   successTitle:'Cabeza fría fuera del tablero',successText:'Presentás el reclamo por escrito y el fallo se revisa.',
   failureTitle:'El silencio también habla',failureText:'La prensa interpreta tu prudencia como falta de carácter.'}]},

{id:'rematch-negotiation',minSeason:6,maxSeason:10,minLevel:5,maxLevel:10,
  title:'La revancha pendiente',text:'Acabás de conquistar un título derrotando al campeón anterior. Él reclama una revancha inmediata, pero vos controlás buena parte de las condiciones y sabés que enfrentarlo nuevamente puede poner en riesgo todo lo conseguido.',
  finalCandidate:true,
  realStory: {
    title: 'Alekhine evita la revancha con Capablanca (1927–1946).',
    description: 'Después de quitarle el título mundial, Alexander Alekhine nunca concedió a José Raúl Capablanca la esperada revancha. Las exigencias económicas y la enemistad entre ambos alimentaron durante décadas la discusión sobre si el campeón lo estaba esquivando.',
    spotifyUrl: 'https://open.spotify.com/episode/4dA3ZJAiQO0VT5C7ObsLq4?si=ac46f306206b4844'
  },
  choices:[
  {id:'grant-rematch',
   label:'Aceptar la revancha',description:'Ponés fecha y condiciones razonables para volver a enfrentarlo.',chance:57,successElo:15,failureElo:-15,
   successTitle:'Campeón dos veces',successText:'Volvés a vencerlo y ya nadie puede discutir quién merece el título.',
   failureTitle:'La corona vuelve atrás',failureText:'El excampeón aprovecha la segunda oportunidad y recupera el título que acababas de conquistar.'},
  {id:'delay-rematch',
   label:'Postergar el encuentro',description:'Exigís condiciones económicas difíciles y priorizás otros rivales.',chance:74,successElo:10,failureElo:-12,
   successTitle:'El campeón marca el calendario',successText:'Consolidás tu título frente a otros retadores y la revancha va perdiendo importancia.',
   failureTitle:'La revancha que nunca llega',failureText:'El público empieza a creer que evitás al único rival capaz de quitarte la corona.'}]},

{id:'engine-accusation',minSeason:5,maxSeason:10,minLevel:4,maxLevel:10,
  title:'Sospecha de asistencia',text:'Tu próximo rival viene jugando con una precisión extraña. Podés pedir controles adicionales antes de sentarte.',
  realStory: {
    title: 'Carlsen–Niemann (2022).',
    description: 'Tras perder con Hans Niemann en la Sinquefield Cup, Magnus Carlsen abandonó el torneo y posteriormente renunció después de una sola jugada en una partida en línea contra él. Niemann reconoció trampas anteriores en partidas en línea, pero negó haber hecho trampa presencialmente; no se probó fraude en la partida de San Luis. FIDE amonestó a Carlsen por retirarse sin seguir el procedimiento formal.',
    spotifyUrl: 'https://open.spotify.com/episode/5aBKxkM4jva4xdXTmhQOmL?si=b4035782b72649b5'
  },
  choices:[
  {id:'request-check',
   label:'Pedir controles',description:'Exigís garantías aunque genere tensión.',chance:42,successElo:15,failureElo:-15,
   successTitle:'Jugar con reglas claras',successText:'La organización refuerza el control y lo encuentran haciendo trampa con un dispositivo intracorporal.',
   failureTitle:'Una acusación que pesa',failureText:'No encuentran nada y el ambiente se vuelve hostil.'},
  {id:'just-play',
   label:'Concentrarte en jugar',description:'Dejás la seguridad en manos de los árbitros.',chance:63,successElo:15,failureElo:-15,
   successTitle:'El tablero da la respuesta',successText:'Jugás una gran partida y ganás sin entrar en polémicas.',
   failureTitle:'La duda permanece',failureText:'Perdés una partida extraña y no podés dejar de pensar en lo ocurrido.'}]},

{id:'cheating-offer',minSeason:3,maxSeason:9,minLevel:2,maxLevel:7,
  title:'La oferta imposible',text:'Un intermediario te ofrece recibir jugadas de una computadora durante el próximo torneo. Promete que nadie podrá descubrirlo y que la victoria está asegurada.',
  realStory: {
    title: 'Varios casos de trampas en el ajedrez',
    description: 'En todos los niveles, aún en los más altos, se han encontrado tramposos. Yogures codificados, lentes especiales, zapatos con señales y toda clase de artilugios dignos del Superagente 86. Escuchá la columna completa y enterate de muchas polémicas.',
    spotifyUrl: 'https://open.spotify.com/episode/5aBKxkM4jva4xdXTmhQOmL?si=b4035782b72649b5'
  },
  choices:[
  {id:'accept-cheating',
   label:'Aceptar la ayuda',description:'Arriesgás toda tu carrera por una ventaja ilegal.',chance:0,successElo:0,failureElo:-200,
   successTitle:'El crimen perfecto',successText:'La asistencia funciona y nadie detecta nada.',
   failureTitle:'Una mancha permanente',failureText:'La trampa sale a la luz. Aunque puedas seguir jugando, ninguna actuación futura alcanza para llevarte al nivel más alto.'},
  {id:'reject-cheating',
   label:'Rechazar y denunciar',description:'Entregás los mensajes a la organización antes de jugar.',chance:100,successElo:15,failureElo:0,
   successTitle:'Los ganadores no usan drogas',successText:'La organización identifica al intermediario y tu denuncia evita que la oferta llegue a otros jugadores.',
   failureTitle:'La denuncia se pierde',failureText:'La cuenta desaparece antes de que puedan investigarla.'}]},

{id:'touched-piece--dispute',minSeason:4,maxSeason:10,minLevel:1,maxLevel:10,
  title:'Control + Z',text:'En plena partida decisiva tu rival mueve una pieza y, justo antes de completar la jugada, advierte que la casilla elegida pierde inmediatamente. Creés que la soltó por completo apenas un instante, pero tu rival sigue como si nada y el árbitro parece no haber visto nada.',
  realStory: {
    title: 'Kasparov cambia una jugada contra Judit Polgár (Linares, 1994).',
    description: 'Kasparov puso un caballo en una casilla, aparentemente soltándolo, y después lo llevó a otra. Polgár no reclamó inmediatamente y el árbitro no intervino; una grabación reavivó la discusión sobre si se había infringido la regla de pieza tocada y jugada realizada',
    spotifyUrl: 'https://open.spotify.com/episode/5boL5kCHF853K9IzLPYUt5?si=d3f87201603443cb'
  },
  choices:[
  {id:'reclamo',
   label:'Reclamar',description:'Le avisas al árbitro lo que sucedió',chance:70,successElo:15,failureElo:-12,
   successTitle:'El caballo queda mal colocado',successText:'Tu rival cuelga una pieza clave y pierde la partida.',
   failureTitle:'El árbitro no lo puede comprobar',failureText:'Tu rival deja el caballo donde quiere. La vergüenza y los nervios te ganan y terminas perdiendo la partida.'},
  {id:'no-reclamar',
   label:'No reclamar',description:'Sabes que no hay manera de comprobar que soltó la pieza y no llamas al arbitro.',chance:58,successElo:12,failureElo:-14,
   successTitle:'El tiempo te da la razón',successText:'A los pocos días sale un video donde se ve a tu rival soltando la pieza y moviendola nuevamente. La comunidad ajedrecistica te da la razón y queda entre las mayores polémicas de la historia.',
   failureTitle:'Los nervios te comen',failureText:'No podes dejar de pensar en lo sucedido y que deberías haber reclamado. Terminas perdiendo.'}]},

{id:'blindfold-simultaneous',minSeason:4,maxSeason:9,minLevel:4,maxLevel:10,
  title:'La exhibición a ciegas',text:'Un club vecino te invita a jugar una simultánea a ciegas. Puede darte visibilidad, pero nunca entrenaste sin mirar el tablero.',
  realStory: {
    title: 'Miguel Najdorf rompe el record de mayor cantidad de simultáneas a ciegas (1947)',
    description: 'En San Pablo, Miguel Najdorf disputó simultáneamente 45 partidas de ajedrez sin ver ninguno de los tableros. Después de casi un día de juego ganó 39, empató 4 y perdió apenas 2, estableciendo un récord mundial de simultáneas a ciegas. La exhibición tuvo además un motivo personal: Najdorf esperaba que la repercusión internacional pudiera ayudarlo a reencontrarse con su familia, de la que había quedado separado por la Segunda Guerra Mundial.',
    spotifyUrl: 'https://open.spotify.com/episode/5XIUyIjgJvuSE4AoH2BIbD?si=9a7d45dcd5674c13'
  },
  choices:[
  {id:'accept',
   label:'Aceptar la exhibición',description:'Confiás en tu memoria y te exponés ante el público.',chance:45,successElo:15,failureElo:-15,
   successTitle:'El tablero estaba en tu cabeza',successText:'Recordás cada posición y la exhibición se vuelve noticia.',
   failureTitle:'Una casilla fuera de lugar',failureText:'Confundís dos posiciones y regalás una dama frente a todos.'},
  {id:'decline',
   label:'Rechazar por ahora',description:'Preferís practicar antes de mostrarte.',chance:82,successElo:12,failureElo:-6,
   successTitle:'Preparación antes que espectáculo',successText:'El club respeta tu sinceridad y agenda otra fecha.',
   failureTitle:'La invitación no vuelve',failureText:'Otro juvenil ocupa el lugar y se lleva la atención.'}]},

{id:'presidential-first-move',minSeason:4,maxSeason:10,minLevel:1,maxLevel:10,
  title:'La primera jugada',text:'Arranca el Torneo Nacional y el presidente realiza ceremonialmente tu primer movimiento: 1. e4. Vos preparaste 1. d4. ¿Cambiás el movimiento?',
  realStory: {
    title: 'Najdorf corrige a Perón',
    description: 'En un Match contra la URSS en 1954, el ya argentino Miguel Najdorf juega contra David Bronstein. Perón juega 1.e4, pero Najdorf vuelve atrás y lo cambia por 1.d4 ante la mirada atónita del soviético que jamás podría hacer eso en su país.',
    spotifyUrl: 'https://open.spotify.com/episode/5XIUyIjgJvuSE4AoH2BIbD?si=o6a1rYUsQ7eVNeC5o4gVVQ&utm_source=copy-link&sci=spotify%3Acard-config%3A4S1gYhDgqMgtISZbJuOtLg'
  },
  choices:[
  {id:'change',
   label:'Cambiar a 1. d4',description:'Defender tu preparación.',chance:80,successElo:15,failureElo:-12,
   successTitle:'Conducir un país no es lo mismo que un tablero',successText:'Corregís la jugada, seguís tu preparación y conseguís una posición ganadora.',
   failureTitle:'No conocerá de ajedrez, pero conoce a las personas',failureText:'Tu rival esperaba exactamente 1. d4 y entra en una preparación demoledora.'},
  {id:'keep',
   label:'Mantener 1. e4',description:'Confiar en la intuición presidencial.',chance:80,successElo:15,failureElo:-12,
   successTitle:'El presidente sabe lo que hace',successText:'Por algo es el conductor del movimiento político más grande de la historia de Latinoamérica',
   failureTitle:'El presidente esperaba valentía',failureText:'El presidente se ofende: “No necesitamos obsecuentes sino personas valientes que se atrevan a hacer los mejores movimientos por la patria”.'}]},

{id:'marathon-match',minSeason:7,maxSeason:10,minLevel:6,maxLevel:10,
  title:'El match interminable',text:'El encuentro por el título lleva meses y ninguno consigue cerrar la serie. Tu rival empezó dominando, pero acabás de ganar dos partidas consecutivas y sentís que el match cambió. La organización propone suspenderlo por agotamiento.',
  realStory: {
    title: 'La suspensión de Karpov–Kasparov (1984–1985).',
    description: 'Después de 48 partidas y más de cinco meses, el presidente de FIDE Florencio Campomanes canceló el match cuando Karpov ganaba 5–3, pero Kasparov acababa de vencer dos partidas. Kasparov sostuvo que la decisión favoreció a Karpov; Campomanes alegó la salud de ambos.',
    spotifyUrl: 'https://open.spotify.com/episode/5xKh8b9NJOvcyGT4Jbx7cy?si=5286d8d1458e423f'
  },
  choices:[
  {id:'oppose-suspension',
   label:'Exigir que continúe',description:'Sentís que el impulso está de tu lado y no querés detenerte ahora.',chance:54,successElo:15,failureElo:-15,
   successTitle:'La remontada continúa',successText:'La organización mantiene el match y conseguís completar una remontada histórica.',
   failureTitle:'El cuerpo dice basta',failureText:'El cansancio acumulado termina pesando más que el buen momento y perdés las siguientes partidas.'},
  {id:'accept-suspension',
   label:'Aceptar la suspensión',description:'Priorizás la salud y preparás un nuevo match desde cero.',chance:72,successElo:13,failureElo:-10,
   successTitle:'Segunda oportunidad',successText:'Descansás, estudiás al rival y meses después volvés mucho mejor preparado.',
   failureTitle:'El momento se perdió',failureText:'Nunca recuperás el impulso que habías conseguido justo antes de la suspensión.'}]},

{id:'last-draw-offer',minSeason:4,maxSeason:10,minLevel:1,maxLevel:10,
  title:'La última oferta de tablas',text:'En la ronda final, aceptar tablas asegura el podio. Rechazarlas te deja luchar por el título, pero también podés terminar sin nada.',
  realStory: {
    title: 'Candela Francisco campeona mundial Sub-20 (2023)',
    description: 'Con 17 años, la argentina Candela Francisco llegó a la última ronda del Mundial Juvenil obligada a ganar. En una partida muy agresiva contra la búlgara Beloslava Krasteva, primero sacrificó un peón y, en pleno apuro de tiempo, realizó un espectacular sacrificio de dama en la jugada 39. Había calculado la continuación: su rival aceptó el sacrificio con el caballo y Candela lanzó un ataque decisivo que terminó dándole la victoria en 53 movimientos. Ese triunfo fue clave para consagrarse campeona mundial Sub-20 e invicta.',
    spotifyUrl: 'https://open.spotify.com/episode/6o1LILWOV138AZPCF4mM22?si=d1c3ba34eb81473a'
  },
  choices:[
  {id:'podium',
   label:'Asegurar el podio',description:'Un resultado histórico ya está al alcance.',chance:50,successElo:14,failureElo:-5,
   successTitle:'Un lugar en la historia',successText:'El podio confirma tu llegada a la élite y el club donde te formaste lo celebra toda la noche.',
   failureTitle:'El campeón quería más',failureText:'La tranquilidad dura poco: sabías que la posición daba para ganar.'},
  {id:'title',
   label:'Jugar por el título',description:'No llegaste hasta acá para especular.',chance:68,successElo:15,failureElo:-15,
   successTitle:'Campeonato contra todos los pronósticos',successText:'Sacrificás la dama y encontrás una combinación fantástica que te da la victoria.',
   failureTitle:'Caer de pie',failureText:'La victoria no aparece y terminás fuera del podio, pero nadie olvida la valentía.'}]},

{id:'shared-championship',minSeason:7,maxSeason:10,minLevel:6,maxLevel:10,
  title:'Una final que no termina',text:'Después de horas de desempates, vos y tu rival siguen completamente igualados. El reglamento indica que deben continuar jugando hasta que haya un ganador, pero ambos están exhaustos.',
  finalCandidate:true,
  realStory: {
    title: 'Carlsen y Nepomniachtchi comparten el Mundial de blitz (2024).',
    description: 'Tras empatar 2–2 la final y encadenar tres tablas en la muerte súbita, Carlsen propuso compartir el título. Nepomniachtchi aceptó y FIDE autorizó una solución que no estaba prevista expresamente como desenlace normal del formato. Parte del ambiente ajedrecístico criticó que las reglas se modificaran durante la propia final.',
    spotifyUrl: 'https://open.spotify.com/episode/5WClHJeut9qliRHCtImfSA?si=Kbsd1oWtQxaualpAil4Dug'
  },
  choices:[
  {id:'offer-shared-title',
   label:'Proponer compartir el título',description:'Le planteás al rival terminar la final como campeones conjuntos.',chance:63,successElo:14,failureElo:-10,
   successTitle:'Dos campeones',successText:'El rival acepta y la organización aprueba excepcionalmente el acuerdo.',
   failureTitle:'Las reglas son las reglas',failureText:'La organización rechaza la propuesta y la pausa termina desconcentrándote para la siguiente partida.'},
  {id:'keep-playing',
   label:'Seguir hasta que haya un ganador',description:'Aceptás el reglamento aunque nadie pueda calcular con claridad.',chance:51,successElo:15,failureElo:-15,
   successTitle:'Último en pie',successText:'Después de otra partida interminable encontrás el único error de tu rival y te quedás con el título.',
   failureTitle:'Una partida de más',failureText:'El cansancio te hace cometer un error elemental y perdés una final que parecía no terminar nunca.'}]},

{id:'dress-code-conflict',minSeason:3,maxSeason:9,minLevel:2,maxLevel:10,
  title:'El pantalón equivocado',text:'Llegás a una ronda importante usando una prenda que el reglamento del torneo prohíbe. El árbitro te multa y te pide que te cambies antes de la próxima partida, pero faltan pocos minutos para que empiece.',
  realStory: {
    title: 'Carlsen, los jeans y su ruptura temporal con FIDE (2024).',
    description: 'En el Mundial de rápidas de Nueva York, Carlsen recibió una multa de USD 200 por vestir jeans. Aceptó pagarla y prometió cambiarse al día siguiente, pero se negó a hacerlo inmediatamente. Por ello no fue emparejado en la novena ronda y decidió retirarse del torneo; técnicamente no fue expulsado de todo el campeonato. Tras negociar su regreso para el Mundial de blitz, FIDE flexibilizó la interpretación del código y admitió “desviaciones menores elegantes”, incluidos jeans apropiados combinados con una chaqueta.',
    spotifyUrl: 'https://open.spotify.com/episode/5WClHJeut9qliRHCtImfSA?si=Kbsd1oWtQxaualpAil4Dug'
  },
  choices:[
  {id:'change-clothes',
   label:'Ir a cambiarte',description:'Aceptás la regla aunque te parezca ridícula.',chance:85,successElo:10,failureElo:-8,
   successTitle:'La ropa no juega',successText:'Llegás justo a tiempo, ganás la ronda y la discusión queda para después.',
   failureTitle:'Un minuto demasiado tarde',failureText:'Volvés cambiado, pero el reloj ya había comenzado y la demora termina costándote la partida.'},
  {id:'refuse-change',
   label:'Negarte a cambiarte',description:'Pagás la multa, pero exigís jugar como estás.',chance:42,successElo:15,failureElo:-15,
   successTitle:'El reglamento se flexibiliza',successText:'La organización acepta una excepción y promete revisar la norma para el próximo torneo.',
   failureTitle:'Una ronda desde afuera',failureText:'El árbitro no te empareja y terminás abandonando el torneo en medio de la polémica.'}]},

{id:'repetition-protest',minSeason:4,maxSeason:10,minLevel:1,maxLevel:10,
  title:'Una partida que parece broma',text:'Con unas tablas clasifican cómodos vos y tu rival,.¿Para qué perder tiempo y energía?',
  realStory: {
    title: 'La “danza de los caballos” de Dubov y Nepomniachtchi (2023).',
    description: 'Ambos grandes maestros hicieron deliberadamente una secuencia absurda de movimientos de caballo y acordaron tablas por repetición. El árbitro consideró que habían desacreditado la competición y cambió el resultado a 0–0: ninguno recibió el medio punto. La apelación fue rechazada.',
    spotifyUrl: 'https://open.spotify.com/episode/5WClHJeut9qliRHCtImfSA?si=Kbsd1oWtQxaualpAil4Dug'
  },
  choices:[
  {id:'repetir',
   label:'Seguir con la repetición',description:'Aceptás la propuesta implícita y asegurás unas tablas rápidas.',chance:45,successElo:10,failureElo:-15,
   successTitle:'Medio punto y a descansar.',successText:'La repetición termina en tablas y guardás energía para la próxima ronda.',
   failureTitle:'Al árbitro no le gustó',failureText:'Considera que ambos desacreditaron la competencia y el resultado termina perjudicándolos.'},
  {id:'romper-secuencia',
   label:'Romper la secuencia',description:'Hacés una jugada distinta y obligás a que la partida se juegue en serio.',chance:60,successElo:11,failureElo:-12,
   successTitle:'La partida continúa',successText:'Rompés la repetición, encontrás una buena posición y terminás ganando.',
   failureTitle:'Había una razón para aceptar las tablas',failureText:'La nueva jugada empeora tu posición y tu rival aprovecha la oportunidad.'}]},

{id:'rating-sprint',minSeason:4,maxSeason:10,minLevel:1,maxLevel:10,
  title:'La carrera contra el calendario',text:'Te falta muy poco para alcanzar el requisito de partidas que te permitiría clasificar al torneo más importante de tu carrera. Tu federación propone organizar varios torneos pequeños en pocas semanas para que puedas llegar al mínimo reglamentario. Todo sería válido, aunque tus rivales seguramente cuestionarán la maniobra.',
  realStory: {
    title: 'La polémica clasificación de Ding Liren al Candidatos (2022).',
    description: 'Para alcanzar el mínimo de partidas exigido y entrar por rating, Ding jugó numerosos encuentros organizados apresuradamente en China. Aunque el procedimiento fue aceptado oficialmente, algunos rivales cuestionaron si respetaba el espíritu del sistema.',
    spotifyUrl: 'https://open.spotify.com/episode/27pdBR4ZblyckN6X7Vxqat?si=FllkIYmATmmKikup7GoEkA&utm_source=copy-link&sci=spotify%3Acard-config%3A4BrWALnJnbcl8N7YKRpKzI'
  },
  choices:[
  {id:'jugar',
   label:'Jugar todos los torneos',description:'Aprovechás que el reglamento lo permite e intentás completar las partidas necesarias.',chance:58,successElo:15,failureElo:-13,
   successTitle:'El calendario alcanza.',successText:'Completás las partidas necesarias, mantenés el rating y obtenés la clasificación.',
   failureTitle:'Demasiadas partidas, demasiado rápido.',failureText:'El cansancio te hace perder puntos y terminás más lejos de clasificar que al principio.'},
  {id:'otra-clasificacion',
   label:'Buscar otra clasificación',description:'Evitás cualquier cuestionamiento y apostás a conseguir la plaza por otra vía.',chance:54,successElo:13,failureElo:-11,
   successTitle:'Clasificación sin asteriscos',successText:'Conseguís la plaza en un torneo abierto y nadie puede discutir el resultado.',
   failureTitle:'El camino era demasiado largo',failureText:'No conseguís los puntos necesarios antes del cierre de la clasificación.'}]},

{id:'birthday-debut',minSeason:1,maxSeason:1,minLevel:1,maxLevel:2,
  title:'El cumpleaños y el debut',text:'El club organiza un torneo importante justo la noche del cumpleaños de tu hermana. Tu familia ya reservó la mesa.',
  choices:[
  {id:'play',
   label:'Jugar tu primer torneo',description:'Pedís perdón y corrés al club.',chance:65,successElo:15,failureElo:-15,
   successTitle:'Una noche inolvidable',successText:'Ganás una partida imposible y llegás al brindis con el trofeo bajo el brazo.',
   failureTitle:'Ni partida ni torta',failureText:'Perdés rápido y cuando llegás ya apagaron las velitas.'},
  {id:'family',
   label:'Elegir a la familia',description:'Le explicás a tu instructor que esta vez no podés.',chance:85,successElo:0,failureElo:-10,
   successTitle:'El ajedrez también sabe esperar',successText:'El instructor valora que hayas hablado de frente y te reserva el tablero para el próximo torneo.',
   failureTitle:'El tren no espera',failureText:'Otro juvenil ocupa tu lugar y juega tan bien que se queda con el título y el primer tablero del equipo.'}]},

{id:'first-open-road',minSeason:2,maxSeason:3,minLevel:1,maxLevel:10,
  title:'La ruta al primer abierto',text:'El torneo empieza temprano y queda a 600 kilómetros. El presupuesto alcanza para una sola comodidad.',
  choices:[
  {id:'bus',
   label:'Viajar de noche en micro',description:'Ahorrás plata, pero llegás directo a la ronda.',chance:55,successElo:15,failureElo:-15,
   successTitle:'Dormir es para después',successText:'Bajás del micro, tomás un mate y jugás la mejor partida de tu vida.',
   failureTitle:'La cabeza sigue en la ruta',failureText:'Confundís una combinación sencilla después de cabecear frente al tablero.'},
  {id:'hotel',
   label:'Pagar una noche de hotel',description:'Llegás descansado, aunque volvés sin un peso.',chance:62,successElo:15,failureElo:-11,
   successTitle:'Descanso bien invertido',successText:'La preparación aparece completa cuando el rival entra en tu variante.',
   failureTitle:'La almohada no juega',failureText:'Dormiste perfecto. Tanto que te quedó la cabeza en la almohada. Una sorpresa de apertura te deja sin respuestas.'}]},

{id:'exposed-repertoire',minSeason:2,maxSeason:7,minLevel:1,maxLevel:10,
  title:'Tu repertorio quedó expuesto',text:'Un rival publicó un video con todas tus partidas. Mañana se enfrentan y seguramente conoce tu apertura favorita y todas sus variantes.',
  choices:[
  {id:'switch',
   label:'Cambiar de apertura',description:'Lo sorprendés, pero salís de terreno conocido.',chance:48,successElo:15,failureElo:-15,
   successTitle:'Sorpresa total',successText:'El rival consume media hora tratando de recordar y entender una apertura que nunca estudió.',
   failureTitle:'Territorio desconocido',failureText:'La sorpresa funciona contra los dos: tampoco vos entendés la posición.'},
  {id:'trust',
   label:'Jugar lo que sabés',description:'Que conozca la apertura no significa que pueda jugarla mejor.',chance:64,successElo:15,failureElo:-11,
   successTitle:'Conocer no es dominar',successText:'Entrás en la línea publicada y encontrás una mejora sobre el tablero.',
   failureTitle:'Te estaba esperando',failureText:'El rival reproduce su preparación hasta conseguir una posición ganadora.'}]},

{id:'master-draw-offer',minSeason:3,maxSeason:10,minLevel:3,maxLevel:7,
  title:'La oferta del maestro',text:'Un gran maestro te ofrece tablas. La posición parece favorable, pero quedan dos minutos en el reloj.',
  choices:[
  {id:'reject',
   label:'Seguir jugando',description:'Buscás la victoria bajo presión.',chance:52,successElo:15,failureElo:-15,
   successTitle:'El día que volteaste a un gigante',successText:'Encontrás el único golpe táctico y el salón entero rodea tu tablero.',
   failureTitle:'Dos minutos son muy poco',failureText:'La ventaja se escapa y terminás perdiendo por tiempo.'},
  {id:'draw',
   label:'Aceptar las tablas',description:'Asegurás el resultado y el prestigio.',chance:85,successElo:8,failureElo:-12,
   successTitle:'Medio punto que pesa',successText:'El empate contra un gran maestro abre conversaciones en todo el circuito.',
   failureTitle:'La duda queda picando',failureText:'Después descubrís que tenías una victoria forzada y la noticia también circula.'}]},

{id:'sponsor-contract',minSeason:5,maxSeason:9,minLevel:1,maxLevel:10,
  title:'El contrato del patrocinador',text:'Una marca ofrece pagar todos tus viajes, pero exige que abandones la camiseta del club que te formó.',
  choices:[
  {id:'sign',
   label:'Firmar el contrato',description:'La carrera necesita recursos.',chance:76,successElo:15,failureElo:-14,
   successTitle:'El circuito se abre',successText:'Viajás a tres torneos fuertes y el roce internacional mejora tu juego.',
   failureTitle:'Un precio demasiado alto',failureText:'El contrato trae obligaciones absurdas y el club siente que le diste la espalda.'},
  {id:'decline',
   label:'Seguir con el club',description:'Buscás otra forma de financiarte.',chance:58,successElo:15,failureElo:-10,
   successTitle:'El barrio responde',successText:'Una colecta del club financia el viaje y jugás con todos alentando detrás.',
   failureTitle:'La cuenta no cierra',failureText:'No reunís lo necesario y perdés una fecha clave del circuito.'}]},

{id:'shared-preparation',minSeason:3,maxSeason:9,minLevel:1,maxLevel:10,
  title:'Preparación compartida',text:'Tu compañero de selección te pide el análisis secreto que preparaste. Podrían cruzarse en la última ronda.',
  choices:[
  {id:'share',
   label:'Compartir el análisis',description:'El equipo está primero.',chance:68,successElo:15,failureElo:-15,
   successTitle:'Dos cabezas calculan mejor',successText:'Él encuentra una mejora y juntos construyen una variante mucho más fuerte.',
   failureTitle:'Tu novedad, en tu contra',failureText:'El sorteo los cruza y usa exactamente esa preparación para vencerte.'},
  {id:'keepPrep',
   label:'Guardar el secreto',description:'Protegés meses de trabajo.',chance:58,successElo:14,failureElo:-9,
   successTitle:'La novedad sobrevive',successText:'La estrenás en el momento justo y conseguís un punto decisivo.',
   failureTitle:'El equipo toma nota',failureText:'Tus compañeros interpretan el silencio como desconfianza y dejan de compartir información.'}]},

{id:'fever-before-qualifier',minSeason:3,maxSeason:9,minLevel:1,maxLevel:10,
  title:'Fiebre antes de la selección',text:'Te levantás con fiebre el día del clasificatorio. El médico recomienda descanso, pero no habrá otra oportunidad este año.',
  finalCandidate:true,
  choices:[
  {id:'rest',
   label:'Escuchar al médico',description:'Cuidás tu salud y te repones.',chance:18,successElo:10,failureElo:-15,
   successTitle:'El cuerpo también juega',successText:'Te recuperás rápido y una baja inesperada te da fecha libre.',
   failureTitle:'La oportunidad pasa',failureText:'Nadie se baja y tenés que esperar un año completo.'},
  {id:'playSick',
   label:'Jugar igual',description:'Apostás todo a cuatro horas de concentración.',chance:38,successElo:15,failureElo:-15,
   successTitle:'Una hazaña con fiebre',successText:'Clasificás con una defensa memorable y terminás la partida directo en la cama.',
   failureTitle:'Las piezas se mueven solas',failureText:'El cansancio gana: dejás una dama en prise en una posición sencilla.'}]},

{id:'dubious-gambit',minSeason:2,maxSeason:10,minLevel:1,maxLevel:10,
  title:'El gambito dudoso',text:'Tu entrenador propone estrenar un gambito agresivo que el motor desaprueba, pero que puede sorprender al favorito.',
  choices:[
  {id:'play-gambit',
   label:'Jugar el gambito',description:'Apostás por iniciativa y sorpresa.',chance:42,successElo:15,failureElo:-15,
   successTitle:'La teoría quedó mirando',successText:'El rival consume todo su tiempo y cae bajo el ataque.',
   failureTitle:'El peón nunca volvió',failureText:'El ataque se apaga y terminás un peón abajo sin compensación.'},
  {id:'solid-line',
   label:'Elegir una línea sólida',description:'Priorizás una posición que comprendés.',chance:78,successElo:6,failureElo:-8,
   successTitle:'La paciencia suma puntos',successText:'Neutralizás al favorito y aprovechás su primer error.',
   failureTitle:'Demasiado respeto',failureText:'La posición igualada se vuelve pasiva y no encontrás contrajuego.'}]},

{id:'trainer-change',minSeason:2,maxSeason:9,minLevel:1,maxLevel:9,
  title:'Cambiar de entrenador',text:'Una entrenadora internacional te ofrece trabajar con vos, pero exige abandonar el método del profesor que te formó.',
  choices:[
  {id:'new-coach',
   label:'Aceptar el cambio',description:'Buscás una mirada nueva aunque duela la despedida.',chance:68,successElo:15,failureElo:-14,
   successTitle:'Una nueva forma de calcular',successText:'El nuevo método corrige debilidades que nadie había detectado.',
   failureTitle:'Demasiado, demasiado pronto',failureText:'Los cambios te llenan de dudas justo antes del torneo.'},
  {id:'old-coach',
   label:'Seguir con tu profesor',description:'Confiás en el vínculo construido durante años.',chance:75,successElo:15,failureElo:-10,
   successTitle:'La confianza también entrena',successText:'El profesor adapta el plan y recuperás tu mejor versión.',
   failureTitle:'El repertorio se estanca',failureText:'Los rivales ya conocen todas tus ideas habituales.'}]},

{id:'team-board-order',minSeason:2,maxSeason:8,minLevel:1,maxLevel:8,
  title:'El primer tablero',text:'El capitán te ofrece jugar en el primer tablero del equipo. El rival será mucho más fuerte y un mal resultado puede costar el match.',
  choices:[
  {id:'board-one',
   label:'Aceptar el primer tablero',description:'Tomás la responsabilidad más difícil.',chance:55,successElo:15,failureElo:-15,
   successTitle:'El equipo juega detrás tuyo',successText:'Sostenés al rival y tu empate permite ganar el match.',
   failureTitle:'La diferencia se sintió',failureText:'El rival impone su categoría y el equipo queda condicionado.'},
  {id:'board-two',
   label:'Mantener el segundo tablero',description:'Buscás un emparejamiento más equilibrado.',chance:85,successElo:15,failureElo:-6,
   successTitle:'Un punto bien elegido',successText:'Ganás tu partida y el plan del capitán funciona.',
   failureTitle:'La cuenta no alcanza',failureText:'El primer tablero pierde y tu resultado no compensa la diferencia.'}]},

{id:'time-control-choice',minSeason:1,maxSeason:10,minLevel:1,maxLevel:7,
  title:'Dos torneos, un fin de semana',text:'Coinciden un abierto rápido con premios altos y un torneo clásico ideal para tu preparación. Solo podés jugar uno.',
  choices:[
  {id:'rapid',
   label:'Jugar el rápido',description:'Más riesgo, más rivales y premio inmediato.',chance:52,successElo:15,failureElo:-15,
   successTitle:'Reflejos de campeón',successText:'Encadenás victorias y ganás el abierto por desempate.',
   failureTitle:'El reloj manda',failureText:'Una serie de apuros de tiempo te deja fuera de los premios.'},
  {id:'classical',
   label:'Jugar el clásico',description:'Elegís partidas largas y aprendizaje profundo.',chance:81,successElo:15,failureElo:-8,
   successTitle:'Las horas rinden',successText:'Tu preparación aparece y terminás invicto.',
   failureTitle:'Una semana para olvidar',failureText:'Dos finales interminables te agotan y perdés la última ronda.'}]},

{id:'seconds-advice',minSeason:4,maxSeason:9,minLevel:3,maxLevel:9,
  title:'El consejo del segundo',text:'Minutos antes de una partida decisiva, tu segundo recomienda cambiar toda la preparación porque vio algo preocupante.',
  choices:[
  {id:'trust-second',
   label:'Seguir su recomendación',description:'Confiás en su análisis de último momento.',chance:65,successElo:15,failureElo:-15,
   successTitle:'El detalle que cambió la partida',successText:'La corrección evita una novedad del rival y tomás la iniciativa.',
   failureTitle:'Preparación improvisada',failureText:'Entrás en una posición que ninguno de los dos comprende bien.'},
  {id:'own-plan',
   label:'Mantener tu plan',description:'Preferís una preparación conocida y asumís el riesgo.',chance:70,successElo:15,failureElo:-13,
   successTitle:'La convicción pesa',successText:'El rival evita su propia novedad y tu plan funciona.',
   failureTitle:'La advertencia era correcta',failureText:'Caés exactamente en la variante que tu segundo había detectado.'}]},

{id:'streamer-invitation',minSeason:3,maxSeason:10,minLevel:1,maxLevel:10,
  title:'La invitación del streamer',text:'Un creador famoso te invita a jugar partidas rápidas en vivo la noche anterior a una ronda importante.',
  choices:[
  {id:'stream',
   label:'Aceptar la transmisión',description:'Ganás exposición, pero sacrificás descanso.',chance:62,successElo:14,failureElo:-12,
   successTitle:'La cámara te potencia',successText:'La transmisión suma seguidores y llegás relajado a la ronda.',
   failureTitle:'Una partida de más',failureText:'Te acostás tarde y al día siguiente calculás con la cabeza pesada.'},
  {id:'study',
   label:'Apagar la cámara y estudiar',description:'Priorizás la ronda y el sueño.',chance:84,successElo:14,failureElo:-5,
   successTitle:'Silencio productivo',successText:'Encontrás una idea clave en las partidas de tu rival.',
   failureTitle:'La oportunidad mediática pasa',failureText:'La invitación no se repite y perdés una vidriera importante.'}]},

{id:'final-teach-or-play',minSeason:9,maxSeason:10,minLevel:1,maxLevel:10,
  title:'La mesa que queda libre',text:'El club que te formó quiere que dirijas su escuela. Al mismo tiempo llega una invitación para seguir una temporada más en el circuito profesional.',
  finalCandidate:true,
  choices:[
  {id:'teach',
   label:'Volver para enseñar',description:'Convertís tu experiencia en el comienzo de otras carreras.',chance:90,successElo:12,failureElo:-5,
   successTitle:'El tablero se multiplica',successText:'La primera camada llena el club y uno de tus alumnos gana el torneo que vos jugaste de chico.',
   failureTitle:'Enseñar también se aprende',failureText:'Descubrís que entender una posición y explicarla son talentos distintos.'},
  {id:'keep-playing',
   label:'Seguir compitiendo',description:'Todavía sentís que te queda una gran partida.',chance:50,successElo:15,failureElo:-15,
   successTitle:'Una temporada más',successText:'La invitación termina en otra actuación memorable y nadie vuelve a preguntarte por el retiro.',
   failureTitle:'El reloj da su veredicto',failureText:'El circuito nuevo juega más rápido de lo que recordabas y la despedida llega lejos de casa.'}]},

{id:'final-book-offer',minSeason:9,maxSeason:10,minLevel:1,maxLevel:10,
  title:'Las páginas de la carrera',text:'Una editorial quiere publicar tus cuadernos de preparación. Para contar toda la verdad tendrías que revelar errores, discusiones y secretos compartidos por tu equipo.',
  finalCandidate:true,
  choices:[
  {id:'publish-all',
   label:'Publicar sin recortes',description:'Contás la historia completa, incluso lo incómodo.',chance:58,successElo:15,failureElo:-15,
   successTitle:'La partida completa',successText:'El libro se vuelve una referencia porque muestra cuánto cuesta realmente llegar hasta arriba.',
   failureTitle:'Secretos en letra impresa',failureText:'Viejos compañeros sienten que usaste su confianza para escribir el final de tu historia.'},
  {id:'protect-team',
   label:'Guardar los secretos',description:'Preferís un relato incompleto antes que traicionar al equipo.',chance:88,successElo:10,failureElo:-6,
   successTitle:'El pacto sobrevive',successText:'Tus compañeros reconocen el gesto y juntos escriben una versión que todos pueden sostener.',
   failureTitle:'Un libro sin nervio',failureText:'La editorial considera que el manuscrito evita todo conflicto y cancela la publicación.'}]}
];
