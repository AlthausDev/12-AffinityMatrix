import { CatalogueCategorySeed, CataloguePracticeSeed } from './types';

/** Practice ids intentionally restored after an earlier pre-release semantic retirement. */
export const REACTIVATED_V3_PRACTICE_IDS = new Set<string>([
  'squirting-on-partner',
  'orgasm-on-command',
]);

const SQUIRTING_ON_PARTNER: CataloguePracticeSeed = {
  id: 'squirting-on-partner',
  en: 'Squirting on a partner',
  es: 'Squirting sobre la pareja',
  kind: 'directed',
  counterpartScoped: true,
  actorSex: 'female',
  descriptionEn: 'Squirting directly onto a partner. This is separate from simply experiencing squirting because the fluid landing on the partner is part of the preference.',
  descriptionEs: 'Hacer squirting directamente sobre la pareja. Se separa de simplemente experimentar squirting porque que el fluido caiga sobre la pareja forma parte de la preferencia.',
  roleLabels: {
    give: { en: 'Squirt on my partner', es: 'Hacer squirting sobre mi pareja' },
    receive: { en: 'Have my partner squirt on me', es: 'Que mi pareja haga squirting sobre mí' },
  },
};

export function addFinalRolePractices(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  return content.map((category) => {
    if (category.id !== 'fluids') return category;
    const withoutDuplicate = category.practices.filter((practice) => practice.id !== SQUIRTING_ON_PARTNER.id);
    return { ...category, practices: [...withoutDuplicate, SQUIRTING_ON_PARTNER] };
  });
}
