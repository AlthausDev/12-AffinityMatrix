# DesireSync

A local-first web application for exploring intimate preferences, creating structured profiles, and comparing two profiles privately and clearly.

## Product direction

DesireSync is deliberately a focused tool rather than a social network. Profiles are created and stored locally, can be exported or imported through a portable versioned representation, and can be compared using catalogue-defined compatibility rules.

The product may gain additional convenience features over time, including richer local persistence or optional synchronization, but public discovery, feeds, chat, dating-style matching, and social-network features are outside the current direction.

## Current capabilities

- Create and edit local profiles.
- Navigate the questionnaire by category instead of using a single long page.
- Optionally use basic profile metadata to filter irrelevant questions.
- Support explicit preference states and optional contextual detail.
- Store profiles locally in the browser without requiring an account.
- Export and import profiles through a portable, versioned representation.
- Compare two profiles by matching explicitly compatible roles and responses.
- Show category-level affinity based on comparable answered pairs.
- Ship the interface and catalogue in Spanish and English, with localization structured to support additional languages.

## Privacy model

DesireSync currently has no backend, account system, remote profile database, analytics, or tracking requirement. Profiles stay in browser storage unless the user explicitly exports them.

Local storage is **not encryption**. A person with access to the same browser profile may be able to inspect locally stored data, and exported profile codes must be treated as private data. Portable codes use encoding, versioning, and an integrity checksum; those mechanisms do not provide secrecy.

## Architecture

The project keeps domain rules independent from Angular and browser APIs. The current structure uses a small set of patterns where they provide a concrete boundary rather than adding ceremony:

- Repository for profile persistence.
- Application service for profile use cases and transactional updates.
- Factory plus clock/id ports for profile creation and restoration.
- Strategy policies for questionnaire visibility and role compatibility.
- Inherited validators for shared profile invariants.
- Versioned migrations for local persistence and portable profile formats.
- Angular stores as UI state adapters rather than domain services.
- Typed presentation resources for localization, with catalogue translations derived from stable ids.

The detailed dependency rules, aggregate boundaries, versioning rules, localization rules, and extension points are documented in [docs/architecture.md](docs/architecture.md).

## Stack

- Angular 22
- TypeScript 6
- Angular Signals and Signal Forms
- Angular Router
- CSS
- Vitest
- Browser local storage for the current persistence layer

## Development approach

The project is developed incrementally, keeping catalogue semantics, profile portability, comparison behavior, backwards compatibility, localization, and UI presentation independently maintainable.

## License

Licensed under the [MIT License](LICENSE).
