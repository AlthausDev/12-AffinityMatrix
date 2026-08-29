import { CatalogueSubcategorySeed } from './catalogue-taxonomy-core';

export function applyManualTaxonomyReview(
  subcategories: readonly CatalogueSubcategorySeed[],
): readonly CatalogueSubcategorySeed[] {
  const reviewed = subcategories.map((subcategory) => {
    switch (subcategory.id) {
      case 'body-genitals-pubic':
        return {
          ...subcategory,
          en: 'Genitals',
          es: 'Genitales',
          descriptionEn: 'Genital anatomy and genital-size preferences, separating external vulva from the internal vagina.',
          descriptionEs: 'Anatomía genital y preferencias de tamaño, diferenciando la vulva externa de la vagina interna.',
          practiceIds: [...subcategory.practiceIds.filter((id) => id !== 'pubic-hair'), 'vagina'],
        };
      case 'body-hair-scent-sweat':
        return {
          ...subcategory,
          en: 'Body hair, scent & sweat',
          es: 'Vello corporal, olor y sudor',
          descriptionEn: 'Body-hair preferences including pubic hair, plus natural body scent, armpits and sweat.',
          descriptionEs: 'Preferencias de vello corporal, incluido el vello púbico, además del olor corporal natural, axilas y sudor.',
          practiceIds: ['pubic-hair', ...subcategory.practiceIds.filter((id) => id !== 'pubic-hair')],
        };
      case 'exhibitionism-watching-visibility':
        return {
          ...subcategory,
          descriptionEn: 'Consensual visual exposure and voyeuristic interest, from watching a partner undress to deliberately increasing how visible an intimate encounter feels.',
          descriptionEs: 'Exposición visual consensuada e interés voyeur, desde observar a la pareja al desvestirse hasta aumentar deliberadamente cuánto se siente visible un encuentro íntimo.',
          practiceIds: insertAfter(subcategory.practiceIds, 'voyeurism', ['watching-undressing']),
        };
      case 'exhibitionism-image-digital':
        return {
          ...subcategory,
          en: 'Photography, recording & digital distance',
          es: 'Fotografía, grabación y distancia digital',
          descriptionEn: 'Consensual erotic photography, private recordings and live remote interaction, distinguishing self-images, photographing a partner and creating images together.',
          descriptionEs: 'Fotografía erótica consensuada, grabaciones privadas e interacción remota, diferenciando autorretratos, fotografiar a la pareja y crear imágenes juntos.',
          practiceIds: [
            'erotic-selfies',
            'taking-erotic-photos',
            'partner-erotic-photography',
            'erotic-photo-session-together',
            'private-recording',
            'watch-private-recording-together',
            'video-call-sex',
            'webcam-performance-private',
          ],
        };
      case 'power-service':
        return {
          ...subcategory,
          descriptionEn: 'General, sexual, domestic, personal-care and attentive service where serving or being served is intentionally part of the power dynamic.',
          descriptionEs: 'Servicio general, sexual, doméstico, de cuidado personal y de atención donde servir o ser servido forma deliberadamente parte de la dinámica de poder.',
          practiceIds: [
            ...subcategory.practiceIds,
            'body-care-service',
            'hospitality-service',
            'ritual-attendance-service',
          ],
        };
      case 'power-ownership-symbols':
        return {
          ...subcategory,
          descriptionEn: 'Consensual ownership-style dynamics expressed through collaring, leash control, personal tokens, temporary marks or an assigned submissive name.',
          descriptionEs: 'Dinámicas consensuadas de pertenencia expresadas mediante collaring, correa, símbolos personales, marcas temporales o un nombre asignado de sumisión.',
          practiceIds: [
            ...subcategory.practiceIds,
            'ownership-token',
            'temporary-ownership-marking',
            'assigned-submissive-name',
          ],
        };
      case 'sensation-light-sensory-modulation':
        return { ...subcategory, order: 0 };
      case 'sensation-temperature-electric':
        return { ...subcategory, order: 1 };
      case 'sensation-rough-pressure-pinching':
        return { ...subcategory, order: 2 };
      case 'sensation-impact':
        return { ...subcategory, order: 3 };
      case 'fluids-semen-oral-external':
        return {
          ...subcategory,
          practiceIds: insertAfter(subcategory.practiceIds, 'semen-on-buttocks', ['semen-on-other-body']),
        };
      case 'fluids-urine-blood-scat':
        return {
          ...subcategory,
          descriptionEn: 'Higher-taboo urine, blood and scat interests, separating partner-to-partner directions from interest in one’s own bodily material.',
          descriptionEs: 'Intereses más tabú relacionados con orina, sangre y scat, diferenciando las direcciones entre personas del interés por los propios fluidos o material corporal.',
          practiceIds: [
            'urine-play', 'urine-drinking', 'own-urine-play',
            'blood-play', 'blood-on-body', 'blood-drinking', 'own-blood-play',
            'scat-on-body', 'scat-in-mouth', 'scat-ingestion', 'own-scat-play',
          ],
        };
      default:
        return subcategory;
    }
  });

  return [
    ...reviewed,
    {
      id: 'edge-ordeal-helplessness',
      categoryId: 'edge',
      en: 'Ordeal & extreme helplessness',
      es: 'Prueba e indefensión extrema',
      descriptionEn: 'High-intensity consensual fantasies where endurance, being tested or an extreme loss-of-control feeling is the central theme rather than one particular technique.',
      descriptionEs: 'Fantasías consensuadas de alta intensidad donde la resistencia, ser puesto/a a prueba o una sensación extrema de pérdida de control son el tema central, y no una técnica concreta.',
      order: 4,
      practiceIds: ['ordeal-scene', 'extreme-helplessness-fantasy'],
    },
  ];
}

function insertAfter(order: readonly string[], anchor: string, inserted: readonly string[]): readonly string[] {
  const existing = order.filter((id) => !inserted.includes(id));
  const index = existing.indexOf(anchor);
  if (index < 0) return [...existing, ...inserted];
  return [...existing.slice(0, index + 1), ...inserted, ...existing.slice(index + 1)];
}
