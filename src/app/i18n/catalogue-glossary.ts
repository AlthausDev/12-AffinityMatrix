import { Locale } from './locale';

export interface CatalogueGlossaryEntry {
  readonly id: string;
  readonly aliases: readonly string[];
  readonly en: string;
  readonly es: string;
}

export interface CatalogueGlossarySegment {
  readonly text: string;
  readonly termId?: string;
  readonly definition?: string;
}

export const CATALOGUE_GLOSSARY: readonly CatalogueGlossaryEntry[] = [
  term('creampie', ['creampie'], 'Ejaculation inside the vagina or anus; the catalogue separates vaginal and anal variants.', 'Eyaculación dentro de la vagina o del ano; el catálogo separa las variantes vaginal y anal.'),
  term('edging', ['edging'], 'Repeatedly approaching orgasm and reducing or pausing stimulation before climax. Orgasm may still happen later.', 'Acercarse repetidamente al orgasmo y reducir o pausar la estimulación antes del clímax. El orgasmo puede producirse después.'),
  term('teasing', ['teasing', 'tease'], 'Erotic provocation that builds desire or anticipation without necessarily moving directly toward orgasm.', 'Provocación erótica que aumenta el deseo o la anticipación sin avanzar necesariamente de forma directa hacia el orgasmo.'),
  term('cnc', ['CNC', 'consensual non-consent'], 'Consensual non-consent: an adult pre-agreed roleplay that simulates resistance or lack of consent within established limits.', 'Consensual non-consent: roleplay adulto previamente acordado que simula resistencia o falta de consentimiento dentro de límites establecidos.'),
  term('bondage', ['bondage'], 'Erotic restraint or restriction of movement. The catalogue separates rope, cuffs, positioning and advanced forms.', 'Restricción erótica o limitación del movimiento. El catálogo separa cuerdas, esposas, posicionamiento y formas avanzadas.'),
  term('shibari', ['shibari'], 'Japanese-influenced rope bondage where tying structure, body lines and rope aesthetics are especially important.', 'Bondage con cuerdas de influencia japonesa donde importan especialmente la estructura del atado, las líneas corporales y la estética de la cuerda.'),
  term('collaring', ['collaring'], 'Using a collar as a consensual symbol of submission, belonging or an ongoing power-exchange relationship.', 'Uso de un collar como símbolo consensuado de sumisión, pertenencia o una relación continuada de intercambio de poder.'),
  term('soft-swap', ['soft swap', 'soft-swap'], 'A swinging format with some sexual contact between partners from different couples but without full penetrative partner exchange.', 'Formato de swinging con cierto contacto sexual entre personas de parejas distintas, pero sin intercambio completo de pareja con penetración.'),
  term('full-swap', ['full swap', 'full-swap'], 'A swinging format where couples consensually allow full sexual partner exchange.', 'Formato de swinging donde las parejas permiten consensuadamente un intercambio sexual completo de pareja.'),
  term('hotwife', ['hotwife'], 'A consensual couple dynamic centred on a woman having sex with other people with her partner’s knowledge or encouragement; humiliation is not inherent.', 'Dinámica consensuada de pareja centrada en que una mujer tenga sexo con otras personas con conocimiento o estímulo de su pareja; la humillación no es inherente.'),
  term('cuckold', ['cuckold'], 'A consensual dynamic where a man is the partner whose partner has sex with other people. Humiliation or submission may be present in some versions but is not required.', 'Dinámica consensuada donde un hombre es la pareja cuya pareja tiene sexo con otras personas. Algunas variantes incluyen humillación o sumisión, pero no es obligatorio.'),
  term('cuckquean', ['cuckquean'], 'The female counterpart to a cuckold role: a consensual dynamic where a woman is the partner whose partner has sex with other people.', 'Equivalente femenino del rol cuckold: dinámica consensuada donde una mujer es la pareja cuya pareja tiene sexo con otras personas.'),
  term('snowballing', ['snowballing'], 'Passing semen between partners by mouth, usually through kissing or mouth-to-mouth transfer.', 'Intercambio de semen entre personas mediante la boca, normalmente a través de besos o transferencia boca a boca.'),
  term('scat', ['scat'], 'Sexual interest or fantasy involving feces. DesireSync keeps contact, mouth/ingestion and own-material interests separate.', 'Interés o fantasía sexual relacionada con heces. DesireSync separa contacto, boca/ingesta e interés por el propio material.'),
  term('squirting', ['squirting'], 'Expulsion of fluid through the urethral area during sexual arousal or orgasm in some people with female anatomy; it is distinct from ordinary vaginal lubrication.', 'Expulsión de fluido por la zona uretral durante la excitación sexual u orgasmo en algunas personas con anatomía femenina; es distinta de la lubricación vaginal habitual.'),
  term('gangbang', ['gangbang'], 'A group-sex configuration where several participants focus sexual attention on one central participant.', 'Configuración de sexo en grupo donde varias personas concentran la atención sexual en una persona central.'),
  term('glory-hole', ['glory hole', 'glory-hole'], 'An encounter separated by a wall or partition with an opening through which genital or sexual contact occurs.', 'Encuentro separado por una pared o mampara con una abertura a través de la cual se produce contacto genital o sexual.'),
  term('pet-play', ['pet play', 'pet-play'], 'Adult consensual roleplay where one person takes an animal-like pet role and another a handler/owner role; it does not involve real animals.', 'Roleplay consensuado entre adultos donde una persona adopta un rol de mascota animalizada y otra de guía/propietario; no implica animales reales.'),
  term('fisting', ['fisting'], 'Penetrative practice centred on gradually accommodating a hand rather than only fingers. DesireSync separates vaginal and anal interest.', 'Práctica penetrativa centrada en acomodar una mano en lugar de únicamente dedos. DesireSync separa el interés vaginal y anal.'),
  term('voyeurism', ['voyeurism', 'voyeurismo'], 'Consensual erotic interest in watching another person or sexual activity. In DesireSync it does not imply secretly observing unaware people.', 'Interés erótico consensuado en observar a otra persona o actividad sexual. En DesireSync no implica observar en secreto a personas que no lo sepan.'),
  term('exhibitionism', ['exhibitionism', 'exhibicionismo'], 'Consensual erotic interest in being seen, watched, posed or displayed. Uninvolved bystanders are not implied.', 'Interés erótico consensuado en ser visto/a, observado/a, posar o mostrarse. No implica involucrar a terceros ajenos.'),
  term('cbt', ['CBT', 'cock and ball torture'], 'Cock and ball torture: consensual pain-focused play involving the penis and testicles. It is placed in Edge because of its intensity and risk profile.', 'Cock and ball torture: juego consensuado centrado en dolor en pene y testículos. Está en Edge por su intensidad y perfil de riesgo.'),
  term('smothering', ['smothering'], 'A high-risk fantasy involving covering or enclosing the face and the associated helplessness or breathing-control imagery.', 'Fantasía de alto riesgo relacionada con cubrir o encerrar la cara y la indefensión o imaginería de control respiratorio asociada.'),
  term('needle-play', ['needle play', 'needle-play'], 'Edge play where needle puncture sensation or imagery is part of the erotic premise, distinct from ordinary piercing aesthetics.', 'Juego edge donde la sensación o imaginería de punción con agujas forma parte de la premisa erótica, distinto de la estética cotidiana de piercings.'),
  term('fire-play', ['fire play', 'fire-play'], 'An Edge theme involving flame, fire imagery or very close heat. Literal fire introduces substantial real-world risk.', 'Tema Edge relacionado con llama, imaginería de fuego o calor muy próximo. El fuego literal introduce un riesgo real considerable.'),
  term('predicament-bondage', ['predicament bondage'], 'Restraint where avoiding one difficult position or sensation creates another difficult choice; the dilemma is central to the fantasy.', 'Restricción donde evitar una postura o sensación difícil genera otra elección complicada; el dilema es central en la fantasía.'),
  term('mummification', ['mummification', 'momificación'], 'Whole-body wrapping or enclosure used as a restraint fantasy, with strong emphasis on immobilisation and confinement.', 'Envoltura o encierro de gran parte del cuerpo como fantasía de restricción, con fuerte énfasis en inmovilización y confinamiento.'),
] as const;

function term(id: string, aliases: readonly string[], en: string, es: string): CatalogueGlossaryEntry {
  return { id, aliases, en, es };
}

const ALIASES = CATALOGUE_GLOSSARY
  .flatMap((entry) => entry.aliases.map((alias) => ({ alias, entry })))
  .sort((left, right) => right.alias.length - left.alias.length);
const ALIAS_LOOKUP = new Map(ALIASES.map(({ alias, entry }) => [alias.toLocaleLowerCase(), entry]));
const TERM_PATTERN = new RegExp(`(${ALIASES.map(({ alias }) => escapeRegex(alias)).join('|')})`, 'giu');

export function splitCatalogueGlossaryText(text: string, locale: Locale): readonly CatalogueGlossarySegment[] {
  if (!text) return [];
  const segments: CatalogueGlossarySegment[] = [];
  let cursor = 0;

  for (const match of text.matchAll(TERM_PATTERN)) {
    const index = match.index ?? 0;
    if (index > cursor) segments.push({ text: text.slice(cursor, index) });
    const matchedText = match[0];
    const entry = ALIAS_LOOKUP.get(matchedText.toLocaleLowerCase());
    segments.push(entry
      ? { text: matchedText, termId: entry.id, definition: locale === 'es' ? entry.es : entry.en }
      : { text: matchedText });
    cursor = index + matchedText.length;
  }

  if (cursor < text.length) segments.push({ text: text.slice(cursor) });
  return segments.length > 0 ? segments : [{ text }];
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
