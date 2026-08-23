import { CURRENT_CATALOGUE_SNAPSHOT } from './catalogue-v3';
import { CATALOGUE_V3_CONTENT } from './v3/content/final';

function practice(id: string) {
  return CURRENT_CATALOGUE_SNAPSHOT.catalogue.practices.find((candidate) => candidate.id === id);
}

describe('Catalogue V3 semantic paired roles', () => {
  it('requires every paired seed to define exactly two distinct semantic roles', () => {
    const paired = CATALOGUE_V3_CONTENT.flatMap((category) => category.practices)
      .filter((candidate) => candidate.kind === 'paired');

    expect(paired.length).toBeGreaterThan(20);
    for (const candidate of paired) {
      expect(candidate.pairedRoles, candidate.id).toHaveLength(2);
      const ids = candidate.pairedRoles?.map((role) => role.id) ?? [];
      expect(new Set(ids).size, candidate.id).toBe(2);
      for (const role of candidate.pairedRoles ?? []) {
        expect(role.en.trim().length, `${candidate.id}:${role.id} EN`).toBeGreaterThan(0);
        expect(role.es.trim().length, `${candidate.id}:${role.id} ES`).toBeGreaterThan(0);
      }
    }
  });

  it('distinguishes asymmetric roleplay roles instead of reducing them to participation', () => {
    expect(practice('boss-employee-roleplay')?.roles.map((role) => role.id)).toEqual(['boss', 'employee']);
    expect(practice('captor-captive-roleplay')?.roles.map((role) => role.id)).toEqual(['captor', 'captive']);
    expect(practice('pet-play-soft')?.roles.map((role) => role.id)).toEqual(['handler', 'pet']);
    expect(practice('pet-play-intense')?.roles.map((role) => role.id)).toEqual(['handler', 'pet']);
    expect(practice('sleep-roleplay')?.roles.map((role) => role.id)).toEqual(['awake-role', 'sleeping-role']);
    expect(practice('consensual-non-consent-roleplay')?.roles.map((role) => role.id)).toEqual([
      'initiator',
      'resisting-role',
    ]);
  });

  it('uses semantic power roles and compatible opposite-role pairs', () => {
    const domination = practice('domination');
    expect(domination?.roles.map((role) => role.id)).toEqual(['dominant', 'submissive']);
    expect(domination?.compatibleRolePairs).toEqual([{ leftRoleId: 'dominant', rightRoleId: 'submissive' }]);

    const brat = practice('brat-dynamic');
    expect(brat?.roles.map((role) => role.id)).toEqual(['brat-tamer', 'brat']);
    expect(brat?.compatibleRolePairs).toEqual([{ leftRoleId: 'brat-tamer', rightRoleId: 'brat' }]);
  });
});
