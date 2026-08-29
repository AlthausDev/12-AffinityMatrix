import { CATALOGUE_V3_CONTENT } from './v3/content/final';
import { CATALOGUE_V3_SUBCATEGORIES } from './v3/catalogue-taxonomy';

const category = (id: string) => CATALOGUE_V3_CONTENT.find((entry) => entry.id === id)!;
const practice = (categoryId: string, practiceId: string) =>
  category(categoryId).practices.find((entry) => entry.id === practiceId)!;

describe('Catalogue V3 final noise cleanup', () => {
  it('puts body traits first and keeps category order unique', () => {
    expect(category('body-fetishes').order).toBe(0);
    const orders = CATALOGUE_V3_CONTENT.map((entry) => entry.order);
    expect(new Set(orders).size).toBe(orders.length);
  });

  it('retires energetic sex instead of keeping a near-duplicate style signal', () => {
    expect(category('sexual-style').practices.some((entry) => entry.id === 'energetic-sex')).toBe(false);
  });

  it('uses explicit guide and be-guided roles for guided touch', () => {
    const guided = practice('manual-masturbation', 'guided-touch');
    expect(guided.kind).toBe('paired');
    expect(guided.pairedRoles?.map((role) => role.id)).toEqual(['guide', 'be-guided']);
  });

  it('adds self cleanup where it is meaningful but not to creampie oral cleanup', () => {
    expect(practice('fluids', 'semen-cleanup-manual').kind).toBe('directed-self');
    expect(practice('fluids', 'semen-cleanup-oral-external').kind).toBe('directed-self');
    expect(practice('fluids', 'semen-cleanup-other').kind).toBe('directed-self');
    expect(practice('fluids', 'semen-cleanup-oral-creampie').kind).toBe('directed');
  });

  it('expands oral positions without duplicating the existing 69 or face-sitting entries', () => {
    const positions = CATALOGUE_V3_SUBCATEGORIES.find((entry) => entry.id === 'positions-oral')!;
    expect(positions.practiceIds).toEqual([
      'sixty-nine',
      'face-sitting',
      'oral-kneeling-standing-position',
      'oral-lying-between-legs-position',
      'oral-side-lying-position',
      'oral-edge-position',
    ]);
  });

  it('keeps everyday vaginal object play self-capable rather than adding a duplicate practice', () => {
    const vaginal = practice('sexual-accessories', 'everyday-object-vaginal-penetration');
    expect(vaginal.kind).toBe('directed-self');
    expect(vaginal.roleLabels?.self?.es).toContain('conmigo');
    expect(category('sexual-accessories').practices.filter((entry) => entry.id === vaginal.id)).toHaveLength(1);
  });

  it('uses concise taboo-fantasy titles and an explicit incest fantasy label', () => {
    const taboo = category('taboo-fantasies');
    const incest = taboo.practices.find((entry) => entry.id === 'family-role-taboo-fantasy')!;
    expect(incest.es).toBe('Fantasía de incesto');
    expect(incest.descriptionEs).toContain('entre adultos');
    for (const entry of taboo.practices) {
      expect(entry.es.toLocaleLowerCase()).not.toContain('fantasía tabú de');
    }
  });

  it('orders genital edge entries with CBT immediately before urethral torture', () => {
    const edge = CATALOGUE_V3_SUBCATEGORIES.find((entry) => entry.id === 'edge-intense-genital-breast-pain')!;
    expect(edge.practiceIds).toEqual([
      'pussy-torture',
      'vaginal-torture',
      'cock-and-ball-torture',
      'urethral-torture',
      'breast-torture',
      'nipple-torture',
    ]);
  });

  it('adds sexual fluids in food/drink and clarifies ordinary clothespins', () => {
    expect(practice('fluids', 'sexual-fluids-in-food-drink').kind).toBe('directed-self');
    expect(practice('sensation', 'clothespins').es).toContain('pezones');
  });
});
