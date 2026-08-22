import { CataloguePracticeSeed } from './types';
import { PRACTICE_DESCRIPTION_OVERRIDES } from './practice-description-overrides';

export type CatalogueLocale = 'es' | 'en';

/** Returns concise explanatory copy for every current practice, with explicit overrides where needed. */
export function describeCataloguePractice(seed: CataloguePracticeSeed, locale: CatalogueLocale): string {
  const explicit = locale === 'es' ? seed.descriptionEs : seed.descriptionEn;
  if (explicit) return cleanConsentWording(explicit, locale);

  const definition = PRACTICE_DESCRIPTION_OVERRIDES[seed.id];
  if (definition) return cleanConsentWording(locale === 'es' ? definition.es : definition.en, locale);

  if (locale === 'es') {
    switch (seed.kind) {
      case 'directed':
        return 'Se valora por separado hacerlo a la pareja y recibirlo de ella.';
      case 'mutual':
        return 'Práctica compartida cuya preferencia se valora como participación conjunta.';
      case 'self':
        return 'Actividad individual que se valora como preferencia propia, no como acción sobre la pareja.';
      case 'state':
        return 'Se valora por separado que se dé en ti y que se dé en tu pareja.';
      case 'wear':
        return 'Se valora por separado llevarlo tú y que lo lleve tu pareja.';
      case 'watch':
        return 'Se distinguen las preferencias por observar y por ser observado/a en este contexto.';
      case 'power':
        return 'Dinámica con preferencias separadas para el rol de control y el rol receptivo.';
      case 'group':
        return 'Dinámica grupal que distingue entre ser la persona central y participar alrededor.';
      case 'focus':
        return 'Atracción o interés erótico centrado en este rasgo o parte del cuerpo de la pareja.';
      case 'toy':
        return 'Objeto o accesorio cuyo uso se valora en uno mismo, en la pareja y por zona corporal cuando procede.';
    }
  }

  switch (seed.kind) {
    case 'directed':
      return 'Giving this to a partner and receiving it from them are rated separately.';
    case 'mutual':
      return 'A shared practice rated as joint participation.';
    case 'self':
      return 'An individual activity rated as a personal preference rather than an action on a partner.';
    case 'state':
      return 'Rated separately for yourself and for your partner.';
    case 'wear':
      return 'Rated separately for wearing it yourself and for a partner wearing it.';
    case 'watch':
      return 'Watching and being watched in this context are rated separately.';
    case 'power':
      return 'A dynamic with separate preferences for the controlling and receptive roles.';
    case 'group':
      return 'A group dynamic distinguishing being the central person from participating around them.';
    case 'focus':
      return 'Erotic attraction or interest focused on this feature or body part of a partner.';
    case 'toy':
      return 'An object or accessory rated for self-use, partner use and body site where relevant.';
  }
}

function cleanConsentWording(value: string, locale: CatalogueLocale): string {
  const cleaned = locale === 'es'
    ? value.replace(/\b(?:consensuad[oa]s?|consentid[oa]s?)\s+/gi, '').replace(/\s+(?:consensuad[oa]s?|consentid[oa]s?)\b/gi, '')
    : value.replace(/\bconsensual\s+/gi, '').replace(/\s+consensual\b/gi, '');
  return cleaned.replace(/\s{2,}/g, ' ').replace(/\s+([,.;:])/g, '$1').trim();
}
