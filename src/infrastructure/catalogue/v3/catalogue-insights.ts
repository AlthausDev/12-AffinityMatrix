import { CatalogueInsightTagDefinition, PracticeInsightSignals } from '../../../domain/catalogue/catalogue-insight';

/**
 * Provisional semantic vocabulary for future orientative profile insights.
 *
 * This vocabulary is intentionally broader than the current pilot category. New catalogue
 * migrations can reuse the same signals, while the eventual chart remains free to combine
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
 * Pilot signals for the first migrated category. These values are catalogue semantics only;
 * the future scoring layer will decide how preference values and role perspective contribute.
 */
export const CATALOGUE_V3_PRACTICE_INSIGHTS: readonly PracticeInsightSignals[] = [
  { practiceId: 'kissing', signals: { connection: 0.75, tenderness: 0.5, sensuality: 0.5, romance: 0.25 } },
  { practiceId: 'making-out', signals: { connection: 0.5, sensuality: 0.75, intensity: 0.5 } },
  { practiceId: 'cuddling', signals: { connection: 1, tenderness: 1, sensuality: 0.25, 'slow-pace': 0.5 } },
  { practiceId: 'spooning', signals: { connection: 1, tenderness: 1, sensuality: 0.25, 'slow-pace': 0.5 } },
  { practiceId: 'holding-hands', signals: { connection: 0.75, tenderness: 0.75, romance: 0.5 } },
  { practiceId: 'hair-stroking', signals: { connection: 0.75, tenderness: 1, sensuality: 0.25 } },
  { practiceId: 'face-caressing', signals: { connection: 0.75, tenderness: 1, sensuality: 0.5 } },
  { practiceId: 'back-rubs', signals: { connection: 0.5, tenderness: 0.75, sensuality: 0.5 } },
  { practiceId: 'skin-to-skin-contact', signals: { connection: 0.75, tenderness: 0.5, sensuality: 0.75 } },
  { practiceId: 'verbal-affection', signals: { connection: 1, tenderness: 0.75, romance: 0.5 } },
  { practiceId: 'eye-contact', signals: { connection: 1, sensuality: 0.5, intensity: 0.25 } },
  { practiceId: 'sensual-massage', signals: { connection: 0.5, tenderness: 0.5, sensuality: 1, 'slow-pace': 0.5 } },
  { practiceId: 'full-body-massage', signals: { connection: 0.5, tenderness: 0.5, sensuality: 1, 'slow-pace': 0.5 } },
  { practiceId: 'showering-together', signals: { connection: 0.5, tenderness: 0.25, sensuality: 0.75 } },
  { practiceId: 'bathing-together', signals: { connection: 0.75, tenderness: 0.5, sensuality: 0.75, 'slow-pace': 0.5 } },
  { practiceId: 'sleeping-naked-together', signals: { connection: 0.75, tenderness: 0.5, sensuality: 0.5, 'slow-pace': 0.5 } },
  { practiceId: 'slow-sex', signals: { connection: 0.5, sensuality: 0.75, 'slow-pace': 1 } },
  { practiceId: 'passionate-sex', signals: { connection: 0.25, sensuality: 0.5, intensity: 1 } },
  { practiceId: 'morning-sex', signals: { sensuality: 0.25, spontaneity: 0.5 } },
  { practiceId: 'sleepy-sex', signals: { connection: 0.25, tenderness: 0.25, 'slow-pace': 0.75, spontaneity: 0.25 } },
  { practiceId: 'quickies', signals: { 'fast-pace': 1, spontaneity: 1, intensity: 0.25 } },
  { practiceId: 'extended-foreplay', signals: { sensuality: 0.75, 'slow-pace': 1, connection: 0.25 } },
  { practiceId: 'romantic-sex', signals: { connection: 1, romance: 1, tenderness: 0.5, sensuality: 0.5 } },
  { practiceId: 'playful-sex', signals: { playfulness: 1, spontaneity: 0.5, connection: 0.25 } },
  { practiceId: 'praise-during-sex', signals: { connection: 0.5, romance: 0.25, intensity: 0.25 } },
] as const;
