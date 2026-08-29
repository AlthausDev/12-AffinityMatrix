import { PracticeInsightSignals } from '../../../domain/catalogue/catalogue-insight';
import { CLOSING_PASS_RETIRED_PRACTICE_IDS } from './content/catalogue-closing-pass';

const CLOSING_PASS_NEW_PRACTICE_INSIGHTS: readonly PracticeInsightSignals[] = [
  { practiceId: 'erotic-compersion', signals: { 'non-monogamy': 1, connection: 0.75, exploration: 0.25 } },
  { practiceId: 'preagreed-unannounced-watching', signals: { 'voyeuristic-focus': 1, 'exhibitionistic-focus': 0.5, visibility: 0.75, structure: 0.5 } },

  { practiceId: 'sex-in-abandoned-place', signals: { exploration: 1, transgression: 0.5, 'fantasy-imagination': 0.25 } },
  { practiceId: 'sex-in-office-after-hours', signals: { transgression: 0.75, spontaneity: 0.5, exploration: 0.25 } },
  { practiceId: 'sex-on-secluded-beach', signals: { exploration: 0.75, sensuality: 0.5, visibility: 0.25 } },
  { practiceId: 'sex-while-camping', signals: { exploration: 0.75, spontaneity: 0.5, playfulness: 0.25 } },

  { practiceId: 'footwear-service', signals: { 'service-orientation': 1, 'power-exchange': 0.5, 'anatomy-focus': 0.25, 'aesthetic-presentation': 0.25 } },
  { practiceId: 'fetish-gear-service', signals: { 'service-orientation': 1, structure: 0.75, 'power-exchange': 0.5, 'role-immersion': 0.25 } },

  { practiceId: 'st-andrews-cross-restraint', signals: { 'physical-restraint': 1, 'power-exchange': 0.5, structure: 0.5 } },
  { practiceId: 'bondage-bench-restraint', signals: { 'physical-restraint': 1, structure: 0.5, 'power-exchange': 0.25 } },
  { practiceId: 'bondage-chair-restraint', signals: { 'physical-restraint': 1, structure: 0.5, 'power-exchange': 0.25 } },

  { practiceId: 'semen-cleanup-oral-external', signals: { 'fluid-focus': 1, sensuality: 0.5, transgression: 0.5, exploration: 0.25 } },
  { practiceId: 'semen-cleanup-oral-creampie', signals: { 'fluid-focus': 1, transgression: 0.75, sensuality: 0.5, exploration: 0.25 } },
] as const;

/** Applies the final content replacements while preserving the 1–4 tag contract. */
export function applyCatalogueInsightClosingPass(
  insights: readonly PracticeInsightSignals[],
): readonly PracticeInsightSignals[] {
  const active = insights.filter((entry) => !CLOSING_PASS_RETIRED_PRACTICE_IDS.has(entry.practiceId));
  const existingIds = new Set(active.map((entry) => entry.practiceId));
  return [
    ...active,
    ...CLOSING_PASS_NEW_PRACTICE_INSIGHTS.filter((entry) => !existingIds.has(entry.practiceId)),
  ];
}
