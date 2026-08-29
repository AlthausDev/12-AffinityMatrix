import { CatalogueInsightTagDefinition, CatalogueInsightTagId, PracticeInsightSignals } from '../../../domain/catalogue/catalogue-insight';
import { Profile } from '../../../domain/profile/profile';
import { Preference } from '../../../domain/profile/preference';

export interface SemanticInsightEntry {
  readonly tag: CatalogueInsightTagDefinition;
  readonly score: number;
  readonly evidenceCount: number;
  readonly weightedEvidence: number;
}

export interface SemanticThemeDefinition {
  readonly id: string;
  readonly en: string;
  readonly es: string;
  readonly descriptionEn: string;
  readonly descriptionEs: string;
  readonly tags: readonly CatalogueInsightTagId[];
}

export interface SemanticThemeEntry {
  readonly theme: SemanticThemeDefinition;
  readonly score: number;
  readonly evidenceCount: number;
}

export const DASHBOARD_SEMANTIC_THEMES: readonly SemanticThemeDefinition[] = [
  {
    id: 'connection',
    en: 'Connection & sensuality',
    es: 'Conexión y sensualidad',
    descriptionEn: 'Emotional closeness, tenderness, romance, sensuality and reciprocal interaction.',
    descriptionEs: 'Cercanía emocional, ternura, romanticismo, sensualidad e interacción recíproca.',
    tags: ['connection', 'tenderness', 'romance', 'sensuality', 'reciprocity', 'slow-pace'],
  },
  {
    id: 'exploration',
    en: 'Exploration & play',
    es: 'Exploración y juego',
    descriptionEn: 'Novelty, spontaneity, playful interaction, imagination and role immersion.',
    descriptionEs: 'Novedad, espontaneidad, interacción juguetona, imaginación e inmersión en roles.',
    tags: ['exploration', 'spontaneity', 'playfulness', 'fantasy-imagination', 'role-immersion', 'anonymity'],
  },
  {
    id: 'intensity',
    en: 'Intensity & physicality',
    es: 'Intensidad y fisicalidad',
    descriptionEn: 'Energetic interaction, active body involvement, sensation and higher-intensity interests.',
    descriptionEs: 'Interacción enérgica, implicación corporal activa, sensaciones e intereses de mayor intensidad.',
    tags: ['intensity', 'fast-pace', 'physicality', 'pain-sensation', 'edge-risk'],
  },
  {
    id: 'power',
    en: 'Power & structure',
    es: 'Poder y estructura',
    descriptionEn: 'Power exchange, rules, service, ownership symbolism and restriction.',
    descriptionEs: 'Intercambio de poder, reglas, servicio, simbolismo de pertenencia y restricción.',
    tags: ['power-exchange', 'structure', 'service-orientation', 'ownership-symbolism', 'physical-restraint', 'sensory-restriction'],
  },
  {
    id: 'visibility',
    en: 'Visibility & social context',
    es: 'Exposición y contexto social',
    descriptionEn: 'Being seen or watching, recording, groups and consensual non-monogamous settings.',
    descriptionEs: 'Ser visto u observar, grabación, grupos y contextos de no monogamia consensuada.',
    tags: ['visibility', 'voyeuristic-focus', 'exhibitionistic-focus', 'recording-media', 'group-social', 'non-monogamy'],
  },
  {
    id: 'body-focus',
    en: 'Body & erotic focus',
    es: 'Cuerpo y foco erótico',
    descriptionEn: 'Aesthetic presentation and focused interest in anatomy, orgasm or sexual fluids.',
    descriptionEs: 'Presentación estética e interés focalizado en anatomía, orgasmo o fluidos sexuales.',
    tags: ['aesthetic-presentation', 'anatomy-focus', 'orgasm-focus', 'fluid-focus', 'transgression'],
  },
] as const;

const PREFERENCE_AFFINITY: Readonly<Record<Preference, number>> = {
  favorite: 1,
  like: 0.78,
  depends: 0.38,
  curious: 0.5,
  'not-interested': 0,
  boundary: 0,
};

/**
 * Builds orientative semantic tendencies from saved answers. Each practice contributes at most
 * once per tag: scoped/role variants are averaged first so practices with more answer variants do
 * not dominate the chart. Negative answers add evidence but never imply attraction to an opposite
 * trait.
 */
export function buildSemanticInsights(
  profile: Pick<Profile, 'answers'> | undefined,
  tagDefinitions: readonly CatalogueInsightTagDefinition[],
  practiceInsights: readonly PracticeInsightSignals[],
): readonly SemanticInsightEntry[] {
  const answersByPractice = new Map<string, number[]>();
  for (const answer of Object.values(profile?.answers ?? {})) {
    const values = answersByPractice.get(answer.practiceId) ?? [];
    values.push(PREFERENCE_AFFINITY[answer.preference]);
    answersByPractice.set(answer.practiceId, values);
  }

  const practiceAffinity = new Map<string, number>();
  for (const [practiceId, values] of answersByPractice) {
    practiceAffinity.set(practiceId, values.reduce((sum, value) => sum + value, 0) / values.length);
  }

  const definitionById = new Map(tagDefinitions.map((tag) => [tag.id, tag]));
  const aggregate = new Map<CatalogueInsightTagId, { weightedScore: number; weight: number; evidence: Set<string> }>();

  for (const entry of practiceInsights) {
    const affinity = practiceAffinity.get(entry.practiceId);
    if (affinity === undefined) continue;

    for (const [rawTagId, strength] of Object.entries(entry.signals)) {
      if (!strength) continue;
      const tagId = rawTagId as CatalogueInsightTagId;
      const current = aggregate.get(tagId) ?? { weightedScore: 0, weight: 0, evidence: new Set<string>() };
      current.weightedScore += affinity * strength;
      current.weight += strength;
      current.evidence.add(entry.practiceId);
      aggregate.set(tagId, current);
    }
  }

  return [...aggregate.entries()]
    .flatMap(([tagId, value]): SemanticInsightEntry[] => {
      const tag = definitionById.get(tagId);
      if (!tag || value.weight <= 0) return [];
      return [{
        tag,
        score: Math.round((value.weightedScore / value.weight) * 100),
        evidenceCount: value.evidence.size,
        weightedEvidence: value.weight,
      }];
    })
    .sort((left, right) =>
      semanticRank(right) - semanticRank(left)
      || right.score - left.score
      || right.evidenceCount - left.evidenceCount
      || left.tag.id.localeCompare(right.tag.id),
    );
}

export function buildSemanticThemes(
  insights: readonly SemanticInsightEntry[],
  themes: readonly SemanticThemeDefinition[] = DASHBOARD_SEMANTIC_THEMES,
): readonly SemanticThemeEntry[] {
  const byTag = new Map(insights.map((entry) => [entry.tag.id, entry]));

  return themes.map((theme) => {
    const entries = theme.tags.flatMap((tagId) => {
      const entry = byTag.get(tagId);
      return entry ? [entry] : [];
    });
    const weight = entries.reduce((sum, entry) => sum + entry.weightedEvidence, 0);
    const score = weight === 0
      ? 0
      : Math.round(entries.reduce((sum, entry) => sum + entry.score * entry.weightedEvidence, 0) / weight);
    return {
      theme,
      score,
      evidenceCount: entries.reduce((sum, entry) => sum + entry.evidenceCount, 0),
    };
  });
}

export function strongestSemanticInsights(
  insights: readonly SemanticInsightEntry[],
  limit = 8,
): readonly SemanticInsightEntry[] {
  const withEvidence = insights.filter((entry) => entry.evidenceCount >= 2);
  return (withEvidence.length > 0 ? withEvidence : insights).slice(0, limit);
}

function semanticRank(entry: SemanticInsightEntry): number {
  // Four distinct tagged practices are enough for full ranking confidence. This affects ordering
  // only; the displayed score itself remains the weighted affinity of the available answers.
  return entry.score * Math.min(1, entry.evidenceCount / 4);
}
