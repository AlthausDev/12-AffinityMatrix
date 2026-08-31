export const ES_SEMANTIC_DASHBOARD_TRANSLATIONS = {
  'dashboard.semantic.title': 'Mapa de tendencias',
  'dashboard.semantic.description': 'Agrupa tus respuestas mediante las señales semánticas ocultas del catálogo. Las posiciones indican afinidad en lo ya respondido, no porcentaje de cuestionario completado.',
  'dashboard.semantic.themes': 'Dimensiones',
  'dashboard.semantic.inventory': '{dimensions} dimensiones · {tags} señales semánticas',
  'dashboard.semantic.highlights': 'Señales destacadas',
  'dashboard.semantic.coordinates': 'Tendencias relativas',
  'dashboard.semantic.coordinatesDescription': 'Cada binomio se muestra en un eje horizontal independiente. El marcador compara el peso relativo de ambos lados; acercarse a uno no implica rechazo del otro.',
  'dashboard.semantic.coordinatesCenter': 'Equilibrio',
  'dashboard.semantic.score': 'Afinidad orientativa',
  'dashboard.semantic.evidence.one': '{count} práctica respondida',
  'dashboard.semantic.evidence.other': '{count} prácticas respondidas',
  'dashboard.semantic.empty': 'Responde algunas prácticas para empezar a construir este mapa.',
  'dashboard.semantic.note': 'Las variantes de rol o zona de una misma práctica se agregan antes del cálculo para que una pregunta con más opciones no pese más. Los valores usan sólo lo que ya has respondido: contestar más aumenta la evidencia, no el máximo posible. Una respuesta negativa nunca se interpreta como afinidad hacia el extremo contrario.',
} as const;

export type SemanticDashboardTranslationKey = keyof typeof ES_SEMANTIC_DASHBOARD_TRANSLATIONS;

export const EN_SEMANTIC_DASHBOARD_TRANSLATIONS: Readonly<Record<SemanticDashboardTranslationKey, string>> = {
  'dashboard.semantic.title': 'Trend map',
  'dashboard.semantic.description': 'Groups your answers using the catalogue’s hidden semantic signals. Positions show affinity within what you have answered, not questionnaire completion.',
  'dashboard.semantic.themes': 'Dimensions',
  'dashboard.semantic.inventory': '{dimensions} dimensions · {tags} semantic signals',
  'dashboard.semantic.highlights': 'Highlighted signals',
  'dashboard.semantic.coordinates': 'Relative tendencies',
  'dashboard.semantic.coordinatesDescription': 'Each pair is shown on its own horizontal axis. The marker compares the relative weight of both sides; being closer to one does not imply rejection of the other.',
  'dashboard.semantic.coordinatesCenter': 'Balance',
  'dashboard.semantic.score': 'Orientative affinity',
  'dashboard.semantic.evidence.one': '{count} answered practice',
  'dashboard.semantic.evidence.other': '{count} answered practices',
  'dashboard.semantic.empty': 'Answer a few practices to start building this map.',
  'dashboard.semantic.note': 'Role or target variants of the same practice are aggregated before calculation so questions with more options do not carry extra weight. Values use only what you have answered: answering more increases evidence, not the possible maximum. A negative answer is never interpreted as affinity for the opposite end.',
};
