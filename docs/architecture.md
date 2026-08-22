# Architecture

This document defines the dependency boundaries for the MVP and the extension points that should remain stable as the application grows.

## Dependency direction

```text
app -> application -> domain
infrastructure -> application/domain
```

The domain must not depend on Angular, browser APIs, persistence, routing, or presentation details. The application layer defines use cases and ports. Infrastructure implements those ports. Angular is the composition and presentation layer.

`npm run architecture:check` enforces these layer dependencies and rejects direct browser-global access from domain/application code. CI runs this check before unit tests and the production build. Catalogue V3 content lives under `infrastructure/catalogue/v3/content`, so its dependencies are covered by the same mechanical architecture guard rather than living in an unguarded source root.

## Current patterns

### Repository

`ProfileRepository` is asynchronous by contract. The current local-storage adapter can therefore be replaced by IndexedDB or another asynchronous local adapter without rewriting use cases. Writes use optimistic concurrency through the profile `revision`. UI-originated mutations are serialized in `ProfileStore` so rapid local interactions do not create artificial stale writes.

### Application services

`ProfileService` owns profile use cases. `QuestionnaireService` projects a versioned catalogue and profile into category and question views. `ComparisonService` exposes the pure profile-comparison engine to presentation code. UI stores and pages adapt these use cases to Angular Signals.

Category hiding is a presentation concern. `QuestionnaireService` accepts excluded category ids for visible summaries and neighbour navigation, while direct category lookup and the comparison engine remain catalogue-complete. The selected hidden categories are stored per profile id in local UI preferences, not in the `Profile` aggregate or portable format.

### Factory and ports

`ProfileFactory` creates and restores profiles through explicit `IdGenerator`, `Clock`, and catalogue-version inputs, keeping application rules deterministic and browser-independent.

### Strategy

Question visibility, question-scope expansion, role compatibility, and preference compatibility are policies:

- `QuestionVisibilityPolicy`
- `QuestionScopePolicy`
- `RoleCompatibilityPolicy`
- `PreferenceCompatibilityPolicy`

`QuestionScopePolicy` expands context axes declared by a catalogue role into answer scopes. Catalogue V3 uses `counterpartSex` and `targetSite`; multiple declared axes are expanded as a deterministic cartesian product. New axes should be added only for demonstrated product cases and should extend this policy rather than duplicate practices or add component-specific branching.

`targetSite` is intentionally data-driven. A role declares the target sites it supports and whether the anatomical target is the profile owner or the partner. This lets one toy practice represent solo use, use on a partner, and partner-on-self use without multiplying catalogue ids.

Preference comparison semantics are centralized in `PREFERENCE_COMPARISON_DESCRIPTORS` and `PreferenceCompatibilityPolicy`. Catalogue growth does not require editing the comparison engine: new categories, practices, role labels, and compatible role pairs are consumed directly from catalogue data. New scope semantics require engine changes only when they alter what constitutes the same interaction; Catalogue V3 matches target-site scoped answers only when their target sites agree.

### Validation and migrations

`Validator<T>` supplies the common validation contract. `ProfileDataValidator<T>` supplies shared profile-data invariants. Persisted and imported data are validated at boundaries.

Local storage and portable formats are independently versioned. Current portable codes are P6; P1 through P5 remain accepted migration inputs. Catalogue V3 was introduced while the application was still private development software with test-only answers. The V5 -> V6 local migration therefore preserves profile identity, metadata, settings, and timestamps but deliberately clears old answers rather than guessing mappings from the former coarse catalogue. Legacy P1-P5 portable codes similarly preserve useful metadata while discarding development-catalogue answers when converted to P6.

## Aggregate boundaries

### Profile

A profile contains local identity, optimistic-concurrency revision, profile schema version, catalogue version, metadata, local settings, explicit answers, and timestamps.

A `PracticeAnswer` separates these concepts:

```text
practice + semantic role + answer scope -> preference + optional details
```

The current preference model contains six explicit states: `favorite`, `like`, `depends`, `curious`, `not-interested`, and `boundary`. Unanswered is deliberately not a preference value. `not-interested` means lack of interest without declaring a boundary; `boundary` is a firm no and is handled separately by comparison.

The role describes what the profile owner does or experiences. `AnswerScope` qualifies the context in which the same role is valued. `counterpartSex` can hold different preferences for interacting with a man and a woman. `targetSite` can independently represent, for example, mouth, vaginal, or anal use of the same dildo role. These dimensions qualify an answer without creating duplicate practice ids.

Canonical answer keys are produced only by `createAnswerKey()`. Callers must not construct scoped keys directly. Scope fields are serialized in a stable order (`counterpartSex`, then `targetSite`) so persistence, export, questionnaire progress, and comparison share one identity rule.

Local UI preferences, identity, revision, and timestamps are excluded from portable profiles. Sex and orientation are excluded from exports by default and require an explicit export option. Portable transport is encoded and checksummed, not encrypted.

### Catalogue

Stable practice and role ids survive label-only changes. A semantic split may retire an old role id, but it must never silently reinterpret that id. Once the application leaves its private-development migration window, historical answers must remain preserved as unknown data until an explicit safe migration exists.

Profiles record `catalogueVersion` independently of schema version. Catalogue snapshots are historical: once shipped, their question semantics and version numbers must not change.

Catalogue V2 introduced role-declared `counterpartSex` axes. Catalogue V3 expands the catalogue to 17 ordered categories and a broad modular practice set, and adds role-declared `targetSite` values plus `targetOwner`. The static V3 seed is split into thematic modules under infrastructure and is transformed into the domain `CatalogueSnapshot` by shared practice builders. Future catalogue expansion should normally be a data addition, not a questionnaire-component change.

The category order is editorial, from softer/general intimacy toward more intense/edge practices. It is not a risk score. Risk or safety classification, if introduced later, must be modelled as a separate explicit concept.

## Comparison engine

The comparator is catalogue-driven. It iterates the catalogue's `compatibleRolePairs`; Angular components do not know which roles complement each other and no practice-specific switch exists in the engine.

For counterpart-scoped roles, each answer is resolved against the other profile's own sex. The two answers' `counterpartSex` values are therefore not expected to equal each other. For example, a woman's `counterpartSex: male` answer complements a man's `counterpartSex: female` answer.

For target-site scoped roles, compatible role answers must describe the same `targetSite`. A vaginal preference cannot accidentally interact with an anal preference merely because the practice and semantic roles are otherwise compatible.

The engine compares only explicit answers. Missing answers are excluded rather than coerced into a preference. Mutual role pairs are evaluated once; directional role pairs are evaluated in both orientations so reciprocal preferences remain independent.

Category affinity is the arithmetic mean of centralized preference-alignment scores for answered catalogue-compatible interactions in that category. There is deliberately no overall relationship percentage. Hard boundaries are reported separately and are excluded from the affinity denominator rather than being represented as a compatibility penalty. `not-interested` remains a scored lack of shared interest because it is not equivalent to a hard boundary.

`ComparisonSubject` is deliberately smaller than the local `Profile` aggregate. A local profile satisfies it structurally, and a future in-memory portable/imported profile can also satisfy it without being persisted. This keeps compare-without-saving as a presentation/input concern rather than a second comparison engine.

Comparison results are language-neutral. They expose stable category, practice, and role ids plus comparison classifications; they do not carry localized labels. The presentation layer resolves those ids through the current catalogue and localization resources.

Category visibility preferences do not participate in comparison. Hiding a questionnaire category changes navigation and visible completion only; it does not redefine the catalogue or erase existing answers.

## Localization

Localization is an Angular/presentation concern. Domain, application, persistence, portable formats, and comparison rules must not depend on a language or produce localized labels as part of their contracts.

The MVP supports Spanish and English. Spanish is the default development/runtime locale, while the language selector can switch locale at runtime. The selected locale is a local UI preference only; it is not part of `Profile`, local profile schema, comparison data, or portable exports.

UI text uses semantic, typed translation keys. Spanish defines the canonical `TranslationKey` set and the English resource must satisfy the same key set at compile time. Interpolated values use named parameters, and plural-sensitive messages go through the localization service instead of manual string concatenation.

Catalogue V1/V2 snapshots deliberately keep historical fallback labels and use the historical catalogue translation tables. Catalogue V3 uses a bilingual static seed as the single source for category and practice labels, avoiding three synchronized copies of a large catalogue. `CatalogueTextService` resolves V3 labels from that seed and retains the old translation resources only as historical fallbacks.

Tests require every V3 category and practice seed to contain non-empty Spanish and English text. Role labels are centralized by semantic role id. Therefore ordinary catalogue growth requires extending the appropriate content module and does not require questionnaire or comparison changes unless a genuinely new semantic role/scope concept is introduced.

Human-readable validation and UI messages belong in localization resources. Lower layers should expose stable states, ids, classifications, or typed errors whenever presentation needs to explain a result.

Preference presentation metadata is centralized separately from comparison semantics. Labels, hints, symbols, and semantic visual tones are mapped once and reused by questionnaire/comparison presentation. Color is never the only indicator of a preference state.

## Versioning rules

Five concepts evolve independently:

1. Profile schema version.
2. Profile revision.
3. Catalogue version.
4. Store version.
5. Portable format version.

Historical DTOs, snapshots, and migrations must use historical constants rather than mutable current-version constants.

Current development contracts are Catalogue V3, Profile schema V6, Store V6, and portable P6.

## Scalability boundaries

The MVP intentionally avoids a backend. Expected extension points include IndexedDB persistence, larger static catalogues, additional comparison policies, category statistics, optional encryption/compression, new answer details, justified relational scope axes, richer local summaries, and additional presentation locales.

A catalogue expansion should normally require changes only to the relevant static content module and validation/tests. Comparison code should change only when a new semantic concept is introduced, such as a new preference state, a new relational scope axis, or a genuinely different compatibility rule.

## Non-goals

Do not reserve infrastructure for chat, public profiles, discovery, feeds, followers, social graphs, or other social-network features.

## Design rule

Prefer composition by default. Use inheritance when subclasses genuinely share a stable behavioral contract and must be substitutable for the base type. Patterns are boundaries for change, not an objective by themselves.
