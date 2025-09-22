Regarding the PRD for this project, Branstormer (which is a fork of Barnstormer), @PRD_Barnstormer.md 

# PROMPT: tl;justdraw! — Visual Brainstormer with Excalidraw, Always-On LLM Agents, PWA/Tauri, SSO + RevenueCat
Licence is Copyright (C)2025 Robin L. M. Cheung, MBA. All rights reserved.

## Summary

tl;draw is a **“batteries included” brainstormer**: an installable web app / PWA / Tauri desktop & mobile client. It combines an **Excalidraw canvas** for real-time collaboration, **Excalidraw libraries** (imports and normalizes Excalidraw components, shapes, libraries, and drawings) for shape richness, and **LLM agents** that are **always available** for participation in brainstorming as well as turning your ideas into visual representations with MIT-licensed Excalidraw libraries and imported Excalidraw drawings, while remaining collaborative and interoperable with standard Excalidraw sessions.

Logo can be found at @tldr-logo.png 

From first launch, users can brainstorm visually and agents will actively participate, making the app immediately useful without configuration.

The purpose of the platform is to allow collaborative brainstorming with the inclusion of user-specified LLM assistants, who join as a user and are able to agentically translate the brainstorm, as a full participant, into visual representations on the canvas, inclusive of components from libraries either provided by our platform (MIT-licensed Excalidraw components) or added by the user.

The CI/CD system is to trigger automatic build pipelines on commit that cross-compiles for .exe/.msi windows, .appimage/.deb linux, dmg macos, apk incorporating an epoch-based four-digit build number (1-min per digit) incorporated by the build system into a version-build numbering system into the filename proper, the Help|About in the GUI, and on windowed interfaces, at the bottom right corner area.

 - see @/DOCS/PRD_Barnstormer.md  for further guidance

---

## Core Requirements

### 1. Canvas Foundation (Excalidraw)

* Integrate **Excalidraw** React component as primary canvas.
* Enable multiplayer CRDT/WebRTC sync.
* Core primitives: shapes, sticky notes, text, arrows, images.
* Export/import: `.excalidraw` native scenes and libraries.

### 2. Excalidraw Library Support

* **Importer** for .excalidrawlib.json  via URL (#addLibrary= ) or upload.
* Curated **AA batteries included** pack (Flowcharts, UML, Stickies, Generic Icons).
* Library Manager panel: enable/disable, preview, MIT license attribution.
* User-provided libraries supported ("18650s not included").

### 3. Always-On LLM Agent Participation

* **LLM client abstraction** in utils.ts  with pluggable providers:
 * DEFAULT: Openrouter (openrouter/glm-4.5-air:free)
   - use OPENROUTER_API_KEY set in .bashrc for testing purposes and for default if no other config specified
  * Gemini 
  * OpenAI / OpenRouter (GPT family, Anthropic, etc.)
  * Local Ollama / LM Studio
* One agent is **always active by default** in every session.

  * Suggested default role: **Facilitator** — adds clarifying questions, groups notes, and proposes themes.
  * Other roles (Summarizer, Critic, Scribe) can be activated automatically based on plan/entitlements.
* Docked chat panel shows agent commentary; actions reflected on the canvas (e.g., clustering stickies).
* Ops logged and undoable; rate-limited to avoid noise.

### 4. Authentication (SSO)

* OAuth providers: Google, GitHub, Apple, Microsoft; magic-link optional.
* Web: popup OAuth. Tauri: deep link (barnstormer://auth/callback ).
* AuthService interface for provider flexibility.

### 5. Billing & Entitlements (RevenueCat)

* RevenueCat SDK integration across Web (Stripe) + Mobile (StoreKit/Play).
* Offerings: **Free / Pro / Team**.
* Entitlements (examples):

  * pro_canvas : unlimited boards, advanced shapes
  * multi_agents : multiple concurrent agents
  * excal_import_plus : bulk library import
  * cloud_sync : sync/export
* Entitlements checked client-side; webhook sync on backend.

### 6. PWA Support

* Add manifest.json , service worker, IndexedDB persistence.
* Offline edit + background sync.
* Install prompt, icons, splash screens.

### 7. Tauri Packaging

* Desktop/mobile build with file system access for import/export.
* Secure storage for tokens & API keys.
* Stripe checkout via embedded webview.

---

## Architecture

* **Frontend**: Vite + React + TS; Excalidraw canvas; panels (Agents, Libraries, Billing, Account).
* **Adapters**: LLM provider registry; Excalidraw importer; RevenueCat wrapper; AuthService.
* **Storage**: IndexedDB (offline); optional Pro/Team cloud sync.
* **Backend (minimal)**: RevenueCat webhook listener + optional entitlement sync.

---

## Success Criteria (MVP)

✅ Launch Barnstormer in browser, install as PWA.
✅ Draw & collaborate on Excalidraw canvas.
✅ Import Excalidraw library (URL + upload).
✅ LLM agent is active by default on every board.
✅ Sign in with Google or GitHub.
✅ Upgrade to Pro; features gated by RevenueCat entitlements.
✅ Package with Tauri and run on desktop.

---

## Stretch Goals

* Semantic overlays: agents auto-cluster, timeline views, provenance heatmaps.
* Multi-agent debate mode (requires multi_agents  entitlement).
* Voice interface for live facilitation.
* Canvas DVR (session replay).

---

## Instruction to Generator

Scaffold a **Vite + React + TypeScript** app:

* Integrate Excalidraw.
* Implement Excalidraw importer + starter pack.
* Abstract LLM client with Gemini + OpenAI + Ollama providers.
* Configure **one always-on agent** by default (Facilitator role).
* Add SSO AuthService + RevenueCat billing stubs.
* Configure PWA manifest/service worker.
* Wrap with Tauri config for desktop/mobile.
* Provide stubs/tests for entitlement gating, agent ops, importer validation.
Context Length	
67.8k
1

Tokens	
↑ 773.0k
↓ 17.0k
Cache	
↓ 518.0k
Size	1.23 MB
