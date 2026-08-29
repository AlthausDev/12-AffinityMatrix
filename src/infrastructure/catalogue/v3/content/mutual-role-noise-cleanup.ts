import { CatalogueCategorySeed, CatalogueRoleLabelSeed } from './types';

const LABELS: Readonly<Record<string, CatalogueRoleLabelSeed>> = {
  'affection-intimacy': { en: 'Share this with my partner', es: 'Compartirlo con mi pareja' },
  'sexual-style': { en: 'Prefer this style', es: 'Preferir este estilo' },
  'manual-masturbation': { en: 'Do this together', es: 'Hacerlo juntos' },
  oral: { en: 'Do this together', es: 'Hacerlo juntos' },
  penetration: { en: 'Do this together', es: 'Hacerlo juntos' },
  'sexual-positions': { en: 'Use this position', es: 'Usar esta postura' },
  groups: { en: 'Be part of this scene', es: 'Formar parte de esta escena' },
  roleplay: { en: 'Explore this roleplay', es: 'Explorar este roleplay' },
  exhibitionism: { en: 'Include this in the experience', es: 'Incluirlo en la experiencia' },
  'places-settings': { en: 'Have sex in this setting', es: 'Tener sexo en este entorno' },
  power: { en: 'Include this in the dynamic', es: 'Incluirlo en la dinámica' },
  psychological: { en: 'Include this in the dynamic', es: 'Incluirlo en la dinámica' },
  sensation: { en: 'Include this sensation', es: 'Incluir esta sensación' },
  fluids: { en: 'Include this in sexual play', es: 'Incluirlo en el juego sexual' },
  'taboo-fantasies': { en: 'Explore this fantasy', es: 'Explorar esta fantasía' },
  surrealism: { en: 'Explore this fantasy', es: 'Explorar esta fantasía' },
};

/** Replaces builder-level "Participate" only where a mutual practice has no bespoke wording. */
export function applyMutualRoleNoiseCleanup(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  return content.map((category) => {
    const label = LABELS[category.id];
    if (!label) return category;
    return {
      ...category,
      practices: category.practices.map((practice) => {
        if (practice.kind !== 'mutual' || practice.roleLabels?.participate) return practice;
        return {
          ...practice,
          roleLabels: { ...(practice.roleLabels ?? {}), participate: label },
        };
      }),
    };
  });
}
