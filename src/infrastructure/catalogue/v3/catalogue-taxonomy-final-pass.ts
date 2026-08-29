import { CatalogueSubcategorySeed } from './catalogue-taxonomy-core';

/** Final release taxonomy edits after the last manual questionnaire walkthrough. */
export function applyCatalogueTaxonomyFinalPass(
  subcategories: readonly CatalogueSubcategorySeed[],
): readonly CatalogueSubcategorySeed[] {
  const reviewed = subcategories.map((subcategory) => {
    switch (subcategory.id) {
      case 'exhibitionism-watching-visibility':
        return {
          ...subcategory,
          descriptionEn: 'Private visual dynamics centred on watching, performing or deliberately being seen by a partner.',
          descriptionEs: 'Dinámicas visuales privadas centradas en mirar, actuar o dejarse ver deliberadamente por la pareja.',
          practiceIds: [
            'voyeurism',
            'watching-undressing',
            'watched-masturbation',
            'private-striptease',
            'mirrors',
            'lights-on',
            'risk-of-being-seen',
          ],
        };
      case 'exhibitionism-image-digital':
        return {
          ...subcategory,
          descriptionEn: 'Erotic photos, private recordings and remote media exchange, separating making images together from sending or receiving them.',
          descriptionEs: 'Fotos eróticas, grabaciones privadas e intercambio a distancia, diferenciando crear imágenes juntos de enviarlas o recibirlas.',
          practiceIds: [
            'erotic-selfies',
            'taking-erotic-photos',
            'erotic-photo-session-together',
            'erotic-media-exchange',
            'private-recording',
            'watch-private-recording-together',
            'video-call-sex',
            'webcam-performance-private',
          ],
        };
      case 'power-service':
        return {
          ...subcategory,
          descriptionEn: 'Service as part of a power dynamic: general, sexual, domestic, personal-care, attentive and explicitly erotic forms.',
          descriptionEs: 'Servicio dentro de una dinámica de poder: general, sexual, doméstico, de cuidado, de atención y formas específicamente eróticas.',
          practiceIds: [
            'service',
            'sexual-service',
            'domestic-service',
            'body-care-service',
            'attentive-service',
            'pleasure-focused-service',
            'erotic-presentation-service',
          ],
        };
      case 'fluids-internal-sexual':
        return {
          ...subcategory,
          en: 'Internal ejaculation & sexual fluids',
          es: 'Eyaculación interna y fluidos sexuales',
          descriptionEn: 'Vaginal or anal creampie plus female ejaculation/squirting. Cleanup is separated because the method changes the fantasy.',
          descriptionEs: 'Creampie vaginal o anal y eyaculación femenina/squirting. La limpieza se separa porque la forma de hacerla cambia la fantasía.',
          order: 2,
          practiceIds: ['creampie-vaginal', 'creampie-anal', 'female-ejaculation', 'squirting-on-partner'],
        };
      case 'fluids-urine-blood-scat':
        return {
          ...subcategory,
          descriptionEn: 'Urine, blood and scat, with partner-directed, partner-received and own-material variants answered inside each relevant practice.',
          descriptionEs: 'Orina, sangre y scat, con variantes hacia la pareja, recibidas de la pareja y con el propio material dentro de cada práctica correspondiente.',
          order: 4,
          practiceIds: [
            'urine-play', 'urine-drinking',
            'blood-play', 'blood-on-body', 'blood-drinking',
            'scat-on-body', 'scat-in-mouth', 'scat-ingestion',
          ],
        };
      case 'fluids-sweat-substances':
        return { ...subcategory, order: 5 };
      default:
        return subcategory;
    }
  });

  return [
    ...reviewed,
    {
      id: 'fluids-semen-cleanup',
      categoryId: 'fluids',
      en: 'Semen cleanup',
      es: 'Limpieza del semen',
      descriptionEn: 'Erotic cleanup after external ejaculation or a creampie, separated by manual, oral or other cleanup because those interests can differ substantially.',
      descriptionEs: 'Limpieza erótica tras una eyaculación externa o un creampie, separada en manual, oral u otras formas porque pueden ser intereses muy distintos.',
      order: 3,
      practiceIds: ['semen-cleanup-manual', 'semen-cleanup-oral', 'semen-cleanup-other'],
    },
  ];
}
