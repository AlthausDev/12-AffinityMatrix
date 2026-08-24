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
      'cuddling',
      'spooning',
      'holding-hands',
      'hair-stroking',
      'face-caressing',
      'back-rubs',
      'skin-to-skin-contact',
      'verbal-affection',
      'eye-contact',
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
      'sensual-massage',
      'full-body-massage',
      'showering-together',
      'bathing-together',
      'sleeping-naked-together',
    ],
  },
  {
    id: 'sexual-tone-rhythm',
    categoryId: 'affection-intimacy',
    en: 'Sexual tone & rhythm',
    es: 'Estilo y ritmo sexual',
    descriptionEn: 'The pace, mood and emotional tone you enjoy around sex and foreplay.',
    descriptionEs: 'El ritmo, el ambiente y el tono emocional que te gustan en el sexo y los preliminares.',
    order: 2,
    practiceIds: [
      'slow-sex',
      'passionate-sex',
      'morning-sex',
      'sleepy-sex',
      'quickies',
      'extended-foreplay',
      'romantic-sex',
      'playful-sex',
      'praise-during-sex',
    ],
  },
] as const;
