import { QuestionnaireService } from '../../application/questionnaire/questionnaire-service';
import { createProfile } from '../../domain/profile/profile';
import { CURRENT_CATALOGUE_SNAPSHOT } from './catalogue-v3';

const questionnaire = new QuestionnaireService();
const practice = (id: string) => CURRENT_CATALOGUE_SNAPSHOT.catalogue.practices
  .find((candidate) => candidate.id === id);

describe('Catalogue V3 semantic regressions', () => {
  it('keeps each reviewed practice in one deliberate primary category', () => {
    expect(practice('slow-sex')?.categoryId).toBe('sexual-style');
    expect(practice('competitive-sex')?.categoryId).toBe('sexual-style');
    expect(practice('sex-in-car')?.categoryId).toBe('places-settings');
    expect(practice('glory-hole')?.categoryId).toBe('places-settings');
    expect(practice('voyeurism')?.categoryId).toBe('exhibitionism');
    expect(practice('creampie-vaginal')?.categoryId).toBe('fluids');
    expect(practice('pet-play')?.categoryId).toBe('roleplay');
    expect(practice('brat-dynamic')?.categoryId).toBe('power');
    expect(practice('missionary')?.categoryId).toBe('sexual-positions');
  });

  it('keeps directed affection roles compatible without collapsing them into mutual participation', () => {
    const cuddling = practice('cuddling');
    expect(cuddling?.roles.map((role) => role.id)).toEqual(['give', 'receive']);
    expect(cuddling?.roles.every((role) => role.contextAxes?.includes('counterpartSex'))).toBe(true);
    expect(cuddling?.compatibleRolePairs).toEqual([{ leftRoleId: 'give', rightRoleId: 'receive' }]);
  });

  it('keeps individual activities self-only', () => {
    for (const id of ['solo-masturbation', 'hands-free-masturbation', 'hands-free-orgasm']) {
      const item = practice(id);
      expect(item?.roles.map((role) => role.id), id).toEqual(['self']);
      expect(item?.roles[0]?.contextAxes, id).toBeUndefined();
      expect(item?.compatibleRolePairs, id).toEqual([{ leftRoleId: 'self', rightRoleId: 'self' }]);
    }
  });

  it('keeps clothing state independent for the profile owner and partner', () => {
    for (const id of ['clothed-sex', 'partial-nudity', 'full-nudity']) {
      const item = practice(id);
      expect(item?.roles.map((role) => role.id), id).toEqual(['self-state', 'partner-state']);
      expect(item?.roles.find((role) => role.id === 'self-state')?.contextAxes, id).toBeUndefined();
      expect(item?.roles.find((role) => role.id === 'partner-state')?.contextAxes, id).toEqual(['counterpartSex']);
      expect(item?.compatibleRolePairs, id).toEqual([{ leftRoleId: 'self-state', rightRoleId: 'partner-state' }]);
    }
  });

  it('keeps toy use roles and compatible target sites explicit', () => {
    const dildo = practice('dildo');
    expect(dildo?.roles.map((role) => role.id)).toEqual([
      'use-on-self',
      'use-on-partner',
      'partner-uses-on-me',
    ]);
    expect(dildo?.roles.find((role) => role.id === 'use-on-self')?.contextAxes).toEqual(['targetSite']);
    expect(dildo?.roles.find((role) => role.id === 'use-on-partner')?.contextAxes)
      .toEqual(['counterpartSex', 'targetSite']);
    expect(dildo?.roles.every((role) => role.contextValues?.targetSite?.join(',') === 'mouth,vaginal,anal'))
      .toBe(true);
    expect(dildo?.compatibleRolePairs).toEqual([
      { leftRoleId: 'use-on-self', rightRoleId: 'use-on-self' },
      { leftRoleId: 'use-on-partner', rightRoleId: 'partner-uses-on-me' },
    ]);
  });

  it('keeps anatomy metadata on body focus and anatomy-specific toys while using one unified chest preference', () => {
    const man = createProfile({
      id: 'man',
      now: '2026-08-22T16:00:00.000Z',
      metadata: { sex: 'male', orientation: 'bisexual' },
    });
    const body = questionnaire.getCategory(CURRENT_CATALOGUE_SNAPSHOT, man, 'body-fetishes', true);

    expect(body?.practices.find((item) => item.practice.id === 'penis')?.roles.map((item) => item.counterpartSex))
      .toEqual(['male']);
    expect(body?.practices.find((item) => item.practice.id === 'vulva')?.roles.map((item) => item.counterpartSex))
      .toEqual(['female']);
    expect(body?.practices.some((item) => item.practice.id === 'breasts')).toBe(false);
    expect(body?.practices.some((item) => item.practice.id === 'chest')).toBe(false);
    expect(body?.practices.find((item) => item.practice.id === 'chest-general')?.roles.map((item) => item.counterpartSex))
      .toEqual(['female', 'male']);

    const toys = questionnaire.getCategory(CURRENT_CATALOGUE_SNAPSHOT, man, 'toys', true);
    const prostateMassager = toys?.practices.find((item) => item.practice.id === 'prostate-massager');
    expect(prostateMassager?.roles.some(
      (item) => item.role.id === 'use-on-partner' && item.counterpartSex === 'female',
    )).toBe(false);
  });

  it('filters anatomically impossible toy target sites while retaining valid variants', () => {
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

    const womanDildo = questionnaire.getCategory(CURRENT_CATALOGUE_SNAPSHOT, woman, 'toys')
      ?.practices.find((item) => item.practice.id === 'dildo');
    const manDildo = questionnaire.getCategory(CURRENT_CATALOGUE_SNAPSHOT, man, 'toys')
      ?.practices.find((item) => item.practice.id === 'dildo');

    expect(womanDildo?.roles.filter((item) => item.role.id === 'use-on-self').map((item) => item.scope?.targetSite))
      .toEqual(['mouth', 'vaginal', 'anal']);
    expect(manDildo?.roles.filter((item) => item.role.id === 'use-on-self').map((item) => item.scope?.targetSite))
      .toEqual(['mouth', 'anal']);

    expect(womanDildo?.roles.filter(
      (item) => item.role.id === 'use-on-partner' && item.scope?.counterpartSex === 'male',
    ).map((item) => item.scope?.targetSite)).toEqual(['mouth', 'anal']);
    expect(womanDildo?.roles.filter(
      (item) => item.role.id === 'use-on-partner' && item.scope?.counterpartSex === 'female',
    ).map((item) => item.scope?.targetSite)).toEqual(['mouth', 'vaginal', 'anal']);
  });

  it('keeps category hiding presentation-only after the taxonomy expansion', () => {
    const profile = createProfile({
      id: 'profile',
      now: '2026-08-22T16:00:00.000Z',
      metadata: { sex: 'female', orientation: 'bisexual' },
    });
    const categoryCount = CURRENT_CATALOGUE_SNAPSHOT.catalogue.categories.length;

    const summaries = questionnaire.getCategorySummaries(
      CURRENT_CATALOGUE_SNAPSHOT,
      profile,
      false,
      ['fluids', 'edge'],
    );

    expect(summaries).toHaveLength(categoryCount - 2);
    expect(summaries.some((summary) => summary.category.id === 'fluids')).toBe(false);
    expect(summaries.some((summary) => summary.category.id === 'edge')).toBe(false);
    expect(CURRENT_CATALOGUE_SNAPSHOT.catalogue.categories.some((category) => category.id === 'edge')).toBe(true);
    expect(questionnaire.getNeighbours(CURRENT_CATALOGUE_SNAPSHOT, 'sensation', ['fluids']))
      .toEqual({ previousCategoryId: 'psychological', nextCategoryId: 'edge' });
  });
});
