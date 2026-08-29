import { CatalogueSubcategorySeed } from './catalogue-taxonomy-core';

/** Final taxonomy audit after the release walkthrough additions. */
export function applyCatalogueTaxonomyReleaseAudit(
  subcategories: readonly CatalogueSubcategorySeed[],
): readonly CatalogueSubcategorySeed[] {
  const reviewed = subcategories.map((subcategory) => {
    switch (subcategory.id) {
      case 'toys-penis-masturbators':
        return { ...subcategory, categoryId: 'sexual-accessories', order: 0 };
      case 'toys-suction-pelvic-sensation':
        return { ...subcategory, categoryId: 'sexual-accessories', order: 1 };
      case 'toys-machines-furniture-positioning':
        return { ...subcategory, categoryId: 'sexual-accessories', order: 2 };
      case 'exhibitionism-watching-visibility':
        return {
          ...subcategory,
          descriptionEn: 'Watching and being seen, from openly observed moments to unannounced watching that was explicitly agreed beforehand.',
          descriptionEs: 'Mirar y ser visto, desde momentos de observación abierta hasta observación sin aviso acordada expresamente de antemano.',
        };
      case 'places-away-secluded':
        return {
          ...subcategory,
          practiceIds: [
            ...subcategory.practiceIds,
            'sex-on-boat-private',
            'sex-in-camper-rv',
            'sex-in-train-private-cabin',
            'sex-in-secluded-forest',
            'sex-at-secluded-viewpoint',
          ],
        };
      case 'power-service':
        return {
          ...subcategory,
          en: 'Service, care & fetish attendance',
          es: 'Servicio, cuidado y atención fetichista',
          descriptionEn: 'Sexual, domestic, personal-care and fetish-oriented service ranging from attentive pleasure to more intense service-role fantasies.',
          descriptionEs: 'Servicio sexual, doméstico, de cuidado y fetichista, desde atención orientada al placer hasta fantasías de servicio más intensas.',
          practiceIds: [
            ...subcategory.practiceIds,
            'oral-service',
            'manual-pleasure-service',
            'orgasm-service',
            'intimate-grooming-service',
            'fetish-scent-service',
            'toilet-service-fantasy',
          ],
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
      id: 'sexual-style-planning-expression',
      categoryId: 'sexual-style',
      en: 'Planning, expression & energy',
      es: 'Planificación, expresión y energía',
      descriptionEn: 'Whether sex is spontaneous or planned, quiet or vocal, highly focused or physically energetic.',
      descriptionEs: 'Si el sexo surge espontáneamente o se planifica, es silencioso o vocal, muy concentrado o físicamente enérgico.',
      order: 2,
      practiceIds: [
        'spontaneous-sex',
        'planned-sex',
        'quiet-sex',
        'vocal-expressive-sex',
        'immersive-focused-sex',
        'energetic-sex',
      ],
    },
    {
      id: 'orgasm-protocol-goals',
      categoryId: 'orgasm-control',
      en: 'Permission, cues & orgasm goals',
      es: 'Permiso, señales y objetivos de orgasmo',
      descriptionEn: 'Structured orgasm control based on permission, a partner’s cue or a chosen number of orgasms.',
      descriptionEs: 'Control estructurado del orgasmo basado en permiso, una señal de la pareja o un número elegido de orgasmos.',
      order: 3,
      practiceIds: ['orgasm-on-command', 'orgasm-permission', 'orgasm-count-control'],
    },
    {
      id: 'groups-shared-focus-activities',
      categoryId: 'groups',
      en: 'Shared activities & group focus',
      es: 'Actividades compartidas y foco grupal',
      descriptionEn: 'Group scenes defined by a shared activity or by several participants focusing erotic attention on one person.',
      descriptionEs: 'Escenas grupales definidas por una actividad compartida o por varias personas concentrando atención erótica en una.',
      order: 4,
      practiceIds: [
        'group-oral-focus',
        'group-worship-focus',
        'group-masturbation-circle',
        'group-shared-toy-play',
      ],
    },
    {
      id: 'places-water-private-atmosphere',
      categoryId: 'places-settings',
      en: 'Water & private atmospheric spaces',
      es: 'Agua y espacios privados con atmósfera',
      descriptionEn: 'Private water, elevated or unusual spaces where the physical atmosphere of the place is central.',
      descriptionEs: 'Espacios privados acuáticos, elevados o inusuales donde la atmósfera física del lugar es central.',
      order: 3,
      practiceIds: [
        'sex-private-pool-hot-tub',
        'sex-on-rooftop-private',
        'sex-on-private-balcony',
        'sex-in-private-sauna-spa',
      ],
    },
    {
      id: 'places-controlled-unusual-spaces',
      categoryId: 'places-settings',
      en: 'Controlled unusual spaces',
      es: 'Espacios inusuales controlados',
      descriptionEn: 'Unusual private or after-hours environments where novelty or mild transgression matters without involving unaware bystanders.',
      descriptionEs: 'Entornos privados o fuera de horario donde importan la novedad o una transgresión leve sin implicar a terceros ajenos.',
      order: 4,
      practiceIds: [
        'sex-in-changing-room-controlled',
        'sex-in-elevator-after-hours',
        'sex-in-studio-warehouse',
      ],
    },
    {
      id: 'surrealism-impossible-biology-reality',
      categoryId: 'surrealism',
      en: 'Impossible biology & altered reality',
      es: 'Biología imposible y realidad alterada',
      descriptionEn: 'Fictional transformations, duplication, possession and impossible organisms or biological processes.',
      descriptionEs: 'Transformaciones ficticias, duplicación, posesión y organismos o procesos biológicos imposibles.',
      order: 2,
      practiceIds: [
        'clone-duplication-fantasy',
        'possession-fantasy',
        'slime-creature-fantasy',
        'oviposition-fantasy',
        'object-transformation-fantasy',
        'living-symbiote-fantasy',
      ],
    },
    {
      id: 'toys-everyday-objects',
      categoryId: 'sexual-accessories',
      en: 'Everyday & improvised objects',
      es: 'Objetos cotidianos e improvisados',
      descriptionEn: 'Ordinary objects used erotically because they are not purpose-made sex toys, with penetration separated by body site.',
      descriptionEs: 'Objetos cotidianos usados eróticamente precisamente sin ser juguetes sexuales especializados, separando la penetración por zona corporal.',
      order: 3,
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
