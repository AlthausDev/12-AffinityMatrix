import { QuestionnaireService } from '../../application/questionnaire/questionnaire-service';
import { catalogueSnapshotValidator } from '../../domain/catalogue/catalogue-snapshot';
import { CATALOGUE_VERSION_V3, CURRENT_CATALOGUE_VERSION } from '../../domain/catalogue/catalogue-version';
import { createProfile } from '../../domain/profile/profile';
import { CURRENT_CATALOGUE_SNAPSHOT } from './catalogue-v3';
import { CATALOGUE_V3_CONTENT, RETIRED_V3_PRACTICE_IDS } from './v3/content';
import { describeCataloguePractice } from './v3/content/practice-description';

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

  it('keeps every current seed bilingual, described, and free of repeated per-entry consent wording', () => {
    const seedPractices = CATALOGUE_V3_CONTENT.flatMap((category) => category.practices);
    const redundantConsent = /consensual|consensuad[oa]s?|consentid[oa]s?/i;

    expect(CATALOGUE_V3_CONTENT).toHaveLength(17);
    expect(seedPractices).toHaveLength(CURRENT_CATALOGUE_SNAPSHOT.catalogue.practices.length);

    for (const category of CATALOGUE_V3_CONTENT) {
      expect(category.en.trim().length).toBeGreaterThan(0);
      expect(category.es.trim().length).toBeGreaterThan(0);
      expect(category.descriptionEn.trim().length).toBeGreaterThan(0);
      expect(category.descriptionEs.trim().length).toBeGreaterThan(0);
      expect(category.descriptionEn).not.toMatch(redundantConsent);
      expect(category.descriptionEs).not.toMatch(redundantConsent);

      for (const practice of category.practices) {
        expect(practice.en.trim().length, `${practice.id} missing English label`).toBeGreaterThan(0);
        expect(practice.es.trim().length, `${practice.id} missing Spanish label`).toBeGreaterThan(0);
        expect(describeCataloguePractice(practice, 'en').trim().length, `${practice.id} missing English description`).toBeGreaterThan(0);
        expect(describeCataloguePractice(practice, 'es').trim().length, `${practice.id} missing Spanish description`).toBeGreaterThan(0);
        expect(practice.en).not.toMatch(redundantConsent);
        expect(practice.es).not.toMatch(redundantConsent);
        expect(describeCataloguePractice(practice, 'en')).not.toMatch(redundantConsent);
        expect(describeCataloguePractice(practice, 'es')).not.toMatch(redundantConsent);
      }
    }
  });

  it('removes reviewed duplicate aliases instead of keeping parallel questions for the same semantics', () => {
    const ids = new Set(CURRENT_CATALOGUE_SNAPSHOT.catalogue.practices.map((practice) => practice.id));
    for (const retiredId of RETIRED_V3_PRACTICE_IDS) expect(ids.has(retiredId), retiredId).toBe(false);

    expect(ids.has('watch-partner-masturbate')).toBe(true);
    expect(ids.has('masturbation-in-front-of-partner')).toBe(false);
    expect(ids.has('gangbang')).toBe(true);
    expect(ids.has('being-center-of-group')).toBe(false);
    expect(ids.has('urine-play')).toBe(true);
    expect(ids.has('urinating-on-partner')).toBe(false);
  });

  it('uses directed roles for affection that can meaningfully be given or received', () => {
    const cuddling = CURRENT_CATALOGUE_SNAPSHOT.catalogue.practices.find((practice) => practice.id === 'cuddling');
    expect(cuddling?.roles.map((role) => role.id)).toEqual(['give', 'receive']);
    expect(cuddling?.roles.every((role) => role.contextAxes?.includes('counterpartSex'))).toBe(true);
    expect(cuddling?.compatibleRolePairs).toEqual([{ leftRoleId: 'give', rightRoleId: 'receive' }]);
  });

  it('models solo masturbation as one self-only preference without partner variants', () => {
    const solo = CURRENT_CATALOGUE_SNAPSHOT.catalogue.practices.find((practice) => practice.id === 'solo-masturbation');
    expect(solo?.roles.map((role) => role.id)).toEqual(['self']);
    expect(solo?.roles[0]?.contextAxes).toBeUndefined();
    expect(solo?.compatibleRolePairs).toEqual([{ leftRoleId: 'self', rightRoleId: 'self' }]);
  });

  it('models clothing state independently for the profile owner and their partner', () => {
    for (const id of ['clothed-sex', 'partial-nudity', 'full-nudity']) {
      const practice = CURRENT_CATALOGUE_SNAPSHOT.catalogue.practices.find((candidate) => candidate.id === id);
      expect(practice?.roles.map((role) => role.id), id).toEqual(['self-state', 'partner-state']);
      expect(practice?.roles.find((role) => role.id === 'self-state')?.contextAxes, id).toBeUndefined();
      expect(practice?.roles.find((role) => role.id === 'partner-state')?.contextAxes, id).toEqual(['counterpartSex']);
      expect(practice?.compatibleRolePairs, id).toEqual([{ leftRoleId: 'self-state', rightRoleId: 'partner-state' }]);
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

  it('never generates anatomically impossible oral variants, even when filtered questions are revealed', () => {
    const man = createProfile({
      id: 'man',
      now: '2026-08-22T16:00:00.000Z',
      metadata: { sex: 'male', orientation: 'bisexual' },
    });
    const woman = createProfile({
      id: 'woman',
      now: '2026-08-22T16:00:00.000Z',
      metadata: { sex: 'female', orientation: 'bisexual' },
    });

    const manOral = questionnaire.getCategory(CURRENT_CATALOGUE_SNAPSHOT, man, 'oral', true);
    const womanOral = questionnaire.getCategory(CURRENT_CATALOGUE_SNAPSHOT, woman, 'oral', true);
    const manCunnilingus = manOral?.practices.find((item) => item.practice.id === 'cunnilingus');
    const manFellatio = manOral?.practices.find((item) => item.practice.id === 'fellatio');
    const womanCunnilingus = womanOral?.practices.find((item) => item.practice.id === 'cunnilingus');
    const womanFellatio = womanOral?.practices.find((item) => item.practice.id === 'fellatio');

    expect(manCunnilingus?.roles.map((item) => `${item.role.id}:${item.counterpartSex}`)).toEqual(['give:female']);
    expect(manFellatio?.roles.map((item) => `${item.role.id}:${item.counterpartSex}`)).toEqual(['receive:female']);
    expect(womanCunnilingus?.roles.map((item) => `${item.role.id}:${item.counterpartSex}`)).toEqual(['receive:male']);
    expect(womanFellatio?.roles.map((item) => `${item.role.id}:${item.counterpartSex}`)).toEqual(['give:male']);
  });

  it('applies anatomy to body-focus and anatomy-specific toy practices', () => {
    const man = createProfile({
      id: 'man',
      now: '2026-08-22T16:00:00.000Z',
      metadata: { sex: 'male', orientation: 'bisexual' },
    });
    const body = questionnaire.getCategory(CURRENT_CATALOGUE_SNAPSHOT, man, 'body-fetishes', true);
    const penis = body?.practices.find((item) => item.practice.id === 'penis');
    const vulva = body?.practices.find((item) => item.practice.id === 'vulva');

    expect(penis?.roles.map((item) => item.counterpartSex)).toEqual(['male']);
    expect(vulva?.roles.map((item) => item.counterpartSex)).toEqual(['female']);

    const toys = questionnaire.getCategory(CURRENT_CATALOGUE_SNAPSHOT, man, 'toys', true);
    const prostateMassager = toys?.practices.find((item) => item.practice.id === 'prostate-massager');
    expect(prostateMassager?.roles.some(
      (item) => item.role.id === 'use-on-partner' && item.counterpartSex === 'female',
    )).toBe(false);
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
