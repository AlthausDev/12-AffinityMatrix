import { CatalogueCategorySeed, CataloguePracticeSeed } from './types';

/**
 * Additional sexual positions introduced during the 0.2 taxonomy pass.
 *
 * They intentionally describe distinct body arrangements rather than renaming minor variations
 * of an existing position. Practice identity remains independent from the sexual act performed
 * while using the position.
 */
export const EXPANDED_SEXUAL_POSITIONS: readonly CataloguePracticeSeed[] = [
  {
    id: 'side-by-side-face-to-face',
    en: 'Side-by-side face-to-face',
    es: 'De lado cara a cara',
    kind: 'mutual',
    counterpartScoped: true,
    descriptionEn: 'Both partners lie on their sides facing each other, keeping the bodies close while arranging their legs to allow the desired sexual activity.',
    descriptionEs: 'Ambas personas están tumbadas de lado y cara a cara, manteniendo los cuerpos próximos mientras colocan las piernas para permitir la actividad sexual deseada.',
  },
  {
    id: 'prone-rear-entry',
    en: 'Prone rear-entry',
    es: 'Desde atrás tumbado/a boca abajo',
    kind: 'mutual',
    counterpartScoped: true,
    descriptionEn: 'The receiving partner lies face down while the other partner positions behind or partly above them for rear-entry sexual activity.',
    descriptionEs: 'Quien recibe permanece tumbado/a boca abajo mientras la otra persona se coloca detrás o parcialmente encima para una actividad sexual desde atrás.',
  },
  {
    id: 'kneeling-face-to-face',
    en: 'Kneeling face-to-face',
    es: 'De rodillas cara a cara',
    kind: 'mutual',
    counterpartScoped: true,
    descriptionEn: 'Both partners remain upright on their knees facing each other, allowing close torso contact and an upright face-to-face angle.',
    descriptionEs: 'Ambas personas permanecen erguidas sobre las rodillas y cara a cara, permitiendo contacto cercano del torso y un ángulo frontal vertical.',
  },
  {
    id: 'butterfly-position',
    en: 'Butterfly position',
    es: 'Postura de la mariposa',
    kind: 'mutual',
    counterpartScoped: true,
    descriptionEn: 'One partner lies or reclines with their hips near the edge of a bed or raised surface while the other partner stands or kneels between their legs.',
    descriptionEs: 'Una persona está tumbada o reclinada con la cadera cerca del borde de una cama o superficie elevada mientras la otra permanece de pie o de rodillas entre sus piernas.',
  },
  {
    id: 't-position',
    en: 'T-position',
    es: 'Postura en T',
    kind: 'mutual',
    counterpartScoped: true,
    descriptionEn: 'The partners lie at roughly right angles to each other so their bodies form a T-like arrangement, creating a sideways or perpendicular angle for sexual activity.',
    descriptionEs: 'Las personas se colocan tumbadas aproximadamente en ángulo recto, formando una disposición parecida a una T y creando un ángulo lateral o perpendicular para la actividad sexual.',
  },
  {
    id: 'wheelbarrow-position',
    en: 'Wheelbarrow position',
    es: 'Postura de la carretilla',
    kind: 'mutual',
    counterpartScoped: true,
    descriptionEn: 'One partner supports their upper body on hands or forearms while the other supports or holds their legs or hips from behind, creating an elevated rear-entry arrangement.',
    descriptionEs: 'Una persona apoya la parte superior del cuerpo sobre manos o antebrazos mientras la otra sostiene o sujeta sus piernas o cadera desde atrás, creando una posición elevada desde atrás.',
  },
  {
    id: 'standing-carry',
    en: 'Standing carry position',
    es: 'De pie en brazos',
    kind: 'mutual',
    counterpartScoped: true,
    descriptionEn: 'One partner remains standing while supporting or lifting the other partner, who wraps their body or legs around them for close upright sexual contact.',
    descriptionEs: 'Una persona permanece de pie mientras sostiene o eleva a la otra, que rodea su cuerpo con las piernas o se abraza a ella para mantener contacto sexual erguido.',
  },
  {
    id: 'bridge-position',
    en: 'Bridge position',
    es: 'Postura del puente',
    kind: 'mutual',
    counterpartScoped: true,
    descriptionEn: 'One partner raises and arches the hips or torso into a bridge-like shape while the other positions around or in front of them, making body support and angle part of the position.',
    descriptionEs: 'Una persona eleva y arquea la cadera o el torso formando una postura similar a un puente mientras la otra se coloca alrededor o delante, haciendo del apoyo corporal y el ángulo parte de la posición.',
  },
] as const;

export function addExpandedSexualPositions(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  return content.map((category) => {
    if (category.id !== 'sexual-positions') return category;
    const additionIds = new Set(EXPANDED_SEXUAL_POSITIONS.map((practice) => practice.id));
    const withoutDuplicates = category.practices.filter((practice) => !additionIds.has(practice.id));
    return { ...category, practices: [...withoutDuplicates, ...EXPANDED_SEXUAL_POSITIONS] };
  });
}
