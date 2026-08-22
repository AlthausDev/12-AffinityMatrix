export const ES_DASHBOARD_UX_TRANSLATIONS = {
  'dashboard.settings.action': 'Ajustes',
  'dashboard.status.eyebrow': 'Progreso del perfil',
  'dashboard.status.title': 'Resumen',
  'dashboard.status.overallProgress': 'Progreso del cuestionario',
  'dashboard.status.visibleAnswered': '{answered} de {total} preguntas visibles respondidas',
  'dashboard.status.categoriesComplete': 'Categorías completas',
  'dashboard.status.savedAnswers': 'Respuestas guardadas',
  'dashboard.status.lastUpdated': 'Última actualización',
  'dashboard.status.categoryProgress': 'Progreso por categoría',
  'dashboard.status.catalogueLoading': 'Calculando el progreso con el catálogo actual…',
  'dashboard.status.catalogueUnavailable': 'No se ha podido calcular el progreso por categorías.',
  'dashboard.status.categoryValue': '{answered}/{total} · {percentage}%',
  'dashboard.status.internalVersion': 'Formato local',

  'settings.backProfile': '← Perfil',
  'settings.eyebrow': 'Aplicación',
  'settings.title': 'Ajustes',
  'settings.description': 'Preferencias locales de esta interfaz. No forman parte del perfil ni de los códigos exportados.',
  'settings.questionnaireExit.title': 'Confirmar al salir del cuestionario',
  'settings.questionnaireExit.description': 'Muestra un aviso con las preguntas pendientes antes de volver al perfil.',
  'settings.localOnly': 'Estos ajustes se guardan únicamente en este navegador.',
} as const;

export type DashboardUxTranslationKey = keyof typeof ES_DASHBOARD_UX_TRANSLATIONS;

export const EN_DASHBOARD_UX_TRANSLATIONS: Readonly<Record<DashboardUxTranslationKey, string>> = {
  'dashboard.settings.action': 'Settings',
  'dashboard.status.eyebrow': 'Profile progress',
  'dashboard.status.title': 'Summary',
  'dashboard.status.overallProgress': 'Questionnaire progress',
  'dashboard.status.visibleAnswered': '{answered} of {total} visible questions answered',
  'dashboard.status.categoriesComplete': 'Completed categories',
  'dashboard.status.savedAnswers': 'Saved answers',
  'dashboard.status.lastUpdated': 'Last updated',
  'dashboard.status.categoryProgress': 'Progress by category',
  'dashboard.status.catalogueLoading': 'Calculating progress with the current catalogue…',
  'dashboard.status.catalogueUnavailable': 'Category progress could not be calculated.',
  'dashboard.status.categoryValue': '{answered}/{total} · {percentage}%',
  'dashboard.status.internalVersion': 'Local format',

  'settings.backProfile': '← Profile',
  'settings.eyebrow': 'Application',
  'settings.title': 'Settings',
  'settings.description': 'Local preferences for this interface. They are not part of the profile or exported profile codes.',
  'settings.questionnaireExit.title': 'Confirm before leaving the questionnaire',
  'settings.questionnaireExit.description': 'Show a summary of unanswered questions before returning to the profile.',
  'settings.localOnly': 'These settings are stored only in this browser.',
};
