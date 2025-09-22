# Checklist — Canvas, Agent, & Library Panels Integration (2025-02-15T00:00Z)

## Preparation
- ✅ Confirm architecture doc `docs/architecture/2025-02-15-canvas-agent-library-panels-integration.md` synced to hKG entry `urn:uuid:7f4c7a4c-9f51-4a78-958b-8d20ad1bd8a1`.
- ✅ Install frontend dependencies in `apps/web/package.json`: add `@tldraw/tldraw` (and ensure peer deps satisfied via pnpm install).

## Type System Foundations (`apps/web/src/types/panels.ts`)
- ✅ Create interfaces `LibraryEntry`, `LibraryToggleHandler`, `AgentProfile`, `AgentMessage`, `AgentSession` with explicit property lists (ids as string, statuses as union types).

## State Catalogues
- ✅ Create `apps/web/src/state/libraries.ts` exporting constant `LIBRARIES: LibraryEntry[]` with starter entries (Flowchart Basics, Stickies, Simple UML, Generic Icons) and pure function `toggleLibrary(libraries: LibraryEntry[], id: string): LibraryEntry[]`.
- ✅ Create `apps/web/src/state/agents.ts` exporting `AGENT_PROFILES: AgentProfile[]` representing Gemini, OpenRouter GPT-4.1, Ollama Llama 3.1 local, and helper `getAgentById(id: string): AgentProfile | undefined`.

## Hooks
- ✅ Implement `apps/web/src/hooks/useAgentSession.ts` exporting `useAgentSession(activeAgentId: string)` returning `{ transcript, composerValue, setComposerValue, sendUserMessage }`; handle agent change by resetting composer/transcript state; append system echo message; log via `createLogger`.

## Layout Components
- ✅ Create `apps/web/src/components/layout/AppLayout.tsx` defining React component accepting props `{ librarySlot, canvasSlot, agentSlot }` and rendering semantic regions with class names `app-shell`, `library-panel`, `canvas-panel`, `agent-panel`.
- ✅ Create `apps/web/src/components/panels/PanelHeader.tsx` to render `<header>` with `h2` title and optional `action` node.

## Canvas Integration
- ✅ Create `apps/web/src/components/canvas/CanvasShell.tsx` importing `Tldraw` from `@tldraw/tldraw` and `@tldraw/tldraw/tldraw.css`; wrap in div with class `canvas-shell`; emit logger info on mount via `useEffect`.

## Library Panel UI
- ✅ Implement `apps/web/src/components/panels/LibraryPanel.tsx` receiving `libraries`, `onToggle`; render list of cards, each with enable toggle button and metadata (license, sourceType, itemCount) and accessible labels.

## Agent Panel UI
- ✅ Implement `apps/web/src/components/panels/AgentPanel.tsx` accepting `agents`, `activeAgentId`, `onSelect`, `session`; render agent selection buttons, transcript list (agent/user roles), and composer form invoking `session.sendUserMessage`.

## App Integration
- ✅ Update `apps/web/src/App.tsx` to import new components/types/state; manage state for `libraries` (via `useState` and `toggleLibrary`), `activeAgentId`, `agentSession` hook; pass props into layout slots; wire logger actions for toggles, selection, message sending.
- ✅ Update `apps/web/src/app.css` with CSS grid layout, panel styling, responsive adjustments (<960px stack), button styles for toggles and composer.

## Testing & Verification
- ✅ Run `pnpm install` at repo root to ensure dependencies resolved.
- ✅ Execute `pnpm --filter @tljustdraw/web lint` (or `pnpm lint` if project-level) ensuring ESLint passes.
- ✅ Execute `pnpm --filter @tljustdraw/web build` to confirm Vite/TS compile succeeds.

## Documentation Sync
- ✅ Update this checklist with completion status marks and note test results.
- ✅ Summarize implementation in final PR message referencing architecture alignment.
