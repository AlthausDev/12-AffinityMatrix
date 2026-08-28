import { CatalogueInsightTagDefinition, PracticeInsightSignals } from '../../../domain/catalogue/catalogue-insight';

/**
 * Provisional semantic vocabulary for future orientative profile insights.
 *
 * Signals are intentionally reusable across category boundaries. They describe qualities of a
 * practice rather than questionnaire groups, while the eventual chart remains free to combine
 * several signals into user-facing metrics.
 */
export const CATALOGUE_INSIGHT_TAGS: readonly CatalogueInsightTagDefinition[] = [
  {
    id: 'connection',
    en: 'Emotional connection',
    es: 'Conexión emocional',
    descriptionEn: 'Practices where emotional closeness and mutual connection are central.',
    descriptionEs: 'Prácticas donde la cercanía emocional y la conexión mutua son centrales.',
  },
  {
    id: 'tenderness',
    en: 'Tenderness',
    es: 'Ternura',
    descriptionEn: 'Gentle, affectionate and caring physical interaction.',
    descriptionEs: 'Interacción física suave, afectuosa y cuidadosa.',
  },
  {
    id: 'romance',
    en: 'Romance',
    es: 'Romanticismo',
    descriptionEn: 'Romantic tone, gestures or emotional framing around intimacy.',
    descriptionEs: 'Tono, gestos o marco emocional romántico alrededor de la intimidad.',
  },
  {
    id: 'sensuality',
    en: 'Sensuality',
    es: 'Sensualidad',
    descriptionEn: 'Sensory, body-focused enjoyment that emphasises touch and atmosphere.',
    descriptionEs: 'Disfrute sensorial y corporal que enfatiza el tacto y el ambiente.',
  },
  {
    id: 'intensity',
    en: 'Intensity',
    es: 'Intensidad',
    descriptionEn: 'Practices characterised by energetic, forceful or highly charged interaction.',
    descriptionEs: 'Prácticas caracterizadas por una interacción enérgica, fuerte o muy cargada.',
  },
  {
    id: 'slow-pace',
    en: 'Slow pace',
    es: 'Ritmo lento',
    descriptionEn: 'Experiences where taking time and prolonging the interaction are meaningful.',
    descriptionEs: 'Experiencias donde tomarse tiempo y prolongar la interacción es significativo.',
  },
  {
    id: 'fast-pace',
    en: 'Fast pace',
    es: 'Ritmo rápido',
    descriptionEn: 'Brief, direct or deliberately fast-paced experiences.',
    descriptionEs: 'Experiencias breves, directas o deliberadamente rápidas.',
  },
  {
    id: 'spontaneity',
    en: 'Spontaneity',
    es: 'Espontaneidad',
    descriptionEn: 'Practices strongly associated with unplanned or in-the-moment intimacy.',
    descriptionEs: 'Prácticas muy asociadas con la intimidad no planificada o del momento.',
  },
  {
    id: 'playfulness',
    en: 'Playfulness',
    es: 'Juego',
    descriptionEn: 'Humour, teasing, lightness or playful interaction.',
    descriptionEs: 'Humor, provocación, ligereza o interacción juguetona.',
  },
  {
    id: 'exploration',
    en: 'Exploration',
    es: 'Exploración',
    descriptionEn: 'Novelty, experimentation or trying less familiar experiences.',
    descriptionEs: 'Novedad, experimentación o interés por experiencias menos familiares.',
  },
  {
    id: 'visibility',
    en: 'Visibility',
    es: 'Exposición',
    descriptionEn: 'Being seen, showing, watching or moving intimacy beyond a strictly private setting.',
    descriptionEs: 'Ser visto, mostrar, observar o llevar la intimidad más allá de un entorno estrictamente privado.',
  },
  {
    id: 'aesthetic-presentation',
    en: 'Aesthetic presentation',
    es: 'Presentación estética',
    descriptionEn: 'Visual styling, clothing, adornment or body presentation as a meaningful part of attraction.',
    descriptionEs: 'Estilismo visual, ropa, adornos o presentación corporal como parte significativa del atractivo.',
  },
  {
    id: 'role-immersion',
    en: 'Role immersion',
    es: 'Inmersión en rol',
    descriptionEn: 'Appearance, behaviour or framing used to embody a persona, archetype or imagined role.',
    descriptionEs: 'Apariencia, comportamiento o marco utilizados para encarnar una personalidad, arquetipo o rol imaginado.',
  },
  {
    id: 'power-exchange',
    en: 'Power exchange',
    es: 'Intercambio de poder',
    descriptionEn: 'Practices where control, authority, submission or negotiated power are meaningful.',
    descriptionEs: 'Prácticas donde el control, la autoridad, la sumisión o el poder negociado son significativos.',
  },
  {
    id: 'group-social',
    en: 'Group or social context',
    es: 'Contexto grupal o social',
    descriptionEn: 'Experiences involving multiple participants or a meaningful social component.',
    descriptionEs: 'Experiencias con varias personas o con un componente social significativo.',
  },
] as const;

/**
 * Semantic signals for every practice in the categories already migrated to the 0.2 taxonomy.
 * Strength describes the practice, not the user's preference for it; scoring remains a future layer.
 */
export const CATALOGUE_V3_PRACTICE_INSIGHTS: readonly PracticeInsightSignals[] = [
  // Affection & intimacy
  { practiceId: 'kissing', signals: { connection: 0.75, tenderness: 0.5, sensuality: 0.5, romance: 0.25 } },
  { practiceId: 'making-out', signals: { connection: 0.5, sensuality: 0.75, intensity: 0.5 } },
  { practiceId: 'verbal-affection', signals: { connection: 1, tenderness: 0.75, romance: 0.5 } },
  { practiceId: 'holding-hands', signals: { connection: 0.75, tenderness: 0.75, romance: 0.5 } },
  { practiceId: 'hair-stroking', signals: { connection: 0.75, tenderness: 1, sensuality: 0.25 } },
  { practiceId: 'face-caressing', signals: { connection: 0.75, tenderness: 1, sensuality: 0.5 } },
  { practiceId: 'back-rubs', signals: { connection: 0.5, tenderness: 0.75, sensuality: 0.5 } },
  { practiceId: 'skin-to-skin-contact', signals: { connection: 0.75, tenderness: 0.5, sensuality: 0.75 } },
  { practiceId: 'cuddling', signals: { connection: 1, tenderness: 1, sensuality: 0.25, 'slow-pace': 0.5 } },
  { practiceId: 'spooning', signals: { connection: 1, tenderness: 1, sensuality: 0.25, 'slow-pace': 0.5 } },
  { practiceId: 'sleeping-naked-together', signals: { connection: 0.75, tenderness: 0.5, sensuality: 0.5, 'slow-pace': 0.5 } },
  { practiceId: 'showering-together', signals: { connection: 0.5, tenderness: 0.25, sensuality: 0.75 } },
  { practiceId: 'bathing-together', signals: { connection: 0.75, tenderness: 0.5, sensuality: 0.75, 'slow-pace': 0.5 } },
  { practiceId: 'sensual-massage', signals: { connection: 0.5, tenderness: 0.5, sensuality: 1, 'slow-pace': 0.5 } },

  // Sexual style, rhythm & atmosphere
  { practiceId: 'romantic-sex', signals: { connection: 1, romance: 1, tenderness: 0.5, sensuality: 0.5 } },
  { practiceId: 'passionate-sex', signals: { connection: 0.25, sensuality: 0.5, intensity: 1 } },
  { practiceId: 'playful-sex', signals: { playfulness: 1, spontaneity: 0.5, connection: 0.25 } },
  { practiceId: 'competitive-sex', signals: { playfulness: 0.5, intensity: 0.75, exploration: 0.25 } },
  { practiceId: 'eye-contact', signals: { connection: 1, sensuality: 0.5, intensity: 0.25 } },
  { practiceId: 'slow-sex', signals: { connection: 0.5, sensuality: 0.75, 'slow-pace': 1 } },
  { practiceId: 'quickies', signals: { 'fast-pace': 1, spontaneity: 1, intensity: 0.25 } },
  { practiceId: 'extended-foreplay', signals: { sensuality: 0.75, 'slow-pace': 1, connection: 0.25 } },
  { practiceId: 'morning-sex', signals: { sensuality: 0.25, spontaneity: 0.5 } },
  { practiceId: 'sleepy-sex', signals: { connection: 0.25, tenderness: 0.25, 'slow-pace': 0.75, spontaneity: 0.25 } },

  // Clothing, appearance & lingerie
  { practiceId: 'clothed-sex', signals: { 'aesthetic-presentation': 0.5 } },
  { practiceId: 'partial-nudity', signals: { 'aesthetic-presentation': 0.5, visibility: 0.5, sensuality: 0.5 } },
  { practiceId: 'full-nudity', signals: { visibility: 0.75, sensuality: 0.5 } },
  { practiceId: 'lingerie', signals: { 'aesthetic-presentation': 1, sensuality: 0.75, romance: 0.25 } },
  { practiceId: 'stockings', signals: { 'aesthetic-presentation': 0.75, sensuality: 0.5 } },
  { practiceId: 'thigh-highs', signals: { 'aesthetic-presentation': 0.75, sensuality: 0.5 } },
  { practiceId: 'garter-belts', signals: { 'aesthetic-presentation': 1, sensuality: 0.75 } },
  { practiceId: 'corsets', signals: { 'aesthetic-presentation': 1, sensuality: 0.5 } },
  { practiceId: 'bodysuits', signals: { 'aesthetic-presentation': 0.75, sensuality: 0.5 } },
  { practiceId: 'lace-clothing', signals: { 'aesthetic-presentation': 0.75, sensuality: 0.75, romance: 0.25 } },
  { practiceId: 'silk-satin', signals: { 'aesthetic-presentation': 0.5, sensuality: 1, tenderness: 0.25 } },
  { practiceId: 'high-heels', signals: { 'aesthetic-presentation': 0.75, sensuality: 0.25 } },
  { practiceId: 'boots', signals: { 'aesthetic-presentation': 0.75 } },
  { practiceId: 'leather-clothing', signals: { 'aesthetic-presentation': 0.75, sensuality: 0.5, intensity: 0.25 } },
  { practiceId: 'latex-clothing', signals: { 'aesthetic-presentation': 0.75, sensuality: 0.75, exploration: 0.5 } },
  { practiceId: 'pvc-clothing', signals: { 'aesthetic-presentation': 0.75, sensuality: 0.5, exploration: 0.25 } },
  { practiceId: 'harnesses-fashion', signals: { 'aesthetic-presentation': 1, sensuality: 0.5, exploration: 0.5 } },
  { practiceId: 'chokers', signals: { 'aesthetic-presentation': 0.75 } },
  { practiceId: 'collars-fashion', signals: { 'aesthetic-presentation': 0.75 } },
  { practiceId: 'masks', signals: { 'aesthetic-presentation': 0.75, 'role-immersion': 0.5, exploration: 0.25 } },
  { practiceId: 'gloves', signals: { 'aesthetic-presentation': 0.5, sensuality: 0.25 } },
  { practiceId: 'suits', signals: { 'aesthetic-presentation': 0.75, 'role-immersion': 0.25 } },
  { practiceId: 'uniforms', signals: { 'aesthetic-presentation': 0.75, 'role-immersion': 0.75, playfulness: 0.25 } },
  { practiceId: 'sportswear', signals: { 'aesthetic-presentation': 0.5 } },
  { practiceId: 'cosplay', signals: { 'aesthetic-presentation': 1, 'role-immersion': 1, playfulness: 0.75, exploration: 0.5 } },
  { practiceId: 'cross-dressing', signals: { 'aesthetic-presentation': 0.75, 'role-immersion': 0.25, exploration: 0.75 } },
  { practiceId: 'body-paint', signals: { 'aesthetic-presentation': 1, visibility: 0.75, exploration: 0.75, playfulness: 0.25, sensuality: 0.5 } },
] as const;
