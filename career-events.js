/**
 * Catálogo editable de situaciones.
 *
 * Para agregar una situación, copiá un objeto completo y cambiá:
 * - id: identificador único.
 * - minSeason / maxSeason: temporadas en las que puede aparecer (1–10).
 * - minLevel / maxLevel: niveles permitidos (1–10).
 * - choices[].chance: probabilidad interna de éxito; no se muestra al jugador.
 * - successElo / failureElo: puntos que se acumulan sobre el ELO base del nivel.
 */
export const careerEvents = [
{id:'birthday-debut',minSeason:1,maxSeason:1,minLevel:1,maxLevel:2,
  title:'El cumpleaños y el debut',text:'El club organiza un torneo importante justo la noche del cumpleaños de tu hermana. Tu familia ya reservó la mesa.',
  realStory: {
    title: 'El caso Hans Niemann vs. Magnus Carlsen',
    description: 'En 2022, una partida entre Niemann y Carlsen desencadenó una de las mayores polémicas recientes del ajedrez...',
    spotifyUrl: 'https://open.spotify.com/episode/...'
  },
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

{id:'master-draw-offer',minSeason:3,maxSeason:10,minLevel:3,maxLevel:10,
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

{id:'presidential-first-move',minSeason:4,maxSeason:10,minLevel:1,maxLevel:10,
  title:'La primera jugada',text:'Arranca el Torneo Nacional y el presidente realiza ceremonialmente tu primer movimiento: 1. e4. Vos preparaste 1. d4. ¿Cambiás el movimiento?',
  choices:[
  {id:'change',
   label:'Cambiar a 1. d4',description:'Defender tu preparación.',chance:80,successElo:15,failureElo:-12,
   successTitle:'Conducir un país no es lo mismo que un tablero',successText:'Corregís la jugada, seguís tu preparación y conseguís una posición ganadora.',
   failureTitle:'No conocerá de ajedrez, pero conoce a las personas',failureText:'Tu rival esperaba exactamente 1. d4 y entra en una preparación demoledora.'},
  {id:'keep',
   label:'Mantener 1. e4',description:'Confiar en la intuición presidencial.',chance:80,successElo:15,failureElo:-12,
   successTitle:'###Por algo es el conductor del movimiento político más grande de la historia de Latinoamérica',successText:'Por algo es el conductor del movimiento político más grande de la historia de Latinoamérica',
   failureTitle:'El presidente esperaba valentía',failureText:'El presidente se ofende: “No necesitamos obsecuentes sino personas valientes que se atrevan a hacer los mejores movimientos por la patria”.'}]},

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
  choices:[
  {id:'rest',
   label:'Escuchar al médico',description:'Cuidás tu salud y te repones.',chance:18,successElo:10,failureElo:-15,
   successTitle:'El cuerpo también juega',successText:'Te recuperás rápido y una baja inesperada te da fecha libre.',
   failureTitle:'La oportunidad pasa',failureText:'Nadie se baja y tenés que esperar un año completo.'},
  {id:'playSick',
   label:'Jugar igual',description:'Apostás todo a cuatro horas de concentración.',chance:38,successElo:15,failureElo:-15,
   successTitle:'Una hazaña con fiebre',successText:'Clasificás con una defensa memorable y terminás la partida directo en la cama.',
   failureTitle:'Las piezas se mueven solas',failureText:'El cansancio gana: dejás una dama en prise en una posición sencilla.'}]},

{id:'open-microphone',minSeason:7,maxSeason:10,minLevel:1,maxLevel:10,
  title:'El micrófono abierto',text:'Después de una derrota polémica te preguntan en vivo por la organización del torneo. Todavía estás furioso.',
  choices:[
  {id:'speak',
   label:'Decir todo lo que pensás',description:'Vas de frente aunque haya consecuencias.',chance:57,successElo:15,failureElo:-15,
   successTitle:'Alguien tenía que decirlo',successText:'Otros jugadores se suman y la organización corrige el reglamento.',
   failureTitle:'La frase recortada',failureText:'El video se viraliza sin contexto y recibís una sanción.'},
  {id:'calm',
   label:'Responder con calma',description:'Esperás a tener todos los datos.',chance:64,successElo:15,failureElo:-6,
   successTitle:'Cabeza fría fuera del tablero',successText:'Presentás el reclamo por escrito y el fallo se revisa.',
   failureTitle:'El silencio también habla',failureText:'La prensa interpreta tu prudencia como falta de carácter.'}]},

{id:'last-draw-offer',minSeason:4,maxSeason:9,minLevel:1,maxLevel:10,
  title:'La última oferta de tablas',text:'En la ronda final, aceptar tablas asegura el podio. Rechazarlas te deja luchar por el título, pero también podés terminar sin nada.',
  choices:[
  {id:'podium',
   label:'Asegurar el podio',description:'Un resultado histórico ya está al alcance.',chance:76,successElo:14,failureElo:-5,
   successTitle:'Un lugar en la historia',successText:'El podio confirma tu llegada a la élite y el barrio lo celebra toda la noche.',
   failureTitle:'El campeón quería más',failureText:'La tranquilidad dura poco: sabías que la posición daba para ganar.'},
  {id:'title',
   label:'Jugar por el título',description:'No llegaste hasta acá para especular.',chance:44,successElo:15,failureElo:-15,
   successTitle:'Campeón contra todos los pronósticos',successText:'Rechazás las tablas, encontrás la combinación y levantás la copa.',
   failureTitle:'Caer de pie',failureText:'La victoria no aparece y terminás fuera del podio, pero nadie olvida la valentía.'}]},

{id:'blindfold-simultaneous',minSeason:3,maxSeason:9,minLevel:3,maxLevel:10,
  title:'La exhibición a ciegas',text:'Un club vecino te invita a jugar una simultánea a ciegas. Puede darte visibilidad, pero nunca entrenaste sin mirar el tablero.',
  choices:[
  {id:'accept',
   label:'Aceptar la exhibición',description:'Confiás en tu memoria y te exponés ante el público.',chance:45,successElo:15,failureElo:-15,
   successTitle:'El tablero estaba en tu cabeza',successText:'Recordás cada posición y la exhibición se vuelve noticia.',
   failureTitle:'Una casilla fuera de lugar',failureText:'Confundís dos posiciones y regalás una dama frente a todos.'},
  {id:'decline',
   label:'Rechazar por ahora',description:'Preferís practicar antes de mostrarte.',chance:82,successElo:12,failureElo:-6,
   successTitle:'Preparación antes que espectáculo',successText:'El club respeta tu sinceridad y agenda otra fecha.',
   failureTitle:'La invitación no vuelve',failureText:'Otro juvenil ocupa el lugar y se lleva la atención.'}]},

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

{id:'engine-accusation',minSeason:5,maxSeason:10,minLevel:4,maxLevel:10,
  title:'Sospecha de asistencia',text:'Tu próximo rival viene jugando con una precisión extraña. Podés pedir controles adicionales antes de sentarte.',
  choices:[
  {id:'request-check',
   label:'Pedir controles',description:'Exigís garantías aunque genere tensión.',chance:42,successElo:15,failureElo:-15,
   successTitle:'Jugar con reglas claras',successText:'La organización refuerza el control y lo encuentran haciendo trampa con un dispositivo intracorporal.',
   failureTitle:'Una acusación que pesa',failureText:'No encuentran nada y el ambiente se vuelve hostil.'},
  {id:'just-play',
   label:'Concentrarte en jugar',description:'Dejás la seguridad en manos de los árbitros.',chance:63,successElo:15,failureElo:-15,
   successTitle:'El tablero da la respuesta',successText:'Jugás una gran partida y ganás sin entrar en polémicas.',
   failureTitle:'La duda permanece',failureText:'Perdés una partida extraña y no podés dejar de pensar en lo ocurrido.'}]},

{id:'preparation-leak',minSeason:4,maxSeason:10,minLevel:4,maxLevel:10,
  title:'La filtración',text:'Una captura de tu preparación privada aparece en un grupo de jugadores. No sabés cuánto material llegó a tu rival.',
  choices:[
  {id:'rewrite',
   label:'Rehacer la preparación',description:'Cambiás el repertorio con muy poco tiempo.',chance:58,successElo:15,failureElo:-15,
   successTitle:'Una novedad sobre la novedad',successText:'El rival sigue el archivo filtrado y cae en tu nueva idea.',
   failureTitle:'Demasiados cambios',failureText:'Mezclás variantes y te colgas una torre.'},
  {id:'keep-line',
   label:'Mantener la línea',description:'Confiás en que comprender vale más que memorizar.',chance:76,successElo:14,failureElo:-12,
   successTitle:'Saber por qué',successText:'Tu comprensión de la posición supera la preparación rival.',
   failureTitle:'Todo estaba en el archivo',failureText:'El rival reproduce una refutación hasta conseguir ventaja.'}]},

{id:'cheating-offer',minSeason:3,maxSeason:9,minLevel:2,maxLevel:7,
  title:'La oferta imposible',text:'Un intermediario te ofrece recibir jugadas de una computadora durante el próximo torneo. Promete que nadie podrá descubrirlo y que la victoria está asegurada.',
  choices:[
  {id:'accept-cheating',
   label:'Aceptar la ayuda',description:'Arriesgás toda tu carrera por una ventaja ilegal.',chance:0,successElo:0,failureElo:-15,maxLevelOnChoose:6,
   successTitle:'El crimen perfecto',successText:'La asistencia funciona y nadie detecta nada.',
   failureTitle:'Una mancha permanente',failureText:'La trampa sale a la luz. Aunque puedas seguir jugando, ninguna actuación futura alcanza para llevarte más allá del nivel 6.'},
  {id:'reject-cheating',
   label:'Rechazar y denunciar',description:'Entregás los mensajes a la organización antes de jugar.',chance:100,successElo:15,failureElo:0,
   successTitle:'Ganar sin atajos',successText:'La organización identifica al intermediario y tu denuncia evita que la oferta llegue a otros jugadores.',
   failureTitle:'La denuncia se pierde',failureText:'La cuenta desaparece antes de que puedan investigarla.'}]},

{id:'match-conditions',minSeason:6,maxSeason:9,minLevel:5,maxLevel:10,
  title:'Las condiciones del match',text:'Podés pedir una sala silenciosa y cerrada o aceptar un escenario con público para acercar el ajedrez a más gente.',
  choices:[
  {id:'quiet-room',
   label:'Pedir una sala cerrada',description:'Priorizás concentración y control.',chance:86,successElo:15,failureElo:-7,
   successTitle:'Cada pieza se escucha',successText:'El silencio te permite calcular con precisión durante horas.',
   failureTitle:'Demasiado aislado',failureText:'La atmósfera fría te quita energía en los momentos críticos.'},
  {id:'public-stage',
   label:'Jugar frente al público',description:'Aceptás ruido y presión a cambio de una gran vidriera.',chance:60,successElo:15,failureElo:-15,
   successTitle:'La multitud corea tu nombre',successText:'Convertís la presión en energía y ganás una partida histórica.',
   failureTitle:'El escenario pesa',failureText:'Cada movimiento provoca murmullos y perdés el hilo de la posición.'}]},

{id:'final-legacy',finalOnly:true,minSeason:9,maxSeason:10,minLevel:1,maxLevel:10,
  title:'La última planilla',text:'Llegaste a la última gran cita de la carrera. Podés proteger todo lo construido o jugar una vez más como si todavía no tuvieras nada que perder.',
  choices:[
  {id:'risk-it-all',
   label:'Jugar por la victoria',description:'Buscás cerrar la carrera con una partida inolvidable.',chance:55,successElo:15,failureElo:-15,
   successTitle:'El último jaque',successText:'Encontrás una combinación extraordinaria y tu carrera termina con todo el salón de pie.',
   failureTitle:'Una ambición de más',failureText:'Forzás una posición equilibrada y la última partida se escapa, aunque el camino recorrido ya nadie puede quitártelo.'},
  {id:'protect-legacy',
   label:'Cuidar el legado',description:'Elegís una línea sólida y hacés valer tu experiencia.',chance:85,successElo:15,failureElo:-8,
   successTitle:'La firma de una carrera',successText:'Controlás la partida de principio a fin y cerrás la planilla sin sobresaltos.',
   failureTitle:'Demasiada prudencia',failureText:'Cedés la iniciativa por evitar riesgos y tu rival convierte una ventaja mínima.'}]},

{id:'final-teach-or-play',finalOnly:true,minSeason:9,maxSeason:10,minLevel:1,maxLevel:10,
  title:'La mesa que queda libre',text:'El club que te formó quiere que dirijas su escuela. Al mismo tiempo llega una invitación para seguir una temporada más en el circuito profesional.',
  choices:[
  {id:'teach',
   label:'Volver para enseñar',description:'Convertís tu experiencia en el comienzo de otras carreras.',chance:90,successElo:12,failureElo:-5,
   successTitle:'El tablero se multiplica',successText:'La primera camada llena el club y uno de tus alumnos gana el torneo que vos jugaste de chico.',
   failureTitle:'Enseñar también se aprende',failureText:'Descubrís que entender una posición y explicarla son talentos distintos.'},
  {id:'keep-playing',
   label:'Seguir compitiendo',description:'Todavía sentís que te queda una gran partida.',chance:50,successElo:15,failureElo:-15,
   successTitle:'Una temporada más',successText:'La invitación termina en otra actuación memorable y nadie vuelve a preguntarte por el retiro.',
   failureTitle:'El reloj da su veredicto',failureText:'El circuito nuevo juega más rápido de lo que recordabas y la despedida llega lejos de casa.'}]},

{id:'final-book-offer',finalOnly:true,minSeason:9,maxSeason:10,minLevel:1,maxLevel:10,
  title:'Las páginas de la carrera',text:'Una editorial quiere publicar tus cuadernos de preparación. Para contar toda la verdad tendrías que revelar errores, discusiones y secretos compartidos por tu equipo.',
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
