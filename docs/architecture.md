# Architecture

This document defines the dependency boundaries for the MVP and the extension points that should remain stable as the application grows.

## Dependency direction

```text
               ┌────────────────────┐
               │        app         │
               │ Angular UI + state │
               └─────────┬──────────┘
                         │
                         ▼
               ┌────────────────────┐
               │    application     │
               │ use cases + ports  │
               └─────────┬──────────┘
                         │
                         ▼
               ┌────────────────────┐
               │       domain       │
               │ rules + invariants │
               └────────────────────┘

               ┌────────────────────┐
               │   infrastructure   │
               │ browser adapters   │
               └─────────┬──────────┘
                         │ implements
                         ▼
                    application
                       ports
```

The domain must not depend on Angular, browser APIs, persistence, routing, or presentation details. The application layer may depend on the domain and defines use cases and ports. Infrastructure implements those ports. Angular is the composition and presentation layer; pages should consume application-facing abstractions instead of calling browser infrastructure directly.

`npm run architecture:check` enforces these layer dependencies and rejects direct browser-global access from domain/application code. CI runs this check before unit tests and the production build.

## Current patterns

### Repository

`ProfileRepository` isolates persistence and is asynchronous by contract. The MVP adapter uses local storage, but callers already model persistence as an operation that can take time. This keeps IndexedDB, file-backed storage, or another asynchronous local adapter substitutable without rewriting application use cases or UI flows.

Writes use optimistic concurrency. A local `revision` is incremented on every mutation and repositories receive the expected previous revision. Stale writes fail with `ProfileConcurrencyError` instead of silently replacing newer state. A future transactional repository can enforce the same contract atomically.

### Application Service

`ProfileService` owns profile use cases such as creation, metadata/settings updates, answer upserts, import, and deletion. UI stores adapt those asynchronous use cases to Angular Signals; they are not domain services.

### Factory and ports

`ProfileFactory` creates and restores profiles using `IdGenerator` and `Clock` ports and an explicit catalogue version. This removes direct dependencies on `crypto` and system time from application rules and keeps tests deterministic.

### Strategy

Question visibility and role compatibility are policies, not hard-coded UI branches:

- `QuestionVisibilityPolicy`
- `RoleCompatibilityPolicy`

A new filtering or matching rule can therefore be introduced without rewriting questionnaire or comparison components.

### Template Method / validator inheritance

`Validator<T>` defines common validation behavior. `ProfileDataValidator<T>` adds the shared profile-data rules, while concrete validators add local-profile or portable-profile invariants. Catalogue and persistence-envelope validators use the same validation contract.

External and persisted data are validated at boundaries. Version numbers are not a substitute for validating the payload.

### Version migration

Local storage and portable profile formats are independently versioned. Historical migrations use explicit historical version constants so a future schema bump cannot silently change the meaning of an old migration.

Portable code decoding uses version-specific decoder strategies. Current codes are P3; P1 and P2 remain explicit migration inputs. Adding another format should add a decoder/migration path instead of expanding one large conditional codec.

## Aggregate boundaries

### Profile

A profile contains:

- local identity;
- local optimistic-concurrency revision;
- profile schema version;
- catalogue version against which its answers are interpreted;
- portable metadata describing the profile;
- local presentation settings;
- explicit answers keyed by stable practice/role identifiers;
- timestamps.

Local settings, identity, revision, and timestamps are excluded from portable profile representations.

Sex and orientation are local filtering metadata and are excluded from exports by default. They may only be included through an explicit export option. Portable transport is Base64URL plus an integrity checksum; it is not encryption.

### Catalogue

The practice catalogue is treated as a coherent aggregate. Stable practice and role identifiers must survive label changes. Profiles record `catalogueVersion` independently of their schema version so unanswered data can later be distinguished from practices that did not exist in an older catalogue.

The comparison engine should consume catalogue compatibility rules. It must not infer compatibility solely from generic labels such as `active` and `receptive`.

## Versioning rules

Five concepts evolve independently:

1. **Profile schema version** — shape and invariants of a local profile.
2. **Profile revision** — optimistic-concurrency revision of one local document.
3. **Catalogue version** — question/role catalogue against which answers are interpreted.
4. **Store version** — browser persistence envelope and migration sequence.
5. **Portable format version** — representation exchanged between devices.

Do not reuse a mutable `CURRENT_VERSION` constant inside historical DTOs or migrations. A historical V2 type or migration must continue to mean V2 after V3 exists.

## Scalability boundaries

The MVP intentionally avoids a backend. Scalability here means being able to grow the local product without coupling unrelated responsibilities.

Expected extension points include:

- replacing local storage with IndexedDB behind the asynchronous `ProfileRepository`;
- loading a larger versioned catalogue from static data without changing profile rules;
- adding comparison policies and category statistics;
- adding compression or optional client-side encryption around the portable transport;
- adding new optional answer dimensions through versioned migrations;
- adding richer local summaries and visualizations.

## Non-goals

The architecture must not reserve infrastructure for chat, public profiles, discovery, feeds, followers, social graphs, or other social-network features. Those are outside the product direction. Avoid abstractions whose only justification is a hypothetical backend or social layer.

## Design rule

Prefer composition by default. Use inheritance when subclasses genuinely share a stable behavioral contract and must be substitutable for the base type. Patterns are boundaries for change, not an objective by themselves.
