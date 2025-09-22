# tl;justdraw! — Visual Brainstormer

This monorepo hosts the tl;justdraw! platform, combining an Excalidraw-powered collaborative canvas, Excalidraw library ingestion, always-on LLM facilitation, SSO authentication, RevenueCat billing, and deployable clients for web (PWA) and desktop/mobile (Tauri).

## Repository Layout

Refer to [`docs/architecture/2025-02-14-tljustdraw-initial-architecture.md`](docs/architecture/2025-02-14-tljustdraw-initial-architecture.md) for the authoritative architecture plan and AST abstraction. Key directories:

- `apps/web` — Vite + React + TypeScript PWA client
- `apps/desktop` — Tauri shell bundling the web build for desktop/mobile
- `packages/*` — Shared packages (UI, canvas adapters, agent services, auth/billing, utils)
- `server` — Minimal backend services (RevenueCat webhooks, OAuth relay)
- `infra` — CI/CD and packaging scripts
- `tests` — Cross-cutting integration and end-to-end suites

## Getting Started

1. **Install pnpm** version `9.x`.
2. Run `pnpm install` at the repo root to bootstrap workspaces.
3. Consult the checklist [`docs/checklists/2025-02-14-tljustdraw-initial-build.md`](docs/checklists/2025-02-14-tljustdraw-initial-build.md) for the current implementation plan and progress tracking.
4. Use `pnpm dev` to launch the web client once the `apps/web` package is implemented.

## Development Standards

- Follow the architecture and checklist documents before coding new features.
- Update the hybrid knowledge graph to mirror architecture changes (see architecture document for UUID namespace).
- Maintain strict TypeScript settings and linting; no TODO placeholders permitted.

## Licensing

Copyright (C) 2025 Robin L. M. Cheung, MBA. All rights reserved.

Refer to `LICENSE` for the full license terms (to be added per checklist).
