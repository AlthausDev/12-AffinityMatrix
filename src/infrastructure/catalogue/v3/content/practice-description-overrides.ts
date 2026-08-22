export interface CataloguePracticeDescription {
  readonly en: string;
  readonly es: string;
}

/** Definitions for jargon or labels whose meaning is not obvious from the name alone. */
export const PRACTICE_DESCRIPTION_OVERRIDES: Readonly<Record<string, CataloguePracticeDescription>> = {
  'face-sitting': {
    en: 'A position where one person sits or kneels over the other person’s face for oral stimulation.',
    es: 'Postura en la que una persona se sienta o arrodilla sobre la cara de la otra para recibir estimulación oral.',
  },
  'guided-touch': {
    en: 'Guiding a partner’s hand or movement to show how and where you want to be touched.',
    es: 'Guiar la mano o el movimiento de la pareja para indicar cómo y dónde quieres que te toque.',
  },
  'perineum-massage': {
    en: 'Manual stimulation of the area between the genitals and anus.',
    es: 'Estimulación manual de la zona situada entre los genitales y el ano.',
  },
  'edging-manual': {
    en: 'Manual stimulation brought close to orgasm and then reduced or stopped before climax.',
    es: 'Estimulación manual llevada cerca del orgasmo y reducida o detenida antes del clímax.',
  },
  'forced-masturbation-roleplay': {
    en: 'A roleplay where one person directs or compels the other to masturbate as part of the scene.',
    es: 'Roleplay en el que una persona dirige u obliga dentro de la escena a la otra a masturbarse.',
  },
  'oral-teasing': {
    en: 'Using brief or interrupted oral stimulation to build anticipation rather than maintaining continuous stimulation.',
    es: 'Usar estimulación oral breve o interrumpida para aumentar la anticipación en lugar de mantenerla de forma continua.',
  },
  'oral-edging': {
    en: 'Using oral stimulation to approach orgasm repeatedly without reaching it immediately.',
    es: 'Usar estimulación oral para acercarse repetidamente al orgasmo sin alcanzarlo de inmediato.',
  },
  'spitting-semen': {
    en: 'Having semen in the mouth after oral sex and choosing to spit it out rather than swallow it.',
    es: 'Tener semen en la boca tras el sexo oral y preferir escupirlo en lugar de tragarlo.',
  },
  'cowgirl': {
    en: 'A penetrative position where the receiving partner is on top and faces the penetrating partner.',
    es: 'Postura de penetración en la que quien recibe está encima y mira hacia la persona que penetra.',
  },
  'reverse-cowgirl': {
    en: 'A penetrative position where the receiving partner is on top but faces away from the penetrating partner.',
    es: 'Postura de penetración en la que quien recibe está encima pero de espaldas a la persona que penetra.',
  },
  'doggy-style': {
    en: 'Penetration from behind while the receiving partner is supported on hands, elbows or knees.',
    es: 'Penetración desde atrás mientras quien recibe se apoya sobre manos, codos o rodillas.',
  },
  'lotus-position': {
    en: 'A face-to-face seated position with bodies close together and the receiving partner around the other person’s hips.',
    es: 'Postura sentada cara a cara, con los cuerpos juntos y quien recibe rodeando con las piernas las caderas de la otra persona.',
  },
  'double-vaginal-penetration': {
    en: 'Simultaneous penetration of the vagina by two penetrating objects or partners.',
    es: 'Penetración simultánea de la vagina por dos objetos o personas.',
  },
  'double-anal-penetration': {
    en: 'Simultaneous penetration of the anus by two penetrating objects or partners.',
    es: 'Penetración simultánea del ano por dos objetos o personas.',
  },
  'fisting-vaginal': {
    en: 'Gradual insertion of part or all of a hand into the vagina.',
    es: 'Introducción gradual de parte o de toda una mano en la vagina.',
  },
  'fisting-anal': {
    en: 'Gradual insertion of part or all of a hand into the anus.',
    es: 'Introducción gradual de parte o de toda una mano en el ano.',
  },
  'cervix-contact': {
    en: 'Deep vaginal penetration where contact with the cervix is part of the desired sensation.',
    es: 'Penetración vaginal profunda en la que el contacto con el cuello uterino forma parte de la sensación buscada.',
  },
  'wand-vibrator': {
    en: 'A larger external vibrator with a broad vibrating head, commonly used on external body areas.',
    es: 'Vibrador externo de mayor tamaño con una cabeza vibratoria amplia, usado habitualmente sobre zonas externas del cuerpo.',
  },
  'bullet-vibrator': {
    en: 'A small compact vibrator designed for focused stimulation and easy positioning.',
    es: 'Vibrador pequeño y compacto diseñado para estimulación localizada y fácil colocación.',
  },
  'rabbit-vibrator': {
    en: 'A vibrator designed to stimulate the vagina internally and the external genitals at the same time.',
    es: 'Vibrador diseñado para estimular a la vez el interior de la vagina y los genitales externos.',
  },
  'double-ended-dildo': {
    en: 'A dildo with usable ends on both sides, allowing shared or differently positioned use.',
    es: 'Dildo utilizable por ambos extremos, que permite uso compartido o distintas posiciones.',
  },
  'anal-beads': {
    en: 'A sequence of connected beads designed for gradual anal insertion and removal.',
    es: 'Serie de bolas conectadas diseñada para introducción y extracción anal gradual.',
  },
  'butt-plug-tail': {
    en: 'An anal plug with an attached decorative tail, often used for appearance or roleplay.',
    es: 'Plug anal con una cola decorativa, usado a menudo por estética o en roleplay.',
  },
  'strap-on': {
    en: 'A penetrative toy worn with a harness so the wearer can penetrate a partner.',
    es: 'Juguete de penetración sujeto con un arnés para que quien lo lleva pueda penetrar a su pareja.',
  },
  'strapless-strap-on': {
    en: 'A harness-free penetrative toy designed to be retained by the wearer while another end penetrates a partner.',
    es: 'Juguete de penetración sin arnés diseñado para que quien lo lleva lo mantenga sujeto mientras el otro extremo penetra a la pareja.',
  },
  'penis-sleeve': {
    en: 'A sleeve worn over the penis to change texture, thickness or the sensation of penetration.',
    es: 'Funda que se coloca sobre el pene para modificar textura, grosor o sensación durante la penetración.',
  },
  'masturbator-sleeve': {
    en: 'A handheld sleeve that surrounds the penis and provides friction or textured stimulation.',
    es: 'Funda de mano que rodea el pene y proporciona fricción o estimulación con textura.',
  },
  'penis-pump': {
    en: 'A vacuum device placed around the penis to create temporary engorgement and pressure sensation.',
    es: 'Dispositivo de vacío que se coloca alrededor del pene para producir congestión temporal y sensación de presión.',
  },
  'kegel-balls': {
    en: 'Weighted or linked balls worn inside the vagina, often for pelvic-floor sensation or play.',
    es: 'Bolas con peso o unidas que se llevan dentro de la vagina, usadas para sensación o juego del suelo pélvico.',
  },
  'remote-control-toy': {
    en: 'A toy whose intensity or pattern can be controlled from a distance by a partner or remote device.',
    es: 'Juguete cuya intensidad o patrón puede controlarse a distancia por la pareja o mediante un mando.',
  },
  'wearable-vibrator': {
    en: 'A vibrator designed to stay in place on or inside the body while moving or during other activity.',
    es: 'Vibrador diseñado para permanecer colocado sobre o dentro del cuerpo mientras se realizan otras actividades.',
  },
  'sex-machine': {
    en: 'A powered device that produces repeated penetrative movement with an attached toy.',
    es: 'Dispositivo motorizado que produce movimiento repetido de penetración mediante un juguete acoplado.',
  },
  pinwheel: {
    en: 'A Wartenberg wheel: a small spiked wheel rolled over the skin to create sharp, localized sensation.',
    es: 'Rueda de Wartenberg: pequeña rueda con puntas que se hace rodar sobre la piel para producir una sensación aguda y localizada.',
  },
  'vacuum-cup-toys': {
    en: 'Toys fixed to a smooth surface with a suction base for hands-free positioning.',
    es: 'Juguetes fijados a una superficie lisa mediante ventosa para poder usarlos sin sujetarlos con las manos.',
  },
  edging: {
    en: 'Repeatedly approaching orgasm and reducing or stopping stimulation before climax.',
    es: 'Acercarse repetidamente al orgasmo y reducir o detener la estimulación antes del clímax.',
  },
  'orgasm-denial': {
    en: 'Deliberately preventing or postponing orgasm for a period of time as part of the sexual dynamic.',
    es: 'Impedir o posponer deliberadamente el orgasmo durante un periodo como parte de la dinámica sexual.',
  },
  'ruined-orgasm': {
    en: 'Allowing orgasm to begin while reducing stimulation so the climax is intentionally less complete or satisfying.',
    es: 'Dejar que comience el orgasmo reduciendo la estimulación para que el clímax sea deliberadamente menos completo o satisfactorio.',
  },
  overstimulation: {
    en: 'Continuing stimulation beyond the point where it becomes unusually intense, often after orgasm.',
    es: 'Continuar la estimulación más allá del punto en que se vuelve especialmente intensa, a menudo después del orgasmo.',
  },
  swinging: {
    en: 'A couple-based context in which partners have sexual activity with other people or couples under agreed rules.',
    es: 'Contexto de pareja en el que sus miembros mantienen actividad sexual con otras personas o parejas según reglas acordadas.',
  },
  'hotwife-dynamic': {
    en: 'A relationship fantasy or dynamic centered on a woman having sex with other people while her partner knows or participates in the dynamic.',
    es: 'Fantasía o dinámica de pareja centrada en que una mujer tenga sexo con otras personas mientras su pareja lo sabe o participa en la dinámica.',
  },
  'cuckold-dynamic': {
    en: 'A dynamic centered on a man whose partner has sex with someone else, often with an erotic focus on watching, exclusion or humiliation.',
    es: 'Dinámica centrada en un hombre cuya pareja tiene sexo con otra persona, a menudo con foco erótico en mirar, quedar excluido o la humillación.',
  },
  'cuckquean-dynamic': {
    en: 'The counterpart of a cuckold dynamic centered on a woman whose partner has sex with someone else.',
    es: 'Equivalente femenino de la dinámica cuckold, centrada en una mujer cuya pareja tiene sexo con otra persona.',
  },
  'same-room-sex': {
    en: 'Two or more couples have sex in the same room while remaining primarily with their own partners.',
    es: 'Dos o más parejas mantienen relaciones en la misma habitación permaneciendo principalmente con su propia pareja.',
  },
  'pet-play': {
    en: 'Roleplay where one person adopts an animal-like role or behavior and another may act as handler or owner.',
    es: 'Roleplay en el que una persona adopta un rol o comportamiento animal y otra puede ejercer de guía o dueño/a.',
  },
  'primal-play': {
    en: 'Physical roleplay focused on instinctive behavior such as chasing, wrestling, growling or rough body interaction.',
    es: 'Roleplay físico centrado en conductas instintivas como perseguir, forcejear, gruñir o interactuar corporalmente con intensidad.',
  },
  'sleep-roleplay': {
    en: 'A scene built around the fantasy of one participant being asleep or unresponsive.',
    es: 'Escena construida alrededor de la fantasía de que una de las personas está dormida o no responde.',
  },
  voyeurism: {
    en: 'Watching sexual activity or being watched during it; the two roles are rated separately.',
    es: 'Mirar actividad sexual o ser observado/a durante ella; los dos roles se valoran por separado.',
  },
  'private-recording': {
    en: 'Recording sexual activity for private viewing, typically as video rather than still photography.',
    es: 'Grabar actividad sexual para verla de forma privada, normalmente en vídeo en lugar de fotografía fija.',
  },
  'webcam-performance-private': {
    en: 'Performing sexually for a partner through a private camera feed while the partner watches remotely.',
    es: 'Actuar sexualmente para la pareja mediante una cámara privada mientras la otra persona mira a distancia.',
  },
  'curtains-open-private': {
    en: 'Creating the possibility or fantasy of being visible from outside while remaining in a private space.',
    es: 'Crear la posibilidad o fantasía de poder ser visto desde fuera mientras se permanece en un espacio privado.',
  },
  'dungeon-venue': {
    en: 'A venue equipped for BDSM scenes, often with dedicated furniture, restraint points and equipment.',
    es: 'Local equipado para escenas BDSM, normalmente con mobiliario, puntos de sujeción y material específico.',
  },
  'glory-hole': {
    en: 'A scenario involving sexual contact through an opening in a wall or partition that limits visual contact.',
    es: 'Escenario con contacto sexual a través de una abertura en una pared o separación que limita el contacto visual.',
  },
  protocol: {
    en: 'A structured set of expected behaviors, rituals or forms of address within a power dynamic.',
    es: 'Conjunto estructurado de conductas, rituales o formas de dirigirse a la otra persona dentro de una dinámica de poder.',
  },
  training: {
    en: 'A repeated process of teaching and reinforcing behaviors or responses within a power dynamic.',
    es: 'Proceso repetido de enseñar y reforzar conductas o respuestas dentro de una dinámica de poder.',
  },
  ownership: {
    en: 'A symbolic power dynamic in which one person is treated as belonging to or being owned by the other.',
    es: 'Dinámica simbólica de poder en la que una persona es tratada como perteneciente o propiedad de la otra.',
  },
  collaring: {
    en: 'Giving, receiving or wearing a collar as a symbol of a power relationship, commitment or role.',
    es: 'Dar, recibir o llevar un collar como símbolo de una relación de poder, compromiso o rol.',
  },
  'permission-dynamic': {
    en: 'A dynamic where selected actions require asking or receiving permission from the controlling partner.',
    es: 'Dinámica en la que determinadas acciones requieren pedir o recibir permiso de la pareja que ejerce el control.',
  },
  'rope-bondage': {
    en: 'Using rope to restrict movement, hold a position or create decorative ties.',
    es: 'Usar cuerda para limitar el movimiento, mantener una postura o crear ataduras decorativas.',
  },
  hogtie: {
    en: 'A restraint position linking wrists and ankles behind the body.',
    es: 'Postura de inmovilización que une muñecas y tobillos por detrás del cuerpo.',
  },
  frogtie: {
    en: 'A bondage position with the legs folded so the ankles are tied close to the thighs.',
    es: 'Postura de bondage con las piernas plegadas de forma que los tobillos quedan sujetos cerca de los muslos.',
  },
  'box-tie': {
    en: 'An upper-body rope tie that holds the arms folded or positioned behind the torso.',
    es: 'Atadura de cuerda del torso que mantiene los brazos doblados o colocados detrás del cuerpo.',
  },
  'chest-harness-bondage': {
    en: 'A rope harness constructed around the chest and upper torso, for restraint, structure or attachment.',
    es: 'Arnés de cuerda construido alrededor del pecho y torso superior, usado para restricción, estructura o anclaje.',
  },
  'ball-gag': {
    en: 'A gag with a ball held in the mouth by a strap around the head.',
    es: 'Mordaza con una bola mantenida dentro de la boca mediante una correa alrededor de la cabeza.',
  },
  'bit-gag': {
    en: 'A gag with a bar or bit held between the teeth, visually similar to an equestrian bit.',
    es: 'Mordaza con una barra o bocado entre los dientes, similar visualmente a un bocado ecuestre.',
  },
  'ring-gag': {
    en: 'A gag with an open ring that holds the mouth open rather than filling it.',
    es: 'Mordaza con un aro abierto que mantiene la boca abierta en lugar de ocuparla.',
  },
  'stocks-restraint': {
    en: 'A rigid restraint that fixes the head and/or limbs through openings in a frame.',
    es: 'Restricción rígida que fija la cabeza y/o las extremidades mediante aberturas en una estructura.',
  },
  degradation: {
    en: 'Erotic treatment intended to make the receiving partner feel lowered, demeaned or reduced in status.',
    es: 'Trato erótico destinado a hacer que quien lo recibe se sienta rebajado, degradado o reducido de estatus.',
  },
  objectification: {
    en: 'Treating a person within the scene primarily as an object, body or function rather than as an equal social participant.',
    es: 'Tratar a una persona dentro de la escena principalmente como objeto, cuerpo o función en lugar de como participante social en igualdad.',
  },
  'furniture-roleplay': {
    en: 'Objectification roleplay where a person is positioned or used symbolically as a piece of furniture.',
    es: 'Roleplay de objetificación en el que una persona se coloca o utiliza simbólicamente como una pieza de mobiliario.',
  },
  'brat-dynamic': {
    en: 'A playful power dynamic where the submissive role resists, provokes or challenges and the other role responds by managing or taming it.',
    es: 'Dinámica de poder juguetona en la que el rol sumiso provoca, se resiste o desafía y el otro rol responde controlándolo o “domándolo”.',
  },
  paddling: {
    en: 'Impact play using a flat paddle, usually producing a broad, relatively blunt strike.',
    es: 'Juego de impacto con una pala plana, que normalmente produce un golpe amplio y relativamente romo.',
  },
  flogging: {
    en: 'Impact play using a multi-tailed flogger, producing repeated strokes over a wider area.',
    es: 'Juego de impacto con un flogger de varias tiras, produciendo golpes repetidos sobre una zona amplia.',
  },
  caning: {
    en: 'Impact play using a thin rigid cane, which produces a narrow and sharper line of sensation.',
    es: 'Juego de impacto con una vara fina y rígida, que produce una sensación más aguda y concentrada en una línea.',
  },
  cropping: {
    en: 'Impact play using a riding crop, a short flexible implement with a small striking tip.',
    es: 'Juego de impacto con una fusta, instrumento corto y flexible con una pequeña zona de golpeo.',
  },
  'pressure-points': {
    en: 'Applying controlled pressure to small areas of the body to create focused discomfort or intense sensation.',
    es: 'Aplicar presión controlada en zonas pequeñas del cuerpo para producir molestia localizada o sensación intensa.',
  },
  'electrostimulation-mild': {
    en: 'Using purpose-built electrical stimulation equipment at lower intensities to create tingling or muscle sensation.',
    es: 'Usar equipos específicos de electroestimulación a intensidades bajas para producir hormigueo o sensación muscular.',
  },
  'sensory-deprivation': {
    en: 'Reducing one or more senses, such as sight or hearing, to increase uncertainty and focus on other sensations.',
    es: 'Reducir uno o varios sentidos, como vista u oído, para aumentar la incertidumbre y centrar la atención en otras sensaciones.',
  },
  'sensory-overload': {
    en: 'Combining multiple strong sensations or stimuli at once so the experience becomes deliberately overwhelming.',
    es: 'Combinar varias sensaciones o estímulos intensos a la vez para que la experiencia resulte deliberadamente abrumadora.',
  },
  'creampie-cleanup': {
    en: 'Sexual play centered on cleaning or removing semen after internal ejaculation.',
    es: 'Juego sexual centrado en limpiar o retirar semen después de una eyaculación interna.',
  },
  'urine-play': {
    en: 'Sexual play involving urine, with giving and receiving roles rated separately.',
    es: 'Juego sexual que implica orina, valorando por separado los roles de dar y recibir.',
  },
  'breath-play': {
    en: 'A broad category of scenes involving deliberate restriction or alteration of breathing.',
    es: 'Categoría amplia de escenas que implican restringir o alterar deliberadamente la respiración.',
  },
  'needle-play': {
    en: 'Using sterile needles on or through the skin as the primary source of sensation or visual effect.',
    es: 'Usar agujas estériles sobre o a través de la piel como fuente principal de sensación o efecto visual.',
  },
  'piercing-play': {
    en: 'Temporary piercing during a scene, usually using needles placed through the skin and removed afterwards.',
    es: 'Piercing temporal durante una escena, normalmente colocando agujas a través de la piel y retirándolas después.',
  },
  'scarification-fantasy': {
    en: 'A fantasy centered on intentionally creating lasting decorative scars or scar patterns.',
    es: 'Fantasía centrada en crear intencionadamente cicatrices decorativas o patrones permanentes.',
  },
  'branding-fantasy': {
    en: 'A fantasy centered on creating a lasting mark through controlled burning or branding.',
    es: 'Fantasía centrada en crear una marca permanente mediante quemado o marcado controlado.',
  },
  'suspension-bondage': {
    en: 'Bondage in which some or all body weight is supported by ropes or restraint equipment above the ground.',
    es: 'Bondage en el que parte o todo el peso del cuerpo queda sostenido por cuerdas o material de sujeción por encima del suelo.',
  },
  'inversion-bondage': {
    en: 'Bondage that places the restrained person partly or fully upside down.',
    es: 'Bondage que coloca a la persona inmovilizada parcial o completamente boca abajo o invertida.',
  },
  'vacuum-bed': {
    en: 'A flexible latex enclosure from which air is removed, holding the body tightly between sheets while breathing remains externally supported.',
    es: 'Envolvente flexible de látex de la que se extrae el aire, sujetando el cuerpo entre láminas mientras la respiración se mantiene por una vía externa.',
  },
  'vacuum-cube': {
    en: 'A vacuum enclosure with a more compact cube-like shape that compresses or contains the body when air is removed.',
    es: 'Envolvente de vacío de forma más compacta o cúbica que comprime o contiene el cuerpo al extraer el aire.',
  },
};
