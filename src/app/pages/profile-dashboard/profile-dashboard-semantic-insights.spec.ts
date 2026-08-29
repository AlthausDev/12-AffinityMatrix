import { CatalogueInsightTagDefinition, PracticeInsightSignals } from '../../../domain/catalogue/catalogue-insight';
import { createProfile } from '../../../domain/profile/profile';
import { createAnswerKey } from '../../../domain/profile/profile-answer';
import { CATALOGUE_INSIGHT_TAGS } from '../../../infrastructure/catalogue/v3/catalogue-insights';
import {
  buildSemanticCoordinateMaps,
  buildSemanticInsights,
  buildSemanticThemes,
  DASHBOARD_SEMANTIC_THEMES,
  SemanticCoordinateMapDefinition,
  strongestSemanticInsights,
} from './profile-dashboard-semantic-insights';

const tags: readonly CatalogueInsightTagDefinition[] = [
  {
    id: 'connection',
    en: 'Connection',
    es: 'Conexión',
    descriptionEn: 'Connection',
    descriptionEs: 'Conexión',
  },
  {
    id: 'intensity',
    en: 'Intensity',
    es: 'Intensidad',
    descriptionEn: 'Intensity',
    descriptionEs: 'Intensidad',
  },
];

const practiceInsights: readonly PracticeInsightSignals[] = [
  { practiceId: 'shared', signals: { connection: 1 } },
  { practiceId: 'second', signals: { connection: 0.5, intensity: 1 } },
  { practiceId: 'third', signals: { intensity: 0.5 } },
];

describe('semantic dashboard insights', () => {
  it('averages role and scope variants before a practice contributes to a tag', () => {
    const profile = createProfile({
      id: 'semantic-profile',
      now: '2026-08-29T18:00:00.000Z',
      answers: {
        [createAnswerKey('shared', 'give')]: {
          practiceId: 'shared', roleId: 'give', preference: 'favorite',
        },
        [createAnswerKey('shared', 'receive')]: {
          practiceId: 'shared', roleId: 'receive', preference: 'not-interested',
        },
        [createAnswerKey('second', 'mutual')]: {
          practiceId: 'second', roleId: 'mutual', preference: 'like',
        },
      },
    });

    const result = buildSemanticInsights(profile, tags, practiceInsights);
    const connection = result.find((entry) => entry.tag.id === 'connection');

    // shared contributes 50% after averaging favorite + not-interested; second contributes 78%.
    expect(connection).toMatchObject({
      evidenceCount: 2,
      evidencePracticeIds: ['second', 'shared'],
    });
    expect(connection?.score).toBe(59);
  });

  it('does not turn negative answers into affinity for an opposite semantic signal', () => {
    const profile = createProfile({
      id: 'negative-profile',
      now: '2026-08-29T18:00:00.000Z',
      answers: {
        [createAnswerKey('third', 'mutual')]: {
          practiceId: 'third', roleId: 'mutual', preference: 'boundary',
        },
      },
    });

    const result = buildSemanticInsights(profile, tags, practiceInsights);
    expect(result.find((entry) => entry.tag.id === 'intensity')).toMatchObject({
      score: 0,
      evidenceCount: 1,
      evidencePracticeIds: ['third'],
    });
  });

  it('builds thematic scores without double-counting one practice across several tags', () => {
    const profile = createProfile({
      id: 'theme-profile',
      now: '2026-08-29T18:00:00.000Z',
      answers: {
        [createAnswerKey('shared', 'mutual')]: {
          practiceId: 'shared', roleId: 'mutual', preference: 'favorite',
        },
        [createAnswerKey('second', 'mutual')]: {
          practiceId: 'second', roleId: 'mutual', preference: 'like',
        },
      },
    });
    const insights = buildSemanticInsights(profile, tags, practiceInsights);
    const themes = buildSemanticThemes(insights, [
      {
        id: 'test-theme',
        en: 'Test',
        es: 'Prueba',
        descriptionEn: 'Test',
        descriptionEs: 'Prueba',
        tags: ['connection', 'intensity'],
      },
    ]);

    expect(themes).toHaveLength(1);
    expect(themes[0]?.score).toBeGreaterThan(0);
    expect(themes[0]?.evidenceCount).toBe(2);
  });

  it('keeps every catalogue semantic tag in exactly one dashboard dimension', () => {
    const themedTags = DASHBOARD_SEMANTIC_THEMES.flatMap((theme) => theme.tags);
    const uniqueThemedTags = new Set(themedTags);
    const catalogueTagIds = CATALOGUE_INSIGHT_TAGS.map((tag) => tag.id);

    expect(themedTags).toHaveLength(uniqueThemedTags.size);
    expect(uniqueThemedTags.size).toBe(catalogueTagIds.length);
    expect(catalogueTagIds.every((tagId) => uniqueThemedTags.has(tagId))).toBe(true);
  });

  it('places coordinate maps from positive evidence on both sides of each axis', () => {
    const insights = [
      {
        tag: tags[0]!, score: 80, evidenceCount: 1, evidencePracticeIds: ['a'], weightedEvidence: 1,
      },
      {
        tag: tags[1]!, score: 40, evidenceCount: 1, evidencePracticeIds: ['b'], weightedEvidence: 1,
      },
    ];
    const maps: readonly SemanticCoordinateMapDefinition[] = [{
      id: 'test-map',
      en: 'Test map',
      es: 'Mapa de prueba',
      descriptionEn: 'Test',
      descriptionEs: 'Prueba',
      x: {
        lowEn: 'Connection', lowEs: 'Conexión', highEn: 'Intensity', highEs: 'Intensidad',
        lowTags: ['connection'], highTags: ['intensity'],
      },
      y: {
        lowEn: 'Connection', lowEs: 'Conexión', highEn: 'Intensity', highEs: 'Intensidad',
        lowTags: ['connection'], highTags: ['intensity'],
      },
    }];

    expect(buildSemanticCoordinateMaps(insights, maps)).toEqual([
      expect.objectContaining({ x: -33, y: -33, evidenceCount: 2 }),
    ]);
  });

  it('prefers signals backed by more than one practice when selecting highlights', () => {
    const insights = [
      {
        tag: tags[0]!, score: 70, evidenceCount: 2, evidencePracticeIds: ['a', 'b'], weightedEvidence: 1.5,
      },
      {
        tag: tags[1]!, score: 100, evidenceCount: 1, evidencePracticeIds: ['c'], weightedEvidence: 1,
      },
    ];

    expect(strongestSemanticInsights(insights, 4).map((entry) => entry.tag.id)).toEqual(['connection']);
  });
});
