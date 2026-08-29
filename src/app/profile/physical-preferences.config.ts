import { Sex, SexualOrientation } from '../../domain/profile/profile-metadata';

export interface PhysicalPreferenceOptionDefinition {
  readonly id: string;
  readonly en: string;
  readonly es: string;
}

export interface PhysicalPreferenceGroupDefinition {
  readonly id: string;
  readonly en: string;
  readonly es: string;
  readonly descriptionEn: string;
  readonly descriptionEs: string;
  readonly partnerSex?: Sex;
  readonly options: readonly PhysicalPreferenceOptionDefinition[];
}

const option = (id: string, en: string, es: string): PhysicalPreferenceOptionDefinition => ({ id, en, es });

export const PHYSICAL_PREFERENCE_GROUPS: readonly PhysicalPreferenceGroupDefinition[] = [
  {
    id: 'hair-length',
    en: 'Hair length',
    es: 'Longitud del pelo',
    descriptionEn: 'How attractive each hair length or a shaved/bald look is to you.',
    descriptionEs: 'Cuánto te atrae cada longitud de pelo o el aspecto rapado/calvo.',
    options: [
      option('shaved-bald-head', 'Shaved / bald', 'Rapado / calvo'),
      option('hair-length-short', 'Short', 'Corto'),
      option('hair-length-medium', 'Medium', 'Medio'),
      option('hair-length-long', 'Long', 'Largo'),
    ],
  },
  {
    id: 'hair-color',
    en: 'Hair color',
    es: 'Color del pelo',
    descriptionEn: 'Independent attraction to common hair colors and more unconventional coloring.',
    descriptionEs: 'Atracción independiente por colores de pelo habituales y coloraciones menos convencionales.',
    options: [
      option('hair-color-black', 'Black', 'Negro'),
      option('hair-color-brown', 'Brown', 'Castaño'),
      option('hair-color-blonde', 'Blonde', 'Rubio'),
      option('hair-color-red', 'Red', 'Pelirrojo'),
      option('hair-color-unconventional', 'Unconventional colors', 'Colores no convencionales'),
    ],
  },
  {
    id: 'facial-hair',
    en: 'Facial hair',
    es: 'Vello facial',
    descriptionEn: 'How attractive different amounts of facial hair are on a male partner.',
    descriptionEs: 'Cuánto te atraen distintas cantidades de vello facial en una pareja masculina.',
    partnerSex: 'male',
    options: [
      option('facial-hair-none', 'Clean-shaven', 'Afeitado'),
      option('facial-hair-stubble', 'Stubble', 'Barba de pocos días'),
      option('facial-hair-short', 'Short beard', 'Barba corta'),
      option('facial-hair-long', 'Long beard', 'Barba larga'),
    ],
  },
  {
    id: 'stature',
    en: 'Height',
    es: 'Estatura',
    descriptionEn: 'How attractive different perceived heights are to you.',
    descriptionEs: 'Cuánto te atraen distintas estaturas percibidas.',
    options: [
      option('stature-short', 'Short', 'Baja'),
      option('stature-average', 'Average', 'Media'),
      option('stature-tall', 'Tall', 'Alta'),
    ],
  },
  {
    id: 'build',
    en: 'Body build',
    es: 'Complexión',
    descriptionEn: 'Each build is scored independently; liking one does not imply disliking another.',
    descriptionEs: 'Cada complexión se valora por separado; que te guste una no implica que te desagrade otra.',
    options: [
      option('slim-build', 'Slim', 'Delgada'),
      option('athletic-build', 'Athletic', 'Atlética'),
      option('muscles', 'Muscular', 'Musculada'),
      option('curvy-build', 'Curvy', 'Curvilínea'),
      option('stocky-build', 'Stocky / broad', 'Robusta / ancha'),
    ],
  },
  {
    id: 'breast-size',
    en: 'Breast size',
    es: 'Tamaño de pecho',
    descriptionEn: 'How attractive different breast sizes are on a female partner.',
    descriptionEs: 'Cuánto te atraen distintos tamaños de pecho en una pareja femenina.',
    partnerSex: 'female',
    options: [
      option('breast-size-small', 'Small', 'Pequeño'),
      option('breast-size-average', 'Medium', 'Medio'),
      option('breast-size-large', 'Large', 'Grande'),
    ],
  },
  {
    id: 'buttocks-size',
    en: 'Buttocks size',
    es: 'Tamaño de glúteos',
    descriptionEn: 'How attractive different buttock sizes are to you.',
    descriptionEs: 'Cuánto te atraen distintos tamaños de glúteos.',
    options: [
      option('buttocks-size-small', 'Small', 'Pequeños'),
      option('buttocks-size-average', 'Medium', 'Medios'),
      option('buttocks-size-large', 'Large', 'Grandes'),
    ],
  },
  {
    id: 'penis-size',
    en: 'Penis size',
    es: 'Tamaño de pene',
    descriptionEn: 'How attractive different penis sizes are on a male partner.',
    descriptionEs: 'Cuánto te atraen distintos tamaños de pene en una pareja masculina.',
    partnerSex: 'male',
    options: [
      option('penis-size-small', 'Small', 'Pequeño'),
      option('penis-size-average', 'Medium', 'Medio'),
      option('penis-size-large', 'Large', 'Grande'),
    ],
  },
  {
    id: 'body-hair-amount',
    en: 'Body hair',
    es: 'Vello corporal',
    descriptionEn: 'How attractive different amounts of body hair are to you.',
    descriptionEs: 'Cuánto te atraen distintas cantidades de vello corporal.',
    options: [
      option('body-hair-low', 'Little / none', 'Poco / ninguno'),
      option('body-hair-medium', 'Moderate', 'Moderado'),
      option('body-hair-high', 'Hairy', 'Abundante'),
    ],
  },
  {
    id: 'tattoo-coverage',
    en: 'Tattoos',
    es: 'Tatuajes',
    descriptionEn: 'How attractive different levels of tattoo coverage are to you.',
    descriptionEs: 'Cuánto te atraen distintos niveles de tatuajes.',
    options: [
      option('tattoos-none', 'No tattoos', 'Sin tatuajes'),
      option('tattoos-some', 'Some tattoos', 'Algunos tatuajes'),
      option('tattoos-heavy', 'Heavily tattooed', 'Muy tatuada/o'),
    ],
  },
  {
    id: 'piercing-style',
    en: 'Piercings',
    es: 'Piercings',
    descriptionEn: 'How attractive no piercings or piercings in different locations are to you.',
    descriptionEs: 'Cuánto te atrae la ausencia de piercings o llevarlos en distintas zonas.',
    options: [
      option('piercings-none', 'No piercings', 'Sin piercings'),
      option('facial-piercings', 'Face', 'Cara'),
      option('body-piercings', 'Body', 'Cuerpo'),
      option('nipple-piercings', 'Nipples', 'Pezones'),
      option('genital-piercings', 'Genitals', 'Genitales'),
    ],
  },
] as const;

export function relevantPartnerSexes(
  sex: Sex | '' | undefined,
  orientation: SexualOrientation | '' | undefined,
): readonly Sex[] {
  if (!sex || !orientation || orientation === 'bisexual') return ['male', 'female'];
  if (orientation === 'heterosexual') return [sex === 'male' ? 'female' : 'male'];
  return [sex];
}

export function physicalPreferenceGroupsFor(
  sex: Sex | '' | undefined,
  orientation: SexualOrientation | '' | undefined,
): readonly PhysicalPreferenceGroupDefinition[] {
  const relevantSexes = new Set(relevantPartnerSexes(sex, orientation));
  return PHYSICAL_PREFERENCE_GROUPS.filter((group) => !group.partnerSex || relevantSexes.has(group.partnerSex));
}
