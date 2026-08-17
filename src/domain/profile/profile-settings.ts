export interface ProfileSettings {
  readonly filterQuestionnaireByMetadata: boolean;
}

export const DEFAULT_PROFILE_SETTINGS: ProfileSettings = {
  filterQuestionnaireByMetadata: true,
};
