import { CatalogueCategorySeed, CataloguePracticeSeed, CatalogueRoleLabelsSeed } from './types';

const wording = (
  activeEn: string,
  activeEs: string,
  receptiveEn: string,
  receptiveEs: string,
): CatalogueRoleLabelsSeed => ({
  give: { en: activeEn, es: activeEs },
  receive: { en: receptiveEn, es: receptiveEs },
  lead: { en: activeEn, es: activeEs },
  follow: { en: receptiveEn, es: receptiveEs },
  watch: { en: activeEn, es: activeEs },
  'be-watched': { en: receptiveEn, es: receptiveEs },
});

const ROLE_WORDING: Readonly<Record<string, CatalogueRoleLabelsSeed>> = {
  service: wording('Serve my partner as part of the power dynamic', 'Servir a mi pareja como parte de la dinámica de poder', 'Be served by my partner', 'Ser atendido/a o servido/a por mi pareja'),
  'sexual-service': wording('Provide sexual service to my partner', 'Prestar servicio sexual a mi pareja', 'Receive sexual service from my partner', 'Recibir servicio sexual de mi pareja'),
  'domestic-service': wording('Provide domestic service within the dynamic', 'Prestar servicio doméstico dentro de la dinámica', 'Receive domestic service within the dynamic', 'Recibir servicio doméstico dentro de la dinámica'),
  ownership: wording('Take the owner / dominant role', 'Llevar el rol de propietario/a o dominante', 'Take the owned / submissive role', 'Llevar el rol de pertenencia o sumisión'),
  collaring: wording('Place or define the collar as the dominant / owner role', 'Entregar o definir el collar desde el rol dominante / propietario', 'Receive or wear the collar as the submissive / owned role', 'Recibir o llevar el collar desde el rol sumiso / de pertenencia'),
  'leash-control': wording('Guide / control my partner with a leash', 'Guiar / controlar a mi pareja con una correa', 'Be guided / controlled with a leash', 'Ser guiado/a / controlado/a con una correa'),

  voyeurism: wording('Watch my partner erotically with their knowledge', 'Observar eróticamente a mi pareja con su conocimiento', 'Be watched erotically by my partner', 'Ser observado/a eróticamente por mi pareja'),
  'taking-erotic-photos': wording('Take erotic photos of my partner', 'Hacer fotos eróticas a mi pareja', 'Have my partner take erotic photos of me', 'Que mi pareja me haga fotos eróticas'),
  'webcam-performance-private': wording('Perform privately on webcam for my partner', 'Actuar en webcam de forma privada para mi pareja', 'Watch my partner’s private webcam performance', 'Ver la actuación privada de mi pareja por webcam'),

  'hand-over-mouth': wording('Cover my partner’s mouth within the restraint scene', 'Tapar la boca de mi pareja dentro de la escena de restricción', 'Have my mouth covered within the scene', 'Que mi pareja me tape la boca dentro de la escena'),

  'scarification-fantasy': wording('Take the marking role in the scarification fantasy', 'Llevar el rol de marcado activo en la fantasía de escarificación', 'Take the marked role in the scarification fantasy', 'Llevar el rol de persona marcada en la fantasía de escarificación'),
  'branding-fantasy': wording('Take the marking / owner role in the branding fantasy', 'Llevar el rol de marcado / pertenencia activo en la fantasía de branding', 'Take the marked / owned role in the branding fantasy', 'Llevar el rol de persona marcada / de pertenencia en la fantasía de branding'),
  'suspension-bondage': wording('Suspend my partner within an advanced bondage scene', 'Suspender a mi pareja dentro de una escena avanzada de bondage', 'Be suspended within an advanced bondage scene', 'Ser suspendido/a dentro de una escena avanzada de bondage'),
  'inversion-bondage': wording('Restrain my partner in an inverted-position scene', 'Inmovilizar a mi pareja en una escena de posición invertida', 'Be restrained in an inverted-position scene', 'Ser inmovilizado/a en una escena de posición invertida'),
  'predicament-bondage': wording('Set the predicament restraint for my partner', 'Plantear la restricción de predicament para mi pareja', 'Take the restrained role in predicament bondage', 'Llevar el rol restringido en predicament bondage'),
  'long-duration-restraint': wording('Keep my partner restrained for the extended scene', 'Mantener a mi pareja inmovilizada durante la escena prolongada', 'Be restrained for the extended scene', 'Permanecer inmovilizado/a durante la escena prolongada'),
  'vacuum-bed': wording('Take the controlling role in a vacuum-bed scene', 'Llevar el rol de control en una escena con cama de vacío', 'Take the enclosed role in a vacuum-bed scene', 'Llevar el rol encerrado/inmovilizado en una escena con cama de vacío'),
  'vacuum-cube': wording('Take the controlling role in a vacuum-cube scene', 'Llevar el rol de control en una escena con cubo de vacío', 'Take the enclosed role in a vacuum-cube scene', 'Llevar el rol encerrado/inmovilizado en una escena con cubo de vacío'),
};

const ROLE_LABEL_ONLY: Readonly<Record<string, CatalogueRoleLabelsSeed>> = {
  'private-recording': {
    participate: { en: 'Make a private sexual recording together', es: 'Hacer juntos una grabación sexual privada' },
  },
  'video-call-sex': {
    participate: { en: 'Have sexual interaction together by video call', es: 'Tener interacción sexual juntos por videollamada' },
  },
};

export function applyManualRoleFollowup(content: readonly CatalogueCategorySeed[]): readonly CatalogueCategorySeed[] {
  return content.map((category) => ({
    ...category,
    practices: category.practices.map((practice) => applyRoleWording(practice)),
  }));
}

function applyRoleWording(practice: CataloguePracticeSeed): CataloguePracticeSeed {
  const defaults = humanDefaults(practice);
  const extra = ROLE_WORDING[practice.id] ?? ROLE_LABEL_ONLY[practice.id];
  if (!defaults && !extra) return practice;

  return {
    ...practice,
    roleLabels: {
      ...(defaults ?? {}),
      ...(practice.roleLabels ?? {}),
      ...(extra ?? {}),
    },
  };
}

function humanDefaults(practice: CataloguePracticeSeed): CatalogueRoleLabelsSeed | undefined {
  switch (practice.kind) {
    case 'directed':
      return {
        give: {
          en: `Do “${practice.en}” to my partner`,
          es: `Hacer «${practice.es}» a mi pareja`,
        },
        receive: {
          en: `Have my partner do “${practice.en}” to me`,
          es: `Que mi pareja me haga «${practice.es}»`,
        },
      };
    case 'power':
      return {
        lead: {
          en: `Take the active / controlling role in “${practice.en}”`,
          es: `Llevar el rol activo / de control en «${practice.es}»`,
        },
        follow: {
          en: `Take the receptive / following role in “${practice.en}”`,
          es: `Llevar el rol receptivo / de seguimiento en «${practice.es}»`,
        },
      };
    case 'watch':
      return {
        watch: {
          en: `Watch my partner in “${practice.en}”`,
          es: `Observar a mi pareja en «${practice.es}»`,
        },
        'be-watched': {
          en: `Have my partner watch me in “${practice.en}”`,
          es: `Que mi pareja me observe en «${practice.es}»`,
        },
      };
    default:
      return undefined;
  }
}
