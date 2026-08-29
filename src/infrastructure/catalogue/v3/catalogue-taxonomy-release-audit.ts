import { CatalogueSubcategorySeed } from './catalogue-taxonomy-core';

/** Final taxonomy audit after the release walkthrough additions. */
export function applyCatalogueTaxonomyReleaseAudit(
  subcategories: readonly CatalogueSubcategorySeed[],
): readonly CatalogueSubcategorySeed[] {
  const reviewed = subcategories.map((subcategory) => {
    switch (subcategory.id) {
      case 'exhibitionism-watching-visibility':
        return {
          ...subcategory,
          descriptionEn: 'Watching and being seen, from openly observed moments to unannounced watching that was explicitly agreed beforehand.',
          descriptionEs: 'Mirar y ser visto, desde momentos de observación abierta hasta observación sin aviso acordada expresamente de antemano.',
        };
      case 'fluids-sweat-substances':
        return {
          ...subcategory,
          en: 'Sweat, oil & messy substances',
          es: 'Sudor, aceites y sustancias pringosas',
          descriptionEn: 'Sweat, oil and mud where licking, texture, coating or deliberate messiness shapes the experience.',
          descriptionEs: 'Sudor, aceite y barro cuando lamer, la textura, el recubrimiento o ensuciarse deliberadamente dan forma a la experiencia.',
          order: 6,
          practiceIds: ['sweat-play', 'sweat-licking', 'oil-body-play', 'mud-body-play'],
        };
      case 'edge-intense-genital-breast-pain':
        return {
          ...subcategory,
          en: 'Genital torture & intense chest pain',
          es: 'Tortura genital y dolor intenso de pecho',
          descriptionEn: 'High-intensity pain focused on external genitals, the vaginal canal, urethra, penis/testicles, chest or nipples.',
          descriptionEs: 'Dolor de alta intensidad centrado en genitales externos, canal vaginal, uretra, pene/testículos, pecho o pezones.',
          practiceIds: [
            'pussy-torture',
            'vaginal-torture',
            'urethral-torture',
            'cock-and-ball-torture',
            'breast-torture',
            'nipple-torture',
          ],
        };
      default:
        return subcategory;
    }
  });

  return [
    ...reviewed,
    {
      id: 'toys-everyday-objects',
      categoryId: 'toys',
      en: 'Everyday & improvised objects',
      es: 'Objetos cotidianos e improvisados',
      descriptionEn: 'Ordinary objects used erotically because they are not purpose-made sex toys, with penetration separated by body site.',
      descriptionEs: 'Objetos cotidianos usados eróticamente precisamente sin ser juguetes sexuales especializados, separando la penetración por zona corporal.',
      order: 7,
      practiceIds: [
        'everyday-object-play',
        'everyday-object-vaginal-penetration',
        'everyday-object-anal-penetration',
      ],
    },
    {
      id: 'fluids-food-edible',
      categoryId: 'fluids',
      en: 'Food & edible play',
      es: 'Alimentos y juego comestible',
      descriptionEn: 'Food used on the body, offered or eaten erotically, plus vaginal and anal penetration when food itself is the penetrative element.',
      descriptionEs: 'Alimentos sobre el cuerpo, ofrecidos o consumidos eróticamente, además de penetración vaginal y anal cuando el propio alimento es el elemento penetrativo.',
      order: 5,
      practiceIds: [
        'food-body-play',
        'erotic-feeding',
        'food-from-body',
        'food-vaginal-penetration',
        'food-anal-penetration',
      ],
    },
  ];
}
