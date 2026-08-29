import { PracticeInsightSignals } from '../../../domain/catalogue/catalogue-insight';
import {
  QUESTIONNAIRE_FOLLOWUP_CHASTITY_ID,
  QUESTIONNAIRE_FOLLOWUP_POSITION_IDS,
} from './content/final-questionnaire-followup';

const ADDITIONS: readonly PracticeInsightSignals[] = [
  {
    practiceId: QUESTIONNAIRE_FOLLOWUP_POSITION_IDS[0],
    signals: { sensuality: 0.75, physicality: 0.25, reciprocity: 0.5 },
  },
  {
    practiceId: QUESTIONNAIRE_FOLLOWUP_POSITION_IDS[1],
    signals: { physicality: 0.75, intensity: 0.5, exploration: 0.25 },
  },
  {
    practiceId: QUESTIONNAIRE_FOLLOWUP_POSITION_IDS[2],
    signals: { physicality: 0.75, intensity: 0.75, sensuality: 0.25 },
  },
  {
    practiceId: QUESTIONNAIRE_FOLLOWUP_POSITION_IDS[3],
    signals: { physicality: 1, intensity: 0.75, exploration: 0.75 },
  },
  {
    practiceId: QUESTIONNAIRE_FOLLOWUP_CHASTITY_ID,
    signals: { 'power-exchange': 1, structure: 0.75, 'physical-restraint': 0.5, anticipation: 0.75 },
  },
] as const;

/** Semantic additions matching the final questionnaire follow-up practices. */
export function applyCatalogueInsightQuestionnaireFollowup(
  insights: readonly PracticeInsightSignals[],
): readonly PracticeInsightSignals[] {
  const existingIds = new Set(insights.map((entry) => entry.practiceId));
  return [...insights, ...ADDITIONS.filter((entry) => !existingIds.has(entry.practiceId))];
}
