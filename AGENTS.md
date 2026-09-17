# Insurance Report Frontend - Codex Rules

## Goal
Preserve the current Vue 3 structure and keep UI code simple, report rendering deterministic, and backend access replaceable through the API layer.

## Non-negotiable rules
1. Preserve the current structure: `features / api / report / shared / router / styles`.
2. Pages coordinate UI state; reusable UI belongs in components; pure transformations belong in `.js` utilities.
3. All backend HTTP access goes through `src/api`. Do not call `fetch` directly from feature/report components.
4. The `report` area renders validated Report JSON. Do not put backend analysis/business rules into Vue components.
5. Keep components focused. Split when a component owns unrelated state, network behavior, and presentation at once.
6. Prefer clear domain names over `data`, `info`, `item2`, `temp`, `handler`.
7. Do not add state libraries, UI frameworks, or TypeScript without an explicit task.
8. Do not edit `dist` or `node_modules`.
9. Do not silently change the Report JSON contract; update validator/tests together.

## Naming
- Components: `PascalCase.vue` with domain/role names.
- Functions/variables: `camelCase`, verbs for functions, nouns for values.
- Booleans: `is/has/can/should`.
- Event handlers should express intent: `submitAnalysis`, `removeHealthFile`, not `handleClick2`.
- Collections use plural names.

## Dependency direction
`router -> features -> api/shared/report`

`report -> report components/utils`

Keep network/vendor knowledge inside `api`; keep rendering independent from transport.

## Before finishing a change
- Reuse existing components/styles before introducing new abstractions.
- Add/update Vitest tests for pure rules/validators/utilities.
- Run `npm test` and `npm run build`.
- Remove debug code and unused imports.
- Summarize contract changes explicitly.
