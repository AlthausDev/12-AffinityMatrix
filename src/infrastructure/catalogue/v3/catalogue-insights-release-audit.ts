import { PracticeInsightSignals } from '../../../domain/catalogue/catalogue-insight';

const RELEASE_AUDIT_NEW_PRACTICE_INSIGHTS: readonly PracticeInsightSignals[] = [
  { practiceId: 'spontaneous-sex', signals: { spontaneity: 1, exploration: 0.25 } },
  { practiceId: 'planned-sex', signals: { structure: 1, connection: 0.25 } },
  { practiceId: 'quiet-sex', signals: { sensuality: 0.5, structure: 0.25 } },
  { practiceId: 'vocal-expressive-sex', signals: { intensity: 0.5, connection: 0.5 } },
  { practiceId: 'immersive-focused-sex', signals: { connection: 0.75, sensuality: 0.5 } },
  { practiceId: 'energetic-sex', signals: { physicality: 0.75, intensity: 0.5 } },

  { practiceId: 'orgasm-on-command', signals: { 'orgasm-focus': 1, 'power-exchange': 0.75, structure: 0.75 } },
  { practiceId: 'orgasm-permission', signals: { 'orgasm-focus': 1, 'power-exchange': 1, structure: 0.75 } },
  { practiceId: 'orgasm-count-control', signals: { 'orgasm-focus': 1, structure: 1, 'power-exchange': 0.5 } },

  { practiceId: 'group-oral-focus', signals: { 'group-social': 1, physicality: 0.5, 'anatomy-focus': 0.25 } },
  { practiceId: 'group-worship-focus', signals: { 'group-social': 1, 'power-exchange': 0.5, physicality: 0.25 } },
  { practiceId: 'group-masturbation-circle', signals: { 'group-social': 1, reciprocity: 0.5, visibility: 0.25 } },
  { practiceId: 'group-shared-toy-play', signals: { 'group-social': 1, exploration: 0.75, playfulness: 0.5 } },

  { practiceId: 'sex-private-pool-hot-tub', signals: { sensuality: 0.75, exploration: 0.5 } },
  { practiceId: 'sex-on-boat-private', signals: { exploration: 1, spontaneity: 0.5 } },
  { practiceId: 'sex-on-rooftop-private', signals: { exploration: 0.75, visibility: 0.25, transgression: 0.25 } },
  { practiceId: 'sex-on-private-balcony', signals: { visibility: 0.5, sensuality: 0.5, transgression: 0.25 } },
  { practiceId: 'sex-in-camper-rv', signals: { exploration: 0.75, spontaneity: 0.5 } },
  { practiceId: 'sex-in-train-private-cabin', signals: { exploration: 1, transgression: 0.25 } },
  { practiceId: 'sex-in-changing-room-controlled', signals: { transgression: 0.75, exploration: 0.5, visibility: 0.25 } },
  { practiceId: 'sex-in-elevator-after-hours', signals: { transgression: 0.75, spontaneity: 0.5, exploration: 0.5 } },
  { practiceId: 'sex-in-studio-warehouse', signals: { exploration: 0.75, 'fantasy-imagination': 0.25 } },
  { practiceId: 'sex-in-secluded-forest', signals: { exploration: 1, sensuality: 0.5 } },
  { practiceId: 'sex-at-secluded-viewpoint', signals: { exploration: 1, sensuality: 0.5, visibility: 0.25 } },
  { practiceId: 'sex-in-private-sauna-spa', signals: { sensuality: 1, exploration: 0.5 } },

  { practiceId: 'oral-service', signals: { 'service-orientation': 1, 'power-exchange': 0.5, physicality: 0.5 } },
  { practiceId: 'manual-pleasure-service', signals: { 'service-orientation': 1, 'power-exchange': 0.5, physicality: 0.5 } },
  { practiceId: 'orgasm-service', signals: { 'service-orientation': 1, 'orgasm-focus': 0.75, 'power-exchange': 0.5 } },
  { practiceId: 'intimate-grooming-service', signals: { 'service-orientation': 1, sensuality: 0.5, structure: 0.25 } },
  { practiceId: 'fetish-scent-service', signals: { 'service-orientation': 1, 'anatomy-focus': 0.5, transgression: 0.25 } },
  { practiceId: 'toilet-service-fantasy', signals: { 'service-orientation': 1, transgression: 1, 'power-exchange': 0.75, 'fantasy-imagination': 0.5 } },

  { practiceId: 'clone-duplication-fantasy', signals: { 'fantasy-imagination': 1, exploration: 0.75 } },
  { practiceId: 'possession-fantasy', signals: { 'fantasy-imagination': 1, 'power-exchange': 0.75, 'role-immersion': 0.5 } },
  { practiceId: 'slime-creature-fantasy', signals: { 'fantasy-imagination': 1, exploration: 0.75, physicality: 0.5 } },
  { practiceId: 'oviposition-fantasy', signals: { 'fantasy-imagination': 1, transgression: 0.75, 'anatomy-focus': 0.5 } },
  { practiceId: 'object-transformation-fantasy', signals: { 'fantasy-imagination': 1, 'role-immersion': 0.75, transgression: 0.5 } },
  { practiceId: 'living-symbiote-fantasy', signals: { 'fantasy-imagination': 1, exploration: 0.75, physicality: 0.5 } },

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
