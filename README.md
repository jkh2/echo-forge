# EchoForge — Open-Source AI Chat Exporter

**Export high-quality conversations from Claude, Grok, ChatGPT and more.**  
Preserve **Artifacts**, **Canvas**, code, diagrams, citations, and feed everything directly into your local knowledge systems.

> **Current Status:** Phase 0 complete — working popup + basic Claude content script stub. Real export engine in active development.

## Vision

EchoForge gives you **ownership** of your AI conversation history with:

- Clean, structured Markdown + JSON exports with rich metadata
- Excellent support for **Claude Artifacts** and **ChatGPT Canvas** (code, diagrams, rendered content)
- Local-first pipelines that integrate with Zettelkasten, ChromaDB, n8n, BookForge, and SIDLF memory systems
- Fully open source, auditable, and privacy-respecting
- Modular parsers designed to survive UI changes

Built by the community around **Sentinel AI Systems** for people who treat their AI interactions as valuable, persistent knowledge.

## Quick Start (Load Unpacked)

1. Clone or download this repo
2. Go to `chrome://extensions/`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked**
5. Select the `src` folder (or the root if you build it)

The extension icon will appear. Click it on any supported chat page.

## Current Features (Phase 0)

- Clean popup UI with Tailwind
- Basic conversation detection on Claude
- Message extraction stub (will be greatly improved)
- Message passing between popup ↔ content script ↔ background
- Foundation for multi-platform support

## Roadmap

See [PLAN.md](./PLAN.md) and [ROADMAP.md](./ROADMAP.md) for the full phased build plan.

**High-level phases:**
- Phase 1: Robust single-chat Markdown + JSON export (Claude + Grok)
- Phase 2: High-fidelity Claude Artifacts + ChatGPT Canvas extraction
- Phase 3: Multiple formats (DOCX, PDF) + Batch ZIP
- Phase 4: Notion integration + UI polish
- Phase 5: Local knowledge base pipeline (Zettelkasten, vector-ready JSON, custom templates)
- Phase 6+: More platforms, in-extension history browser, advanced features

## Contributing

We welcome contributions! Especially:
- Platform-specific parser improvements
- Better Artifact / Canvas extraction logic
- UI/UX enhancements
- Documentation and examples

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a PR.

## License

MIT License — see [LICENSE](./LICENSE)

## Philosophy

Your conversations with AI are part of your intellectual output.  
EchoForge helps you **preserve, structure, and reuse** that output on your own terms.

Built with ❤️ for people building the future with AI.

---

**Status:** Active development • Phase 0 scaffold complete  
**Next:** Phase 1 — Core export engine for Claude & Grok
