# EchoForge Build Plan

**Project:** EchoForge – Open-Source GitHub-hosted Browser Extension for AI Chat History Export

**Approved by user:** June 13, 2026

This document outlines the phased plan that will be followed to build the extension.

## Project Vision & Differentiators

- Privacy-first, local-first design
- Superior handling of Claude Artifacts and ChatGPT Canvas
- Designed to feed directly into personal knowledge systems (Zettelkasten, ChromaDB, n8n, SIDLF memory, BookForge, resurrection prompts)
- Fully open source and community-friendly
- Modular, maintainable parsers

**Working Name:** EchoForge (can be renamed)

## Tech Stack

- Manifest V3 Chrome Extension
- Vite + @crxjs/vite-plugin (planned for build)
- Tailwind CSS
- Bundled libraries: docx, jszip, jsPDF / html2pdf.js
- Content scripts + MutationObserver for dynamic UIs
- Background service worker

## Phased Build Plan

### Phase 0: Foundation & Scaffolding (COMPLETED - June 13, 2026)
- Project folder structure created
- manifest.json (v3) with host permissions
- Popup UI (HTML + JS with Tailwind CDN)
- Background service worker
- Content script stubs for Claude and Grok
- README.md, PLAN.md, .gitignore, LICENSE, CONTRIBUTING.md
- Basic message passing working

**Status:** ✅ Complete

### Phase 1: Core Single-Chat Export – Claude + Grok
**Goal:** Working end-to-end export of normal conversations to clean Markdown + structured JSON with YAML frontmatter.

**Key Deliverables:**
- Robust conversation container detection
- Message extraction with role, content, timestamps
- Basic code block and structure preservation
- Export engine that generates high-quality Markdown + JSON
- File download from popup
- Error handling and status feedback

**Success Criteria:** Export a real multi-turn chat and get clean, readable Markdown.

### Phase 2: Artifact & Canvas Handling
**Goal:** High-fidelity extraction of special rich content.

**Key Deliverables:**
- Detection of active Artifact / Canvas panes
- Extraction of code, rendered previews, Mermaid diagrams (as separate assets)
- Proper formatting in Markdown exports
- Graceful fallback

### Phase 3: Multiple Formats + Batch / ZIP
- Real .docx using docx.js
- PDF export
- Batch export of multiple conversations → organized ZIP
- Progress indicators

### Phase 4: Notion + Polish
- Optional one-click Notion save (user API key)
- Settings page
- UI/UX improvements, copy-to-clipboard, better filenames

### Phase 5: Local Knowledge Pipeline (Major Differentiator)
- Structured folder export (per-conversation folders with .md + assets/ + metadata.json)
- Zettelkasten-style note generation option
- JSON optimized for vector DB / ChromaDB / mem0 ingestion
- Custom export templates

### Phase 6+: Expansion
- Additional platforms (Gemini, DeepSeek, Perplexity, etc.)
- In-extension local history browser + search
- Advanced metadata and branch awareness
- Firefox support
- Potential Chrome Web Store release (after v1 stability)

## Development Workflow

1. I (Grok) implement the current phase using code tools
2. Files are written into the project folder
3. User loads the unpacked extension and tests on real chat pages
4. User provides feedback (what works, what broke, desired improvements)
5. We iterate quickly
6. When stable, commit + push to GitHub

## Risks & Mitigations

- UI changes on AI platforms → Modular selectors + fallback strategies + easy config updates
- Complex Artifacts/Canvas → Targeted scraping + MutationObserver + partial export fallback
- Long conversations → Chunked processing
- Permissions / store policies → Minimal permissions, clear documentation

## Success Metrics (v1)

- Clean, structured Markdown exports that preserve conversation meaning and special content
- Successful Artifact + Canvas extraction
- Working batch ZIP
- Local structured export option useful for personal memory systems
- Professional, welcoming open-source repository

---

**Next Milestone:** Complete Phase 1 — Robust Claude & Grok single-chat export engine.

**Current Phase Status:** Phase 0 complete. Ready to begin Phase 1.
