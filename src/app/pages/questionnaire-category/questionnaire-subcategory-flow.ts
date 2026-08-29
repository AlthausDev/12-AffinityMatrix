export interface QuestionnaireSubcategoryProgress {
  readonly id: string;
  readonly answered: number;
  readonly total: number;
  /**
   * When the caller can provide the rendered practice/role structure, progression is stricter than
   * the practice-level progress meter: every visible role option must have an answer before the
   * accordion advances. This prevents the last partially answered practice from closing the
   * subcategory just because that practice already counts as "answered" in progress summaries.
   */
  readonly practices?: readonly {
    readonly roles: readonly { readonly answer?: unknown }[];
  }[];
}

export function isSubcategoryComplete(section: QuestionnaireSubcategoryProgress): boolean {
  if (section.practices) {
    const roles = section.practices.flatMap((practice) => practice.roles);
    return roles.length > 0 && roles.every((role) => role.answer !== undefined);
  }

  return section.answered >= section.total;
}

export function firstPendingSubcategoryId(
  sections: readonly QuestionnaireSubcategoryProgress[],
): string | null {
  return sections.find((section) => !isSubcategoryComplete(section))?.id ?? null;
}

export function initialSubcategoryId(
  sections: readonly QuestionnaireSubcategoryProgress[],
  requestedId?: string | null,
): string | null {
  if (requestedId && sections.some((section) => section.id === requestedId)) return requestedId;
  return firstPendingSubcategoryId(sections);
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
