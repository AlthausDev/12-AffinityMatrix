import { CatalogueSubcategorySeed } from './catalogue-taxonomy-core';

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

/** Final six Catalogue V3 categories completing the 0.2 questionnaire taxonomy. */
export const CATALOGUE_V3_REMAINING_SUBCATEGORIES: readonly CatalogueSubcategorySeed[] = [
  subcategory(
    'psychological-praise-worship', 'psychological', 'Praise & worship', 'Elogio y adoración',
    'Positive attention, admiration and worship-focused dynamics where appreciation or reverence is central.',
    'Dinámicas de atención positiva, admiración y adoración donde el aprecio o la reverencia son centrales.', 0,
    ['praise-kink', 'body-worship', 'foot-worship', 'boot-worship'],
  ),
  subcategory(
    'psychological-humiliation-objectification', 'psychological', 'Humiliation, degradation & objectification', 'Humillación, degradación y cosificación',
    'Psychological play built around embarrassment, lowered status, exposure, objectification or being treated as an object or role.',
    'Juego psicológico centrado en vergüenza, pérdida de estatus, exposición, cosificación o ser tratado como un objeto o función.', 1,
    ['humiliation', 'degradation', 'embarrassment-play', 'exposure-humiliation', 'small-penis-humiliation', 'breast-size-humiliation', 'orgasm-humiliation', 'objectification', 'furniture-roleplay'],
  ),
  subcategory(
    'psychological-verbal-teasing-submission', 'psychological', 'Verbal teasing & submission', 'Provocación verbal y sumisión',
    'Language-centred interaction ranging from begging and erotic teasing to dirty talk, names and consensual mocking.',
    'Interacción centrada en el lenguaje, desde suplicar y provocar eróticamente hasta dirty talk, apelativos y burlas consensuadas.', 2,
    ['begging', 'teasing-verbal', 'dirty-talk', 'name-calling', 'mocking'],
  ),
  subcategory(
    'psychological-anticipation-fear-mindgames', 'psychological', 'Anticipation, fear & mind games', 'Anticipación, miedo y juegos mentales',
    'Psychological tension created through anticipation, controlled fear, fictional leverage or deliberately uncertain mental games.',
    'Tensión psicológica creada mediante anticipación, miedo controlado, presión ficticia o juegos mentales deliberadamente inciertos.', 3,
    ['anticipation', 'fear-play', 'blackmail-roleplay', 'mind-games'],
  ),

  subcategory(
    'sensation-impact', 'sensation', 'Impact play', 'Juego de impacto',
    'Impact-focused sensations delivered with hands or implements, from spanking and paddles to whips, canes and improvised household implements.',
    'Sensaciones centradas en impactos realizados con las manos o instrumentos, desde azotes y palas hasta látigos, varas e implementos domésticos.', 0,
    ['spanking', 'slapping-body', 'face-slapping', 'paddling', 'flogging', 'whipping', 'caning', 'cropping', 'belting', 'wooden-spoon-impact'],
  ),
  subcategory(
    'sensation-rough-pressure-pinching', 'sensation', 'Rough touch, pressure & pinching', 'Contacto brusco, presión y pellizcos',
    'Direct tactile intensity using grabbing, biting, scratching, pulling, pinching, clamps or focused pressure on sensitive areas.',
    'Intensidad táctil directa mediante agarres, mordiscos, arañazos, tirones, pellizcos, pinzas o presión localizada en zonas sensibles.', 1,
    ['rough-grabbing', 'biting', 'scratching', 'pinching', 'hair-pulling', 'nipple-pinching', 'breast-slapping', 'genital-slapping', 'pressure-points', 'clothespins', 'nipple-clamp-sensation'],
  ),
  subcategory(
    'sensation-temperature-electric', 'sensation', 'Temperature & mild electrostimulation', 'Temperatura y electroestimulación suave',
    'Controlled cold, warmth, temperature contrast and lower-intensity electrical sensation used as part of sensory play.',
    'Frío, calor, contrastes de temperatura y estimulación eléctrica de menor intensidad utilizados como parte del juego sensorial.', 2,
    ['ice-play', 'warm-wax', 'temperature-contrast', 'electrostimulation-mild'],
  ),
  subcategory(
    'sensation-light-sensory-modulation', 'sensation', 'Light touch & sensory modulation', 'Contacto ligero y modulación sensorial',
    'Light tactile stimulation and broader manipulation of sensory input, including tickling, feathers, deprivation and deliberate overload.',
    'Estimulación táctil ligera y manipulación más amplia de la entrada sensorial, incluidos cosquillas, plumas, privación y sobrecarga deliberada.', 3,
    ['tickling', 'feather-sensation', 'sensory-deprivation', 'sensory-overload'],
  ),

  subcategory(
    'fluids-saliva', 'fluids', 'Saliva & spitting', 'Saliva y escupir',
    'Saliva-focused play including spitting, sharing saliva and deliberately letting saliva or drool become part of the interaction.',
    'Juego centrado en la saliva, incluyendo escupir, compartir saliva y dejar deliberadamente que la saliva o el babeo formen parte de la interacción.', 0,
    ['spitting-on-body', 'spitting-in-mouth', 'saliva-sharing', 'drooling'],
  ),
  subcategory(
    'fluids-semen-oral-external', 'fluids', 'Semen: external & oral', 'Semen: externo y oral',
    'Semen-focused preferences involving where it lands externally or what happens after it enters the mouth.',
    'Preferencias centradas en el semen según dónde cae externamente o qué ocurre después de entrar en la boca.', 1,
    ['semen-on-face', 'semen-on-breasts', 'semen-on-buttocks', 'semen-in-mouth', 'swallowing', 'spitting-semen', 'snowballing'],
  ),
  subcategory(
    'fluids-internal-sexual', 'fluids', 'Internal ejaculation & sexual fluids', 'Eyaculación interna y fluidos sexuales',
    'Internal ejaculation, cleanup and female ejaculation or squirting where the sexual fluid itself is a meaningful part of the preference.',
    'Eyaculación interna, limpieza y eyaculación femenina o squirting donde el propio fluido sexual forma una parte significativa de la preferencia.', 2,
    ['creampie-vaginal', 'creampie-anal', 'creampie-cleanup', 'female-ejaculation', 'squirting-on-partner'],
  ),
  subcategory(
    'fluids-urine-blood-scat', 'fluids', 'Urine, blood & scat', 'Orina, sangre y scat',
    'Higher-taboo bodily-fluid and waste themes involving urine, blood or feces, including contact and ingestion variants where present.',
    'Temas corporales más tabú relacionados con orina, sangre o heces, incluidas variantes de contacto e ingestión cuando existen.', 3,
    ['urine-play', 'urine-drinking', 'blood-play', 'blood-on-body', 'blood-drinking', 'scat-on-body', 'scat-in-mouth', 'scat-ingestion'],
  ),
  subcategory(
    'fluids-sweat-substances', 'fluids', 'Sweat & messy substances', 'Sudor y sustancias corporales',
    'Sweat plus food, oil or mud used on the body where texture, coating or deliberate messiness shapes the experience.',
    'Sudor junto con comida, aceite o barro utilizados sobre el cuerpo cuando la textura, el recubrimiento o ensuciarse deliberadamente dan forma a la experiencia.', 4,
    ['sweat-play', 'sweat-licking', 'food-body-play', 'oil-body-play', 'mud-body-play'],
  ),

  subcategory(
    'taboo-social-symbolic', 'taboo-fantasies', 'Social, identity & symbolic taboos', 'Tabúes sociales, de identidad y simbólicos',
    'Adult fictional fantasies whose transgressive charge comes from forbidden relationships, identity roles, religion, infidelity or provocative symbolism.',
    'Fantasías ficticias adultas cuya carga transgresora procede de relaciones prohibidas, roles de identidad, religión, infidelidad o simbología provocadora.', 0,
    ['adult-taboo-fantasy', 'cheating-fantasy', 'adult-ageplay-roleplay', 'caregiver-little-adult-roleplay', 'family-role-taboo-fantasy', 'religious-taboo-fantasy', 'extremist-war-symbolism-fantasy'],
  ),
  subcategory(
    'taboo-control-unawareness-mortality', 'taboo-fantasies', 'Control, unawareness & mortality fantasies', 'Fantasías de control, inconsciencia y mortalidad',
    'Pre-agreed adult roleplay or controlled simulation built around apparent lack of permission, unawareness, public availability or death-like fictional framing.',
    'Roleplay adulto previamente acordado o simulación controlada basada en aparente falta de permiso, inconsciencia, disponibilidad pública o una ficción relacionada con la muerte.', 1,
    ['consensual-non-consent-roleplay', 'free-use-unaware-roleplay', 'sleep-roleplay', 'public-use-fantasy', 'death-corpse-roleplay'],
  ),

  subcategory(
    'surrealism-transformation-anatomy-scale', 'surrealism', 'Transformation, anatomy & scale', 'Transformación, anatomía y escala',
    'Impossible fantasies centred on transformed bodies, mixed or additional anatomy, altered scale or broadly surreal sexual premises.',
    'Fantasías imposibles centradas en cuerpos transformados, anatomía combinada o adicional, cambios de escala o premisas sexuales surrealistas.', 0,
    ['surreal-fantasy-roleplay', 'futanari-fantasy', 'transformation-fantasy', 'size-change-fantasy', 'extra-anatomy-fantasy'],
  ),
  subcategory(
    'surrealism-creatures-nonhuman', 'surrealism', 'Creatures & non-human fantasy', 'Criaturas y fantasía no humana',
    'Explicitly fictional adult fantasies involving impossible creatures, anthropomorphic characters, monsters, aliens, tentacles or impossible swallowing scenarios.',
    'Fantasías adultas explícitamente ficticias con criaturas imposibles, personajes antropomórficos, monstruos, alienígenas, tentáculos o escenarios imposibles de ser tragado.', 1,
    ['tentacle-fantasy', 'furry-anthro-fantasy', 'monster-roleplay', 'alien-fantasy', 'vore-fantasy'],
  ),

  subcategory(
    'edge-breath-smothering-water', 'edge', 'Breath, smothering & water fantasies', 'Respiración, asfixia y fantasías con agua',
    'Higher-risk edge themes built around restricted breathing, choking or smothering imagery and water-related bondage fantasy.',
    'Temas edge de mayor riesgo centrados en restricción de la respiración, fantasías de ahogo o asfixia y bondage relacionado con agua.', 0,
    ['breath-play', 'choking-fantasy', 'smothering', 'water-bondage-fantasy'],
  ),
  subcategory(
    'edge-puncture-cutting-heat-electric', 'edge', 'Puncture, cutting, marking, heat & electricity', 'Punción, corte, marcas, calor y electricidad',
    'High-intensity sensation and marking themes involving needles, piercing, cutting, scarification, branding, strong heat, fire or stronger electrical stimulation.',
    'Temas de sensación y marcas de alta intensidad con agujas, piercing, corte, escarificación, branding, calor fuerte, fuego o electroestimulación más intensa.', 1,
    ['needle-play', 'piercing-play', 'cutting-play', 'scarification-fantasy', 'branding-fantasy', 'hot-wax-intense', 'fire-play', 'electrostimulation-intense'],
  ),
  subcategory(
    'edge-intense-genital-breast-pain', 'edge', 'Intense genital & breast pain play', 'Dolor intenso genital y de pecho',
    'High-intensity pain-focused play directed specifically at external genitals, breasts or nipples.',
    'Juego de dolor de alta intensidad dirigido específicamente a genitales externos, pecho o pezones.', 2,
    ['pussy-torture', 'cock-and-ball-torture', 'breast-torture', 'nipple-torture'],
  ),
  subcategory(
    'edge-advanced-restraint', 'edge', 'Advanced restraint & confinement', 'Restricción y confinamiento avanzados',
    'Higher-intensity restraint where suspension, inversion, difficult positions, long duration or vacuum confinement meaningfully change the physical experience.',
    'Restricción de mayor intensidad donde suspensión, inversión, posiciones difíciles, larga duración o confinamiento por vacío cambian de forma significativa la experiencia física.', 3,
    ['suspension-bondage', 'inversion-bondage', 'predicament-bondage', 'long-duration-restraint', 'vacuum-bed', 'vacuum-cube'],
  ),
] as const;
