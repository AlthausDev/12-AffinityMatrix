export interface ValidationIssue {
  readonly path: string;
  readonly message: string;
}

export class DomainValidationError extends Error {
  constructor(
    message: string,
    readonly issues: readonly ValidationIssue[],
  ) {
    super(message);
    this.name = 'DomainValidationError';
  }
}

export abstract class Validator<T> {
  abstract validate(value: unknown): readonly ValidationIssue[];

  isValid(value: unknown): value is T {
    return this.validate(value).length === 0;
  }

  assert(value: unknown, message = 'Domain validation failed.'): T {
    const issues = this.validate(value);
    if (issues.length > 0) {
      throw new DomainValidationError(message, issues);
    }

    return value as T;
  }
}
