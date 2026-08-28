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

/**
 * 0.2 questionnaire taxonomy.
 *
 * Taxonomy is deliberately separate from practice identity: practice/role/scope remain the
 * persistence keys, while these groups may evolve as the catalogue is reorganised.
 * Categories are migrated incrementally; categories without entries continue to render flat.
 */
export const CATALOGUE_V3_SUBCATEGORIES: readonly CatalogueSubcategorySeed[] = [
  {
    id: 'affectionate-contact',
    categoryId: 'affection-intimacy',
    en: 'Affection & closeness',
    es: 'Afecto y cercanía',
    descriptionEn: 'Everyday affection, tender contact and ways of feeling physically close.',
    descriptionEs: 'Afecto cotidiano, contacto tierno y formas de sentirse físicamente cerca.',
    order: 0,
    practiceIds: [
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
    ],
  },
  {
    id: 'shared-intimacy',
    categoryId: 'affection-intimacy',
    en: 'Shared intimacy',
    es: 'Intimidad compartida',
    descriptionEn: 'Relaxed situations and activities centred on sharing private physical closeness.',
    descriptionEs: 'Situaciones y actividades relajadas centradas en compartir cercanía física e intimidad.',
    order: 1,
    practiceIds: [
      'sleeping-naked-together',
      'showering-together',
      'bathing-together',
      'sensual-massage',
    ],
  },
  {
    id: 'sexual-tone-atmosphere',
    categoryId: 'sexual-style',
    en: 'Tone & atmosphere',
    es: 'Tono y ambiente',
    descriptionEn: 'The emotional energy, mood and interpersonal tone that shape a sexual encounter.',
    descriptionEs: 'La energía emocional, el ambiente y el tono interpersonal que dan forma al encuentro sexual.',
    order: 0,
    practiceIds: [
      'romantic-sex',
      'passionate-sex',
      'playful-sex',
      'competitive-sex',
      'eye-contact',
    ],
  },
  {
    id: 'sexual-rhythm-timing',
    categoryId: 'sexual-style',
    en: 'Rhythm & timing',
    es: 'Ritmo y momento',
    descriptionEn: 'Preferences about pace, duration, foreplay and when sex fits into the moment.',
    descriptionEs: 'Preferencias sobre velocidad, duración, preliminares y el momento en que surge el sexo.',
    order: 1,
    practiceIds: [
      'slow-sex',
      'quickies',
      'extended-foreplay',
      'morning-sex',
      'sleepy-sex',
    ],
  },
  {
    id: 'clothing-nudity',
    categoryId: 'clothing-appearance',
    en: 'Clothing & nudity',
    es: 'Vestimenta y desnudez',
    descriptionEn: 'How much clothing remains on and how nudity itself contributes to the sexual presentation.',
    descriptionEs: 'Cuánta ropa permanece puesta y cómo la propia desnudez forma parte de la presentación sexual.',
    order: 0,
    practiceIds: [
      'clothed-sex',
      'partial-nudity',
      'full-nudity',
    ],
  },
  {
    id: 'lingerie-intimate-styling',
    categoryId: 'clothing-appearance',
    en: 'Lingerie & intimate styling',
    es: 'Lencería y estilismo íntimo',
    descriptionEn: 'Lingerie and fitted garments chosen to shape a deliberately intimate or seductive look.',
    descriptionEs: 'Lencería y prendas ajustadas elegidas para crear una estética deliberadamente íntima o seductora.',
    order: 1,
    practiceIds: [
      'lingerie',
      'stockings',
      'thigh-highs',
      'garter-belts',
      'corsets',
      'bodysuits',
      'lace-clothing',
      'silk-satin',
    ],
  },
  {
    id: 'fetish-materials-accessories',
    categoryId: 'clothing-appearance',
    en: 'Fetish materials & accessories',
    es: 'Materiales y accesorios fetichistas',
    descriptionEn: 'Distinctive materials, footwear and accessories whose texture or visual language is part of the attraction.',
    descriptionEs: 'Materiales, calzado y accesorios distintivos cuya textura o lenguaje visual forma parte del atractivo.',
    order: 2,
    practiceIds: [
      'high-heels',
      'boots',
      'leather-clothing',
      'latex-clothing',
      'pvc-clothing',
      'harnesses-fashion',
      'chokers',
      'collars-fashion',
      'masks',
      'gloves',
    ],
  },
  {
    id: 'looks-roles-expression',
    categoryId: 'clothing-appearance',
    en: 'Looks, roles & expression',
    es: 'Estética, roles y expresión',
    descriptionEn: 'Outfits and body presentation used to evoke a persona, archetype, style or deliberately different appearance.',
    descriptionEs: 'Conjuntos y presentación corporal usados para evocar una personalidad, arquetipo, estilo o apariencia deliberadamente distinta.',
    order: 3,
    practiceIds: [
      'suits',
      'uniforms',
      'sportswear',
      'cosplay',
      'cross-dressing',
      'body-paint',
    ],
  },
  {
    id: 'masturbation-modes',
    categoryId: 'manual-masturbation',
    en: 'Solo & shared masturbation',
    es: 'Masturbación individual y compartida',
    descriptionEn: 'Ways of masturbating alone, alongside a partner or while watching and being watched.',
    descriptionEs: 'Formas de masturbarse a solas, junto a la pareja o dentro de una dinámica de mirar y ser observado/a.',
    order: 0,
    practiceIds: [
      'solo-masturbation',
      'hands-free-masturbation',
      'masturbating-together',
      'watch-partner-masturbate',
    ],
  },
  {
    id: 'touch-guidance',
    categoryId: 'manual-masturbation',
    en: 'Touch & guidance',
    es: 'Tacto y guía',
    descriptionEn: 'Partnered touch where clothing, gradual access or actively guiding the other person shapes the interaction.',
    descriptionEs: 'Tacto en pareja donde la ropa, el acceso gradual o guiar activamente a la otra persona forman parte de la interacción.',
    order: 1,
    practiceIds: [
      'guided-touch',
      'touching-over-clothes',
      'touching-under-clothes',
    ],
  },
  {
    id: 'manual-genital-anal-stimulation',
    categoryId: 'manual-masturbation',
    en: 'Genital & anal manual stimulation',
    es: 'Estimulación manual genital y anal',
    descriptionEn: 'Hands and fingers used directly for genital or anal sexual stimulation, including mutual manual stimulation.',
    descriptionEs: 'Uso directo de manos y dedos para la estimulación sexual genital o anal, incluida la estimulación manual mutua.',
    order: 2,
    practiceIds: [
      'mutual-handjobs',
      'handjob',
      'vulva-hand-stimulation',
      'clitoral-stimulation',
      'fingering-vaginal',
      'fingering-anal',
    ],
  },
  {
    id: 'other-erogenous-manual-stimulation',
    categoryId: 'manual-masturbation',
    en: 'Other erogenous stimulation',
    es: 'Otras zonas erógenas',
    descriptionEn: 'Manual stimulation focused on other sensitive or erogenous areas of the body.',
    descriptionEs: 'Estimulación manual centrada en otras zonas sensibles o erógenas del cuerpo.',
    order: 3,
    practiceIds: [
      'breast-stimulation-by-hand',
      'nipple-stimulation-by-hand',
      'perineum-massage',
      'prostate-massage-manual',
    ],
  },
] as const;
