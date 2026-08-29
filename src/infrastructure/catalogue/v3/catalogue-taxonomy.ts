export type { CatalogueSubcategorySeed } from './catalogue-taxonomy-core';
import { CATALOGUE_V3_SUBCATEGORIES as CATALOGUE_V3_CORE_SUBCATEGORIES } from './catalogue-taxonomy-core';
import { applyCatalogueTaxonomyClosingPass } from './catalogue-taxonomy-closing-pass';
import { applyCatalogueTaxonomyFinalPass } from './catalogue-taxonomy-final-pass';
import { applyManualTaxonomyReview } from './catalogue-taxonomy-manual-review';
import { applyCatalogueTaxonomyNoiseCleanup } from './catalogue-taxonomy-noise-cleanup';
import { applyCatalogueTaxonomyQuestionnaireFollowup } from './catalogue-taxonomy-questionnaire-followup';
import { CATALOGUE_V3_REMAINING_SUBCATEGORIES } from './catalogue-taxonomy-remaining';
import { applyCatalogueTaxonomyReleaseAudit } from './catalogue-taxonomy-release-audit';
import { PROFILE_PHYSICAL_PREFERENCE_PRACTICE_IDS } from './content/physical-preferences-extraction';

/** Complete 0.2 questionnaire taxonomy, preserving stable practice identity across every category. */
const BASE_CATALOGUE_V3_SUBCATEGORIES = [
  ...CATALOGUE_V3_CORE_SUBCATEGORIES,
  ...CATALOGUE_V3_REMAINING_SUBCATEGORIES,
] as const;

const MANUALLY_REVIEWED_SUBCATEGORIES = applyManualTaxonomyReview(BASE_CATALOGUE_V3_SUBCATEGORIES);
const FINAL_PASS_SUBCATEGORIES = applyCatalogueTaxonomyFinalPass(MANUALLY_REVIEWED_SUBCATEGORIES);
const CLOSING_PASS_SUBCATEGORIES = applyCatalogueTaxonomyClosingPass(FINAL_PASS_SUBCATEGORIES);
const RELEASE_AUDITED_SUBCATEGORIES = applyCatalogueTaxonomyReleaseAudit(CLOSING_PASS_SUBCATEGORIES);
const NOISE_CLEANED_SUBCATEGORIES = applyCatalogueTaxonomyNoiseCleanup(RELEASE_AUDITED_SUBCATEGORIES);
const QUESTIONNAIRE_FOLLOWUP_SUBCATEGORIES = applyCatalogueTaxonomyQuestionnaireFollowup(NOISE_CLEANED_SUBCATEGORIES);

const BODY_SUBCATEGORY_COPY: Readonly<Record<string, Readonly<{
  en: string;
  es: string;
  descriptionEn: string;
  descriptionEs: string;
}>>> = {
  'body-face-hair-head': {
    en: 'Face, hair & neck',
    es: 'Rostro, pelo y cuello',
    descriptionEn: 'Erotic focus on lips, tongue, hair, ears or neck as especially attractive body features.',
    descriptionEs: 'Foco erótico en labios, lengua, pelo, orejas o cuello como rasgos corporales especialmente atractivos.',
  },
  'body-torso-build-stature': {
    en: 'Chest & nipples',
    es: 'Pecho y pezones',
    descriptionEn: 'Erotic focus on the chest or nipples as body areas in their own right.',
    descriptionEs: 'Foco erótico en el pecho o los pezones como zonas corporales por sí mismas.',
  },
  'body-limbs-abdomen-buttocks': {
    en: 'Limbs, abdomen & buttocks',
    es: 'Extremidades, abdomen y glúteos',
    descriptionEn: 'Erotic focus on hands, abdomen, buttocks, legs, thighs, feet and related body details.',
    descriptionEs: 'Foco erótico en manos, abdomen, glúteos, piernas, muslos, pies y detalles corporales relacionados.',
  },
};

/** Appearance ratings live on the profile; only erotic/sensory body focuses remain here. */
export const CATALOGUE_V3_SUBCATEGORIES = QUESTIONNAIRE_FOLLOWUP_SUBCATEGORIES
  .map((subcategory) => {
    const practiceIds = subcategory.practiceIds.filter(
      (practiceId) => !PROFILE_PHYSICAL_PREFERENCE_PRACTICE_IDS.has(practiceId),
    );
    return {
      ...subcategory,
      ...(BODY_SUBCATEGORY_COPY[subcategory.id] ?? {}),
      practiceIds,
    };
  })
  .filter((subcategory) => subcategory.practiceIds.length > 0);
