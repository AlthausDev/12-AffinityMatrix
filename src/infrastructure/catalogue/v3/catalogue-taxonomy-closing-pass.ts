import { CatalogueSubcategorySeed } from './catalogue-taxonomy-core';

/** Final grouping edits after the last 0.2 content walkthrough. */
export function applyCatalogueTaxonomyClosingPass(
  subcategories: readonly CatalogueSubcategorySeed[],
): readonly CatalogueSubcategorySeed[] {
  return subcategories.map((subcategory) => {
    switch (subcategory.id) {
      case 'groups-watching-relationship-dynamics':
        return {
          ...subcategory,
          en: 'Partner-with-others & relationship framing',
          es: 'Pareja con terceros y marco relacional',
          descriptionEn: 'Partner-with-others interests, separating the scene itself, erotic compersion and cuckold/cuckquean role framing.',
          descriptionEs: 'Intereses sobre la pareja con terceros, separando la propia escena, la compersión erótica y los marcos cuckold/cuckquean.',
          practiceIds: ['watching-partner-with-other', 'erotic-compersion', 'cuckold-dynamic', 'cuckquean-dynamic'],
        };
      case 'exhibitionism-watching-visibility':
        return {
          ...subcategory,
          descriptionEn: 'Watching and being seen, from openly observed moments to unannounced watching that was explicitly agreed beforehand.',
          descriptionEs: 'Mirar y ser visto, desde momentos de observación abierta hasta observación sin aviso expresamente acordada de antemano.',
          practiceIds: [
            'voyeurism',
            'preagreed-unannounced-watching',
            'watching-undressing',
            'watched-masturbation',
            'private-striptease',
            'mirrors',
            'lights-on',
            'risk-of-being-seen',
          ],
        };
      case 'places-away-secluded':
        return {
          ...subcategory,
          en: 'Away from home, secluded & atmospheric',
          es: 'Fuera de casa, apartados y con atmósfera',
          descriptionEn: 'Private or secluded settings where novelty, landscape or a distinctive atmosphere is part of the appeal.',
          descriptionEs: 'Entornos privados o apartados donde la novedad, el paisaje o una atmósfera particular forman parte del atractivo.',
          practiceIds: [
            'sex-in-car',
            'sex-in-hotel',
            'sex-in-office-after-hours',
            'sex-in-abandoned-place',
            'sex-outdoors-private',
            'sex-on-secluded-beach',
            'sex-while-camping',
          ],
        };
      case 'power-service':
        return {
          ...subcategory,
          en: 'Service, care & erotic attendance',
          es: 'Servicio, cuidado y atención erótica',
          descriptionEn: 'Distinct service roles: sexual pleasure, domestic tasks, personal care, attentive waiting, erotic presentation and fetish-oriented scene support.',
          descriptionEs: 'Roles de servicio diferenciados: placer sexual, tareas domésticas, cuidado personal, atención, presentación erótica y apoyo fetichista a la escena.',
          practiceIds: [
            'sexual-service',
            'domestic-service',
            'body-care-service',
            'attentive-service',
            'erotic-presentation-service',
            'footwear-service',
            'fetish-gear-service',
          ],
        };
      case 'restraint-furniture-confinement':
        return {
          ...subcategory,
          en: 'BDSM furniture, stocks & confinement',
          es: 'Mobiliario BDSM, cepos y confinamiento',
          descriptionEn: 'Fixed furniture that determines posture or access: crosses, benches, chairs, stocks and cages.',
          descriptionEs: 'Mobiliario fijo que determina postura o acceso: cruces, bancos, sillas, cepos y jaulas.',
          practiceIds: [
            'st-andrews-cross-restraint',
            'bondage-bench-restraint',
            'bondage-chair-restraint',
            'stocks-restraint',
            'cage-confinement',
          ],
        };
      case 'fluids-semen-cleanup':
        return {
          ...subcategory,
          descriptionEn: 'Erotic semen cleanup, separating manual cleanup, oral cleanup after external ejaculation, oral cleanup after a creampie and other distinct forms.',
          descriptionEs: 'Limpieza erótica del semen, separando limpieza manual, oral tras eyaculación exterior, oral tras creampie y otras formas distintas.',
          practiceIds: [
            'semen-cleanup-manual',
            'semen-cleanup-oral-external',
            'semen-cleanup-oral-creampie',
            'semen-cleanup-other',
          ],
        };
      default:
        return subcategory;
    }
  });
}
