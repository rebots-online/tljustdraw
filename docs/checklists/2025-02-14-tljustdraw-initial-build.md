# Checklist — tl;justdraw! Initial Build (2025-02-14)

UUID Namespace: `urn:uuid:7f4c7a4c-9f51-4a78-958b-8d20ad1bd8a1`

## Repository Scaffolding
- [x] Create root configuration files:
  - [x] `package.json` (pnpm workspace with scripts for lint, build, test, format)
  - [x] `pnpm-workspace.yaml`
  - [x] `.editorconfig`, `.gitignore`, `.npmrc` (enforce pnpm), `tsconfig.base.json`
  - [x] `README.md` describing architecture summary and setup
- [x] Configure linting & formatting:
  - [x] Add ESLint config (`.eslintrc.cjs`) with React + TypeScript rules and import sorting
  - [x] Add Prettier config (`.prettierrc.json`) and ignore file
  - [x] Add TypeScript project references for packages/apps

## Shared Utilities Package (`packages/shared-utils`)
- [x] Scaffold package structure with `package.json`, `tsconfig.json`, `src/index.ts`
- [x] Implement `src/config.ts` exposing `AppConfig` interface and `loadEnvConfig()` that reads from environment variables and IndexedDB/Tauri secure storage via dependency injection hooks.
- [x] Implement `src/logger.ts` with `Logger` interface, `createLogger()` factory, console + optional file sink (guarded by platform flag).
- [x] Export utilities via `src/index.ts` barrel file.
- ✅ Add unit tests in `__tests__/config.test.ts` and `__tests__/logger.test.ts` using Vitest.

## Core UI Package (`packages/core-ui`)
- [ ] Scaffold package metadata and TypeScript config.
- [ ] Implement theming with `ThemeProvider`, `useTheme()`, `Panel`, `IconButton`, `Toolbar` components in `src/`.
- [ ] Include Tailwind or CSS-in-JS? (Decision: use CSS Modules via Vite). Create `src/styles/tokens.css`.
- [ ] Write Storybook stories? (Defer until later milestone) — document deferral in README.
- [ ] Add component tests with React Testing Library + Vitest.

## Canvas Adapters (`packages/canvas-adapters`)
- [ ] Scaffold package metadata and dependencies on `@tldraw/tldraw` and `@excalidraw/excalidraw`.
- [ ] Implement `src/tldraw/AppCanvas.tsx` integrating tldraw React component with multiplayer sync using tldraw's room API.
- [ ] Implement `src/tldraw/syncClient.ts` wrapping CRDT/WebRTC logic with hooks.
- [ ] Implement `src/excalidraw/importer.ts` with functions:
  - [ ] `importExcalidrawLibrary(source: File | URL): Promise<TLAsset[]>`
  - [ ] `convertExcalidrawScene(sceneJson: ExcalidrawScene): TLDocument`
  - [ ] Ensure MIT license attribution metadata preserved.
- [ ] Provide curated starter libraries in `starter-libraries/*.excalidrawlib.json` with conversion script.
- [ ] Add tests validating importer conversion and starter library registry.

## Agent Services (`packages/agent-services`)
- [ ] Scaffold package metadata and dependencies on `openai`, `@google/generative-ai`, `@openrouter/ai`, `ollama` client via HTTP.
- [ ] Define shared types in `src/types.ts` (`AgentRole`, `AgentEvent`, `AgentAction`).
- [ ] Implement provider classes:
  - [ ] `OpenRouterClient` using `OPENROUTER_API_KEY` default header.
  - [ ] `GeminiClient`
  - [ ] `OpenAIClient`
  - [ ] `OllamaClient`
- [ ] Implement `src/agentOrchestrator.ts` with `AgentOrchestrator` class managing always-on facilitator agent, queueing canvas operations, rate limiting, undo stack integration.
- [ ] Implement `src/index.ts` barrel export.
- [ ] Add tests mocking providers to validate orchestrator behavior.

## Auth & Billing (`packages/auth-billing`)
- [ ] Scaffold package metadata.
- [ ] Implement `src/authService.ts` with `AuthService` interface, provider registry supporting Google, GitHub, Apple, Microsoft, and magic link, including Tauri deep-link handling.
- [ ] Implement `src/revenueCatClient.ts` to fetch offerings, entitlements, and expose `hasEntitlement(entitlement: Entitlement)`.
- [ ] Implement `src/entitlements.ts` enumerating `pro_canvas`, `multi_agents`, `excal_import_plus`, `cloud_sync`.
- [ ] Add tests for entitlement gating and auth session refresh.

## Web Application (`apps/web`)
- [ ] Initialize Vite React TypeScript app with PWA plugin.
- [ ] Configure Tailwind or CSS Modules consistent with `core-ui` decision.
- [ ] Implement entry point `src/main.tsx` mounting providers (`AuthProvider`, `AgentProvider`, `LibraryProvider`, `ThemeProvider`).
- [ ] Implement `src/App.tsx` layout with panels: Canvas, Agents, Libraries, Billing, Account.
- [ ] Implement routing using React Router with routes: `/`, `/board/:boardId`, `/account`, `/billing`.
- [ ] Implement providers:
  - [ ] `src/providers/AuthProvider.tsx`
  - [ ] `src/providers/AgentProvider.tsx`
  - [ ] `src/providers/LibraryProvider.tsx`
- [ ] Implement `src/routes/BoardRoute.tsx` to ensure facilitator agent active, handle board loading, call `AppCanvas`.
- [ ] Implement `src/components/AgentChatPanel.tsx`, `src/components/LibraryManager.tsx`, `src/components/BillingPanel.tsx`, `src/components/AccountPanel.tsx` using `core-ui` primitives.
- [ ] Integrate service worker registration in `src/serviceWorkerRegistration.ts` with offline + background sync tasks.
- [ ] Add `public/manifest.json`, icons referencing `ASSETS/tldr-logo.png` derivatives.
- [ ] Configure IndexedDB persistence via `idb` package for offline board cache.
- [ ] Add unit tests for providers and components; add integration tests with React Testing Library.

## Desktop (Tauri) Application (`apps/desktop`)
- [ ] Scaffold Tauri project referencing web build output.
- [ ] Configure `src-tauri/tauri.conf.json` with build identifiers, epoch-based 4-digit build numbering (read from CI env var) for window watermark and About dialog.
- [ ] Implement secure storage plugin initialization for API tokens.
- [ ] Bridge file import/export APIs via Tauri commands (open/save dialogues for board files & libraries).
- [ ] Add smoke tests using `tauri-driver`.

## Backend (`server`)
- [ ] Scaffold Express server with TypeScript.
- [ ] Implement RevenueCat webhook endpoint `/webhooks/revenuecat` verifying signature.
- [ ] Implement auth token exchange endpoint `/auth/:provider/callback` bridging OAuth provider tokens to client-friendly format.
- [ ] Store entitlements in Postgres (initially using `pg` + migration script) — optional stub allowed? (No placeholders: implement actual DB integration using connection string, but provide `.env.example`).
- [ ] Add Vitest unit tests and Supertest integration tests.

## Tests & Tooling
- [ ] Configure Vitest at root with project references.
- [ ] Add Playwright e2e tests in `tests/e2e/agent-canvas.spec.ts` verifying facilitator agent actions reflected on canvas and undoable.
- [ ] Add CI workflow `.github/workflows/ci.yml` running lint, test, build, and packaging matrix.
- [ ] Add scripts for generating epoch build number in `infra/scripts/inject-build-id.ts` used by CI + app runtime.

## Documentation & Compliance
- [ ] Update `README.md` with setup instructions, PWA install notes, Tauri packaging steps, and CI/CD overview.
- [ ] Document architecture alignment steps for hybrid knowledge graph updates.
- [ ] Include LICENSE referencing copyright notice.

## Finalization
- [ ] Run formatting (`pnpm lint`, `pnpm test`, `pnpm build`).
- [ ] Verify checklist items updated with ✅ once tested.
- [ ] Commit changes and ensure clean git status.
