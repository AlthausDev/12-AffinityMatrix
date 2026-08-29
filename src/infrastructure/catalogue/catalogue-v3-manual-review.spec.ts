import { CURRENT_CATALOGUE_SNAPSHOT } from './catalogue-v3';
import { CATALOGUE_V3_PRACTICE_INSIGHTS, CATALOGUE_INSIGHT_TAGS } from './v3/catalogue-insights';
import { CATALOGUE_V3_SUBCATEGORIES } from './v3/catalogue-taxonomy';
import { CATALOGUE_V3_CONTENT } from './v3/content/final';

const seed = (id: string) => CATALOGUE_V3_CONTENT
  .flatMap((category) => category.practices)
  .find((practice) => practice.id === id);
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

  it('expands erotic photography, service, ownership symbolism, fluids and Edge without umbrella duplicates', () => {
    for (const id of [
      'erotic-selfies', 'partner-erotic-photography', 'erotic-photo-session-together',
      'watch-private-recording-together', 'watching-undressing',
      'body-care-service', 'hospitality-service', 'ritual-attendance-service',
      'ownership-token', 'temporary-ownership-marking', 'assigned-submissive-name',
      'semen-on-other-body', 'own-urine-play', 'own-blood-play', 'own-scat-play',
      'ordeal-scene', 'extreme-helplessness-fantasy',
    ]) expect(seed(id), id).toBeDefined();

    expect(seed('semen-on-other-body')?.descriptionEs).toContain('distinta de cara, pecho, glúteos o boca');
    expect(subcategory('fluids-urine-blood-scat')?.practiceIds).toContain('own-urine-play');
    expect(subcategory('edge-ordeal-helplessness')?.practiceIds).toEqual(['ordeal-scene', 'extreme-helplessness-fantasy']);
  });

  it('makes couple-with-third dynamics explicit paired roles instead of ambiguous participation', () => {
    expect(seed('watching-partner-with-other')?.kind).toBe('paired');
    expect(seed('hotwife-dynamic')?.pairedRoles?.map((role) => role.id)).toEqual(['hotwife-role', 'hotwife-partner-role']);
    expect(seed('cuckold-dynamic')?.pairedRoles?.map((role) => role.id)).toEqual(['cuckold-role', 'cuckold-partner-role']);
    expect(seed('cuckquean-dynamic')?.pairedRoles?.map((role) => role.id)).toEqual(['cuckquean-role', 'cuckquean-partner-role']);
    expect(seed('hotwife-dynamic')?.descriptionEs).toContain('La humillación no es necesaria');
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

    for (const practice of CURRENT_CATALOGUE_SNAPSHOT.catalogue.practices.filter((item) => reviewedIds.has(item.id))) {
      for (const role of practice.roles.filter((item) => ['give', 'receive', 'lead', 'follow'].includes(item.id))) {
        expect(generic.has(role.label), `${practice.id}:${role.id} -> ${role.label}`).toBe(false);
      }
    }
  });

  it('adds useful hidden semantic discriminators and tags every newly added practice', () => {
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
  });

  it('sex-scopes partner urine, blood and scat roles while keeping own-fluid interests separate', () => {
    for (const id of ['urine-play', 'urine-drinking', 'blood-play', 'blood-on-body', 'blood-drinking', 'scat-on-body', 'scat-in-mouth', 'scat-ingestion']) {
      expect(seed(id)?.counterpartScoped, id).toBe(true);
    }
    for (const id of ['own-urine-play', 'own-blood-play', 'own-scat-play']) {
      expect(seed(id)?.kind, id).toBe('self');
      expect(seed(id)?.counterpartScoped, id).not.toBe(true);
    }
  });
});
