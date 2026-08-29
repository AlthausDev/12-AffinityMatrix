import { QuestionnaireService } from '../../application/questionnaire/questionnaire-service';
import { createProfile } from '../../domain/profile/profile';
import { ORIENTATION_VALUES, SEX_VALUES } from '../../domain/profile/profile-metadata';
import { CURRENT_CATALOGUE_SNAPSHOT } from './catalogue-v3';

const MIN_VISIBLE_QUESTIONS_PER_CATEGORY = 30;

describe('Catalogue V3 category depth floor', () => {
  it('keeps every category substantial for every fully specified profile', () => {
    const questionnaire = new QuestionnaireService();

    for (const sex of SEX_VALUES) {
      for (const orientation of ORIENTATION_VALUES) {
        const profile = createProfile({
          id: `depth-${sex}-${orientation}`,
          now: '2026-08-29T00:00:00.000Z',
          metadata: { sex, orientation },
        });

        for (const summary of questionnaire.getCategorySummaries(CURRENT_CATALOGUE_SNAPSHOT, profile)) {
          expect(
            summary.total,
            `${sex}/${orientation} · ${summary.category.id} exposes only ${summary.total} visible questions`,
          ).toBeGreaterThanOrEqual(MIN_VISIBLE_QUESTIONS_PER_CATEGORY);
        }
      }
    }
  });
});
