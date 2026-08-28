import {
  CATALOGUE_INSIGHT_TAGS as CATALOGUE_CORE_INSIGHT_TAGS,
  CATALOGUE_V3_PRACTICE_INSIGHTS as CATALOGUE_CORE_PRACTICE_INSIGHTS,
} from './catalogue-insights-core';
import {
  CATALOGUE_REMAINING_INSIGHT_TAGS,
  CATALOGUE_V3_REMAINING_PRACTICE_INSIGHTS,
} from './catalogue-insights-remaining';

/** Complete reusable semantic vocabulary for Catalogue V3. */
export const CATALOGUE_INSIGHT_TAGS = [
  ...CATALOGUE_CORE_INSIGHT_TAGS,
  ...CATALOGUE_REMAINING_INSIGHT_TAGS,
] as const;

/** Semantic signals for every practice in every final 0.2 questionnaire category. */
export const CATALOGUE_V3_PRACTICE_INSIGHTS = [
  ...CATALOGUE_CORE_PRACTICE_INSIGHTS,
  ...CATALOGUE_V3_REMAINING_PRACTICE_INSIGHTS,
] as const;
