import { QuestionnaireCounterpartContextService } from './questionnaire-counterpart-context.service';

describe('QuestionnaireCounterpartContextService', () => {
  it('only marks counterpart sex as useful when a role has multiple visible variants', () => {
    const service = new QuestionnaireCounterpartContextService();
    const removeFemale = service.register('kissing', 'give', 'female');
    expect(service.hasMultipleSexVariants('kissing', 'give')).toBe(false);

    const removeMale = service.register('kissing', 'give', 'male');
    expect(service.hasMultipleSexVariants('kissing', 'give')).toBe(true);

    removeMale();
    expect(service.hasMultipleSexVariants('kissing', 'give')).toBe(false);
    removeFemale();
  });

  it('keeps practices and roles isolated from one another', () => {
    const service = new QuestionnaireCounterpartContextService();
    service.register('kissing', 'give', 'female');
    service.register('cuddling', 'give', 'male');
    expect(service.hasMultipleSexVariants('kissing', 'give')).toBe(false);
    expect(service.hasMultipleSexVariants('cuddling', 'give')).toBe(false);
  });
});
