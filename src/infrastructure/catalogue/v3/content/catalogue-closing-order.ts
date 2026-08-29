import { CatalogueCategorySeed, CataloguePracticeSeed } from './types';

/** Places closing-pass additions beside the concepts they refine instead of leaving them at the end. */
export function applyCatalogueClosingOrder(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  return content.map((category) => ({
    ...category,
    practices: reorderCategory(category.id, category.practices),
  }));
}

function reorderCategory(categoryId: string, practices: readonly CataloguePracticeSeed[]): readonly CataloguePracticeSeed[] {
  let result = [...practices];

  switch (categoryId) {
    case 'groups':
      result = moveAfter(result, 'watching-partner-with-other', ['erotic-compersion']);
      break;
    case 'exhibitionism':
      result = moveAfter(result, 'voyeurism', ['preagreed-unannounced-watching']);
      break;
    case 'places-settings':
      result = moveAfter(result, 'sex-in-hotel', [
        'sex-in-office-after-hours',
        'sex-in-abandoned-place',
        'sex-on-secluded-beach',
        'sex-while-camping',
      ]);
      break;
    case 'power':
      result = moveAfter(result, 'erotic-presentation-service', [
        'footwear-service',
        'fetish-gear-service',
      ]);
      break;
    case 'restraint':
      result = moveBefore(result, 'stocks-restraint', [
        'st-andrews-cross-restraint',
        'bondage-bench-restraint',
        'bondage-chair-restraint',
      ]);
      break;
    case 'fluids':
      result = moveAfter(result, 'semen-cleanup-manual', [
        'semen-cleanup-oral-external',
        'semen-cleanup-oral-creampie',
        'semen-cleanup-other',
      ]);
      break;
  }

  return result;
}

function moveAfter(
  practices: readonly CataloguePracticeSeed[],
  anchorId: string,
  movedIds: readonly string[],
): CataloguePracticeSeed[] {
  const moved = practices.filter((practice) => movedIds.includes(practice.id));
  const rest = practices.filter((practice) => !movedIds.includes(practice.id));
  const anchorIndex = rest.findIndex((practice) => practice.id === anchorId);
  if (anchorIndex < 0) return [...rest, ...moved];
  return [...rest.slice(0, anchorIndex + 1), ...moved, ...rest.slice(anchorIndex + 1)];
}

function moveBefore(
  practices: readonly CataloguePracticeSeed[],
  anchorId: string,
  movedIds: readonly string[],
): CataloguePracticeSeed[] {
  const moved = practices.filter((practice) => movedIds.includes(practice.id));
  const rest = practices.filter((practice) => !movedIds.includes(practice.id));
  const anchorIndex = rest.findIndex((practice) => practice.id === anchorId);
  if (anchorIndex < 0) return [...rest, ...moved];
  return [...rest.slice(0, anchorIndex), ...moved, ...rest.slice(anchorIndex)];
}
