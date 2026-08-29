import {
  CatalogueInsightStrength,
  CatalogueInsightTagDefinition,
  CatalogueInsightTagId,
  PracticeInsightSignals,
} from '../../../domain/catalogue/catalogue-insight';
import { CATALOGUE_V3_CONTENT } from './content/final';

export const MANUAL_REVIEW_INSIGHT_TAGS: readonly CatalogueInsightTagDefinition[] = [
  {
    id: 'anatomy-focus', en: 'Anatomy & physical-trait focus', es: 'Foco en anatomía y rasgos físicos',
    descriptionEn: 'Preferences where a body area, anatomy or stable physical trait is itself a meaningful focus of attraction.',
    descriptionEs: 'Preferencias donde una zona corporal, anatomía o rasgo físico estable constituye por sí mismo un foco significativo de atracción.',
  },
  {
    id: 'orgasm-focus', en: 'Orgasm focus', es: 'Foco en el orgasmo',
    descriptionEn: 'Experiences where orgasm, its timing, intensity, interruption or absence is a central part of the preference.',
    descriptionEs: 'Experiencias donde el orgasmo, su momento, intensidad, interrupción o ausencia es una parte central de la preferencia.',
  },
  {
    id: 'recording-media', en: 'Erotic media & recording', es: 'Medios eróticos y grabación',
    descriptionEn: 'Experiences where creating, recording, viewing or transmitting erotic images or video is a meaningful part of the appeal.',
    descriptionEs: 'Experiencias donde crear, grabar, ver o transmitir imágenes o vídeo erótico forma una parte significativa del atractivo.',
  },
  {
    id: 'voyeuristic-focus', en: 'Voyeuristic focus', es: 'Foco voyeur',
    descriptionEn: 'Consensual interests where watching another person or observing intimate visual behaviour is central.',
    descriptionEs: 'Intereses consensuados donde observar a otra persona o contemplar comportamiento íntimo visual es central.',
  },
  {
    id: 'exhibitionistic-focus', en: 'Exhibitionistic focus', es: 'Foco exhibicionista',
    descriptionEn: 'Consensual interests where being seen, posing, performing or deliberately increasing one’s visibility is central.',
    descriptionEs: 'Intereses consensuados donde ser visto, posar, actuar o aumentar deliberadamente la propia visibilidad es central.',
  },
  {
    id: 'non-monogamy', en: 'Consensual non-monogamy', es: 'No monogamia consensuada',
    descriptionEn: 'Multi-partner or relationship dynamics whose meaning includes consensual sexual or romantic involvement beyond one exclusive pair.',
    descriptionEs: 'Dinámicas de varias personas o de relación cuyo significado incluye implicación sexual o romántica consensuada más allá de una pareja exclusiva.',
  },
  {
    id: 'fluid-focus', en: 'Bodily-fluid focus', es: 'Foco en fluidos corporales',
    descriptionEn: 'Preferences where saliva, semen, urine, blood, sweat or another bodily material is itself a meaningful part of the appeal.',
    descriptionEs: 'Preferencias donde saliva, semen, orina, sangre, sudor u otro material corporal constituye por sí mismo una parte significativa del atractivo.',
  },
  {
    id: 'ownership-symbolism', en: 'Ownership & belonging symbolism', es: 'Simbología de pertenencia',
    descriptionEn: 'Consensual power dynamics where belonging, ownership-like language or a persistent symbolic marker is especially meaningful.',
    descriptionEs: 'Dinámicas consensuadas de poder donde la pertenencia, el lenguaje de propiedad o un símbolo persistente resultan especialmente significativos.',
  },
  {
    id: 'edge-risk', en: 'Edge / higher-risk theme', es: 'Tema edge / de mayor riesgo',
    descriptionEn: 'Higher-risk or deliberately extreme themes whose identity matters beyond general intensity and should remain distinguishable in future insights.',
    descriptionEs: 'Temas de mayor riesgo o deliberadamente extremos cuya identidad importa más allá de la intensidad general y debe poder distinguirse en análisis futuros.',
  },
] as const;

const CATEGORY_BY_PRACTICE = new Map(
  CATALOGUE_V3_CONTENT.flatMap((category) => category.practices.map((practice) => [practice.id, category.id] as const)),
);

const NON_ANATOMY_BODY_IDS = new Set([
  'underwear', 'worn-underwear', 'tattoos', 'piercings', 'facial-piercings', 'body-piercings',
  'nipple-piercings', 'genital-piercings', 'body-scent', 'sweat',
]);
const MEDIA_IDS = new Set([
  'private-recording', 'taking-erotic-photos', 'video-call-sex', 'webcam-performance-private',
]);
const VOYEURISTIC_IDS = new Set(['voyeurism', 'mirrors']);
const EXHIBITIONISTIC_IDS = new Set(['lights-on', 'risk-of-being-seen']);
const NON_MONOGAMY_IDS = new Set([
  'couple-plus-guest', 'threesome-mmf', 'threesome-mff', 'threesome-mmm', 'threesome-fff', 'foursome',
  'group-sex', 'gangbang', 'swinging', 'soft-swap', 'full-swap', 'same-room-sex',
  'watching-partner-with-other', 'hotwife-dynamic', 'cuckold-dynamic', 'cuckquean-dynamic',
]);
const NON_FLUID_SUBSTANCE_IDS = new Set(['food-body-play', 'oil-body-play', 'mud-body-play']);
const OWNERSHIP_IDS = new Set(['ownership', 'collaring', 'leash-control']);
const HIGHEST_EDGE_RISK_IDS = new Set([
  'breath-play', 'choking-fantasy', 'smothering', 'water-bondage-fantasy', 'cutting-play', 'fire-play',
  'suspension-bondage', 'inversion-bondage', 'vacuum-bed', 'vacuum-cube',
]);

/** Add semantic discriminators to the already complete base signal map without changing practice identity. */
export function applyManualInsightReview(
  insights: readonly PracticeInsightSignals[],
): readonly PracticeInsightSignals[] {
  return insights.map((entry) => {
    const categoryId = CATEGORY_BY_PRACTICE.get(entry.practiceId);
    const signals: Partial<Record<CatalogueInsightTagId, CatalogueInsightStrength>> = { ...entry.signals };

    if (categoryId === 'body-fetishes' && !NON_ANATOMY_BODY_IDS.has(entry.practiceId)) {
      signals['anatomy-focus'] = signals['anatomy-focus'] ?? 0.5;
    }
    if (categoryId === 'orgasm-control') signals['orgasm-focus'] = 0.75;
    if (categoryId === 'fluids' && !NON_FLUID_SUBSTANCE_IDS.has(entry.practiceId)) signals['fluid-focus'] = 0.75;
    if (categoryId === 'edge') signals['edge-risk'] = HIGHEST_EDGE_RISK_IDS.has(entry.practiceId) ? 1 : 0.75;
    if (MEDIA_IDS.has(entry.practiceId)) signals['recording-media'] = 1;
    if (VOYEURISTIC_IDS.has(entry.practiceId)) signals['voyeuristic-focus'] = 0.75;
    if (EXHIBITIONISTIC_IDS.has(entry.practiceId)) signals['exhibitionistic-focus'] = 0.75;
    if (NON_MONOGAMY_IDS.has(entry.practiceId)) signals['non-monogamy'] = 0.75;
    if (OWNERSHIP_IDS.has(entry.practiceId)) signals['ownership-symbolism'] = 1;

    return { ...entry, signals };
  });
}

export const MANUAL_REVIEW_NEW_PRACTICE_INSIGHTS: readonly PracticeInsightSignals[] = [
  { practiceId: 'vagina', signals: { 'anatomy-focus': 1, sensuality: 0.75 } },
  { practiceId: 'erotic-selfies', signals: { 'recording-media': 1, 'exhibitionistic-focus': 0.5, visibility: 0.5, 'aesthetic-presentation': 0.75 } },
  { practiceId: 'partner-erotic-photography', signals: { 'recording-media': 1, visibility: 0.75, 'aesthetic-presentation': 0.75, reciprocity: 0.25 } },
  { practiceId: 'erotic-photo-session-together', signals: { 'recording-media': 1, visibility: 0.75, 'aesthetic-presentation': 0.75, reciprocity: 0.75, playfulness: 0.25 } },
  { practiceId: 'watch-private-recording-together', signals: { 'recording-media': 1, connection: 0.25, reciprocity: 0.5, sensuality: 0.5 } },
  { practiceId: 'watching-undressing', signals: { 'voyeuristic-focus': 0.75, 'exhibitionistic-focus': 0.75, visibility: 0.75, sensuality: 0.5, reciprocity: 0.25 } },
  { practiceId: 'body-care-service', signals: { 'service-orientation': 1, 'power-exchange': 0.5, tenderness: 0.25, structure: 0.25 } },
  { practiceId: 'hospitality-service', signals: { 'service-orientation': 1, 'power-exchange': 0.5, structure: 0.5 } },
  { practiceId: 'ritual-attendance-service', signals: { 'service-orientation': 1, 'power-exchange': 0.75, structure: 0.75 } },
  { practiceId: 'ownership-token', signals: { 'ownership-symbolism': 1, 'power-exchange': 0.75, structure: 0.5, 'aesthetic-presentation': 0.25 } },
  { practiceId: 'temporary-ownership-marking', signals: { 'ownership-symbolism': 1, 'power-exchange': 0.75, visibility: 0.5, 'aesthetic-presentation': 0.5 } },
  { practiceId: 'assigned-submissive-name', signals: { 'ownership-symbolism': 1, 'power-exchange': 0.75, 'role-immersion': 0.75, structure: 0.5 } },
  { practiceId: 'semen-on-other-body', signals: { 'fluid-focus': 1, exploration: 0.5, sensuality: 0.25, visibility: 0.25 } },
  { practiceId: 'own-urine-play', signals: { 'fluid-focus': 1, exploration: 1, transgression: 0.75, intensity: 0.5 } },
  { practiceId: 'own-blood-play', signals: { 'fluid-focus': 1, exploration: 0.75, transgression: 0.75, intensity: 0.75 } },
  { practiceId: 'own-scat-play', signals: { 'fluid-focus': 1, exploration: 1, transgression: 1, intensity: 0.75 } },
  { practiceId: 'ordeal-scene', signals: { 'edge-risk': 0.75, intensity: 1, 'power-exchange': 0.75, structure: 0.5, exploration: 0.5 } },
  { practiceId: 'extreme-helplessness-fantasy', signals: { 'edge-risk': 0.75, intensity: 1, 'power-exchange': 1, 'fantasy-imagination': 0.5, 'role-immersion': 0.5 } },
] as const;
