import { QuestionnaireService } from '../../application/questionnaire/questionnaire-service';
import { createProfile } from '../../domain/profile/profile';
import { CURRENT_CATALOGUE_SNAPSHOT } from './catalogue-v3';
import { CATALOGUE_V3_CONTENT, RETIRED_V3_PRACTICE_IDS } from './v3/content/final';

const questionnaire = new QuestionnaireService();

function profile(id: string, sex: 'male' | 'female', orientation: 'heterosexual' | 'homosexual' | 'bisexual') {
  return createProfile({ id, now: '2026-08-23T00:00:00.000Z', metadata: { sex, orientation } });
}

function category(id: string, userProfile: ReturnType<typeof profile>) {
  return questionnaire.getCategory(CURRENT_CATALOGUE_SNAPSHOT, userProfile, id);
}

function practiceIds(categoryId: string, userProfile: ReturnType<typeof profile>): string[] {
  return category(categoryId, userProfile)?.practices.map((item) => item.practice.id) ?? [];
}

function roleIds(categoryId: string, practiceId: string, userProfile: ReturnType<typeof profile>): string[] {
  return [...new Set(
    category(categoryId, userProfile)?.practices
      .find((item) => item.practice.id === practiceId)?.roles.map((item) => item.role.id) ?? [],
  )];
}

function snapshotPractice(id: string) {
  return CURRENT_CATALOGUE_SNAPSHOT.catalogue.practices.find((practice) => practice.id === id);
}

describe('Catalogue V3 final role polish', () => {
  it('keeps semen cleanup semantics distinct without treating heterosexual male orientation as a preference', () => {
    const man = profile('hetero-man-fluids-final', 'male', 'heterosexual');
    expect(practiceIds('fluids', man)).toContain('snowballing');
    expect(snapshotPractice('creampie-cleanup')).toBeUndefined();
    expect(snapshotPractice('semen-cleanup-oral')).toBeUndefined();

    for (const cleanupId of [
      'semen-cleanup-manual',
      'semen-cleanup-oral-external',
      'semen-cleanup-oral-creampie',
      'semen-cleanup-other',
    ]) {
      expect(roleIds('fluids', cleanupId, man), cleanupId).toEqual(['give', 'receive']);
    }
    expect(snapshotPractice('semen-cleanup-manual')?.roles.map((role) => role.label)).toEqual([
      'Manually clean semen from my partner',
      'Have my partner manually clean semen from me',
      'Manually clean semen from my own body',
    ]);
  });

  it('keeps generic gangbang roles available instead of assigning them from orientation stereotypes', () => {
    const man = profile('hetero-man-gangbang', 'male', 'heterosexual');
    const woman = profile('hetero-woman-gangbang', 'female', 'heterosexual');
    const gayMan = profile('gay-man-gangbang', 'male', 'homosexual');

    expect(roleIds('groups', 'gangbang', man)).toEqual(['center', 'participate']);
    expect(roleIds('groups', 'gangbang', woman)).toEqual(['center', 'participate']);
    expect(roleIds('groups', 'gangbang', gayMan)).toEqual(['center', 'participate']);
  });

  it('splits genital pain by anatomy while keeping chest pain available to men', () => {
    const man = profile('hetero-man-edge', 'male', 'heterosexual');
    const woman = profile('hetero-woman-edge', 'female', 'heterosexual');

    expect(RETIRED_V3_PRACTICE_IDS.has('genital-torture')).toBe(true);
    expect(snapshotPractice('genital-torture')).toBeUndefined();
    expect(roleIds('edge', 'cock-and-ball-torture', man)).toEqual(['receive']);
    expect(roleIds('edge', 'pussy-torture', woman)).toEqual(['receive']);
    expect(roleIds('edge', 'breast-torture', man)).toContain('receive');
  });

  it('models female ejaculation as a state and squirting onto a partner as a separate directed practice', () => {
    const woman = profile('hetero-woman-squirting', 'female', 'heterosexual');
    const man = profile('hetero-man-squirting', 'male', 'heterosexual');

    expect(roleIds('fluids', 'female-ejaculation', woman)).toEqual(['self-state']);
    expect(roleIds('fluids', 'squirting-on-partner', woman)).toEqual(['give']);
    expect(roleIds('fluids', 'female-ejaculation', man)).toEqual(['partner-state']);
    expect(roleIds('fluids', 'squirting-on-partner', man)).toEqual(['receive']);
  });

  it('hides double vaginal penetration from homosexual men but keeps relevant compositions elsewhere', () => {
    const gayMan = profile('gay-man-double-vaginal', 'male', 'homosexual');
    const heterosexualMan = profile('hetero-man-double-vaginal', 'male', 'heterosexual');
    const lesbian = profile('lesbian-double-vaginal', 'female', 'homosexual');

    expect(practiceIds('penetration', gayMan)).not.toContain('double-vaginal-penetration');
    expect(practiceIds('penetration', heterosexualMan)).toContain('double-vaginal-penetration');
    expect(practiceIds('penetration', lesbian)).toContain('double-vaginal-penetration');
  });

  it('gives the double-ended dildo shared use plus female-only double self-use', () => {
    const lesbian = profile('lesbian-double-dildo', 'female', 'homosexual');
    const gayMan = profile('gay-man-double-dildo', 'male', 'homosexual');

    expect(roleIds('toys', 'double-ended-dildo', lesbian)).toEqual(['use-together', 'use-on-self']);
    expect(roleIds('toys', 'double-ended-dildo', gayMan)).toEqual(['use-together']);
    expect(snapshotPractice('double-ended-dildo')?.compatibleRolePairs).toEqual([
      { leftRoleId: 'use-together', rightRoleId: 'use-together' },
      { leftRoleId: 'use-on-self', rightRoleId: 'use-on-self' },
    ]);
  });

  it('treats suction-mounted toys as self-use equipment', () => {
    const woman = profile('woman-suction-toy', 'female', 'bisexual');
    expect(roleIds('toys', 'vacuum-cup-toys', woman)).toEqual(['use-on-self']);
  });

  it('uses role-based surreal fantasies without unnecessary partner-sex scopes', () => {
    const expectedRoles: Readonly<Record<string, readonly string[]>> = {
      'futanari-fantasy': ['be-role', 'be-with-role'],
      'transformation-fantasy': ['be-role', 'be-with-role'],
      'size-change-fantasy': ['be-role', 'be-with-role'],
      'extra-anatomy-fantasy': ['be-role', 'be-with-role'],
      'furry-anthro-fantasy': ['be-role', 'be-with-role'],
      'monster-roleplay': ['be-role', 'be-with-role'],
      'alien-fantasy': ['be-role', 'be-with-role'],
      'vore-fantasy': ['swallow', 'be-swallowed'],
      'tentacle-fantasy': ['watch-tentacles', 'tentacles-on-me'],
    };

    for (const [id, roles] of Object.entries(expectedRoles)) {
      const practice = snapshotPractice(id);
      expect(practice?.roles.map((role) => role.id), id).toEqual(roles);
      expect(practice?.roles.every((role) => !role.contextAxes?.includes('counterpartSex')), id).toBe(true);
    }
  });

  it('keeps category descriptions short enough to display without truncating normal cards', () => {
    for (const categorySeed of CATALOGUE_V3_CONTENT) {
      expect(categorySeed.descriptionEs.length, `${categorySeed.id} ES`).toBeLessThanOrEqual(95);
      expect(categorySeed.descriptionEn.length, `${categorySeed.id} EN`).toBeLessThanOrEqual(95);
    }
  });
});
