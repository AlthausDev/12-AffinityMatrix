import { CURRENT_CATALOGUE_SNAPSHOT } from './catalogue-v3';
import { CATALOGUE_V3_PRACTICE_INSIGHTS } from './v3/catalogue-insights';
import { CATALOGUE_V3_SUBCATEGORIES } from './v3/catalogue-taxonomy';
import { CATALOGUE_V3_CONTENT } from './v3/content/final';

const allSeeds = () => CATALOGUE_V3_CONTENT.flatMap((category) => category.practices);
const seed = (id: string) => allSeeds().find((practice) => practice.id === id);
const practice = (id: string) => CURRENT_CATALOGUE_SNAPSHOT.catalogue.practices.find((item) => item.id === id);
const subcategory = (id: string) => CATALOGUE_V3_SUBCATEGORIES.find((item) => item.id === id);

describe('Catalogue V3 final release audit', () => {
  it('uses clear vulvar, vaginal and urethral torture concepts', () => {
    expect(seed('pussy-torture')?.es).toBe('Pussy torture');
    expect(seed('pussy-torture')?.descriptionEs).toContain('genitales externos');

    expect(seed('vaginal-torture')?.anatomySex).toBe('female');
    expect(seed('vaginal-torture')?.descriptionEs).toContain('canal vaginal');
    expect(practice('vaginal-torture')?.roles.map((role) => role.id)).toEqual(['give', 'receive']);

    expect(seed('urethral-torture')?.anatomySex).toBeUndefined();
    expect(seed('urethral-torture')?.descriptionEs).toContain('uretra');
    expect(practice('urethral-torture')?.roles.map((role) => role.id)).toEqual(['give', 'receive']);
  });

  it('adds food consumption and food penetration without duplicating food-on-body play', () => {
    expect(allSeeds().filter((item) => item.id === 'food-body-play')).toHaveLength(1);
    expect(subcategory('fluids-food-edible')?.practiceIds).toEqual([
      'food-body-play',
      'erotic-feeding',
      'food-from-body',
      'food-vaginal-penetration',
      'food-anal-penetration',
      'sexual-fluids-in-food-drink',
    ]);
    expect(seed('food-vaginal-penetration')?.kind).toBe('directed-self');
    expect(seed('food-vaginal-penetration')?.anatomySex).toBe('female');
    expect(seed('food-anal-penetration')?.kind).toBe('directed-self');
    expect(seed('sexual-fluids-in-food-drink')?.kind).toBe('directed-self');
  });

  it('splits purpose-made toys from accessories, equipment and improvised objects', () => {
    const toys = CATALOGUE_V3_CONTENT.find((category) => category.id === 'toys');
    const accessories = CATALOGUE_V3_CONTENT.find((category) => category.id === 'sexual-accessories');

    expect(toys?.es).toBe('Juguetes sexuales');
    expect(accessories?.es).toBe('Accesorios, objetos y equipamiento');
    expect(toys?.practices.map((item) => item.id)).toContain('vibrator');
    expect(toys?.practices.map((item) => item.id)).toContain('strap-on');
    expect(toys?.practices.map((item) => item.id)).not.toContain('cock-ring');
    expect(accessories?.practices.map((item) => item.id)).toContain('cock-ring');
    expect(accessories?.practices.map((item) => item.id)).toContain('sex-machine');
    expect(subcategory('toys-everyday-objects')?.categoryId).toBe('sexual-accessories');
    expect(practice('everyday-object-play')?.categoryId).toBe('sexual-accessories');
  });

  it('adds everyday-object play and separates vaginal from anal penetration', () => {
    expect(subcategory('toys-everyday-objects')?.practiceIds).toEqual([
      'everyday-object-play',
      'everyday-object-vaginal-penetration',
      'everyday-object-anal-penetration',
    ]);
    expect(seed('everyday-object-vaginal-penetration')?.anatomySex).toBe('female');
    expect(seed('everyday-object-anal-penetration')?.anatomySex).toBeUndefined();
    expect(practice('everyday-object-play')?.roles.map((role) => role.id)).toEqual(['give', 'receive', 'self']);
  });

  it('adds varied service roles instead of repeating one generic sexual-service question', () => {
    const serviceIds = subcategory('power-service')?.practiceIds ?? [];
    for (const id of [
      'oral-service',
      'manual-pleasure-service',
      'orgasm-service',
      'intimate-grooming-service',
      'fetish-scent-service',
      'toilet-service-fantasy',
    ]) {
      expect(serviceIds, id).toContain(id);
      expect(seed(id)?.kind, id).toBe('directed');
    }
    expect(seed('toilet-service-fantasy')?.descriptionEs).toContain('Fluidos');
  });

  it('expands impossible fantasies with distinct surreal premises', () => {
    const ids = subcategory('surrealism-impossible-biology-reality')?.practiceIds ?? [];
    expect(ids).toEqual([
      'clone-duplication-fantasy',
      'possession-fantasy',
      'slime-creature-fantasy',
      'oviposition-fantasy',
      'object-transformation-fantasy',
      'living-symbiote-fantasy',
    ]);
    for (const id of ids) expect(seed(id)?.kind, id).toBe('paired');
  });

  it('keeps consent and prior-agreement framing out of titles and answer labels', () => {
    const framing = /consensual|consensuad[oa]s?|consentid[oa]s?|pre[- ]?agreed|preacordad[oa]s?|acuerdo previo|prior agreement/i;

    for (const item of allSeeds()) {
      expect(item.en, `${item.id} English title`).not.toMatch(framing);
      expect(item.es, `${item.id} Spanish title`).not.toMatch(framing);
      for (const [roleId, role] of Object.entries(item.roleLabels ?? {})) {
        if (!role) continue;
        expect(role.en, `${item.id}:${roleId} English role`).not.toMatch(framing);
        expect(role.es, `${item.id}:${roleId} Spanish role`).not.toMatch(framing);
      }
      for (const role of item.pairedRoles ?? []) {
        expect(role.en, `${item.id}:${role.id} English paired role`).not.toMatch(framing);
        expect(role.es, `${item.id}:${role.id} Spanish paired role`).not.toMatch(framing);
      }
    }

    expect(seed('preagreed-unannounced-watching')?.es).toBe('Observación sin aviso');
    expect(seed('preagreed-unannounced-watching')?.descriptionEs).toContain('acuerdo previo explícito');
  });

  it('keeps the final additions concise and semantically tagged', () => {
    const newIds = [
      'spontaneous-sex', 'planned-sex', 'quiet-sex', 'vocal-expressive-sex', 'immersive-focused-sex', 'novelty-focused-sex',
      'orgasm-on-command', 'orgasm-permission', 'orgasm-count-control',
      'group-oral-focus', 'group-worship-focus', 'group-masturbation-circle', 'group-shared-toy-play',
      'oral-service', 'manual-pleasure-service', 'orgasm-service', 'intimate-grooming-service', 'fetish-scent-service', 'toilet-service-fantasy',
      'clone-duplication-fantasy', 'possession-fantasy', 'slime-creature-fantasy', 'oviposition-fantasy', 'object-transformation-fantasy', 'living-symbiote-fantasy',
      'vaginal-torture', 'urethral-torture',
      'erotic-feeding', 'food-from-body', 'food-vaginal-penetration', 'food-anal-penetration', 'sexual-fluids-in-food-drink',
      'everyday-object-play', 'everyday-object-vaginal-penetration', 'everyday-object-anal-penetration',
      'oral-kneeling-standing-position', 'oral-lying-between-legs-position', 'oral-side-lying-position', 'oral-edge-position',
    ];
    const insightIds = new Set(CATALOGUE_V3_PRACTICE_INSIGHTS.map((item) => item.practiceId));

    for (const id of newIds) {
      const item = seed(id);
      expect(item, id).toBeDefined();
      expect(item!.descriptionEs!.length, `${id} ES description`).toBeLessThanOrEqual(280);
      expect(item!.descriptionEn!.length, `${id} EN description`).toBeLessThanOrEqual(280);
      expect(insightIds.has(id), `${id} semantic insight`).toBe(true);
    }
  });

  it('makes the expanded categories discoverable from their category copy', () => {
    const toys = CATALOGUE_V3_CONTENT.find((category) => category.id === 'toys');
    const accessories = CATALOGUE_V3_CONTENT.find((category) => category.id === 'sexual-accessories');
    const fluids = CATALOGUE_V3_CONTENT.find((category) => category.id === 'fluids');
    expect(toys?.es).toBe('Juguetes sexuales');
    expect(toys?.descriptionEs).toContain('Vibradores');
    expect(accessories?.es).toBe('Accesorios, objetos y equipamiento');
    expect(accessories?.descriptionEs).toContain('Masturbadores');
    expect(fluids?.es).toBe('Fluidos, alimentos y sustancias');
    expect(fluids?.descriptionEs).toContain('alimentos');
  });
});
