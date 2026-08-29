import { PracticeInsightSignals } from '../../../domain/catalogue/catalogue-insight';

const RELEASE_AUDIT_NEW_PRACTICE_INSIGHTS: readonly PracticeInsightSignals[] = [
  {
    practiceId: 'vaginal-torture',
    signals: { 'anatomy-focus': 1, 'pain-sensation': 1, 'edge-risk': 0.75, intensity: 0.75 },
  },
  {
    practiceId: 'urethral-torture',
    signals: { 'anatomy-focus': 1, 'pain-sensation': 1, 'edge-risk': 1, intensity: 0.75 },
  },
  {
    practiceId: 'erotic-feeding',
    signals: { sensuality: 0.75, connection: 0.5, playfulness: 0.5, exploration: 0.25 },
  },
  {
    practiceId: 'food-from-body',
    signals: { sensuality: 0.75, playfulness: 0.5, exploration: 0.5, physicality: 0.25 },
  },
  {
    practiceId: 'food-vaginal-penetration',
    signals: { 'anatomy-focus': 1, exploration: 0.75, physicality: 0.75, transgression: 0.5 },
  },
  {
    practiceId: 'food-anal-penetration',
    signals: { 'anatomy-focus': 0.75, exploration: 0.75, physicality: 0.75, transgression: 0.5 },
  },
  {
    practiceId: 'everyday-object-play',
    signals: { exploration: 1, playfulness: 0.5, physicality: 0.5 },
  },
  {
    practiceId: 'everyday-object-vaginal-penetration',
    signals: { 'anatomy-focus': 1, exploration: 0.75, physicality: 0.75, transgression: 0.5 },
  },
  {
    practiceId: 'everyday-object-anal-penetration',
    signals: { 'anatomy-focus': 0.75, exploration: 0.75, physicality: 0.75, transgression: 0.5 },
  },
] as const;

export function applyCatalogueInsightReleaseAudit(
  insights: readonly PracticeInsightSignals[],
): readonly PracticeInsightSignals[] {
  const existingIds = new Set(insights.map((entry) => entry.practiceId));
  return [
    ...insights,
    ...RELEASE_AUDIT_NEW_PRACTICE_INSIGHTS.filter((entry) => !existingIds.has(entry.practiceId)),
  ];
}
