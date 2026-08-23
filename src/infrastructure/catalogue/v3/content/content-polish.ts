import { describeCataloguePractice } from './practice-description';
import { CatalogueCategorySeed, CataloguePracticeSeed } from './types';

const CATEGORY_ORDER = [
  'affection-intimacy',
  'sexual-style',
  'clothing-appearance',
  'manual-masturbation',
  'oral',
  'penetration',
  'sexual-positions',
  'toys',
  'orgasm-control',
  'body-fetishes',
  'groups',
  'roleplay',
  'exhibitionism',
  'places-settings',
  'power',
  'restraint',
  'psychological',
  'sensation',
  'fluids',
  'edge',
] as const;

const SEXUAL_POSITIONS: Omit<CatalogueCategorySeed, 'order' | 'practices'> = {
  id: 'sexual-positions',
  en: 'Sexual positions',
  es: 'Posturas sexuales',
  descriptionEn: 'Body arrangements and positions used during sexual activity, independently of the underlying practice.',
  descriptionEs: 'Formas de colocar los cuerpos durante la actividad sexual, separadas de la práctica concreta que se realiza.',
};

const CATEGORY_MOVES: Readonly<Record<string, string>> = {
  missionary: 'sexual-positions',
  cowgirl: 'sexual-positions',
  'reverse-cowgirl': 'sexual-positions',
  'doggy-style': 'sexual-positions',
  'spooning-penetration': 'sexual-positions',
  'standing-penetration': 'sexual-positions',
  'seated-penetration': 'sexual-positions',
  'against-wall': 'sexual-positions',
  'legs-on-shoulders': 'sexual-positions',
  'lotus-position': 'sexual-positions',
  'sixty-nine': 'sexual-positions',
  'face-sitting': 'sexual-positions',
  'blood-play': 'fluids',
};

const ADDITIONAL_PRACTICES: Readonly<Record<string, readonly CataloguePracticeSeed[]>> = {
  fluids: [
    {
      id: 'blood-on-body',
      en: 'Blood on the body',
      es: 'Sangre sobre el cuerpo',
      kind: 'directed',
      descriptionEn: 'Applying or receiving blood on the skin or body as part of sexual play, without implying how the blood was obtained.',
      descriptionEs: 'Aplicar o recibir sangre sobre la piel o el cuerpo como parte del juego sexual, sin presuponer cómo se ha obtenido.',
      roleLabels: {
        give: { en: 'Put blood on my partner', es: 'Poner sangre sobre mi pareja' },
        receive: { en: 'Have blood put on me', es: 'Que pongan sangre sobre mí' },
      },
    },
    {
      id: 'blood-drinking',
      en: 'Drinking blood',
      es: 'Beber sangre',
      kind: 'directed',
      counterpartScoped: true,
      descriptionEn: 'Drinking a partner’s blood or having a partner drink yours as part of the sexual dynamic.',
      descriptionEs: 'Beber sangre de la pareja o que la pareja beba la propia como parte de la dinámica sexual.',
      roleLabels: {
        give: { en: 'Drink my partner’s blood', es: 'Beber sangre de mi pareja' },
        receive: { en: 'Have my partner drink my blood', es: 'Que mi pareja beba mi sangre' },
      },
    },
    {
      id: 'scat-on-body',
      en: 'Feces on the body',
      es: 'Heces sobre el cuerpo',
      kind: 'directed',
      descriptionEn: 'Having feces placed or smeared on the skin or body as part of sexual play.',
      descriptionEs: 'Colocar o extender heces sobre la piel o el cuerpo como parte del juego sexual.',
      roleLabels: {
        give: { en: 'Put feces on my partner', es: 'Poner heces sobre mi pareja' },
        receive: { en: 'Have feces put on me', es: 'Que pongan heces sobre mí' },
      },
    },
    {
      id: 'scat-in-mouth',
      en: 'Feces in the mouth',
      es: 'Heces en la boca',
      kind: 'directed',
      counterpartScoped: true,
      descriptionEn: 'Putting feces in a partner’s mouth or receiving them in the mouth, without necessarily swallowing.',
      descriptionEs: 'Poner heces en la boca de la pareja o recibirlas en la boca, sin implicar necesariamente tragarlas.',
      roleLabels: {
        give: { en: 'Put them in my partner’s mouth', es: 'Ponerlas en la boca de mi pareja' },
        receive: { en: 'Receive them in my mouth', es: 'Recibirlas en mi boca' },
      },
    },
    {
      id: 'scat-ingestion',
      en: 'Feces ingestion',
      es: 'Ingesta de heces',
      kind: 'directed',
      counterpartScoped: true,
      descriptionEn: 'Swallowing a partner’s feces or having a partner swallow yours as part of sexual play.',
      descriptionEs: 'Tragar heces de la pareja o que la pareja trague las propias como parte del juego sexual.',
      roleLabels: {
        give: { en: 'Ingest my partner’s feces', es: 'Ingerir heces de mi pareja' },
        receive: { en: 'Have my partner ingest mine', es: 'Que mi pareja ingiera las mías' },
      },
    },
  ],
};

const PRACTICE_OVERRIDES: Readonly<Record<string, Partial<CataloguePracticeSeed>>> = {
  kissing: {
    descriptionEn: 'Kissing a partner and being kissed, from brief affectionate kisses to longer sexual kisses; the two directions are rated separately.',
    descriptionEs: 'Besar a la pareja y ser besado/a, desde besos afectuosos breves hasta besos sexuales más prolongados; ambas direcciones se valoran por separado.',
    roleLabels: {
      give: { en: 'Kiss my partner', es: 'Besar a mi pareja' },
      receive: { en: 'Be kissed', es: 'Que me besen' },
    },
  },
  'making-out': {
    descriptionEn: 'A prolonged kissing and close-contact session where kissing itself is a central part of the encounter.',
    descriptionEs: 'Una sesión prolongada de besos y contacto cercano en la que besarse es una parte central del encuentro.',
  },
  'verbal-affection': {
    descriptionEn: 'Expressing affection, tenderness or desire through spoken words, rated separately for expressing it and receiving it.',
    descriptionEs: 'Expresar afecto, ternura o deseo mediante palabras, valorando por separado expresarlo y recibirlo.',
    roleLabels: {
      give: { en: 'Express affection', es: 'Expresar afecto' },
      receive: { en: 'Receive verbal affection', es: 'Recibir afecto verbal' },
    },
  },
  'holding-hands': {
    descriptionEn: 'Holding hands as an affectionate or intimate form of physical closeness.',
    descriptionEs: 'Cogerse de la mano como forma afectuosa o íntima de cercanía física.',
  },
  'hair-stroking': {
    descriptionEn: 'Slowly stroking or playing with a partner’s hair as affectionate or sensual touch.',
    descriptionEs: 'Acariciar o jugar suavemente con el pelo de la pareja como gesto afectuoso o sensual.',
    roleLabels: {
      give: { en: 'Stroke my partner’s hair', es: 'Acariciar el pelo de mi pareja' },
      receive: { en: 'Have my hair stroked', es: 'Que me acaricien el pelo' },
    },
  },
  'face-caressing': {
    descriptionEn: 'Caressing a partner’s face with the hands as affectionate or sensual touch.',
    descriptionEs: 'Acariciar con las manos la cara de la pareja como gesto afectuoso o sensual.',
    roleLabels: {
      give: { en: 'Caress my partner’s face', es: 'Acariciar la cara de mi pareja' },
      receive: { en: 'Have my face caressed', es: 'Que me acaricien la cara' },
    },
  },
  'back-rubs': {
    descriptionEn: 'Stroking or rubbing a partner’s back for closeness, relaxation or sensual contact.',
    descriptionEs: 'Acariciar o frotar la espalda de la pareja para dar cercanía, relajación o contacto sensual.',
    roleLabels: {
      give: { en: 'Caress my partner’s back', es: 'Acariciar la espalda de mi pareja' },
      receive: { en: 'Have my back caressed', es: 'Que me acaricien la espalda' },
    },
  },
  'skin-to-skin-contact': {
    descriptionEn: 'Resting or lying together with extensive bare-skin contact, without requiring a particular sexual act.',
    descriptionEs: 'Estar o tumbarse juntos con amplio contacto de piel desnuda, sin requerir una práctica sexual concreta.',
  },
  cuddling: {
    descriptionEn: 'Holding, hugging and nestling closely together for affectionate physical comfort; giving and receiving that closeness are rated separately.',
    descriptionEs: 'Abrazarse, acurrucarse y mantenerse juntos para dar cercanía física afectuosa; darla y recibirla se valoran por separado.',
    roleLabels: {
      give: { en: 'Hold / cuddle my partner', es: 'Abrazar / mimar a mi pareja' },
      receive: { en: 'Be held / cuddled', es: 'Recibir abrazos / mimos' },
    },
  },
  spooning: {
    descriptionEn: 'Lying closely together on the same side in a spooning embrace, without implying penetration.',
    descriptionEs: 'Tumbarse juntos de lado y abrazados en cucharita, sin implicar penetración.',
  },
  'sleeping-naked-together': {
    descriptionEn: 'Sleeping or resting together while both people are nude, independently of whether sexual activity happens.',
    descriptionEs: 'Dormir o descansar juntos estando ambos desnudos, independientemente de que haya actividad sexual.',
  },
  'showering-together': {
    descriptionEn: 'Sharing a shower as an intimate activity or moment of physical closeness, independently of having sex there.',
    descriptionEs: 'Compartir una ducha como actividad íntima o momento de cercanía física, independientemente de tener sexo allí.',
  },
  'bathing-together': {
    descriptionEn: 'Sharing a bath as a relaxed or intimate activity, independently of having sex in the bath.',
    descriptionEs: 'Compartir un baño como actividad relajada o íntima, independientemente de tener sexo en la bañera.',
  },
  'sensual-massage': {
    descriptionEn: 'Giving or receiving a massage whose purpose is erotic or sensual touch rather than ordinary therapeutic massage.',
    descriptionEs: 'Dar o recibir un masaje cuyo propósito es el contacto erótico o sensual, no un masaje terapéutico corriente.',
    roleLabels: {
      give: { en: 'Give a sensual massage', es: 'Dar un masaje sensual' },
      receive: { en: 'Receive a sensual massage', es: 'Recibir un masaje sensual' },
    },
  },

  missionary: {
    descriptionEn: 'A face-to-face position with one partner lying on their back and the other positioned above or between their legs.',
    descriptionEs: 'Postura cara a cara en la que una persona está tumbada boca arriba y la otra se coloca encima o entre sus piernas.',
  },
  cowgirl: {
    descriptionEn: 'A position where the receiving partner is on top and faces the penetrating partner.',
    descriptionEs: 'Postura en la que quien recibe está encima y de frente a la persona que penetra.',
  },
  'reverse-cowgirl': {
    descriptionEn: 'A position where the receiving partner is on top while facing away from the penetrating partner.',
    descriptionEs: 'Postura en la que quien recibe está encima pero de espaldas a la persona que penetra.',
  },
  'doggy-style': {
    descriptionEn: 'A rear-entry position where the receiving partner is supported on knees, hands or elbows.',
    descriptionEs: 'Postura de entrada desde atrás en la que quien recibe se apoya sobre rodillas, manos o codos.',
  },
  'spooning-penetration': {
    descriptionEn: 'A penetration position where both partners lie on their sides facing the same direction, close together like spoons.',
    descriptionEs: 'Postura de penetración en la que ambas personas están tumbadas de lado, orientadas en la misma dirección y juntas en cucharita.',
  },
  'standing-penetration': {
    descriptionEn: 'Penetrative sex performed while one or both partners remain standing.',
    descriptionEs: 'Sexo con penetración realizado mientras una o ambas personas permanecen de pie.',
  },
  'seated-penetration': {
    descriptionEn: 'Penetrative sex where at least one partner remains seated, allowing upright or face-to-face variations.',
    descriptionEs: 'Sexo con penetración en el que al menos una persona permanece sentada, permitiendo variantes erguidas o cara a cara.',
  },
  'against-wall': {
    descriptionEn: 'A sexual position where one partner is supported or pressed against a wall while the other engages from the front or behind.',
    descriptionEs: 'Postura sexual en la que una persona se apoya o queda contra una pared mientras la otra se coloca delante o detrás.',
  },
  'legs-on-shoulders': {
    descriptionEn: 'A lying penetration position where the receiving partner places one or both legs on the other partner’s shoulders.',
    descriptionEs: 'Postura de penetración tumbada en la que quien recibe coloca una o ambas piernas sobre los hombros de la otra persona.',
  },
  'lotus-position': {
    descriptionEn: 'A seated face-to-face position with the partners close together and the receiving partner wrapping their legs around the other.',
    descriptionEs: 'Postura sentada cara a cara con los cuerpos juntos y quien recibe rodeando con las piernas a la otra persona.',
  },
  'sixty-nine': {
    descriptionEn: 'A position where both partners can give and receive oral stimulation at the same time.',
    descriptionEs: 'Postura en la que ambas personas pueden dar y recibir estimulación oral al mismo tiempo.',
  },
  'face-sitting': {
    descriptionEn: 'A position where one person sits or kneels over the other person’s face to receive oral stimulation.',
    descriptionEs: 'Postura en la que una persona se sienta o arrodilla sobre la cara de la otra para recibir estimulación oral.',
  },

  vibrator: {
    targetSites: ['external-genitals', 'vaginal', 'anal'],
    descriptionEn: 'A general-purpose vibrating toy used for external-genital stimulation or, when its shape allows it, vaginal or anal use.',
    descriptionEs: 'Juguete vibratorio de uso general para estimular los genitales externos o, si su forma lo permite, para uso vaginal o anal.',
  },
  'wand-vibrator': {
    targetSites: ['external-genitals', 'nipples'],
    descriptionEn: 'A broad-headed external vibrator designed mainly for strong surface stimulation, especially external genitals and sometimes nipples.',
    descriptionEs: 'Vibrador externo de cabeza ancha pensado sobre todo para una estimulación superficial intensa, especialmente de genitales externos y en ocasiones pezones.',
  },
  'bullet-vibrator': {
    targetSites: ['external-genitals', 'vaginal', 'anal', 'nipples'],
    descriptionEn: 'A small compact vibrator used for focused stimulation and easy positioning on external genitals, nipples or compatible internal sites.',
    descriptionEs: 'Vibrador pequeño y compacto para estimulación localizada y fácil colocación en genitales externos, pezones o zonas internas compatibles.',
  },
  'rabbit-vibrator': {
    targetSites: ['external-genitals', 'vaginal'],
    descriptionEn: 'A vibrator designed to combine vaginal insertion with simultaneous stimulation of the external genitals.',
    descriptionEs: 'Vibrador diseñado para combinar inserción vaginal con estimulación simultánea de los genitales externos.',
  },
  dildo: {
    targetSites: ['mouth', 'vaginal', 'anal'],
    descriptionEn: 'A non-motorized penetrative toy used orally, vaginally or anally depending on its shape and intended use.',
    descriptionEs: 'Juguete de penetración sin motor que puede usarse por vía oral, vaginal o anal según su forma y uso previsto.',
  },
  'realistic-dildo': {
    targetSites: ['mouth', 'vaginal', 'anal'],
    descriptionEn: 'A dildo shaped to resemble a penis more closely in form, proportions or surface detail.',
    descriptionEs: 'Dildo diseñado para parecerse más a un pene en forma, proporciones o detalles de superficie.',
  },
  'glass-dildo': {
    targetSites: ['mouth', 'vaginal', 'anal'],
    descriptionEn: 'A rigid dildo made from body-safe glass, valued for firmness, smoothness and temperature response.',
    descriptionEs: 'Dildo rígido de vidrio apto para uso corporal, apreciado por su firmeza, superficie lisa y respuesta a la temperatura.',
  },
  'metal-dildo': {
    targetSites: ['mouth', 'vaginal', 'anal'],
    descriptionEn: 'A rigid metal dildo that provides substantial weight, firmness and strong temperature conduction.',
    descriptionEs: 'Dildo rígido de metal que aporta peso, firmeza y una marcada conducción de la temperatura.',
  },
  'double-ended-dildo': {
    targetSites: ['mouth', 'vaginal', 'anal'],
    descriptionEn: 'A dildo with usable ends on both sides, allowing shared use or penetration from different orientations.',
    descriptionEs: 'Dildo utilizable por ambos extremos, que permite uso compartido o penetración desde distintas orientaciones.',
  },
  'anal-plug': {
    targetSites: ['anal'],
    descriptionEn: 'A toy designed to remain inserted anally for sustained pressure, fullness or decorative use.',
    descriptionEs: 'Juguete diseñado para permanecer introducido analmente y proporcionar presión, sensación de llenado o uso decorativo.',
  },
  'vibrating-anal-plug': {
    targetSites: ['anal'],
    descriptionEn: 'An anal plug that adds vibration to the sustained pressure and fullness of a conventional plug.',
    descriptionEs: 'Plug anal que añade vibración a la presión y sensación de llenado de un plug convencional.',
  },
  'anal-beads': {
    targetSites: ['anal'],
    descriptionEn: 'A sequence of connected beads inserted and removed gradually for changing anal pressure and sensation.',
    descriptionEs: 'Serie de bolas conectadas que se introducen y extraen gradualmente para variar la presión y sensación anal.',
  },
  'prostate-massager': {
    targetSites: ['anal'],
    descriptionEn: 'An anal toy shaped to apply focused pressure to the prostate.',
    descriptionEs: 'Juguete anal diseñado para aplicar presión localizada sobre la próstata.',
  },
  'butt-plug-tail': {
    targetSites: ['anal'],
    descriptionEn: 'An anal plug fitted with a decorative tail, combining anal insertion with a visible roleplay or aesthetic element.',
    descriptionEs: 'Plug anal con una cola decorativa que combina inserción anal con un elemento visible de estética o roleplay.',
  },
  'strap-on': {
    targetSites: ['mouth', 'vaginal', 'anal'],
    descriptionEn: 'A penetrative toy held by a harness so the wearer can penetrate a partner orally, vaginally or anally as appropriate.',
    descriptionEs: 'Juguete de penetración sujeto mediante un arnés para que quien lo lleva pueda penetrar a la pareja por vía oral, vaginal o anal según corresponda.',
  },
  'strapless-strap-on': {
    targetSites: ['vaginal', 'anal'],
    descriptionEn: 'A harness-free penetrative toy retained by the wearer while another end is used to penetrate a partner.',
    descriptionEs: 'Juguete de penetración sin arnés que quien lo lleva mantiene sujeto mientras el otro extremo se utiliza para penetrar a la pareja.',
  },
  'penis-sleeve': {
    targetSites: ['penis'],
    descriptionEn: 'A sleeve worn over the penis to change thickness, texture or the sensations produced during stimulation or penetration.',
    descriptionEs: 'Funda colocada sobre el pene para modificar grosor, textura o las sensaciones durante la estimulación o penetración.',
  },
  'cock-ring': {
    targetSites: ['penis'],
    descriptionEn: 'A ring worn around the penis, or penis and testicles depending on the design, to create pressure and alter sensation.',
    descriptionEs: 'Anillo que se coloca alrededor del pene, o del pene y testículos según el diseño, para generar presión y modificar la sensación.',
  },
  'vibrating-cock-ring': {
    targetSites: ['penis'],
    descriptionEn: 'A cock ring that adds vibration, usually providing stimulation to the wearer and potentially to a partner during contact.',
    descriptionEs: 'Anillo para pene que añade vibración, normalmente estimulando a quien lo lleva y potencialmente a la pareja durante el contacto.',
  },
  'masturbator-sleeve': {
    targetSites: ['penis'],
    descriptionEn: 'A handheld sleeve that surrounds the penis to provide friction, pressure or textured stimulation.',
    descriptionEs: 'Funda de mano que rodea el pene para proporcionar fricción, presión o estimulación con textura.',
  },
  'automatic-masturbator': {
    targetSites: ['penis'],
    descriptionEn: 'A powered masturbator that produces repeated movement, vibration or pressure around the penis automatically.',
    descriptionEs: 'Masturbador motorizado que produce automáticamente movimiento repetido, vibración o presión alrededor del pene.',
  },
  'penis-pump': {
    targetSites: ['penis'],
    descriptionEn: 'A vacuum device placed around the penis to create temporary engorgement and a pressure sensation.',
    descriptionEs: 'Dispositivo de vacío colocado alrededor del pene para producir congestión temporal y sensación de presión.',
  },
  'clitoral-suction-toy': {
    targetSites: ['external-genitals'],
    descriptionEn: 'A toy designed to stimulate the clitoral area with pulses of air or localized suction-like pressure.',
    descriptionEs: 'Juguete diseñado para estimular la zona del clítoris mediante pulsos de aire o una presión localizada similar a la succión.',
  },
  'kegel-balls': {
    targetSites: ['vaginal'],
    descriptionEn: 'Weighted or linked balls worn inside the vagina for internal sensation and pelvic-floor play.',
    descriptionEs: 'Bolas con peso o unidas que se llevan dentro de la vagina para sensación interna y juego con el suelo pélvico.',
  },
  'remote-control-toy': {
    targetSites: ['external-genitals', 'vaginal', 'anal'],
    descriptionEn: 'A vibrator or motorized toy whose intensity or pattern can be controlled remotely by a partner or an app.',
    descriptionEs: 'Vibrador o juguete motorizado cuya intensidad o patrón puede controlarse a distancia por la pareja o mediante una aplicación.',
  },
  'wearable-vibrator': {
    targetSites: ['external-genitals', 'vaginal', 'anal'],
    descriptionEn: 'A vibrator designed to remain positioned on or inside the genitals while moving or during other activity.',
    descriptionEs: 'Vibrador diseñado para permanecer colocado sobre o dentro de los genitales mientras se camina o se realiza otra actividad.',
  },
  'sex-machine': {
    targetSites: ['vaginal', 'anal'],
    descriptionEn: 'A powered machine that drives an attached penetrative toy in repeated motion for vaginal or anal use.',
    descriptionEs: 'Máquina motorizada que mueve repetidamente un juguete de penetración acoplado para uso vaginal o anal.',
  },
  'nipple-suction-cups': {
    targetSites: ['nipples'],
    descriptionEn: 'Small suction cups placed over the nipples to create sustained vacuum pressure and sensitivity.',
    descriptionEs: 'Pequeñas ventosas colocadas sobre los pezones para producir presión de vacío sostenida y aumentar la sensibilidad.',
  },
  pinwheel: {
    targetSites: ['body'],
    descriptionEn: 'A Wartenberg wheel rolled over the skin to create a narrow line of sharp, localized sensation.',
    descriptionEs: 'Rueda de Wartenberg que se hace rodar sobre la piel para producir una línea estrecha de sensación aguda y localizada.',
  },
  'sex-swing': {
    descriptionEn: 'A suspended seat or support used to hold or vary sexual positions while reducing how much body weight the partners must support.',
    descriptionEs: 'Asiento o soporte suspendido utilizado para mantener o variar posturas sexuales reduciendo el peso que deben sostener las personas.',
  },
  'positioning-pillow': {
    descriptionEn: 'A firm wedge or shaped cushion used to support the body and change angles during sexual activity.',
    descriptionEs: 'Cojín firme, en cuña o con forma, utilizado para sostener el cuerpo y modificar ángulos durante la actividad sexual.',
  },
  'vacuum-cup-toys': {
    targetSites: ['vaginal', 'anal'],
    descriptionEn: 'Penetrative toys with a suction base that fixes them to a smooth surface for hands-free vaginal or anal use.',
    descriptionEs: 'Juguetes de penetración con base de ventosa que se fijan a una superficie lisa para uso vaginal o anal sin sujetarlos con las manos.',
  },

  'spitting-on-body': {
    descriptionEn: 'Spitting saliva onto a partner’s skin or body, with doing it and receiving it rated separately.',
    descriptionEs: 'Escupir saliva sobre la piel o el cuerpo de la pareja, valorando por separado hacerlo y recibirlo.',
  },
  'spitting-in-mouth': {
    descriptionEn: 'Spitting saliva directly into a partner’s mouth or receiving it in the mouth.',
    descriptionEs: 'Escupir saliva directamente en la boca de la pareja o recibirla en la propia boca.',
  },
  'saliva-sharing': {
    descriptionEn: 'Deliberately exchanging saliva between mouths, usually through kissing or mouth-to-mouth contact.',
    descriptionEs: 'Intercambiar saliva deliberadamente entre las bocas, normalmente mediante besos o contacto boca a boca.',
  },
  drooling: {
    descriptionEn: 'Letting saliva drip onto a partner or having a partner drool onto you as part of sexual play.',
    descriptionEs: 'Dejar caer saliva sobre la pareja o que la pareja babee sobre ti como parte del juego sexual.',
  },
  'semen-on-face': {
    descriptionEn: 'Ejaculating semen onto a partner’s face or receiving semen on the face.',
    descriptionEs: 'Eyacular semen sobre la cara de la pareja o recibir semen sobre la propia cara.',
  },
  'semen-on-breasts': {
    descriptionEn: 'Ejaculating semen onto a partner’s breasts or receiving semen on the chest or breasts.',
    descriptionEs: 'Eyacular semen sobre el pecho de la pareja o recibir semen sobre el propio pecho.',
  },
  'semen-on-buttocks': {
    descriptionEn: 'Ejaculating semen onto a partner’s buttocks or receiving semen on the buttocks.',
    descriptionEs: 'Eyacular semen sobre los glúteos de la pareja o recibir semen sobre los propios glúteos.',
  },
  'semen-in-mouth': {
    descriptionEn: 'Ejaculating semen into a partner’s mouth or receiving semen in the mouth, independently of swallowing it.',
    descriptionEs: 'Eyacular semen en la boca de la pareja o recibir semen en la propia boca, independientemente de tragarlo.',
  },
  swallowing: {
    descriptionEn: 'Swallowing semen after receiving it in the mouth, or having a partner swallow yours.',
    descriptionEs: 'Tragar semen después de recibirlo en la boca o que la pareja trague el propio.',
  },
  snowballing: {
    descriptionEn: 'Passing semen from one mouth to another, commonly through kissing or direct mouth-to-mouth transfer.',
    descriptionEs: 'Pasar semen de una boca a otra, normalmente mediante besos o transferencia directa boca a boca.',
  },
  'creampie-vaginal': {
    descriptionEn: 'Ejaculation inside the vagina, distinguished from anal internal ejaculation and from semen placed externally.',
    descriptionEs: 'Eyaculación dentro de la vagina, diferenciada de la eyaculación interna anal y del semen depositado externamente.',
  },
  'creampie-anal': {
    descriptionEn: 'Ejaculation inside the anus or rectum, distinguished from vaginal internal ejaculation and external semen play.',
    descriptionEs: 'Eyaculación dentro del ano o recto, diferenciada de la eyaculación interna vaginal y del juego externo con semen.',
  },
  'creampie-cleanup': {
    descriptionEn: 'Sexual play focused on licking, removing or otherwise cleaning semen after internal ejaculation.',
    descriptionEs: 'Juego sexual centrado en lamer, retirar o limpiar de otra forma el semen después de una eyaculación interna.',
  },
  'female-ejaculation': {
    descriptionEn: 'Female ejaculation or squirting, rated separately as something that happens to you and something that happens to a partner.',
    descriptionEs: 'Eyaculación femenina o squirting, valorada por separado como algo que ocurre en ti o en tu pareja.',
  },
  'urine-play': {
    descriptionEn: 'Sexual play involving urine on the body or between partners, with giving and receiving treated as distinct preferences.',
    descriptionEs: 'Juego sexual con orina sobre el cuerpo o entre las personas, diferenciando las preferencias por dar y recibir.',
  },
  'urine-drinking': {
    descriptionEn: 'Drinking a partner’s urine or having a partner drink yours as a distinct fluid-play preference.',
    descriptionEs: 'Beber la orina de la pareja o que la pareja beba la propia como preferencia específica dentro del juego con fluidos.',
  },
  'blood-play': {
    descriptionEn: 'Sexual interest in the presence, sight or handling of blood, without requiring cutting or another specific method of producing it.',
    descriptionEs: 'Interés sexual por la presencia, visión o manipulación de sangre, sin requerir cortes ni un método concreto para obtenerla.',
  },
  'sweat-licking': {
    descriptionEn: 'Licking sweat from a partner’s skin or having a partner lick sweat from yours.',
    descriptionEs: 'Lamer el sudor de la piel de la pareja o que la pareja lama el de la propia piel.',
  },
  'food-body-play': {
    descriptionEn: 'Putting food on the body and incorporating its texture, taste or removal into sexual play.',
    descriptionEs: 'Colocar comida sobre el cuerpo e incorporar su textura, sabor o retirada al juego sexual.',
  },
  'oil-body-play': {
    descriptionEn: 'Using body oil to create slippery skin, massage or sustained body-to-body contact during sexual play.',
    descriptionEs: 'Usar aceite corporal para crear piel resbaladiza, masaje o contacto prolongado cuerpo a cuerpo durante el juego sexual.',
  },
  'mud-body-play': {
    descriptionEn: 'Using mud or other messy non-bodily substances on the body for texture, messiness or sensory play.',
    descriptionEs: 'Usar barro u otras sustancias pringosas no corporales sobre el cuerpo por su textura, suciedad o componente sensorial.',
  },
};

const PRACTICE_ORDER: Readonly<Record<string, readonly string[]>> = {
  'affection-intimacy': [
    'kissing',
    'making-out',
    'verbal-affection',
    'holding-hands',
    'hair-stroking',
    'face-caressing',
    'back-rubs',
    'skin-to-skin-contact',
    'cuddling',
    'spooning',
    'sleeping-naked-together',
    'showering-together',
    'bathing-together',
    'sensual-massage',
  ],
  oral: [
    'cunnilingus',
    'fellatio',
    'deep-throat',
    'oral-teasing',
    'oral-anal',
    'oral-nipples',
    'oral-breasts',
    'oral-fingers',
    'oral-toes',
  ],
  penetration: [
    'vaginal-penetration',
    'anal-penetration',
    'shallow-penetration',
    'deep-penetration',
    'slow-penetration',
    'rough-penetration',
    'double-vaginal-penetration',
    'double-anal-penetration',
    'fisting-vaginal',
    'fisting-anal',
    'prostate-penetration',
    'cervix-contact',
  ],
  'sexual-positions': [
    'missionary',
    'legs-on-shoulders',
    'cowgirl',
    'reverse-cowgirl',
    'doggy-style',
    'spooning-penetration',
    'seated-penetration',
    'lotus-position',
    'standing-penetration',
    'against-wall',
    'sixty-nine',
    'face-sitting',
  ],
  toys: [
    'vibrator',
    'wand-vibrator',
    'bullet-vibrator',
    'rabbit-vibrator',
    'wearable-vibrator',
    'remote-control-toy',
    'dildo',
    'realistic-dildo',
    'glass-dildo',
    'metal-dildo',
    'double-ended-dildo',
    'anal-plug',
    'vibrating-anal-plug',
    'anal-beads',
    'prostate-massager',
    'butt-plug-tail',
    'strap-on',
    'strapless-strap-on',
    'penis-sleeve',
    'cock-ring',
    'vibrating-cock-ring',
    'masturbator-sleeve',
    'automatic-masturbator',
    'penis-pump',
    'clitoral-suction-toy',
    'kegel-balls',
    'sex-machine',
    'vacuum-cup-toys',
    'nipple-suction-cups',
    'pinwheel',
    'sex-swing',
    'positioning-pillow',
  ],
  fluids: [
    'spitting-on-body',
    'spitting-in-mouth',
    'saliva-sharing',
    'drooling',
    'semen-on-face',
    'semen-on-breasts',
    'semen-on-buttocks',
    'semen-in-mouth',
    'swallowing',
    'spitting-semen',
    'snowballing',
    'creampie-vaginal',
    'creampie-anal',
    'creampie-cleanup',
    'female-ejaculation',
    'urine-play',
    'urine-drinking',
    'blood-play',
    'blood-on-body',
    'blood-drinking',
    'scat-on-body',
    'scat-in-mouth',
    'scat-ingestion',
    'sweat-licking',
    'food-body-play',
    'oil-body-play',
    'mud-body-play',
  ],
};

interface PracticeEntry {
  readonly sourceCategoryId: string;
  readonly targetCategoryId: string;
  readonly practice: CataloguePracticeSeed;
  readonly sourceIndex: number;
}

export function polishCatalogue(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  const baseCategories = new Map(content.map((category) => [category.id, category]));
  const entries: PracticeEntry[] = content.flatMap((category) =>
    category.practices.map((practice, sourceIndex) => ({
      sourceCategoryId: category.id,
      targetCategoryId: CATEGORY_MOVES[practice.id] ?? category.id,
      practice: finalizePractice({ ...practice, ...(PRACTICE_OVERRIDES[practice.id] ?? {}) }),
      sourceIndex,
    })),
  );

  for (const [categoryId, practices] of Object.entries(ADDITIONAL_PRACTICES)) {
    practices.forEach((practice, sourceIndex) => entries.push({
      sourceCategoryId: categoryId,
      targetCategoryId: categoryId,
      practice: finalizePractice(practice),
      sourceIndex: content.length + sourceIndex,
    }));
  }

  return CATEGORY_ORDER.map((categoryId, order) => {
    const base = baseCategories.get(categoryId) ?? (categoryId === 'sexual-positions' ? SEXUAL_POSITIONS : undefined);
    if (!base) throw new Error(`Missing polished Catalogue V3 category: ${categoryId}`);
    const practices = entries
      .filter((entry) => entry.targetCategoryId === categoryId)
      .sort((left, right) => comparePracticeOrder(categoryId, left, right))
      .map((entry) => entry.practice);

    return {
      ...base,
      id: categoryId,
      order,
      practices,
    };
  });
}

function finalizePractice(seed: CataloguePracticeSeed): CataloguePracticeSeed {
  return {
    ...seed,
    descriptionEn: describeCataloguePractice(seed, 'en'),
    descriptionEs: describeCataloguePractice(seed, 'es'),
  };
}

function comparePracticeOrder(categoryId: string, left: PracticeEntry, right: PracticeEntry): number {
  const preferred = PRACTICE_ORDER[categoryId];
  if (!preferred) return left.sourceIndex - right.sourceIndex;
  const leftIndex = preferred.indexOf(left.practice.id);
  const rightIndex = preferred.indexOf(right.practice.id);
  const normalizedLeft = leftIndex < 0 ? Number.MAX_SAFE_INTEGER : leftIndex;
  const normalizedRight = rightIndex < 0 ? Number.MAX_SAFE_INTEGER : rightIndex;
  if (normalizedLeft !== normalizedRight) return normalizedLeft - normalizedRight;
  return left.sourceIndex - right.sourceIndex;
}
