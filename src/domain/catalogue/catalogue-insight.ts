import { PracticeId } from './practice';

/**
 * Semantic signals attached to catalogue practices for future orientative insights.
 *
 * They are deliberately NOT part of question identity or profile persistence. A chart can
 * combine these signals with preference values and role perspective later without changing
 * existing answers or coupling the catalogue taxonomy to a particular visualisation.
 */
export type CatalogueInsightTagId =
  | 'connection'
  | 'tenderness'
  | 'romance'
  | 'sensuality'
  | 'intensity'
  | 'slow-pace'
  | 'fast-pace'
  | 'spontaneity'
  | 'playfulness'
  | 'exploration'
  | 'visibility'
  | 'anonymity'
  | 'aesthetic-presentation'
  | 'role-immersion'
  | 'reciprocity'
  | 'physicality'
  | 'physical-restraint'
  | 'sensory-restriction'
  | 'structure'
  | 'power-exchange'
  | 'service-orientation'
  | 'group-social';

export type CatalogueInsightStrength = 0.25 | 0.5 | 0.75 | 1;

export interface CatalogueInsightTagDefinition {
  readonly id: CatalogueInsightTagId;
  readonly en: string;
  readonly es: string;
  readonly descriptionEn: string;
  readonly descriptionEs: string;
}

export interface PracticeInsightSignals {
  readonly practiceId: PracticeId;
  /**
   * Strength describes how strongly the practice represents a semantic signal, not how the
   * user feels about it. Disliking a tagged practice must never be interpreted automatically
   * as liking the opposite trait.
   */
  readonly signals: Readonly<Partial<Record<CatalogueInsightTagId, CatalogueInsightStrength>>>;
}
