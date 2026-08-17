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
- Support explicit preference states, including contextual/conditional answers.
- Store profiles locally in the browser without requiring an account.
- Export and import profiles through a portable serialized representation.
- Compare two profiles by matching complementary roles and responses.
- Show category-level affinity based on comparable answered pairs.
- Keep optional answer details available without making the questionnaire cumbersome.

## Privacy model

The application is designed to work without a backend for the MVP.

Profiles remain on the user's device unless they are explicitly exported or shared. No account, remote profile database, analytics, or tracking is required for the core workflow.

## Planned stack

- Angular 22
- TypeScript 6
- Angular Signals
- Signal Forms
- Angular Router
- CSS
- Vitest
- Browser local storage for the initial persistence layer

Domain logic will remain framework-independent TypeScript where practical, keeping comparison, filtering, serialization, and profile rules separate from the UI.

## Development approach

The project will be developed incrementally:

1. Validate the domain model and questionnaire flow.
2. Implement local profile persistence and portability.
3. Implement profile comparison and category affinity.
4. Refine UX and accessibility.
5. Add richer visual summaries only after the core workflow is stable.

## License

Licensed under the [MIT License](LICENSE).
