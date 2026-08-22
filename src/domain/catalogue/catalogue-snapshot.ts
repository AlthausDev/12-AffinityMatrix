import { ValidationIssue, Validator } from '../shared/validator';
import { isCatalogueVersion, CatalogueVersion } from './catalogue-version';
import { PracticeCatalogue } from './catalogue';
import { PracticeCatalogueValidator, practiceCatalogueValidator } from './catalogue.validator';

const SNAPSHOT_KEYS = ['version', 'catalogue'] as const;

export interface CatalogueSnapshot {
  readonly version: CatalogueVersion;
  readonly catalogue: PracticeCatalogue;
}

export class CatalogueSnapshotValidator extends Validator<CatalogueSnapshot> {
  constructor(private readonly catalogueValidator: PracticeCatalogueValidator = practiceCatalogueValidator) {
    super();
  }

  override validate(value: unknown): readonly ValidationIssue[] {
    if (!this.isRecord(value)) {
      return [{ path: '', message: 'Catalogue snapshot must be an object.' }];
    }

    const issues = this.validateAllowedKeys(value, SNAPSHOT_KEYS);
    if (!isCatalogueVersion(value['version'])) {
      issues.push({ path: 'version', message: 'Catalogue version must be a positive integer.' });
    }

    for (const issue of this.catalogueValidator.validate(value['catalogue'])) {
      issues.push({
        ...issue,
        path: issue.path ? `catalogue.${issue.path}` : 'catalogue',
      });
    }

    return issues;
  }
}

export const catalogueSnapshotValidator = new CatalogueSnapshotValidator();
