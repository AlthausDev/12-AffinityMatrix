import { CataloguePracticeSeed } from './types';
import { PRACTICE_DESCRIPTION_OVERRIDES } from './practice-description-overrides';

export type CatalogueLocale = 'es' | 'en';

/** Returns concise explanatory copy for every current practice, with explicit definitions where needed. */
export function describeCataloguePractice(seed: CataloguePracticeSeed, locale: CatalogueLocale): string {
  const explicit = locale === 'es' ? seed.descriptionEs : seed.descriptionEn;
  if (explicit) return cleanConsentWording(explicit, locale);

  const definition = PRACTICE_DESCRIPTION_OVERRIDES[seed.id];
  if (definition) return cleanConsentWording(locale === 'es' ? definition.es : definition.en, locale);

  return locale === 'es' ? describeObviousPracticeEs(seed) : describeObviousPracticeEn(seed);
}

function describeObviousPracticeEs(seed: CataloguePracticeSeed): string {
  const label = seed.es;
  switch (seed.kind) {
    case 'directed':
      return `Preferencia por «${label}», diferenciando hacerlo a la pareja de recibirlo de ella.`;
    case 'directed-self':
      return `Preferencia por «${label}», diferenciando hacerlo con la pareja, recibirlo de ella y la variante con el propio cuerpo o material.`;
    case 'mutual':
      return `Interés por «${label}» como actividad compartida entre las personas participantes.`;
    case 'self':
      return `Interés personal por «${label}» como actividad o experiencia propia.`;
    case 'state':
      return `Preferencia por «${label}», valorada por separado cuando se da en ti y cuando se da en tu pareja.`;
    case 'wear':
      return `Interés por «${label}», distinguiendo llevarlo tú de que lo lleve tu pareja.`;
    case 'watch':
      return `Interés por «${label}», distinguiendo observar de ser observado/a en ese contexto.`;
    case 'power':
      return `Interés por «${label}», diferenciando ejercer el control de ocupar el rol receptivo.`;
    case 'paired':
      return `Interés por «${label}», con sus dos roles complementarios valorados de forma independiente.`;
    case 'group':
      return `Interés por «${label}», diferenciando ser la persona central de participar alrededor de ella.`;
    case 'focus':
      return `Atracción o interés erótico por «${label}» como rasgo, parte corporal o elemento de la pareja.`;
    case 'toy':
      return `Interés por usar «${label}», diferenciando uso propio, uso con la pareja y las zonas compatibles cuando corresponde.`;
    case 'dual-use-toy':
      return `Interés por usar «${label}», distinguiendo el uso compartido con la pareja del uso doble sobre uno mismo.`;
  }
}

function describeObviousPracticeEn(seed: CataloguePracticeSeed): string {
  const label = seed.en;
  switch (seed.kind) {
    case 'directed':
      return `Interest in “${label}”, rating doing it to a partner separately from receiving it.`;
    case 'directed-self':
      return `Interest in “${label}”, separating partner-directed, partner-received and self-directed variants.`;
    case 'mutual':
      return `Interest in “${label}” as a shared activity between the people involved.`;
    case 'self':
      return `Personal interest in “${label}” as an individual activity or experience.`;
    case 'state':
      return `Preference for “${label}”, rated separately when it applies to you and when it applies to a partner.`;
    case 'wear':
      return `Interest in “${label}”, distinguishing wearing it yourself from a partner wearing it.`;
    case 'watch':
      return `Interest in “${label}”, distinguishing watching from being watched in that context.`;
    case 'power':
      return `Interest in “${label}”, distinguishing the controlling role from the receptive role.`;
    case 'paired':
      return `Interest in “${label}”, with its two complementary roles rated independently.`;
    case 'group':
      return `Interest in “${label}”, distinguishing being the central person from participating around them.`;
    case 'focus':
      return `Erotic attraction or interest in “${label}” as a feature, body part or element of a partner.`;
    case 'toy':
      return `Interest in using “${label}”, distinguishing self-use, partnered use and compatible body sites where relevant.`;
    case 'dual-use-toy':
      return `Interest in using “${label}”, distinguishing shared use with a partner from double self-use.`;
  }
}

function cleanConsentWording(value: string, locale: CatalogueLocale): string {
  const cleaned = locale === 'es'
    ? value.replace(/\b(?:consensuad[oa]s?|consentid[oa]s?)\s+/gi, '').replace(/\s+(?:consensuad[oa]s?|consentid[oa]s?)\b/gi, '')
    : value.replace(/\bconsensual\s+/gi, '').replace(/\s+consensual\b/gi, '');
  return cleaned.replace(/\s{2,}/g, ' ').replace(/\s+([,.;:])/g, '$1').trim();
}
