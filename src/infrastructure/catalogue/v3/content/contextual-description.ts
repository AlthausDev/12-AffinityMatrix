import { PRACTICE_DESCRIPTION_OVERRIDES } from './practice-description-overrides';
import { describeCataloguePractice } from './practice-description';
import { CatalogueCategorySeed, CataloguePracticeSeed } from './types';

/**
 * Materializes category-aware descriptions before the final content pass. Explicit definitions and
 * glossary entries always win; only otherwise-obvious labels use these contextual sentences.
 */
export function materializeContextualDescriptions(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  return content.map((category) => ({
    ...category,
    practices: category.practices.map((practice) => materializePractice(practice, category.id)),
  }));
}

function materializePractice(seed: CataloguePracticeSeed, categoryId: string): CataloguePracticeSeed {
  if (seed.descriptionEn || seed.descriptionEs || PRACTICE_DESCRIPTION_OVERRIDES[seed.id]) {
    return {
      ...seed,
      descriptionEn: describeCataloguePractice(seed, 'en'),
      descriptionEs: describeCataloguePractice(seed, 'es'),
    };
  }

  return {
    ...seed,
    descriptionEn: contextualEnglish(seed, categoryId),
    descriptionEs: contextualSpanish(seed, categoryId),
  };
}

function contextualSpanish(seed: CataloguePracticeSeed, categoryId: string): string {
  const label = `«${seed.es}»`;
  switch (categoryId) {
    case 'affection-intimacy':
      return `${label} describe una forma concreta de cercanía física o afectiva dentro de la intimidad.`;
    case 'sexual-style':
      return `${label} expresa una preferencia sobre el ritmo, momento, tono o ambiente general del encuentro sexual.`;
    case 'clothing-appearance':
      return `${label} se valora como elemento de vestimenta, estilo o presentación erótica, distinguiendo llevarlo tú de verlo en la pareja.`;
    case 'manual-masturbation':
      return `${label} describe una forma concreta de estimulación con las manos, los dedos o la masturbación individual o compartida.`;
    case 'oral':
      return `${label} describe una forma concreta de estimulación sexual realizada principalmente con la boca, labios o lengua.`;
    case 'penetration':
      return `${label} describe una modalidad, profundidad, intensidad o zona concreta dentro de las prácticas de penetración.`;
    case 'toys':
      return `${label} describe un juguete o accesorio sexual concreto y se valora según quién lo usa y las zonas corporales compatibles.`;
    case 'orgasm-control':
      return `${label} expresa una preferencia concreta sobre la aproximación al orgasmo, su momento, intensidad o control.`;
    case 'body-fetishes':
      return `Atracción o interés erótico centrado específicamente en ${label.toLocaleLowerCase('es')} de la pareja.`;
    case 'groups':
      return `${label} describe una composición o dinámica sexual concreta en la que participan más de dos personas.`;
    case 'roleplay':
      return `${label} describe una premisa, personaje o fantasía concreta utilizada como base de una escena de roleplay.`;
    case 'exhibitionism':
      return `${label} describe una forma concreta de mirar, ser visto, exponerse visualmente o registrar contenido erótico.`;
    case 'places-settings':
      return `${label} expresa interés por ese lugar o entorno concreto como escenario de actividad sexual.`;
    case 'power':
      return `${label} describe una dinámica concreta de intercambio de poder, autoridad, servicio o control entre las personas.`;
    case 'restraint':
      return `${label} describe una forma concreta de limitar el movimiento, mantener una posición o restringir físicamente el cuerpo.`;
    case 'psychological':
      return `${label} describe un elemento concreto de juego psicológico, verbal, emocional o de percepción dentro de la escena.`;
    case 'sensation':
      return `${label} se valora por la sensación física concreta, textura, presión, temperatura o estímulo que produce.`;
    case 'fluids':
      return `${label} describe una forma concreta de incorporar fluidos o sustancias al contacto corporal o al juego sexual.`;
    case 'edge':
      return `${label} describe una práctica de intensidad elevada cuya naturaleza y límites conviene valorar de forma independiente.`;
    default:
      return describeCataloguePractice(seed, 'es');
  }
}

function contextualEnglish(seed: CataloguePracticeSeed, categoryId: string): string {
  const label = `“${seed.en}”`;
  switch (categoryId) {
    case 'affection-intimacy':
      return `${label} describes a specific form of physical or affectionate closeness within intimacy.`;
    case 'sexual-style':
      return `${label} expresses a preference about the pace, timing, tone or overall atmosphere of a sexual encounter.`;
    case 'clothing-appearance':
      return `${label} is rated as a clothing, styling or erotic-presentation element, distinguishing wearing it yourself from seeing it on a partner.`;
    case 'manual-masturbation':
      return `${label} describes a specific form of stimulation using hands or fingers, or individual or shared masturbation.`;
    case 'oral':
      return `${label} describes a specific form of sexual stimulation performed mainly with the mouth, lips or tongue.`;
    case 'penetration':
      return `${label} describes a specific mode, depth, intensity or body site within penetrative practices.`;
    case 'toys':
      return `${label} describes a specific sexual toy or accessory, rated by who uses it and the compatible body sites.`;
    case 'orgasm-control':
      return `${label} expresses a specific preference about approaching orgasm, its timing, intensity or control.`;
    case 'body-fetishes':
      return `Erotic attraction or interest focused specifically on ${label.toLocaleLowerCase('en')} in a partner.`;
    case 'groups':
      return `${label} describes a specific sexual composition or dynamic involving more than two people.`;
    case 'roleplay':
      return `${label} describes a specific premise, character or fantasy used as the basis of a roleplay scene.`;
    case 'exhibitionism':
      return `${label} describes a specific way of watching, being watched, visual exposure or recording erotic content.`;
    case 'places-settings':
      return `${label} expresses interest in that specific place or setting as the environment for sexual activity.`;
    case 'power':
      return `${label} describes a specific dynamic of power exchange, authority, service or control between participants.`;
    case 'restraint':
      return `${label} describes a specific way of limiting movement, maintaining a position or physically restraining the body.`;
    case 'psychological':
      return `${label} describes a specific psychological, verbal, emotional or perceptual element used within a scene.`;
    case 'sensation':
      return `${label} is rated for the specific physical sensation, texture, pressure, temperature or stimulus it produces.`;
    case 'fluids':
      return `${label} describes a specific way of incorporating fluids or substances into body contact or sexual play.`;
    case 'edge':
      return `${label} describes a higher-intensity practice whose nature and boundaries are useful to rate independently.`;
    default:
      return describeCataloguePractice(seed, 'en');
  }
}
