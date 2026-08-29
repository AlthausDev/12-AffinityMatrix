import { QuestionnaireService } from '../../application/questionnaire/questionnaire-service';
import { createProfile } from '../../domain/profile/profile';
import { CURRENT_CATALOGUE_SNAPSHOT } from './catalogue-v3';

const MIN_VISIBLE_VARIANTS_PER_CATEGORY = 30;

describe('Catalogue V3 category depth floor', () => {
  it('keeps every complete catalogue category at or above the release variant-depth floor', () => {
    const questionnaire = new QuestionnaireService();
    const profile = createProfile({
      id: 'depth-full-catalogue',
      now: '2026-08-29T00:00:00.000Z',
    });
    const shortages = CURRENT_CATALOGUE_SNAPSHOT.catalogue.categories
      .map((category) => {
        const view = questionnaire.getCategory(CURRENT_CATALOGUE_SNAPSHOT, profile, category.id, true);
        const variantCount = view?.practices.reduce((sum, practice) => sum + practice.roles.length, 0) ?? 0;
        return { categoryId: category.id, variantCount };
      })
      .filter(({ variantCount }) => variantCount < MIN_VISIBLE_VARIANTS_PER_CATEGORY)
      .map(({ categoryId, variantCount }) => `${categoryId}: ${variantCount}`);

    expect(
      shortages,
      `Categories below ${MIN_VISIBLE_VARIANTS_PER_CATEGORY} answer variants:\n${shortages.join('\n')}`,
    ).toEqual([]);
  });
});
