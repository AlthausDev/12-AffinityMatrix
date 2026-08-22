import { QuestionnaireService } from '../../application/questionnaire/questionnaire-service';
import { catalogueSnapshotValidator } from '../../domain/catalogue/catalogue-snapshot';
import { CATALOGUE_VERSION_V3, CURRENT_CATALOGUE_VERSION } from '../../domain/catalogue/catalogue-version';
import { createProfile } from '../../domain/profile/profile';
import { CURRENT_CATALOGUE_SNAPSHOT } from './catalogue-v3';

const questionnaire = new QuestionnaireService();

describe('catalogue v3 snapshot', () => {
  it('is the validated current catalogue with broad coverage and deterministic soft-to-edge ordering', () => {
    const { categories, practices } = CURRENT_CATALOGUE_SNAPSHOT.catalogue;

    expect(CURRENT_CATALOGUE_VERSION).toBe(CATALOGUE_VERSION_V3);
    expect(CURRENT_CATALOGUE_SNAPSHOT.version).toBe(CATALOGUE_VERSION_V3);
    expect(catalogueSnapshotValidator.validate(CURRENT_CATALOGUE_SNAPSHOT)).toEqual([]);
    expect(categories).toHaveLength(17);
    expect(categories.map((category) => category.order)).toEqual([...Array(17).keys()]);
    expect(categories[0]?.id).toBe('affection-intimacy');
    expect(categories.at(-1)?.id).toBe('edge');
    expect(practices.length).toBeGreaterThanOrEqual(400);

    for (const category of categories) {
      const categoryPracticeCount = practices.filter((practice) => practice.categoryId === category.id).length;
      expect(categoryPracticeCount, `${category.id} should remain meaningfully populated`).toBeGreaterThanOrEqual(10);
    }
  });

  it('models dildo use as solo, partner-directed, and partner-on-self roles with explicit target sites', () => {
    const dildo = CURRENT_CATALOGUE_SNAPSHOT.catalogue.practices.find((practice) => practice.id === 'dildo');

    expect(dildo?.roles.map((role) => role.id)).toEqual([
      'use-on-self',
      'use-on-partner',
      'partner-uses-on-me',
    ]);
    expect(dildo?.roles.find((role) => role.id === 'use-on-self')?.contextAxes).toEqual(['targetSite']);
    expect(dildo?.roles.find((role) => role.id === 'use-on-partner')?.contextAxes)
      .toEqual(['counterpartSex', 'targetSite']);
    expect(dildo?.roles.every((role) =>
      role.contextValues?.targetSite?.join(',') === 'mouth,vaginal,anal',
    )).toBe(true);
    expect(dildo?.compatibleRolePairs).toEqual([
      { leftRoleId: 'use-on-self', rightRoleId: 'use-on-self' },
      { leftRoleId: 'use-on-partner', rightRoleId: 'partner-uses-on-me' },
    ]);
  });

  it('filters anatomically impossible toy target sites without removing valid variants', () => {
    const woman = createProfile({
      id: 'woman',
      now: '2026-08-22T16:00:00.000Z',
      metadata: { sex: 'female', orientation: 'bisexual' },
    });
    const man = createProfile({
      id: 'man',
      now: '2026-08-22T16:00:00.000Z',
      metadata: { sex: 'male', orientation: 'bisexual' },
    });

    const womanDildo = questionnaire
      .getCategory(CURRENT_CATALOGUE_SNAPSHOT, woman, 'toys')
      ?.practices.find((item) => item.practice.id === 'dildo');
    const manDildo = questionnaire
      .getCategory(CURRENT_CATALOGUE_SNAPSHOT, man, 'toys')
      ?.practices.find((item) => item.practice.id === 'dildo');

    const womanSelfSites = womanDildo?.roles
      .filter((item) => item.role.id === 'use-on-self')
      .map((item) => item.scope?.targetSite);
    const manSelfSites = manDildo?.roles
      .filter((item) => item.role.id === 'use-on-self')
      .map((item) => item.scope?.targetSite);

    expect(womanSelfSites).toEqual(['mouth', 'vaginal', 'anal']);
    expect(manSelfSites).toEqual(['mouth', 'anal']);

    const womanUsingOnMalePartner = womanDildo?.roles.filter(
      (item) => item.role.id === 'use-on-partner' && item.scope?.counterpartSex === 'male',
    );
    const womanUsingOnFemalePartner = womanDildo?.roles.filter(
      (item) => item.role.id === 'use-on-partner' && item.scope?.counterpartSex === 'female',
    );

    expect(womanUsingOnMalePartner?.map((item) => item.scope?.targetSite)).toEqual(['mouth', 'anal']);
    expect(womanUsingOnFemalePartner?.map((item) => item.scope?.targetSite)).toEqual(['mouth', 'vaginal', 'anal']);
  });

  it('can exclude hidden categories from visible progress and navigation without removing the catalogue', () => {
    const profile = createProfile({
      id: 'profile',
      now: '2026-08-22T16:00:00.000Z',
      metadata: { sex: 'female', orientation: 'bisexual' },
    });

    const summaries = questionnaire.getCategorySummaries(
      CURRENT_CATALOGUE_SNAPSHOT,
      profile,
      false,
      ['fluids', 'edge'],
    );

    expect(summaries).toHaveLength(15);
    expect(summaries.some((summary) => summary.category.id === 'fluids')).toBe(false);
    expect(summaries.some((summary) => summary.category.id === 'edge')).toBe(false);
    expect(CURRENT_CATALOGUE_SNAPSHOT.catalogue.categories.some((category) => category.id === 'edge')).toBe(true);

    expect(questionnaire.getNeighbours(CURRENT_CATALOGUE_SNAPSHOT, 'sensation', ['fluids']))
      .toEqual({ previousCategoryId: 'psychological', nextCategoryId: 'edge' });
  });
});
