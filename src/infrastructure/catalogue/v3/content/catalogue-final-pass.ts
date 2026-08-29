import { CatalogueCategorySeed, CataloguePracticeSeed } from './types';

export const FINAL_PASS_RETIRED_PRACTICE_IDS = new Set<string>([
  // Superseded before the 0.2 release by clearer/non-duplicated entries.
  'partner-erotic-photography',
  'hospitality-service',
  'ritual-attendance-service',
  'creampie-cleanup',
  'own-urine-play',
  'own-blood-play',
  'own-scat-play',
]);

const PRACTICE_OVERRIDES: Readonly<Record<string, Partial<CataloguePracticeSeed>>> = {
  'watching-partner-with-other': {
    descriptionEn: 'My partner has sex with someone else and I knowingly watch or know about it, without adding a specific hotwife, cuckold or cuckquean role to the scenario.',
    descriptionEs: 'Mi pareja tiene sexo con otra persona y yo lo veo o lo sé, sin añadir necesariamente un marco concreto de hotwife, cuckold o cuckquean.',
  },
  'hotwife-dynamic': {
    descriptionEn: 'The woman is the focus: she has sex with other people with her partner’s knowledge or encouragement. If the erotic focus is instead the male partner’s role as the partner of someone who has sex with others, that is the cuckold framing.',
    descriptionEs: 'El foco está en la mujer: ella tiene sexo con otras personas con conocimiento o estímulo de su pareja. Si el atractivo está en el papel del hombre como pareja de alguien que tiene sexo con terceros, el marco es cuckold.',
  },
  'cuckold-dynamic': {
    descriptionEn: 'The man is the focus: his partner has sex with other people and his role as the cuckolded male partner is itself part of the appeal. Jealousy, exclusion, submission or humiliation can appear, but are not required. If the focus is mainly the woman having other partners, hotwife is clearer.',
    descriptionEs: 'El foco está en el hombre: su pareja tiene sexo con otras personas y su papel como hombre cuckold forma parte del atractivo. Puede incluir celos erotizados, exclusión, sumisión o humillación, pero no es obligatorio. Si el foco está principalmente en la mujer y sus encuentros con terceros, hotwife es más claro.',
  },
  'cuckquean-dynamic': {
    descriptionEn: 'The woman is the focus as the partner whose partner has sex with other people. Jealousy, exclusion, submission or humiliation may be part of the fantasy, but are not required.',
    descriptionEs: 'El foco está en la mujer como pareja de una persona que tiene sexo con terceros. Puede haber celos erotizados, exclusión, sumisión o humillación, pero no es obligatorio.',
  },
  'sexual-service': {
    descriptionEn: 'A broad sexual-service role where pleasing or sexually attending to a partner is deliberately framed as service within the power dynamic.',
    descriptionEs: 'Rol amplio de servicio sexual donde complacer o atender sexualmente a la pareja se vive deliberadamente como servicio dentro de la dinámica de poder.',
  },
  'pussy-torture': {
    en: 'Intense vulva pain play',
    es: 'Juego intenso de dolor vulvar',
    descriptionEn: 'High-intensity pain play focused specifically on the vulva or external female genitals. It is the female-anatomy counterpart to genital pain practices such as CBT, not a reference to the vagina itself.',
    descriptionEs: 'Juego de dolor de alta intensidad centrado específicamente en la vulva o genitales externos femeninos. Es el equivalente para anatomía femenina de otros juegos de dolor genital como CBT; no se refiere a la vagina interna.',
  },

  // Own urine/blood/scat variants live inside the relevant practice instead of separate questions.
  'urine-play': directedSelf(
    'Use my urine with my partner', 'Usar mi orina con mi pareja',
    'Receive my partner’s urine', 'Recibir orina de mi pareja',
    'Use my own urine on/with myself', 'Usar mi propia orina conmigo',
    'Urine-focused play, separating using your urine with a partner, receiving a partner’s urine and using your own urine with yourself.',
    'Juego centrado en la orina, diferenciando usar la propia con la pareja, recibir orina de la pareja y usar la propia orina con uno/a mismo/a.',
  ),
  'urine-drinking': directedSelf(
    'Have my partner drink my urine', 'Que mi pareja beba mi orina',
    'Drink my partner’s urine', 'Beber orina de mi pareja',
    'Drink my own urine', 'Beber mi propia orina',
    'Drinking urine, distinguishing your own urine from a partner’s and the reciprocal partner role.',
    'Beber orina, diferenciando claramente beber la propia, beber la de la pareja o que la pareja beba la tuya.',
  ),
  'blood-play': directedSelf(
    'Use my blood with my partner', 'Usar mi sangre con mi pareja',
    'Interact with my partner’s blood', 'Interactuar con la sangre de mi pareja',
    'Use my own blood with myself', 'Usar mi propia sangre conmigo',
    'General blood-focused fantasy or play, separating your own blood from a partner’s. It does not imply any particular method of obtaining blood.',
    'Fantasía o juego general centrado en sangre, diferenciando la propia de la de la pareja. No implica ninguna forma concreta de obtenerla.',
  ),
  'blood-on-body': directedSelf(
    'Put my blood on my partner’s body', 'Poner mi sangre sobre el cuerpo de mi pareja',
    'Have my partner’s blood on my body', 'Recibir sangre de mi pareja sobre mi cuerpo',
    'Use my own blood on my body', 'Usar mi propia sangre sobre mi cuerpo',
    'Blood on the body, separating whose blood it is and whose body it is on.',
    'Sangre sobre el cuerpo, diferenciando de quién es la sangre y sobre quién se encuentra.',
  ),
  'blood-drinking': directedSelf(
    'Have my partner drink my blood', 'Que mi pareja beba mi sangre',
    'Drink my partner’s blood', 'Beber sangre de mi pareja',
    'Drink my own blood', 'Beber mi propia sangre',
    'Blood-drinking interest, separating your own blood from a partner’s. No method of obtaining blood is implied.',
    'Interés por beber sangre, diferenciando la propia de la de la pareja. No se presupone ninguna forma de obtenerla.',
  ),
  'scat-on-body': directedSelf(
    'Put my feces on my partner’s body', 'Poner mis heces sobre el cuerpo de mi pareja',
    'Have my partner’s feces on my body', 'Recibir heces de mi pareja sobre mi cuerpo',
    'Use my own feces on my body', 'Usar mis propias heces sobre mi cuerpo',
    'Scat/feces on the body, separating your own material from a partner’s.',
    'Heces o scat sobre el cuerpo, diferenciando el material propio del de la pareja.',
  ),
  'scat-in-mouth': directedSelf(
    'Put my feces in my partner’s mouth', 'Poner mis heces en la boca de mi pareja',
    'Have my partner’s feces in my mouth', 'Recibir heces de mi pareja en mi boca',
    'Put my own feces in my mouth', 'Usar mis propias heces en mi boca',
    'Mouth contact with scat/feces, separating your own material from a partner’s.',
    'Contacto de heces o scat con la boca, diferenciando el material propio del de la pareja.',
  ),
  'scat-ingestion': directedSelf(
    'Have my partner ingest my feces', 'Que mi pareja ingiera mis heces',
    'Ingest my partner’s feces', 'Ingerir heces de mi pareja',
    'Ingest my own feces', 'Ingerir mis propias heces',
    'Ingestion-focused scat interest, separating your own material from a partner’s.',
    'Interés por ingestión de scat, diferenciando el material propio del de la pareja.',
  ),
};

const ADDITIONS: Readonly<Record<string, readonly CataloguePracticeSeed[]>> = {
  exhibitionism: [
    paired(
      'erotic-media-exchange',
      'Exchanging erotic photos or videos',
      'Intercambiar fotos o vídeos eróticos',
      'Sending erotic photos or short videos directly to a partner and receiving them from that partner, as a private exchange rather than a live video call or a recording made together.',
      'Enviar fotos o vídeos eróticos directamente a la pareja y recibirlos de ella, como intercambio privado y distinto de una videollamada o una grabación hecha juntos.',
      'send-erotic-media', 'Send erotic photos/videos to my partner', 'Enviar fotos/vídeos eróticos a mi pareja',
      'receive-erotic-media', 'Receive erotic photos/videos from my partner', 'Recibir fotos/vídeos eróticos de mi pareja',
    ),
    {
      id: 'private-striptease',
      en: 'Private striptease for a partner',
      es: 'Striptease privado para la pareja',
      kind: 'directed', counterpartScoped: true,
      descriptionEn: 'A deliberate erotic performance for one partner, distinct from simply being watched while undressing.',
      descriptionEs: 'Actuación erótica deliberada para la pareja, distinta de simplemente ser observado/a mientras uno se desnuda.',
      roleLabels: {
        give: { en: 'Perform a private striptease for my partner', es: 'Hacer un striptease privado para mi pareja' },
        receive: { en: 'Watch my partner perform a private striptease', es: 'Ver a mi pareja hacer un striptease privado' },
      },
    },
    {
      id: 'watched-masturbation',
      en: 'Watching / being watched masturbating',
      es: 'Mirar / ser mirado al masturbarse',
      kind: 'watch', counterpartScoped: true,
      descriptionEn: 'Erotic interest in watching a partner masturbate or deliberately masturbating while that partner watches.',
      descriptionEs: 'Interés erótico en observar a la pareja mientras se masturba o masturbarse deliberadamente mientras la pareja observa.',
      roleLabels: {
        watch: { en: 'Watch my partner masturbate', es: 'Ver masturbarse a mi pareja' },
        'be-watched': { en: 'Have my partner watch me masturbate', es: 'Que mi pareja me vea masturbarme' },
      },
    },
  ],
  power: [
    service(
      'attentive-service',
      'Attentive / waiting service',
      'Servicio de atención / espera',
      'Being deliberately available to bring things, attend to comfort or carry out small requests as an ongoing service role.',
      'Estar deliberadamente disponible para traer cosas, atender al confort o cumplir pequeñas peticiones como rol continuado de servicio.',
    ),
    service(
      'pleasure-focused-service',
      'Pleasure-focused erotic service',
      'Servicio erótico centrado en el placer',
      'Erotic service centred on prioritising the other person’s physical pleasure without requiring reciprocal stimulation in that moment.',
      'Servicio erótico centrado en priorizar el placer físico de la otra persona sin exigir estimulación recíproca en ese momento.',
    ),
    service(
      'erotic-presentation-service',
      'Erotic presentation service',
      'Servicio de presentación erótica',
      'Dressing, undressing, posing or presenting yourself in a way requested by the other person because the act of presentation is part of the service dynamic.',
      'Vestirse, desvestirse, posar o presentarse como pida la otra persona porque esa presentación forma parte de la dinámica de servicio.',
    ),
  ],
  fluids: [
    cleanup(
      'semen-cleanup-manual',
      'Manual semen cleanup',
      'Limpieza manual del semen',
      'Cleaning semen from a partner’s body with the hands after external ejaculation or a creampie, where the cleanup itself is part of the erotic interest.',
      'Limpiar con las manos semen del cuerpo de la pareja tras una eyaculación externa o un creampie, cuando la propia limpieza forma parte del interés erótico.',
      'Manually clean semen from my partner', 'Limpiar manualmente semen de mi pareja',
      'Have my partner manually clean semen from me', 'Que mi pareja limpie manualmente semen de mi cuerpo',
    ),
    cleanup(
      'semen-cleanup-oral',
      'Oral semen cleanup',
      'Limpieza oral del semen',
      'Cleaning semen from a partner’s body with the mouth or tongue after external ejaculation or a creampie.',
      'Limpiar con la boca o la lengua semen del cuerpo de la pareja tras una eyaculación externa o un creampie.',
      'Orally clean semen from my partner', 'Limpiar oralmente semen de mi pareja',
      'Have my partner orally clean semen from me', 'Que mi pareja limpie oralmente semen de mi cuerpo',
    ),
    cleanup(
      'semen-cleanup-other',
      'Other erotic semen cleanup',
      'Otra limpieza erótica del semen',
      'Other erotic cleanup of semen after external ejaculation or a creampie when neither manual nor oral cleanup describes the fantasy well.',
      'Otra forma erótica de limpiar semen tras una eyaculación externa o un creampie cuando ni la limpieza manual ni la oral describen bien la fantasía.',
      'Erotically clean semen from my partner in another way', 'Limpiar eróticamente semen de mi pareja de otra forma',
      'Have my partner clean semen from me in another erotic way', 'Que mi pareja limpie semen de mi cuerpo de otra forma erótica',
    ),
  ],
};

export function applyCatalogueFinalPass(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  return content.map((category) => {
    const practices = category.practices
      .filter((practice) => !FINAL_PASS_RETIRED_PRACTICE_IDS.has(practice.id))
      .map((practice) => ({ ...practice, ...(PRACTICE_OVERRIDES[practice.id] ?? {}) }));
    const existing = new Set(practices.map((practice) => practice.id));
    return {
      ...category,
      practices: [
        ...practices,
        ...(ADDITIONS[category.id] ?? []).filter((practice) => !existing.has(practice.id)),
      ],
    };
  });
}

function directedSelf(
  giveEn: string, giveEs: string,
  receiveEn: string, receiveEs: string,
  selfEn: string, selfEs: string,
  descriptionEn: string, descriptionEs: string,
): Partial<CataloguePracticeSeed> {
  return {
    kind: 'directed-self', counterpartScoped: true, descriptionEn, descriptionEs,
    roleLabels: {
      give: { en: giveEn, es: giveEs },
      receive: { en: receiveEn, es: receiveEs },
      self: { en: selfEn, es: selfEs },
    },
  };
}

function paired(
  id: string, en: string, es: string, descriptionEn: string, descriptionEs: string,
  leftId: string, leftEn: string, leftEs: string,
  rightId: string, rightEn: string, rightEs: string,
): CataloguePracticeSeed {
  return {
    id, en, es, descriptionEn, descriptionEs, kind: 'paired', counterpartScoped: true,
    pairedRoles: [
      { id: leftId, en: leftEn, es: leftEs, perspective: 'active' },
      { id: rightId, en: rightEn, es: rightEs, perspective: 'receptive' },
    ],
  };
}

function service(
  id: string, en: string, es: string, descriptionEn: string, descriptionEs: string,
): CataloguePracticeSeed {
  return paired(
    id, en, es, descriptionEn, descriptionEs,
    'provide-service', 'Provide this service to my partner', 'Prestar este servicio a mi pareja',
    'receive-service', 'Receive this service from my partner', 'Recibir este servicio de mi pareja',
  );
}

function cleanup(
  id: string, en: string, es: string, descriptionEn: string, descriptionEs: string,
  giveEn: string, giveEs: string, receiveEn: string, receiveEs: string,
): CataloguePracticeSeed {
  return {
    id, en, es, descriptionEn, descriptionEs, kind: 'directed', counterpartScoped: true,
    roleLabels: {
      give: { en: giveEn, es: giveEs },
      receive: { en: receiveEn, es: receiveEs },
    },
  };
}
