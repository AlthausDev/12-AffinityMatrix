# Architecture

This document defines the dependency boundaries for the MVP and the extension points that should remain stable as the application grows.

## Dependency direction

```text
app -> application -> domain
infrastructure -> application/domain
```

The domain must not depend on Angular, browser APIs, persistence, routing, or presentation details. The application layer defines use cases and ports. Infrastructure implements those ports. Angular is the composition and presentation layer.

`npm run architecture:check` enforces these layer dependencies and rejects direct browser-global access from domain/application code. CI runs this check before unit tests and the production build.

## Current patterns

### Repository

`ProfileRepository` is asynchronous by contract. The current local-storage adapter can therefore be replaced by IndexedDB or another asynchronous local adapter without rewriting use cases. Writes use optimistic concurrency through the profile `revision`. UI-originated mutations are serialized in `ProfileStore` so rapid local interactions do not create artificial stale writes.

### Application services

`ProfileService` owns profile use cases. `QuestionnaireService` projects a versioned catalogue and profile into category and question views. UI stores adapt these use cases to Angular Signals.

### Factory and ports

`ProfileFactory` creates and restores profiles through explicit `IdGenerator`, `Clock`, and catalogue-version inputs, keeping application rules deterministic and browser-independent.

### Strategy

Question visibility, question-scope expansion, and role compatibility are policies:

- `QuestionVisibilityPolicy`
- `QuestionScopePolicy`
- `RoleCompatibilityPolicy`

`QuestionScopePolicy` expands context axes declared by a catalogue role into answer scopes. The current real axis is `counterpartSex`. New axes should be added only for demonstrated product cases, and should extend this policy rather than duplicate practices or add component-specific branching.

### Validation and migrations

`Validator<T>` supplies the common validation contract. `ProfileDataValidator<T>` supplies shared profile-data invariants. Persisted and imported data are validated at boundaries.

Local storage and portable formats are independently versioned. Current portable codes are P4; P1, P2, and P3 remain migration inputs. P3 answers are preserved without inventing a relational scope that the old data did not contain.

## Aggregate boundaries

### Profile

A profile contains local identity, optimistic-concurrency revision, profile schema version, catalogue version, metadata, local settings, explicit answers, and timestamps.

A `PracticeAnswer` separates these concepts:

```text
practice + semantic role + relational scope -> preference + optional details
```

The role describes what the profile owner does or experiences. `AnswerScope` qualifies the relational context in which the same role is valued. For example, `counterpartSex` can hold different preferences for the same role with a man and with a woman without creating duplicate practices or role ids.

Canonical answer keys are produced only by `createAnswerKey()`. Callers must not construct scoped keys directly. Scope fields are serialized in a stable order so persistence, export, questionnaire progress, and comparison share one identity rule.

Local settings, identity, revision, and timestamps are excluded from portable profiles. Sex and orientation are excluded from exports by default and require an explicit export option. Portable transport is encoded and checksummed, not encrypted.

### Catalogue

Stable practice and role identifiers must survive label changes. Profiles record `catalogueVersion` independently of schema version. Catalogue snapshots are historical: once shipped, their version semantics must not change.

Catalogue v2 introduces role-declared `counterpartSex` axes while preserving v1 practice and role ids. A future comparison engine must evaluate each scoped answer against the other profile's own sex; the two profiles' `counterpartSex` values are not expected to be equal.

## Versioning rules

Five concepts evolve independently:

1. Profile schema version.
2. Profile revision.
3. Catalogue version.
4. Store version.
5. Portable format version.

Historical DTOs, snapshots, and migrations must use historical constants rather than mutable current-version constants.

## Scalability boundaries

The MVP intentionally avoids a backend. Expected extension points include IndexedDB persistence, larger static catalogues, comparison policies, category statistics, optional encryption/compression, new answer details, justified relational scope axes, and richer local summaries.

## Non-goals

Do not reserve infrastructure for chat, public profiles, discovery, feeds, followers, social graphs, or other social-network features.

## Design rule

Prefer composition by default. Use inheritance when subclasses genuinely share a stable behavioral contract and must be substitutable for the base type. Patterns are boundaries for change, not an objective by themselves.
