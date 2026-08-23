import { CataloguePracticeSeed } from './types';

type PracticeOverride = Partial<CataloguePracticeSeed>;

function paired(
  leftId: string,
  leftEn: string,
  leftEs: string,
  rightId: string,
  rightEn: string,
  rightEs: string,
): PracticeOverride {
  return {
    kind: 'paired',
    pairedRoles: [
      { id: leftId, en: leftEn, es: leftEs, perspective: 'active' },
      { id: rightId, en: rightEn, es: rightEs, perspective: 'receptive' },
    ],
  };
}

/**
 * Asymmetric practices where a generic “Participate” or “Lead / follow” answer would discard
 * meaningful preference information. The role labels belong to the catalogue data, not the UI.
 */
export const PAIRED_PRACTICE_OVERRIDES: Readonly<Record<string, PracticeOverride>> = {
  'boss-employee-roleplay': paired('boss', 'Boss', 'Jefe/a', 'employee', 'Employee', 'Empleado/a'),
  'teacher-student-adult-roleplay': paired(
    'teacher', 'Adult teacher', 'Profesor/a adulto/a',
    'adult-student', 'Adult student', 'Estudiante adulto/a',
  ),
  'doctor-patient-roleplay': paired('doctor', 'Doctor', 'Médico/a', 'patient', 'Patient', 'Paciente'),
  'nurse-patient-roleplay': paired('nurse', 'Nurse', 'Enfermero/a', 'patient', 'Patient', 'Paciente'),
  'police-roleplay': paired('officer', 'Police officer', 'Policía', 'civilian', 'Civilian / counterpart', 'Civil / contraparte'),
  'prisoner-guard-roleplay': paired('guard', 'Guard', 'Guardia', 'prisoner', 'Prisoner', 'Prisionero/a'),
  'captor-captive-roleplay': paired('captor', 'Captor', 'Captor/a', 'captive', 'Captive', 'Cautivo/a'),
  'royalty-servant-roleplay': paired('royalty', 'Royalty', 'Realeza', 'servant', 'Servant', 'Sirviente'),
  'celebrity-fan-roleplay': paired('celebrity', 'Celebrity', 'Famoso/a', 'fan', 'Fan', 'Fan'),
  'massage-roleplay': paired('masseur', 'Masseur / giver', 'Masajista', 'client', 'Client / receiver', 'Cliente / receptor'),
  'delivery-person-roleplay': paired('delivery-person', 'Delivery person', 'Repartidor/a', 'customer', 'Customer', 'Cliente'),
  'pet-play': paired('handler', 'Handler / owner role', 'Guía / dueño/a', 'pet', 'Pet role', 'Rol de mascota'),
  'consensual-non-consent-roleplay': paired(
    'initiator', 'Initiating role', 'Rol iniciador',
    'resisting-role', 'Resisting / receiving role', 'Rol de resistencia / receptor',
  ),
  'sleep-roleplay': paired('awake-role', 'Awake role', 'Rol despierto', 'sleeping-role', 'Sleeping role', 'Rol dormido'),
  'interrogation-roleplay': paired('interrogator', 'Interrogator', 'Interrogador/a', 'questioned', 'Questioned role', 'Rol interrogado'),

  domination: paired('dominant', 'Dominant', 'Dominante', 'submissive', 'Submissive', 'Sumiso/a'),
  commands: paired('command', 'Give commands', 'Dar órdenes', 'obey', 'Follow commands', 'Seguir órdenes'),
  service: paired('receive-service', 'Receive service', 'Recibir servicio', 'provide-service', 'Provide service', 'Prestar servicio'),
  protocol: paired('set-protocol', 'Set / enforce protocol', 'Establecer / exigir protocolo', 'follow-protocol', 'Follow protocol', 'Seguir protocolo'),
  rules: paired('set-rules', 'Set rules', 'Establecer reglas', 'follow-rules', 'Seguir reglas', 'Seguir reglas'),
  discipline: paired('discipline', 'Discipline', 'Disciplinar', 'be-disciplined', 'Be disciplined', 'Ser disciplinado/a'),
  punishment: paired('punish', 'Punish', 'Castigar', 'be-punished', 'Be punished', 'Ser castigado/a'),
  'reward-system': paired('reward', 'Give rewards', 'Dar recompensas', 'be-rewarded', 'Receive rewards', 'Recibir recompensas'),
  training: paired('train', 'Train', 'Entrenar', 'be-trained', 'Be trained', 'Ser entrenado/a'),
  ownership: paired('owner', 'Owner role', 'Rol de dueño/a', 'owned', 'Owned role', 'Rol de pertenencia'),
  collaring: paired('collar', 'Give / place the collar', 'Dar / poner el collar', 'be-collared', 'Receive / wear the collar', 'Recibir / llevar el collar'),
  'leash-control': paired('hold-leash', 'Hold / control the leash', 'Llevar / controlar la correa', 'on-leash', 'Be on the leash', 'Ir con la correa'),
  'permission-dynamic': paired('grant-permission', 'Grant / deny permission', 'Dar / negar permiso', 'ask-permission', 'Ask for permission', 'Pedir permiso'),
  'sexual-service': paired('receive-sexual-service', 'Receive sexual service', 'Recibir servicio sexual', 'provide-sexual-service', 'Provide sexual service', 'Prestar servicio sexual'),
  'domestic-service': paired('receive-domestic-service', 'Receive domestic service', 'Recibir servicio doméstico', 'provide-domestic-service', 'Provide domestic service', 'Prestar servicio doméstico'),
  kneeling: paired('have-kneel', 'Have partner kneel', 'Hacer que la pareja se arrodille', 'kneel', 'Kneel', 'Arrodillarse'),
  'standing-at-attention': paired('order-attention', 'Require the position', 'Exigir la posición', 'stand-attention', 'Stand at attention', 'Permanecer firme'),
  inspection: paired('inspect', 'Inspect', 'Inspeccionar', 'be-inspected', 'Be inspected', 'Ser inspeccionado/a'),
  'addressing-with-titles': paired('be-addressed', 'Be addressed with a title', 'Ser tratado/a con un título', 'use-title', 'Use a title for partner', 'Usar un título para la pareja'),
  'clothing-control': paired('control-clothing', 'Control partner’s clothing', 'Controlar la ropa de la pareja', 'clothing-controlled', 'Have my clothing controlled', 'Que controlen mi ropa'),
  'speech-control': paired('control-speech', 'Control partner’s speech', 'Controlar el habla de la pareja', 'speech-controlled', 'Have my speech controlled', 'Que controlen mi habla'),
  'position-control': paired('control-position', 'Control partner’s positions', 'Controlar las posturas de la pareja', 'position-controlled', 'Have my positions controlled', 'Que controlen mis posturas'),
  'financial-control-roleplay': paired('financial-controller', 'Controlling role', 'Rol de control', 'financial-controlled', 'Controlled role', 'Rol controlado'),
  'brat-dynamic': paired('brat-tamer', 'Brat-tamer', 'Brat-tamer', 'brat', 'Brat', 'Brat'),
};
