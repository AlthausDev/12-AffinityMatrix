import { QuestionnaireService } from '../../application/questionnaire/questionnaire-service';
import { createProfile } from '../../domain/profile/profile';
import { CURRENT_CATALOGUE_SNAPSHOT } from './catalogue-v3';

const MIN_VISIBLE_QUESTIONS_PER_CATEGORY = 30;

describe('Catalogue V3 category depth floor', () => {
  it('keeps every complete catalogue category at or above the release depth floor', () => {
    const questionnaire = new QuestionnaireService();
    const profile = createProfile({
      id: 'depth-full-catalogue',
      now: '2026-08-29T00:00:00.000Z',
    });
    const shortages = questionnaire
      .getCategorySummaries(CURRENT_CATALOGUE_SNAPSHOT, profile, true)
      .filter((summary) => summary.total < MIN_VISIBLE_QUESTIONS_PER_CATEGORY)
      .map((summary) => `${summary.category.id}: ${summary.total}`);

    expect(shortages, `Categories below ${MIN_VISIBLE_QUESTIONS_PER_CATEGORY} questions:\n${shortages.join('\n')}`)
      .toEqual([]);
  });
});
