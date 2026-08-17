export const SEX_VALUES = ['male', 'female'] as const;
export type Sex = (typeof SEX_VALUES)[number];

export const ORIENTATION_VALUES = ['heterosexual', 'homosexual', 'bisexual'] as const;
export type SexualOrientation = (typeof ORIENTATION_VALUES)[number];

export const PROFILE_ALIAS_MAX_LENGTH = 80;

export interface ProfileMetadata {
  readonly alias?: string;
  readonly sex?: Sex;
  readonly orientation?: SexualOrientation;
}
