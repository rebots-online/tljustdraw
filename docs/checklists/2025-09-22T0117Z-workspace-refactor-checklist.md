# Checklist — Workspace refactor & OpenRouter default (2025-09-22T01:17:19Z)

> Legend: [ ] not started, [/] in progress, [x] done (untested), ✅ tested

## Preparatory Tasks
- ✅ Update `App.tsx` to use new `WorkspaceLayout` and provide providers (ModelProviderContext, layout store).
- ✅ Create `apps/web/src/state/models.ts` exporting:
  - `OpenRouterModel` type (id, label, contextLength, pricing metadata, etc.).
  - `DEFAULT_OPENROUTER_MODEL_ID = 'openrouter/x-ai/grok-4-fast:free'` (string constant).
  - Helper to normalize API responses.
- ✅ Implement `apps/web/src/hooks/useModelCatalog.ts` hook:
  - Fetch from `/api/openrouter/models` (stub local data for now if backend absent).
  - Manage loading/error state.
  - Expose `models`, `activeModelId`, `setActiveModelId` (default to constant).
- ✅ Add `apps/web/src/context/ModelProvider.tsx` with React context providing catalog state and actions.

## Layout & UI Structure
- ✅ Replace `AppLayout.tsx` with new `WorkspaceLayout` under `components/layout/`:
  - Full-viewport flexbox layout with top chrome bar (hamburger + cogwheel).
  - Canvas occupying underlying area; uses `CanvasShell` centered.
  - Includes `FloatingPanelLayer` component for draggable panels.
  - Accepts props: `canvasSlot`, `chatSlot`, `panels` (array of movable panel configs), `chromeExtras`.
- ✅ Remove old panel usage in `App.tsx`; instead render library/agent controls via floating panels referencing new components (refactor `LibraryPanel`, `AgentPanel` to support compact mode for floating container).
- [ ] Create `apps/web/src/components/layout/WorkspaceChrome.tsx` for top bar containing hamburger menu (ShareMenu) and cogwheel (SettingsDrawer toggle).
- ✅ Implement `apps/web/src/components/layout/SettingsDrawer.tsx` with slide-over panel containing configuration controls (library toggles, model selector fallback, agent roster management).
- ✅ Implement `apps/web/src/components/layout/ShareMenu.tsx` accessible from hamburger icon with actions: share link, invite collaborator, export TLDraw, import Excalidraw.

## Floating Panels & Layout State
- ✅ Add Zustand store `apps/web/src/state/workspaceLayout.ts` for panel positions, chat dock mode (horizontal/vertical/floating), drawer/menu visibility.
- ✅ Implement `apps/web/src/components/layout/FloatingPanel.tsx` and `FloatingPanelLayer.tsx` for draggable/resizable control boxes.
- ✅ Update `LibraryPanel.tsx` & `AgentPanel.tsx` to render within floating panel container (adjust styles accordingly, no fixed widths).
- ✅ Update `app.css` (or module CSS) to support new layout (full width, absolute panels, chat dock variations). Ensure responsive behavior.

## Chat Dock & Agent Collaboration
- ✅ Create `apps/web/src/components/panels/ChatDock.tsx` to display agent chat with selectable layout orientation based on store.
- ✅ Extend `useAgentSession.ts` to integrate with `ModelProviderContext` (use selected model metadata in messages, allow agent to issue canvas actions stub function `sendCanvasAction`).
- ✅ Add `apps/web/src/hooks/useAgentCollaborator.ts` to bridge TLDraw app ref (from `CanvasShell`) with agent commands (stub logging + TODO for real drawing).
- ✅ Modify `CanvasShell.tsx` to expose TLDraw app ref via context or callback for collaborator hook; ensure canvas fills full available area.

## Menus & Actions
- ✅ ShareMenu actions:
  - Provide handlers for share/invite (stub modals with TODO but functional UI).
  - Implement TLDraw export using `app.api.export` if available; fallback to JSON download.
  - Implement Excalidraw import by parsing `.excalidraw` JSON and converting minimal shapes to TLDraw (stub mapping + TODO comment for full support).
- ✅ SettingsDrawer should include toggle sections for libraries (reuse existing toggle logic) and model dropdown using `ModelSelector` component.
- ✅ Create `apps/web/src/components/panels/ModelSelector.tsx` as combo box (accessible) listing models from context.

## Icons & Accessibility
- ✅ Add icon buttons (hamburger, cogwheel) using existing assets or new inline SVG components under `components/icons/`.
- [x] Ensure keyboard navigation for menus/drawer (focus trap, ESC to close).
- ✅ Update aria labels to reflect movable panels and chat dock.

## Testing & Validation
- [ ] Update unit tests or add new tests with Vitest/React Testing Library for `ModelProvider`, `FloatingPanel` interactions, and `ChatDock` orientation logic (if feasible).
- [x] Run `pnpm lint` (if configured) and `pnpm test` (or `pnpm vitest`).
- [ ] Manual smoke test: start dev server `pnpm --filter web dev` (if time) to verify layout.

