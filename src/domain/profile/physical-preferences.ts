export const PHYSICAL_ATTRACTION_MIN_SCORE = 0;
export const PHYSICAL_ATTRACTION_MAX_SCORE = 10;
export const PHYSICAL_ATTRACTION_NEUTRAL_SCORE = 5;

export type PhysicalAttractionScore = number;
export type PhysicalPreferenceValues = Readonly<Record<string, PhysicalAttractionScore>>;
export type PhysicalPreferences = Readonly<Record<string, PhysicalPreferenceValues>>;

export const EMPTY_PHYSICAL_PREFERENCES: PhysicalPreferences = {};

export function clonePhysicalPreferences(
  preferences: PhysicalPreferences | undefined,
): PhysicalPreferences {
  if (!preferences) return {};
  return Object.fromEntries(
    Object.entries(preferences).map(([traitId, values]) => [traitId, { ...values }]),
  );
}

export function normalizePhysicalPreferences(
  preferences: PhysicalPreferences | undefined,
): PhysicalPreferences {
  if (!preferences) return {};
  return Object.fromEntries(
    Object.entries(preferences)
      .map(([traitId, values]) => [traitId, { ...values }] as const)
      .filter(([, values]) => Object.keys(values).length > 0),
  );
}
