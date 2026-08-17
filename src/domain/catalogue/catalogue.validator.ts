import { SEX_VALUES } from '../profile/profile-metadata';
import { isStableId } from '../shared/stable-id';
import { ValidationIssue, Validator } from '../shared/validator';
import { PracticeCatalogue } from './catalogue';
import { Practice, PracticeCategory } from './practice';

const PRACTICE_KEYS = [
  'id',
  'categoryId',
  'label',
  'description',
  'roles',
  'compatibleRolePairs',
] as const;
const CATEGORY_KEYS = ['id', 'label', 'description', 'order'] as const;
const ROLE_KEYS = ['id', 'label', 'perspective', 'applicability'] as const;
const APPLICABILITY_KEYS = ['selfSex', 'partnerSex'] as const;
const COMPATIBILITY_PAIR_KEYS = ['leftRoleId', 'rightRoleId'] as const;
const CATALOGUE_KEYS = ['categories', 'practices'] as const;
const ROLE_PERSPECTIVES = ['active', 'receptive', 'neutral'] as const;
const LABEL_MAX_LENGTH = 160;
const DESCRIPTION_MAX_LENGTH = 1_000;
const MAX_ROLES_PER_PRACTICE = 32;
const MAX_CATEGORIES = 200;
const MAX_PRACTICES = 10_000;

export class PracticeCategoryValidator extends Validator<PracticeCategory> {
  override validate(value: unknown): readonly ValidationIssue[] {
    if (!this.isRecord(value)) {
      return [{ path: '', message: 'Category must be an object.' }];
    }

    const issues = this.validateAllowedKeys(value, CATEGORY_KEYS);
    this.validateStableId(value['id'], 'id', 'Category', issues);
    this.validateLabel(value['label'], 'label', issues);
    this.validateDescription(value['description'], 'description', issues);

    const order = value['order'];
    if (!Number.isInteger(order) || (order as number) < 0) {
      issues.push({ path: 'order', message: 'Category order must be a non-negative integer.' });
    }

    return issues;
  }

  private validateStableId(
    value: unknown,
    path: string,
    subject: string,
    issues: ValidationIssue[],
  ): void {
    if (!isStableId(value)) {
      issues.push({ path, message: `${subject} id must be a stable lowercase identifier.` });
    }
  }

  private validateLabel(value: unknown, path: string, issues: ValidationIssue[]): void {
    if (typeof value !== 'string' || value.trim().length === 0 || value.length > LABEL_MAX_LENGTH) {
      issues.push({ path, message: `Label must contain 1 to ${LABEL_MAX_LENGTH} characters.` });
    }
  }

  private validateDescription(value: unknown, path: string, issues: ValidationIssue[]): void {
    if (
      value !== undefined &&
      (typeof value !== 'string' || value.trim().length === 0 || value.length > DESCRIPTION_MAX_LENGTH)
    ) {
      issues.push({
        path,
        message: `Description must contain 1 to ${DESCRIPTION_MAX_LENGTH} characters when provided.`,
      });
    }
  }
}

export class PracticeValidator extends Validator<Practice> {
  override validate(value: unknown): readonly ValidationIssue[] {
    if (!this.isRecord(value)) {
      return [{ path: '', message: 'Practice must be an object.' }];
    }

    const issues = this.validateAllowedKeys(value, PRACTICE_KEYS);

    if (!isStableId(value['id'])) {
      issues.push({ path: 'id', message: 'Practice id must be a stable lowercase identifier.' });
    }
    if (!isStableId(value['categoryId'])) {
      issues.push({ path: 'categoryId', message: 'Category id must be a stable lowercase identifier.' });
    }

    this.validateLabel(value['label'], 'label', issues);
    this.validateDescription(value['description'], 'description', issues);

    const roles = value['roles'];
    if (!Array.isArray(roles) || roles.length === 0 || roles.length > MAX_ROLES_PER_PRACTICE) {
      issues.push({
        path: 'roles',
        message: `Practice must contain between 1 and ${MAX_ROLES_PER_PRACTICE} roles.`,
      });
      return issues;
    }

    const roleIds = new Set<string>();
    roles.forEach((role, index) => {
      issues.push(...this.validateRole(role, index, roleIds));
    });

    const pairs = value['compatibleRolePairs'];
    if (!Array.isArray(pairs)) {
      issues.push({ path: 'compatibleRolePairs', message: 'Compatible role pairs must be an array.' });
      return issues;
    }

    const seenPairs = new Set<string>();
    pairs.forEach((pair, index) => {
      issues.push(...this.validateCompatibilityPair(pair, index, roleIds, seenPairs));
    });

    return issues;
  }

  private validateRole(value: unknown, index: number, roleIds: Set<string>): ValidationIssue[] {
    const path = `roles.${index}`;
    if (!this.isRecord(value)) {
      return [{ path, message: 'Role must be an object.' }];
    }

    const issues = this.validateAllowedKeys(value, ROLE_KEYS, path);
    const id = value['id'];

    if (!isStableId(id)) {
      issues.push({ path: `${path}.id`, message: 'Role id must be a stable lowercase identifier.' });
    } else if (roleIds.has(id)) {
      issues.push({ path: `${path}.id`, message: 'Role ids must be unique within a practice.' });
    } else {
      roleIds.add(id);
    }

    this.validateLabel(value['label'], `${path}.label`, issues);

    if (!ROLE_PERSPECTIVES.includes(value['perspective'] as (typeof ROLE_PERSPECTIVES)[number])) {
      issues.push({ path: `${path}.perspective`, message: 'Role perspective uses an unsupported value.' });
    }

    const applicability = value['applicability'];
    if (applicability !== undefined) {
      issues.push(...this.validateApplicability(applicability, `${path}.applicability`));
    }

    return issues;
  }

  private validateApplicability(value: unknown, path: string): ValidationIssue[] {
    if (!this.isRecord(value)) {
      return [{ path, message: 'Role applicability must be an object.' }];
    }

    const issues = this.validateAllowedKeys(value, APPLICABILITY_KEYS, path);
    for (const key of APPLICABILITY_KEYS) {
      const sexes = value[key];
      if (sexes === undefined) {
        continue;
      }

      if (!Array.isArray(sexes) || sexes.length === 0) {
        issues.push({ path: `${path}.${key}`, message: 'Sex applicability must be a non-empty array.' });
        continue;
      }

      const uniqueSexes = new Set(sexes);
      if (uniqueSexes.size !== sexes.length) {
        issues.push({ path: `${path}.${key}`, message: 'Sex applicability cannot contain duplicates.' });
      }

      if (!sexes.every((sex) => SEX_VALUES.includes(sex as (typeof SEX_VALUES)[number]))) {
        issues.push({ path: `${path}.${key}`, message: 'Sex applicability contains an unsupported value.' });
      }
    }

    return issues;
  }

  private validateCompatibilityPair(
    value: unknown,
    index: number,
    roleIds: ReadonlySet<string>,
    seenPairs: Set<string>,
  ): ValidationIssue[] {
    const path = `compatibleRolePairs.${index}`;
    if (!this.isRecord(value)) {
      return [{ path, message: 'Compatibility pair must be an object.' }];
    }

    const issues = this.validateAllowedKeys(value, COMPATIBILITY_PAIR_KEYS, path);
    const left = value['leftRoleId'];
    const right = value['rightRoleId'];

    if (!isStableId(left) || !roleIds.has(left)) {
      issues.push({ path: `${path}.leftRoleId`, message: 'Compatibility pair must reference an existing role.' });
    }
    if (!isStableId(right) || !roleIds.has(right)) {
      issues.push({ path: `${path}.rightRoleId`, message: 'Compatibility pair must reference an existing role.' });
    }

    if (typeof left === 'string' && typeof right === 'string') {
      const canonicalPair = [left, right].sort().join('::');
      if (seenPairs.has(canonicalPair)) {
        issues.push({ path, message: 'Compatibility pairs cannot be duplicated in either direction.' });
      } else {
        seenPairs.add(canonicalPair);
      }
    }

    return issues;
  }

  private validateLabel(value: unknown, path: string, issues: ValidationIssue[]): void {
    if (typeof value !== 'string' || value.trim().length === 0 || value.length > LABEL_MAX_LENGTH) {
      issues.push({ path, message: `Label must contain 1 to ${LABEL_MAX_LENGTH} characters.` });
    }
  }

  private validateDescription(value: unknown, path: string, issues: ValidationIssue[]): void {
    if (
      value !== undefined &&
      (typeof value !== 'string' || value.trim().length === 0 || value.length > DESCRIPTION_MAX_LENGTH)
    ) {
      issues.push({
        path,
        message: `Description must contain 1 to ${DESCRIPTION_MAX_LENGTH} characters when provided.`,
      });
    }
  }
}

export class PracticeCatalogueValidator extends Validator<PracticeCatalogue> {
  constructor(
    private readonly categoryValidator = new PracticeCategoryValidator(),
    private readonly practiceValidator = new PracticeValidator(),
  ) {
    super();
  }

  override validate(value: unknown): readonly ValidationIssue[] {
    if (!this.isRecord(value)) {
      return [{ path: '', message: 'Catalogue must be an object.' }];
    }

    const issues = this.validateAllowedKeys(value, CATALOGUE_KEYS);
    const categories = value['categories'];
    const practices = value['practices'];

    if (!Array.isArray(categories) || categories.length > MAX_CATEGORIES) {
      issues.push({ path: 'categories', message: `Categories must be an array of at most ${MAX_CATEGORIES} items.` });
      return issues;
    }
    if (!Array.isArray(practices) || practices.length > MAX_PRACTICES) {
      issues.push({ path: 'practices', message: `Practices must be an array of at most ${MAX_PRACTICES} items.` });
      return issues;
    }

    const categoryIds = new Set<string>();
    const categoryOrders = new Set<number>();
    categories.forEach((category, index) => {
      for (const issue of this.categoryValidator.validate(category)) {
        issues.push({ ...issue, path: issue.path ? `categories.${index}.${issue.path}` : `categories.${index}` });
      }

      if (this.isRecord(category) && isStableId(category['id'])) {
        if (categoryIds.has(category['id'])) {
          issues.push({ path: `categories.${index}.id`, message: 'Category ids must be unique.' });
        }
        categoryIds.add(category['id']);
      }

      if (this.isRecord(category) && Number.isInteger(category['order'])) {
        const order = category['order'] as number;
        if (categoryOrders.has(order)) {
          issues.push({ path: `categories.${index}.order`, message: 'Category order values must be unique.' });
        }
        categoryOrders.add(order);
      }
    });

    const practiceIds = new Set<string>();
    practices.forEach((practice, index) => {
      for (const issue of this.practiceValidator.validate(practice)) {
        issues.push({ ...issue, path: issue.path ? `practices.${index}.${issue.path}` : `practices.${index}` });
      }

      if (!this.isRecord(practice)) {
        return;
      }

      const id = practice['id'];
      if (isStableId(id)) {
        if (practiceIds.has(id)) {
          issues.push({ path: `practices.${index}.id`, message: 'Practice ids must be unique.' });
        }
        practiceIds.add(id);
      }

      const categoryId = practice['categoryId'];
      if (isStableId(categoryId) && !categoryIds.has(categoryId)) {
        issues.push({
          path: `practices.${index}.categoryId`,
          message: 'Practice must reference an existing category.',
        });
      }
    });

    return issues;
  }
}

export const practiceValidator = new PracticeValidator();
export const practiceCategoryValidator = new PracticeCategoryValidator();
export const practiceCatalogueValidator = new PracticeCatalogueValidator();
