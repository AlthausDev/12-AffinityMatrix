import { Locale } from './locale';

export type CatalogueGlossaryCategory =
  | 'anatomy'
  | 'orgasm-control'
  | 'groups-non-monogamy'
  | 'visibility-media'
  | 'power-service'
  | 'restraint'
  | 'psychological'
  | 'sensation'
  | 'fluids'
  | 'roleplay-fantasy'
  | 'toys-penetration'
  | 'edge';

export interface CatalogueGlossaryEntry {
  readonly id: string;
  readonly category: CatalogueGlossaryCategory;
  readonly aliases: readonly string[];
  readonly titleEn: string;
  readonly titleEs: string;
  readonly en: string;
  readonly es: string;
}

export interface LocalizedCatalogueGlossaryEntry {
  readonly id: string;
  readonly category: CatalogueGlossaryCategory;
  readonly title: string;
  readonly definition: string;
  readonly aliases: readonly string[];
}

export interface CatalogueGlossarySegment {
  readonly text: string;
  readonly termId?: string;
  readonly definition?: string;
}

/**
 * Shared glossary data for inline explanations now and the dedicated glossary screen planned for a
 * later version. Definitions explain the concept; they intentionally avoid operational instructions.
 */
export const CATALOGUE_GLOSSARY: readonly CatalogueGlossaryEntry[] = [
  // Anatomy
  term('anatomy', 'vulva', 'Vulva', 'Vulva', ['vulva'],
    'The external female genital anatomy, including structures such as the labia and clitoris. It is not the same as the vagina.',
    'Conjunto de genitales externos femeninos, como labios y clítoris. No es lo mismo que la vagina.'),
  term('anatomy', 'vagina', 'Vagina', 'Vagina', ['vagina'],
    'The internal muscular canal that connects the vulvar opening with the cervix. DesireSync separates it from external vulvar attraction.',
    'Canal muscular interno que comunica la abertura vulvar con el cuello uterino. DesireSync lo separa de la atracción por la vulva externa.'),
  term('anatomy', 'prostate', 'Prostate', 'Próstata', ['prostate', 'próstata'],
    'A gland in male anatomy that can be an erotic focus through internal or external stimulation.',
    'Glándula de la anatomía masculina que puede ser un foco erótico mediante estimulación interna o externa.'),

  // Orgasm & control
  term('orgasm-control', 'creampie', 'Creampie', 'Creampie', ['creampie'],
    'Ejaculation inside the vagina or anus. DesireSync asks vaginal and anal creampie separately.',
    'Eyaculación dentro de la vagina o del ano. DesireSync pregunta por separado el creampie vaginal y el anal.'),
  term('orgasm-control', 'edging', 'Edging', 'Edging', ['edging'],
    'Repeatedly approaching orgasm and then reducing or pausing stimulation before climax.',
    'Acercarse repetidamente al orgasmo y reducir o pausar la estimulación antes del clímax.'),
  term('orgasm-control', 'tease-denial', 'Tease & denial', 'Tease & denial', ['tease and denial', 'tease & denial'],
    'Erotic teasing combined with deliberately delaying or denying orgasm.',
    'Provocación erótica combinada con retrasar o negar deliberadamente el orgasmo.'),
  term('orgasm-control', 'orgasm-denial', 'Orgasm denial', 'Negación del orgasmo', ['orgasm denial'],
    'A power or teasing dynamic where orgasm is deliberately not allowed for a period or scene.',
    'Dinámica de control o provocación donde no se permite el orgasmo durante un periodo o una escena.'),
  term('orgasm-control', 'ruined-orgasm', 'Ruined orgasm', 'Orgasmo arruinado', ['ruined orgasm'],
    'An orgasm whose stimulation is deliberately interrupted or changed so the climax feels incomplete or reduced.',
    'Orgasmo cuya estimulación se interrumpe o cambia deliberadamente para que el clímax resulte incompleto o reducido.'),
  term('orgasm-control', 'forced-orgasm', 'Forced orgasm', 'Orgasmo forzado consensuado', ['forced orgasm'],
    'A consensual dynamic where stimulation continues with the intention of making the receptive person orgasm despite the roleplayed loss of control.',
    'Dinámica consensuada donde la estimulación continúa buscando que la persona receptiva llegue al orgasmo pese a la pérdida de control representada en el juego.'),

  // Groups & consensual non-monogamy
  term('groups-non-monogamy', 'swinging', 'Swinging', 'Swinging', ['swinging'],
    'Consensual sexual activity involving couples and other people or couples, with boundaries agreed by those involved.',
    'Actividad sexual consensuada donde una pareja interactúa con otras personas o parejas según límites acordados.'),
  term('groups-non-monogamy', 'soft-swap', 'Soft swap', 'Soft swap', ['soft swap', 'soft-swap'],
    'Swinging with sexual contact between people from different couples but without full penetrative partner exchange.',
    'Swinging con contacto sexual entre personas de parejas distintas, pero sin intercambio completo de pareja con penetración.'),
  term('groups-non-monogamy', 'full-swap', 'Full swap', 'Full swap', ['full swap', 'full-swap'],
    'Swinging where couples allow full sexual partner exchange.',
    'Swinging donde las parejas permiten un intercambio sexual completo de pareja.'),
  term('groups-non-monogamy', 'hotwife', 'Hotwife', 'Hotwife', ['hotwife'],
    'The woman is the focus: she has sex with other people with her partner’s knowledge or encouragement. Humiliation is not inherent. If the main erotic focus is the male partner’s role as the partner of someone having sex with others, that framing is cuckold.',
    'El foco está en la mujer: ella tiene sexo con terceros con conocimiento o estímulo de su pareja. La humillación no es inherente. Si el atractivo principal está en el papel del hombre como pareja de alguien que tiene sexo con terceros, el marco es cuckold.'),
  term('groups-non-monogamy', 'cuckold', 'Cuckold', 'Cuckold', ['cuckold'],
    'The man is the focus: his partner has sex with other people and his role as that partner is itself erotic. Jealousy, exclusion, submission or humiliation may be included, but are not mandatory. If the focus is mainly her activity with others, hotwife is clearer.',
    'El foco está en el hombre: su pareja tiene sexo con terceros y su papel como esa pareja forma parte del atractivo. Puede haber celos erotizados, exclusión, sumisión o humillación, pero no es obligatorio. Si el foco está principalmente en la actividad de ella con terceros, hotwife es más claro.'),
  term('groups-non-monogamy', 'cuckquean', 'Cuckquean', 'Cuckquean', ['cuckquean'],
    'The female counterpart to the cuckold framing: the woman’s role as the partner of someone having sex with others is itself part of the appeal.',
    'Equivalente femenino del marco cuckold: el papel de la mujer como pareja de alguien que tiene sexo con terceros forma parte del atractivo.'),
  term('groups-non-monogamy', 'gangbang', 'Gangbang', 'Gangbang', ['gangbang'],
    'Group sex where several participants focus sexual attention on one central participant.',
    'Sexo en grupo donde varias personas concentran la atención sexual en una persona central.'),
  term('groups-non-monogamy', 'same-room-sex', 'Same-room sex', 'Sexo en la misma habitación', ['same-room sex'],
    'Two or more couples have sex in the same space while remaining with their own partners.',
    'Dos o más parejas tienen sexo en el mismo espacio manteniéndose con sus propias parejas.'),

  // Visibility, voyeurism & media
  term('visibility-media', 'voyeurism', 'Voyeurism', 'Voyeurismo', ['voyeurism', 'voyeurismo'],
    'Consensual erotic interest in watching a partner or sexual activity. In DesireSync it does not mean secretly watching unaware people.',
    'Interés erótico consensuado en observar a la pareja o actividad sexual. En DesireSync no significa observar en secreto a personas que no lo saben.'),
  term('visibility-media', 'exhibitionism', 'Exhibitionism', 'Exhibicionismo', ['exhibitionism', 'exhibicionismo'],
    'Consensual erotic interest in deliberately being seen, watched, posed or displayed.',
    'Interés erótico consensuado en dejarse ver, ser observado/a, posar o mostrarse deliberadamente.'),
  term('visibility-media', 'striptease', 'Striptease', 'Striptease', ['striptease'],
    'A deliberate erotic undressing performance for another person, rather than simply getting undressed while being watched.',
    'Actuación erótica basada en desvestirse deliberadamente para otra persona, distinta de simplemente desnudarse mientras te miran.'),
  term('visibility-media', 'sexting-media', 'Erotic media exchange', 'Intercambio de contenido erótico', ['sexting'],
    'Private exchange of erotic messages, photos or videos between intended recipients.',
    'Intercambio privado de mensajes, fotos o vídeos eróticos entre destinatarios concretos.'),

  // Power, BDSM & service
  term('power-service', 'bdsm', 'BDSM', 'BDSM', ['BDSM'],
    'Umbrella term covering bondage/discipline, dominance/submission and sadomasochistic interests. A person can enjoy only some of those elements.',
    'Término paraguas para bondage/disciplina, dominación/sumisión y prácticas sadomasoquistas. Se puede disfrutar solo de algunos de esos elementos.'),
  term('power-service', 'power-exchange', 'Power exchange', 'Intercambio de poder', ['power exchange', 'intercambio de poder'],
    'A consensual dynamic where authority and control are deliberately distributed unevenly between roles.',
    'Dinámica consensuada donde autoridad y control se reparten deliberadamente de forma desigual entre los roles.'),
  term('power-service', 'dom-sub', 'D/s', 'D/s', ['D/s', 'dom/sub'],
    'Dominance/submission: a consensual power dynamic with a dominant role and a submissive role.',
    'Dominación/sumisión: dinámica consensuada de poder con un rol dominante y otro sumiso.'),
  term('power-service', 'brat', 'Brat dynamic', 'Dinámica brat', ['brat dynamic', 'brat'],
    'A submission style where playful resistance, provocation or rule-testing is part of the agreed interaction.',
    'Estilo de sumisión donde la resistencia juguetona, provocación o puesta a prueba de reglas forma parte de la interacción acordada.'),
  term('power-service', 'collaring', 'Collaring', 'Collaring', ['collaring'],
    'Using a collar as a symbol of submission, belonging, commitment or an ongoing power relationship, rather than simply as fashion.',
    'Uso de un collar como símbolo de sumisión, pertenencia, compromiso o relación de poder continuada, y no solo como elemento estético.'),
  term('power-service', 'service-submission', 'Service submission', 'Sumisión de servicio', ['service submission'],
    'Submission expressed through serving, attending to tasks or deliberately prioritising another person’s wishes within agreed limits.',
    'Sumisión expresada mediante servir, atender tareas o priorizar deliberadamente los deseos de otra persona dentro de límites acordados.'),
  term('power-service', 'protocol', 'Protocol', 'Protocolo', ['protocol', 'protocolo'],
    'Agreed rules, rituals or formal behaviours that structure a power-exchange relationship or scene.',
    'Reglas, rituales o conductas formales acordadas que estructuran una relación o escena de intercambio de poder.'),

  // Restraint
  term('restraint', 'bondage', 'Bondage', 'Bondage', ['bondage'],
    'Erotic restraint or restriction of movement. DesireSync separates rope, cuffs, body positioning and advanced forms.',
    'Restricción erótica o limitación del movimiento. DesireSync separa cuerdas, esposas, posicionamiento y formas avanzadas.'),
  term('restraint', 'shibari', 'Shibari', 'Shibari', ['shibari'],
    'Japanese-influenced rope bondage where tying structure, body lines and rope aesthetics are especially important.',
    'Bondage con cuerdas de influencia japonesa donde importan especialmente la estructura del atado, las líneas corporales y la estética de la cuerda.'),
  term('restraint', 'hogtie', 'Hogtie', 'Hogtie', ['hogtie'],
    'A restraint position connecting restrained arms/wrists and legs/ankles behind the body.',
    'Posición de restricción que conecta brazos o muñecas y piernas o tobillos inmovilizados detrás del cuerpo.'),
  term('restraint', 'frogtie', 'Frogtie', 'Frogtie', ['frogtie'],
    'A bent-leg bondage position where the lower legs are restrained toward the thighs.',
    'Posición de bondage con las piernas flexionadas, sujetando la parte inferior de las piernas hacia los muslos.'),
  term('restraint', 'box-tie', 'Box tie', 'Box tie', ['box tie', 'box-tie'],
    'A rope restraint that holds the arms behind the torso in a compact folded arrangement.',
    'Atadura con cuerdas que mantiene los brazos detrás del torso en una disposición compacta y flexionada.'),
  term('restraint', 'spreader-bar', 'Spreader bar', 'Barra separadora', ['spreader bar', 'barra separadora'],
    'A rigid bar used to keep two restrained limbs separated at a fixed distance.',
    'Barra rígida utilizada para mantener dos extremidades separadas a una distancia fija.'),
  term('restraint', 'sensory-deprivation', 'Sensory deprivation', 'Privación sensorial', ['sensory deprivation', 'privación sensorial'],
    'Deliberately reducing one or more senses, such as sight or hearing, as part of a scene.',
    'Reducir deliberadamente uno o varios sentidos, como vista u oído, como parte de una escena.'),
  term('restraint', 'ball-gag', 'Ball gag', 'Mordaza de bola', ['ball gag', 'ball-gag'],
    'A gag with a ball-shaped mouthpiece held in place by straps.',
    'Mordaza con una pieza esférica que se mantiene en la boca mediante correas.'),
  term('restraint', 'ring-gag', 'Ring gag', 'Mordaza de aro', ['ring gag', 'ring-gag'],
    'A gag built around an open ring that keeps the mouth open rather than filling it with a solid mouthpiece.',
    'Mordaza basada en un aro abierto que mantiene la boca abierta en lugar de ocuparla con una pieza sólida.'),
  term('restraint', 'mummification', 'Mummification', 'Momificación', ['mummification', 'momificación'],
    'Whole-body wrapping or enclosure used to create strong immobilisation and confinement.',
    'Envoltura o encierro de gran parte del cuerpo para producir una inmovilización y confinamiento intensos.'),
  term('restraint', 'predicament-bondage', 'Predicament bondage', 'Predicament bondage', ['predicament bondage'],
    'Restraint where avoiding one difficult position or sensation creates another difficult choice; the dilemma is central to the fantasy.',
    'Restricción donde evitar una postura o sensación difícil genera otra elección incómoda; el dilema es central en la fantasía.'),
  term('restraint', 'suspension-bondage', 'Suspension bondage', 'Bondage en suspensión', ['suspension bondage', 'bondage en suspensión'],
    'Bondage where restraints support part or all of the body off its normal support surface.',
    'Bondage donde las ataduras sostienen parte o todo el cuerpo sin su apoyo habitual.'),
  term('restraint', 'inversion-bondage', 'Inversion bondage', 'Bondage invertido', ['inversion bondage', 'bondage invertido'],
    'Restraint built around an inverted body position.',
    'Restricción construida alrededor de una posición corporal invertida.'),
  term('restraint', 'vacuum-bed', 'Vacuum bed', 'Cama de vacío', ['vacuum bed', 'cama de vacío'],
    'Specialised enclosure that uses a flexible membrane and vacuum to create very strong whole-body immobilisation.',
    'Sistema de confinamiento especializado que utiliza una membrana flexible y vacío para crear una inmovilización corporal muy intensa.'),

  // Psychological dynamics
  term('psychological', 'praise-kink', 'Praise kink', 'Praise kink / gusto por el elogio', ['praise kink'],
    'Erotic enjoyment of receiving praise, approval or affirming language.',
    'Disfrute erótico de recibir elogios, aprobación o lenguaje afirmativo.'),
  term('psychological', 'body-worship', 'Body worship', 'Adoración corporal', ['body worship', 'adoración corporal'],
    'Erotic reverence or focused admiration of another person’s body.',
    'Reverencia erótica o admiración especialmente centrada en el cuerpo de otra persona.'),
  term('psychological', 'objectification', 'Objectification', 'Cosificación', ['objectification', 'cosificación'],
    'A consensual role dynamic where a person is temporarily treated more like an object, function or possession than an equal conversational participant.',
    'Dinámica consensuada donde una persona es tratada temporalmente más como objeto, función o posesión que como participante en igualdad.'),
  term('psychological', 'degradation', 'Degradation', 'Degradación', ['degradation', 'degradación'],
    'Erotic lowering of status or dignity. It is broader and more status-focused than simple embarrassment.',
    'Rebajar eróticamente el estatus o dignidad. Es más amplio y centrado en estatus que la simple vergüenza.'),
  term('psychological', 'fear-play', 'Fear play', 'Juego con el miedo', ['fear play'],
    'A consensual scene where controlled fear, menace or anticipation is part of the erotic tension.',
    'Escena consensuada donde miedo controlado, amenaza o anticipación forman parte de la tensión erótica.'),
  term('psychological', 'mind-games', 'Mind games', 'Juegos mentales', ['mind games'],
    'Consensual psychological play built around uncertainty, suggestion, rules or deliberately confusing expectations.',
    'Juego psicológico consensuado basado en incertidumbre, sugestión, reglas o expectativas deliberadamente confusas.'),

  // Sensation & impact
  term('sensation', 'impact-play', 'Impact play', 'Juego de impacto', ['impact play', 'juego de impacto'],
    'Erotic sensation created by striking the body with a hand or implement, ranging from lighter to more intense forms.',
    'Sensación erótica producida al golpear el cuerpo con la mano o un instrumento, desde formas suaves hasta otras más intensas.'),
  term('sensation', 'flogging', 'Flogging', 'Flogging', ['flogging'],
    'Impact play using a multi-tailed flogger.',
    'Juego de impacto con un flogger o látigo de varias colas.'),
  term('sensation', 'cropping', 'Cropping', 'Cropping / fusta', ['cropping'],
    'Impact play using a riding crop or similar short flexible implement.',
    'Juego de impacto con una fusta de equitación o instrumento corto y flexible similar.'),
  term('sensation', 'caning', 'Caning', 'Caning / vara', ['caning'],
    'Impact play using a cane or thin flexible rod.',
    'Juego de impacto con una vara o caña fina y flexible.'),
  term('sensation', 'electrostimulation', 'Electrostimulation', 'Electroestimulación', ['electrostimulation', 'electroestimulación'],
    'Erotic use of controlled electrical sensation. DesireSync separates mild and higher-intensity interest.',
    'Uso erótico de sensación eléctrica controlada. DesireSync separa el interés suave del de mayor intensidad.'),
  term('sensation', 'wax-play', 'Wax play', 'Juego con cera', ['wax play'],
    'Sensation play where warm or hot wax is part of the desired skin sensation; DesireSync separates milder and more intense variants.',
    'Juego sensorial donde la cera templada o caliente forma parte de la sensación buscada; DesireSync separa variantes suaves e intensas.'),

  // Fluids
  term('fluids', 'snowballing', 'Snowballing', 'Snowballing', ['snowballing'],
    'Passing semen between mouths, commonly through kissing or mouth-to-mouth transfer.',
    'Pasar semen de una boca a otra, normalmente mediante besos o transferencia boca a boca.'),
  term('fluids', 'scat', 'Scat', 'Scat', ['scat'],
    'Sexual interest or fantasy involving feces. DesireSync separates body contact, mouth contact and ingestion.',
    'Interés o fantasía sexual relacionada con heces. DesireSync separa contacto corporal, contacto con la boca e ingestión.'),
  term('fluids', 'squirting', 'Squirting', 'Squirting', ['squirting'],
    'Expulsion of fluid through the urethral area during sexual arousal or orgasm in some people with female anatomy; it is distinct from ordinary vaginal lubrication.',
    'Expulsión de fluido por la zona uretral durante la excitación u orgasmo en algunas personas con anatomía femenina; es distinta de la lubricación vaginal habitual.'),
  term('fluids', 'watersports', 'Watersports', 'Watersports / juego con orina', ['watersports'],
    'A common umbrella term for consensual sexual interests involving urine.',
    'Término paraguas habitual para intereses sexuales consensuados relacionados con orina.'),

  // Roleplay, taboo & surreal fantasy
  term('roleplay-fantasy', 'cnc', 'CNC', 'CNC', ['CNC', 'consensual non-consent'],
    'Consensual non-consent: pre-agreed adult roleplay that simulates resistance or lack of consent within established boundaries.',
    'Consensual non-consent: roleplay adulto previamente acordado que simula resistencia o falta de consentimiento dentro de límites establecidos.'),
  term('roleplay-fantasy', 'free-use', 'Free use', 'Free use', ['free use', 'free-use'],
    'A pre-agreed adult fantasy where one person is treated as broadly sexually available within defined limits and context.',
    'Fantasía adulta preacordada donde una persona se representa como ampliamente disponible sexualmente dentro de límites y contexto definidos.'),
  term('roleplay-fantasy', 'ageplay', 'Adult ageplay', 'Ageplay adulto', ['ageplay'],
    'Adult roleplay involving an intentionally different age presentation or dynamic. DesireSync entries refer only to consenting adults.',
    'Roleplay entre adultos donde se representa deliberadamente una edad o dinámica de edad distinta. En DesireSync se refiere únicamente a adultos que consienten.'),
  term('roleplay-fantasy', 'pet-play', 'Pet play', 'Pet play', ['pet play', 'pet-play'],
    'Adult roleplay where one person takes an animal-like pet role and another a handler/owner role. It does not involve real animals.',
    'Roleplay entre adultos donde una persona adopta un rol de mascota animalizada y otra de guía/propietario. No implica animales reales.'),
  term('roleplay-fantasy', 'futanari', 'Futanari fantasy', 'Fantasía futanari', ['futanari'],
    'Fictional fantasy involving a character with a combination of typically male and female sexual anatomy.',
    'Fantasía ficticia con un personaje que combina anatomía sexual típicamente masculina y femenina.'),
  term('roleplay-fantasy', 'furry-anthro', 'Furry / anthro fantasy', 'Fantasía furry / anthro', ['furry', 'anthro'],
    'Fantasy involving fictional anthropomorphic characters with human and animal-like traits.',
    'Fantasía con personajes antropomórficos ficticios que combinan rasgos humanos y animales.'),
  term('roleplay-fantasy', 'vore', 'Vore fantasy', 'Fantasía vore', ['vore'],
    'Impossible fictional fantasy centred on swallowing, being swallowed or contained inside another creature. It is treated as fantasy-only content.',
    'Fantasía ficticia imposible centrada en tragar, ser tragado o quedar dentro de otra criatura. Se trata como contenido exclusivamente fantástico.'),

  // Toys & penetration
  term('toys-penetration', 'pegging', 'Pegging', 'Pegging', ['pegging'],
    'Anal penetration of a partner using a strap-on dildo, commonly referring to penetrating a male partner.',
    'Penetración anal de la pareja usando un dildo con arnés, normalmente referido a penetrar a una pareja masculina.'),
  term('toys-penetration', 'fisting', 'Fisting', 'Fisting', ['fisting'],
    'Penetrative interest centred on accommodating a hand rather than only fingers. DesireSync separates vaginal and anal interest.',
    'Interés penetrativo centrado en acomodar una mano en lugar de solo dedos. DesireSync separa el interés vaginal y anal.'),
  term('toys-penetration', 'rimming', 'Rimming', 'Rimming / anilingus', ['rimming', 'anilingus'],
    'Oral stimulation of the anus.',
    'Estimulación oral del ano.'),
  term('toys-penetration', 'deep-throat', 'Deep throat', 'Deep throat', ['deep throat', 'deep-throat'],
    'Oral penetration where the penis goes deeper into the mouth/throat than in ordinary oral sex.',
    'Penetración oral donde el pene entra más profundamente en boca/garganta que en sexo oral convencional.'),
  term('toys-penetration', 'strap-on', 'Strap-on', 'Strap-on / dildo con arnés', ['strap-on', 'strap on'],
    'A wearable harness that holds a dildo or similar penetrative toy.',
    'Arnés llevable que sostiene un dildo u otro juguete penetrativo similar.'),
  term('toys-penetration', 'glory-hole', 'Glory hole', 'Glory hole', ['glory hole', 'glory-hole'],
    'An encounter separated by a wall or partition with an opening through which sexual contact occurs.',
    'Encuentro separado por una pared o mampara con una abertura a través de la cual se produce contacto sexual.'),

  // Edge
  term('edge', 'edge-play', 'Edge play', 'Edge play', ['edge play', 'edge-play'],
    'Umbrella term for deliberately intense or higher-risk consensual themes that sit near a person’s physical or psychological limits.',
    'Término paraguas para temas consensuados deliberadamente intensos o de mayor riesgo, cercanos a límites físicos o psicológicos.'),
  term('edge', 'cbt', 'CBT', 'CBT', ['CBT', 'cock and ball torture'],
    'Cock and ball torture: consensual high-intensity pain play focused on the penis and testicles.',
    'Cock and ball torture: juego consensuado de dolor de alta intensidad centrado en pene y testículos.'),
  term('edge', 'vulva-pain-play', 'Intense vulva pain play', 'Juego intenso de dolor vulvar', ['vulva pain play', 'dolor vulvar'],
    'High-intensity pain play focused on the vulva or external female genitals, not the internal vagina.',
    'Juego de dolor de alta intensidad centrado en la vulva o genitales externos femeninos, no en la vagina interna.'),
  term('edge', 'breath-play', 'Breath play', 'Juego con la respiración', ['breath play'],
    'A higher-risk erotic theme involving restricted or controlled breathing. DesireSync records the interest without providing instructions for enactment.',
    'Tema erótico de mayor riesgo relacionado con restricción o control de la respiración. DesireSync registra el interés sin dar instrucciones para realizarlo.'),
  term('edge', 'smothering', 'Smothering', 'Smothering / asfixia', ['smothering'],
    'A higher-risk fantasy involving covering or enclosing the face and the associated helplessness or breathing-control imagery.',
    'Fantasía de mayor riesgo relacionada con cubrir o encerrar la cara y la indefensión o imaginería de control respiratorio asociada.'),
  term('edge', 'needle-play', 'Needle play', 'Needle play / juego con agujas', ['needle play', 'needle-play'],
    'Edge play where needle puncture sensation or imagery is part of the erotic premise, distinct from ordinary piercing aesthetics.',
    'Juego edge donde la sensación o imaginería de punción con agujas forma parte de la premisa erótica, distinto de la estética cotidiana de piercings.'),
  term('edge', 'fire-play', 'Fire play', 'Fire play / juego con fuego', ['fire play', 'fire-play'],
    'An Edge theme involving flame, fire imagery or very close heat. Literal fire introduces substantial real-world risk.',
    'Tema Edge relacionado con llama, imaginería de fuego o calor muy próximo. El fuego literal introduce un riesgo real considerable.'),
  term('edge', 'scarification', 'Scarification', 'Escarificación', ['scarification', 'escarificación'],
    'Deliberate scar-pattern or scarification aesthetics as a fantasy or body-marking interest.',
    'Interés o fantasía centrada en patrones deliberados de cicatrices o estética de escarificación.'),
  term('edge', 'branding', 'Branding', 'Branding / marcado', ['branding'],
    'Fantasy or practice centred on creating a lasting ownership-like or decorative mark through branding; DesireSync can represent the fantasy independently of literal enactment.',
    'Fantasía o práctica centrada en un marcado duradero, decorativo o de pertenencia mediante branding; DesireSync permite valorar la fantasía independientemente de llevarla literalmente a la práctica.'),
] as const;

function term(
  category: CatalogueGlossaryCategory,
  id: string,
  titleEn: string,
  titleEs: string,
  aliases: readonly string[],
  en: string,
  es: string,
): CatalogueGlossaryEntry {
  return { id, category, aliases, titleEn, titleEs, en, es };
}

const ALIASES = CATALOGUE_GLOSSARY
  .flatMap((entry) => entry.aliases.map((alias) => ({ alias, entry })))
  .sort((left, right) => right.alias.length - left.alias.length);
const ALIAS_LOOKUP = new Map(ALIASES.map(({ alias, entry }) => [alias.toLocaleLowerCase(), entry]));
const TERM_PATTERN = new RegExp(
  `(?<![\\p{L}\\p{N}])(${ALIASES.map(({ alias }) => escapeRegex(alias)).join('|')})(?![\\p{L}\\p{N}])`,
  'giu',
);

export function localizedCatalogueGlossary(locale: Locale): readonly LocalizedCatalogueGlossaryEntry[] {
  return CATALOGUE_GLOSSARY
    .map((entry) => ({
      id: entry.id,
      category: entry.category,
      title: locale === 'es' ? entry.titleEs : entry.titleEn,
      definition: locale === 'es' ? entry.es : entry.en,
      aliases: entry.aliases,
    }))
    .sort((left, right) => left.title.localeCompare(right.title, locale));
}

export function catalogueGlossaryEntry(
  id: string,
  locale: Locale,
): LocalizedCatalogueGlossaryEntry | undefined {
  const entry = CATALOGUE_GLOSSARY.find((candidate) => candidate.id === id);
  if (!entry) return undefined;
  return {
    id: entry.id,
    category: entry.category,
    title: locale === 'es' ? entry.titleEs : entry.titleEn,
    definition: locale === 'es' ? entry.es : entry.en,
    aliases: entry.aliases,
  };
}

export function splitCatalogueGlossaryText(text: string, locale: Locale): readonly CatalogueGlossarySegment[] {
  if (!text) return [];
  const segments: CatalogueGlossarySegment[] = [];
  let cursor = 0;

  for (const match of text.matchAll(TERM_PATTERN)) {
    const index = match.index ?? 0;
    if (index > cursor) segments.push({ text: text.slice(cursor, index) });
    const matchedText = match[0];
    const entry = ALIAS_LOOKUP.get(matchedText.toLocaleLowerCase());
    segments.push(entry
      ? { text: matchedText, termId: entry.id, definition: locale === 'es' ? entry.es : entry.en }
      : { text: matchedText });
    cursor = index + matchedText.length;
  }

  if (cursor < text.length) segments.push({ text: text.slice(cursor) });
  return segments.length > 0 ? segments : [{ text }];
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
