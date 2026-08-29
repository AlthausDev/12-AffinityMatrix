import { QuestionnaireService } from '../../application/questionnaire/questionnaire-service';
import { createProfile } from '../../domain/profile/profile';
import { ORIENTATION_VALUES, SEX_VALUES } from '../../domain/profile/profile-metadata';
import { CURRENT_CATALOGUE_SNAPSHOT } from './catalogue-v3';

const MIN_VISIBLE_QUESTIONS_PER_CATEGORY = 30;

describe('Catalogue V3 category depth floor', () => {
  it('keeps every category substantial for every fully specified profile', () => {
    const questionnaire = new QuestionnaireService();
    const shortages: string[] = [];

    for (const sex of SEX_VALUES) {
      for (const orientation of ORIENTATION_VALUES) {
        const profile = createProfile({
          id: `depth-${sex}-${orientation}`,
          now: '2026-08-29T00:00:00.000Z',
          metadata: { sex, orientation },
        });

        for (const summary of questionnaire.getCategorySummaries(CURRENT_CATALOGUE_SNAPSHOT, profile)) {
          if (summary.total < MIN_VISIBLE_QUESTIONS_PER_CATEGORY) {
            shortages.push(`${sex}/${orientation} · ${summary.category.id}: ${summary.total}`);
          }
        }
      }
    }

    expect(shortages, `Categories below ${MIN_VISIBLE_QUESTIONS_PER_CATEGORY} visible questions:\n${shortages.join('\n')}`)
      .toEqual([]);
  });
});
