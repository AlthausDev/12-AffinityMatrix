export const ES_SEMANTIC_DASHBOARD_TRANSLATIONS = {
  'dashboard.semantic.title': 'Mapa de tendencias',
  'dashboard.semantic.description': 'Agrupa tus respuestas mediante las señales semánticas ocultas del catálogo. Es orientativo: describe patrones del cuestionario, no tu personalidad.',
  'dashboard.semantic.themes': 'Dimensiones',
  'dashboard.semantic.inventory': '{dimensions} dimensiones · {tags} señales semánticas',
  'dashboard.semantic.highlights': 'Señales destacadas',
  'dashboard.semantic.coordinates': 'Mapas de coordenadas',
  'dashboard.semantic.coordinatesDescription': 'Los ejes comparan el peso relativo de familias de señales con afinidad positiva. Estar cerca de un lado no implica rechazo del contrario.',
  'dashboard.semantic.coordinatesCenter': 'Equilibrio',
  'dashboard.semantic.score': 'Afinidad orientativa',
  'dashboard.semantic.evidence.one': '{count} práctica respondida',
  'dashboard.semantic.evidence.other': '{count} prácticas respondidas',
  'dashboard.semantic.empty': 'Responde algunas prácticas para empezar a construir este mapa.',
  'dashboard.semantic.note': 'Las variantes de rol o zona de una misma práctica se agregan antes de calcular el mapa, para no dar más peso a preguntas con más opciones. Una respuesta negativa aporta evidencia, pero nunca se interpreta como afinidad hacia el extremo contrario.',
} as const;

export type SemanticDashboardTranslationKey = keyof typeof ES_SEMANTIC_DASHBOARD_TRANSLATIONS;

export const EN_SEMANTIC_DASHBOARD_TRANSLATIONS: Readonly<Record<SemanticDashboardTranslationKey, string>> = {
  'dashboard.semantic.title': 'Trend map',
  'dashboard.semantic.description': 'Groups your answers using the catalogue’s hidden semantic signals. It is orientative: it describes questionnaire patterns, not your personality.',
  'dashboard.semantic.themes': 'Dimensions',
  'dashboard.semantic.inventory': '{dimensions} dimensions · {tags} semantic signals',
  'dashboard.semantic.highlights': 'Highlighted signals',
  'dashboard.semantic.coordinates': 'Coordinate maps',
  'dashboard.semantic.coordinatesDescription': 'The axes compare the relative weight of positively rated signal families. Being near one side does not imply rejection of the other.',
  'dashboard.semantic.coordinatesCenter': 'Balance',
  'dashboard.semantic.score': 'Orientative affinity',
  'dashboard.semantic.evidence.one': '{count} answered practice',
  'dashboard.semantic.evidence.other': '{count} answered practices',
  'dashboard.semantic.empty': 'Answer a few practices to start building this map.',
  'dashboard.semantic.note': 'Role or target variants of the same practice are aggregated before the map is calculated, so questions with more options do not carry extra weight. A negative answer adds evidence, but it is never interpreted as affinity for the opposite end.',
};
