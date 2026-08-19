import { InjectionToken } from '@angular/core';
import { QuestionnaireService } from '../../application/questionnaire/questionnaire-service';

export const QUESTIONNAIRE_SERVICE = new InjectionToken<QuestionnaireService>('QUESTIONNAIRE_SERVICE', {
  providedIn: 'root',
  factory: () => new QuestionnaireService(),
});
