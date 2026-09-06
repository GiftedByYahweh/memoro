# Technical Requirements

**Status:** Draft  
**Version:** 0.1  
**Companion Document:** `memoro-spec.md` — Functional Specification  

**Legend:**  
`✅` — Decided  
`❓` — Unresolved  
`⚠️` — Recommendation, requires confirmation  

---

## 1. Scale

The MVP is designed for 2 users. It will likely remain that way.

This is the primary context for all technical decisions below: server-side clustering, background processing queues, and horizontal scaling are not needed. Everything that can be executed on the client should be executed on the client.

---

## 2. Technology Stack

| Layer | Solution | Status |
|---|---|---|
| Backend | Node.js + Fastify | `✅` |
| Frontend | Vue | `✅` |
| Database | PostgreSQL | `✅` |
| ORM | Drizzle | `✅` |
| Media Storage | Cloudflare R2 | `✅` |
| Hosting | Oracle Cloud Free Tier | `⚠️` |
| Map | MapLibre GL JS | `⚠️` |
| Map Tiles | OpenFreeMap | `⚠️` |
| Repository | Monorepo, npm workspaces | `✅` |

### 2.1 Frontend ✅

**Vue.** Rationale:

- Lighter bundle size compared to Angular. For a mobile PWA, this is noticeable daily.
- Simpler for day-to-day work in a single-developer project. Angular's strengths — strict ceremony, DI, scaling across large teams — are unnecessary here.
- Existing hands-on experience with the framework.

**The map is independent of the frontend framework.** MapLibre is a standalone library operating directly on a DOM element. The framework merely provides the container and manages surrounding state. Clustering, pins, zoom, and tiles live inside the map engine.

While wrappers like `vue-maplibre-gl` exist, it is often simpler and cleaner to initialize MapLibre directly in `onMounted`, eliminating unnecessary abstraction layers between application code and the map API.

### 2.2 Database ✅

PostgreSQL. Rationale:

- Core entities (user, collection, photo, tag) have clear relational ties and are queried independently. There is no single document structure that contains everything needed — a document model offers no advantages.
- The photo-to-collection relationship is many-to-many. In a document database, this requires ID arrays and manual application-level joins.
- Suggesting/grouping collections is spatial-temporal clustering (proximity in time and space), which is naturally expressed in SQL queries.
- Fixed schema: from EXIF, only coordinates, capture date, and camera model are practically utilized.

**Regarding PostGIS:** Required only for complex spatial queries on the server. At this project scale, standard indexes on latitude and longitude are sufficient — all photos fit into a single query and are clustered on the client. PostGIS can be added later without difficulty.

### 2.3 Hosting ⚠️

Oracle Cloud Free Tier has been provisionally selected. Risks to consider:

- "Out of host capacity" errors on ARM instances — provisioning an instance can take from a day to a week.
- Account approval can be unpredictable, with rejections occurring without explanation.
- Idle instances risk reclamation. An app with two users can easily look idle to automated sweeps.
- Quotas may change without notice: in June 2026, ARM quotas were reduced from 4 OCPUs / 24 GB to 2 OCPUs / 12 GB.

**Mitigations — Mandatory:**
1. Database is hosted outside the instance (managed Postgres via Neon, Supabase, or equivalent).
2. Automated database dumps to R2 on a schedule, active from day one.

Under this setup, losing an instance costs an hour for redeployment, not the project itself.

**First Action Item (before coding):** Verify whether an Oracle instance can be provisioned. If not feasible within a couple of evenings, pivot immediately to Fly.io / Railway / Render, where deployment takes ten minutes. The trade-off is instance sleeping on free tiers, which is negligible for two users.

### 2.4 Media Storage ✅

Cloudflare R2.

- Free tier: 10 GB storage, 1M write operations, 10M read operations per month.
- Egress bandwidth is always free — a decisive factor for a photo application.
- Above free tier: $0.015 per GB per month.

**Read operations count against limits.** Every thumbnail load on the map counts as an operation. Solution: configure a public bucket on a custom domain so Cloudflare CDN sits in front of R2, ensuring repeat views never hit the storage backend.

---

## 3. Key Architectural Decisions

### 3.1 Media Upload Bypasses the Backend ✅

The client requests a presigned URL from the API and uploads the file directly to R2.

Proxying media uploads through the backend is strictly avoided: it is the heaviest operation and would exhaust a modest hosting instance.

### 3.2 Client-Side EXIF Parsing ✅

Utilize `exifr` in the browser. The server receives extracted coordinates and dates, avoiding server-side file parsing.

### 3.3 Client-Side Thumbnail Generation ✅

Rendered via HTML Canvas and downscaled before upload. The client uploads two files — original and thumbnail preview.

This saves user mobile data, reduces server CPU load, and eliminates the need for background image processing queues.

**Thumbnails are mandatory:** Map pins display image previews; loading full-size photos into pins would degrade both mobile performance and network bandwidth.

### 3.4 Client-Side Clustering ✅

Powered by `supercluster`. All user media coordinates are fetched in a single lightweight API call and clustered directly in the browser.

Server-side zoom-level clustering is unnecessary at the current scale.

### 3.5 Geocoding ⚠️

Paid geocoding services exceed the project budget. Viable alternatives:

- **Photon** — free, no API key required, optimized for typeahead autocomplete.
- **Nominatim** — free, no API key, but limited to 1 req/sec and autocomplete is prohibited on public instances.
- **LocationIQ** — 5,000 free requests per day, Nominatim-compatible API.
- **Offline GeoNames database** — bundled list of cities within the app; zero network requests, fully offline.

**Reverse geocoding** (coordinates → place name) runs during every photo addition, generating higher request volumes. Mandatory requirement: coordinate rounding and caching of geocoding results.

### 3.6 Data Schema ✅

The media-to-collection relationship is designed as **many-to-many from day one**, even though the MVP user interface only permits assigning a photo to a single collection.

This is a database schema decision, not a UI feature. Later schema migration would be disproportionately expensive.

### 3.7 Backend Architecture ✅

Clean Architecture applied pragmatically without overengineering.

#### Principles

- Decouple business logic from the web framework. Fastify is used for infrastructure and routing.
- Pure domain business logic with no infrastructure dependencies.
- Data access through repository interfaces injected into use cases.

#### Layers

**`core`** — Feature modules: authentication, profile, media, collections.

**`common`** — Shared infrastructure and primitives. Houses domain-agnostic items: primitive types, base errors, utilities. Feature-specific logic remains within its module, even if referenced by a second module. Extract to common only on the third consumer.

> Avoid naming collisions between backend common code and the root `packages/shared` monorepo package.

#### Use Cases

- Single public execution method.
- Dependencies passed via constructor.
- Read operations follow the same pipeline; separate query-bus services are omitted.

#### Domain Entities

Defined via TypeScript interfaces. Methods are introduced only when domain invariants need active protection.

#### Two-Level Validation

**Schema (Zod) — Data Shape:** The input contracts accepted by the API. Maintained in `packages/shared`, shared directly with the frontend. Validated before invoking a use case.

**Business Rules — Use Case:** Validates domain conditions: whether a collection exists, belongs to the authenticated user, or can be deleted.

**Separation Criteria:** If a validation check can be performed purely on input data without querying the database, it belongs in the Zod schema. If database context is required, it belongs in the use case. Boundary cases like coordinate ranges (±90 / ±180) belong in the schema.

#### Errors

- Business errors defined using constant objects (TS `enum` is avoided).
- Every error has an explicit code. Mapping of `code → HTTP status` resides in the server/controller layer; the domain remains unaware of HTTP specifics.
- Schema errors and business errors use distinct response formats: schema errors highlight form fields, while business errors render general messages.

#### Controllers & Routes

Inject use cases and define the HTTP routing surface.

#### Transactions

- `UnitOfWork` / `TransactionPort` exposing `run(callback)` or `withTransaction(callback)`. Use cases remain unaware of Drizzle.
- Context propagation to repositories handled via `AsyncLocalStorage`. Repositories retrieve either the active transaction client from the context or the default database client.
- **Nested calls handling:** If a transaction is already active, the callback runs within the existing transaction rather than attempting to open redundant savepoints.

#### External Services

Interaction with R2 via clean interfaces. R2 is an implementation adapter.

#### ORM

`InferSelectModel` and database-inferred types remain **isolated within repositories**. Repositories return domain types to use cases, mapped manually.

This prevents database table schemas from leaking into domain use cases.

#### Dependency Injection

- Manual dependency injection without third-party DI containers. Dependencies are wired explicitly in `createAppContainer`.
- Modular composition: root composition wires modules together.

#### Entry Point

Server bootstrapping resides in `index.ts` / `server.ts`.

**Graceful shutdown from day one:** Database connection pool closing, in-flight request completion handling on `SIGINT` / `SIGTERM`.

#### Code Quality

Strict TypeScript, ESLint, and Prettier configurations.

---

## 4. Monorepo

### 4.1 Rationale ✅

Frontend and backend share TypeScript and data contracts: API request/response types, media representations, collections, coordinates.

- Monorepos keep contracts in a shared package updated in a single place.
- In multi-repo setups, types are either manually duplicated or published to a registry for only two consumers.
- For a solo developer, synchronicity is vital: modifying an endpoint breaks the frontend build in the same commit, not weeks later.

### 4.2 Structure

```
apps/
  server/       — Fastify, backend
  client/       — Vue, PWA frontend
packages/
  shared/       — Types, DTOs, validation schemas, constants
```

**Validation schemas are shared:** A single Zod schema defines the data shape: the backend validates incoming requests, while the frontend validates user input forms.

### 4.3 Build Tooling ✅

**npm workspaces.** Built into npm, configured in a few lines within `package.json`, requiring zero extra tools.

**Turborepo** — build caching and parallel execution. For two applications and one package, advantages are minimal; can be layered on later without refactoring.

**Nx** — omitted. Introduces heavy project models, generators, and configuration overhead unwarranted for a small project.

---

## 5. PWA

### 5.1 Monorepo Compatibility ✅

Monorepos do not affect PWA capabilities. Web manifests, service workers, and HTTPS are properties of the built client bundle delivered to browsers, independent of repository structure.

### 5.2 Requirements

**Service Worker Scope:** Functions strictly within its defined path. When served from domain root, no extra configuration is required.

**CORS:** Frontend and API operate on different ports or subdomains in development. Configure CORS from the start.

**Caching Strategy:** Cache static assets aggressively. **Do not cache API requests**, preventing stale collection data and difficult-to-reproduce synchronization bugs.

**Media Caching:** Never cache full-resolution photos blindly in browser storage to avoid exceeding mobile storage quotas (particularly restrictive on iOS). Cache only thumbnails or rely on standard browser HTTP cache headers.

---

## 6. Mandatory Reliability Requirements

The requirement that "media cannot be lost" translates technically to:

1. Photos are stored in Cloudflare R2, never on the instance disk.
2. The database resides outside the hosting compute instance.
3. Automated database backups to R2 scheduled prior to release.

Without automated backups, compute failure preserves raw photos in R2 but severs their links to collections, coordinates, and capture dates — destroying the core value of the application.

---

## 7. Open Questions

1. **Hosting:** Feasibility of provisioning an Oracle Cloud Free Tier instance. See 2.3.
2. **Geocoding Provider:** Selection among Photon, Nominatim, LocationIQ, or offline GeoNames. See 3.5.
3. **Managed PostgreSQL Provider:** Finalizing Neon, Supabase, or alternative managed service.
