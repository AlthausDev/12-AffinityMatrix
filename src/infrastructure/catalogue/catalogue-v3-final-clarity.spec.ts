import { QuestionnaireService } from '../../application/questionnaire/questionnaire-service';
import { createProfile } from '../../domain/profile/profile';
import { CURRENT_CATALOGUE_SNAPSHOT } from './catalogue-v3';
import { CATALOGUE_V3_CONTENT, RETIRED_V3_PRACTICE_IDS } from './v3/content/final';
import { PROFILE_PHYSICAL_PREFERENCE_PRACTICE_IDS } from './v3/content/physical-preferences-extraction';

const questionnaire = new QuestionnaireService();
const seed = (id: string) => CATALOGUE_V3_CONTENT
  .flatMap((category) => category.practices)
  .find((practice) => practice.id === id);
const categoryOf = (id: string) => CATALOGUE_V3_CONTENT
  .find((category) => category.practices.some((practice) => practice.id === id))?.id;

describe('Catalogue V3 final clarity pass', () => {
  it('explains sexual-style terms as distinct concepts instead of near-synonyms', () => {
    for (const id of [
      'romantic-sex',
      'passionate-sex',
      'playful-sex',
      'competitive-sex',
      'slow-sex',
      'quickies',
      'extended-foreplay',
    ]) {
      expect(seed(id)?.descriptionEs?.length, id).toBeGreaterThan(120);
      expect(seed(id)?.descriptionEn?.length, id).toBeGreaterThan(120);
    }

    expect(seed('romantic-sex')?.descriptionEs).toContain('tono romántico');
    expect(seed('passionate-sex')?.descriptionEs).toContain('no significa necesariamente brusco');
    expect(seed('slow-sex')?.descriptionEs).toContain('Describe el ritmo');
  });

  it('makes manual practices explicit and moves hand-over-mouth to restraint', () => {
    expect(categoryOf('hand-over-mouth')).toBe('restraint');
    expect(seed('hand-over-mouth')?.descriptionEs).toContain('Tapar la boca');
    expect(seed('hand-over-mouth')?.descriptionEs).toContain('no implica tapar la nariz');
    expect(seed('solo-masturbation')?.descriptionEs).toContain('estando a solas');
    expect(seed('masturbating-together')?.descriptionEs).toContain('se masturban a sí mismas');
    expect(seed('mutual-handjobs')?.descriptionEs).toContain('se estimulan manualmente entre sí');
  });

  it('keeps penetration depth, pace and intensity distinct and adds multi-orifice combinations', () => {
    expect(seed('deep-penetration')?.descriptionEs).toContain('hasta dónde llega');
    expect(seed('slow-penetration')?.descriptionEs).toContain('velocidad del movimiento');
    expect(seed('rough-penetration')?.descriptionEs).toContain('mayor fuerza física');

    for (const id of [
      'simultaneous-vaginal-anal-penetration',
      'simultaneous-vaginal-oral-penetration',
      'simultaneous-anal-oral-penetration',
      'simultaneous-vaginal-anal-oral-penetration',
    ]) {
      expect(categoryOf(id), id).toBe('penetration');
      expect(seed(id)?.kind, id).toBe('directed');
    }
    expect(seed('simultaneous-vaginal-anal-penetration')?.anatomySex).toBe('female');
    expect(seed('simultaneous-anal-oral-penetration')?.anatomySex).toBeUndefined();
  });

  it('condenses dildo families while keeping oral use on penetrative toys', () => {
    for (const retired of ['realistic-dildo', 'glass-dildo', 'metal-dildo']) {
      expect(RETIRED_V3_PRACTICE_IDS.has(retired), retired).toBe(true);
      expect(seed(retired), retired).toBeUndefined();
    }

    expect(seed('dildo')?.es).toBe('Dildo / dildo realista');
    expect(seed('special-material-dildo')?.targetSites).toEqual(['mouth', 'vaginal', 'anal']);
    expect(seed('fantasy-shaped-dildo')?.targetSites).toEqual(['mouth', 'vaginal', 'anal']);
    expect(seed('fantasy-shaped-dildo')?.descriptionEs).toContain('no a actividad sexual con animales reales');
  });

  it('makes edging, denial and orgasm control explicitly different', () => {
    expect(seed('edging')?.descriptionEs).toContain('Puede permitirse finalmente el orgasmo');
    expect(seed('orgasm-denial')?.descriptionEs).toContain('terminar sin permitir ningún orgasmo');
    expect(seed('orgasm-control')?.descriptionEs).toContain('Dinámica más amplia');
    expect(seed('no-orgasm-sex')?.descriptionEs).toContain('no tiene por qué haber una persona controlando');
  });

  it('keeps erotic body focuses while extracting neutral appearance ratings to the profile', () => {
    expect(seed('breasts')).toBeUndefined();
    expect(seed('chest')).toBeUndefined();
    expect(seed('chest-general')?.es).toBe('Pecho');
    expect(categoryOf('chest-general')).toBe('body-fetishes');
    expect(categoryOf('buttocks')).toBe('body-fetishes');
    expect(categoryOf('penis')).toBe('body-fetishes');

    for (const id of PROFILE_PHYSICAL_PREFERENCE_PRACTICE_IDS) {
      expect(seed(id), id).toBeUndefined();
      expect(RETIRED_V3_PRACTICE_IDS.has(id), id).toBe(true);
    }

    for (const id of [
      'hair-length-long', 'facial-hair', 'stature-tall', 'muscles', 'curvy-build',
      'breast-size-large', 'buttocks-size-large', 'penis-size-large', 'tattoos', 'piercings',
    ]) {
      expect(PROFILE_PHYSICAL_PREFERENCE_PRACTICE_IDS.has(id), id).toBe(true);
    }
  });

  it('adds adult-only caregiver/little and umbrella taboo/surreal fantasy without implying minors', () => {
    const caregiver = seed('caregiver-little-adult-roleplay');
    expect(caregiver?.kind).toBe('paired');
    expect(caregiver?.pairedRoles?.map((role) => role.id)).toEqual(['caregiver', 'little']);
    expect(caregiver?.descriptionEs).toContain('exclusivamente entre adultos');
    expect(caregiver?.descriptionEs).toContain('«Little» significa siempre un rol interpretado por una persona adulta');
    expect(seed('surreal-fantasy-roleplay')?.descriptionEs).toContain('anatomías imposibles');
    expect(seed('adult-taboo-fantasy')?.descriptionEs).toContain('adultas todas las personas reales participantes');
  });

  it('distinguishes controlled exposure from voyeurism and avoids uninvolved bystanders', () => {
    expect(seed('curtains-open-private')).toBeUndefined();
    expect(categoryOf('risk-of-being-seen')).toBe('exhibitionism');
    expect(seed('risk-of-being-seen')?.descriptionEs).toContain('no exponga deliberadamente a terceros ajenos');
    expect(seed('semi-public-consensual-scene')?.es).toBe('Sexo en lugar público o semipúblico controlado');
    expect(seed('semi-public-consensual-scene')?.descriptionEs).toContain('sin implicar deliberadamente a terceros ajenos');
  });

  it('applies female anatomy only to multi-orifice combinations that include the vagina', () => {
    const man = createProfile({
      id: 'man',
      now: '2026-08-23T00:00:00.000Z',
      metadata: { sex: 'male', orientation: 'bisexual' },
    });
    const woman = createProfile({
      id: 'woman',
      now: '2026-08-23T00:00:00.000Z',
      metadata: { sex: 'female', orientation: 'bisexual' },
    });

    const manPenetration = questionnaire.getCategory(CURRENT_CATALOGUE_SNAPSHOT, man, 'penetration', true);
    const womanPenetration = questionnaire.getCategory(CURRENT_CATALOGUE_SNAPSHOT, woman, 'penetration', true);

    const manTriple = manPenetration?.practices.find((item) => item.practice.id === 'simultaneous-vaginal-anal-oral-penetration');
    const womanTriple = womanPenetration?.practices.find((item) => item.practice.id === 'simultaneous-vaginal-anal-oral-penetration');
    const manAnalOral = manPenetration?.practices.find((item) => item.practice.id === 'simultaneous-anal-oral-penetration');

    expect(manTriple?.roles.some((role) => role.role.id === 'receive')).toBe(false);
    expect(womanTriple?.roles.some((role) => role.role.id === 'receive')).toBe(true);
    expect(manAnalOral?.roles.some((role) => role.role.id === 'receive')).toBe(true);
  });
});
