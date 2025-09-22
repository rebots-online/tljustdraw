# Checklist — Web App Scaffolding to Restore `pnpm run dev` (2025-02-15)

UUID Namespace: `urn:uuid:7f4c7a4c-9f51-4a78-958b-8d20ad1bd8a1`

## Planning Alignment
- [x] Confirm architecture document `docs/architecture/2025-02-15-web-app-scaffolding.md` captured AST and UML updates.
- [x] Record nodes/edges in hybrid knowledge graph for `@tljustdraw/web` workspace and `App` component.

## Workspace Scaffolding
- [x] Create directory structure `apps/web/` with `src/` subtree.
- [x] Add `apps/web/package.json` declaring name `@tljustdraw/web`, scripts, dependencies, and workspace metadata.
- [x] Update root `package.json` dev script to filter `@tljustdraw/web`.
- [x] Add TypeScript configs:
  - [x] `apps/web/tsconfig.json`
  - [x] `apps/web/tsconfig.node.json`
- [x] Add Vite configuration `apps/web/vite.config.ts` with React plugin and alias `@shared-utils`.
- [x] Add HTML entry `apps/web/index.html`.

## Source Files
- [x] Add global stylesheet `apps/web/src/app.css`.
- [x] Implement React root `apps/web/src/main.tsx` bootstrapping `<App />`.
- [x] Implement `apps/web/src/App.tsx` using `createLogger` from shared-utils to log readiness.
- [x] Add ambient type declarations `apps/web/src/vite-env.d.ts`.

## Dependency Management
- [x] Run `pnpm install` to update workspace and lockfile.

## Verification
- ✅ Execute `pnpm run dev` to confirm filter resolves `apps/web` and Vite server starts (no runtime errors expected in console startup logs).

## Documentation & Finalization
- ✅ Update checklist statuses to ✅ once commands verified.
- ✅ Commit all changes with meaningful message after tests.
