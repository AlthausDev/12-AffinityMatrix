import { QuestionnaireService } from '../../application/questionnaire/questionnaire-service';
import { createProfile } from '../../domain/profile/profile';
import { CURRENT_CATALOGUE_SNAPSHOT } from './catalogue-v3';
import { CATALOGUE_V3_PRACTICE_INSIGHTS } from './v3/catalogue-insights';
import { CATALOGUE_V3_SUBCATEGORIES } from './v3/catalogue-taxonomy';
import { CATALOGUE_V3_CONTENT } from './v3/content/final';
import {
  QUESTIONNAIRE_FOLLOWUP_CHASTITY_ID,
  QUESTIONNAIRE_FOLLOWUP_POSITION_IDS,
} from './v3/content/final-questionnaire-followup';

const service = new QuestionnaireService();
const allSeeds = () => CATALOGUE_V3_CONTENT.flatMap((category) => category.practices);
const seed = (id: string) => allSeeds().find((practice) => practice.id === id);
const snapshotPractice = (id: string) => CURRENT_CATALOGUE_SNAPSHOT.catalogue.practices.find((practice) => practice.id === id);

function profile(
  sex: 'male' | 'female',
  orientation: 'heterosexual' | 'homosexual' | 'bisexual',
) {
  return createProfile({
    id: `${sex}-${orientation}-followup`,
    now: '2026-08-29T00:00:00.000Z',
    metadata: { sex, orientation },
  });
}

describe('Catalogue V3 questionnaire follow-up', () => {
  it('uses preference wording for sexual style instead of a competitive-sounding verb', () => {
    expect(snapshotPractice('romantic-sex')?.roles.map((role) => role.label)).toContain('Preference for this style');
  });

  it('adds common and more demanding sexual positions and keeps each one classified', () => {
    const positionIds = new Set(
      CATALOGUE_V3_CONTENT.find((category) => category.id === 'sexual-positions')?.practices.map((practice) => practice.id),
    );
    const taxonomyIds = new Set(
      CATALOGUE_V3_SUBCATEGORIES
        .filter((subcategory) => subcategory.categoryId === 'sexual-positions')
        .flatMap((subcategory) => subcategory.practiceIds),
    );
    const insightIds = new Set(CATALOGUE_V3_PRACTICE_INSIGHTS.map((insight) => insight.practiceId));

    for (const id of QUESTIONNAIRE_FOLLOWUP_POSITION_IDS) {
      expect(positionIds.has(id), id).toBe(true);
      expect(taxonomyIds.has(id), `${id} taxonomy`).toBe(true);
      expect(insightIds.has(id), `${id} insight`).toBe(true);
    }
  });

  it('adds chastity as a paired accessory with wearer and controller roles', () => {
    const chastity = seed(QUESTIONNAIRE_FOLLOWUP_CHASTITY_ID);
    expect(chastity?.kind).toBe('paired');
    expect(chastity?.pairedRoles?.map((role) => role.id)).toEqual(['wear-chastity', 'control-chastity']);
    expect(snapshotPractice(QUESTIONNAIRE_FOLLOWUP_CHASTITY_ID)?.categoryId).toBe('sexual-accessories');
    expect(
      CATALOGUE_V3_SUBCATEGORIES.find((subcategory) => subcategory.id === 'sexual-accessories-chastity')?.practiceIds,
    ).toEqual([QUESTIONNAIRE_FOLLOWUP_CHASTITY_ID]);
  });

  it('keeps adult-only safety framing in descriptions without repeating it in ageplay and caregiver titles', () => {
    const ageplay = seed('adult-ageplay-roleplay');
    const caregiver = seed('caregiver-little-adult-roleplay');

    expect(ageplay?.es).toBe('Ageplay');
    expect(ageplay?.descriptionEs).toContain('exclusivamente entre adultos');
    expect(caregiver?.es).toBe('Dinámica Caregiver / Little');
    expect(caregiver?.descriptionEs).toContain('exclusivamente entre adultos');
  });

  it('hides semen-cleanup questions for homosexual women while retaining them for profiles with male partners', () => {
    const cleanupIds = new Set([
      'semen-cleanup-manual',
      'semen-cleanup-oral-external',
      'semen-cleanup-oral-creampie',
      'semen-cleanup-other',
    ]);

    const lesbianFluids = service.getCategory(CURRENT_CATALOGUE_SNAPSHOT, profile('female', 'homosexual'), 'fluids');
    const heterosexualWomanFluids = service.getCategory(CURRENT_CATALOGUE_SNAPSHOT, profile('female', 'heterosexual'), 'fluids');

    expect(lesbianFluids?.practices.some((item) => cleanupIds.has(item.practice.id))).toBe(false);
    expect(heterosexualWomanFluids?.practices.some((item) => cleanupIds.has(item.practice.id))).toBe(true);
  });
});
