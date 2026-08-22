import { CatalogueCategorySeed, CataloguePracticeSeed } from './types';

export const FINAL_CLARITY_RETIRED_PRACTICE_IDS = new Set<string>([
  'realistic-dildo',
  'glass-dildo',
  'metal-dildo',
  'breasts',
  'curtains-open-private',
]);

const CATEGORY_MOVES: Readonly<Record<string, string>> = {
  'hand-over-mouth': 'restraint',
};

const PRACTICE_OVERRIDES: Readonly<Record<string, Partial<CataloguePracticeSeed>>> = {
  'romantic-sex': {
    descriptionEn: 'Sex where emotional closeness is central: affectionate touch, tenderness, kissing, caring attention and a sense of connection. It can be slow or energetic; what defines it is the romantic tone, not the pace.',
    descriptionEs: 'Sexo en el que la cercanía emocional es central: caricias afectuosas, ternura, besos, atención cariñosa y sensación de conexión. Puede ser lento o enérgico; lo que lo define es el tono romántico, no el ritmo.',
  },
  'passionate-sex': {
    descriptionEn: 'Sex driven by strong desire and urgency, with intense kissing, firmer contact and an energetic feeling of wanting each other. Passionate does not automatically mean rough, painful or dominant.',
    descriptionEs: 'Sexo impulsado por un deseo fuerte y urgente, con besos intensos, contacto más firme y una sensación enérgica de desearse mucho. Apasionado no significa necesariamente brusco, doloroso ni dominante.',
  },
  'playful-sex': {
    descriptionEn: 'Sex with a light, fun tone: laughter, teasing, joking, trying things spontaneously and not treating every moment seriously. The emphasis is on playfulness rather than intensity or romance.',
    descriptionEs: 'Sexo con un tono ligero y divertido: risas, provocaciones, bromas, probar cosas espontáneamente y no tomarse cada momento con solemnidad. Lo importante es el juego, no la intensidad ni el romanticismo.',
  },
  'competitive-sex': {
    descriptionEn: 'Sex with a playful challenge or contest element, such as trying to make the other person lose control first, outlast them, win a teasing challenge or deliberately one-up each other.',
    descriptionEs: 'Sexo con un componente de reto o competición juguetona, por ejemplo intentar que la otra persona pierda el control antes, aguantar más, ganar un reto de provocación o intentar superarse mutuamente.',
  },
  'slow-sex': {
    descriptionEn: 'Sex where movements and transitions are deliberately unhurried, leaving time to notice sensations and prolong contact. It describes pace, not mood: slow sex can be romantic, playful, dominant or otherwise intense.',
    descriptionEs: 'Sexo en el que los movimientos y cambios se hacen deliberadamente despacio, dejando tiempo para percibir sensaciones y prolongar el contacto. Describe el ritmo, no el ambiente: puede ser romántico, juguetón, dominante o intenso.',
  },
  quickies: {
    descriptionEn: 'A deliberately short sexual encounter with little setup and a focus on immediacy or spontaneity. It can be affectionate or intense; the defining feature is that the encounter is brief.',
    descriptionEs: 'Un encuentro sexual deliberadamente corto, con poca preparación y centrado en la inmediatez o la espontaneidad. Puede ser afectuoso o intenso; lo que lo define es que dura poco.',
  },
  'extended-foreplay': {
    descriptionEn: 'Spending a long time building arousal before moving to the main sexual activity, using kissing, touching, oral stimulation, teasing or similar contact. The build-up itself may be as important as what follows.',
    descriptionEs: 'Dedicar bastante tiempo a aumentar la excitación antes de pasar a la actividad sexual principal, mediante besos, caricias, sexo oral, provocación u otros contactos. Los preliminares pueden ser tan importantes como lo que venga después.',
  },
  'morning-sex': {
    descriptionEn: 'Sex shortly after waking or during the morning, where the time of day and waking-up atmosphere are part of the appeal rather than a particular sexual technique.',
    descriptionEs: 'Sexo poco después de despertarse o durante la mañana, donde la hora y el ambiente de recién levantarse forman parte del atractivo, independientemente de la práctica concreta.',
  },
  'sleepy-sex': {
    descriptionEn: 'Sex while both people are awake but noticeably sleepy, drowsy or half-awake, with the relaxed and low-energy state being part of the appeal. This is distinct from sleep roleplay.',
    descriptionEs: 'Sexo mientras ambas personas están despiertas pero claramente somnolientas, adormiladas o medio despiertas, siendo ese estado relajado y de poca energía parte del atractivo. Es distinto del roleplay de sueño.',
  },
  'eye-contact': {
    descriptionEn: 'Maintaining deliberate eye contact during intimate or sexual activity because looking at each other adds connection, intensity, vulnerability or excitement.',
    descriptionEs: 'Mantener contacto visual deliberado durante la intimidad o el sexo porque mirarse añade conexión, intensidad, vulnerabilidad o excitación.',
  },

  lingerie: { descriptionEn: 'Erotic or decorative underwear chosen because its appearance is sexually appealing, such as bras, panties, briefs, sets or similar garments.', descriptionEs: 'Ropa interior erótica o decorativa elegida por su atractivo sexual, como sujetadores, bragas, calzoncillos, conjuntos o prendas similares.' },
  stockings: { descriptionEn: 'Sheer or close-fitting stockings worn on the legs, usually associated with lingerie or formal styling and sometimes held by a garter belt.', descriptionEs: 'Medias finas o ajustadas que cubren las piernas, normalmente asociadas a lencería o estilismo formal y a veces sujetas con portaligas.' },
  'thigh-highs': { descriptionEn: 'Socks or stockings that reach the upper thigh and stay up without necessarily using a garter belt; the appeal is the high-leg cut and visible upper edge.', descriptionEs: 'Calcetines o medias que llegan hasta la parte alta del muslo y se mantienen sin necesitar necesariamente portaligas; el atractivo está en la altura y el borde visible.' },
  'garter-belts': { descriptionEn: 'A lingerie belt worn around the waist or hips with straps that hold stockings in place; the belt-and-straps look is the specific focus.', descriptionEs: 'Prenda de lencería que rodea la cintura o cadera y lleva tiras para sujetar las medias; aquí se valora específicamente el aspecto del portaligas y sus tiras.' },
  corsets: { descriptionEn: 'Structured garments that shape or emphasize the torso and waist, ranging from fashion corsets to more overtly erotic styles.', descriptionEs: 'Prendas estructuradas que moldean o resaltan el torso y la cintura, desde corsés de moda hasta estilos claramente eróticos.' },
  bodysuits: { descriptionEn: 'One-piece close-fitting garments covering the torso, often combining underwear, lingerie and outerwear aesthetics.', descriptionEs: 'Prendas ajustadas de una sola pieza que cubren el torso y pueden mezclar estética de ropa interior, lencería y ropa exterior.' },
  'high-heels': { descriptionEn: 'High-heeled shoes worn because their shape, posture and visual effect are sexually attractive.', descriptionEs: 'Zapatos de tacón alto cuyo atractivo está en su forma, la postura que producen y su efecto visual.' },
  boots: { descriptionEn: 'Boots as an erotic visual preference, from ankle boots to knee- or thigh-high styles; this refers to the footwear itself rather than a specific roleplay.', descriptionEs: 'Botas como preferencia visual erótica, desde botines hasta modelos por la rodilla o el muslo; se refiere al calzado en sí, no a un roleplay concreto.' },
  'leather-clothing': { descriptionEn: 'Clothing made primarily from leather or leather-like material, valued for its look, feel, smell, structure or association with erotic subcultures.', descriptionEs: 'Ropa principalmente de cuero o material similar, valorada por su aspecto, tacto, olor, rigidez o asociación con estéticas eróticas.' },
  'latex-clothing': { descriptionEn: 'Tight latex garments valued for their glossy appearance, second-skin fit and distinctive texture.', descriptionEs: 'Prendas ajustadas de látex valoradas por su brillo, efecto de segunda piel y textura característica.' },
  'pvc-clothing': { descriptionEn: 'Shiny plastic or vinyl-like clothing, usually stiffer and less skin-tight than latex, with a glossy fetish-fashion appearance.', descriptionEs: 'Ropa brillante de plástico o vinilo, normalmente más rígida y menos ceñida que el látex, con una estética fetichista muy lustrosa.' },
  'lace-clothing': { descriptionEn: 'Garments where lace, transparency and patterned fabric are a central part of the erotic appearance.', descriptionEs: 'Prendas en las que el encaje, las transparencias y el tejido con dibujos son una parte central del atractivo erótico.' },
  'silk-satin': { descriptionEn: 'Silk or satin garments valued for their smooth texture, drape, sheen and sensation against the skin.', descriptionEs: 'Prendas de seda o satén valoradas por su tacto suave, caída, brillo y sensación sobre la piel.' },
  'harnesses-fashion': { descriptionEn: 'Decorative body harnesses worn primarily as fashion or erotic styling; this does not imply using the harness to restrain or suspend someone.', descriptionEs: 'Arneses corporales decorativos usados principalmente como moda o estilismo erótico; no implica utilizarlos para inmovilizar ni suspender a nadie.' },
  chokers: { descriptionEn: 'Close-fitting necklaces worn tightly around the neck as a fashion or erotic accessory, without implying a D/s collaring dynamic.', descriptionEs: 'Gargantillas ajustadas alrededor del cuello como accesorio estético o erótico, sin implicar una dinámica D/s de collaring.' },
  'collars-fashion': { descriptionEn: 'Decorative collars worn for their appearance, including leather or fetish-inspired styles, without implying ownership, submission or formal collaring.', descriptionEs: 'Collares decorativos usados por su estética, incluidos estilos de cuero o inspiración fetichista, sin implicar propiedad, sumisión ni collaring formal.' },
  masks: { descriptionEn: 'Masks worn during sexual activity for visual style, anonymity, transformation or roleplay atmosphere; the specific mask can range from elegant to fetish-themed.', descriptionEs: 'Máscaras usadas durante la actividad sexual por estética, anonimato, transformación o ambiente de roleplay; pueden ir desde diseños elegantes hasta estilos fetichistas.' },
  gloves: { descriptionEn: 'Gloves worn because their material, appearance or the sensation of being touched through them is sexually appealing.', descriptionEs: 'Guantes usados porque su material, aspecto o la sensación de ser tocado a través de ellos resulta sexualmente atractiva.' },
  suits: { descriptionEn: 'Formal clothing such as a tailored suit, shirt, tie or similar smart attire. The attraction is to the polished formal look, not to a profession or authority role.', descriptionEs: 'Ropa formal como traje de chaqueta, camisa, corbata o vestimenta elegante similar. El atractivo está en el aspecto formal y cuidado, no en una profesión o rol de autoridad.' },
  uniforms: { descriptionEn: 'Clothing that visibly represents a profession, institution or defined role, such as medical, military, police, service or school-style adult costumes. The recognizable role is what distinguishes it from a formal suit.', descriptionEs: 'Ropa que representa visiblemente una profesión, institución o rol definido, como estilos médicos, militares, policiales, de servicio o disfraces escolares de adultos. El rol reconocible es lo que la diferencia de un traje formal.' },
  sportswear: { descriptionEn: 'Athletic clothing such as shorts, leggings, jerseys, tracksuits or gym wear when that sporting appearance is sexually attractive.', descriptionEs: 'Ropa deportiva como pantalones cortos, leggings, camisetas, chándales o ropa de gimnasio cuando esa apariencia deportiva resulta sexualmente atractiva.' },
  cosplay: { descriptionEn: 'Dressing as a specific fictional character or recognizable fictional archetype, with the character look itself forming part of the attraction.', descriptionEs: 'Vestirse como un personaje ficticio concreto o un arquetipo reconocible, siendo la apariencia del personaje parte del atractivo.' },
  'cross-dressing': { descriptionEn: 'Wearing clothing culturally associated with another gender because the presentation, transformation or contrast is sexually or aesthetically appealing.', descriptionEs: 'Vestirse con ropa culturalmente asociada a otro género porque la presentación, transformación o contraste resulta sexual o estéticamente atractivo.' },
  'body-paint': { descriptionEn: 'Painting or decorating bare skin with colour, patterns or designs so the painted body itself becomes part of the visual or tactile sexual experience.', descriptionEs: 'Pintar o decorar la piel desnuda con colores, dibujos o diseños para que el propio cuerpo pintado forme parte de la experiencia visual o táctil.' },

  'solo-masturbation': { descriptionEn: 'Stimulating yourself sexually while alone. This asks whether solo masturbation itself is appealing, not whether you want a partner to watch or participate.', descriptionEs: 'Estimularte sexualmente estando a solas. La pregunta valora si te gusta la masturbación en solitario, no si quieres que una pareja mire o participe.' },
  'hands-free-masturbation': { descriptionEn: 'Stimulating yourself without directly using your hands, for example through body movement, pressure, a surface or a hands-free toy setup.', descriptionEs: 'Estimularte sin utilizar directamente las manos, por ejemplo mediante movimiento corporal, presión, una superficie o un juguete colocado para usarse sin sujetarlo.' },
  'masturbating-together': { descriptionEn: 'Both partners masturbate themselves at the same time while sharing the encounter. Each person mainly touches their own body, even though they may watch, talk or interact.', descriptionEs: 'Ambas personas se masturban a sí mismas al mismo tiempo compartiendo el encuentro. Cada una toca principalmente su propio cuerpo, aunque puedan mirarse, hablar o interactuar.' },
  'watch-partner-masturbate': { descriptionEn: 'One person masturbates while the other watches. The catalogue rates separately whether you enjoy watching and whether you enjoy masturbating while your partner watches you.', descriptionEs: 'Una persona se masturba mientras la otra mira. Se valora por separado si te gusta mirar y si te gusta masturbarte mientras tu pareja te observa.' },
  'mutual-handjobs': { descriptionEn: 'Both partners stimulate each other manually during the same encounter, rather than each person masturbating only themselves.', descriptionEs: 'Ambas personas se estimulan manualmente entre sí durante el mismo encuentro, en vez de que cada una se masturbe únicamente a sí misma.' },
  'guided-touch': { descriptionEn: 'Physically guiding a partner’s hand to show where, how or with what pressure you want to be touched, or having them guide yours.', descriptionEs: 'Guiar físicamente la mano de la pareja para indicar dónde, cómo o con qué presión quieres que te toque, o dejar que la pareja guíe la tuya.' },
  'touching-over-clothes': { descriptionEn: 'Sexual touching through clothing, where fabric remains between the hand or body and the genitals or other sensitive areas.', descriptionEs: 'Tocamientos sexuales por encima de la ropa, manteniendo tejido entre la mano o el cuerpo y los genitales u otras zonas sensibles.' },
  'touching-under-clothes': { descriptionEn: 'Sexual touching underneath clothing while some or most clothes remain on, creating a more concealed or gradual form of direct skin contact.', descriptionEs: 'Tocamientos sexuales por debajo de la ropa mientras parte o la mayor parte de las prendas siguen puestas, creando un contacto directo más oculto o gradual.' },
  handjob: { descriptionEn: 'Stimulating a penis primarily with the hand, including stroking, pressure and rhythm controlled by the person doing the touching.', descriptionEs: 'Estimular un pene principalmente con la mano, mediante movimientos, presión y ritmo controlados por quien realiza la estimulación.' },
  'vulva-hand-stimulation': { descriptionEn: 'Stimulating the vulva externally with the hand or fingers, including the labia and surrounding areas; clitoral stimulation is asked separately because it can be a distinct preference.', descriptionEs: 'Estimular externamente la vulva con la mano o los dedos, incluidos labios y zonas cercanas; la estimulación del clítoris se pregunta aparte porque puede ser una preferencia distinta.' },
  'clitoral-stimulation': { descriptionEn: 'Direct or indirect stimulation focused specifically on the clitoris, using fingers or the hand rather than a toy.', descriptionEs: 'Estimulación directa o indirecta centrada específicamente en el clítoris, utilizando los dedos o la mano en lugar de un juguete.' },
  'fingering-vaginal': { descriptionEn: 'Inserting one or more fingers into the vagina for internal stimulation, independently of external vulva or clitoral touching.', descriptionEs: 'Introducir uno o más dedos en la vagina para proporcionar estimulación interna, independientemente de las caricias externas en vulva o clítoris.' },
  'fingering-anal': { descriptionEn: 'Using one or more fingers for anal insertion and internal stimulation, independently of external touching around the anus.', descriptionEs: 'Utilizar uno o más dedos para inserción y estimulación anal interna, independientemente de las caricias externas alrededor del ano.' },
  'breast-stimulation-by-hand': { descriptionEn: 'Touching, squeezing, massaging or caressing the chest or breasts with the hands, with nipple-focused stimulation rated separately.', descriptionEs: 'Tocar, apretar, masajear o acariciar el pecho con las manos, dejando la estimulación centrada específicamente en los pezones como una pregunta aparte.' },
  'nipple-stimulation-by-hand': { descriptionEn: 'Manual stimulation focused specifically on the nipples, such as rubbing, rolling, squeezing or gentle pulling with the fingers.', descriptionEs: 'Estimulación manual centrada específicamente en los pezones, por ejemplo frotarlos, hacerlos rodar, apretarlos o tirar suavemente con los dedos.' },
  'perineum-massage': { descriptionEn: 'Manual pressure, rubbing or massage on the perineum, the area between the genitals and anus, as a distinct source of sexual sensation.', descriptionEs: 'Aplicar presión, frotar o masajear el perineo, la zona entre los genitales y el ano, como fuente específica de sensación sexual.' },
  'prostate-massage-manual': { descriptionEn: 'Stimulating the prostate manually through the anus with a finger, using pressure or massage rather than a dedicated toy.', descriptionEs: 'Estimular manualmente la próstata a través del ano con un dedo, utilizando presión o masaje en lugar de un juguete específico.' },
  'hand-over-mouth': { descriptionEn: 'Covering a partner’s mouth with the hand, or having your mouth covered by a partner’s hand, as a control or restraint gesture. It means covering the mouth; it does not imply blocking the nose or deliberately restricting breathing.', descriptionEs: 'Tapar la boca de la pareja con la mano, o que la pareja te tape la boca con la suya, como gesto de control o restricción. Se refiere a cubrir la boca; no implica tapar la nariz ni restringir deliberadamente la respiración.' },

  'vaginal-penetration': { descriptionEn: 'Penetration of the vagina with a penis or penetrative toy. This asks about vaginal penetration itself; depth, pace, intensity and position are rated separately.', descriptionEs: 'Penetración de la vagina con un pene o juguete penetrativo. Aquí se valora la penetración vaginal en sí; profundidad, ritmo, intensidad y postura se preguntan por separado.' },
  'anal-penetration': { descriptionEn: 'Penetration of the anus with a penis or penetrative toy. This asks about anal penetration itself; depth, pace, intensity and position are rated separately.', descriptionEs: 'Penetración del ano con un pene o juguete penetrativo. Aquí se valora la penetración anal en sí; profundidad, ritmo, intensidad y postura se preguntan por separado.' },
  'shallow-penetration': { descriptionEn: 'Penetration kept deliberately near the entrance or at limited depth, with shorter movements and less internal reach. It can be vaginal or anal and can still be fast or intense.', descriptionEs: 'Penetración mantenida deliberadamente cerca de la entrada o a poca profundidad, con movimientos cortos y menor alcance interno. Puede ser vaginal o anal y aun así ser rápida o intensa.' },
  'deep-penetration': { descriptionEn: 'Penetration that deliberately reaches farther inside and uses a greater comfortable depth. Deep describes how far penetration goes, not how fast or forceful it is.', descriptionEs: 'Penetración que busca deliberadamente llegar más al interior y utilizar una profundidad mayor dentro de lo cómodo. Profunda describe hasta dónde llega, no la velocidad ni la fuerza.' },
  'slow-penetration': { descriptionEn: 'Penetration with deliberately slow insertion, withdrawal and thrusting movements. It describes movement speed, independently of depth, force or the overall romantic or dominant tone.', descriptionEs: 'Penetración con movimientos de entrada, salida y empuje deliberadamente lentos. Describe la velocidad del movimiento, independientemente de la profundidad, la fuerza o el tono romántico o dominante del encuentro.' },
  'rough-penetration': { descriptionEn: 'Penetration with firmer, more forceful or physically intense thrusting and handling. Intense does not necessarily mean deeper or faster; the defining feature is stronger physical force and impact.', descriptionEs: 'Penetración con empujes y manejo más firmes, enérgicos o físicamente intensos. Intensa no significa necesariamente más profunda o más rápida; lo que la define es una mayor fuerza física e impacto.' },
  'double-vaginal-penetration': { descriptionEn: 'Two penises, toys or other penetrative objects entering the vagina at the same time. This is distinct from simultaneous vaginal-and-anal penetration.', descriptionEs: 'Dos penes, juguetes u otros elementos penetrativos introducidos en la vagina al mismo tiempo. Es distinto de la penetración simultánea de vagina y ano.' },
  'double-anal-penetration': { descriptionEn: 'Two penises, toys or other penetrative objects entering the anus at the same time. This is distinct from simultaneous vaginal-and-anal penetration.', descriptionEs: 'Dos penes, juguetes u otros elementos penetrativos introducidos en el ano al mismo tiempo. Es distinto de la penetración simultánea de vagina y ano.' },
  'fisting-vaginal': { descriptionEn: 'Gradual vaginal insertion of several fingers and potentially most or all of the hand, treated as a distinct practice from ordinary fingering.', descriptionEs: 'Inserción vaginal gradual de varios dedos y potencialmente de gran parte o toda la mano, tratada como una práctica distinta de la estimulación vaginal con dedos habitual.' },
  'fisting-anal': { descriptionEn: 'Gradual anal insertion of several fingers and potentially most or all of the hand, treated as a distinct practice from ordinary anal fingering.', descriptionEs: 'Inserción anal gradual de varios dedos y potencialmente de gran parte o toda la mano, tratada como una práctica distinta de la estimulación anal con dedos habitual.' },
  'prostate-penetration': { descriptionEn: 'Anal penetration deliberately angled or shaped to apply pressure to the prostate, with prostate stimulation being the main goal rather than penetration in general.', descriptionEs: 'Penetración anal orientada deliberadamente para aplicar presión sobre la próstata, siendo la estimulación prostática el objetivo principal y no la penetración en general.' },
  'cervix-contact': { descriptionEn: 'Deep vaginal penetration where contact with or pressure against the cervix is specifically part of the desired sensation.', descriptionEs: 'Penetración vaginal profunda en la que el contacto o la presión contra el cuello uterino forma específicamente parte de la sensación buscada.' },

  edging: { descriptionEn: 'Repeatedly bringing someone close to orgasm and then reducing or stopping stimulation before climax, often several times. An orgasm may eventually be allowed; the repeated approach-and-back-off cycle is what defines edging.', descriptionEs: 'Llevar repetidamente a alguien cerca del orgasmo y después reducir o detener la estimulación antes de llegar, a menudo varias veces. Puede permitirse finalmente el orgasmo; lo que define el edging es el ciclo de acercarse y retirarse.' },
  'orgasm-denial': { descriptionEn: 'Deliberately preventing orgasm for a chosen period or entire session even though the person may remain aroused or be stimulated. Unlike edging, the goal can be to finish without allowing orgasm at all.', descriptionEs: 'Impedir deliberadamente el orgasmo durante un periodo o durante toda la sesión aunque la persona siga excitada o reciba estimulación. A diferencia del edging, el objetivo puede ser terminar sin permitir ningún orgasmo.' },
  'orgasm-control': { descriptionEn: 'A broader dynamic where one partner controls whether, when or under what conditions the other may orgasm. It can include permission, timing, edging or denial, but none of those techniques is required by itself.', descriptionEs: 'Dinámica más amplia en la que una persona controla si, cuándo o bajo qué condiciones puede correrse la otra. Puede incluir permiso, timing, edging o negación, pero ninguna de esas técnicas es obligatoria por sí sola.' },
  'no-orgasm-sex': { descriptionEn: 'Having a sexual encounter that is intentionally satisfying without aiming for orgasm. Unlike orgasm denial, there does not have to be a controlling person or an active attempt to keep someone from climaxing.', descriptionEs: 'Tener un encuentro sexual planteado para ser satisfactorio sin buscar el orgasmo. A diferencia de la negación del orgasmo, no tiene por qué haber una persona controlando ni un esfuerzo activo por impedir que alguien se corra.' },
  'ruined-orgasm': { descriptionEn: 'Allowing orgasm to begin but deliberately reducing, interrupting or changing stimulation so the climax feels weaker, incomplete or deliberately unsatisfying.', descriptionEs: 'Dejar que el orgasmo empiece pero reducir, interrumpir o cambiar deliberadamente la estimulación para que el clímax resulte más débil, incompleto o intencionadamente insatisfactorio.' },
  'forced-orgasm': { descriptionEn: 'Continuing or intensifying stimulation until the other person orgasms even while they playfully resist or are not trying to climax, within the agreed sexual dynamic.', descriptionEs: 'Continuar o intensificar la estimulación hasta que la otra persona alcanza el orgasmo aunque se resista de forma lúdica o no esté intentando correrse, dentro de la dinámica sexual acordada.' },
  'multiple-orgasms': { descriptionEn: 'Having or giving more than one orgasm during the same sexual encounter, with recovery and renewed stimulation between orgasms if needed.', descriptionEs: 'Tener o provocar más de un orgasmo durante el mismo encuentro sexual, con recuperación y nueva estimulación entre orgasmos si hace falta.' },
  'simultaneous-orgasm': { descriptionEn: 'Trying to reach orgasm at approximately the same time as a partner because sharing the climax is part of the appeal.', descriptionEs: 'Intentar llegar al orgasmo aproximadamente al mismo tiempo que la pareja porque compartir el clímax forma parte del atractivo.' },
  'hands-free-orgasm': { descriptionEn: 'Reaching orgasm without direct hand stimulation, for example through penetration, toys, muscle contractions, pressure, movement or other stimulation.', descriptionEs: 'Alcanzar el orgasmo sin estimulación directa con las manos, por ejemplo mediante penetración, juguetes, contracciones musculares, presión, movimiento u otros estímulos.' },
  'post-orgasm-stimulation': { descriptionEn: 'Continuing sexual stimulation after orgasm instead of stopping immediately, whether for lingering pleasure, sensitivity play or building toward another orgasm.', descriptionEs: 'Continuar la estimulación sexual después del orgasmo en vez de parar inmediatamente, ya sea para prolongar el placer, jugar con la sensibilidad o buscar otro orgasmo.' },
  overstimulation: { descriptionEn: 'Continuing stimulation past the point where sensitivity becomes very intense, overwhelming or difficult to tolerate, making that excess sensation itself part of the appeal.', descriptionEs: 'Continuar la estimulación más allá del punto en que la sensibilidad se vuelve muy intensa, abrumadora o difícil de tolerar, haciendo que ese exceso de sensación sea parte del atractivo.' },

  'couple-plus-guest': { en: 'Couple inviting a third person', es: 'Pareja que invita a una tercera persona', descriptionEn: 'An established couple brings one additional person into a sexual encounter. The emphasis is on the couple-plus-guest dynamic, which can feel different from a threesome where no established couple is central.', descriptionEs: 'Una pareja ya estable incorpora a una tercera persona a un encuentro sexual. Se valora específicamente la dinámica pareja + invitado/a, que puede sentirse distinta de un trío donde no hay una pareja estable como núcleo.' },
  swinging: { descriptionEn: 'Couples having sexual experiences with other couples or partners in a social or organized swapping context; soft and full swap are rated separately for how far the exchange goes.', descriptionEs: 'Parejas que tienen experiencias sexuales con otras parejas o personas dentro de un contexto social o organizado de intercambio; soft swap y full swap se preguntan aparte para distinguir hasta dónde llega el intercambio.' },
  'soft-swap': { descriptionEn: 'A couple swaps sexual contact with another couple or guest but excludes penetrative sex with the exchanged partner. Kissing, touching or oral activity may still be included depending on the people involved.', descriptionEs: 'Una pareja intercambia contacto sexual con otra pareja o invitado/a pero excluye la penetración con la persona intercambiada. Puede incluir besos, caricias o sexo oral según las personas implicadas.' },
  'full-swap': { descriptionEn: 'A couple swaps sexual partners and penetrative sex with the other couple or guest can be part of the encounter.', descriptionEs: 'Una pareja intercambia parejas sexuales y el sexo con penetración con la otra pareja o invitado/a puede formar parte del encuentro.' },
  'same-room-sex': { descriptionEn: 'Two or more couples have sex in the same room while staying with their own partners, with the shared visual and social environment being part of the appeal.', descriptionEs: 'Dos o más parejas mantienen relaciones en la misma habitación permaneciendo cada una con su propia pareja, siendo el ambiente visual y social compartido parte del atractivo.' },
  'hotwife-dynamic': { descriptionEn: 'A relationship dynamic where a woman has sexual experiences with other people and her partner is positively involved in, encourages or enjoys that fact; humiliation is not required.', descriptionEs: 'Dinámica de pareja en la que una mujer tiene experiencias sexuales con otras personas y su pareja participa positivamente, lo fomenta o disfruta sabiendo que ocurre; no requiere humillación.' },
  'cuckold-dynamic': { descriptionEn: 'A dynamic where a man’s partner has sex with someone else and his role in knowing, watching or being excluded is part of the erotic scenario; humiliation may be present but is not automatically required.', descriptionEs: 'Dinámica en la que la pareja de un hombre mantiene sexo con otra persona y el hecho de saberlo, mirarlo o quedar excluido forma parte del escenario erótico; puede incluir humillación, pero no es obligatoria.' },
  'cuckquean-dynamic': { descriptionEn: 'The gender-reversed counterpart of a cuckold dynamic: a woman’s partner has sex with someone else and her role in knowing, watching or being excluded is part of the erotic scenario.', descriptionEs: 'Contraparte con los géneros invertidos de la dinámica cuckold: la pareja de una mujer mantiene sexo con otra persona y el hecho de saberlo, mirarlo o quedar excluida forma parte del escenario erótico.' },
  'anonymous-group-scene': { descriptionEn: 'A group-sex scenario where anonymity, limited personal familiarity or not knowing all participants well is deliberately part of the fantasy or atmosphere.', descriptionEs: 'Escenario de sexo grupal en el que el anonimato, la poca familiaridad personal o no conocer bien a todos los participantes forma deliberadamente parte de la fantasía o el ambiente.' },

  chest: { en: 'Chest / breasts', es: 'Pecho', descriptionEn: 'Attraction to a partner’s chest as a body area, including breasts when present. Size preferences are asked separately, so this entry means liking the chest itself regardless of size.', descriptionEs: 'Atracción por el pecho de la pareja como zona corporal, incluidos los senos cuando los haya. El tamaño se pregunta aparte, así que aquí se valora el pecho en sí independientemente de su tamaño.' },
  piercings: { en: 'Piercings in general', es: 'Piercings en general', descriptionEn: 'General attraction to piercings as an aesthetic or erotic feature regardless of where they are located. Face, body, nipple and genital piercings are also available as more specific preferences.', descriptionEs: 'Atracción general por los piercings como rasgo estético o erótico independientemente de dónde estén. También se pueden valorar por separado piercings de cara, cuerpo, pezones y genitales.' },

  dildo: { en: 'Dildo / realistic dildo', es: 'Dildo / dildo realista', targetSites: ['mouth', 'vaginal', 'anal'], descriptionEn: 'A standard penetrative dildo, including simple phallic shapes and more realistic penis-like designs. Material-specialized and fantasy-shaped dildos are rated separately.', descriptionEs: 'Dildo penetrativo estándar, incluyendo formas fálicas sencillas y diseños más realistas similares a un pene. Los dildos de materiales especiales y los de formas de fantasía se valoran aparte.' },
  'double-ended-dildo': { descriptionEn: 'A dildo with usable penetrative ends on both sides, allowing two people or two body sites to use the same toy at once. Its shared-use function is what distinguishes it from an ordinary dildo.', descriptionEs: 'Dildo con extremos penetrativos utilizables por ambos lados, permitiendo que dos personas o dos zonas corporales utilicen el mismo juguete a la vez. Su función compartida es lo que lo diferencia de un dildo normal.' },

  'semi-public-consensual-scene': { en: 'Sex in a controlled public / semi-public setting', es: 'Sexo en lugar público o semipúblico controlado', descriptionEn: 'Sex in a place that feels public or semi-public, such as a secluded outdoor area or controlled venue, where the possibility of exposure is part of the excitement without deliberately involving uninvolved bystanders.', descriptionEs: 'Sexo en un lugar que se siente público o semipúblico, como una zona exterior apartada o un espacio controlado, donde la posibilidad de exposición forma parte de la excitación sin implicar deliberadamente a terceros ajenos.' },
};

const ADDITIONAL_PRACTICES: Readonly<Record<string, readonly CataloguePracticeSeed[]>> = {
  penetration: [
    {
      id: 'simultaneous-vaginal-anal-penetration',
      en: 'Simultaneous vaginal + anal penetration',
      es: 'Penetración simultánea vagina + ano',
      kind: 'directed',
      counterpartScoped: true,
      anatomySex: 'female',
      descriptionEn: 'Simultaneous penetration of the vagina and anus, using two partners, a partner plus a toy, or multiple toys. The defining feature is that both openings are penetrated at the same time.',
      descriptionEs: 'Penetración simultánea de vagina y ano, mediante dos personas, una persona y un juguete o varios juguetes. Lo que la define es que ambas aberturas se penetran al mismo tiempo.',
      roleLabels: {
        give: { en: 'Take part as a penetrating partner', es: 'Participar penetrando' },
        receive: { en: 'Receive vaginal + anal penetration', es: 'Recibir penetración vagina + ano' },
      },
    },
    {
      id: 'simultaneous-vaginal-oral-penetration',
      en: 'Simultaneous vaginal + oral penetration',
      es: 'Penetración simultánea vagina + boca',
      kind: 'directed',
      counterpartScoped: true,
      anatomySex: 'female',
      descriptionEn: 'Simultaneous penetrative stimulation of the vagina and mouth, with both being used at the same time by partners, toys or a combination of both.',
      descriptionEs: 'Estimulación penetrativa simultánea de vagina y boca, utilizando ambas al mismo tiempo mediante personas, juguetes o una combinación de ambos.',
      roleLabels: {
        give: { en: 'Take part as a penetrating partner', es: 'Participar penetrando' },
        receive: { en: 'Receive vaginal + oral penetration', es: 'Recibir penetración vagina + boca' },
      },
    },
    {
      id: 'simultaneous-anal-oral-penetration',
      en: 'Simultaneous anal + oral penetration',
      es: 'Penetración simultánea ano + boca',
      kind: 'directed',
      counterpartScoped: true,
      descriptionEn: 'Simultaneous penetrative stimulation of the anus and mouth, with both being used at the same time by partners, toys or a combination of both.',
      descriptionEs: 'Estimulación penetrativa simultánea de ano y boca, utilizando ambas al mismo tiempo mediante personas, juguetes o una combinación de ambos.',
      roleLabels: {
        give: { en: 'Take part as a penetrating partner', es: 'Participar penetrando' },
        receive: { en: 'Receive anal + oral penetration', es: 'Recibir penetración ano + boca' },
      },
    },
    {
      id: 'simultaneous-vaginal-anal-oral-penetration',
      en: 'Simultaneous vaginal + anal + oral penetration',
      es: 'Penetración simultánea vagina + ano + boca',
      kind: 'directed',
      counterpartScoped: true,
      anatomySex: 'female',
      descriptionEn: 'Simultaneous penetrative stimulation of the vagina, anus and mouth, using multiple partners, toys or a combination. All three openings are used at the same time.',
      descriptionEs: 'Estimulación penetrativa simultánea de vagina, ano y boca mediante varias personas, juguetes o una combinación. Las tres aberturas se utilizan al mismo tiempo.',
      roleLabels: {
        give: { en: 'Take part as a penetrating partner', es: 'Participar penetrando' },
        receive: { en: 'Receive vaginal + anal + oral penetration', es: 'Recibir penetración vagina + ano + boca' },
      },
    },
  ],
  toys: [
    {
      id: 'special-material-dildo',
      en: 'Special-material dildo',
      es: 'Dildo de materiales especiales',
      kind: 'toy',
      targetSites: ['mouth', 'vaginal', 'anal'],
      descriptionEn: 'A rigid or distinctive dildo chosen primarily for its material, such as glass or metal, where weight, firmness, smoothness or temperature response are part of the appeal.',
      descriptionEs: 'Dildo rígido o especial elegido principalmente por su material, como vidrio o metal, donde el peso, la firmeza, la superficie o la respuesta a la temperatura forman parte del atractivo.',
    },
    {
      id: 'fantasy-shaped-dildo',
      en: 'Fantasy / non-human-shaped dildo',
      es: 'Dildo de fantasía / formas no humanas',
      kind: 'toy',
      targetSites: ['mouth', 'vaginal', 'anal'],
      descriptionEn: 'A penetrative toy with deliberately fictional, creature-inspired, tentacle-like, sculptural or otherwise non-realistic anatomy. This refers to fantasy toy shapes, not sexual activity with real animals.',
      descriptionEs: 'Juguete penetrativo con formas deliberadamente ficticias, inspiradas en criaturas, tentáculos, diseños escultóricos o anatomías no realistas. Se refiere a formas de juguetes de fantasía, no a actividad sexual con animales reales.',
    },
  ],
  'body-fetishes': [
    { id: 'facial-piercings', en: 'Facial piercings', es: 'Piercings en la cara', kind: 'focus', descriptionEn: 'Attraction specifically to piercings on the face, such as nose, lip, eyebrow or similar visible facial placements.', descriptionEs: 'Atracción específicamente por piercings en la cara, como nariz, labio, ceja u otras ubicaciones faciales visibles.' },
    { id: 'body-piercings', en: 'Body piercings', es: 'Piercings en el cuerpo', kind: 'focus', descriptionEn: 'Attraction to piercings on the torso or other non-facial body areas, such as the navel, while nipple and genital piercings are rated separately.', descriptionEs: 'Atracción por piercings en el torso u otras zonas corporales no faciales, como el ombligo, dejando pezones y genitales como preferencias separadas.' },
    { id: 'nipple-piercings', en: 'Nipple piercings', es: 'Piercings en los pezones', kind: 'focus', descriptionEn: 'Attraction specifically to pierced nipples, independently of liking piercings elsewhere on the body.', descriptionEs: 'Atracción específicamente por pezones con piercing, independientemente de que gusten los piercings en otras partes del cuerpo.' },
    { id: 'genital-piercings', en: 'Genital piercings', es: 'Piercings genitales', kind: 'focus', descriptionEn: 'Attraction specifically to genital piercings, regardless of whether general or other body piercings are appealing.', descriptionEs: 'Atracción específicamente por piercings genitales, independientemente de que gusten los piercings generales o en otras zonas.' },
  ],
  roleplay: [
    {
      id: 'caregiver-little-adult-roleplay',
      en: 'Caregiver / Little dynamic (adults)',
      es: 'Dinámica Caregiver / Little (adultos)',
      kind: 'paired',
      counterpartScoped: true,
      descriptionEn: 'An adult-only roleplay or relationship dynamic where one adult takes a caring, guiding or authority-flavoured Caregiver/Daddy/Mommy role and the other adult takes a Little role. Labels such as DDLG, MDLB, MDLG or DDLB describe gender combinations; “Little” here always means an adult role.',
      descriptionEs: 'Roleplay o dinámica de relación exclusivamente entre adultos en la que una persona adopta un rol de Caregiver/Daddy/Mommy, con cuidado, guía o autoridad, y la otra un rol Little. Siglas como DDLG, MDLB, MDLG o DDLB describen combinaciones de género; «Little» significa siempre un rol interpretado por una persona adulta.',
      pairedRoles: [
        { id: 'caregiver', en: 'Caregiver / Daddy / Mommy', es: 'Caregiver / Daddy / Mommy', perspective: 'active' },
        { id: 'little', en: 'Little (adult role)', es: 'Little (rol adulto)', perspective: 'receptive' },
      ],
    },
    {
      id: 'surreal-fantasy-roleplay',
      en: 'Surreal / impossible fantasy',
      es: 'Fantasía surrealista / imposible',
      kind: 'mutual',
      counterpartScoped: true,
      descriptionEn: 'Sexual fantasy built around deliberately impossible or surreal elements, such as fictional transformations, impossible anatomy, altered scale, magical rules or dreamlike situations that cannot literally occur in reality.',
      descriptionEs: 'Fantasía sexual basada en elementos deliberadamente imposibles o surrealistas, como transformaciones ficticias, anatomías imposibles, cambios de escala, reglas mágicas o situaciones oníricas que no pueden ocurrir literalmente en la realidad.',
    },
    {
      id: 'adult-taboo-fantasy',
      en: 'Adult taboo fantasy',
      es: 'Fantasía tabú entre adultos',
      kind: 'mutual',
      counterpartScoped: true,
      descriptionEn: 'A fictional sexual scenario whose appeal comes from feeling socially forbidden, improper or taboo while all actual participants are adults. It is an umbrella preference for the taboo framing itself; more specific roleplays are rated separately.',
      descriptionEs: 'Escenario sexual ficticio cuyo atractivo está en sentirse socialmente prohibido, impropio o tabú, siendo adultas todas las personas reales participantes. Es una preferencia general por el componente tabú; los roleplays concretos se valoran aparte.',
    },
  ],
  exhibitionism: [
    {
      id: 'risk-of-being-seen',
      en: 'Controlled risk of being seen',
      es: 'Riesgo controlado de ser visto/a',
      kind: 'mutual',
      counterpartScoped: true,
      descriptionEn: 'Enjoying the possibility that sexual activity might be seen because the sense of exposure adds excitement, while choosing a setting that does not deliberately expose uninvolved people. Actual watching/being watched is rated separately under voyeurism.',
      descriptionEs: 'Disfrutar de la posibilidad de que la actividad sexual pueda ser vista porque la sensación de exposición añade excitación, eligiendo un entorno que no exponga deliberadamente a terceros ajenos. Mirar o ser observado de forma efectiva se valora aparte en voyeurismo.',
    },
  ],
};

export function applyFinalClarityReview(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  const sourceById = new Map(
    content.flatMap((category) => category.practices.map((practice) => [practice.id, practice] as const)),
  );

  return content.map((category) => {
    const practices = category.practices
      .filter((practice) => !FINAL_CLARITY_RETIRED_PRACTICE_IDS.has(practice.id))
      .filter((practice) => CATEGORY_MOVES[practice.id] !== undefined ? CATEGORY_MOVES[practice.id] === category.id : true)
      .map((practice) => ({ ...practice, ...(PRACTICE_OVERRIDES[practice.id] ?? {}) }));

    const movedHere = Object.entries(CATEGORY_MOVES)
      .filter(([, targetCategoryId]) => targetCategoryId === category.id)
      .flatMap(([practiceId]) => {
        const practice = sourceById.get(practiceId);
        if (!practice) return [];
        return [{ ...practice, ...(PRACTICE_OVERRIDES[practiceId] ?? {}) }];
      });

    return {
      ...category,
      practices: [...practices, ...movedHere, ...(ADDITIONAL_PRACTICES[category.id] ?? [])],
    };
  });
}
