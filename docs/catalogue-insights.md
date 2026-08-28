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

The first ten questionnaire categories are fully organised into subcategories and semantically tagged against the final Catalogue V3 projection:

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

The shared vocabulary includes emotional and interaction signals such as connection, tenderness, romance, sensuality, intensity, pace, spontaneity and playfulness; broader signals such as exploration, visibility, power exchange and group/social context; visual/role-oriented signals such as `aesthetic-presentation` and `role-immersion`; and `reciprocity`, introduced for the manual-stimulation migration to distinguish coordinated or mutually shared participation from emotional connection. Oral sex and penetration reuse the existing vocabulary rather than introducing category-specific signals; giving and receiving are represented by role perspective instead. Penetration additionally demonstrates the distinction between semantic intensity, exploratory complexity and explicit pace without turning anatomical routes into profile dimensions.

The sexual-position migration expands the final catalogue from 12 to 20 distinct body arrangements while avoiding minor-name variants. It introduces the reusable `physicality` signal for experiences where strength, balance, flexibility or active body coordination matter independently from roughness or intensity. Existing positions and the new face-to-face, prone, kneeling, butterfly, T, wheelbarrow, standing-carry and bridge variants are all tagged using that shared vocabulary.

The toy migration keeps the existing 31 final practices rather than adding near-duplicate devices. It organises them into seven families: vibrators and remote stimulation; dildos and penetrative toys; anal and prostate toys; strap-ons and wearable penetration; penis toys and masturbators; suction, pelvic-floor and sensation toys; and machines, furniture and positioning. No toy-specific insight dimension is introduced: the existing shared signals are enough to distinguish sensory intensity, experimentation, reciprocity, playful or partner-controlled use, role-oriented accessories and equipment with a meaningful physical component.

The orgasm-control migration keeps the 11 final practices and groups them into edging/delay/denial, altered climax/overstimulation and orgasm patterns/coordination. Existing signals distinguish prolonged control from intensity, negotiated power and reciprocal synchronisation without creating an orgasm-specific profile axis.

The body-focus migration organises 53 final preferences into seven reviewable groups covering face and hair; torso, build and stature; limbs, abdomen and buttocks; genitals and pubic traits; body hair, scent and sweat; underwear; and tattoos/piercings. These entries reuse sensuality, aesthetic presentation, exploration and occasional physicality/intensity where appropriate. Anatomical targets and visual traits remain catalogue content rather than becoming one semantic signal per body part.

The eventual UI may combine several semantic signals into user-facing bars or metrics. The chart model is intentionally not fixed yet, and category migration remains independent from saved answer identity.
