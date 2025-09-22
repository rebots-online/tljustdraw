# 2025-09-22T07:17Z — Excalidraw CSS condition resolution architecture

## Context & Baseline AST Overview

### Monorepo structure snapshot
- `apps/web/`
  - `src/components/canvas/CanvasShell.tsx`
    - Imports `Excalidraw` React component from `@excalidraw/excalidraw`.
    - Imports CSS side effect from `@excalidraw/excalidraw/dist/excalidraw.css`.
    - Defines `CanvasShell` functional component with props `onAppReady`, `onSnapshot`.
    - Hooks:
      - `useRef` to cache `CanvasAPI` reference.
      - `useEffect` for lifecycle logging via `createLogger` from `@shared-utils`.
      - `useCallback` wrappers `handleApiRef` and `handleChange` that forward events to props.
    - Renders `<div className="canvas-shell">` containing `<Excalidraw>`.
  - `vite.config.ts`
    - Node ESM config using `defineConfig` from `vite`.
    - Resolves alias `@shared-utils` to `../../packages/shared-utils/src`.
    - Registers React plugin.
    - Server host/port settings.
- `packages/shared-utils/src`
  - Provides shared logging utility `createLogger` leveraged by `CanvasShell`.

### Observed issue baseline
- Vite dev server fails dependency scan when resolving `@excalidraw/excalidraw/dist/excalidraw.css` because the package exports mark the stylesheet behind a non-default condition (`"style"`).
- Esbuild (used by Vite optimizeDeps) requires explicit opt-in for custom condition names.

## Proposed Architectural Adjustments

1. Update Excalidraw stylesheet import to the exported entry `@excalidraw/excalidraw/index.css` to respect the package's official `exports` map.
2. Extend Vite resolver awareness of Excalidraw's custom export conditions so CSS subpath resolves in dev and build modes.
   - Configure `resolve.conditions` to append `"style"`, `"development"`, and `"production"` alongside existing implicit defaults (e.g., `"import"`, `"module"`, `"browser"`, `"default"`).
3. Align esbuild dependency pre-bundling with the same condition logic.
   - Set `optimizeDeps.esbuildOptions.conditions` to mirror the resolver condition list, ensuring the dependency scanner can load the stylesheet without errors.
4. Preserve existing aliases and plugin configuration to avoid regressions.

## Expected Post-change AST delta
- `CanvasShell.tsx`
  - Import side effect updated to `@excalidraw/excalidraw/index.css`.
- `vite.config.ts`
  - New config nodes:
    - `resolve.conditions` includes `style`, `development`, `production`, and default-friendly entries (`import`, `module`, `browser`, `default`).
    - `optimizeDeps.esbuildOptions.conditions` mirrors the same string array for esbuild.

## UML / Mermaid Representations

```mermaid
flowchart TD
    CanvasShell[CanvasShell.tsx]
    ViteConfig[vite.config.ts]
    ExcalidrawPkg[@excalidraw/excalidraw]
    SharedUtils[packages/shared-utils/src]

    CanvasShell -- import --> ExcalidrawPkg
    CanvasShell -- alias --> SharedUtils
    ViteConfig -- defines --> AliasConfig[Alias @shared-utils]
    ViteConfig -- sets --> StyleCondition[Resolve & optimizeDeps conditions]
    StyleCondition -- enables --> ExcalidrawCSS[Resolution of dist/excalidraw.css]
```

## Alignment Notes
- No pre-existing hybrid knowledge graph metadata accessible within container; assumed absent. The above representations should be synchronized to any external graph store manually if required.
- Ensure future architectural updates referencing Excalidraw imports reuse the `style` condition-aware resolution strategy.
