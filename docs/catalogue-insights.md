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

The first four questionnaire categories are fully organised into subcategories and semantically tagged against the final Catalogue V3 projection:

- `Afecto e intimidad`
- `Estilo, ritmo y ambiente sexual`
- `Ropa, apariencia y lencería`
- `Estimulación manual y masturbación`

The shared vocabulary includes emotional and interaction signals such as connection, tenderness, romance, sensuality, intensity, pace, spontaneity and playfulness; broader signals such as exploration, visibility, power exchange and group/social context; visual/role-oriented signals such as `aesthetic-presentation` and `role-immersion`; and `reciprocity`, introduced for the manual-stimulation migration to distinguish coordinated or mutually shared participation from emotional connection.

The eventual UI may combine several semantic signals into user-facing bars or metrics. The chart model is intentionally not fixed yet, and category migration remains independent from saved answer identity.
