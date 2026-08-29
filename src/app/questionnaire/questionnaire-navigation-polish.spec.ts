import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync(new URL('./questionnaire-shell.component.ts', import.meta.url), 'utf8');

describe('questionnaire sequence navigation accessibility', () => {
  it('keeps directional arrows visual-only and exposes progress semantics', () => {
    expect(source).toContain('class="sequence-arrow sequence-arrow-previous" aria-hidden="true">←</span>');
    expect(source).toContain('class="sequence-arrow sequence-arrow-next" aria-hidden="true">→</span>');
    expect(source).toContain('role="progressbar"');
    expect(source).toContain('[attr.aria-valuenow]="categoryProgress.completionPercentage"');
  });
});
