import { CatalogueCategorySeed, CataloguePracticeSeed } from './types';

const ACCESSORY_PRACTICE_IDS = new Set([
  'penis-sleeve',
  'cock-ring',
  'vibrating-cock-ring',
  'masturbator-sleeve',
  'automatic-masturbator',
  'penis-pump',
  'clitoral-suction-toy',
  'kegel-balls',
  'nipple-suction-cups',
  'pinwheel',
  'sex-machine',
  'sex-swing',
  'positioning-pillow',
  'everyday-object-play',
  'everyday-object-vaginal-penetration',
  'everyday-object-anal-penetration',
]);

const PRACTICE_OVERRIDES: Readonly<Record<string, Partial<CataloguePracticeSeed>>> = {
  'pussy-torture': {
    en: 'Vulvar torture',
    es: 'Tortura vulvar',
    descriptionEn: 'High-intensity edge play focused on pain or vulnerability of the vulva and external female genitals. It is separate from vaginal torture, which focuses on the internal canal.',
    descriptionEs: 'Juego edge de alta intensidad centrado en dolor o vulnerabilidad de la vulva y los genitales externos femeninos. Se separa de la tortura vaginal, centrada en el canal interno.',
    roleLabels: {
      give: { en: 'Apply vulvar torture to my partner', es: 'Aplicar tortura vulvar a mi pareja' },
      receive: { en: 'Receive vulvar torture', es: 'Recibir tortura vulvar' },
    },
  },
  'forced-orgasm': {
    roleLabels: {
      give: { en: 'Keep stimulating my partner through a forced orgasm', es: 'Seguir estimulando a mi pareja durante un orgasmo forzado' },
      receive: { en: 'Have my partner keep stimulating me through a forced orgasm', es: 'Que mi pareja siga estimulándome durante un orgasmo forzado' },
    },
  },
  'preagreed-unannounced-watching': {
    en: 'Unannounced watching',
    es: 'Observación sin aviso',
    descriptionEn: 'Watching a partner without warning them at that moment, within an explicit prior agreement that allows this possibility. It does not include watching someone who never agreed to that framework.',
    descriptionEs: 'Observar a la pareja sin avisarla en ese momento, dentro de un acuerdo previo explícito que permite esa posibilidad. No incluye observar a alguien que nunca haya aceptado ese marco.',
  },
  'food-body-play': {
    en: 'Food on the body',
    es: 'Alimentos sobre el cuerpo',
    descriptionEn: 'Using food on the skin or body for texture, messiness or sensual presentation, without making eating it or penetration the main focus.',
    descriptionEs: 'Usar alimentos sobre la piel o el cuerpo por su textura, por ensuciarse o como presentación sensual, sin que comerlos o la penetración sean el foco principal.',
  },
};

const ADDITIONS: Readonly<Record<string, readonly CataloguePracticeSeed[]>> = {
  'sexual-style': [
    mutual('spontaneous-sex', 'Spontaneous sex', 'Sexo espontáneo',
      'An encounter that develops without being planned in advance, where immediacy and improvisation are part of the appeal.',
      'Un encuentro que surge sin haber sido planificado, donde la inmediatez y la improvisación forman parte del atractivo.', true),
    mutual('planned-sex', 'Planned sex', 'Sexo planificado',
      'Sex arranged or anticipated beforehand, where making time for it and looking forward to it are part of the experience.',
      'Sexo acordado o previsto con antelación, donde reservar el momento y anticiparlo forman parte de la experiencia.', true),
    mutual('quiet-sex', 'Quiet / discreet sex', 'Sexo silencioso o discreto',
      'An encounter where deliberately keeping voices and noise low is part of the atmosphere, independently of where it happens.',
      'Un encuentro donde mantener deliberadamente bajos la voz y el ruido forma parte del ambiente, independientemente del lugar.', true),
    mutual('vocal-expressive-sex', 'Vocal & expressive sex', 'Sexo vocal y expresivo',
      'An encounter where moaning, verbal reactions and audible expression are an important part of the overall atmosphere.',
      'Un encuentro donde gemidos, reacciones verbales y expresión audible forman una parte importante del ambiente general.', true),
    mutual('immersive-focused-sex', 'Immersive / focused sex', 'Sexo inmersivo y concentrado',
      'An encounter built around sustained attention to each other with as few distractions or interruptions as possible.',
      'Un encuentro centrado en mantener la atención mutua con las mínimas distracciones o interrupciones posibles.', true),
    mutual('energetic-sex', 'Energetic sex', 'Sexo enérgico',
      'A physically lively, active encounter without implying a particular speed, roughness level or specific sexual act.',
      'Un encuentro físicamente activo y lleno de energía sin implicar una velocidad, brusquedad o práctica concreta.', true),
  ],
  'orgasm-control': [
    directed(
      'orgasm-on-command',
      'Orgasm on command',
      'Orgasmo a una señal',
      'Timing an orgasm around a partner’s explicit cue, making the moment of release itself part of the control dynamic.',
      'Sincronizar el orgasmo con una señal explícita de la pareja, haciendo que el momento de correrse forme parte de la dinámica de control.',
      'Give my partner the cue to orgasm', 'Dar a mi pareja la señal para correrse',
      'Orgasm when my partner gives the cue', 'Correrme cuando mi pareja dé la señal',
    ),
    directed(
      'orgasm-permission',
      'Orgasm permission',
      'Permiso para el orgasmo',
      'A dynamic where one partner decides when the other may orgasm and permission is an explicit part of the erotic structure.',
      'Dinámica donde una persona decide cuándo puede correrse la otra y el permiso forma parte explícita de la estructura erótica.',
      'Decide when my partner may orgasm', 'Decidir cuándo puede correrse mi pareja',
      'Need my partner’s permission to orgasm', 'Necesitar el permiso de mi pareja para correrme',
    ),
    directed(
      'orgasm-count-control',
      'Orgasm count control',
      'Control del número de orgasmos',
      'Setting a desired number, minimum or maximum of orgasms for a partner during a session.',
      'Fijar para la pareja un número deseado, mínimo o máximo de orgasmos durante una sesión.',
      'Set an orgasm count for my partner', 'Fijar un número de orgasmos para mi pareja',
      'Have my partner set my orgasm count', 'Que mi pareja fije cuántos orgasmos tendré',
    ),
  ],
  groups: [
    group(
      'group-oral-focus',
      'Group oral focus',
      'Sexo oral centrado en una persona',
      'A group scene where several participants focus oral stimulation on one central person.',
      'Escena grupal donde varias personas concentran la estimulación oral en una persona central.',
      'Be the person receiving the group’s oral attention', 'Ser la persona que recibe la atención oral del grupo',
      'Give oral attention as part of the group', 'Dar estimulación oral como parte del grupo',
    ),
    group(
      'group-worship-focus',
      'Group worship / attention focus',
      'Adoración o atención grupal',
      'A group scene where one person is the focus of coordinated erotic attention, touch or worship from several participants.',
      'Escena grupal donde una persona es el centro de atención erótica, contacto o adoración coordinada de varias personas.',
      'Be the focus of the group’s attention', 'Ser el centro de la atención del grupo',
      'Take part in focusing attention on one person', 'Participar centrando la atención en una persona',
    ),
    mutual('group-masturbation-circle', 'Group masturbation', 'Masturbación en grupo',
      'Several people masturbating together in the same scene, without requiring one person to be the centre.',
      'Varias personas masturbándose juntas en la misma escena, sin necesidad de que una sea el centro.'),
    mutual('group-shared-toy-play', 'Shared toy play in a group', 'Juguetes compartidos en grupo',
      'A multi-person scene where sharing or passing sexual toys between participants is part of the appeal.',
      'Escena con varias personas donde compartir o pasar juguetes sexuales entre participantes forma parte del atractivo.'),
  ],
  'places-settings': [
    mutual('sex-private-pool-hot-tub', 'Sex in a private pool / hot tub', 'Sexo en piscina o jacuzzi privado',
      'Sexual activity in a private pool, hot tub or similar water setting where the water and setting are part of the appeal.',
      'Actividad sexual en una piscina, jacuzzi o entorno acuático privado donde el agua y el lugar forman parte del atractivo.'),
    mutual('sex-on-boat-private', 'Sex on a boat / private cabin', 'Sexo en barco o camarote privado',
      'Sexual activity aboard a boat in a private or secluded setting, such as a cabin or isolated anchorage.',
      'Actividad sexual a bordo de un barco en un entorno privado o apartado, como un camarote o fondeadero aislado.'),
    mutual('sex-on-rooftop-private', 'Sex on a secluded rooftop / terrace', 'Sexo en azotea o terraza apartada',
      'A rooftop or terrace where height, open air and atmosphere matter while the setting remains controlled and secluded.',
      'Una azotea o terraza donde importan la altura, el aire libre y el ambiente, manteniendo un entorno controlado y apartado.'),
    mutual('sex-on-private-balcony', 'Sex on a private balcony', 'Sexo en balcón privado',
      'Sexual activity on a private balcony where the boundary between indoor privacy and the outside atmosphere is part of the appeal.',
      'Actividad sexual en un balcón privado donde el límite entre la intimidad interior y el ambiente exterior forma parte del atractivo.'),
    mutual('sex-in-camper-rv', 'Sex in a camper / RV', 'Sexo en caravana o autocaravana',
      'Sexual activity in a camper, caravan or motorhome, combining a compact private space with travel or temporary living.',
      'Actividad sexual en una caravana o autocaravana, combinando un espacio privado compacto con viaje o alojamiento temporal.'),
    mutual('sex-in-train-private-cabin', 'Sex in a private train cabin', 'Sexo en compartimento privado de tren',
      'Sexual activity in a private sleeper or train compartment where travel and movement are part of the setting.',
      'Actividad sexual en un compartimento o coche cama privado donde el viaje y el movimiento forman parte del entorno.'),
    mutual('sex-in-changing-room-controlled', 'Sex in a private changing room', 'Sexo en vestuario o probador privado',
      'A controlled changing-room or dressing-space setting where the unusual location matters without involving unaware bystanders.',
      'Un vestuario o probador controlado donde importa lo inusual del lugar sin implicar a terceros ajenos.'),
    mutual('sex-in-elevator-after-hours', 'Sex in an elevator after hours', 'Sexo en ascensor fuera de horario',
      'An elevator used in a controlled after-hours situation where enclosure and brief transgression shape the fantasy.',
      'Un ascensor usado en una situación controlada fuera de horario donde el espacio cerrado y la transgresión breve dan forma a la fantasía.'),
    mutual('sex-in-studio-warehouse', 'Sex in a private studio / warehouse', 'Sexo en estudio o nave privada',
      'A large private studio, workshop or warehouse where scale, emptiness or an unusual industrial atmosphere is part of the appeal.',
      'Un estudio, taller o nave privada donde la amplitud, el vacío o una atmósfera industrial inusual forman parte del atractivo.'),
    mutual('sex-in-secluded-forest', 'Sex in a secluded forest', 'Sexo en bosque apartado',
      'A secluded woodland setting where natural surroundings and isolation are central to the atmosphere.',
      'Un entorno boscoso apartado donde la naturaleza y el aislamiento son centrales para el ambiente.'),
    mutual('sex-at-secluded-viewpoint', 'Sex at a secluded viewpoint', 'Sexo en mirador apartado',
      'A secluded scenic viewpoint where landscape, height or remoteness contribute to the experience.',
      'Un mirador apartado donde el paisaje, la altura o la lejanía contribuyen a la experiencia.'),
    mutual('sex-in-private-sauna-spa', 'Sex in a private sauna / spa', 'Sexo en sauna o spa privado',
      'A private sauna, steam room or spa setting where warmth, humidity and the dedicated environment are part of the appeal.',
      'Una sauna, baño de vapor o spa privado donde el calor, la humedad y el entorno específico forman parte del atractivo.'),
  ],
  power: [
    directed(
      'oral-service',
      'Oral service',
      'Servicio oral',
      'Oral stimulation framed specifically as serving a partner rather than simply as an oral-sex preference.',
      'Estimulación oral planteada específicamente como servicio a la pareja, y no solo como preferencia por el sexo oral.',
      'Provide oral service to my partner', 'Prestar servicio oral a mi pareja',
      'Receive oral service from my partner', 'Recibir servicio oral de mi pareja',
    ),
    directed(
      'manual-pleasure-service',
      'Manual pleasure service',
      'Servicio de placer manual',
      'Using hands or fingers to pleasure a partner with the act of serving them as the defining part of the dynamic.',
      'Usar manos o dedos para dar placer a la pareja haciendo del propio acto de servir el elemento definitorio de la dinámica.',
      'Provide manual pleasure service', 'Prestar servicio de placer manual',
      'Receive manual pleasure service', 'Recibir servicio de placer manual',
    ),
    directed(
      'orgasm-service',
      'Orgasm-focused service',
      'Servicio centrado en el orgasmo',
      'A service role centred on bringing a partner to orgasm as the servant’s assigned erotic objective.',
      'Rol de servicio centrado en llevar a la pareja al orgasmo como objetivo erótico asignado a quien sirve.',
      'Serve by focusing on my partner’s orgasm', 'Servir centrándome en el orgasmo de mi pareja',
      'Be served with my orgasm as the focus', 'Ser servido/a teniendo mi orgasmo como objetivo',
    ),
    directed(
      'intimate-grooming-service',
      'Intimate grooming service',
      'Servicio de aseo íntimo',
      'Washing, grooming, shaving or preparing a partner’s body when personal care itself forms part of the service role.',
      'Lavar, asear, afeitar o preparar el cuerpo de la pareja cuando el cuidado personal forma parte del propio rol de servicio.',
      'Provide intimate grooming service', 'Prestar servicio de aseo íntimo',
      'Receive intimate grooming service', 'Recibir servicio de aseo íntimo',
    ),
    directed(
      'fetish-scent-service',
      'Fetish scent service',
      'Servicio fetichista de olor corporal',
      'Offering body scent, worn clothing, feet or another scent-focused element as a deliberate act of fetish-oriented service.',
      'Ofrecer olor corporal, ropa usada, pies u otro elemento olfativo como acto deliberado de servicio fetichista.',
      'Provide scent-focused fetish service', 'Prestar servicio fetichista centrado en el olor',
      'Receive scent-focused fetish service', 'Recibir servicio fetichista centrado en el olor',
    ),
    directed(
      'toilet-service-fantasy',
      'Toilet service fantasy',
      'Fantasía de servicio de aseo extremo',
      'An extreme service-role fantasy built around intimate toilet or waste-related attendance. Specific urine or scat interests are rated separately under Fluids.',
      'Fantasía extrema de servicio basada en atención íntima relacionada con aseo o desechos. Los intereses concretos de orina o scat se valoran aparte en Fluidos.',
      'Take the serving role in the toilet-service fantasy', 'Llevar el rol de servicio en la fantasía de aseo extremo',
      'Take the receiving role in the toilet-service fantasy', 'Llevar el rol receptor en la fantasía de aseo extremo',
    ),
  ],
  surrealism: [
    paired(
      'clone-duplication-fantasy', 'Clone / duplication fantasy', 'Fantasía de clones o duplicación',
      'Impossible fantasy involving one person being duplicated into multiple simultaneous versions of themselves.',
      'Fantasía imposible donde una persona se duplica en varias versiones simultáneas de sí misma.',
      'be-duplicated', 'Be duplicated into several versions', 'Ser duplicado/a en varias versiones', 'neutral',
      'be-with-duplicates', 'Be with duplicates of my partner', 'Estar con duplicados de mi pareja', 'neutral',
    ),
    paired(
      'possession-fantasy', 'Possession fantasy', 'Fantasía de posesión sobrenatural',
      'A fictional supernatural premise where one character takes control of another body or is inhabited by an outside presence.',
      'Premisa sobrenatural ficticia donde un personaje toma el control de otro cuerpo o es habitado por una presencia externa.',
      'possess', 'Take the possessing / controlling role', 'Llevar el rol de posesión o control', 'active',
      'be-possessed', 'Be the possessed character', 'Ser el personaje poseído', 'receptive',
    ),
    paired(
      'slime-creature-fantasy', 'Slime / amorphous creature fantasy', 'Fantasía de criatura de slime',
      'Impossible fantasy involving a fluid, gel-like or amorphous fictional creature whose body can envelop or reshape around a person.',
      'Fantasía imposible con una criatura ficticia fluida, gelatinosa o amorfa cuyo cuerpo puede envolver o adaptarse alrededor de una persona.',
      'be-slime-creature', 'Be the amorphous creature', 'Ser la criatura amorfa', 'neutral',
      'be-with-slime-creature', 'Be with the amorphous creature', 'Estar con la criatura amorfa', 'neutral',
    ),
    paired(
      'oviposition-fantasy', 'Oviposition fantasy', 'Fantasía de oviposición',
      'Explicitly fictional fantasy involving impossible egg implantation or deposition as part of a non-real biological scenario.',
      'Fantasía explícitamente ficticia de implantación o depósito imposible de huevos dentro de un escenario biológico no real.',
      'implant-eggs', 'Take the fictional implanting role', 'Llevar el rol ficticio de implantación', 'active',
      'receive-eggs', 'Receive the fictional eggs', 'Recibir los huevos ficticios', 'receptive',
    ),
    paired(
      'object-transformation-fantasy', 'Object transformation fantasy', 'Fantasía de transformación en objeto',
      'Impossible transformation fantasy where a person temporarily becomes an inanimate or functional erotic object.',
      'Fantasía de transformación imposible donde una persona se convierte temporalmente en un objeto inanimado o funcional de carácter erótico.',
      'be-transformed-object', 'Be transformed into the object', 'Ser transformado/a en el objeto', 'receptive',
      'interact-transformed-object', 'Interact with the transformed partner', 'Interactuar con la pareja transformada', 'active',
    ),
    paired(
      'living-symbiote-fantasy', 'Living symbiote fantasy', 'Fantasía de simbionte vivo',
      'Impossible fantasy involving a living fictional organism that covers, wears, merges with or moves around a person’s body.',
      'Fantasía imposible con un organismo ficticio vivo que cubre, viste, se fusiona o se mueve alrededor del cuerpo de una persona.',
      'host-symbiote', 'Host or wear the living symbiote', 'Alojar o llevar el simbionte vivo', 'receptive',
      'be-symbiote', 'Take the symbiote role around a partner', 'Llevar el rol de simbionte alrededor de la pareja', 'active',
    ),
  ],
  edge: [
    directed(
      'vaginal-torture',
      'Vaginal torture',
      'Tortura vaginal',
      'High-intensity edge play focused on pain, pressure or vulnerability inside the vaginal canal. It is separate from vulvar torture, which focuses on external genitals.',
      'Juego edge de alta intensidad centrado en dolor, presión o vulnerabilidad dentro del canal vaginal. Se separa de la tortura vulvar, centrada en los genitales externos.',
      'Apply vaginal torture to my partner', 'Aplicar tortura vaginal a mi pareja',
      'Receive vaginal torture', 'Recibir tortura vaginal',
      'female',
    ),
    directed(
      'urethral-torture',
      'Urethral torture',
      'Tortura uretral',
      'High-intensity edge play where pain, control or vulnerability of the urethra is the specific erotic focus, rather than general genital pain.',
      'Juego edge de alta intensidad donde el dolor, el control o la vulnerabilidad de la uretra son el foco erótico específico, en lugar del dolor genital general.',
      'Apply urethral torture to my partner', 'Aplicar tortura uretral a mi pareja',
      'Receive urethral torture', 'Recibir tortura uretral',
    ),
  ],
  fluids: [
    directed(
      'erotic-feeding',
      'Erotic feeding',
      'Alimentación erótica',
      'Feeding a partner or being fed when the act of offering and consuming food is itself part of the erotic interaction.',
      'Dar de comer a la pareja o recibir comida cuando el propio acto de ofrecer y consumir el alimento forma parte de la interacción erótica.',
      'Feed my partner erotically', 'Dar de comer eróticamente a mi pareja',
      'Be fed erotically by my partner', 'Que mi pareja me dé de comer de forma erótica',
    ),
    directed(
      'food-from-body',
      'Eating food from a partner’s body',
      'Comer alimentos del cuerpo de la pareja',
      'Eating or licking food from a partner’s body, or having a partner do so from yours, where the body-to-mouth aspect is the main appeal.',
      'Comer o lamer alimentos del cuerpo de la pareja, o que la pareja lo haga del tuyo, cuando el paso del cuerpo a la boca es el atractivo principal.',
      'Eat food from my partner’s body', 'Comer alimentos del cuerpo de mi pareja',
      'Have my partner eat food from my body', 'Que mi pareja coma alimentos de mi cuerpo',
    ),
    directedSelf(
      'food-vaginal-penetration',
      'Vaginal penetration with food',
      'Penetración vaginal con alimentos',
      'Using food as the penetrative element vaginally, rated separately from food on the body or eating food during erotic play.',
      'Usar un alimento como elemento de penetración vaginal, separado de poner comida sobre el cuerpo o consumirla durante el juego erótico.',
      'Use food vaginally on my partner', 'Usar un alimento vaginalmente con mi pareja',
      'Have my partner use food vaginally on me', 'Que mi pareja use un alimento vaginalmente conmigo',
      'Use food vaginally on myself', 'Usar un alimento vaginalmente conmigo',
      'female',
    ),
    directedSelf(
      'food-anal-penetration',
      'Anal penetration with food',
      'Penetración anal con alimentos',
      'Using food as the penetrative element anally, rated separately from food on the body or eating food during erotic play.',
      'Usar un alimento como elemento de penetración anal, separado de poner comida sobre el cuerpo o consumirla durante el juego erótico.',
      'Use food anally on my partner', 'Usar un alimento analmente con mi pareja',
      'Have my partner use food anally on me', 'Que mi pareja use un alimento analmente conmigo',
      'Use food anally on myself', 'Usar un alimento analmente conmigo',
    ),
  ],
  toys: [
    directedSelf(
      'everyday-object-play',
      'Everyday objects in erotic play',
      'Objetos cotidianos en el juego erótico',
      'Using ordinary objects not designed as sex toys because their shape, texture, symbolism or improvised character is part of the appeal. Penetration, impact and restraint are rated separately.',
      'Usar objetos cotidianos no diseñados como juguetes sexuales porque su forma, textura, simbolismo o carácter improvisado forman parte del atractivo. Penetración, impacto y restricción se valoran aparte.',
      'Use an everyday object with my partner', 'Usar un objeto cotidiano con mi pareja',
      'Have my partner use an everyday object with me', 'Que mi pareja use un objeto cotidiano conmigo',
      'Use an everyday object on myself', 'Usar un objeto cotidiano conmigo',
    ),
    directedSelf(
      'everyday-object-vaginal-penetration',
      'Vaginal penetration with everyday objects',
      'Penetración vaginal con objetos cotidianos',
      'Vaginal penetration where the penetrative element is an ordinary object rather than a purpose-made sex toy. This records the preference, not that every object is suitable for use.',
      'Penetración vaginal donde el elemento penetrativo es un objeto cotidiano y no un juguete sexual diseñado para ello. La entrada registra la preferencia, no que cualquier objeto sea adecuado.',
      'Use an everyday object vaginally on my partner', 'Usar un objeto cotidiano vaginalmente con mi pareja',
      'Have my partner use an everyday object vaginally on me', 'Que mi pareja use un objeto cotidiano vaginalmente conmigo',
      'Use an everyday object vaginally on myself', 'Usar un objeto cotidiano vaginalmente conmigo',
      'female',
    ),
    directedSelf(
      'everyday-object-anal-penetration',
      'Anal penetration with everyday objects',
      'Penetración anal con objetos cotidianos',
      'Anal penetration where the penetrative element is an ordinary object rather than a purpose-made sex toy. This records the preference, not that every object is suitable for use.',
      'Penetración anal donde el elemento penetrativo es un objeto cotidiano y no un juguete sexual diseñado para ello. La entrada registra la preferencia, no que cualquier objeto sea adecuado.',
      'Use an everyday object anally on my partner', 'Usar un objeto cotidiano analmente con mi pareja',
      'Have my partner use an everyday object anally on me', 'Que mi pareja use un objeto cotidiano analmente conmigo',
      'Use an everyday object anally on myself', 'Usar un objeto cotidiano analmente conmigo',
    ),
  ],
};

const CATEGORY_COPY: Readonly<Record<string, Partial<CatalogueCategorySeed>>> = {
  toys: {
    en: 'Sex toys',
    es: 'Juguetes sexuales',
    descriptionEn: 'Vibrators, dildos, anal toys, strap-ons and other purpose-made sexual toys.',
    descriptionEs: 'Vibradores, dildos, juguetes anales, strap-ons y otros juguetes diseñados para uso sexual.',
  },
  'sexual-accessories': {
    en: 'Accessories, objects & equipment',
    es: 'Accesorios, objetos y equipamiento',
    descriptionEn: 'Masturbators, pumps, sensation tools, machines, positioning equipment and improvised objects.',
    descriptionEs: 'Masturbadores, bombas, accesorios de sensación, máquinas, apoyos y objetos improvisados.',
  },
  fluids: {
    en: 'Fluids, food & substances',
    es: 'Fluidos, alimentos y sustancias',
    descriptionEn: 'Saliva, sexual fluids, food, oils and other substances used as part of erotic play.',
    descriptionEs: 'Saliva, fluidos sexuales, alimentos, aceites y otras sustancias dentro del juego erótico.',
  },
};

export function applyCatalogueReleaseAudit(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  const audited = content.map((category) => {
    const practices = category.practices.map((practice) => ({
      ...practice,
      ...(PRACTICE_OVERRIDES[practice.id] ?? {}),
    }));
    const existingIds = new Set(practices.map((practice) => practice.id));
    return {
      ...category,
      practices: [
        ...practices,
        ...(ADDITIONS[category.id] ?? []).filter((practice) => !existingIds.has(practice.id)),
      ],
    };
  });

  const toyCategory = audited.find((category) => category.id === 'toys');
  if (!toyCategory) return audited;

  return audited.flatMap((category): readonly CatalogueCategorySeed[] => {
    if (category.id === 'toys') {
      return [
        {
          ...category,
          practices: category.practices.filter((practice) => !ACCESSORY_PRACTICE_IDS.has(practice.id)),
        },
        {
          id: 'sexual-accessories',
          en: 'Accessories, objects & equipment',
          es: 'Accesorios, objetos y equipamiento',
          descriptionEn: 'Sexual accessories, larger equipment and improvised objects used as part of erotic play.',
          descriptionEs: 'Accesorios sexuales, equipamiento de mayor tamaño y objetos improvisados dentro del juego erótico.',
          order: category.order + 1,
          practices: category.practices.filter((practice) => ACCESSORY_PRACTICE_IDS.has(practice.id)),
        },
      ];
    }

    return [{ ...category, order: category.order > toyCategory.order ? category.order + 1 : category.order }];
  });
}

export function applyCatalogueReleaseAuditCategoryCopy(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  return content.map((category) => ({
    ...category,
    ...(CATEGORY_COPY[category.id] ?? {}),
  }));
}

function mutual(
  id: string,
  en: string,
  es: string,
  descriptionEn: string,
  descriptionEs: string,
  counterpartScoped = false,
): CataloguePracticeSeed {
  return { id, en, es, descriptionEn, descriptionEs, kind: 'mutual', ...(counterpartScoped ? { counterpartScoped: true } : {}) };
}

function directed(
  id: string,
  en: string,
  es: string,
  descriptionEn: string,
  descriptionEs: string,
  giveEn: string,
  giveEs: string,
  receiveEn: string,
  receiveEs: string,
  anatomySex?: 'male' | 'female',
): CataloguePracticeSeed {
  return {
    id,
    en,
    es,
    descriptionEn,
    descriptionEs,
    kind: 'directed',
    counterpartScoped: true,
    ...(anatomySex ? { anatomySex } : {}),
    roleLabels: {
      give: { en: giveEn, es: giveEs },
      receive: { en: receiveEn, es: receiveEs },
    },
  };
}

function directedSelf(
  id: string,
  en: string,
  es: string,
  descriptionEn: string,
  descriptionEs: string,
  giveEn: string,
  giveEs: string,
  receiveEn: string,
  receiveEs: string,
  selfEn: string,
  selfEs: string,
  anatomySex?: 'male' | 'female',
): CataloguePracticeSeed {
  return {
    id,
    en,
    es,
    descriptionEn,
    descriptionEs,
    kind: 'directed-self',
    counterpartScoped: true,
    ...(anatomySex ? { anatomySex } : {}),
    roleLabels: {
      give: { en: giveEn, es: giveEs },
      receive: { en: receiveEn, es: receiveEs },
      self: { en: selfEn, es: selfEs },
    },
  };
}

function group(
  id: string,
  en: string,
  es: string,
  descriptionEn: string,
  descriptionEs: string,
  centerEn: string,
  centerEs: string,
  participateEn: string,
  participateEs: string,
): CataloguePracticeSeed {
  return {
    id, en, es, descriptionEn, descriptionEs, kind: 'group',
    roleLabels: {
      center: { en: centerEn, es: centerEs },
      participate: { en: participateEn, es: participateEs },
    },
  };
}

function paired(
  id: string,
  en: string,
  es: string,
  descriptionEn: string,
  descriptionEs: string,
  leftId: string,
  leftEn: string,
  leftEs: string,
  leftPerspective: 'active' | 'receptive' | 'neutral',
  rightId: string,
  rightEn: string,
  rightEs: string,
  rightPerspective: 'active' | 'receptive' | 'neutral',
): CataloguePracticeSeed {
  return {
    id, en, es, descriptionEn, descriptionEs, kind: 'paired', counterpartScoped: false,
    pairedRoles: [
      { id: leftId, en: leftEn, es: leftEs, perspective: leftPerspective },
      { id: rightId, en: rightEn, es: rightEs, perspective: rightPerspective },
    ],
  };
}
