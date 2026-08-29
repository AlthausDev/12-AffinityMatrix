import { CURRENT_CATALOGUE_SNAPSHOT } from './catalogue-v3';
import { CATALOGUE_V3_PRACTICE_INSIGHTS, CATALOGUE_INSIGHT_TAGS } from './v3/catalogue-insights';
import { CATALOGUE_V3_SUBCATEGORIES } from './v3/catalogue-taxonomy';
import { CATALOGUE_V3_CONTENT } from './v3/content/final';

const seed = (id: string) => CATALOGUE_V3_CONTENT
  .flatMap((category) => category.practices)
  .find((practice) => practice.id === id);
const practice = (id: string) => CURRENT_CATALOGUE_SNAPSHOT.catalogue.practices.find((candidate) => candidate.id === id);
const subcategory = (id: string) => CATALOGUE_V3_SUBCATEGORIES.find((candidate) => candidate.id === id);
const insight = (id: string) => CATALOGUE_V3_PRACTICE_INSIGHTS.find((candidate) => candidate.practiceId === id);

describe('Catalogue V3 final manual review', () => {
  it('separates vagina from vulva and moves pubic hair into the hair section', () => {
    expect(seed('vagina')?.anatomySex).toBe('female');
    expect(seed('vagina')?.descriptionEs).toContain('canal genital interno');
    expect(subcategory('body-genitals-pubic')?.practiceIds).toContain('vagina');
    expect(subcategory('body-genitals-pubic')?.practiceIds).not.toContain('pubic-hair');
    expect(subcategory('body-genitals-pubic')?.es).toBe('Genitales');
    expect(subcategory('body-hair-scent-sweat')?.practiceIds[0]).toBe('pubic-hair');
  });

  it('orders sensation play from lighter sensory contact toward more intrusive impact play', () => {
    const ordered = CATALOGUE_V3_SUBCATEGORIES
      .filter((item) => item.categoryId === 'sensation')
      .sort((left, right) => left.order - right.order)
      .map((item) => item.id);
    expect(ordered).toEqual([
      'sensation-light-sensory-modulation',
      'sensation-temperature-electric',
      'sensation-rough-pressure-pinching',
      'sensation-impact',
    ]);
  });

  it('uses distinct visibility, service and semen-cleanup questions instead of umbrella duplicates', () => {
    for (const id of [
      'erotic-selfies', 'erotic-photo-session-together', 'erotic-media-exchange',
      'watch-private-recording-together', 'watching-undressing', 'watched-masturbation', 'private-striptease',
      'preagreed-unannounced-watching',
      'body-care-service', 'attentive-service', 'erotic-presentation-service', 'footwear-service', 'fetish-gear-service',
      'ownership-token', 'temporary-ownership-marking', 'assigned-submissive-name',
      'semen-on-other-body', 'semen-cleanup-manual', 'semen-cleanup-oral-external',
      'semen-cleanup-oral-creampie', 'semen-cleanup-other',
      'ordeal-scene', 'extreme-helplessness-fantasy',
    ]) expect(seed(id), id).toBeDefined();

    for (const retired of [
      'partner-erotic-photography', 'hospitality-service', 'ritual-attendance-service', 'creampie-cleanup',
      'own-urine-play', 'own-blood-play', 'own-scat-play', 'service', 'pleasure-focused-service',
      'furniture-restraint', 'semen-cleanup-oral',
    ]) expect(seed(retired), retired).toBeUndefined();

    expect(subcategory('fluids-semen-cleanup')?.practiceIds).toEqual([
      'semen-cleanup-manual',
      'semen-cleanup-oral-external',
      'semen-cleanup-oral-creampie',
      'semen-cleanup-other',
    ]);
  });

  it('removes hotwife overlap and replaces it with erotic compersion', () => {
    expect(seed('hotwife-dynamic')).toBeUndefined();
    expect(seed('watching-partner-with-other')?.kind).toBe('paired');
    expect(seed('erotic-compersion')?.pairedRoles?.map((role) => role.id))
      .toEqual(['experience-compersion', 'be-compersion-focus']);
    expect(seed('erotic-compersion')?.descriptionEs).toContain('disfrute');
    expect(seed('erotic-compersion')?.descriptionEs).toContain('no en la humillación ni en observar');
    expect(seed('cuckold-dynamic')?.pairedRoles?.map((role) => role.id)).toEqual(['cuckold-role', 'cuckold-partner-role']);
    expect(seed('cuckquean-dynamic')?.pairedRoles?.map((role) => role.id)).toEqual(['cuckquean-role', 'cuckquean-partner-role']);
  });

  it('keeps unannounced watching inside an explicit prior-consent frame', () => {
    const watched = seed('preagreed-unannounced-watching');
    expect(watched?.kind).toBe('watch');
    expect(watched?.es).toBe('Observación sin aviso');
    expect(watched?.descriptionEs).toContain('acuerdo previo explícito');
    expect(watched?.descriptionEs).toContain('No incluye observar a alguien');
    expect(seed('voyeurism')?.descriptionEs).toContain('sabe que está siendo observada');
  });

  it('expands atmospheric places without duplicating roleplay', () => {
    for (const id of ['sex-in-abandoned-place', 'sex-in-office-after-hours', 'sex-on-secluded-beach', 'sex-while-camping']) {
      expect(seed(id)?.kind, id).toBe('mutual');
      expect(subcategory('places-away-secluded')?.practiceIds, id).toContain(id);
    }
    expect(seed('sex-in-office-after-hours')?.descriptionEs).toContain('sin requerir un roleplay');
  });

  it('turns generic BDSM furniture into concrete restraint choices', () => {
    expect(seed('furniture-restraint')).toBeUndefined();
    for (const id of ['st-andrews-cross-restraint', 'bondage-bench-restraint', 'bondage-chair-restraint', 'stocks-restraint', 'cage-confinement']) {
      expect(seed(id), id).toBeDefined();
      expect(subcategory('restraint-furniture-confinement')?.practiceIds, id).toContain(id);
    }
    expect(seed('stocks-restraint')?.es).toBe('Cepo de inmovilización');
    expect(seed('stocks-restraint')?.descriptionEs).toContain('aberturas');
  });

  it('uses human role wording across the reviewed orgasm, restraint, psychological and advanced sections', () => {
    const reviewedSubcategoryIds = new Set([
      'orgasm-delay-denial', 'orgasm-altered-overstimulation', 'orgasm-command-permission',
      'restraint-rope-foundations', 'restraint-cuffs-materials', 'restraint-body-positioning',
      'restraint-sensory-access', 'restraint-gags-mouth', 'restraint-furniture-confinement',
      'psychological-praise-worship', 'psychological-humiliation-degradation',
      'psychological-objectification-service', 'psychological-verbal-teasing', 'psychological-anticipation-fear',
      'power-service', 'power-ownership-symbols',
      'edge-breath-control', 'edge-puncture-cutting-heat-electric', 'edge-genital-chest-pain',
      'edge-advanced-restraint', 'edge-ordeal-helplessness',
    ]);
    const reviewedIds = new Set(CATALOGUE_V3_SUBCATEGORIES
      .filter((item) => reviewedSubcategoryIds.has(item.id))
      .flatMap((item) => item.practiceIds));
    const generic = new Set(['Give / do', 'Receive', 'Lead / control', 'Follow / receive']);

    for (const current of CURRENT_CATALOGUE_SNAPSHOT.catalogue.practices.filter((item) => reviewedIds.has(item.id))) {
      for (const role of current.roles.filter((item) => ['give', 'receive', 'lead', 'follow'].includes(item.id))) {
        expect(generic.has(role.label), `${current.id}:${role.id} -> ${role.label}`).toBe(false);
      }
    }
  });

  it('adds useful hidden semantic discriminators and keeps closing-pass concepts tagged', () => {
    const tagIds = new Set(CATALOGUE_INSIGHT_TAGS.map((tag) => tag.id));
    for (const id of [
      'anatomy-focus', 'orgasm-focus', 'recording-media', 'voyeuristic-focus', 'exhibitionistic-focus',
      'non-monogamy', 'fluid-focus', 'ownership-symbolism', 'edge-risk',
    ]) expect(tagIds.has(id as never), id).toBe(true);

    expect(insight('edging')?.signals['orgasm-focus']).toBe(0.75);
    expect(insight('private-recording')?.signals['recording-media']).toBe(1);
    expect(insight('erotic-compersion')?.signals['non-monogamy']).toBe(1);
    expect(insight('preagreed-unannounced-watching')?.signals['voyeuristic-focus']).toBe(1);
    expect(insight('collaring')?.signals['ownership-symbolism']).toBe(1);
    expect(insight('breath-play')?.signals['edge-risk']).toBe(1);
    expect(insight('vagina')?.signals['anatomy-focus']).toBe(1);
    expect(insight('semen-cleanup-oral-creampie')?.signals['fluid-focus']).toBe(1);
    expect(insight('st-andrews-cross-restraint')?.signals['physical-restraint']).toBe(1);
  });

  it('keeps own urine, blood and scat as answer roles inside the relevant practice', () => {
    const ids = ['urine-play', 'urine-drinking', 'blood-play', 'blood-on-body', 'blood-drinking', 'scat-on-body', 'scat-in-mouth', 'scat-ingestion'];
    for (const id of ids) {
      expect(seed(id)?.kind, id).toBe('directed-self');
      expect(seed(id)?.counterpartScoped, id).toBe(true);
      expect(practice(id)?.roles.map((role) => role.id), id).toEqual(['give', 'receive', 'self']);
    }
    expect(practice('urine-drinking')?.roles.find((role) => role.id === 'self')?.label).toBe('Drink my own urine');
  });

  it('uses distinct names for vulvar, vaginal and urethral torture', () => {
    expect(seed('pussy-torture')?.es).toBe('Tortura vulvar');
    expect(seed('pussy-torture')?.descriptionEs).toContain('genitales externos');
    expect(seed('vaginal-torture')?.es).toBe('Tortura vaginal');
    expect(seed('vaginal-torture')?.descriptionEs).toContain('canal vaginal');
    expect(seed('urethral-torture')?.es).toBe('Tortura uretral');
    expect(seed('urethral-torture')?.descriptionEs).toContain('uretra');
  });
});
