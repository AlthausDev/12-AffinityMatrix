import { QuestionnaireService } from '../../application/questionnaire/questionnaire-service';
import { catalogueSnapshotValidator } from '../../domain/catalogue/catalogue-snapshot';
import { CATALOGUE_VERSION_V3, CURRENT_CATALOGUE_VERSION } from '../../domain/catalogue/catalogue-version';
import { createProfile } from '../../domain/profile/profile';
import { CURRENT_CATALOGUE_SNAPSHOT } from './catalogue-v3';
import { CATALOGUE_V3_CONTENT, RETIRED_V3_PRACTICE_IDS } from './v3/content/curated';
import { describeCataloguePractice } from './v3/content/practice-description';

const questionnaire = new QuestionnaireService();
const CATEGORY_IDS = [
  'affection-intimacy',
  'sexual-style',
  'clothing-appearance',
  'manual-masturbation',
  'oral',
  'penetration',
  'toys',
  'orgasm-control',
  'body-fetishes',
  'groups',
  'roleplay',
  'exhibitionism',
  'places-settings',
  'power',
  'restraint',
  'psychological',
  'sensation',
  'fluids',
  'edge',
] as const;

describe('catalogue v3 snapshot', () => {
  it('is the validated current catalogue with broad coverage and deterministic soft-to-edge ordering', () => {
    const { categories, practices } = CURRENT_CATALOGUE_SNAPSHOT.catalogue;

    expect(CURRENT_CATALOGUE_VERSION).toBe(CATALOGUE_VERSION_V3);
    expect(CURRENT_CATALOGUE_SNAPSHOT.version).toBe(CATALOGUE_VERSION_V3);
    expect(catalogueSnapshotValidator.validate(CURRENT_CATALOGUE_SNAPSHOT)).toEqual([]);
    expect(categories.map((category) => category.id)).toEqual(CATEGORY_IDS);
    expect(categories.map((category) => category.order)).toEqual([...Array(CATEGORY_IDS.length).keys()]);
    expect(practices.length).toBeGreaterThanOrEqual(350);

    for (const category of categories) {
      const categoryPracticeCount = practices.filter((practice) => practice.categoryId === category.id).length;
      expect(categoryPracticeCount, `${category.id} should remain meaningfully populated`).toBeGreaterThanOrEqual(6);
    }
  });

  it('keeps every current seed bilingual, described, and free of repeated per-entry consent wording', () => {
    const seedPractices = CATALOGUE_V3_CONTENT.flatMap((category) => category.practices);
    const redundantConsent = /consensual|consensuad[oa]s?|consentid[oa]s?/i;

    expect(CATALOGUE_V3_CONTENT).toHaveLength(CATEGORY_IDS.length);
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

  it('uses the specific glossary descriptions for ambiguous terms instead of a generic role sentence', () => {
    const faceSitting = CATALOGUE_V3_CONTENT.flatMap((category) => category.practices)
      .find((practice) => practice.id === 'face-sitting');
    expect(faceSitting).toBeDefined();
    expect(describeCataloguePractice(faceSitting!, 'es')).toContain('se sienta');
    expect(describeCataloguePractice(faceSitting!, 'en')).toContain('sits or kneels');
  });

  it('does not keep duplicate labels after the semantic curation pass', () => {
    const practices = CATALOGUE_V3_CONTENT.flatMap((category) => category.practices);
    for (const locale of ['en', 'es'] as const) {
      const seen = new Map<string, string>();
      for (const practice of practices) {
        const label = locale === 'es' ? practice.es : practice.en;
        const normalized = label.toLocaleLowerCase(locale)
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, ' ')
          .trim();
        const previous = seen.get(normalized);
        expect(previous, `${locale} duplicate label: ${previous} / ${practice.id}`).toBeUndefined();
        seen.set(normalized, practice.id);
      }
    }
  });

  it('removes reviewed aliases and composite questions instead of keeping parallel semantics', () => {
    const ids = new Set(CURRENT_CATALOGUE_SNAPSHOT.catalogue.practices.map((practice) => practice.id));
    for (const retiredId of RETIRED_V3_PRACTICE_IDS) expect(ids.has(retiredId), retiredId).toBe(false);

    expect(ids.has('watch-partner-masturbate')).toBe(true);
    expect(ids.has('masturbation-in-front-of-partner')).toBe(false);
    expect(ids.has('gangbang')).toBe(true);
    expect(ids.has('being-center-of-group')).toBe(false);
    expect(ids.has('urine-play')).toBe(true);
    expect(ids.has('urinating-on-partner')).toBe(false);
    expect(ids.has('remote-control-toy')).toBe(true);
    expect(ids.has('app-controlled-toy')).toBe(false);
    expect(ids.has('edging')).toBe(true);
    expect(ids.has('edging-manual')).toBe(false);
    expect(ids.has('oral-edging')).toBe(false);
  });

  it('uses one primary category per practice and separates style and place from unrelated categories', () => {
    const practices = CURRENT_CATALOGUE_SNAPSHOT.catalogue.practices;
    const categoryOf = (practiceId: string) => practices.find((practice) => practice.id === practiceId)?.categoryId;

    expect(categoryOf('slow-sex')).toBe('sexual-style');
    expect(categoryOf('competitive-sex')).toBe('sexual-style');
    expect(categoryOf('sex-in-car')).toBe('places-settings');
    expect(categoryOf('glory-hole')).toBe('places-settings');
    expect(categoryOf('voyeurism')).toBe('exhibitionism');
    expect(categoryOf('creampie-vaginal')).toBe('fluids');
    expect(categoryOf('pet-play')).toBe('power');
  });

  it('uses directed roles for affection that can meaningfully be given or received', () => {
    const cuddling = CURRENT_CATALOGUE_SNAPSHOT.catalogue.practices.find((practice) => practice.id === 'cuddling');
    expect(cuddling?.roles.map((role) => role.id)).toEqual(['give', 'receive']);
    expect(cuddling?.roles.every((role) => role.contextAxes?.includes('counterpartSex'))).toBe(true);
    expect(cuddling?.compatibleRolePairs).toEqual([{ leftRoleId: 'give', rightRoleId: 'receive' }]);
  });

  it('models solo and hands-free individual activities without fake partner participation', () => {
    for (const id of ['solo-masturbation', 'hands-free-masturbation', 'hands-free-orgasm']) {
      const practice = CURRENT_CATALOGUE_SNAPSHOT.catalogue.practices.find((candidate) => candidate.id === id);
      expect(practice?.roles.map((role) => role.id), id).toEqual(['self']);
      expect(practice?.roles[0]?.contextAxes, id).toBeUndefined();
      expect(practice?.compatibleRolePairs, id).toEqual([{ leftRoleId: 'self', rightRoleId: 'self' }]);
    }
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
    const roles = (category: typeof manOral, practiceId: string) => category?.practices
      .find((item) => item.practice.id === practiceId)?.roles
      .map((item) => `${item.role.id}:${item.counterpartSex}`);

    expect(roles(manOral, 'cunnilingus')).toEqual(['give:female']);
    expect(roles(manOral, 'fellatio')).toEqual(['give:male', 'receive:male', 'receive:female']);
    expect(roles(womanOral, 'cunnilingus')).toEqual(['give:female', 'receive:male', 'receive:female']);
    expect(roles(womanOral, 'fellatio')).toEqual(['give:male']);
  });

  it('distinguishes performer anatomy from receiver anatomy for ejaculation practices', () => {
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

    const manFluids = questionnaire.getCategory(CURRENT_CATALOGUE_SNAPSHOT, man, 'fluids', true);
    const womanFluids = questionnaire.getCategory(CURRENT_CATALOGUE_SNAPSHOT, woman, 'fluids', true);
    const roles = (category: typeof manFluids, practiceId: string) => category?.practices
      .find((item) => item.practice.id === practiceId)?.roles
      .map((item) => `${item.role.id}:${item.counterpartSex}`);

    expect(roles(manFluids, 'semen-in-mouth')).toEqual(['give:male', 'give:female', 'receive:male']);
    expect(roles(womanFluids, 'semen-in-mouth')).toEqual(['receive:male']);
    expect(roles(manFluids, 'creampie-vaginal')).toEqual(['give:female']);
    expect(roles(womanFluids, 'creampie-vaginal')).toEqual(['receive:male']);
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
    const breasts = body?.practices.find((item) => item.practice.id === 'breasts');
    const chest = body?.practices.find((item) => item.practice.id === 'chest');

    expect(penis?.roles.map((item) => item.counterpartSex)).toEqual(['male']);
    expect(vulva?.roles.map((item) => item.counterpartSex)).toEqual(['female']);
    expect(breasts?.roles.map((item) => item.counterpartSex)).toEqual(['female']);
    expect(chest?.roles.map((item) => item.counterpartSex)).toEqual(['male']);

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

    expect(summaries).toHaveLength(CATEGORY_IDS.length - 2);
    expect(summaries.some((summary) => summary.category.id === 'fluids')).toBe(false);
    expect(summaries.some((summary) => summary.category.id === 'edge')).toBe(false);
    expect(CURRENT_CATALOGUE_SNAPSHOT.catalogue.categories.some((category) => category.id === 'edge')).toBe(true);

    expect(questionnaire.getNeighbours(CURRENT_CATALOGUE_SNAPSHOT, 'sensation', ['fluids']))
      .toEqual({ previousCategoryId: 'psychological', nextCategoryId: 'edge' });
  });
});
