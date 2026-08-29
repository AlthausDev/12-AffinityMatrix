import { Injectable, signal } from '@angular/core';
import { Sex } from '../../domain/profile/profile-metadata';

/** Tracks the counterpart-sex variants currently rendered for each practice role. */
@Injectable({ providedIn: 'root' })
export class QuestionnaireCounterpartContextService {
  private readonly counts = new Map<string, Map<Sex, number>>();
  private readonly revision = signal(0);

  register(practiceId: string, roleId: string, sex: Sex): () => void {
    const key = this.key(practiceId, roleId);
    const bySex = this.counts.get(key) ?? new Map<Sex, number>();
    bySex.set(sex, (bySex.get(sex) ?? 0) + 1);
    this.counts.set(key, bySex);
    this.bump();

    let active = true;
    return () => {
      if (!active) return;
      active = false;
      const current = this.counts.get(key);
      if (!current) return;
      const nextCount = (current.get(sex) ?? 1) - 1;
      if (nextCount <= 0) current.delete(sex); else current.set(sex, nextCount);
      if (current.size === 0) this.counts.delete(key);
      this.bump();
    };
  }

  hasMultipleSexVariants(practiceId: string, roleId: string): boolean {
    this.revision();
    return (this.counts.get(this.key(practiceId, roleId))?.size ?? 0) > 1;
  }

  private key(practiceId: string, roleId: string): string {
    return `${practiceId}\u0000${roleId}`;
  }

  private bump(): void {
    this.revision.update((value) => value + 1);
  }
}
