import { CatalogueCategorySeed, CatalogueRoleLabelsSeed } from './types';

const DIRECTED_ROLE_WORDING: Readonly<Record<string, CatalogueRoleLabelsSeed>> = {
  handjob: roles('Stimulate my partner’s penis by hand', 'Estimular manualmente el pene de mi pareja', 'Have my penis stimulated by hand', 'Que estimulen manualmente mi pene'),
  'vulva-hand-stimulation': roles('Stimulate my partner’s vulva by hand', 'Estimular manualmente la vulva de mi pareja', 'Have my vulva stimulated by hand', 'Que estimulen manualmente mi vulva'),
  'clitoral-stimulation': roles('Stimulate my partner’s clitoris', 'Estimular el clítoris de mi pareja', 'Have my clitoris stimulated', 'Que estimulen mi clítoris'),
  'fingering-vaginal': roles('Use fingers vaginally on my partner', 'Estimular vaginalmente a mi pareja con los dedos', 'Receive vaginal fingering', 'Recibir estimulación vaginal con los dedos'),
  'fingering-anal': roles('Use fingers anally on my partner', 'Estimular analmente a mi pareja con los dedos', 'Receive anal fingering', 'Recibir estimulación anal con los dedos'),
  'hand-over-mouth': roles('Cover my partner’s mouth with my hand', 'Tapar la boca de mi pareja con la mano', 'Have my mouth covered by hand', 'Que me tapen la boca con la mano'),
  'touching-over-clothes': roles('Touch my partner over clothing', 'Tocar a mi pareja sobre la ropa', 'Be touched over clothing', 'Que me toquen sobre la ropa'),
  'touching-under-clothes': roles('Touch my partner under clothing', 'Tocar a mi pareja bajo la ropa', 'Be touched under clothing', 'Que me toquen bajo la ropa'),
  'breast-stimulation-by-hand': roles('Stimulate my partner’s breasts by hand', 'Estimular manualmente el pecho de mi pareja', 'Have my breasts stimulated by hand', 'Que estimulen manualmente mi pecho'),
  'nipple-stimulation-by-hand': roles('Stimulate my partner’s nipples by hand', 'Estimular manualmente los pezones de mi pareja', 'Have my nipples stimulated by hand', 'Que estimulen manualmente mis pezones'),
  'perineum-massage': roles('Massage my partner’s perineum', 'Masajear el perineo de mi pareja', 'Receive perineum massage', 'Recibir masaje en el perineo'),
  'prostate-massage-manual': roles('Massage my partner’s prostate manually', 'Masajear manualmente la próstata de mi pareja', 'Receive manual prostate massage', 'Recibir masaje manual de próstata'),

  cunnilingus: roles('Perform cunnilingus', 'Hacer cunnilingus', 'Receive cunnilingus', 'Recibir cunnilingus'),
  fellatio: roles('Perform fellatio', 'Hacer una felación', 'Receive fellatio', 'Recibir una felación'),
  'deep-throat': roles('Deep-throat my partner', 'Hacer garganta profunda a mi pareja', 'Have my partner deep-throat me', 'Que mi pareja me haga garganta profunda'),
  'oral-teasing': roles('Tease my partner orally', 'Provocar oralmente a mi pareja', 'Receive oral teasing', 'Recibir provocación oral'),
  'oral-anal': roles('Perform anilingus / rimming', 'Hacer anilingus / rimming', 'Receive anilingus / rimming', 'Recibir anilingus / rimming'),
  'oral-nipples': roles('Stimulate my partner’s nipples orally', 'Estimular oralmente los pezones de mi pareja', 'Receive oral nipple stimulation', 'Recibir estimulación oral de pezones'),
  'oral-breasts': roles('Stimulate my partner’s breasts orally', 'Estimular oralmente el pecho de mi pareja', 'Receive oral breast stimulation', 'Recibir estimulación oral del pecho'),
  'oral-fingers': roles('Suck my partner’s fingers', 'Chupar los dedos de mi pareja', 'Have my fingers sucked', 'Que me chupen los dedos'),
  'oral-toes': roles('Suck my partner’s toes', 'Chupar los dedos de los pies de mi pareja', 'Have my toes sucked', 'Que me chupen los dedos de los pies'),

  'vaginal-penetration': roles('Penetrate my partner vaginally', 'Penetrar vaginalmente a mi pareja', 'Be penetrated vaginally', 'Recibir penetración vaginal'),
  'anal-penetration': roles('Penetrate my partner anally', 'Penetrar analmente a mi pareja', 'Be penetrated anally', 'Recibir penetración anal'),
  'shallow-penetration': roles('Use shallow penetration on my partner', 'Penetrar superficialmente a mi pareja', 'Receive shallow penetration', 'Recibir penetración superficial'),
  'deep-penetration': roles('Penetrate my partner deeply', 'Penetrar profundamente a mi pareja', 'Receive deep penetration', 'Recibir penetración profunda'),
  'slow-penetration': roles('Penetrate my partner slowly', 'Penetrar lentamente a mi pareja', 'Receive slow penetration', 'Recibir penetración lenta'),
  'rough-penetration': roles('Use intense penetration on my partner', 'Penetrar intensamente a mi pareja', 'Receive intense penetration', 'Recibir penetración intensa'),
  'fisting-vaginal': roles('Perform vaginal fisting on my partner', 'Hacer fisting vaginal a mi pareja', 'Receive vaginal fisting', 'Recibir fisting vaginal'),
  'fisting-anal': roles('Perform anal fisting on my partner', 'Hacer fisting anal a mi pareja', 'Receive anal fisting', 'Recibir fisting anal'),
  'prostate-penetration': roles('Use prostate-focused penetration on my partner', 'Penetrar a mi pareja buscando estimular la próstata', 'Receive prostate-focused penetration', 'Recibir penetración orientada a la próstata'),
  'cervix-contact': roles('Use deep penetration with cervical contact', 'Penetrar profundamente buscando contacto cervical', 'Receive penetration with cervical contact', 'Recibir penetración con contacto cervical'),

  'spitting-on-body': roles('Spit on my partner’s body', 'Escupir sobre el cuerpo de mi pareja', 'Be spat on', 'Que escupan sobre mi cuerpo'),
  'spitting-in-mouth': roles('Spit into my partner’s mouth', 'Escupir en la boca de mi pareja', 'Receive saliva in my mouth', 'Recibir saliva en mi boca'),
  drooling: roles('Drool onto my partner', 'Babear sobre mi pareja', 'Have my partner drool on me', 'Que mi pareja babee sobre mí'),
  'semen-on-face': roles('Ejaculate on my partner’s face', 'Eyacular sobre la cara de mi pareja', 'Receive semen on my face', 'Recibir semen en la cara'),
  'semen-on-breasts': roles('Ejaculate on my partner’s chest', 'Eyacular sobre el pecho de mi pareja', 'Receive semen on my chest', 'Recibir semen en el pecho'),
  'semen-on-buttocks': roles('Ejaculate on my partner’s buttocks', 'Eyacular sobre los glúteos de mi pareja', 'Receive semen on my buttocks', 'Recibir semen en los glúteos'),
  'semen-in-mouth': roles('Ejaculate into my partner’s mouth', 'Eyacular en la boca de mi pareja', 'Receive semen in my mouth', 'Recibir semen en mi boca'),
  swallowing: roles('Swallow my partner’s semen', 'Tragar semen de mi pareja', 'Have my partner swallow my semen', 'Que mi pareja trague mi semen'),
  'urine-play': roles('Urinate on my partner', 'Orinar sobre mi pareja', 'Be urinated on', 'Que orinen sobre mí'),
  'urine-drinking': roles('Drink my partner’s urine', 'Beber la orina de mi pareja', 'Have my partner drink my urine', 'Que mi pareja beba mi orina'),
  'blood-play': roles('Use blood with my partner', 'Usar sangre con mi pareja', 'Have blood used with me', 'Que usen sangre conmigo'),
  'sweat-licking': roles('Lick sweat from my partner', 'Lamer el sudor de mi pareja', 'Have my sweat licked', 'Que laman mi sudor'),
  'food-body-play': roles('Put food on my partner’s body', 'Poner comida sobre el cuerpo de mi pareja', 'Have food used on my body', 'Que usen comida sobre mi cuerpo'),
  'oil-body-play': roles('Use body oil on my partner', 'Usar aceite corporal sobre mi pareja', 'Have body oil used on me', 'Que usen aceite corporal sobre mí'),
};

export function applyRoleWordingOverrides(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  return content.map((category) => ({
    ...category,
    practices: category.practices.map((practice) => ({
      ...practice,
      ...(DIRECTED_ROLE_WORDING[practice.id]
        ? { roleLabels: { ...practice.roleLabels, ...DIRECTED_ROLE_WORDING[practice.id] } }
        : {}),
    })),
  }));
}

function roles(
  giveEn: string,
  giveEs: string,
  receiveEn: string,
  receiveEs: string,
): CatalogueRoleLabelsSeed {
  return {
    give: { en: giveEn, es: giveEs },
    receive: { en: receiveEn, es: receiveEs },
  };
}
