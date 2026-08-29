export interface QuestionnaireSubcategoryProgress {
  readonly id: string;
  readonly answered: number;
  readonly total: number;
}

export function isSubcategoryComplete(section: QuestionnaireSubcategoryProgress): boolean {
  return section.answered >= section.total;
}

export function firstPendingSubcategoryId(
  sections: readonly QuestionnaireSubcategoryProgress[],
): string | null {
  return sections.find((section) => !isSubcategoryComplete(section))?.id ?? null;
}

export function nextPendingSubcategoryId(
  sections: readonly QuestionnaireSubcategoryProgress[],
  completedId: string,
): string | null {
  const completedIndex = sections.findIndex((section) => section.id === completedId);
  if (completedIndex < 0) return firstPendingSubcategoryId(sections);

  const following = sections
    .slice(completedIndex + 1)
    .find((section) => !isSubcategoryComplete(section));
  if (following) return following.id;

  return sections
    .slice(0, completedIndex)
    .find((section) => !isSubcategoryComplete(section))?.id ?? null;
}
