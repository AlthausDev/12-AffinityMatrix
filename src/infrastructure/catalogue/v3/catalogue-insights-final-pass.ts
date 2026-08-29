import {
  CatalogueInsightStrength,
  CatalogueInsightTagId,
  PracticeInsightSignals,
} from '../../../domain/catalogue/catalogue-insight';
import { FINAL_PASS_RETIRED_PRACTICE_IDS } from './content/catalogue-final-pass';

const DISCRIMINATOR_TAGS = new Set<CatalogueInsightTagId>([
  'anatomy-focus',
  'orgasm-focus',
  'recording-media',
  'voyeuristic-focus',
  'exhibitionistic-focus',
  'non-monogamy',
  'fluid-focus',
  'ownership-symbolism',
  'edge-risk',
]);

export const FINAL_PASS_NEW_PRACTICE_INSIGHTS: readonly PracticeInsightSignals[] = [
  {
    practiceId: 'erotic-media-exchange',
    signals: { 'recording-media': 1, reciprocity: 0.75, connection: 0.25 },
  },
  {
    practiceId: 'private-striptease',
    signals: { 'exhibitionistic-focus': 0.75, 'voyeuristic-focus': 0.5, visibility: 0.75, 'role-immersion': 0.25 },
  },
  {
    practiceId: 'watched-masturbation',
    signals: { 'voyeuristic-focus': 0.75, 'exhibitionistic-focus': 0.75, visibility: 0.75, sensuality: 0.5 },
  },
  {
    practiceId: 'attentive-service',
    signals: { 'service-orientation': 1, 'power-exchange': 0.5, structure: 0.5 },
  },
  {
    practiceId: 'pleasure-focused-service',
    signals: { 'service-orientation': 1, sensuality: 0.75, 'power-exchange': 0.5 },
  },
  {
    practiceId: 'erotic-presentation-service',
    signals: { 'service-orientation': 1, 'aesthetic-presentation': 0.75, 'power-exchange': 0.5, 'exhibitionistic-focus': 0.5 },
  },
  {
    practiceId: 'semen-cleanup-manual',
    signals: { 'fluid-focus': 1, sensuality: 0.5, exploration: 0.25 },
  },
  {
    practiceId: 'semen-cleanup-oral',
    signals: { 'fluid-focus': 1, sensuality: 0.5, transgression: 0.5, exploration: 0.25 },
  },
  {
    practiceId: 'semen-cleanup-other',
    signals: { 'fluid-focus': 1, exploration: 0.75, sensuality: 0.25 },
  },
] as const;

/**
 * The profiling layer deliberately keeps each questionnaire concept concise: every final practice
 * exposes between one and four semantic signals. Special discriminator tags are retained first,
 * then the strongest general signals fill the remaining slots. Role perspective and the user's
 * preference value remain separate inputs for future profile scoring.
 */
export function applyCatalogueInsightFinalPass(
  insights: readonly PracticeInsightSignals[],
): readonly PracticeInsightSignals[] {
  const active = insights.filter((entry) => !FINAL_PASS_RETIRED_PRACTICE_IDS.has(entry.practiceId));
  const existingIds = new Set(active.map((entry) => entry.practiceId));
  return [
    ...active,
    ...FINAL_PASS_NEW_PRACTICE_INSIGHTS.filter((entry) => !existingIds.has(entry.practiceId)),
  ].map(compactSignals);
}

function compactSignals(entry: PracticeInsightSignals): PracticeInsightSignals {
  const values = Object.entries(entry.signals)
    .filter((item): item is [CatalogueInsightTagId, CatalogueInsightStrength] => item[1] !== undefined);

  const discriminators = values
    .filter(([tag]) => DISCRIMINATOR_TAGS.has(tag))
    .sort(compareSignals)
    .slice(0, 2);
  const chosen = new Set(discriminators.map(([tag]) => tag));
  const general = values
    .filter(([tag]) => !chosen.has(tag))
    .sort(compareSignals)
    .slice(0, Math.max(0, 4 - discriminators.length));

  const signals: Partial<Record<CatalogueInsightTagId, CatalogueInsightStrength>> = {};
  for (const [tag, strength] of [...discriminators, ...general]) signals[tag] = strength;
  return { ...entry, signals };
}

function compareSignals(
  left: readonly [CatalogueInsightTagId, CatalogueInsightStrength],
  right: readonly [CatalogueInsightTagId, CatalogueInsightStrength],
): number {
  if (left[1] !== right[1]) return right[1] - left[1];
  const leftSpecial = DISCRIMINATOR_TAGS.has(left[0]) ? 1 : 0;
  const rightSpecial = DISCRIMINATOR_TAGS.has(right[0]) ? 1 : 0;
  if (leftSpecial !== rightSpecial) return rightSpecial - leftSpecial;
  return left[0].localeCompare(right[0]);
}
