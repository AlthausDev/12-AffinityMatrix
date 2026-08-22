import { PracticeRole } from './practice';
import { DeclaredQuestionScopePolicy } from './question-scope-policy';

const policy = new DeclaredQuestionScopePolicy();

describe('DeclaredQuestionScopePolicy', () => {
  it('keeps an ordinary role as one unscoped question', () => {
    const role: PracticeRole = { id: 'solo', label: 'Solo', perspective: 'neutral' };
    expect(policy.getScopes(role)).toEqual([{}]);
  });

  it('expands counterpart sex into independent answer scopes', () => {
    const role: PracticeRole = {
      id: 'give', label: 'Give', perspective: 'active', contextAxes: ['counterpartSex'],
    };
    expect(policy.getScopes(role)).toEqual([
      { counterpartSex: 'male' },
      { counterpartSex: 'female' },
    ]);
  });

  it('expands declared axes as a deterministic cartesian product', () => {
    const role: PracticeRole = {
      id: 'use-on-partner',
      label: 'Use on partner',
      perspective: 'active',
      contextAxes: ['counterpartSex', 'targetSite'],
      contextValues: { targetSite: ['mouth', 'vaginal', 'anal'] },
      targetOwner: 'partner',
    };

    expect(policy.getScopes(role)).toEqual([
      { counterpartSex: 'male', targetSite: 'mouth' },
      { counterpartSex: 'male', targetSite: 'vaginal' },
      { counterpartSex: 'male', targetSite: 'anal' },
      { counterpartSex: 'female', targetSite: 'mouth' },
      { counterpartSex: 'female', targetSite: 'vaginal' },
      { counterpartSex: 'female', targetSite: 'anal' },
    ]);
  });
});
