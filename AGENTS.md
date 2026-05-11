# AGENTS.md — sokos-up-dare

## About the application

`sokos-up-dare` is a microfrontend in the **Utbetalingsportalen** (Payment Portal) used for testing payment order calculations in Nav's 
modernisation project. It lets developers and testers submit oppdrag XML to the calculation API and view the results in a table.

It has two main features:
- **Beregne** – paste raw oppdrag XML, select a calculation period, and submit to the backend
- **Oppdragstester** – form-based order builder with tax deduction, rate, dates, and deduction lines; generates XML automatically

The frontend is built with React/TypeScript and uses the Aksel Design System. It is served as a microfrontend inside an **Astro** host application and runs with a Node.js server acting as a proxy to the backend API.

## Build & Test Commands

```bash
pnpm test           # Run tests
pnpm build          # Build
pnpm lint           # Lint
```
3
## Project Structure

```text
dokumentasjon/
mock/
playwright-report/
playwright-tests/
public/
server/
src/
test-results/
```

## Code Style

### Minimal Editing

When fixing a bug or implementing a feature, change only what is necessary.
Do not rename variables, restructure working code, or refactor beyond the task at hand.
Keep diffs small and focused so they are easy to review.

## Git Workflow

<!-- TODO: Document your branching and merge strategy -->

## Boundaries

### ✅ Always

- Run tests after changes
- Follow existing code patterns in the project
- Preserve existing code structure — do not reorganize or refactor beyond the task
- Validate all external input

### ⚠️ Ask First

- Changing authentication mechanisms
- Adding new dependencies
- Modifying database schema

### 🚫 Never

- Commit secrets or credentials
- Attempt to circumvent access restrictions
- Skip input validation on external boundaries
