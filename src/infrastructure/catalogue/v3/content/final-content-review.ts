import { CatalogueCategorySeed, CataloguePracticeSeed } from './types';

const FINAL_PRACTICE_OVERRIDES: Readonly<Record<string, Partial<CataloguePracticeSeed>>> = {
  vibrator: {
    targetSites: ['external-genitals', 'mouth', 'vaginal', 'anal'],
    descriptionEn: 'A general-purpose vibrating toy used for external-genital stimulation or, when its shape allows it, oral, vaginal or anal use.',
    descriptionEs: 'Juguete vibratorio de uso general para estimular los genitales externos o, si su forma lo permite, para uso oral, vaginal o anal.',
  },
  'clitoral-suction-toy': {
    targetSites: ['external-genitals', 'nipples'],
    descriptionEn: 'A pulsating-air or suction-like toy designed for the clitoral area that can also be used for focused stimulation of the nipples.',
    descriptionEs: 'Juguete de pulsos de aire o succión pensado para la zona del clítoris que también puede usarse para estimulación localizada de los pezones.',
  },
  'strapless-strap-on': {
    targetSites: ['mouth', 'vaginal', 'anal'],
    descriptionEn: 'A harness-free penetrative toy retained by the wearer while another end can be used orally, vaginally or anally on a partner.',
    descriptionEs: 'Juguete de penetración sin arnés que quien lo lleva mantiene sujeto mientras el otro extremo puede usarse por vía oral, vaginal o anal con la pareja.',
  },
  'sex-machine': {
    targetSites: ['mouth', 'vaginal', 'anal'],
    descriptionEn: 'A powered machine that drives an attached penetrative toy in repeated motion for oral, vaginal or anal use when the setup permits it.',
    descriptionEs: 'Máquina motorizada que mueve repetidamente un juguete de penetración acoplado para uso oral, vaginal o anal cuando el montaje lo permite.',
  },
  'vacuum-cup-toys': {
    targetSites: ['mouth', 'vaginal', 'anal'],
    descriptionEn: 'Penetrative toys with a suction base that fixes them to a smooth surface for hands-free oral, vaginal or anal use.',
    descriptionEs: 'Juguetes de penetración con base de ventosa que se fijan a una superficie lisa para uso oral, vaginal o anal sin sujetarlos con las manos.',
  },
};

const PARTNER_PHYSICAL_TRAITS: readonly CataloguePracticeSeed[] = [
  {
    id: 'hair-length-short',
    en: 'Short hair',
    es: 'Pelo corto',
    kind: 'focus',
    descriptionEn: 'Attraction to partners with comparatively short hair; the catalogue does not impose an exact length threshold.',
    descriptionEs: 'Atracción por parejas con el pelo comparativamente corto; el catálogo no fija una longitud exacta.',
  },
  {
    id: 'hair-length-medium',
    en: 'Medium-length hair',
    es: 'Pelo de longitud media',
    kind: 'focus',
    descriptionEn: 'Attraction to partners whose hair length feels intermediate rather than clearly short or long.',
    descriptionEs: 'Atracción por parejas cuyo pelo se percibe de longitud intermedia, sin ser claramente corto ni largo.',
  },
  {
    id: 'hair-length-long',
    en: 'Long hair',
    es: 'Pelo largo',
    kind: 'focus',
    descriptionEn: 'Attraction to partners with comparatively long hair; the catalogue does not impose an exact length threshold.',
    descriptionEs: 'Atracción por parejas con el pelo comparativamente largo; el catálogo no fija una longitud exacta.',
  },
  {
    id: 'shaved-bald-head',
    en: 'Shaved or bald head',
    es: 'Cabeza rapada o calva',
    kind: 'focus',
    descriptionEn: 'Attraction to a shaved head, a very closely cropped scalp or natural baldness as a visible physical trait.',
    descriptionEs: 'Atracción por la cabeza rapada, el pelo prácticamente al ras o la calvicie natural como rasgo físico visible.',
  },
  {
    id: 'facial-hair',
    en: 'Facial hair',
    es: 'Vello facial',
    kind: 'focus',
    descriptionEn: 'Attraction to visible facial hair such as stubble, a beard or a moustache.',
    descriptionEs: 'Atracción por el vello facial visible, como barba de pocos días, barba o bigote.',
  },
  {
    id: 'breast-size-small',
    en: 'Small breasts',
    es: 'Pecho pequeño',
    kind: 'focus',
    anatomySex: 'female',
    descriptionEn: 'Attraction to comparatively smaller breasts; this is a subjective preference rather than a fixed cup-size range.',
    descriptionEs: 'Atracción por un pecho comparativamente pequeño; es una preferencia subjetiva y no un rango fijo de tallas de copa.',
  },
  {
    id: 'breast-size-average',
    en: 'Medium-size breasts',
    es: 'Pecho de tamaño medio',
    kind: 'focus',
    anatomySex: 'female',
    descriptionEn: 'Attraction to breasts perceived as medium in size rather than notably small or large.',
    descriptionEs: 'Atracción por un pecho percibido como de tamaño medio, sin ser especialmente pequeño ni grande.',
  },
  {
    id: 'breast-size-large',
    en: 'Large breasts',
    es: 'Pecho grande',
    kind: 'focus',
    anatomySex: 'female',
    descriptionEn: 'Attraction to comparatively larger breasts; this is a subjective preference rather than a fixed cup-size range.',
    descriptionEs: 'Atracción por un pecho comparativamente grande; es una preferencia subjetiva y no un rango fijo de tallas de copa.',
  },
  {
    id: 'stature-short',
    en: 'Short stature',
    es: 'Estatura baja',
    kind: 'focus',
    descriptionEn: 'Attraction to partners perceived as comparatively short, without setting a fixed height cutoff.',
    descriptionEs: 'Atracción por parejas percibidas como comparativamente bajas, sin fijar una altura concreta como límite.',
  },
  {
    id: 'stature-average',
    en: 'Average stature',
    es: 'Estatura media',
    kind: 'focus',
    descriptionEn: 'Attraction to partners perceived as around an average or intermediate height.',
    descriptionEs: 'Atracción por parejas percibidas como de una estatura media o intermedia.',
  },
  {
    id: 'stature-tall',
    en: 'Tall stature',
    es: 'Estatura alta',
    kind: 'focus',
    descriptionEn: 'Attraction to partners perceived as comparatively tall, without setting a fixed height cutoff.',
    descriptionEs: 'Atracción por parejas percibidas como comparativamente altas, sin fijar una altura concreta como límite.',
  },
  {
    id: 'slim-build',
    en: 'Slim build',
    es: 'Complexión delgada',
    kind: 'focus',
    descriptionEn: 'Attraction to a generally slim or slender body build, independently of exact weight or height.',
    descriptionEs: 'Atracción por una complexión corporal generalmente delgada o esbelta, independientemente del peso o la altura exactos.',
  },
  {
    id: 'curvy-build',
    en: 'Curvy build',
    es: 'Complexión con curvas',
    kind: 'focus',
    descriptionEn: 'Attraction to a body build with visibly pronounced curves or rounded proportions.',
    descriptionEs: 'Atracción por una complexión corporal con curvas o proporciones redondeadas marcadas.',
  },
  {
    id: 'stocky-build',
    en: 'Stocky build',
    es: 'Complexión robusta',
    kind: 'focus',
    descriptionEn: 'Attraction to a broad, solid or stocky body build, independently of exact weight or height.',
    descriptionEs: 'Atracción por una complexión corporal ancha, sólida o robusta, independientemente del peso o la altura exactos.',
  },
  {
    id: 'buttocks-size-small',
    en: 'Small buttocks',
    es: 'Glúteos pequeños',
    kind: 'focus',
    descriptionEn: 'Attraction to comparatively smaller buttocks; this is a subjective preference rather than a fixed measurement.',
    descriptionEs: 'Atracción por glúteos comparativamente pequeños; es una preferencia subjetiva y no una medida fija.',
  },
  {
    id: 'buttocks-size-average',
    en: 'Medium-size buttocks',
    es: 'Glúteos de tamaño medio',
    kind: 'focus',
    descriptionEn: 'Attraction to buttocks perceived as medium in size rather than notably small or large.',
    descriptionEs: 'Atracción por glúteos percibidos como de tamaño medio, sin ser especialmente pequeños ni grandes.',
  },
  {
    id: 'buttocks-size-large',
    en: 'Large buttocks',
    es: 'Glúteos grandes',
    kind: 'focus',
    descriptionEn: 'Attraction to comparatively larger buttocks; this is a subjective preference rather than a fixed measurement.',
    descriptionEs: 'Atracción por glúteos comparativamente grandes; es una preferencia subjetiva y no una medida fija.',
  },
  {
    id: 'penis-size-small',
    en: 'Small penis',
    es: 'Pene pequeño',
    kind: 'focus',
    anatomySex: 'male',
    descriptionEn: 'Attraction to comparatively smaller penises; this is a subjective preference rather than a fixed measurement range.',
    descriptionEs: 'Atracción por penes comparativamente pequeños; es una preferencia subjetiva y no un rango fijo de medidas.',
  },
  {
    id: 'penis-size-average',
    en: 'Medium-size penis',
    es: 'Pene de tamaño medio',
    kind: 'focus',
    anatomySex: 'male',
    descriptionEn: 'Attraction to penises perceived as medium in size rather than notably small or large.',
    descriptionEs: 'Atracción por penes percibidos como de tamaño medio, sin ser especialmente pequeños ni grandes.',
  },
  {
    id: 'penis-size-large',
    en: 'Large penis',
    es: 'Pene grande',
    kind: 'focus',
    anatomySex: 'male',
    descriptionEn: 'Attraction to comparatively larger penises; this is a subjective preference rather than a fixed measurement range.',
    descriptionEs: 'Atracción por penes comparativamente grandes; es una preferencia subjetiva y no un rango fijo de medidas.',
  },
];

export function applyFinalContentReview(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  return content.map((category) => {
    const practices = category.practices.map((practice) => ({
      ...practice,
      ...(FINAL_PRACTICE_OVERRIDES[practice.id] ?? {}),
    }));

    if (category.id !== 'body-fetishes') return { ...category, practices };
    return { ...category, practices: [...practices, ...PARTNER_PHYSICAL_TRAITS] };
  });
}
