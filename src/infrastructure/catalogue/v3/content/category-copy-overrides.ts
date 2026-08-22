import { CatalogueCategorySeed } from './types';

const CATEGORY_COPY: Readonly<Record<string, Partial<CatalogueCategorySeed>>> = {
  oral: {
    descriptionEn: 'Oral stimulation and other mouth-focused sexual practices; body positions are grouped separately.',
    descriptionEs: 'Estimulación oral y otras prácticas sexuales centradas en la boca; las posturas corporales se agrupan aparte.',
  },
  penetration: {
    descriptionEn: 'Vaginal, anal and other penetrative practices, including depth, intensity and specialized forms; positions are grouped separately.',
    descriptionEs: 'Prácticas de penetración vaginal, anal y otras, incluyendo profundidad, intensidad y modalidades específicas; las posturas se agrupan aparte.',
  },
  toys: {
    descriptionEn: 'Sex toys and sexual equipment, grouped by family and limited to body sites that are meaningful for each item.',
    descriptionEs: 'Juguetes y equipamiento sexual, agrupados por familia y limitados a las zonas corporales que tienen sentido para cada elemento.',
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
