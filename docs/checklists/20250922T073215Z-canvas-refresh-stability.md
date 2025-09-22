# 2025-09-22T07:32:15Z — Canvas Refresh Stability Checklist

## Preconditions
- ✅ Confirm `pnpm install` executed (workspace deps ready).
- ⚠️ Ensure dev server repro shows blank canvas after flash (optional sanity check).

## Implementation Steps
1. CanvasShell resilience
   - [x] Update `apps/web/src/components/canvas/CanvasShell.tsx` to schedule a `requestAnimationFrame` refresh after the API resolves.
   - ✅ Ensure the disconnect branch still nulls `apiRef.current` when the Excalidraw instance unmounts.

2. Layout CSS guardrails
   - [x] Modify `apps/web/src/app.css` to add `min-height: 0` / `min-width: 0` for `.workspace-main` and `.workspace-canvas` so flex layout cannot collapse the canvas.
   - [x] Ensure `.canvas-shell` uses `display: flex` with full width/height, and its direct Excalidraw child flexes to fill the area.

3. Render stabilisation
   - [x] Update `apps/web/src/main.tsx` to drop the `StrictMode` wrapper around `<App />`.

## Verification
- ✅ Run `pnpm --filter web lint` to confirm lint passes.
- ✅ Run `pnpm --filter web build` to ensure production build succeeds.
- ⚠️ Manually verify via dev server or screenshot that the canvas remains visible (if feasible).
- ✅ Update checklist statuses with ✅ once tests complete.

