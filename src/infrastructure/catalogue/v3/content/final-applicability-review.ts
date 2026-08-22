import { CatalogueCategorySeed, CataloguePracticeSeed } from './types';

export const FINAL_APPLICABILITY_RETIRED_PRACTICE_IDS = new Set<string>([
  'doctor-patient-roleplay',
  'nurse-patient-roleplay',
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
      }));

    return category.id === 'roleplay'
      ? { ...category, practices: [...practices, ...MEDICAL_ROLEPLAY] }
      : { ...category, practices };
  });
}
