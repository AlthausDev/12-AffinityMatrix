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

## Current patterns

### Repository

`ProfileRepository` isolates persistence. The MVP uses `LocalStorageProfileRepository`, but application services do not know or care whether the implementation is local storage, IndexedDB, an imported file, or another local persistence mechanism.

### Application Service

`ProfileService` owns profile use cases such as creation, metadata/settings updates, answer upserts, import, and deletion. UI stores adapt those use cases to Angular Signals; they are not domain services.

### Factory and ports

`ProfileFactory` creates and restores profiles using `IdGenerator` and `Clock` ports. This removes direct dependencies on `crypto` and system time from application rules and keeps tests deterministic.

### Strategy

Question visibility and role compatibility are policies, not hard-coded UI branches:

- `QuestionVisibilityPolicy`
- `RoleCompatibilityPolicy`

A new filtering or matching rule can therefore be introduced without rewriting questionnaire or comparison components.

### Template Method / validator inheritance

`Validator<T>` defines common validation behavior. `ProfileDataValidator<T>` adds the shared profile-data rules, while concrete validators add local-profile or portable-profile invariants. Catalogue validators use the same base contract.

External and persisted data are validated at boundaries. Version numbers are not a substitute for validating the payload.

### Version migration

Local storage and portable profile formats are independently versioned. Historical migrations use explicit historical version constants so a future schema bump cannot silently change the meaning of an old migration.

Portable code decoding uses version-specific decoder strategies. Adding another format should add a decoder/migration path instead of expanding one large conditional codec.

## Aggregate boundaries

### Profile

A profile contains:

- portable metadata describing the profile;
- local presentation settings;
- explicit answers keyed by stable practice/role identifiers;
- local identity and timestamps.

Local settings are deliberately excluded from the portable profile representation.

### Catalogue

The practice catalogue is treated as a coherent aggregate. Validation guarantees unique stable ids, deterministic category ordering, valid role definitions, valid applicability rules, and explicit compatibility pairs that reference existing roles.

The comparison engine should consume catalogue compatibility rules. It must not infer compatibility solely from generic labels such as `active` and `receptive`.

## Versioning rules

Three versions may evolve independently:

1. **Profile schema version** — shape and invariants of a local profile.
2. **Store version** — browser persistence envelope and migration sequence.
3. **Portable format version** — representation exchanged between devices.

Do not reuse a mutable `CURRENT_VERSION` constant inside historical DTOs or migrations. A historical V2 type must continue to mean V2 after V3 exists.

## Scalability boundaries

The MVP intentionally avoids a backend. Scalability here means being able to grow the local product without coupling unrelated responsibilities.

Expected extension points include:

- replacing local storage with IndexedDB behind `ProfileRepository`;
- loading a larger catalogue from static data without changing domain rules;
- adding comparison policies and category statistics;
- adding compression or optional client-side encryption around the portable transport;
- adding new optional answer dimensions through versioned migrations;
- adding richer local summaries and visualizations.

## Non-goals

The architecture must not reserve infrastructure for chat, public profiles, discovery, feeds, followers, social graphs, or other social-network features. Those are outside the product direction. Avoid abstractions whose only justification is a hypothetical backend or social layer.

## Design rule

Prefer composition by default. Use inheritance when subclasses genuinely share a stable behavioral contract and must be substitutable for the base type. Patterns are boundaries for change, not an objective by themselves.
