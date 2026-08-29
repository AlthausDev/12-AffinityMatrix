import { QuestionnaireService } from '../../application/questionnaire/questionnaire-service';
import { getRelevantPartnerSexes } from '../../domain/catalogue/profile-filter';
import { createProfile } from '../../domain/profile/profile';
import { Sex, SexualOrientation } from '../../domain/profile/profile-metadata';
import { CURRENT_CATALOGUE_SNAPSHOT } from './catalogue-v3';

const questionnaire = new QuestionnaireService();
const SEXES: readonly Sex[] = ['male', 'female'];
const ORIENTATIONS: readonly SexualOrientation[] = ['heterosexual', 'homosexual', 'bisexual'];

describe('Catalogue V3 profile filter matrix', () => {
  for (const sex of SEXES) {
    for (const orientation of ORIENTATIONS) {
      it(`keeps ${sex}/${orientation} counterpart and anatomy scopes coherent`, () => {
        const current = createProfile({
          id: `filter-matrix-${sex}-${orientation}`,
          now: '2026-08-29T00:00:00.000Z',
          metadata: { sex, orientation },
        });
        const relevantPartnerSexes = getRelevantPartnerSexes(current.metadata) ?? [];

        for (const category of CURRENT_CATALOGUE_SNAPSHOT.catalogue.categories) {
          const visible = questionnaire.getCategory(CURRENT_CATALOGUE_SNAPSHOT, current, category.id);
          const applicable = questionnaire.getCategory(CURRENT_CATALOGUE_SNAPSHOT, current, category.id, true);

          for (const item of visible?.practices ?? []) {
            for (const role of item.roles) {
              if (role.scope?.counterpartSex) {
                expect(
                  relevantPartnerSexes,
                  `${item.practice.id}/${role.role.id} exposes an orientation-irrelevant counterpart`,
                ).toContain(role.scope.counterpartSex);
              }
            }
          }

          for (const item of applicable?.practices ?? []) {
            for (const role of item.roles) {
              const targetSite = role.scope?.targetSite;
              if (!targetSite || !role.role.targetOwner) continue;

              const targetSex = role.role.targetOwner === 'self'
                ? sex
                : role.scope?.counterpartSex;
              if (!targetSex) continue;

              if (targetSite === 'vaginal') {
                expect(targetSex, `${item.practice.id}/${role.role.id} has an impossible vaginal target`)
                  .toBe('female');
              }
              if (targetSite === 'penis') {
                expect(targetSex, `${item.practice.id}/${role.role.id} has an impossible penis target`)
                  .toBe('male');
              }
            }
          }
        }
      });
    }
  }
});
