import {
  CATALOGUE_INSIGHT_TAGS as CATALOGUE_CORE_INSIGHT_TAGS,
  CATALOGUE_V3_PRACTICE_INSIGHTS as CATALOGUE_CORE_PRACTICE_INSIGHTS,
} from './catalogue-insights-core';
import { applyCatalogueInsightClosingPass } from './catalogue-insights-closing-pass';
import { applyCatalogueInsightFinalPass } from './catalogue-insights-final-pass';
import {
  applyManualInsightReview,
  MANUAL_REVIEW_INSIGHT_TAGS,
  MANUAL_REVIEW_NEW_PRACTICE_INSIGHTS,
} from './catalogue-insights-manual-review';
import {
  CATALOGUE_REMAINING_INSIGHT_TAGS,
  CATALOGUE_V3_REMAINING_PRACTICE_INSIGHTS,
} from './catalogue-insights-remaining';
import { applyCatalogueInsightReleaseAudit } from './catalogue-insights-release-audit';
import { applyCatalogueInsightNoiseCleanup } from './catalogue-insights-noise-cleanup';

/** Complete reusable semantic vocabulary for Catalogue V3. */
export const CATALOGUE_INSIGHT_TAGS = [
  ...CATALOGUE_CORE_INSIGHT_TAGS,
  ...CATALOGUE_REMAINING_INSIGHT_TAGS,
  ...MANUAL_REVIEW_INSIGHT_TAGS,
] as const;

const BASE_PRACTICE_INSIGHTS = [
  ...CATALOGUE_CORE_PRACTICE_INSIGHTS,
  ...CATALOGUE_V3_REMAINING_PRACTICE_INSIGHTS,
] as const;

const MANUALLY_REVIEWED_INSIGHTS = [
  ...applyManualInsightReview(BASE_PRACTICE_INSIGHTS),
  ...MANUAL_REVIEW_NEW_PRACTICE_INSIGHTS,
] as const;
const FINAL_PASS_INSIGHTS = applyCatalogueInsightFinalPass(MANUALLY_REVIEWED_INSIGHTS);
const CLOSING_PASS_INSIGHTS = applyCatalogueInsightClosingPass(FINAL_PASS_INSIGHTS);
const RELEASE_AUDITED_INSIGHTS = applyCatalogueInsightReleaseAudit(CLOSING_PASS_INSIGHTS);

/** Semantic signals for every practice in every final 0.2 questionnaire category. */
export const CATALOGUE_V3_PRACTICE_INSIGHTS = applyCatalogueInsightNoiseCleanup(RELEASE_AUDITED_INSIGHTS);
