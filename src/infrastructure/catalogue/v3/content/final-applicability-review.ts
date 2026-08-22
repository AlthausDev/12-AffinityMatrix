import {
  RoleApplicability,
  SelfProfileApplicabilityExclusion,
} from '../../../../domain/catalogue/practice';
import { CatalogueCategorySeed, CataloguePracticeSeed } from './types';

export const FINAL_APPLICABILITY_RETIRED_PRACTICE_IDS = new Set<string>([
  'doctor-patient-roleplay',
  'nurse-patient-roleplay',
]);

const HETEROSEXUAL_MALE_EXCLUSION: readonly SelfProfileApplicabilityExclusion[] = [
  { sex: 'male', orientation: 'heterosexual' },
];
const HETEROSEXUAL_MALE_ORIFICE_EXCLUSION: readonly SelfProfileApplicabilityExclusion[] = [
  { sex: 'male', orientation: 'heterosexual', targetSites: ['mouth', 'anal'] },
];
const EXTRA_PENETRATIVE_RECEIVER_IDS = new Set<string>([
  'fingering-anal',
  'prostate-massage-manual',
]);

const PRACTICE_OVERRIDES: Readonly<Record<string, Partial<CataloguePracticeSeed>>> = {
  'threesome-mmf': { groupComposition: ['male', 'male', 'female'] },
  'threesome-mff': { groupComposition: ['male', 'female', 'female'] },
  'threesome-mmm': { groupComposition: ['male', 'male', 'male'] },
  'threesome-fff': { groupComposition: ['female', 'female', 'female'] },

  'wand-vibrator': {
    roleApplicability: {
      'use-on-self': { selfSex: ['female'] },
      'use-on-partner': { partnerSex: ['female'] },
      'partner-uses-on-me': { selfSex: ['female'] },
    },
  },
  'strap-on': {
    toyRoles: ['use-on-partner', 'partner-uses-on-me'],
    roleApplicability: {
      'use-on-partner': { selfSex: ['female'] },
      'partner-uses-on-me': { partnerSex: ['female'] },
    },
  },
  'strapless-strap-on': {
    toyRoles: ['use-on-partner', 'partner-uses-on-me'],
    roleApplicability: {
      'use-on-partner': { selfSex: ['female'] },
      'partner-uses-on-me': { partnerSex: ['female'] },
    },
  },

  'facial-hair': { anatomySex: 'male' },

  swallowing: {
    roleApplicability: {
      'self-state': { partnerSex: ['male'] },
      'partner-state': { selfSex: ['male'] },
    },
  },
  'spitting-semen': {
    roleApplicability: {
      'self-state': { partnerSex: ['male'] },
      'partner-state': { selfSex: ['male'] },
    },
  },
  snowballing: { requiresAnyParticipantSex: ['male'] },
  'creampie-cleanup': { requiresAnyParticipantSex: ['male'] },

  'glory-hole': {
    kind: 'paired',
    counterpartScoped: true,
    descriptionEn: 'A glory-hole encounter with two explicit sides: one adult presents their penis through the opening, while the other adult remains on the opposite side and stimulates it orally or manually.',
    descriptionEs: 'Encuentro de glory hole con dos lados explícitos: una persona adulta introduce su pene por la abertura y la otra permanece al lado opuesto para estimularlo oral o manualmente.',
    pairedRoles: [
      {
        id: 'present-penis',
        en: 'Put my penis through the glory hole',
        es: 'Introducir mi pene por el glory hole',
        perspective: 'receptive',
      },
      {
        id: 'stimulate-other-side',
        en: 'Stimulate the penis from the other side',
        es: 'Estimular el pene desde el otro lado',
        perspective: 'active',
      },
    ],
    roleApplicability: {
      'present-penis': { selfSex: ['male'] },
      'stimulate-other-side': { partnerSex: ['male'] },
    },
  },
};

const MEDICAL_ROLEPLAY: readonly CataloguePracticeSeed[] = [
  {
    id: 'medical-professional-patient-roleplay',
    en: 'Doctor / nurse and patient roleplay',
    es: 'Roleplay médico/a o enfermero/a / paciente',
    kind: 'paired',
    counterpartScoped: true,
    descriptionEn: 'Medical roleplay where one adult takes the doctor or nurse role and the other takes the patient role. The medical profession itself is secondary to the professional/patient dynamic.',
    descriptionEs: 'Roleplay médico en el que una persona adulta interpreta a un médico/a o enfermero/a y la otra a un paciente. La profesión concreta queda en segundo plano frente a la dinámica profesional/paciente.',
    pairedRoles: [
      { id: 'medical-professional', en: 'Doctor / nurse', es: 'Médico/a o enfermero/a', perspective: 'active' },
      { id: 'patient', en: 'Patient', es: 'Paciente', perspective: 'receptive' },
    ],
  },
  {
    id: 'doctor-nurse-roleplay',
    en: 'Doctor / nurse roleplay',
    es: 'Roleplay médico/a / enfermero/a',
    kind: 'paired',
    counterpartScoped: true,
    descriptionEn: 'Medical roleplay focused on the relationship between a doctor and a nurse rather than on either person being a patient.',
    descriptionEs: 'Roleplay médico centrado en la relación entre un médico/a y un enfermero/a, sin que ninguna de las dos personas interprete al paciente.',
    pairedRoles: [
      { id: 'doctor', en: 'Doctor', es: 'Médico/a', perspective: 'active' },
      { id: 'nurse', en: 'Nurse', es: 'Enfermero/a', perspective: 'receptive' },
    ],
  },
];

export function applyFinalApplicabilityReview(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  return content.map((category) => {
    const practices = category.practices
      .filter((practice) => !FINAL_APPLICABILITY_RETIRED_PRACTICE_IDS.has(practice.id))
      .map((practice) => ({
        ...practice,
        ...(PRACTICE_OVERRIDES[practice.id] ?? {}),
      }))
      .map((practice) => applyProfileAwareExclusions(category.id, practice));

    return category.id === 'roleplay'
      ? { ...category, practices: [...practices, ...MEDICAL_ROLEPLAY] }
      : { ...category, practices };
  });
}

function applyProfileAwareExclusions(
  categoryId: string,
  practice: CataloguePracticeSeed,
): CataloguePracticeSeed {
  let result = practice;

  if (categoryId === 'penetration' && result.kind === 'directed') {
    result = addRoleApplicability(result, 'receive', {
      selfProfileExclusions: HETEROSEXUAL_MALE_EXCLUSION,
    });
  }

  if (EXTRA_PENETRATIVE_RECEIVER_IDS.has(result.id)) {
    result = addRoleApplicability(result, 'receive', {
      selfProfileExclusions: HETEROSEXUAL_MALE_EXCLUSION,
    });
  }

  if (result.kind === 'toy') {
    result = addRoleApplicability(result, 'use-on-self', {
      selfProfileExclusions: HETEROSEXUAL_MALE_ORIFICE_EXCLUSION,
    });
    result = addRoleApplicability(result, 'partner-uses-on-me', {
      selfProfileExclusions: HETEROSEXUAL_MALE_ORIFICE_EXCLUSION,
    });
  }

  if (result.id === 'swallowing') {
    result = addRoleApplicability(result, 'self-state', {
      selfProfileExclusions: HETEROSEXUAL_MALE_EXCLUSION,
    });
  }

  return result;
}

function addRoleApplicability(
  practice: CataloguePracticeSeed,
  roleId: string,
  additional: RoleApplicability,
): CataloguePracticeSeed {
  const current = practice.roleApplicability?.[roleId];
  const merged: RoleApplicability = {
    ...(current ?? {}),
    ...additional,
    ...(current?.selfProfileExclusions || additional.selfProfileExclusions
      ? {
          selfProfileExclusions: [
            ...(current?.selfProfileExclusions ?? []),
            ...(additional.selfProfileExclusions ?? []),
          ],
        }
      : {}),
  };

  return {
    ...practice,
    roleApplicability: {
      ...practice.roleApplicability,
      [roleId]: merged,
    },
  };
}
