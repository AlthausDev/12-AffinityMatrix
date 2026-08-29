import { QuestionnaireService } from '../../application/questionnaire/questionnaire-service';
import { catalogueSnapshotValidator } from '../../domain/catalogue/catalogue-snapshot';
import { CATALOGUE_VERSION_V3, CURRENT_CATALOGUE_VERSION } from '../../domain/catalogue/catalogue-version';
import { createProfile } from '../../domain/profile/profile';
import { CURRENT_CATALOGUE_SNAPSHOT } from './catalogue-v3';
import { CATALOGUE_V3_CONTENT, RETIRED_V3_PRACTICE_IDS } from './v3/content/final';
import { describeCataloguePractice } from './v3/content/practice-description';

const questionnaire = new QuestionnaireService();
const CATEGORY_IDS = [
  'body-fetishes',
  'affection-intimacy',
  'sexual-style',
  'clothing-appearance',
  'manual-masturbation',
  'oral',
  'penetration',
  'sexual-positions',
  'toys',
  'sexual-accessories',
  'orgasm-control',
  'groups',
  'roleplay',
  'exhibitionism',
  'places-settings',
  'power',
  'restraint',
  'psychological',
  'sensation',
  'fluids',
  'taboo-fantasies',
  'surrealism',
  'edge',
] as const;

const allSeeds = () => CATALOGUE_V3_CONTENT.flatMap((category) => category.practices);
const seed = (id: string) => allSeeds().find((practice) => practice.id === id);
const snapshotPractice = (id: string) => CURRENT_CATALOGUE_SNAPSHOT.catalogue.practices
  .find((practice) => practice.id === id);

describe('catalogue v3 snapshot', () => {
  it('is the validated current catalogue with deterministic category ordering', () => {
    const { categories, practices } = CURRENT_CATALOGUE_SNAPSHOT.catalogue;

    expect(CURRENT_CATALOGUE_VERSION).toBe(CATALOGUE_VERSION_V3);
    expect(CURRENT_CATALOGUE_SNAPSHOT.version).toBe(CATALOGUE_VERSION_V3);
    expect(catalogueSnapshotValidator.validate(CURRENT_CATALOGUE_SNAPSHOT)).toEqual([]);
    expect(categories.map((category) => category.id)).toEqual(CATEGORY_IDS);
    expect(categories.map((category) => category.order)).toEqual([...Array(CATEGORY_IDS.length).keys()]);
    expect(practices.length).toBeGreaterThanOrEqual(350);

    for (const category of categories) {
      const count = practices.filter((practice) => practice.categoryId === category.id).length;
      expect(count, `${category.id} should remain meaningfully populated`).toBeGreaterThanOrEqual(6);
    }
  });

  it('materializes a bilingual practice-specific description for every final practice', () => {
    const practices = allSeeds();
    const legacyGenericDescriptions = new Set([
      'Se valora por separado hacerlo a la pareja y recibirlo de ella.',
      'Práctica compartida cuya preferencia se valora como participación conjunta.',
      'Giving this to a partner and receiving it from them are rated separately.',
      'A shared practice rated as joint participation.',
    ]);

    const esDescriptions = new Set<string>();
    const enDescriptions = new Set<string>();
    for (const practice of practices) {
      expect(practice.descriptionEs?.trim().length, `${practice.id} missing Spanish description`).toBeGreaterThan(0);
      expect(practice.descriptionEn?.trim().length, `${practice.id} missing English description`).toBeGreaterThan(0);
      expect(legacyGenericDescriptions.has(practice.descriptionEs ?? ''), practice.id).toBe(false);
      expect(legacyGenericDescriptions.has(practice.descriptionEn ?? ''), practice.id).toBe(false);
      expect(describeCataloguePractice(practice, 'es')).toBe(practice.descriptionEs);
      expect(describeCataloguePractice(practice, 'en')).toBe(practice.descriptionEn);
      esDescriptions.add(practice.descriptionEs!);
      enDescriptions.add(practice.descriptionEn!);
    }

    expect(esDescriptions.size).toBe(practices.length);
    expect(enDescriptions.size).toBe(practices.length);
  });

  it('keeps labels bilingual, unique after normalization, and free of repeated consent wording', () => {
    const practices = allSeeds();
    const redundantConsent = /consensual|consensuad[oa]s?|consentid[oa]s?/i;

    for (const locale of ['en', 'es'] as const) {
      const seen = new Map<string, string>();
      for (const practice of practices) {
        const label = locale === 'es' ? practice.es : practice.en;
        expect(label.trim().length, `${practice.id} missing ${locale} label`).toBeGreaterThan(0);
        expect(label).not.toMatch(redundantConsent);
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

  it('keeps retired aliases out of the final projection', () => {
    const ids = new Set(allSeeds().map((practice) => practice.id));
    for (const retiredId of RETIRED_V3_PRACTICE_IDS) expect(ids.has(retiredId), retiredId).toBe(false);

    expect(ids.has('full-body-massage')).toBe(false);
    expect(ids.has('watch-partner-masturbate')).toBe(true);
    expect(ids.has('masturbation-in-front-of-partner')).toBe(false);
    expect(ids.has('remote-control-toy')).toBe(true);
    expect(ids.has('app-controlled-toy')).toBe(false);
    expect(ids.has('pet-play')).toBe(false);
    expect(ids.has('pet-play-soft')).toBe(true);
    expect(ids.has('pet-play-intense')).toBe(true);
  });

  it('groups affection and intimacy by related forms of contact', () => {
    const ids = CATALOGUE_V3_CONTENT.find((category) => category.id === 'affection-intimacy')
      ?.practices.map((practice) => practice.id);

    expect(ids).toEqual([
      'kissing',
      'making-out',
      'verbal-affection',
      'holding-hands',
      'hair-stroking',
      'face-caressing',
      'back-rubs',
      'skin-to-skin-contact',
      'cuddling',
      'spooning',
      'sleeping-naked-together',
      'showering-together',
      'bathing-together',
      'sensual-massage',
    ]);
  });

  it('uses practice-specific verbs instead of generic give/do wording where the action is obvious', () => {
    expect(seed('kissing')?.roleLabels?.give?.es).toBe('Besar a mi pareja');
    expect(seed('kissing')?.roleLabels?.receive?.es).toBe('Que me besen');
    expect(snapshotPractice('kissing')?.roles.map((role) => role.label)).toEqual(['Kiss my partner', 'Be kissed']);

    expect(seed('hair-stroking')?.roleLabels?.give?.es).toBe('Acariciar el pelo de mi pareja');
    expect(seed('sensual-massage')?.roleLabels?.receive?.es).toBe('Recibir un masaje sensual');
  });

  it('separates sexual positions from penetration mechanics and groups the positions coherently', () => {
    const positions = CATALOGUE_V3_CONTENT.find((category) => category.id === 'sexual-positions');
    const positionIds = positions?.practices.map((practice) => practice.id);

    expect(positionIds).toEqual([
      'missionary',
      'side-by-side-face-to-face',
      'kneeling-face-to-face',
      'seated-penetration',
      'lotus-position',
      'cowgirl',
      'reverse-cowgirl',
      'doggy-style',
      'prone-rear-entry',
      'spooning-penetration',
      'legs-on-shoulders',
      'butterfly-position',
      't-position',
      'standing-penetration',
      'against-wall',
      'standing-carry',
      'wheelbarrow-position',
      'bridge-position',
      'sixty-nine',
      'face-sitting',
      'oral-kneeling-standing-position',
      'oral-lying-between-legs-position',
      'oral-side-lying-position',
      'oral-edge-position',
    ]);
    expect(snapshotPractice('missionary')?.categoryId).toBe('sexual-positions');
    expect(snapshotPractice('side-by-side-face-to-face')?.categoryId).toBe('sexual-positions');
    expect(snapshotPractice('wheelbarrow-position')?.categoryId).toBe('sexual-positions');
    expect(snapshotPractice('sixty-nine')?.categoryId).toBe('sexual-positions');
    expect(snapshotPractice('vaginal-penetration')?.categoryId).toBe('penetration');
  });

  it('keeps toy target sites anatomically and practically useful without excluding valid oral use', () => {
    const sites = (id: string) => seed(id)?.targetSites;

    expect(sites('vibrator')).toEqual(['external-genitals', 'mouth', 'vaginal', 'anal']);
    expect(sites('wand-vibrator')).toEqual(['external-genitals', 'nipples']);
    expect(sites('rabbit-vibrator')).toEqual(['external-genitals', 'vaginal']);
    expect(sites('clitoral-suction-toy')).toEqual(['external-genitals', 'nipples']);
    expect(sites('kegel-balls')).toEqual(['vaginal']);
    expect(sites('remote-control-toy')).toEqual(['external-genitals', 'vaginal', 'anal']);
    expect(sites('wearable-vibrator')).toEqual(['external-genitals', 'vaginal', 'anal']);
    expect(sites('strapless-strap-on')).toEqual(['mouth', 'vaginal', 'anal']);
    expect(sites('sex-machine')).toEqual(['mouth', 'vaginal', 'anal']);
    expect(sites('vacuum-cup-toys')).toEqual(['mouth', 'vaginal', 'anal']);
    expect(sites('pinwheel')).toEqual(['body']);
  });

  it('groups toys and accessories by family instead of mixing both categories', () => {
    const toyIds = CATALOGUE_V3_CONTENT.find((category) => category.id === 'toys')
      ?.practices.map((practice) => practice.id) ?? [];
    const accessoryIds = CATALOGUE_V3_CONTENT.find((category) => category.id === 'sexual-accessories')
      ?.practices.map((practice) => practice.id) ?? [];

    expect(toyIds.slice(0, 6)).toEqual([
      'vibrator',
      'wand-vibrator',
      'bullet-vibrator',
      'rabbit-vibrator',
      'wearable-vibrator',
      'remote-control-toy',
    ]);
    expect(toyIds.indexOf('dildo')).toBeLessThan(toyIds.indexOf('anal-plug'));
    expect(toyIds.indexOf('anal-plug')).toBeLessThan(toyIds.indexOf('strap-on'));
    expect(toyIds).not.toContain('cock-ring');
    expect(accessoryIds).toContain('cock-ring');
    expect(accessoryIds).toContain('sex-machine');
    expect(snapshotPractice('cock-ring')?.categoryId).toBe('sexual-accessories');
    expect(snapshotPractice('everyday-object-play')?.categoryId).toBe('sexual-accessories');
  });

  it('adds blood and scat preferences to fluids while leaving cutting itself in Edge', () => {
    const fluidIds = CATALOGUE_V3_CONTENT.find((category) => category.id === 'fluids')
      ?.practices.map((practice) => practice.id) ?? [];

    expect(fluidIds).toContain('blood-play');
    expect(fluidIds).toContain('blood-on-body');
    expect(fluidIds).toContain('blood-drinking');
    expect(fluidIds).toContain('scat-on-body');
    expect(fluidIds).toContain('scat-in-mouth');
    expect(fluidIds).toContain('scat-ingestion');
    expect(snapshotPractice('blood-play')?.categoryId).toBe('fluids');
    expect(snapshotPractice('cutting-play')?.categoryId).toBe('edge');
  });

  it('never generates anatomically impossible oral variants even when filtered questions are revealed', () => {
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

  it('keeps performer anatomy separate from receiver anatomy for ejaculation practices', () => {
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
});
