# Product Requirements Document (PRD)

## 0) Executive Summary (TL;DR)

* **Product**: Visual brainstormer built on **Excalidraw**, with **Excalidraw library import**, **LLM agents** (curated list + optional BYO via bridge), **PWA** + **Tauri** desktop/mobile, **SSO**, and **RevenueCat** billing.
* **Who**: Teams and solo creators who want fast, AI‑assisted ideation without wrestling with canvas plumbing or model sprawl.
* **Why now**: Agentic workflows + visual thinking are converging; Excalidraw's MIT-licensed foundation keeps costs predictable while we differentiate with agent orchestration and semantic import/export.
* **MVP in one line**: A collaborative Excalidraw board where you can import Excalidraw libraries and invite a curated LLM agent to add stickies, links, and structure — installable as PWA, with SSO + Pro gating via RevenueCat.

---

## 1) Goals & Non‑Goals

### Goals

1. **Frictionless brainstorming** on a robust canvas (Excalidraw) with multiplayer.
2. **Usability boost** via **Excalidraw library importer** (AA‑batteries included + user‑provided libraries).
3. **LLM agent participation**: curated providers initially (Gemini, OpenAI/OpenRouter, Ollama local), with a bridge for later BYO.
4. **Cross‑platform**: web, PWA, Tauri desktop/mobile.
5. **Commercialization**: SSO + RevenueCat entitlements; plans for Free/Pro/Team.
6. **Observability**: metrics, logging, replay for support.

### Non‑Goals (MVP)

* Full diagramming parity with specialized tools (e.g., BPMN, UML editors).
* Arbitrary MCP tool marketplaces; we’ll ship a **narrow bridge** first.
* Complex enterprise compliance (SOC2/ISO) day‑one; design for later.

---

## 2) Target Users & JTBD

* **Founders/Product leads**: “I need to turn a messy idea into a coherent map quickly.”
* **Design/Research teams**: “We brainstorm visually; an AI co‑pilot should help organize and connect.”
* **Developers/Architects**: “Drop in templates/libraries and let an agent sketch relationships or summarize decisions.”

**Jobs‑to‑be‑Done**

* Capture ideas rapidly, visually.
* Pull in ready‑made shapes/components (Excalidraw libraries).
* Summon an AI participant to cluster, label, and propose structures.
* Export/share; continue offline; sync later.

---

## 3) Key Use Cases

1. **Solo ideation**: User imports “Flowchart Basics”, pastes notes, invites “Summarizer” agent to group into themes.
2. **Team workshop**: Multiple participants co‑edit; agent proposes swimlanes and task breakdowns.
3. **Template bootstrap**: Import a network diagram library; agent annotates risks and dependencies.
4. **Review mode**: Agent reads canvas content and outputs a bullet summary and action list linked to nodes.

---

## 4) Feature Requirements

### 4.1 Canvas (Excalidraw)

* Multiplayer (presence cursors, CRDT sync).
* Shapes: rect, ellipse, arrow, text, sticky note, image.
* Group/align, stack order, undo/redo.
* Export/import: `.excalidraw` native; **convert** Excalidraw scene/library to Excalidraw-native elements.

### 4.2 Excalidraw Library Importer

* **Import sources**: URL (hash `#addLibrary=`) + file upload of `.excalidrawlib.json`.
* **Library Manager**: list libraries, enable/disable, preview, license display.
* **Starter pack** (MIT): Flowchart basics, Stickies, Generic icons, Simple UML.
* **Validation**: JSON schema checks; sandbox images; attribution stored.

### 4.3 LLM Agent Participation

* **Provider abstraction**: `useLLM(provider, model)` supporting **Gemini**, **OpenAI/OpenRouter**, **Ollama/LM Studio**.
* **Invite agent**: choose provider/model, name, role (Summarizer, Grouper, Critic, Scribe).
* **Ops model**: agent emits **canvas ops** (create/edit node, connect, tag). Queue + rate‑limit + user approval policy.
* **Chat side panel**: thread linked to elements; provenance metadata.

### 4.4 Auth (SSO)

* Providers: Google, GitHub, Microsoft, Apple; email magic link optional.
* Web OAuth in popup; Tauri via webview + deep‑link callback.
* Minimal profile: id, email, name, avatar; tokens stored securely (cookies/secure storage).

### 4.5 Billing (RevenueCat)

* Offerings: **Free / Pro / Team**; entitlements (e.g., `pro_canvas`, `multi_agents`, `excal_import_plus`, `cloud_sync`).
* Web via Stripe; mobile via StoreKit/Google Play if applicable; desktop uses Stripe Checkout in Tauri webview.
* Client checks entitlements; server receives webhooks to sync feature flags.

### 4.6 PWA

* `manifest.json`, service worker, offline caching, IndexedDB for boards/libraries.
* Install prompt; icons; background sync.

### 4.7 Tauri

* FS import/export; deep links; secure storage; auto‑updates configured later.

### 4.8 Observability & Admin

* Client events → analytics (page, session, agent ops, import usage).
* Error logging with fingerprints; replay session (optional minimal “canvas DVR”).
* Admin page to inspect user entitlement + recent errors.

---

## 5) Constraints & Principles

* **Bridge‑first**: piggyback on stock Excalidraw; do not fork until necessary.
* **Curate models** for stability and support; BYO via advanced settings (off by default) to contain support blast radius.
* **Licensing clarity**: ship only MIT‑vetted libraries; URL/import for everything else.
* **Security**: sanitize imported JSON, content security policy, rate‑limit agent ops.

---

## 6) Architecture (High Level)

* **Frontend**: Vite + React + TS; Excalidraw canvas; panels for Agents, Libraries, Billing, Account.
* **LLM Adapter**: provider registry; each provider implements `generate()`, `embed()` (future), and back‑pressure control.
* **Importer**: Excalidraw scene/library normalization; schema validator; attribution registry.
* **Auth/Billing**: AuthService interface; RevenueCat SDK; webhook listener (serverless or small node service) to sync entitlements.
* **Storage**: IndexedDB (offline boards/libs). Optional cloud sync in Pro/Team.

---

## 7) Data Model (MVP)

* **Board**: id, title, elements\[], tags\[], createdAt/updatedAt, ownerId.
* **Library**: id, name, source(url|file), license, enabled, items\[].
* **Agent**: id, provider, model, role, status; ops log.
* **User**: id, profile, entitlements, settings.

---

## 8) Entitlements (Examples)

* `pro_canvas`: unlimited boards, exports.
* `multi_agents`: >1 concurrent agent.
* `excal_import_plus`: bulk import, library manager advanced.
* `cloud_sync`: workspace syncing.

---

## 9) Metrics / KPIs

* Activation: time‑to‑first‑board, time‑to‑first‑agent.
* Engagement: DAU/WAU, boards/user, agent ops/session, library imports/session.
* Monetization: conversion to Pro, MRR, churn, ARPU.
* Reliability: error rate, agent failure rate, import validation failures.

---

## 10) Phased Roadmap

**MVP (Weeks 0‑6)**

* Excalidraw canvas + multiplayer
* Library importer (URL + upload) + starter pack
* Single curated LLM/provider (e.g., Gemini or OpenAI)
* PWA basics; Tauri packaging
* SSO (Google/GitHub) + RevenueCat Pro plan + entitlement gating

**Phase 2 (Weeks 6‑12)**

* Multi‑provider LLM switcher + Ollama local
* Agent roles (Summarizer, Grouper) + op queue moderation UI
* Billing: Team plan; workspace sharing; admin console
* Observability improvements; canvas replay (lightweight)

**Phase 3 (12+ weeks)**

* BYO model toggle (advanced settings) with guardrails
* Cloud sync; hKG export (JSON‑LD, Neo4j, Qdrant)
* Enterprise SSO (SAML/OIDC), audit log

---

## 11) Risks & Mitigations

* **Model sprawl support burden** → Curate list; BYO behind advanced toggle; strong diagnostics.
* **Importer compatibility drift** → Versioned schemas; test fixtures; fail‑soft with clear errors.
* **Billing edge cases** → RevenueCat webhooks + robust restore flow; entitlement cache with backoff.
* **Offline conflicts** → CRDT merge tests; user prompts on collisions.

---

## 12) Acceptance Criteria (MVP)

* Create a board, draw shapes, collaborate in real time.
* Import Excalidraw library via URL and file; use shapes on canvas.
* Invite a curated LLM agent; see stickies/links created; approve/undo ops.
* Install as PWA; open offline; changes sync on reconnect.
* Sign in via Google; upgrade to Pro; features gate by entitlement.
* Package and run via Tauri on macOS/Windows/Linux.

---

## 13) Open Questions

* Which curated provider set at launch (1 or 2)?
* Where to host optional backend (entitlement sync, analytics relay)?
* Team collaboration limits: concurrent agents per board? rate limits?
* What’s the precise starter library list (final names/URLs) after license audit?
