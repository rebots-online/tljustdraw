# 2025-09-22T07:05Z — Excalidraw Migration Checklist

> Legend: [ ] not started · [/] in progress · [x] implemented awaiting tests · ✅ tested complete

## Preparation
- [x] Remove TLDraw dependency and install Excalidraw in `apps/web/package.json` (swap `@tldraw/tldraw` -> `@excalidraw/excalidraw`).
- [x] Run `pnpm install` to refresh lockfile.

## Type & Utility Layer
- [x] Create `apps/web/src/types/canvas.ts` exporting:
  - `export interface ExcalidrawSnapshot { elements: readonly ExcalidrawElement[]; appState: AppState; files: BinaryFiles; }`
  - `export type CanvasAPI = ExcalidrawImperativeAPI;`
  - Re-export necessary Excalidraw types via `import type { AppState, BinaryFiles, ExcalidrawElement, ExcalidrawImperativeAPI } from '@excalidraw/excalidraw';`.

## CanvasShell Refactor
- [x] Update `apps/web/src/components/canvas/CanvasShell.tsx`:
  - Replace TLDraw imports with `Excalidraw`, CSS import, and types from `../types/canvas`.
  - Accept props `onAppReady?: (api: CanvasAPI) => void` and `onSnapshot?: (snapshot: ExcalidrawSnapshot) => void`.
  - Manage `excalidrawRef` via `useRef<CanvasAPI | null>` and call `onAppReady` when ref set.
  - Implement `handleChange` callback that builds snapshot object and forwards to `onSnapshot`.
  - Ensure cleanup logs appropriately.

## App Wiring
- [x] Refactor `apps/web/src/App.tsx`:
  - Replace TLDraw imports with canvas types (`CanvasAPI`, `ExcalidrawSnapshot`) and necessary Excalidraw helpers.
  - Update state variables `canvasApi`, `latestSnapshot` using new types.
  - Update `useAgentCollaborator` invocation and props to use new types.
  - Revise `handleExport...` to serialize `.excalidraw` file using `canvasApi.getSceneElements()`, `canvasApi.getAppState()`, and `canvasApi.getFiles()` (guard for null).
  - Revise `handleImport...` to parse `.excalidraw` JSON, validate arrays, call `canvasApi.updateScene(...)`, and surface text elements to user (e.g., optional alert/logging) without TLDraw stickies.
  - Update `CanvasShell` props to new handler names.

## Agent Collaborator Hook
- [x] Update `apps/web/src/hooks/useAgentCollaborator.ts` to consume `CanvasAPI` and `ExcalidrawSnapshot` types, adjust logging strings, and maintain snapshot ref.

## Layout & Share Menu Copy
- [x] Update `apps/web/src/components/layout/WorkspaceLayout.tsx` and `ShareMenu.tsx` to rename export handler `onExportExcalidraw`, update button label to `.excalidraw`, and ensure prop names match App adjustments.

## Documentation Refresh
- [x] Revise `README.md` primary description to cite Excalidraw foundation instead of TLDraw.
- [x] Update `PRD_Barnstormer.md` key sections replacing TLDraw as primary canvas while noting historical context if needed.

## Cleanup
- ✅ Run `pnpm lint` from repo root.
- [x] Run `pnpm test` from repo root (no test files present; `vitest run` exits 1).
- [x] Update checklist statuses to ✅ where applicable after verification.

