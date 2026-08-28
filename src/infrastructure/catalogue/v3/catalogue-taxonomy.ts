export interface CatalogueSubcategorySeed {
  readonly id: string;
  readonly categoryId: string;
  readonly en: string;
  readonly es: string;
  readonly descriptionEn: string;
  readonly descriptionEs: string;
  readonly order: number;
  /** Stable practice ids. Moving an id between subcategories never changes answer identity. */
  readonly practiceIds: readonly string[];
}

const subcategory = (
  id: string,
  categoryId: string,
  en: string,
  es: string,
  descriptionEn: string,
  descriptionEs: string,
  order: number,
  practiceIds: readonly string[],
): CatalogueSubcategorySeed => ({ id, categoryId, en, es, descriptionEn, descriptionEs, order, practiceIds });

/**
 * 0.2 questionnaire taxonomy.
 *
 * Taxonomy is deliberately separate from practice identity: practice/role/scope remain the
 * persistence keys, while these groups may evolve as the catalogue is reorganised.
 * Categories are migrated incrementally; categories without entries continue to render flat.
 */
export const CATALOGUE_V3_SUBCATEGORIES: readonly CatalogueSubcategorySeed[] = [
  subcategory(
    'affectionate-contact', 'affection-intimacy', 'Affection & closeness', 'Afecto y cercanía',
    'Everyday affection, tender contact and ways of feeling physically close.',
    'Afecto cotidiano, contacto tierno y formas de sentirse físicamente cerca.', 0,
    ['kissing', 'making-out', 'verbal-affection', 'holding-hands', 'hair-stroking', 'face-caressing', 'back-rubs', 'skin-to-skin-contact', 'cuddling', 'spooning'],
  ),
  subcategory(
    'shared-intimacy', 'affection-intimacy', 'Shared intimacy', 'Intimidad compartida',
    'Relaxed situations and activities centred on sharing private physical closeness.',
    'Situaciones y actividades relajadas centradas en compartir cercanía física e intimidad.', 1,
    ['sleeping-naked-together', 'showering-together', 'bathing-together', 'sensual-massage'],
  ),

  subcategory(
    'sexual-tone-atmosphere', 'sexual-style', 'Tone & atmosphere', 'Tono y ambiente',
    'The emotional energy, mood and interpersonal tone that shape a sexual encounter.',
    'La energía emocional, el ambiente y el tono interpersonal que dan forma al encuentro sexual.', 0,
    ['romantic-sex', 'passionate-sex', 'playful-sex', 'competitive-sex', 'eye-contact'],
  ),
  subcategory(
    'sexual-rhythm-timing', 'sexual-style', 'Rhythm & timing', 'Ritmo y momento',
    'Preferences about pace, duration, foreplay and when sex fits into the moment.',
    'Preferencias sobre velocidad, duración, preliminares y el momento en que surge el sexo.', 1,
    ['slow-sex', 'quickies', 'extended-foreplay', 'morning-sex', 'sleepy-sex'],
  ),

  subcategory(
    'clothing-nudity', 'clothing-appearance', 'Clothing & nudity', 'Vestimenta y desnudez',
    'How much clothing remains on and how nudity itself contributes to the sexual presentation.',
    'Cuánta ropa permanece puesta y cómo la propia desnudez forma parte de la presentación sexual.', 0,
    ['clothed-sex', 'partial-nudity', 'full-nudity'],
  ),
  subcategory(
    'lingerie-intimate-styling', 'clothing-appearance', 'Lingerie & intimate styling', 'Lencería y estilismo íntimo',
    'Lingerie and fitted garments chosen to shape a deliberately intimate or seductive look.',
    'Lencería y prendas ajustadas elegidas para crear una estética deliberadamente íntima o seductora.', 1,
    ['lingerie', 'stockings', 'thigh-highs', 'garter-belts', 'corsets', 'bodysuits', 'lace-clothing', 'silk-satin'],
  ),
  subcategory(
    'fetish-materials-accessories', 'clothing-appearance', 'Fetish materials & accessories', 'Materiales y accesorios fetichistas',
    'Distinctive materials, footwear and accessories whose texture or visual language is part of the attraction.',
    'Materiales, calzado y accesorios distintivos cuya textura o lenguaje visual forma parte del atractivo.', 2,
    ['high-heels', 'boots', 'leather-clothing', 'latex-clothing', 'pvc-clothing', 'harnesses-fashion', 'chokers', 'collars-fashion', 'masks', 'gloves'],
  ),
  subcategory(
    'looks-roles-expression', 'clothing-appearance', 'Looks, roles & expression', 'Estética, roles y expresión',
    'Outfits and body presentation used to evoke a persona, archetype, style or deliberately different appearance.',
    'Conjuntos y presentación corporal usados para evocar una personalidad, arquetipo, estilo o apariencia deliberadamente distinta.', 3,
    ['suits', 'uniforms', 'sportswear', 'cosplay', 'cross-dressing', 'body-paint'],
  ),

  subcategory(
    'masturbation-modes', 'manual-masturbation', 'Solo & shared masturbation', 'Masturbación individual y compartida',
    'Ways of masturbating alone, alongside a partner or while watching and being watched.',
    'Formas de masturbarse a solas, junto a la pareja o dentro de una dinámica de mirar y ser observado/a.', 0,
    ['solo-masturbation', 'hands-free-masturbation', 'masturbating-together', 'watch-partner-masturbate'],
  ),
  subcategory(
    'touch-guidance', 'manual-masturbation', 'Touch & guidance', 'Tacto y guía',
    'Partnered touch where clothing, gradual access or actively guiding the other person shapes the interaction.',
    'Tacto en pareja donde la ropa, el acceso gradual o guiar activamente a la otra persona forman parte de la interacción.', 1,
    ['guided-touch', 'touching-over-clothes', 'touching-under-clothes'],
  ),
  subcategory(
    'manual-genital-anal-stimulation', 'manual-masturbation', 'Genital & anal manual stimulation', 'Estimulación manual genital y anal',
    'Hands and fingers used directly for genital or anal sexual stimulation, including mutual manual stimulation.',
    'Uso directo de manos y dedos para la estimulación sexual genital o anal, incluida la estimulación manual mutua.', 2,
    ['mutual-handjobs', 'handjob', 'vulva-hand-stimulation', 'clitoral-stimulation', 'fingering-vaginal', 'fingering-anal'],
  ),
  subcategory(
    'other-erogenous-manual-stimulation', 'manual-masturbation', 'Other erogenous stimulation', 'Otras zonas erógenas',
    'Manual stimulation focused on other sensitive or erogenous areas of the body.',
    'Estimulación manual centrada en otras zonas sensibles o erógenas del cuerpo.', 3,
    ['breast-stimulation-by-hand', 'nipple-stimulation-by-hand', 'perineum-massage', 'prostate-massage-manual'],
  ),

  subcategory(
    'genital-oral-sex', 'oral', 'Genital oral sex', 'Sexo oral genital',
    'Oral stimulation focused on the genitals, from teasing and sustained stimulation to more intense depth.',
    'Estimulación oral centrada en los genitales, desde la provocación y la estimulación sostenida hasta una mayor intensidad y profundidad.', 0,
    ['cunnilingus', 'fellatio', 'deep-throat', 'oral-teasing'],
  ),
  subcategory(
    'anal-body-oral-stimulation', 'oral', 'Anal & body-focused oral stimulation', 'Estimulación oral anal y corporal',
    'Oral stimulation focused on the anus or other sensitive body areas beyond the genitals.',
    'Estimulación oral centrada en el ano u otras zonas sensibles del cuerpo más allá de los genitales.', 1,
    ['oral-anal', 'oral-nipples', 'oral-breasts', 'oral-fingers', 'oral-toes'],
  ),

  subcategory(
    'penetration-types-targets', 'penetration', 'Types & target areas', 'Tipos y zonas de penetración',
    'Core vaginal and anal penetration plus penetration aimed at a specific internal area or sensation.',
    'Penetración vaginal y anal básica, junto con penetración dirigida a una zona interna o sensación concreta.', 0,
    ['vaginal-penetration', 'anal-penetration', 'prostate-penetration', 'cervix-contact'],
  ),
  subcategory(
    'penetration-depth-pace-intensity', 'penetration', 'Depth, pace & intensity', 'Profundidad, ritmo e intensidad',
    'How far penetration goes, how quickly it moves and how much physical force or impact it uses.',
    'Hasta dónde llega la penetración, a qué velocidad se mueve y cuánta fuerza física o impacto utiliza.', 1,
    ['shallow-penetration', 'deep-penetration', 'slow-penetration', 'rough-penetration'],
  ),
  subcategory(
    'double-penetration-fisting', 'penetration', 'Double penetration & fisting', 'Doble penetración y fisting',
    'Higher-capacity penetration within a single vaginal or anal site, including two penetrative elements or gradual hand insertion.',
    'Penetración de mayor capacidad dentro de una misma zona vaginal o anal, mediante dos elementos penetrativos o inserción gradual de la mano.', 2,
    ['double-vaginal-penetration', 'double-anal-penetration', 'fisting-vaginal', 'fisting-anal'],
  ),
  subcategory(
    'simultaneous-multi-site-penetration', 'penetration', 'Simultaneous multi-site penetration', 'Penetración simultánea en varias zonas',
    'Simultaneous penetration involving two or three different vaginal, anal or oral sites.',
    'Penetración simultánea que combina dos o tres zonas distintas entre vagina, ano y boca.', 3,
    ['simultaneous-vaginal-anal-penetration', 'simultaneous-vaginal-oral-penetration', 'simultaneous-anal-oral-penetration', 'simultaneous-vaginal-anal-oral-penetration'],
  ),

  subcategory(
    'positions-face-to-face-close', 'sexual-positions', 'Face-to-face & close contact', 'Cara a cara y cercanía',
    'Positions built around facing each other, close torso contact or compact seated and lying arrangements.',
    'Posturas centradas en estar cara a cara, mantener contacto cercano del torso o colocarse de forma compacta sentados o tumbados.', 0,
    ['missionary', 'side-by-side-face-to-face', 'kneeling-face-to-face', 'seated-penetration', 'lotus-position'],
  ),
  subcategory(
    'positions-on-top-rear', 'sexual-positions', 'On top & from behind', 'Encima y desde atrás',
    'Positions defined mainly by one partner being on top or by a rear-entry body arrangement.',
    'Posturas definidas principalmente porque una persona está encima o por una colocación corporal desde atrás.', 1,
    ['cowgirl', 'reverse-cowgirl', 'doggy-style', 'prone-rear-entry', 'spooning-penetration'],
  ),
  subcategory(
    'positions-support-angles-physical', 'sexual-positions', 'Support, angles & physical positions', 'Apoyo, ángulos y posiciones físicas',
    'Positions where leverage, elevation, perpendicular angles, standing support, balance or more active body coordination shape the experience.',
    'Posturas donde el apoyo, la elevación, los ángulos perpendiculares, estar de pie, el equilibrio o una coordinación corporal más activa dan forma a la experiencia.', 2,
    ['legs-on-shoulders', 'butterfly-position', 't-position', 'standing-penetration', 'against-wall', 'standing-carry', 'wheelbarrow-position', 'bridge-position'],
  ),
  subcategory(
    'positions-oral', 'sexual-positions', 'Oral positions', 'Posturas orales',
    'Body arrangements whose defining geometry centres on giving or receiving oral stimulation.',
    'Colocaciones corporales cuya geometría se centra en dar o recibir estimulación oral.', 3,
    ['sixty-nine', 'face-sitting'],
  ),

  subcategory(
    'toys-vibrators-remote', 'toys', 'Vibrators & remote stimulation', 'Vibradores y estimulación remota',
    'Vibrating toys and remotely controlled stimulation, from compact external vibrators to wearable or partner-controlled devices.',
    'Juguetes vibratorios y estimulación a distancia, desde vibradores externos compactos hasta dispositivos llevables o controlados por la pareja.', 0,
    ['vibrator', 'wand-vibrator', 'bullet-vibrator', 'rabbit-vibrator', 'wearable-vibrator', 'remote-control-toy'],
  ),
  subcategory(
    'toys-dildos-penetrative', 'toys', 'Dildos & penetrative toys', 'Dildos y juguetes de penetración',
    'Non-anal-specific penetrative toys distinguished by shape, material, fantasy design, multiple ends or hands-free mounting.',
    'Juguetes de penetración no específicamente anales diferenciados por forma, material, diseño fantástico, varios extremos o montaje sin manos.', 1,
    ['dildo', 'special-material-dildo', 'fantasy-shaped-dildo', 'double-ended-dildo', 'vacuum-cup-toys'],
  ),
  subcategory(
    'toys-anal-prostate', 'toys', 'Anal & prostate toys', 'Juguetes anales y de próstata',
    'Toys designed primarily for anal insertion, graduated anal stimulation or targeted prostate stimulation.',
    'Juguetes diseñados principalmente para inserción anal, estimulación anal progresiva o estimulación dirigida de la próstata.', 2,
    ['anal-plug', 'vibrating-anal-plug', 'anal-beads', 'prostate-massager', 'butt-plug-tail'],
  ),
  subcategory(
    'toys-strap-ons', 'toys', 'Strap-ons & wearable penetration', 'Strap-ons y penetración llevable',
    'Penetrative toys worn by one partner, with or without a harness, so the toy becomes part of the wearer’s body position and movement.',
    'Juguetes de penetración llevados por una persona, con o sin arnés, de forma que el juguete pasa a formar parte de su postura y movimiento corporal.', 3,
    ['strap-on', 'strapless-strap-on'],
  ),
  subcategory(
    'toys-penis-masturbators', 'toys', 'Penis toys & masturbators', 'Juguetes para pene y masturbadores',
    'Sleeves, rings, pumps and manual or powered masturbators designed around penile stimulation or support.',
    'Fundas, anillos, bombas y masturbadores manuales o motorizados diseñados alrededor de la estimulación o soporte del pene.', 4,
    ['penis-sleeve', 'cock-ring', 'vibrating-cock-ring', 'masturbator-sleeve', 'automatic-masturbator', 'penis-pump'],
  ),
  subcategory(
    'toys-suction-pelvic-sensation', 'toys', 'Suction, pelvic-floor & sensation toys', 'Succión, suelo pélvico y juguetes de sensación',
    'Focused stimulation tools that use air pulses, suction, pelvic-floor resistance or light rolling-point sensation rather than conventional penetration.',
    'Herramientas de estimulación localizada que usan pulsos de aire, succión, resistencia del suelo pélvico o sensación ligera de rueda con puntas en lugar de penetración convencional.', 5,
    ['clitoral-suction-toy', 'kegel-balls', 'nipple-suction-cups', 'pinwheel'],
  ),
  subcategory(
    'toys-machines-furniture-positioning', 'toys', 'Machines, furniture & positioning', 'Máquinas, mobiliario y posicionamiento',
    'Larger equipment that automates repeated motion, supports body weight or changes leverage and access during sexual activity.',
    'Equipamiento de mayor tamaño que automatiza movimiento repetido, sostiene el peso corporal o cambia el apoyo y el acceso durante la actividad sexual.', 6,
    ['sex-machine', 'sex-swing', 'positioning-pillow'],
  ),

  subcategory(
    'orgasm-delay-denial', 'orgasm-control', 'Edging, delay & denial', 'Edging, retraso y negación',
    'Practices centred on approaching orgasm, delaying it, controlling its timing or intentionally avoiding climax.',
    'Prácticas centradas en acercarse al orgasmo, retrasarlo, controlar su momento o evitar deliberadamente el clímax.', 0,
    ['edging', 'orgasm-denial', 'orgasm-control', 'no-orgasm-sex'],
  ),
  subcategory(
    'orgasm-altered-overstimulation', 'orgasm-control', 'Altered climax & overstimulation', 'Clímax alterado y sobreestimulación',
    'Experiences where orgasm is deliberately changed, compelled, interrupted or followed by continued stimulation.',
    'Experiencias donde el orgasmo se modifica deliberadamente, se fuerza, se interrumpe o va seguido de estimulación continuada.', 1,
    ['ruined-orgasm', 'forced-orgasm', 'post-orgasm-stimulation', 'overstimulation'],
  ),
  subcategory(
    'orgasm-patterns-shared', 'orgasm-control', 'Orgasm patterns & coordination', 'Patrones y coordinación del orgasmo',
    'Preferences around repeated climax, synchronising orgasm with a partner or reaching orgasm without direct manual stimulation.',
    'Preferencias sobre repetir el clímax, sincronizar el orgasmo con la pareja o alcanzarlo sin estimulación manual directa.', 2,
    ['multiple-orgasms', 'simultaneous-orgasm', 'hands-free-orgasm'],
  ),

  subcategory(
    'body-face-hair-head', 'body-fetishes', 'Face, hair & head', 'Rostro, pelo y cabeza',
    'Attraction focused on facial features, hair length or style, facial hair and nearby head or neck features.',
    'Atracción centrada en rasgos faciales, longitud o estilo del pelo, vello facial y zonas cercanas de cabeza o cuello.', 0,
    ['lips', 'tongue', 'hair', 'hair-length-short', 'hair-length-medium', 'hair-length-long', 'shaved-bald-head', 'facial-hair', 'ears', 'neck'],
  ),
  subcategory(
    'body-torso-build-stature', 'body-fetishes', 'Torso, build & stature', 'Torso, complexión y estatura',
    'Attraction to the chest, breasts, nipples, musculature, overall body build or perceived height.',
    'Atracción por el torso, pecho, pezones, musculatura, complexión general o estatura percibida.', 1,
    ['chest-general', 'breast-size-small', 'breast-size-average', 'breast-size-large', 'nipples', 'muscles', 'slim-build', 'curvy-build', 'stocky-build', 'stature-short', 'stature-average', 'stature-tall'],
  ),
  subcategory(
    'body-limbs-abdomen-buttocks', 'body-fetishes', 'Limbs, abdomen & buttocks', 'Extremidades, abdomen y glúteos',
    'Attraction focused on hands, abdomen, buttocks, legs, thighs, feet and related proportions or details.',
    'Atracción centrada en manos, abdomen, glúteos, piernas, muslos, pies y sus proporciones o detalles relacionados.', 2,
    ['hands', 'fingers', 'bellies', 'navel', 'buttocks', 'buttocks-size-small', 'buttocks-size-average', 'buttocks-size-large', 'legs', 'thighs', 'feet', 'toes'],
  ),
  subcategory(
    'body-genitals-pubic', 'body-fetishes', 'Genitals & pubic traits', 'Genitales y rasgos púbicos',
    'Attraction focused on genital anatomy, perceived penis size and pubic hair.',
    'Atracción centrada en la anatomía genital, el tamaño percibido del pene y el vello púbico.', 3,
    ['penis', 'penis-size-small', 'penis-size-average', 'penis-size-large', 'testicles', 'vulva', 'pubic-hair'],
  ),
  subcategory(
    'body-hair-scent-sweat', 'body-fetishes', 'Body hair, scent & sweat', 'Vello corporal, olor y sudor',
    'Body-focused attraction where natural hair, armpits, scent or sweat are meaningful parts of the sensory appeal.',
    'Atracción corporal donde el vello natural, las axilas, el olor o el sudor forman una parte significativa del atractivo sensorial.', 4,
    ['body-hair', 'armpits', 'body-scent', 'sweat'],
  ),
  subcategory(
    'body-underwear-worn', 'body-fetishes', 'Underwear & worn clothing', 'Ropa interior y prendas usadas',
    'Attraction to underwear itself or to the sensory and personal associations of underwear that has been worn.',
    'Atracción por la propia ropa interior o por las asociaciones sensoriales y personales de prendas que han sido usadas.', 5,
    ['underwear', 'worn-underwear'],
  ),
  subcategory(
    'body-tattoos-piercings', 'body-fetishes', 'Tattoos & piercings', 'Tatuajes y piercings',
    'Attraction to tattoos and piercings, including their placement on the face, body, nipples or genitals.',
    'Atracción por tatuajes y piercings, incluida su colocación en el rostro, cuerpo, pezones o genitales.', 6,
    ['tattoos', 'piercings', 'facial-piercings', 'body-piercings', 'nipple-piercings', 'genital-piercings'],
  ),

  subcategory(
    'groups-trios-small', 'groups', 'Threesomes & small groups', 'Tríos y grupos pequeños',
    'Three- and four-person configurations, including a couple inviting one additional participant.',
    'Configuraciones de tres o cuatro personas, incluida una pareja que incorpora a una persona invitada.', 0,
    ['couple-plus-guest', 'threesome-mmf', 'threesome-mff', 'threesome-mmm', 'threesome-fff', 'foursome'],
  ),
  subcategory(
    'groups-larger-scenes', 'groups', 'Larger group scenes', 'Escenas de grupo amplias',
    'Sexual scenes involving a broader group, a concentrated many-to-one dynamic or consensual anonymity.',
    'Escenas sexuales con un grupo más amplio, una dinámica concentrada de varias personas con una o anonimato consensuado.', 1,
    ['group-sex', 'gangbang', 'anonymous-group-scene'],
  ),
  subcategory(
    'groups-swinging-exchange', 'groups', 'Swinging & partner exchange', 'Swinging e intercambio de parejas',
    'Couple-based non-monogamous formats ranging from sharing a room to soft or full partner exchange.',
    'Formatos no monógamos centrados en parejas, desde compartir habitación hasta el intercambio suave o completo.', 2,
    ['swinging', 'soft-swap', 'full-swap', 'same-room-sex'],
  ),
  subcategory(
    'groups-watching-relationship-dynamics', 'groups', 'Watching & third-person relationship dynamics', 'Observación y dinámicas de pareja con terceros',
    'Consensual dynamics where seeing a partner with someone else, or the relationship framing around that experience, is central.',
    'Dinámicas consensuadas donde ver a la pareja con otra persona, o el marco relacional alrededor de esa experiencia, es central.', 3,
    ['watching-partner-with-other', 'hotwife-dynamic', 'cuckold-dynamic', 'cuckquean-dynamic'],
  ),

  subcategory(
    'roleplay-everyday-encounters', 'roleplay', 'Everyday encounters & situations', 'Encuentros y situaciones cotidianas',
    'Roleplay built around plausible adult encounters, familiar places or ordinary social situations rather than a strong authority hierarchy.',
    'Roleplay basado en encuentros adultos plausibles, lugares familiares o situaciones sociales cotidianas, sin que una jerarquía fuerte sea el elemento central.', 0,
    ['roleplay-general', 'strangers-roleplay', 'first-date-roleplay', 'massage-roleplay', 'delivery-person-roleplay', 'hotel-roleplay', 'office-roleplay'],
  ),
  subcategory(
    'roleplay-professions-status-authority', 'roleplay', 'Professions, status & authority', 'Profesiones, estatus y autoridad',
    'Adult occupational or status-based roles where profession, rank, social standing or an authority contrast defines the scene.',
    'Roles adultos basados en profesiones o estatus donde el oficio, rango, posición social o contraste de autoridad define la escena.', 1,
    ['boss-employee-roleplay', 'teacher-student-adult-roleplay', 'medical-professional-patient-roleplay', 'doctor-nurse-roleplay', 'police-roleplay', 'royalty-servant-roleplay', 'celebrity-fan-roleplay'],
  ),
  subcategory(
    'roleplay-captivity-control-interrogation', 'roleplay', 'Captivity, control & interrogation', 'Cautiverio, control e interrogatorio',
    'Pre-agreed adult scenarios whose fictional tension comes from confinement, capture, guarding, interrogation or a strong directed-control dynamic.',
    'Escenarios adultos previamente acordados cuya tensión ficticia procede del confinamiento, captura, vigilancia, interrogatorio o una dinámica fuerte de control dirigido.', 2,
    ['prisoner-guard-roleplay', 'captor-captive-roleplay', 'interrogation-roleplay'],
  ),
  subcategory(
    'roleplay-fictional-archetypes', 'roleplay', 'Fictional characters & archetypes', 'Personajes y arquetipos ficticios',
    'Character-driven scenes centred on heightened archetypes, supernatural personas or ceremonial framing.',
    'Escenas centradas en arquetipos intensificados, personajes sobrenaturales o un marco ceremonial.', 3,
    ['superhero-roleplay', 'vampire-roleplay', 'ritual-roleplay'],
  ),
  subcategory(
    'roleplay-pet-primal', 'roleplay', 'Pet & primal roles', 'Roles pet y primal',
    'Animal-inspired adult roleplay ranging from affectionate pet/handler play to immersive training themes and instinct-driven primal dynamics.',
    'Roleplay adulto inspirado en animales, desde dinámicas afectuosas mascota/guía hasta temas de entrenamiento inmersivo y dinámicas primal guiadas por el instinto.', 4,
    ['pet-play-soft', 'pet-play-intense', 'primal-play'],
  ),
];
