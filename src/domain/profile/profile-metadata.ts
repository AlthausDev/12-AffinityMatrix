export const SEX_VALUES = ['male', 'female'] as const;
export type Sex = (typeof SEX_VALUES)[number];

export const ORIENTATION_VALUES = ['heterosexual', 'homosexual', 'bisexual'] as const;
export type SexualOrientation = (typeof ORIENTATION_VALUES)[number];

export interface ProfileMetadata {
  alias?: string;
  sex?: Sex;
  orientation?: SexualOrientation;
  filterByProfileMetadata: boolean;
}
