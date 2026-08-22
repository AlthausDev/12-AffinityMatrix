import { CatalogueCategorySeed } from './types';

const CATEGORY_COPY: Readonly<Record<string, Partial<CatalogueCategorySeed>>> = {
  'sexual-style': {
    descriptionEn: 'How the overall sexual encounter feels and unfolds rather than which act is performed. These traits can overlap: sex can be slow and passionate, romantic and playful, or intense without being rough.',
    descriptionEs: 'Cómo se siente y se desarrolla el encuentro sexual en conjunto, no qué práctica concreta se realiza. Estos estilos pueden combinarse: el sexo puede ser lento y apasionado, romántico y juguetón, o intenso sin ser brusco.',
  },
  'clothing-appearance': {
    descriptionEn: 'Clothing and visual presentation that can be attractive on you or on a partner. Similar-looking entries are separated by what creates the appeal: material, garment type, formal styling, recognizable uniform/role or degree of nudity.',
    descriptionEs: 'Ropa y presentación visual que puede atraerte en ti o en tu pareja. Las entradas parecidas se separan por aquello que genera el atractivo: material, tipo de prenda, estilo formal, uniforme/rol reconocible o grado de desnudez.',
  },
  'manual-masturbation': {
    descriptionEn: 'Solo masturbation and sexual stimulation using hands or fingers. Pay attention to who is touching whom and whether the stimulation is external, internal, mutual or performed on oneself; control/restraint gestures are grouped elsewhere.',
    descriptionEs: 'Masturbación en solitario y estimulación sexual con manos o dedos. Fíjate en quién toca a quién y en si la estimulación es externa, interna, mutua o sobre uno mismo; los gestos de control o restricción se agrupan aparte.',
  },
  oral: {
    descriptionEn: 'Oral stimulation and other mouth-focused sexual practices; body positions are grouped separately.',
    descriptionEs: 'Estimulación oral y otras prácticas sexuales centradas en la boca; las posturas corporales se agrupan aparte.',
  },
  penetration: {
    descriptionEn: 'What kind of penetration is appealing and how it is performed. Depth, pace and physical intensity are independent preferences, while body positions are grouped separately. This category also includes simultaneous penetration of more than one opening.',
    descriptionEs: 'Qué tipo de penetración resulta atractiva y cómo se realiza. Profundidad, ritmo e intensidad física son preferencias independientes, mientras que las posturas se agrupan aparte. También se incluyen combinaciones simultáneas de varias aberturas.',
  },
  toys: {
    descriptionEn: 'Sex toys and sexual equipment, grouped by family and limited to body sites that are meaningful for each item. Dildos are condensed into standard/realistic, special-material and fantasy-shaped families where the distinction is genuinely useful.',
    descriptionEs: 'Juguetes y equipamiento sexual, agrupados por familia y limitados a las zonas corporales que tienen sentido para cada elemento. Los dildos se condensan en familias estándar/realista, materiales especiales y formas de fantasía cuando la distinción aporta información real.',
  },
  'orgasm-control': {
    descriptionEn: 'Preferences about approaching, delaying, allowing, preventing and continuing beyond orgasm. Edging means repeatedly approaching orgasm and backing away; denial means not allowing it for a period or session; orgasm control is the broader partner-controlled dynamic.',
    descriptionEs: 'Preferencias sobre acercarse al orgasmo, retrasarlo, permitirlo, impedirlo y continuar después. Edging significa acercarse repetidamente y retirarse; negación significa no permitirlo durante un periodo o sesión; control del orgasmo es la dinámica más amplia en la que la pareja decide.',
  },
  'body-fetishes': {
    en: 'Body, physical traits & fetishes',
    es: 'Cuerpo, rasgos físicos y fetiches',
    descriptionEn: 'Preferences about a partner’s body parts, proportions, build, hair, scent, piercings and other physical traits. Size and height entries are intentionally subjective rather than fixed measurements, and more than one size can be attractive at the same time.',
    descriptionEs: 'Preferencias sobre partes del cuerpo, proporciones, complexión, pelo, olor, piercings y otros rasgos físicos de la pareja. Las entradas de tamaño y estatura son deliberadamente subjetivas, no medidas fijas, y pueden atraerte varios tamaños a la vez.',
  },
  groups: {
    descriptionEn: 'Sexual situations involving more than two people or an established couple interacting with others. Composition, being the central person, partner-swapping and couple-plus-guest dynamics are separated because they can feel very different in practice.',
    descriptionEs: 'Situaciones sexuales con más de dos personas o con una pareja estable interactuando con otras. Se separan composición, ser la persona central, intercambio de parejas y dinámica pareja + invitado/a porque pueden sentirse muy distintas en la práctica.',
  },
  roleplay: {
    descriptionEn: 'Roles, fictional scenarios and fantasies where the identity or premise changes the experience. This includes adult-only caregiver/little dynamics, taboo framing between adults and deliberately impossible or surreal fantasy; specific power dynamics may also appear in their own category.',
    descriptionEs: 'Roles, escenarios ficticios y fantasías donde la identidad o la premisa cambia la experiencia. Incluye dinámicas Caregiver/Little sólo entre adultos, componentes tabú entre adultos y fantasías deliberadamente imposibles o surrealistas; algunas dinámicas de poder también tienen su propia categoría.',
  },
  exhibitionism: {
    descriptionEn: 'Preferences about seeing, being seen, recording or feeling exposed during sexual activity. A controlled risk of being seen is separate from actual voyeurism, and uninvolved bystanders are not treated as participants.',
    descriptionEs: 'Preferencias sobre mirar, ser visto/a, grabar o sentir exposición durante la actividad sexual. El riesgo controlado de ser visto se separa del voyeurismo efectivo, y los terceros ajenos no se tratan como participantes.',
  },
  'places-settings': {
    descriptionEn: 'Places and environments where sexual activity happens. A controlled public or semi-public setting refers to the excitement of the location and possible exposure without deliberately involving uninvolved bystanders.',
    descriptionEs: 'Lugares y entornos donde ocurre la actividad sexual. Un espacio público o semipúblico controlado se refiere al atractivo del lugar y la posible exposición sin implicar deliberadamente a terceros ajenos.',
  },
  fluids: {
    descriptionEn: 'Saliva, semen, urine, blood, feces, sweat, food, oils and other substances used as part of sexual play.',
    descriptionEs: 'Saliva, semen, orina, sangre, heces, sudor, comida, aceites y otras sustancias utilizadas como parte del juego sexual.',
  },
};

export function applyFinalCategoryCopy(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  return content.map((category) => ({
    ...category,
    ...(CATEGORY_COPY[category.id] ?? {}),
  }));
}
