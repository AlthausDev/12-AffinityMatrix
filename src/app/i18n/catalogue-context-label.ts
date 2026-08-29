import { Sex } from '../../domain/profile/profile-metadata';
import { Locale } from './locale';

export function relativeGroupCompositionLabel(
  composition: readonly Sex[] | undefined,
  selfSex: Sex | undefined,
  locale: Locale,
): string | null {
  if (!composition || composition.length !== 3 || !selfSex) return null;

  const others = [...composition];
  const selfIndex = others.indexOf(selfSex);
  if (selfIndex < 0) return null;
  others.splice(selfIndex, 1);

  const maleCount = others.filter((sex) => sex === 'male').length;
  const femaleCount = others.length - maleCount;
  const self = locale === 'es'
    ? `Tú (${selfSex === 'male' ? 'hombre' : 'mujer'})`
    : `You (${selfSex === 'male' ? 'man' : 'woman'})`;

  if (locale === 'es') {
    if (maleCount === 2) return `${self} + dos hombres`;
    if (femaleCount === 2) return `${self} + dos mujeres`;
    return `${self} + un hombre + una mujer`;
  }

  if (maleCount === 2) return `${self} + two men`;
  if (femaleCount === 2) return `${self} + two women`;
  return `${self} + one man + one woman`;
}
