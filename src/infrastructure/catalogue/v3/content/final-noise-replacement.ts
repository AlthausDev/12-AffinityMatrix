import { CatalogueCategorySeed, CataloguePracticeSeed } from './types';

const NOVELTY_FOCUSED_SEX: CataloguePracticeSeed = {
  id: 'novelty-focused-sex',
  en: 'Exploratory / novelty-focused sex',
  es: 'Sexo exploratorio / centrado en la novedad',
  kind: 'mutual',
  counterpartScoped: true,
  descriptionEn: 'An encounter where deliberately changing routines, trying unfamiliar ideas or introducing novelty is part of the overall style.',
  descriptionEs: 'Un encuentro donde cambiar deliberadamente la rutina, probar ideas poco habituales o introducir novedades forma parte del estilo general.',
};

/** Replaces a retired near-duplicate and materializes the final visible category order. */
export function addFinalNoiseReplacement(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  return content
    .map((category) => {
      if (category.id !== 'sexual-style' || category.practices.some((practice) => practice.id === NOVELTY_FOCUSED_SEX.id)) {
        return category;
      }
      const anchor = category.practices.findIndex((practice) => practice.id === 'immersive-focused-sex');
      const insertAt = anchor < 0 ? category.practices.length : anchor + 1;
      return {
        ...category,
        practices: [
          ...category.practices.slice(0, insertAt),
          NOVELTY_FOCUSED_SEX,
          ...category.practices.slice(insertAt),
        ],
      };
    })
    .sort((left, right) => left.order - right.order);
}
