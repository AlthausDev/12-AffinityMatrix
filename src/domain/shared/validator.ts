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

  protected isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  protected validateAllowedKeys(
    value: Record<string, unknown>,
    allowedKeys: readonly string[],
    path = '',
  ): ValidationIssue[] {
    const allowed = new Set(allowedKeys);
    return Object.keys(value)
      .filter((key) => !allowed.has(key))
      .map((key) => ({
        path: path ? `${path}.${key}` : key,
        message: 'Property is not part of this schema version.',
      }));
  }
}
