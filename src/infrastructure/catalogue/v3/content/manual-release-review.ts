import { CatalogueCategorySeed, CataloguePracticeSeed, CatalogueRoleLabelsSeed } from './types';

const roles = (
  activeEn: string,
  activeEs: string,
  receptiveEn: string,
  receptiveEs: string,
): CatalogueRoleLabelsSeed => ({
  give: { en: activeEn, es: activeEs },
  receive: { en: receptiveEn, es: receptiveEs },
  lead: { en: activeEn, es: activeEs },
  follow: { en: receptiveEn, es: receptiveEs },
});

const HUMAN_ROLE_WORDING: Readonly<Record<string, CatalogueRoleLabelsSeed>> = {
  // Orgasm, teasing & control
  edging: roles('Edge my partner', 'Llevar a mi pareja repetidamente cerca del orgasmo', 'Be edged by my partner', 'Que mi pareja me lleve repetidamente cerca del orgasmo'),
  'orgasm-denial': roles('Deny my partner an orgasm', 'Negar el orgasmo a mi pareja dentro del juego', 'Have my orgasm denied', 'Que mi pareja me niegue el orgasmo dentro del juego'),
  'orgasm-control': roles('Control when my partner may orgasm', 'Controlar cuándo puede correrse mi pareja', 'Have my partner control my orgasm', 'Que mi pareja controle cuándo puedo correrme'),
  'multiple-orgasms': roles('Bring my partner to multiple orgasms', 'Llevar a mi pareja a orgasmos múltiples', 'Experience multiple orgasms with my partner', 'Experimentar orgasmos múltiples con mi pareja'),
  'forced-orgasm': roles('Keep stimulating my partner through a consensual forced orgasm', 'Seguir estimulando a mi pareja hasta provocar un orgasmo forzado consensuado', 'Receive a consensual forced orgasm', 'Recibir un orgasmo forzado consensuado'),
  'ruined-orgasm': roles('Deliberately ruin my partner’s orgasm', 'Arruinar deliberadamente el orgasmo de mi pareja', 'Have my orgasm deliberately ruined', 'Que arruinen deliberadamente mi orgasmo'),
  'tease-and-denial': roles('Tease my partner while denying release', 'Provocar a mi pareja mientras le niego el orgasmo', 'Be teased while being denied release', 'Que me provoquen mientras me niegan el orgasmo'),
  'long-edging-session': roles('Edge my partner for a prolonged session', 'Hacer edging prolongado a mi pareja', 'Receive a prolonged edging session', 'Recibir una sesión prolongada de edging'),
  'permission-to-orgasm': roles('Require my partner to ask permission to orgasm', 'Hacer que mi pareja pida permiso para correrse', 'Have to ask my partner for permission to orgasm', 'Tener que pedir permiso a mi pareja para correrme'),
  'countdown-orgasm': roles('Give my partner an orgasm countdown', 'Marcar a mi pareja una cuenta atrás para correrse', 'Receive an orgasm countdown from my partner', 'Que mi pareja me marque una cuenta atrás para correrme'),
  'orgasm-on-command': roles('Tell my partner when to orgasm', 'Dar a mi pareja la orden de correrse', 'Orgasm on my partner’s command', 'Correrme cuando mi pareja me lo ordene'),
  'partner-decides-orgasm': roles('Decide when my partner may orgasm', 'Decidir cuándo puede correrse mi pareja', 'Let my partner decide when I may orgasm', 'Que mi pareja decida cuándo puedo correrme'),
  'decide-partner-orgasm': roles('Decide when my partner may orgasm', 'Decidir cuándo puede correrse mi pareja', 'Let my partner decide when I may orgasm', 'Que mi pareja decida cuándo puedo correrme'),

  // Restraint: say who restrains whom instead of “give / receive”.
  bondage: roles('Restrain my partner as part of bondage', 'Atar o inmovilizar a mi pareja como parte del bondage', 'Be restrained as part of bondage', 'Que mi pareja me ate o inmovilice como parte del bondage'),
  'rope-bondage': roles('Tie my partner with rope', 'Atar a mi pareja con cuerdas', 'Be tied with rope', 'Que mi pareja me ate con cuerdas'),
  shibari: roles('Tie my partner in a shibari scene', 'Atar a mi pareja en una escena de shibari', 'Be tied in a shibari scene', 'Que mi pareja me ate en una escena de shibari'),
  'chest-harness-bondage': roles('Tie a rope chest harness on my partner', 'Hacer un arnés de cuerdas en el torso de mi pareja', 'Wear a rope chest harness made by my partner', 'Que mi pareja me coloque un arnés de cuerdas en el torso'),
  'wrist-cuffs': roles('Restrain my partner’s wrists with cuffs', 'Inmovilizar las muñecas de mi pareja con muñequeras', 'Have my wrists restrained with cuffs', 'Que me inmovilicen las muñecas con muñequeras'),
  'ankle-cuffs': roles('Restrain my partner’s ankles with cuffs', 'Inmovilizar los tobillos de mi pareja con tobilleras', 'Have my ankles restrained with cuffs', 'Que me inmovilicen los tobillos con tobilleras'),
  handcuffs: roles('Handcuff my partner', 'Esposar a mi pareja', 'Be handcuffed', 'Que mi pareja me espose'),
  'thumb-cuffs': roles('Use thumb cuffs on my partner', 'Poner esposas de pulgares a mi pareja', 'Wear thumb cuffs', 'Que me pongan esposas de pulgares'),
  'leather-restraints': roles('Restrain my partner with leather restraints', 'Inmovilizar a mi pareja con correas de cuero', 'Be restrained with leather restraints', 'Que me inmovilicen con correas de cuero'),
  'velcro-restraints': roles('Restrain my partner with Velcro restraints', 'Inmovilizar a mi pareja con sujeciones de velcro', 'Be restrained with Velcro restraints', 'Que me inmovilicen con sujeciones de velcro'),
  'tape-restraint': roles('Restrain my partner with tape', 'Inmovilizar a mi pareja con cinta', 'Be restrained with tape', 'Que me inmovilicen con cinta'),
  'chain-restraint': roles('Restrain my partner with chains', 'Inmovilizar a mi pareja con cadenas', 'Be restrained with chains', 'Que me inmovilicen con cadenas'),
  'bondage-mitts': roles('Put bondage mitts on my partner', 'Poner manoplas de bondage a mi pareja', 'Wear bondage mitts', 'Que me pongan manoplas de bondage'),
  'bed-restraints': roles('Restrain my partner to the bed', 'Inmovilizar a mi pareja en la cama', 'Be restrained to the bed', 'Que me inmovilicen en la cama'),
  'under-bed-restraints': roles('Use an under-bed restraint system on my partner', 'Usar un sistema de sujeción bajo la cama con mi pareja', 'Be restrained with an under-bed system', 'Que me inmovilicen con un sistema bajo la cama'),
  'spreader-bar': roles('Use a spreader bar on my partner', 'Usar una barra separadora con mi pareja', 'Be restrained with a spreader bar', 'Que me inmovilicen con una barra separadora'),
  hogtie: roles('Tie my partner in a hogtie', 'Atar a mi pareja en hogtie', 'Be tied in a hogtie', 'Que me aten en hogtie'),
  frogtie: roles('Tie my partner in a frogtie', 'Atar a mi pareja en frogtie', 'Be tied in a frogtie', 'Que me aten en frogtie'),
  'box-tie': roles('Tie my partner in a box tie', 'Atar a mi pareja en box tie', 'Be tied in a box tie', 'Que me aten en box tie'),
  'full-body-bondage': roles('Restrain most of my partner’s body', 'Inmovilizar gran parte del cuerpo de mi pareja', 'Have most of my body restrained', 'Que me inmovilicen gran parte del cuerpo'),
  mummification: roles('Wrap and immobilise my partner in a mummification scene', 'Envolver e inmovilizar a mi pareja en una escena de momificación', 'Be wrapped and immobilised in a mummification scene', 'Que me envuelvan e inmovilicen en una escena de momificación'),
  straightjacket: roles('Put my partner in a straitjacket', 'Poner a mi pareja una camisa de fuerza', 'Wear a straitjacket', 'Que me pongan una camisa de fuerza'),
  blindfold: roles('Blindfold my partner', 'Vendar los ojos a mi pareja', 'Be blindfolded', 'Que mi pareja me vende los ojos'),
  'earplugs-sensory-deprivation': roles('Reduce my partner’s hearing with ear protection', 'Reducir la audición de mi pareja dentro del juego sensorial', 'Have my hearing reduced during the scene', 'Que reduzcan mi audición durante la escena'),
  hood: roles('Put a bondage hood on my partner', 'Poner una capucha de bondage a mi pareja', 'Wear a bondage hood', 'Que me pongan una capucha de bondage'),
  gag: roles('Gag my partner', 'Amordazar a mi pareja', 'Be gagged', 'Que mi pareja me amordace'),
  'ball-gag': roles('Put a ball gag on my partner', 'Poner una mordaza de bola a mi pareja', 'Wear a ball gag', 'Que me pongan una mordaza de bola'),
  'bit-gag': roles('Put a bit gag on my partner', 'Poner una mordaza tipo bocado a mi pareja', 'Wear a bit gag', 'Que me pongan una mordaza tipo bocado'),
  'ring-gag': roles('Put a ring gag on my partner', 'Poner una mordaza de aro a mi pareja', 'Wear a ring gag', 'Que me pongan una mordaza de aro'),
  'rope-gag': roles('Use a rope gag on my partner', 'Amordazar a mi pareja con una mordaza de cuerda', 'Wear a rope gag', 'Que me pongan una mordaza de cuerda'),

  // Psychological play
  'praise-kink': roles('Praise and affirm my partner erotically', 'Elogiar y reforzar eróticamente a mi pareja', 'Receive erotic praise and affirmation', 'Recibir elogios y refuerzo erótico'),
  'body-worship': roles('Worship my partner’s body', 'Adorar el cuerpo de mi pareja', 'Have my body worshipped', 'Que mi pareja adore mi cuerpo'),
  'foot-worship': roles('Worship my partner’s feet', 'Adorar los pies de mi pareja', 'Have my feet worshipped', 'Que mi pareja adore mis pies'),
  'boot-worship': roles('Worship my partner’s boots', 'Adorar las botas de mi pareja', 'Have my boots worshipped', 'Que mi pareja adore mis botas'),
  humiliation: roles('Humiliate my partner within the agreed erotic dynamic', 'Humillar a mi pareja dentro de la dinámica erótica acordada', 'Be erotically humiliated by my partner', 'Ser humillado/a eróticamente por mi pareja'),
  degradation: roles('Degrade my partner within the agreed scene', 'Degradar a mi pareja dentro de la escena acordada', 'Be degraded within the agreed scene', 'Ser degradado/a dentro de la escena acordada'),
  'embarrassment-play': roles('Deliberately embarrass my partner as part of the scene', 'Provocar vergüenza deliberada a mi pareja como parte del juego', 'Experience consensual embarrassment in the scene', 'Experimentar vergüenza consensuada dentro del juego'),
  'exposure-humiliation': roles('Use consensual exposure to humiliate my partner', 'Usar exposición consensuada para humillar a mi pareja', 'Be humiliated through consensual exposure', 'Ser humillado/a mediante exposición consensuada'),
  'small-penis-humiliation': roles('Use small-penis humiliation with my partner', 'Usar humillación por pene pequeño con mi pareja', 'Receive small-penis humiliation', 'Recibir humillación por pene pequeño'),
  'breast-size-humiliation': roles('Use breast-size humiliation with my partner', 'Usar humillación por tamaño de pecho con mi pareja', 'Receive breast-size humiliation', 'Recibir humillación por tamaño de pecho'),
  'orgasm-humiliation': roles('Humiliate my partner around orgasm or sexual response', 'Humillar a mi pareja alrededor del orgasmo o su respuesta sexual', 'Be humiliated around my orgasm or sexual response', 'Ser humillado/a alrededor de mi orgasmo o respuesta sexual'),
  objectification: roles('Treat my partner as an object or function within the scene', 'Tratar a mi pareja como un objeto o función dentro de la escena', 'Be treated as an object or function within the scene', 'Ser tratado/a como un objeto o función dentro de la escena'),
  'furniture-roleplay': roles('Use my partner as human furniture within the roleplay', 'Usar a mi pareja como mobiliario humano dentro del roleplay', 'Take the human-furniture role', 'Adoptar el rol de mobiliario humano'),
  begging: roles('Make or encourage my partner to beg', 'Hacer o animar a mi pareja a suplicar', 'Beg my partner within the scene', 'Suplicar a mi pareja dentro de la escena'),
  'teasing-verbal': roles('Verbally tease and provoke my partner', 'Provocar verbalmente a mi pareja', 'Be verbally teased and provoked', 'Que mi pareja me provoque verbalmente'),
  'dirty-talk': roles('Use dirty talk with my partner', 'Hablar de forma sexualmente explícita con mi pareja', 'Have my partner use dirty talk with me', 'Que mi pareja use dirty talk conmigo'),
  'name-calling': roles('Use agreed erotic names for my partner', 'Usar apelativos eróticos acordados con mi pareja', 'Be called agreed erotic names', 'Que mi pareja me llame con apelativos eróticos acordados'),
  mocking: roles('Mock my partner consensually within the scene', 'Burlarme consensuadamente de mi pareja dentro de la escena', 'Be consensually mocked within the scene', 'Recibir burlas consensuadas dentro de la escena'),
  anticipation: roles('Build anticipation for my partner', 'Crear anticipación y tensión para mi pareja', 'Have my partner build anticipation for me', 'Que mi pareja cree anticipación y tensión para mí'),
  'fear-play': roles('Create controlled fear or menace within the agreed scene', 'Crear miedo o amenaza controlados dentro de la escena acordada', 'Experience controlled fear within the agreed scene', 'Experimentar miedo controlado dentro de la escena acordada'),
  'blackmail-roleplay': roles('Play the person applying fictional leverage', 'Interpretar a quien ejerce presión ficticia', 'Play the person under fictional leverage', 'Interpretar a quien está bajo presión ficticia'),
  'mind-games': roles('Lead consensual psychological mind games', 'Dirigir juegos mentales consensuados', 'Experience consensual psychological mind games', 'Experimentar juegos mentales consensuados'),

  // Fluids and edge practices where generic roles were especially unclear.
  'blood-play': roles('Use my blood with my partner', 'Usar mi sangre con mi pareja dentro de la fantasía o práctica', 'Interact with my partner’s blood', 'Interactuar con la sangre de mi pareja'),
  'blood-on-body': roles('Put my blood on my partner’s body', 'Poner mi sangre sobre el cuerpo de mi pareja', 'Have my partner’s blood on my body', 'Recibir sangre de mi pareja sobre mi cuerpo'),
  'blood-drinking': roles('Drink my partner’s blood', 'Beber sangre de mi pareja', 'Have my partner drink my blood', 'Que mi pareja beba mi sangre'),
  'scat-on-body': roles('Put my feces on my partner’s body', 'Poner mis heces sobre el cuerpo de mi pareja', 'Have my partner’s feces on my body', 'Recibir heces de mi pareja sobre mi cuerpo'),
  'scat-in-mouth': roles('Put my feces in my partner’s mouth', 'Poner mis heces en la boca de mi pareja', 'Receive my partner’s feces in my mouth', 'Recibir heces de mi pareja en mi boca'),
  'scat-ingestion': roles('Ingest my partner’s feces', 'Ingerir heces de mi pareja', 'Have my partner ingest my feces', 'Que mi pareja ingiera mis heces'),
  'breath-play': roles('Control breathing as the active role in a pre-agreed breath-play scene', 'Llevar el rol activo en una escena preacordada de control de la respiración', 'Take the receiving role in a pre-agreed breath-play scene', 'Llevar el rol receptivo en una escena preacordada de control de la respiración'),
  'choking-fantasy': roles('Take the controlling role in a choking fantasy', 'Llevar el rol de control en una fantasía de estrangulación', 'Take the receiving role in a choking fantasy', 'Llevar el rol receptivo en una fantasía de estrangulación'),
  smothering: roles('Take the active role in a smothering fantasy', 'Llevar el rol activo en una fantasía de smothering', 'Take the receiving role in a smothering fantasy', 'Llevar el rol receptivo en una fantasía de smothering'),
  'water-bondage-fantasy': roles('Take the controlling role in the water-bondage fantasy', 'Llevar el rol de control en la fantasía de bondage con agua', 'Take the restrained role in the water-bondage fantasy', 'Llevar el rol restringido en la fantasía de bondage con agua'),
  'needle-play': roles('Take the active role in needle play', 'Llevar el rol activo en needle play', 'Receive needle play', 'Recibir needle play'),
  'piercing-play': roles('Take the active role in piercing play', 'Llevar el rol activo en piercing play', 'Receive piercing play', 'Recibir piercing play'),
  'cutting-play': roles('Take the active role in cutting play', 'Llevar el rol activo en cutting play', 'Receive cutting play', 'Recibir cutting play'),
  'hot-wax-intense': roles('Apply intense hot-wax sensation in the scene', 'Aplicar sensación intensa con cera caliente dentro de la escena', 'Receive intense hot-wax sensation', 'Recibir sensación intensa con cera caliente'),
  'fire-play': roles('Take the active role in a fire-play fantasy or scene', 'Llevar el rol activo en una fantasía o escena de fire play', 'Take the receiving role in fire play', 'Llevar el rol receptivo en fire play'),
  'electrostimulation-intense': roles('Apply higher-intensity electrostimulation in the scene', 'Aplicar electroestimulación de mayor intensidad dentro de la escena', 'Receive higher-intensity electrostimulation', 'Recibir electroestimulación de mayor intensidad'),
  'cock-and-ball-torture': roles('Apply consensual penis-and-testicle pain play to my partner', 'Aplicar juego consensuado de dolor en pene y testículos a mi pareja', 'Receive penis-and-testicle pain play', 'Recibir juego de dolor en pene y testículos'),
  'pussy-torture': roles('Apply consensual vulva pain play to my partner', 'Aplicar juego consensuado de dolor vulvar a mi pareja', 'Receive vulva pain play', 'Recibir juego de dolor vulvar'),
  'breast-torture': roles('Apply intense chest or breast pain play to my partner', 'Aplicar juego intenso de dolor en el pecho a mi pareja', 'Receive intense chest or breast pain play', 'Recibir juego intenso de dolor en el pecho'),
  'nipple-torture': roles('Apply intense nipple pain play to my partner', 'Aplicar juego intenso de dolor en pezones a mi pareja', 'Receive intense nipple pain play', 'Recibir juego intenso de dolor en pezones'),
};

const PRACTICE_OVERRIDES: Readonly<Record<string, Partial<CataloguePracticeSeed>>> = {
  'creampie-vaginal': {
    en: 'Vaginal creampie',
    es: 'Creampie vaginal',
    descriptionEn: 'Ejaculation inside the vagina, commonly called a vaginal creampie. This entry describes where ejaculation occurs; contraception, fertility and health decisions are separate real-world considerations.',
    descriptionEs: 'Eyaculación dentro de la vagina, habitualmente llamada creampie vaginal. Aquí se valora dónde ocurre la eyaculación; anticoncepción, fertilidad y salud son consideraciones reales aparte.',
    roleLabels: roles('Ejaculate inside my partner’s vagina', 'Eyacular dentro de la vagina de mi pareja', 'Receive a vaginal creampie', 'Recibir un creampie vaginal'),
  },
  'creampie-anal': {
    en: 'Anal creampie',
    es: 'Creampie anal',
    descriptionEn: 'Ejaculation inside the rectum/anus, commonly called an anal creampie. This entry describes the destination of ejaculation rather than any broader sexual dynamic.',
    descriptionEs: 'Eyaculación interna anal, habitualmente llamada creampie anal. Aquí se valora el destino de la eyaculación y no una dinámica sexual más amplia.',
    roleLabels: roles('Ejaculate inside my partner anally', 'Eyacular dentro del ano de mi pareja', 'Receive an anal creampie', 'Recibir un creampie anal'),
  },
  'watching-partner-with-other': {
    kind: 'paired', counterpartScoped: false,
    descriptionEn: 'A neutral consensual dynamic where one person watches or knowingly experiences their partner being sexual with someone else. Unlike cuckold/cuckquean framing, humiliation or a gendered role is not inherent.',
    descriptionEs: 'Dinámica consensuada y neutral en la que una persona observa o vive conscientemente que su pareja tiene actividad sexual con otra persona. A diferencia del marco cuckold/cuckquean, no implica por sí misma humillación ni un rol de género concreto.',
    pairedRoles: [
      { id: 'watching-partner', en: 'Be the partner who watches / knows', es: 'Ser la pareja que observa / lo sabe', perspective: 'neutral' },
      { id: 'partner-with-other', en: 'Be the partner who is with someone else', es: 'Ser la pareja que está con otra persona', perspective: 'neutral' },
    ],
  },
  'hotwife-dynamic': {
    kind: 'paired', counterpartScoped: false,
    descriptionEn: 'A consensual couple dynamic centred on a woman having sex with other people with her partner’s knowledge or encouragement. Humiliation is not required; that element is rated separately in psychological play.',
    descriptionEs: 'Dinámica consensuada de pareja centrada en que una mujer tenga sexo con otras personas con conocimiento o estímulo de su pareja. La humillación no es necesaria; ese componente se valora aparte en juego psicológico.',
    pairedRoles: [
      { id: 'hotwife-role', en: 'Be the woman who has sex with others', es: 'Ser la mujer que tiene sexo con otras personas', perspective: 'neutral' },
      { id: 'hotwife-partner-role', en: 'Be her knowing / encouraging partner', es: 'Ser su pareja, sabiendo o fomentando la dinámica', perspective: 'neutral' },
    ],
    roleApplicability: {
      'hotwife-role': { selfSex: ['female'] },
      'hotwife-partner-role': { partnerSex: ['female'] },
    },
  },
  'cuckold-dynamic': {
    kind: 'paired', counterpartScoped: false,
    descriptionEn: 'A consensual cuckold dynamic where a man is the partner whose partner has sex with other people. Traditional versions may include jealousy, submission or humiliation, but those are optional dimensions rather than assumed here.',
    descriptionEs: 'Dinámica cuckold consensuada en la que un hombre es la pareja cuya pareja tiene sexo con otras personas. Las variantes tradicionales pueden incluir celos, sumisión o humillación, pero aquí son dimensiones opcionales y no se presuponen.',
    pairedRoles: [
      { id: 'cuckold-role', en: 'Be the cuckolded male partner', es: 'Ser el hombre en el rol cuckold', perspective: 'neutral' },
      { id: 'cuckold-partner-role', en: 'Be the partner who has sex with others', es: 'Ser la pareja que tiene sexo con otras personas', perspective: 'neutral' },
    ],
    roleApplicability: {
      'cuckold-role': { selfSex: ['male'] },
      'cuckold-partner-role': { partnerSex: ['male'] },
    },
  },
  'cuckquean-dynamic': {
    kind: 'paired', counterpartScoped: false,
    descriptionEn: 'A consensual cuckquean dynamic where a woman is the partner whose partner has sex with other people. Jealousy, submission or humiliation can be part of some versions but are not automatically assumed.',
    descriptionEs: 'Dinámica cuckquean consensuada en la que una mujer es la pareja cuya pareja tiene sexo con otras personas. Los celos, la sumisión o la humillación pueden formar parte de algunas variantes, pero no se presuponen.',
    pairedRoles: [
      { id: 'cuckquean-role', en: 'Be the cuckquean female partner', es: 'Ser la mujer en el rol cuckquean', perspective: 'neutral' },
      { id: 'cuckquean-partner-role', en: 'Be the partner who has sex with others', es: 'Ser la pareja que tiene sexo con otras personas', perspective: 'neutral' },
    ],
    roleApplicability: {
      'cuckquean-role': { selfSex: ['female'] },
      'cuckquean-partner-role': { partnerSex: ['female'] },
    },
  },

  // Edge descriptions deliberately identify the fantasy/practice without becoming instructions.
  'breath-play': edgeCopy('Breath play', 'Juego con la respiración', 'A higher-risk consensual theme where restricted or controlled breathing is part of the erotic dynamic. It is kept in Edge because breathing restriction carries serious real-world risk.', 'Tema consensuado de mayor riesgo en el que restringir o controlar la respiración forma parte de la dinámica erótica. Se mantiene en Edge porque cualquier restricción respiratoria conlleva un riesgo real serio.'),
  'choking-fantasy': edgeCopy('Choking fantasy', 'Fantasía de estrangulación', 'A fantasy centred on neck restraint or choking imagery. It records interest in the fantasy or role dynamic, not a recommendation to enact it literally.', 'Fantasía centrada en restricción del cuello o imaginería de estrangulación. Registra interés por la fantasía o el rol, no una recomendación de llevarla literalmente a la práctica.'),
  smothering: edgeCopy('Smothering fantasy', 'Fantasía de smothering / asfixia', 'A fantasy in which covering or enclosing the face and the resulting helplessness are central. It belongs in Edge because literal breathing restriction is hazardous.', 'Fantasía en la que cubrir o encerrar la cara y la sensación de indefensión son centrales. Pertenece a Edge porque restringir literalmente la respiración es peligroso.'),
  'water-bondage-fantasy': edgeCopy('Water-bondage fantasy', 'Fantasía de bondage con agua', 'A controlled fantasy combining restraint or helplessness with water-related imagery. The catalogue treats it primarily as an edge fantasy because literal water-and-breath scenarios can be dangerous.', 'Fantasía controlada que combina restricción o indefensión con imaginería relacionada con agua. El catálogo la trata principalmente como fantasía edge porque los escenarios literales con agua y respiración pueden ser peligrosos.'),
  'needle-play': edgeCopy('Needle play', 'Needle play / juego con agujas', 'Edge play whose defining element is the idea or controlled use of needles for puncture sensation or marking. The interest is separated from ordinary piercing aesthetics.', 'Juego edge cuyo elemento definitorio es la idea o uso controlado de agujas para sensación de punción o marcas. Se separa de la estética cotidiana de los piercings.'),
  'piercing-play': edgeCopy('Piercing play', 'Piercing play', 'Edge play where temporary or scene-based piercing is itself part of the erotic premise, distinct from simply finding permanent piercings attractive.', 'Juego edge donde la perforación temporal o integrada en una escena forma parte de la premisa erótica, distinto de encontrar atractivos los piercings permanentes.'),
  'cutting-play': edgeCopy('Cutting play', 'Cutting play / juego de corte', 'An edge theme involving cutting or the fantasy of controlled cutting as part of a consensual scene. It is separated from decorative scarification fantasy because the immediate act is central.', 'Tema edge que implica corte o la fantasía de corte controlado dentro de una escena consensuada. Se separa de la fantasía de escarificación decorativa porque aquí el acto inmediato es central.'),
  'scarification-fantasy': edgeCopy('Scarification fantasy', 'Fantasía de escarificación', 'A fantasy focused on deliberate lasting scar patterns or scarification aesthetics. It can be rated as fantasy without implying a wish to create permanent marks in reality.', 'Fantasía centrada en patrones de cicatrices deliberadas o en la estética de la escarificación. Puede valorarse como fantasía sin implicar querer producir marcas permanentes en la realidad.'),
  'branding-fantasy': edgeCopy('Branding fantasy', 'Fantasía de branding / marcado', 'A fantasy of permanent ownership-like or decorative marking by branding. The preference entry can represent symbolic fantasy independently of literal enactment.', 'Fantasía de marcado permanente, decorativo o asociado a pertenencia mediante branding. La preferencia puede representar la fantasía simbólica independientemente de llevarla literalmente a la práctica.'),
  'hot-wax-intense': edgeCopy('Intense hot-wax play', 'Juego intenso con cera caliente', 'Higher-intensity wax sensation where stronger heat is part of the appeal, kept separate from milder warm-wax sensation play.', 'Sensación de cera de mayor intensidad donde un calor más fuerte forma parte del atractivo, separada del juego sensorial suave con cera templada.'),
  'fire-play': edgeCopy('Fire-play fantasy / scene', 'Fantasía / escena de fire play', 'An edge theme where flame, fire imagery or very close heat is part of the erotic scene. It is listed separately because real fire introduces substantial risk.', 'Tema edge donde la llama, la imaginería de fuego o el calor muy próximo forman parte de la escena erótica. Se separa porque el fuego real introduce un riesgo considerable.'),
  'electrostimulation-intense': edgeCopy('Higher-intensity electrostimulation', 'Electroestimulación intensa', 'Electrical sensation at the more intense end of the spectrum, distinct from the milder electrostimulation item in sensation play.', 'Sensación eléctrica situada en el extremo de mayor intensidad, distinta de la electroestimulación suave incluida en juego de sensaciones.'),
  'cock-and-ball-torture': edgeCopy('Cock and ball torture (CBT)', 'Cock and ball torture (CBT)', 'Intense consensual pain play specifically focused on penis and testicles. It is separated from other genital pain because the anatomy and fantasy framing are distinct.', 'Juego consensuado de dolor intenso centrado específicamente en pene y testículos. Se separa de otros juegos genitales porque la anatomía y el marco de fantasía son distintos.'),
  'pussy-torture': edgeCopy('Vulva pain play', 'Pussy torture / dolor vulvar', 'Intense consensual pain play specifically focused on the vulva or external female genitals, separated from CBT because the anatomy and framing differ.', 'Juego consensuado de dolor intenso centrado específicamente en la vulva o genitales externos femeninos, separado de CBT porque cambian la anatomía y el marco.'),
  'breast-torture': edgeCopy('Intense chest / breast pain play', 'Juego intenso de dolor en el pecho', 'High-intensity pain play focused on chest or breast tissue rather than only the nipples.', 'Juego de dolor de alta intensidad centrado en el pecho o tejido mamario y no únicamente en los pezones.'),
  'nipple-torture': edgeCopy('Intense nipple pain play', 'Juego intenso de dolor en pezones', 'High-intensity pain-focused play where the nipples themselves are the central target, distinct from broader chest or breast pain play.', 'Juego de dolor de alta intensidad donde los propios pezones son el foco central, distinto del juego de dolor más amplio en pecho o senos.'),
  'suspension-bondage': edgeCopy('Suspension bondage', 'Bondage en suspensión', 'Advanced restraint where being suspended rather than supported normally is a defining part of the scene. It is treated as Edge because suspension materially changes physical load and risk.', 'Restricción avanzada donde estar suspendido/a, en lugar de apoyarse normalmente, define la escena. Se trata como Edge porque la suspensión cambia de forma importante la carga física y el riesgo.'),
  'inversion-bondage': edgeCopy('Inversion bondage', 'Bondage invertido', 'Advanced restraint built around an inverted body position. The defining preference is inversion combined with restraint rather than one particular tying method.', 'Restricción avanzada centrada en una posición corporal invertida. La preferencia definitoria es combinar inversión y restricción, no una técnica concreta de atado.'),
  'predicament-bondage': edgeCopy('Predicament bondage', 'Predicament bondage', 'A restraint fantasy where maintaining one position or avoiding one discomfort creates another difficult choice. The psychological dilemma is as important as the physical restraint.', 'Fantasía de restricción donde mantener una postura o evitar una incomodidad genera otra elección difícil. El dilema psicológico es tan importante como la restricción física.'),
  'long-duration-restraint': edgeCopy('Long-duration restraint', 'Restricción prolongada', 'A preference for restraint that remains part of a scene for an extended period, making duration itself a meaningful element rather than a brief setup.', 'Preferencia por una restricción que permanece durante un periodo prolongado, de modo que la duración es un elemento significativo y no solo una preparación breve.'),
  'vacuum-bed': edgeCopy('Vacuum bed', 'Cama de vacío', 'A specialised confinement fantasy or practice using a vacuum-bed setup to create very strong whole-body immobilisation. The defining appeal is enclosure and near-total restriction.', 'Fantasía o práctica de confinamiento especializada con una cama de vacío que produce una inmovilización corporal muy intensa. El atractivo definitorio es el encierro y la restricción casi total.'),
  'vacuum-cube': edgeCopy('Vacuum cube', 'Cubo de vacío', 'A specialised vacuum-confinement setup where compact enclosure and strong whole-body restriction are central to the fantasy or scene.', 'Montaje especializado de confinamiento por vacío donde el encierro compacto y la restricción intensa de todo el cuerpo son centrales en la fantasía o escena.'),
};

function edgeCopy(en: string, es: string, descriptionEn: string, descriptionEs: string): Partial<CataloguePracticeSeed> {
  return { en, es, descriptionEn, descriptionEs };
}

const ADDITIONS: Readonly<Record<string, readonly CataloguePracticeSeed[]>> = {
  'body-fetishes': [
    {
      id: 'vagina', en: 'Vagina', es: 'Vagina', kind: 'focus', anatomySex: 'female',
      descriptionEn: 'Attraction specifically focused on the vagina as the internal genital canal. It is separate from the vulva, which refers to the external genital anatomy.',
      descriptionEs: 'Atracción centrada específicamente en la vagina como canal genital interno. Se separa de la vulva, que se refiere a la anatomía genital externa.',
    },
  ],
  exhibitionism: [
    {
      id: 'erotic-selfies', en: 'Erotic selfies', es: 'Selfies eróticos', kind: 'self',
      descriptionEn: 'Taking erotic photos of yourself for your own enjoyment or to share consensually with a partner or intended recipient.',
      descriptionEs: 'Hacerse fotos eróticas a uno/a mismo/a para disfrutarlas personalmente o compartirlas de forma consensuada con una pareja o destinatario previsto.',
      roleLabels: { self: { en: 'Take erotic photos of myself', es: 'Hacerme fotos eróticas' } },
    },
    {
      id: 'partner-erotic-photography', en: 'Photographing a partner erotically', es: 'Fotografiar eróticamente a la pareja', kind: 'directed', counterpartScoped: true,
      descriptionEn: 'A consensual erotic photography dynamic where one partner takes the photos and the other is the subject, allowing those two interests to be rated separately.',
      descriptionEs: 'Dinámica consensuada de fotografía erótica en la que una persona hace las fotos y la otra posa, permitiendo valorar por separado ambos intereses.',
      roleLabels: roles('Take erotic photos of my partner', 'Hacer fotos eróticas a mi pareja', 'Pose for erotic photos taken by my partner', 'Posar para fotos eróticas hechas por mi pareja'),
    },
    {
      id: 'erotic-photo-session-together', en: 'Erotic photo session together', es: 'Sesión de fotos erótica juntos', kind: 'mutual', counterpartScoped: true,
      descriptionEn: 'Creating a consensual erotic photo session together where both partners appear or actively compose the images rather than one person only photographing the other.',
      descriptionEs: 'Crear juntos una sesión de fotos erótica consensuada donde ambas personas aparecen o participan activamente en la composición, en lugar de que una solo fotografíe a la otra.',
    },
    {
      id: 'watch-private-recording-together', en: 'Watching our private recording together', es: 'Ver juntos una grabación íntima propia', kind: 'mutual', counterpartScoped: true,
      descriptionEn: 'Watching a consensually made private sexual recording together later, where revisiting the shared recording is itself part of the interest.',
      descriptionEs: 'Ver juntos posteriormente una grabación sexual privada realizada de forma consensuada, siendo el propio hecho de revisitarla parte del interés.',
    },
    {
      id: 'watching-undressing', en: 'Watching / being watched while undressing', es: 'Mirar / ser mirado al desvestirse', kind: 'watch', counterpartScoped: true,
      descriptionEn: 'Erotic interest in watching a partner undress or deliberately being watched while undressing, without requiring photography, recording or a wider audience.',
      descriptionEs: 'Interés erótico en observar a la pareja mientras se desnuda o ser observado/a deliberadamente al desvestirse, sin requerir fotografía, grabación ni un público más amplio.',
    },
  ],
  power: [
    servicePractice('body-care-service', 'Personal care service', 'Servicio de cuidado personal', 'Helping with dressing, grooming, washing or other personal-care rituals because serving the other person is part of the consensual power dynamic.', 'Ayudar a vestir, arreglar, lavar o realizar otros rituales de cuidado personal porque servir a la otra persona forma parte de la dinámica consensuada de poder.'),
    servicePractice('hospitality-service', 'Hospitality service', 'Servicio de atención y hospitalidad', 'Serving drinks, food or attending to comfort and practical needs as an intentional service role rather than simply an ordinary shared chore.', 'Servir bebidas, comida o atender al confort y necesidades prácticas como un rol deliberado de servicio y no simplemente como una tarea cotidiana compartida.'),
    servicePractice('ritual-attendance-service', 'Ritual attendance / waiting service', 'Servicio ritual de atención / espera', 'Being deliberately available to attend, wait on or carry out small requested tasks for the other person as part of an ongoing service dynamic.', 'Estar deliberadamente disponible para atender, esperar o realizar pequeñas tareas solicitadas por la otra persona como parte de una dinámica continuada de servicio.'),
    ownershipPractice('ownership-token', 'Ownership token / symbol', 'Símbolo de pertenencia', 'Using a consensual wearable or personal object such as a tag, bracelet or other token to symbolise an ownership/submission bond without requiring a collar.', 'Usar de forma consensuada un objeto personal o llevable, como una placa, pulsera u otro símbolo, para representar un vínculo de pertenencia/sumisión sin requerir un collar.'),
    ownershipPractice('temporary-ownership-marking', 'Temporary ownership marking', 'Marcado simbólico temporal de pertenencia', 'Using temporary writing, stamps or other non-permanent marks as consensual ownership symbolism inside a scene or relationship dynamic.', 'Usar escritura, sellos u otras marcas temporales y no permanentes como simbología consensuada de pertenencia dentro de una escena o dinámica de relación.'),
    ownershipPractice('assigned-submissive-name', 'Assigned submissive / owned name', 'Nombre asignado de sumisión / pertenencia', 'Using an agreed name, pet name or designation chosen by the dominant/owner role as an ongoing symbol of the submissive or ownership dynamic.', 'Usar un nombre, apelativo o designación acordados y elegidos por el rol dominante/propietario como símbolo continuado de la dinámica de sumisión o pertenencia.'),
  ],
  fluids: [
    {
      id: 'semen-on-other-body', en: 'Semen on other body areas', es: 'Semen en otras zonas del cuerpo', kind: 'directed', counterpartScoped: true, actorSex: 'male',
      descriptionEn: 'External ejaculation onto a body area other than the separately listed face, chest/breasts, buttocks or mouth, allowing a general external-body preference without duplicating those locations.',
      descriptionEs: 'Eyaculación externa sobre una zona corporal distinta de cara, pecho, glúteos o boca, que ya tienen entradas propias. Permite valorar otras zonas del cuerpo sin duplicarlas.',
      roleLabels: roles('Ejaculate on another area of my partner’s body', 'Eyacular sobre otra zona del cuerpo de mi pareja', 'Receive semen on another area of my body', 'Recibir semen en otra zona de mi cuerpo'),
    },
    ownFluid('own-urine-play', 'Own urine play', 'Juego con la propia orina', 'Interest in using or interacting with your own urine as part of sexual fantasy or play, separately from giving urine to or receiving it from another person.', 'Interés en usar o interactuar con la propia orina dentro de una fantasía o juego sexual, separado de hacerlo sobre otra persona o recibirlo de ella.'),
    ownFluid('own-blood-play', 'Own blood play', 'Juego con la propia sangre', 'Interest in your own blood being part of a sexual fantasy or scene, separately from interacting with a partner’s blood. This preference entry does not imply any particular way of obtaining it.', 'Interés en que la propia sangre forme parte de una fantasía o escena sexual, separado de interactuar con la sangre de la pareja. Esta preferencia no implica ninguna forma concreta de obtenerla.'),
    ownFluid('own-scat-play', 'Own feces / scat play', 'Juego con las propias heces / scat', 'Interest in your own feces being part of a sexual fantasy or scene, separately from giving them to or receiving them from another person.', 'Interés en que las propias heces formen parte de una fantasía o escena sexual, separado de dárselas a otra persona o recibir las de otra persona.'),
  ],
  edge: [
    {
      id: 'ordeal-scene', en: 'Ordeal / endurance scene', es: 'Escena de prueba / resistencia', kind: 'paired', counterpartScoped: false,
      descriptionEn: 'A consensual high-intensity scene framed as an ordeal or endurance challenge, where the overall experience of being tested matters more than any one technique. This entry describes the scene dynamic rather than instructions for performing it.',
      descriptionEs: 'Escena consensuada de alta intensidad planteada como una prueba o reto de resistencia, donde importa más la experiencia global de ser puesto/a a prueba que una técnica concreta. La entrada describe la dinámica, no instrucciones para realizarla.',
      pairedRoles: [
        { id: 'set-ordeal', en: 'Set / lead the ordeal', es: 'Plantear / dirigir la prueba', perspective: 'active' },
        { id: 'undergo-ordeal', en: 'Undergo the ordeal', es: 'Someterme a la prueba', perspective: 'receptive' },
      ],
    },
    {
      id: 'extreme-helplessness-fantasy', en: 'Extreme helplessness fantasy', es: 'Fantasía de indefensión extrema', kind: 'paired', counterpartScoped: false,
      descriptionEn: 'A pre-agreed fantasy focused on one person feeling almost completely unable to control what happens in the scene. The preference is the extreme helplessness and power contrast, not a specific restraint or dangerous act.',
      descriptionEs: 'Fantasía preacordada centrada en que una persona sienta que casi no puede controlar lo que ocurre en la escena. La preferencia es la indefensión extrema y el contraste de poder, no una restricción o acto peligroso concreto.',
      pairedRoles: [
        { id: 'control-helplessness', en: 'Create / control the helplessness fantasy', es: 'Crear / controlar la fantasía de indefensión', perspective: 'active' },
        { id: 'experience-helplessness', en: 'Experience the helpless role', es: 'Experimentar el rol de indefensión', perspective: 'receptive' },
      ],
    },
  ],
};

function ownFluid(id: string, en: string, es: string, descriptionEn: string, descriptionEs: string): CataloguePracticeSeed {
  return {
    id, en, es, kind: 'self', descriptionEn, descriptionEs,
    roleLabels: { self: { en: `Use / experience ${en.toLowerCase()}`, es: `Experimentar ${es.toLowerCase()}` } },
  };
}

function servicePractice(id: string, en: string, es: string, descriptionEn: string, descriptionEs: string): CataloguePracticeSeed {
  return {
    id, en, es, kind: 'paired', counterpartScoped: true, descriptionEn, descriptionEs,
    pairedRoles: [
      { id: 'provide-service', en: 'Provide the service', es: 'Prestar el servicio', perspective: 'active' },
      { id: 'receive-service', en: 'Receive / be attended to', es: 'Recibir el servicio / ser atendido/a', perspective: 'receptive' },
    ],
  };
}

function ownershipPractice(id: string, en: string, es: string, descriptionEn: string, descriptionEs: string): CataloguePracticeSeed {
  return {
    id, en, es, kind: 'paired', counterpartScoped: true, descriptionEn, descriptionEs,
    pairedRoles: [
      { id: 'owner-symbol-role', en: 'Give / define the symbol as the owner or dominant role', es: 'Dar / definir el símbolo desde el rol propietario o dominante', perspective: 'active' },
      { id: 'owned-symbol-role', en: 'Wear / receive the symbol as the submissive or owned role', es: 'Llevar / recibir el símbolo desde el rol sumiso o de pertenencia', perspective: 'receptive' },
    ],
  };
}

const CATEGORY_ORDER_OVERRIDES: Readonly<Record<string, readonly string[]>> = {
  'body-fetishes': ['penis', 'penis-size-small', 'penis-size-average', 'penis-size-large', 'testicles', 'vulva', 'vagina', 'pubic-hair', 'body-hair'],
  exhibitionism: ['voyeurism', 'watching-undressing', 'mirrors', 'lights-on', 'risk-of-being-seen', 'erotic-selfies', 'taking-erotic-photos', 'partner-erotic-photography', 'erotic-photo-session-together', 'private-recording', 'watch-private-recording-together', 'video-call-sex', 'webcam-performance-private'],
  power: ['service', 'sexual-service', 'domestic-service', 'body-care-service', 'hospitality-service', 'ritual-attendance-service', 'ownership', 'collaring', 'leash-control', 'ownership-token', 'temporary-ownership-marking', 'assigned-submissive-name'],
  sensation: ['feather-sensation', 'tickling', 'sensory-deprivation', 'sensory-overload', 'ice-play', 'temperature-contrast', 'warm-wax', 'electrostimulation-mild', 'rough-grabbing', 'scratching', 'biting', 'pinching', 'hair-pulling', 'pressure-points', 'nipple-pinching', 'clothespins', 'nipple-clamp-sensation', 'breast-slapping', 'genital-slapping', 'spanking', 'wooden-spoon-impact', 'slapping-body', 'paddling', 'flogging', 'cropping', 'belting', 'face-slapping', 'whipping', 'caning'],
  fluids: ['spitting-on-body', 'spitting-in-mouth', 'saliva-sharing', 'drooling', 'semen-on-face', 'semen-on-breasts', 'semen-on-buttocks', 'semen-on-other-body', 'semen-in-mouth', 'swallowing', 'spitting-semen', 'snowballing', 'creampie-vaginal', 'creampie-anal', 'creampie-cleanup', 'female-ejaculation', 'squirting-on-partner', 'urine-play', 'urine-drinking', 'own-urine-play', 'blood-play', 'blood-on-body', 'blood-drinking', 'own-blood-play', 'scat-on-body', 'scat-in-mouth', 'scat-ingestion', 'own-scat-play'],
  edge: ['breath-play', 'choking-fantasy', 'smothering', 'water-bondage-fantasy', 'needle-play', 'piercing-play', 'cutting-play', 'scarification-fantasy', 'branding-fantasy', 'hot-wax-intense', 'fire-play', 'electrostimulation-intense', 'pussy-torture', 'cock-and-ball-torture', 'breast-torture', 'nipple-torture', 'suspension-bondage', 'inversion-bondage', 'predicament-bondage', 'long-duration-restraint', 'vacuum-bed', 'vacuum-cube', 'ordeal-scene', 'extreme-helplessness-fantasy'],
};

export function applyManualReleaseReview(content: readonly CatalogueCategorySeed[]): readonly CatalogueCategorySeed[] {
  return content.map((category) => {
    let practices = category.practices.map((practice) => applyPracticeReview(practice));
    const additions = ADDITIONS[category.id] ?? [];
    const existingIds = new Set(practices.map((practice) => practice.id));
    practices = [...practices, ...additions.filter((practice) => !existingIds.has(practice.id))];

    // Sex-specific source roles are needed so “from/to a man or woman” scopes are generated.
    if (category.id === 'fluids') {
      const sexScoped = new Set(['urine-play', 'urine-drinking', 'blood-play', 'blood-on-body', 'blood-drinking', 'scat-on-body', 'scat-in-mouth', 'scat-ingestion']);
      practices = practices.map((practice) => sexScoped.has(practice.id) ? { ...practice, counterpartScoped: true } : practice);
    }

    const preferredOrder = CATEGORY_ORDER_OVERRIDES[category.id];
    if (preferredOrder) practices = orderPractices(practices, preferredOrder);
    return { ...category, practices };
  });
}

function applyPracticeReview(practice: CataloguePracticeSeed): CataloguePracticeSeed {
  const override = PRACTICE_OVERRIDES[practice.id];
  const wording = HUMAN_ROLE_WORDING[practice.id];
  const merged = { ...practice, ...(override ?? {}) } as CataloguePracticeSeed;
  const roleLabels = {
    ...(practice.roleLabels ?? {}),
    ...(override?.roleLabels ?? {}),
    ...(wording ?? {}),
  };
  return Object.keys(roleLabels).length > 0 ? { ...merged, roleLabels } : merged;
}

function orderPractices(practices: readonly CataloguePracticeSeed[], order: readonly string[]): CataloguePracticeSeed[] {
  const index = new Map(order.map((id, position) => [id, position]));
  return [...practices].sort((left, right) =>
    (index.get(left.id) ?? Number.MAX_SAFE_INTEGER) - (index.get(right.id) ?? Number.MAX_SAFE_INTEGER));
}
