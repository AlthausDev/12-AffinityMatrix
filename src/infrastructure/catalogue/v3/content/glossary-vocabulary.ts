import { CatalogueCategorySeed, CataloguePracticeSeed } from './types';

/**
 * Final terminology pass shared conceptually with the user-facing glossary.
 *
 * The catalogue deliberately has some practice ids that predate the vocabulary shown to users.
 * This pass keeps those stable ids while making the visible wording use the canonical glossary term,
 * so the dedicated glossary and inline definitions never describe a different name for the same idea.
 */
const PRACTICE_VOCABULARY: Readonly<Record<string, Partial<CataloguePracticeSeed>>> = {
  'tease-and-denial': {
    en: 'Tease & denial',
    es: 'Tease & denial',
  },
  'erotic-media-exchange': {
    en: 'Erotic media exchange',
    es: 'Intercambio de contenido erótico',
  },
  'urine-play': {
    en: 'Watersports / urine play',
    es: 'Watersports / juego con orina',
  },
};

export function applyGlossaryVocabulary(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  return content.map((category) => ({
    ...category,
    descriptionEn: categoryDescription(category.id, category.descriptionEn, 'en'),
    descriptionEs: categoryDescription(category.id, category.descriptionEs, 'es'),
    practices: category.practices.map((practice) => ({
      ...practice,
      ...(PRACTICE_VOCABULARY[practice.id] ?? {}),
    })),
  }));
}

function categoryDescription(categoryId: string, description: string, locale: 'en' | 'es'): string {
  if (categoryId === 'power') {
    const sentence = locale === 'es'
      ? 'La sumisión de servicio describe la vertiente en la que servir o atender forma parte explícita de la dinámica de poder.'
      : 'Service submission describes the side of the dynamic where serving or attending to another person is explicitly part of the power exchange.';
    return appendSentence(description, sentence);
  }

  if (categoryId === 'edge') {
    const sentence = locale === 'es'
      ? 'Edge play es el término paraguas para estas fantasías o prácticas consensuadas de mayor intensidad o riesgo.'
      : 'Edge play is the umbrella term for these higher-intensity or higher-risk consensual fantasies and practices.';
    return appendSentence(description, sentence);
  }

  return description;
}

function appendSentence(description: string, sentence: string): string {
  const trimmed = description.trim();
  return `${trimmed}${trimmed.endsWith('.') ? '' : '.'} ${sentence}`;
}
