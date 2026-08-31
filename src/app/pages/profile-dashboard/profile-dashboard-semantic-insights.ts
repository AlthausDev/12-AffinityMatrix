import { CatalogueInsightTagDefinition, CatalogueInsightTagId, PracticeInsightSignals } from '../../../domain/catalogue/catalogue-insight';
import { Profile } from '../../../domain/profile/profile';
import { preferenceAffinity } from './profile-preference-affinity';

export interface SemanticInsightEntry {
  readonly tag: CatalogueInsightTagDefinition;
  readonly score: number;
  readonly evidenceCount: number;
  readonly evidencePracticeIds: readonly string[];
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

export interface SemanticAxisDefinition {
  readonly lowEn: string;
  readonly lowEs: string;
  readonly highEn: string;
  readonly highEs: string;
  readonly lowTags: readonly CatalogueInsightTagId[];
  readonly highTags: readonly CatalogueInsightTagId[];
}

export interface SemanticCoordinateMapDefinition {
  readonly id: string;
  readonly en: string;
  readonly es: string;
  readonly descriptionEn: string;
  readonly descriptionEs: string;
  readonly x: SemanticAxisDefinition;
  readonly y: SemanticAxisDefinition;
}

export interface SemanticCoordinateMapEntry {
  readonly map: SemanticCoordinateMapDefinition;
  /** Relative balance from -100 (low family) to +100 (high family). */
  readonly x: number;
  /** Relative balance from -100 (low family) to +100 (high family). */
  readonly y: number;
  readonly evidenceCount: number;
}

/**
 * User-facing dimensions are intentionally more granular than the first dashboard pass. Every
 * reusable Catalogue V3 tag belongs to exactly one dimension, while the raw tags remain available
 * as highlighted signals and for the coordinate maps below.
 */
export const DASHBOARD_SEMANTIC_THEMES: readonly SemanticThemeDefinition[] = [
  {
    id: 'connection',
    en: 'Connection & affection',
    es: 'Conexión y afecto',
    descriptionEn: 'Emotional closeness, tenderness, romance and reciprocal interaction.',
    descriptionEs: 'Cercanía emocional, ternura, romanticismo e interacción recíproca.',
    tags: ['connection', 'tenderness', 'romance', 'reciprocity'],
  },
  {
    id: 'sensuality',
    en: 'Sensuality & pace',
    es: 'Sensualidad y ritmo',
    descriptionEn: 'Sensory enjoyment and preferences around slower or faster pacing.',
    descriptionEs: 'Disfrute sensorial y preferencias alrededor de ritmos más lentos o rápidos.',
    tags: ['sensuality', 'slow-pace', 'fast-pace'],
  },
  {
    id: 'play',
    en: 'Play & spontaneity',
    es: 'Juego y espontaneidad',
    descriptionEn: 'Playful interaction, teasing, lightness and unplanned experiences.',
    descriptionEs: 'Interacción juguetona, provocación, ligereza y experiencias no planificadas.',
    tags: ['playfulness', 'spontaneity'],
  },
  {
    id: 'exploration',
    en: 'Exploration & fantasy',
    es: 'Exploración y fantasía',
    descriptionEn: 'Novelty, imagination, role immersion, anonymity and transgressive framing.',
    descriptionEs: 'Novedad, imaginación, inmersión en roles, anonimato y marcos transgresores.',
    tags: ['exploration', 'fantasy-imagination', 'role-immersion', 'anonymity', 'transgression'],
  },
  {
    id: 'intensity',
    en: 'Intensity & physicality',
    es: 'Intensidad y fisicalidad',
    descriptionEn: 'Energetic body involvement, stronger sensation and higher-risk themes.',
    descriptionEs: 'Implicación corporal enérgica, sensaciones fuertes y temas de mayor riesgo.',
    tags: ['intensity', 'physicality', 'pain-sensation', 'edge-risk'],
  },
  {
    id: 'power',
    en: 'Power & service',
    es: 'Poder y servicio',
    descriptionEn: 'Power exchange, explicit structure, service and ownership symbolism.',
    descriptionEs: 'Intercambio de poder, estructura explícita, servicio y simbología de pertenencia.',
    tags: ['power-exchange', 'structure', 'service-orientation', 'ownership-symbolism'],
  },
  {
    id: 'restraint',
    en: 'Restraint & restriction',
    es: 'Restricción y limitación',
    descriptionEn: 'Physical restraint and deliberate reduction of sensory access.',
    descriptionEs: 'Restricción física y reducción deliberada del acceso sensorial.',
    tags: ['physical-restraint', 'sensory-restriction'],
  },
  {
    id: 'visibility',
    en: 'Visibility & media',
    es: 'Exposición y contenido',
    descriptionEn: 'Being seen or watching, exhibitionism, voyeurism and erotic recording.',
    descriptionEs: 'Ser visto u observar, exhibicionismo, voyeurismo y grabación erótica.',
    tags: ['visibility', 'voyeuristic-focus', 'exhibitionistic-focus', 'recording-media'],
  },
  {
    id: 'social',
    en: 'Social & non-monogamous context',
    es: 'Contexto social y no monógamo',
    descriptionEn: 'Group participation and consensual non-monogamous settings.',
    descriptionEs: 'Participación grupal y contextos de no monogamia consensuada.',
    tags: ['group-social', 'non-monogamy'],
  },
  {
    id: 'body-focus',
    en: 'Body & erotic focus',
    es: 'Cuerpo y foco erótico',
    descriptionEn: 'Aesthetic presentation and focused interest in anatomy, orgasm or bodily fluids.',
    descriptionEs: 'Presentación estética e interés focalizado en anatomía, orgasmo o fluidos corporales.',
    tags: ['aesthetic-presentation', 'anatomy-focus', 'orgasm-focus', 'fluid-focus'],
  },
] as const;

/**
 * Coordinate maps compare positive evidence between signal families. They deliberately do not
 * define literal opposites: a low score on one family never creates affinity for the other side.
 */
export const DASHBOARD_SEMANTIC_COORDINATE_MAPS: readonly SemanticCoordinateMapDefinition[] = [
  {
    id: 'style',
    en: 'Experience style',
    es: 'Estilo de experiencia',
    descriptionEn: 'Places the strongest answered signals between relational/sensual and exploratory/intense families.',
    descriptionEs: 'Sitúa las señales respondidas entre familias relacionales/sensuales y exploratorias/intensas.',
    x: {
      lowEn: 'Connection',
      lowEs: 'Conexión',
      highEn: 'Exploration',
      highEs: 'Exploración',
      lowTags: ['connection', 'tenderness', 'romance', 'reciprocity'],
      highTags: ['exploration', 'spontaneity', 'playfulness', 'fantasy-imagination', 'role-immersion', 'anonymity', 'transgression'],
    },
    y: {
      lowEn: 'Sensual / slow',
      lowEs: 'Sensual / pausado',
      highEn: 'Intense / physical',
      highEs: 'Intenso / físico',
      lowTags: ['sensuality', 'slow-pace', 'tenderness'],
      highTags: ['intensity', 'fast-pace', 'physicality', 'pain-sensation', 'edge-risk'],
    },
  },
  {
    id: 'dynamic',
    en: 'Dynamic & context',
    es: 'Dinámica y contexto',
    descriptionEn: 'Compares reciprocal/playful signals with structured power, and body-focused signals with visible/social ones.',
    descriptionEs: 'Compara señales recíprocas/juguetonas con poder estructurado, y focos corporales con exposición/contexto social.',
    x: {
      lowEn: 'Reciprocal / playful',
      lowEs: 'Recíproco / juguetón',
      highEn: 'Power / structure',
      highEs: 'Poder / estructura',
      lowTags: ['reciprocity', 'connection', 'playfulness'],
      highTags: ['power-exchange', 'structure', 'service-orientation', 'ownership-symbolism', 'physical-restraint', 'sensory-restriction'],
    },
    y: {
      lowEn: 'Body focus',
      lowEs: 'Foco corporal',
      highEn: 'Visible / social',
      highEs: 'Visible / social',
      lowTags: ['sensuality', 'aesthetic-presentation', 'anatomy-focus', 'orgasm-focus', 'fluid-focus'],
      highTags: ['visibility', 'voyeuristic-focus', 'exhibitionistic-focus', 'recording-media', 'group-social', 'non-monogamy'],
    },
  },
] as const;

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
    values.push(preferenceAffinity(answer.preference));
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
      const evidencePracticeIds = [...value.evidence].sort();
      return [{
        tag,
        score: Math.round((value.weightedScore / value.weight) * 100),
        evidenceCount: evidencePracticeIds.length,
        evidencePracticeIds,
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
    const evidence = new Set(entries.flatMap((entry) => entry.evidencePracticeIds));
    return {
      theme,
      score,
      evidenceCount: evidence.size,
    };
  });
}

export function buildSemanticCoordinateMaps(
  insights: readonly SemanticInsightEntry[],
  maps: readonly SemanticCoordinateMapDefinition[] = DASHBOARD_SEMANTIC_COORDINATE_MAPS,
): readonly SemanticCoordinateMapEntry[] {
  const byTag = new Map(insights.map((entry) => [entry.tag.id, entry]));

  return maps.map((map) => {
    const x = axisBalance(map.x, byTag);
    const y = axisBalance(map.y, byTag);
    return {
      map,
      x: x.balance,
      y: y.balance,
      evidenceCount: new Set([...x.evidencePracticeIds, ...y.evidencePracticeIds]).size,
    };
  });
}

export function strongestSemanticInsights(
  insights: readonly SemanticInsightEntry[],
  limit = 10,
): readonly SemanticInsightEntry[] {
  const positive = insights.filter((entry) => entry.score > 0);
  const withEvidence = positive.filter((entry) => entry.evidenceCount >= 2);
  return (withEvidence.length > 0 ? withEvidence : positive).slice(0, limit);
}

function axisBalance(
  axis: SemanticAxisDefinition,
  byTag: ReadonlyMap<CatalogueInsightTagId, SemanticInsightEntry>,
): { readonly balance: number; readonly evidencePracticeIds: readonly string[] } {
  const low = familyScore(axis.lowTags, byTag);
  const high = familyScore(axis.highTags, byTag);
  const total = low.score + high.score;
  const balance = total <= 0 ? 0 : Math.round(((high.score - low.score) / total) * 100);
  return {
    balance: Math.max(-100, Math.min(100, balance)),
    evidencePracticeIds: [...new Set([...low.evidencePracticeIds, ...high.evidencePracticeIds])],
  };
}

function familyScore(
  tagIds: readonly CatalogueInsightTagId[],
  byTag: ReadonlyMap<CatalogueInsightTagId, SemanticInsightEntry>,
): { readonly score: number; readonly evidencePracticeIds: readonly string[] } {
  const entries = tagIds.flatMap((tagId) => {
    const entry = byTag.get(tagId);
    return entry ? [entry] : [];
  });
  const weight = entries.reduce((sum, entry) => sum + entry.weightedEvidence, 0);
  return {
    score: weight <= 0
      ? 0
      : entries.reduce((sum, entry) => sum + entry.score * entry.weightedEvidence, 0) / weight,
    evidencePracticeIds: [...new Set(entries.flatMap((entry) => entry.evidencePracticeIds))],
  };
}

function semanticRank(entry: SemanticInsightEntry): number {
  // Four distinct tagged practices are enough for full ranking confidence. This affects ordering
  // only; the displayed score itself remains the weighted affinity of the available answers.
  return entry.score * Math.min(1, entry.evidenceCount / 4);
}
