export const ES_PREFERENCE_SCALE_TRANSLATIONS = {
  'preference.favorite': 'Me encanta',
  'preference.favorite.hint': 'Es de tus opciones preferidas y te apetece especialmente.',
  'preference.like': 'Me gusta',
  'preference.like.hint': 'Te gusta y forma parte de lo que sí te apetece.',
  'preference.depends': 'Depende',
  'preference.depends.hint': 'Puede gustarte según el contexto, la intensidad o las condiciones.',
  'preference.curious': 'Curiosidad',
  'preference.curious.hint': 'No sabes aún si te gusta, pero te interesa explorarlo.',
  'preference.notInterested': 'No me interesa',
  'preference.notInterested.hint': 'No te atrae ni lo buscas, pero no lo defines como un límite.',
  'preference.boundary': 'No rotundo',
  'preference.boundary.hint': 'No quieres hacerlo. Es un límite que debe respetarse.',
  'questionnaire.categories.description': 'Responde a tu ritmo. Puedes dejar preguntas para más tarde: no responder no cuenta como una preferencia. Cada respuesta se guarda al instante.',
  'comparison.description': 'La comparación se calcula a partir del catálogo actual, las parejas de roles explícitas y las preferencias respondidas. Las preguntas sin responder se excluyen del cálculo.',
  'comparison.classification.boundary': 'No rotundo',
} as const;

export type PreferenceScaleTranslationKey = keyof typeof ES_PREFERENCE_SCALE_TRANSLATIONS;

export const EN_PREFERENCE_SCALE_TRANSLATIONS: Readonly<
  Record<PreferenceScaleTranslationKey, string>
> = {
  'preference.favorite': 'Love it',
  'preference.favorite.hint': 'One of your preferred options and something you especially enjoy.',
  'preference.like': 'Like it',
  'preference.like.hint': 'You like it and it belongs in the things you actively enjoy.',
  'preference.depends': 'Depends',
  'preference.depends.hint': 'It can work depending on context, intensity, or conditions.',
  'preference.curious': 'Curious',
  'preference.curious.hint': 'You do not know yet whether you like it, but you are interested in exploring it.',
  'preference.notInterested': 'Not interested',
  'preference.notInterested.hint': 'It does not appeal to you, but you do not define it as a boundary.',
  'preference.boundary': 'Hard no',
  'preference.boundary.hint': 'You do not want to do it. This is a boundary that must be respected.',
  'questionnaire.categories.description': 'Answer at your own pace. You can leave questions for later: unanswered questions do not count as a preference. Every answer is saved instantly.',
  'comparison.description': 'Comparison uses the current catalogue, explicit compatible role pairs, and answered preferences. Unanswered questions are excluded from the calculation.',
  'comparison.classification.boundary': 'Hard no',
};
