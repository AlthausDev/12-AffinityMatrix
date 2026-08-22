# 12-AffinityMatrix

> Working title. The project name may change as the product evolves.

A local-first web application for creating structured preference profiles, moving them between devices, and comparing two profiles in a clear and privacy-conscious way.

## Status

**MVP — early development**

The first milestone focuses on validating the core workflow before investing in advanced presentation or visual analytics.

## MVP goals

- Create and edit local profiles.
- Navigate the questionnaire by category instead of using a single long page.
- Optionally use basic profile metadata to filter irrelevant questions.
- Support explicit preference states and optional contextual detail.
- Store profiles locally in the browser without requiring an account.
- Export and import profiles through a portable, versioned representation.
- Compare two profiles by matching explicitly compatible roles and responses.
- Show category-level affinity based on comparable answered pairs.
- Ship the interface and catalogue in Spanish and English.

## Privacy model

The MVP has no backend, account system, remote profile database, analytics, or tracking requirement. Profiles stay in browser storage unless the user explicitly exports them.

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
- Typed presentation resources for Spanish/English localization, with catalogue translations derived from stable ids.

The detailed dependency rules, aggregate boundaries, versioning rules, localization rules, and extension points are documented in [docs/architecture.md](docs/architecture.md).

The model is intended to remain extensible for richer questionnaires, comparison rules, visual summaries, additional languages, and additional local transports. Chat, public discovery, feeds, and social-network features are intentionally outside the product direction.

## Planned stack

- Angular 22
- TypeScript 6
- Angular Signals and Signal Forms
- Angular Router
- CSS
- Vitest
- Browser local storage for the initial persistence layer

## Development approach

The project is developed incrementally: validate domain and questionnaire behavior first, then persistence/portability, comparison, localization/UX/accessibility, and finally richer visual summaries.

## License

Licensed under the [MIT License](LICENSE).
