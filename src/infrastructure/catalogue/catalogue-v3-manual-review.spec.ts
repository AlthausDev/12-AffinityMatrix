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

  it('uses distinct exhibitionism, service and cleanup questions instead of release-review duplicates', () => {
    for (const id of [
      'erotic-selfies', 'erotic-photo-session-together', 'erotic-media-exchange',
      'watch-private-recording-together', 'watching-undressing', 'watched-masturbation', 'private-striptease',
      'body-care-service', 'attentive-service', 'pleasure-focused-service', 'erotic-presentation-service',
      'ownership-token', 'temporary-ownership-marking', 'assigned-submissive-name',
      'semen-on-other-body', 'semen-cleanup-manual', 'semen-cleanup-oral', 'semen-cleanup-other',
      'ordeal-scene', 'extreme-helplessness-fantasy',
    ]) expect(seed(id), id).toBeDefined();

    for (const retired of [
      'partner-erotic-photography', 'hospitality-service', 'ritual-attendance-service', 'creampie-cleanup',
      'own-urine-play', 'own-blood-play', 'own-scat-play',
    ]) expect(seed(retired), retired).toBeUndefined();

    expect(seed('semen-on-other-body')?.descriptionEs).toContain('distinta de cara, pecho, glúteos o boca');
    expect(subcategory('fluids-semen-cleanup')?.practiceIds)
      .toEqual(['semen-cleanup-manual', 'semen-cleanup-oral', 'semen-cleanup-other']);
    expect(subcategory('edge-ordeal-helplessness')?.practiceIds).toEqual(['ordeal-scene', 'extreme-helplessness-fantasy']);
  });

  it('makes hotwife, cuckold and cuckquean roles explicit and readable', () => {
    expect(seed('watching-partner-with-other')?.kind).toBe('paired');
    expect(seed('hotwife-dynamic')?.pairedRoles?.map((role) => role.id)).toEqual(['hotwife-role', 'hotwife-partner-role']);
    expect(seed('cuckold-dynamic')?.pairedRoles?.map((role) => role.id)).toEqual(['cuckold-role', 'cuckold-partner-role']);
    expect(seed('cuckquean-dynamic')?.pairedRoles?.map((role) => role.id)).toEqual(['cuckquean-role', 'cuckquean-partner-role']);
    expect(seed('hotwife-dynamic')?.descriptionEs).toContain('foco está en la mujer');
    expect(seed('hotwife-dynamic')?.descriptionEs).toContain('cuckold');
    expect(seed('cuckold-dynamic')?.descriptionEs).toContain('foco está en el hombre');
    expect(seed('cuckold-dynamic')?.descriptionEs).toContain('hotwife');
  });

  it('uses human role wording across the reviewed orgasm, restraint, psychological and advanced sections', () => {
    const reviewedSubcategoryIds = new Set([
      'orgasm-delay-denial', 'orgasm-altered-overstimulation', 'orgasm-command-permission',
      'restraint-rope-foundations', 'restraint-cuffs-materials', 'restraint-body-positioning',
      'restraint-sensory-access', 'restraint-gags-mouth',
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

  it('adds useful hidden semantic discriminators and keeps new concepts tagged', () => {
    const tagIds = new Set(CATALOGUE_INSIGHT_TAGS.map((tag) => tag.id));
    for (const id of [
      'anatomy-focus', 'orgasm-focus', 'recording-media', 'voyeuristic-focus', 'exhibitionistic-focus',
      'non-monogamy', 'fluid-focus', 'ownership-symbolism', 'edge-risk',
    ]) expect(tagIds.has(id as never), id).toBe(true);

    expect(insight('edging')?.signals['orgasm-focus']).toBe(0.75);
    expect(insight('private-recording')?.signals['recording-media']).toBe(1);
    expect(insight('hotwife-dynamic')?.signals['non-monogamy']).toBe(0.75);
    expect(insight('collaring')?.signals['ownership-symbolism']).toBe(1);
    expect(insight('breath-play')?.signals['edge-risk']).toBe(1);
    expect(insight('vagina')?.signals['anatomy-focus']).toBe(1);
    expect(insight('semen-on-other-body')?.signals['fluid-focus']).toBe(1);
    expect(insight('erotic-media-exchange')?.signals['recording-media']).toBe(1);
    expect(insight('semen-cleanup-oral')?.signals['fluid-focus']).toBe(1);
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

  it('uses a cleaner name for female external-genital pain play', () => {
    expect(seed('pussy-torture')?.es).toBe('Juego intenso de dolor vulvar');
    expect(seed('pussy-torture')?.descriptionEs).toContain('no se refiere a la vagina interna');
  });
});
