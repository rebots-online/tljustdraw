# Checklist — 2025-09-22T07:17Z — Excalidraw CSS condition fix

- ✅ Update `apps/web/src/components/canvas/CanvasShell.tsx` to import the stylesheet from `@excalidraw/excalidraw/index.css`.
- ✅ Update `apps/web/vite.config.ts` `resolve.conditions` to include `'style', 'development', 'production', 'import', 'module', 'browser', 'default'` while keeping existing alias configuration intact.
- ✅ Ensure `apps/web/vite.config.ts` sets `optimizeDeps.esbuildOptions.conditions` to the same array so esbuild's dependency scanner respects the custom conditions.
- ✅ Ensure formatting/imports remain valid (run project's formatter if applicable or rely on existing style) and save files.
- ✅ Execute `pnpm --filter @tljustdraw/web dev` (or equivalent) to confirm dev server dependency scan completes without `style` condition error; stop server afterwards.
- ✅ Document checklist completion statuses (mark completed items and promote to ✅ once validated by testing).
