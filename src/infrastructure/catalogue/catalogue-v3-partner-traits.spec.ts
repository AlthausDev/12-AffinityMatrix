import { CURRENT_CATALOGUE_SNAPSHOT } from './catalogue-v3';
import { CATALOGUE_V3_CONTENT } from './v3/content/final';

describe('Catalogue V3 partner physical traits', () => {
  const category = () => CATALOGUE_V3_CONTENT.find((candidate) => candidate.id === 'body-fetishes');
  const seed = (id: string) => category()?.practices.find((practice) => practice.id === id);
  const practice = (id: string) => CURRENT_CATALOGUE_SNAPSHOT.catalogue.practices
    .find((candidate) => candidate.id === id);

  it('covers size, hair, stature and build preferences without fixed measurement cutoffs', () => {
    expect(category()?.es).toBe('Cuerpo, rasgos físicos y fetiches');
    expect(category()?.en).toBe('Body, physical traits & fetishes');

    expect(category()?.practices.map((item) => item.id)).toEqual(expect.arrayContaining([
      'penis-size-small',
      'penis-size-average',
      'penis-size-large',
      'breast-size-small',
      'breast-size-average',
      'breast-size-large',
      'hair-length-short',
      'hair-length-medium',
      'hair-length-long',
      'shaved-bald-head',
      'facial-hair',
      'stature-short',
      'stature-average',
      'stature-tall',
      'slim-build',
      'curvy-build',
      'stocky-build',
    ]));

    expect(seed('penis-size-small')?.descriptionEs).toContain('preferencia subjetiva');
    expect(seed('breast-size-large')?.descriptionEn).toContain('subjective preference');
    expect(seed('hair-length-long')?.descriptionEs).toContain('no fija una longitud exacta');
    expect(seed('stature-tall')?.descriptionEn).toContain('without setting a fixed height cutoff');
  });

  it('applies sex-specific anatomy only where the physical trait requires it', () => {
    expect(seed('penis-size-large')?.anatomySex).toBe('male');
    expect(seed('breast-size-large')?.anatomySex).toBe('female');
    expect(seed('hair-length-long')?.anatomySex).toBeUndefined();
    expect(seed('stature-tall')?.anatomySex).toBeUndefined();

    const penisRole = practice('penis-size-large')?.roles[0];
    const breastRole = practice('breast-size-large')?.roles[0];
    const hairRole = practice('hair-length-long')?.roles[0];

    expect(penisRole?.id).toBe('interest');
    expect(penisRole?.contextAxes).toEqual(['counterpartSex']);
    expect(penisRole?.applicability?.partnerSex).toEqual(['male']);
    expect(breastRole?.applicability?.partnerSex).toEqual(['female']);
    expect(hairRole?.applicability).toBeUndefined();
  });
});
