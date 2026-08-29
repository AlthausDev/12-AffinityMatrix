import { relativeGroupCompositionLabel } from './catalogue-context-label';

describe('relative group composition labels', () => {
  it('describes a threesome relative to a male profile', () => {
    expect(relativeGroupCompositionLabel(['male', 'female', 'female'], 'male', 'es'))
      .toBe('Tú (hombre) + dos mujeres');
    expect(relativeGroupCompositionLabel(['male', 'male', 'female'], 'male', 'es'))
      .toBe('Tú (hombre) + un hombre + una mujer');
    expect(relativeGroupCompositionLabel(['male', 'male', 'male'], 'male', 'es'))
      .toBe('Tú (hombre) + dos hombres');
  });

  it('describes a threesome relative to a female profile', () => {
    expect(relativeGroupCompositionLabel(['male', 'male', 'female'], 'female', 'es'))
      .toBe('Tú (mujer) + dos hombres');
    expect(relativeGroupCompositionLabel(['male', 'female', 'female'], 'female', 'es'))
      .toBe('Tú (mujer) + un hombre + una mujer');
    expect(relativeGroupCompositionLabel(['female', 'female', 'female'], 'female', 'es'))
      .toBe('Tú (mujer) + dos mujeres');
  });

  it('falls back when there is no usable profile sex or the user is not part of the composition', () => {
    expect(relativeGroupCompositionLabel(['male', 'female', 'female'], undefined, 'es')).toBeNull();
    expect(relativeGroupCompositionLabel(['female', 'female', 'female'], 'male', 'es')).toBeNull();
  });
});
