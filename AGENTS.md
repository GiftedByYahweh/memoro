# Instructions and Rules for Memoro Project

## 1. STRICT CONSTRAINTS (CRITICAL RULES)

### 1.1 Git Version Control

**The agent is STRICTLY FORBIDDEN from:**

1. Running `git commit`.
2. Running `git push`.
3. Creating or switching branches (`git checkout -b`, `git branch`, `git switch -c`).
4. Modifying git history or branch states in any other way.

> **All commits, pushes, and branch management are performed EXCLUSIVELY by the user.**
> The agent only creates, edits, and verifies code files and runs local tests/builds/docker.

### 1.2 Package & Dependency Management

- **NEVER install or add new packages autonomously.** If a new package or dependency is needed, the agent MUST explicitly ask the user and obtain confirmation before installing ("якщо є ті яких не вистачає — напиши, сам нічого не додавай").

### 1.3 Docker-First Environment

- All services run in Docker containers (Node 24 Alpine):
  - `postgres` on port `5433:5432`.
  - `server` on port `3000:3000`.
  - `client` on port `5174:5173`.

### 1.4 Zero Code Comments

- **STRICTLY FORBIDDEN: leaving comments in code.** Do not leave explanatory, decorative, temporary, or commented-out code (`//`, `/* */`, `<!-- -->`). Write clean, self-documenting code with meaningful names and strict types.

### 1.5 SVG Assets Isolation

- **SVG MUST ALWAYS be extracted into a separate `.svg` file.** Inlining `<svg>` markup directly inside Vue templates, HTML, or TS files is STRICTLY FORBIDDEN. Every icon and vector graphic must be stored in a dedicated `.svg` file and imported.

### 1.6 Prohibition of TypeScript `enum`

- **STRICTLY FORBIDDEN: using TypeScript `enum`.** Never declare or use `enum`. Always use `const ... as const` object dictionaries with union types derived via `(typeof Obj)[keyof typeof Obj]`, or string literal unions.

### 1.7 Prohibition of Magic Numbers and Magic Strings

- **STRICTLY FORBIDDEN: using magic numbers or magic strings** across both frontend and backend (`apps/server`, `apps/client`, `packages/shared`).
- All numeric limits, boundary values, timeouts, max lengths, status codes, route paths, cookie names, and domain constants MUST be extracted into explicitly named constants (`const ... as const` or `const SCREAMING_SNAKE_CASE`).
- Validation limits (e.g. min/max password length, max email length, max upload size) must live in shared constants in `@memoro/shared` so they can be reused identically across Zod schemas, OpenAPI/Swagger contracts, database definitions, and UI components.

---

## 2. Monorepo Architecture

- **npm workspaces**: `packages/shared`, `apps/server`, `apps/client`.
- **Shared package `@memoro/shared`**: contains shared types, DTOs, and Zod validation schemas. Consumed directly via TypeScript source (`./src/index.ts`).
- **Configuration standard**: Zero `.js` configuration files across the entire monorepo — all configs are in TypeScript (`.ts`) or JSON (`.json`).
- **Strict TypeScript**: Base tsconfig rules modeled after `kadr`:
  - `noUncheckedIndexedAccess: true`
  - `exactOptionalPropertyTypes: true`
  - `noPropertyAccessFromIndexSignature: true`
  - `verbatimModuleSyntax: true`

---

## 3. Backend Architecture (`apps/server`)

### 3.1 Infrastructure & Presentation Isolation

- **Fastify is isolated to the presentation/delivery layer**: Only `src/server.ts` and `index.ts` import Fastify.
- **Controllers / Route Handlers**: Handle ONLY transport work — parse/validate incoming requests via `FastifyRequest`, call the appropriate use case `execute()` method, and return the result using `FastifyReply`. Fastify objects (`FastifyRequest`, `FastifyReply`) must NEVER be passed down into use cases, domain services, or repositories.
- **Swagger Contracts in Separate Files**: Route schemas and Swagger/OpenAPI documentation MUST be written in separate files (e.g. `*.schema.ts` or `*.swagger.ts`) and attached to the route configuration. **STRICTLY FORBIDDEN: inlining Swagger contracts directly inside controller / route handler files.**
- **Manual Dependency Injection (Composition Root)**: All dependencies are wired explicitly in `src/container.ts` (`createAppContainer`). No magic DI frameworks.

### 3.2 Use Case Contract & Rules

- **Common Functional Type**: Every use case MUST implement the functional type `UseCase<TInput, TOutput>` (`src/common/use-case.ts`).
- **Factory Functions**: Use cases are created via factory functions `create<Action>UseCase(deps)`. Dependencies are captured via closure, eliminating `this.` and class boilerplate.
- **Direct Function Invocation**: Use cases are invoked directly as functions `await actionUseCase(input)`. No artificial `.execute()` method ceremony.
- **Size Constraint**: The code in any single use case MUST NOT exceed **350 lines of code**. Decompose complex operations into smaller services or domain helpers.
- **Dependency Injection**: All dependencies (repositories, unit of work, domain services) MUST be injected via factory function parameters.

### 3.3 Pure Domain Logic (`<feature>-service.ts`)

- If a feature has pure domain business logic (calculations, state transitions, validation rules, domain algorithms), it MUST be placed in `<feature>-service.ts` (e.g. `media-service.ts`, `auth-service.ts`).
- These service files MUST contain **pure TypeScript code** — zero imports of Fastify, database connections, or HTTP frameworks.

### 3.4 Common & Utilities

- Cross-cutting backend logic shared across multiple feature modules belongs in `src/common/`.
- General utility functions belong in `src/common/utils/`.

### 3.5 Database & Drizzle ORM

- Drizzle ORM and `pg` are isolated strictly within `src/db/` and repository implementations.
- Schema definitions live in `src/db/schema/*.ts` and are re-exported via `src/db/schema/index.ts`.
- Migrations live in `src/db/migrations/` and are managed via `drizzle-kit`.
- **No `BaseRepository`**: Generic base repositories are discarded. Each domain module implements its own specialized repository port.
- Repositories encapsulate Drizzle queries and MUST return mapped domain models, not raw Drizzle table schema types.
- **Transactions & UnitOfWork**: Atomic business transactions are managed via `UnitOfWork` using `AsyncLocalStorage` (`TxContext`). Domain use cases do not know about SQL or database connections.

### 3.6 Domain Errors & Validation

- Two-level validation: Zod on incoming request shapes, business logic rules in use cases.
- **`AppError`**: Pure domain error class in `src/common/error/app.error.ts`. It has NO HTTP status codes.
- HTTP status mapping is defined strictly in `src/common/error/http-status.map.ts` and utilized by the Fastify error handler in `src/server.ts`.

### 3.7 File Naming Conventions

- **STRICTLY FORBIDDEN: camelCase file names** across the backend (e.g. `cryptoService.ts`, `appError.ts`).
- All files in `apps/server` MUST use kebab-case with dot-separated role suffixes:
  - Services: `<name>.service.ts` or `<feature>-<name>.service.ts` (e.g. `crypto.service.ts`, `node-crypto.service.ts`, `auth.service.ts`)
  - Use cases: `<name>.use-case.ts` (e.g. `register.use-case.ts`, `login.use-case.ts`)
  - Repositories: `<name>.repository.ts` (e.g. `user.repository.ts`, `drizzle-user.repository.ts`)
  - Controllers: `<name>.controller.ts`
  - Route schemas: `<name>.schema.ts`
  - Guards: `<name>.guard.ts`
  - Routes: `<name>.routes.ts`
  - Infrastructure / DB / Utilities: `<name>.provider.ts`, `<name>.logger.ts`, `<name>.error.ts`, `<name>.map.ts`, `<name>.context.ts`, `<name>.ts`

---

## 4. Frontend Architecture (`apps/client`)

### 4.1 Layer Separation

Clear boundaries must be maintained across layers (modeled after `kadr`):

- **`src/api/` (Transport Layer)**:
  - `httpTransport.ts`: Typed fetch wrapper configured with `credentials: "include"`, automatic JSON handling, and normalized error responses.
  - `apiClient.ts`: Domain-specific API endpoint functions (`authApi`, `mediaApi`, `profileApi`, etc.).
  - `index.ts`: Single exported `apiClient` instance.
- **`src/services/` (Service Layer)**:
  - Business operations wrapping `apiClient` calls and throwing user-friendly domain errors.
- **`src/composables/` (Shared State & Logic Layer)**:
  - Domain logic, reactive UI state, and browser APIs.
- **`src/components/` (UI Layer)**:
  - UI components split into `shared/`, `features/`, and `widgets/`.
- **`src/layouts/` (Layout Wrappers)**:
  - Page layout wrappers (e.g. `MainLayout.vue`, `AuthLayout.vue`).
- **`src/pages/` (Views)**:
  - Top-level route pages.
- **`src/router/` (Routing)**:
  - Route definitions and navigation guards (`beforeEach` session hydration).

### 4.2 State Management Rules

- **STRICTLY FORBIDDEN: `provide` / `inject`**: Never use `provide` or `inject`. All shared state and methods are accessed via composables.
- **NO Pinia / Vuex**: Do NOT add external state management libraries. State is managed strictly via composables with module-level reactive singletons (`ref`, `computed`).
- **PWA Authentication Persistence**: Relies on HttpOnly cookies (with `credentials: "include"`), which are preserved by the browser and PWA WebView. On app launch and route navigation, `useAuth.ensureHydrated()` checks `/api/auth/session` to hydrate reactive user state.

### 4.3 Component & Styling Rules

- **CSS in Vue SFCs**: All component styling MUST be written directly in `.vue` files using `<style scoped>`.
- **Minimal Global CSS**: Global CSS is strictly limited to CSS custom properties (variables) and basic resets in `src/css/`.
- **Shared Logic in Composables**: Reusable state and logic across components MUST be extracted into composables (`src/composables/`).
- **Zero Inline SVGs**: NEVER place `<svg>` tags directly inside `.vue` files. Extract every SVG into its own `.svg` file (e.g. in `src/assets/icons/` or `icons/`) and import it.

---

## 5. Code Quality & Verification Standards

Before completing any task, the agent MUST run and verify:

1. `npm run typecheck` — 0 TypeScript errors across all workspaces.
2. `npm run lint` — 0 ESLint and Stylelint errors/warnings.
3. Keep code decomposed and respect ESLint complexity limits (`max-lines-per-function: 60`, `max-params: 4`, `complexity: 10`).
4. **No comments anywhere in the codebase** (`//`, `/* */`, `<!-- -->`).
5. **No inline SVGs in templates or components.**
6. **No TypeScript `enum` anywhere in the codebase (use `const ... as const` + union types).**
7. **No magic numbers or magic strings (all constants extracted into typed dictionaries or shared constants).**
