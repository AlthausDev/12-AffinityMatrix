# Catalogue insight signals (0.2 foundation)

The catalogue can attach hidden semantic signals to stable practice ids without changing answer identity, profile persistence, comparison semantics or export format.

These signals are groundwork for a future **orientative** trends/profile view. They are not a psychological assessment and they do not score a user by themselves.

## Principles

- `practiceId + roleId + scope` remains the identity of an answer.
- Subcategories organise the questionnaire; insight signals describe semantic qualities of a practice.
- Moving a practice between subcategories does not affect its saved answers or insight signals.
- Signal strength describes how strongly a practice represents a trait, not how the user feels about it.
- A negative answer must not automatically imply preference for an opposite trait.
- Future scoring should combine preference, coverage/confidence, semantic signals and role perspective explicitly.
- Semantic tags should be reusable across categories rather than mirror one questionnaire group or one specific practice.

## Current migration

All twenty-two questionnaire categories are now organised into subcategories and semantically tagged against the final Catalogue V3 projection:

- `Afecto e intimidad`
- `Estilo, ritmo y ambiente sexual`
- `Ropa, apariencia y lencería`
- `Estimulación manual y masturbación`
- `Sexo oral`
- `Penetración`
- `Posturas sexuales`
- `Juguetes sexuales`
- `Orgasmo, teasing y control sexual`
- `Fetiches y foco corporal`
- `Parejas, grupos y composición`
- `Escenarios y roleplay`
- `Exhibicionismo, voyeurismo y grabación`
- `Lugares y entornos`
- `Dominación, sumisión y disciplina`
- `Ataduras y restricción`
- `Juego psicológico`
- `Sensaciones e impacto`
- `Fluidos, sustancias y juegos corporales`
- `Fantasías tabú`
- `Surrealismo y fantasías imposibles`
- `Edge / prácticas de alta intensidad`

The shared vocabulary includes emotional and interaction signals such as connection, tenderness, romance, sensuality, intensity, pace, spontaneity and playfulness; broader signals such as exploration, visibility, anonymity, power exchange and group/social context; visual/role-oriented signals such as `aesthetic-presentation` and `role-immersion`; and `reciprocity`, introduced for the manual-stimulation migration to distinguish coordinated or mutually shared participation from emotional connection. Giving and receiving remain represented by role perspective rather than by duplicating semantic tags.

The sexual-position migration expands the final catalogue from 12 to 20 distinct body arrangements while avoiding minor-name variants. It introduces the reusable `physicality` signal for experiences where strength, balance, flexibility or active body coordination matter independently from roughness or intensity.

The toy migration keeps the existing 31 final practices rather than adding near-duplicate devices. It organises them into seven families and reuses the shared vocabulary rather than introducing toy-specific profile axes.

Orgasm control keeps 11 final practices in three groups. Body focus organises 53 final preferences into seven reviewable groups without turning anatomical targets into one semantic signal per body part. Partners/groups keeps 17 final practices across small groups, larger scenes, swinging/exchange and third-person relationship dynamics.

Roleplay keeps the 23 practices in the final projection after taboo premises and impossible fantasies were moved into their own categories. Exhibitionism keeps 8 visual/recording practices, while places/settings keeps the 12 location-based practices previously separated from it. `anonymity` remains distinct from visibility and can therefore represent concealed identity or reduced personal identification without treating every exposed scene as anonymous.

Power keeps 24 practices and introduces `structure` for explicit rules/protocol/training and `service-orientation` for service-centred dynamics. Restraint keeps 34 practices and introduces `physical-restraint` for reduced movement/confinement and `sensory-restriction` for deliberately reduced sensory access; higher-intensity suspension, predicament, long-duration and vacuum practices remain in Edge rather than being duplicated.

The final migration completes six categories at once. Psychological play keeps 22 practices across praise/worship, humiliation/objectification, verbal dynamics and anticipation/fear/mind games. Sensation play keeps 29 practices across impact, rough touch/pressure, temperature/electrical sensation and broader sensory modulation. Fluids keeps 29 final practices, including the later `squirting-on-partner` addition, grouped by saliva, semen, internal sexual fluids, higher-taboo bodily fluids and other body-applied substances. Taboo fantasies keep 12 adult fictional or pre-agreed entries, while surrealism keeps 10 explicitly impossible fictional fantasies. Edge keeps 22 higher-intensity practices, including the final `pussy-torture` replacement for the retired generic `genital-torture` entry.

Three reusable signals are added by this final pass because the remaining categories expose distinctions not captured by generic intensity or exploration: `pain-sensation` for pain/impact/pressure-focused sensation across Sensation and Edge; `transgression` for socially forbidden or deliberately provocative framing across fluids and taboo fantasy; and `fantasy-imagination` for imagined or impossible premises across taboo, surrealism and selected Edge fantasies. These remain semantic qualities of practices rather than questionnaire-category labels.

The large established data sets are split into `core` and final-pass modules while the public `catalogue-taxonomy.ts` and `catalogue-insights.ts` exports stay unchanged. This keeps future maintenance reviewable without changing persistence, comparison, exports or practice identity.

The eventual UI may combine several semantic signals into user-facing bars or metrics. The chart model is intentionally not fixed yet, and category migration remains independent from saved answer identity.
