# Checklist — Model catalog resilience & blank screen mitigation (2025-09-22T14:49Z)

> Legend: [ ] not started, [/] in progress, [x] done (untested), ✅ tested

## Assets & Data Sources
- [x] Create `apps/web/public/api/openrouter/models.json` mirroring `FALLBACK_OPENROUTER_MODELS` schema.

## Hook Enhancements
- [x] Update `apps/web/src/hooks/useModelCatalog.ts`:
  - [x] Introduce `CatalogSource` union and `catalogSource` state.
  - [x] Add hydration guard to prevent repeated fetch loops.
  - [x] Attempt remote endpoint (`VITE_OPENROUTER_MODEL_CATALOG_URL` or `/api/openrouter/models`).
  - [x] On failure, attempt static asset `/api/openrouter/models.json` before falling back to bundled constants.
  - [x] Normalize models via `normalizeOpenRouterModel` and reconcile `activeModelId` validity.
  - [x] Refine logging levels for static fallback vs. hard failure and populate `error` state appropriately.

## Context Contract
- [x] Extend `apps/web/src/context/ModelProvider.tsx` to expose `catalog.source`.

## UI Feedback
- [x] Adjust `apps/web/src/components/panels/ModelSelector.tsx` to read `source` and render contextual status messaging.

## Verification
- ✅ Run `pnpm --filter @tljustdraw/web lint`.
- ⚠️ Run `pnpm --filter @tljustdraw/web test` (Vitest exits with code 1 because no test files are present).

