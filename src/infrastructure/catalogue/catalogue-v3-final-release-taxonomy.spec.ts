import { CURRENT_CATALOGUE_SNAPSHOT } from './catalogue-v3';
import { CATALOGUE_V3_CONTENT, RETIRED_V3_PRACTICE_IDS } from './v3/content/final';

const category = (id: string) => CATALOGUE_V3_CONTENT.find((candidate) => candidate.id === id);
const practice = (id: string) => CATALOGUE_V3_CONTENT
  .flatMap((candidate) => candidate.practices)
  .find((candidate) => candidate.id === id);
const categoryOf = (id: string) => CATALOGUE_V3_CONTENT
  .find((candidate) => candidate.practices.some((item) => item.id === id))?.id;

describe('Catalogue V3 final release taxonomy', () => {
  it('places taboo and surrealism near the end while keeping Edge last', () => {
    const ids = CATALOGUE_V3_CONTENT.map((item) => item.id);
    expect(ids.slice(-3)).toEqual(['taboo-fantasies', 'surrealism', 'edge']);
    expect(category('taboo-fantasies')?.es).toBe('Fantasías tabú');
    expect(category('surrealism')?.es).toBe('Surrealismo y fantasías imposibles');
    expect(CURRENT_CATALOGUE_SNAPSHOT.catalogue.categories.map((item) => item.id).slice(-3))
      .toEqual(['taboo-fantasies', 'surrealism', 'edge']);
  });

  it('moves taboo concepts out of general roleplay without duplicating them', () => {
    for (const id of [
      'adult-taboo-fantasy',
      'caregiver-little-adult-roleplay',
      'consensual-non-consent-roleplay',
      'sleep-roleplay',
    ]) {
      expect(categoryOf(id), id).toBe('taboo-fantasies');
    }

    expect(practice('family-role-taboo-fantasy')?.descriptionEs).toContain('no a menores');
    expect(practice('adult-ageplay-roleplay')?.descriptionEs).toContain('todas las personas reales participantes son adultas');
    expect(practice('death-corpse-roleplay')?.descriptionEs).toContain('ninguna persona realmente fallecida');
    expect(practice('free-use-unaware-roleplay')?.descriptionEs).toContain('se acuerdan de antemano');
    expect(practice('public-use-fantasy')?.descriptionEs).toContain('no implicar a terceros ajenos');
  });

  it('keeps nearby taboo concepts explicitly distinct', () => {
    expect(practice('caregiver-little-adult-roleplay')?.descriptionEs)
      .toContain('no exige fingir otra edad');
    expect(practice('caregiver-little-adult-roleplay')?.descriptionEs)
      .toContain('se valora aparte en Ageplay');
    expect(practice('consensual-non-consent-roleplay')?.descriptionEs)
      .toContain('A diferencia de free-use/unaware');
    expect(practice('sleep-roleplay')?.descriptionEs)
      .toContain('forma parte de la simulación');
  });

  it('keeps extremist symbolism as a neutral taboo-fantasy descriptor rather than endorsement', () => {
    const symbolism = practice('extremist-war-symbolism-fantasy');
    expect(categoryOf(symbolism?.id ?? '')).toBe('taboo-fantasies');
    expect(symbolism?.descriptionEs).toContain('nazi');
    expect(symbolism?.descriptionEs).toContain('no implica apoyar la ideología');
  });

  it('gives surreal fantasies their own concrete, well-explained catalogue', () => {
    for (const id of [
      'surreal-fantasy-roleplay',
      'tentacle-fantasy',
      'furry-anthro-fantasy',
      'transformation-fantasy',
      'futanari-fantasy',
      'monster-roleplay',
      'alien-fantasy',
      'size-change-fantasy',
      'extra-anatomy-fantasy',
      'vore-fantasy',
    ]) {
      expect(categoryOf(id), id).toBe('surrealism');
      expect(practice(id)?.descriptionEs?.length, id).toBeGreaterThan(80);
    }

    expect(practice('tentacle-fantasy')?.descriptionEs).toContain('tentáculos');
    expect(practice('furry-anthro-fantasy')?.descriptionEs).toContain('no a actividad sexual con animales reales');
    expect(practice('futanari-fantasy')?.descriptionEs).toContain('no pretende etiquetar a personas intersexuales reales');
    expect(practice('monster-roleplay')?.descriptionEs).toContain('más propia de criaturas que la fantasía furry');
    expect(practice('monster-roleplay')?.descriptionEs).toContain('no a actividad sexual con animales reales');
  });

  it('replaces generic pet play with soft and immersive paired-role variants', () => {
    expect(RETIRED_V3_PRACTICE_IDS.has('pet-play')).toBe(true);
    expect(practice('pet-play')).toBeUndefined();

    const soft = practice('pet-play-soft');
    const intense = practice('pet-play-intense');
    expect(categoryOf('pet-play-soft')).toBe('roleplay');
    expect(categoryOf('pet-play-intense')).toBe('roleplay');
    expect(soft?.pairedRoles?.map((role) => role.id)).toEqual(['handler', 'pet']);
    expect(intense?.pairedRoles?.map((role) => role.id)).toEqual(['handler', 'pet']);
    expect(soft?.descriptionEs).toContain('orejas o cola');
    expect(intense?.descriptionEs).toContain('collar y correa');
    expect(intense?.descriptionEs).toContain('salir de paseo');
    expect(intense?.descriptionEs).toContain('desnudez');
  });

  it('keeps each new category deliberately ordered and free of duplicate practice ids', () => {
    for (const id of ['taboo-fantasies', 'surrealism']) {
      const ids = category(id)?.practices.map((item) => item.id) ?? [];
      expect(ids.length, id).toBeGreaterThan(8);
      expect(new Set(ids).size, id).toBe(ids.length);
    }
  });
});
