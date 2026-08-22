import { TestBed } from '@angular/core/testing';
import { QuestionnaireRoleComponent } from './questionnaire-role.component';

const role = { id: 'receive', label: 'Receive', perspective: 'receptive' as const };

describe('QuestionnaireRoleComponent', () => {
  it('preserves relational scope when selecting a preference', async () => {
    await TestBed.configureTestingModule({ imports: [QuestionnaireRoleComponent] }).compileComponents();
    const fixture = TestBed.createComponent(QuestionnaireRoleComponent);
    fixture.componentRef.setInput('practiceId', 'example');
    fixture.componentRef.setInput('role', role);
    fixture.componentRef.setInput('scope', { counterpartSex: 'female' });

    let emitted: unknown;
    fixture.componentInstance.answerChange.subscribe((answer) => { emitted = answer; });
    fixture.componentInstance.selectPreference('favorite');

    expect(emitted).toEqual({
      practiceId: 'example',
      roleId: 'receive',
      scope: { counterpartSex: 'female' },
      preference: 'favorite',
    });
  });

  it('emits the same relational scope when clearing a scoped answer', async () => {
    await TestBed.configureTestingModule({ imports: [QuestionnaireRoleComponent] }).compileComponents();
    const fixture = TestBed.createComponent(QuestionnaireRoleComponent);
    fixture.componentRef.setInput('practiceId', 'example');
    fixture.componentRef.setInput('role', role);
    fixture.componentRef.setInput('scope', { counterpartSex: 'male' });

    let emitted: unknown;
    fixture.componentInstance.answerRemove.subscribe((answer) => { emitted = answer; });
    fixture.componentInstance.clearAnswer();

    expect(emitted).toEqual({
      practiceId: 'example', roleId: 'receive', scope: { counterpartSex: 'male' },
    });
  });

  it('clears the answer when selecting the already selected preference', async () => {
    await TestBed.configureTestingModule({ imports: [QuestionnaireRoleComponent] }).compileComponents();
    const fixture = TestBed.createComponent(QuestionnaireRoleComponent);
    fixture.componentRef.setInput('practiceId', 'example');
    fixture.componentRef.setInput('role', role);
    fixture.componentRef.setInput('scope', { counterpartSex: 'female' });
    fixture.componentRef.setInput('answer', {
      practiceId: 'example',
      roleId: 'receive',
      scope: { counterpartSex: 'female' },
      preference: 'like',
    });

    let removed: unknown;
    let changed = false;
    fixture.componentInstance.answerRemove.subscribe((answer) => { removed = answer; });
    fixture.componentInstance.answerChange.subscribe(() => { changed = true; });

    fixture.componentInstance.selectPreference('like');

    expect(removed).toEqual({
      practiceId: 'example', roleId: 'receive', scope: { counterpartSex: 'female' },
    });
    expect(changed).toBe(false);
  });

  it('removes detail-only state when selecting a non-detail preference', async () => {
    await TestBed.configureTestingModule({ imports: [QuestionnaireRoleComponent] }).compileComponents();
    const fixture = TestBed.createComponent(QuestionnaireRoleComponent);
    fixture.componentRef.setInput('practiceId', 'example');
    fixture.componentRef.setInput('role', role);
    fixture.componentRef.setInput('answer', {
      practiceId: 'example', roleId: 'receive', preference: 'depends',
      details: { dependsOn: 'Only sometimes', desiredFrequency: 'occasionally' },
    });

    let emitted: unknown;
    fixture.componentInstance.answerChange.subscribe((answer) => { emitted = answer; });
    fixture.componentInstance.selectPreference('boundary');

    expect(emitted).toEqual({ practiceId: 'example', roleId: 'receive', preference: 'boundary' });
  });

  it('keeps optional details but removes a dependency note when leaving Depends', async () => {
    await TestBed.configureTestingModule({ imports: [QuestionnaireRoleComponent] }).compileComponents();
    const fixture = TestBed.createComponent(QuestionnaireRoleComponent);
    fixture.componentRef.setInput('practiceId', 'example');
    fixture.componentRef.setInput('role', role);
    fixture.componentRef.setInput('answer', {
      practiceId: 'example', roleId: 'receive', preference: 'depends',
      details: { dependsOn: 'Only sometimes', desiredFrequency: 'occasionally' },
    });

    let emitted: any;
    fixture.componentInstance.answerChange.subscribe((answer) => { emitted = answer; });
    fixture.componentInstance.selectPreference('like');

    expect(emitted.details.dependsOn).toBeUndefined();
    expect(emitted.details.desiredFrequency).toBe('occasionally');
  });
});
