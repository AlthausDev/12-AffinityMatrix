import { PracticeInsightSignals } from '../../../domain/catalogue/catalogue-insight';

const REMOVED_IDS = new Set(['energetic-sex']);

const ADDITIONS: readonly PracticeInsightSignals[] = [
  {
    practiceId: 'oral-kneeling-standing-position',
    signals: { physicality: 0.75, 'anatomy-focus': 0.5, exploration: 0.25 },
  },
  {
    practiceId: 'oral-lying-between-legs-position',
    signals: { physicality: 0.5, sensuality: 0.5, 'anatomy-focus': 0.5 },
  },
  {
    practiceId: 'oral-side-lying-position',
    signals: { sensuality: 0.75, physicality: 0.25, 'anatomy-focus': 0.5 },
  },
  {
    practiceId: 'oral-edge-position',
    signals: { physicality: 0.5, exploration: 0.5, 'anatomy-focus': 0.5 },
  },
  {
    practiceId: 'sexual-fluids-in-food-drink',
    signals: { transgression: 0.75, exploration: 0.75, sensuality: 0.25 },
  },
] as const;

/** Final semantic projection after the last manual release walkthrough. */
export function applyCatalogueInsightNoiseCleanup(
  insights: readonly PracticeInsightSignals[],
): readonly PracticeInsightSignals[] {
  const retained = insights.filter((entry) => !REMOVED_IDS.has(entry.practiceId));
  const existingIds = new Set(retained.map((entry) => entry.practiceId));
  return [
    ...retained,
    ...ADDITIONS.filter((entry) => !existingIds.has(entry.practiceId)),
  ];
}
