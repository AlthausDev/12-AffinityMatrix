import { PracticeCatalogue } from './catalogue';
import { PracticeCatalogueValidator, PracticeValidator } from './catalogue.validator';
import { Practice } from './practice';

function validPractice(): Practice {
  return {
    id: 'bondage',
    categoryId: 'restraint',
    label: 'Bondage',
    roles: [
      { id: 'tie', label: 'Tie partner', perspective: 'active', contextAxes: ['counterpartSex'] },
      { id: 'be-tied', label: 'Be tied', perspective: 'receptive', contextAxes: ['counterpartSex'] },
    ],
    compatibleRolePairs: [{ leftRoleId: 'tie', rightRoleId: 'be-tied' }],
  };
}

describe('PracticeValidator', () => {
  const validator = new PracticeValidator();

  it('accepts explicit semantic roles, declared context axes, and compatibility pairs', () => {
    expect(validator.validate(validPractice())).toEqual([]);
  });

  it('accepts fixed group composition and required participant-sex applicability', () => {
    const practice: Practice = {
      ...validPractice(),
      roles: [
        {
          ...validPractice().roles[0],
          applicability: {
            groupComposition: ['male', 'male', 'female'],
            requiresAnyParticipantSex: ['male'],
          },
        },
        validPractice().roles[1],
      ],
    };
    expect(validator.validate(practice)).toEqual([]);
  });

  it('rejects unsupported sex values in extended applicability', () => {
    const candidate = {
      ...validPractice(),
      roles: [
        {
          ...validPractice().roles[0],
          applicability: {
            groupComposition: ['male', 'unsupported'],
            requiresAnyParticipantSex: ['unsupported'],
          },
        },
        validPractice().roles[1],
      ],
    };
    const issues = validator.validate(candidate);
    expect(issues.some((issue) => issue.path.endsWith('groupComposition'))).toBe(true);
    expect(issues.some((issue) => issue.path.endsWith('requiresAnyParticipantSex'))).toBe(true);
  });

  it('rejects duplicate role ids', () => {
    const practice = validPractice();
    const candidate = { ...practice, roles: [practice.roles[0], { ...practice.roles[1], id: 'tie' }] };
    expect(validator.validate(candidate).some((issue) => issue.message.includes('Role ids'))).toBe(true);
  });

  it('rejects unsupported or duplicated context axes', () => {
    const unsupported = {
      ...validPractice(),
      roles: [{ ...validPractice().roles[0], contextAxes: ['counterpartAge'] }, validPractice().roles[1]],
    };
    expect(validator.isValid(unsupported)).toBe(false);

    const duplicated = {
      ...validPractice(),
      roles: [{ ...validPractice().roles[0], contextAxes: ['counterpartSex', 'counterpartSex'] }, validPractice().roles[1]],
    };
    expect(validator.validate(duplicated).some((issue) => issue.message.includes('duplicates'))).toBe(true);
  });

  it('rejects compatibility pairs referencing roles that do not exist', () => {
    const candidate = { ...validPractice(), compatibleRolePairs: [{ leftRoleId: 'tie', rightRoleId: 'missing' }] };
    expect(validator.validate(candidate).some((issue) => issue.path.endsWith('rightRoleId'))).toBe(true);
  });

  it('rejects duplicate compatibility pairs regardless of direction', () => {
    const candidate = {
      ...validPractice(),
      compatibleRolePairs: [
        { leftRoleId: 'tie', rightRoleId: 'be-tied' },
        { leftRoleId: 'be-tied', rightRoleId: 'tie' },
      ],
    };
    expect(validator.validate(candidate).some((issue) => issue.message.includes('duplicated'))).toBe(true);
  });
});

describe('PracticeCatalogueValidator', () => {
  const validator = new PracticeCatalogueValidator();

  it('accepts a coherent category/practice aggregate', () => {
    const catalogue: PracticeCatalogue = {
      categories: [{ id: 'restraint', label: 'Restraint', order: 0 }],
      practices: [validPractice()],
    };
    expect(validator.validate(catalogue)).toEqual([]);
  });

  it('rejects practices whose category does not exist', () => {
    const catalogue: PracticeCatalogue = {
      categories: [{ id: 'other', label: 'Other', order: 0 }],
      practices: [validPractice()],
    };
    expect(validator.validate(catalogue).some((issue) => issue.path.endsWith('categoryId'))).toBe(true);
  });

  it('rejects duplicate category ordering to keep navigation deterministic', () => {
    const catalogue: PracticeCatalogue = {
      categories: [
        { id: 'one', label: 'One', order: 0 },
        { id: 'two', label: 'Two', order: 0 },
      ],
      practices: [],
    };
    expect(validator.validate(catalogue).some((issue) => issue.path.endsWith('order'))).toBe(true);
  });
});
