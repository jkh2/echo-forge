# EchoForge — Export & Preserve Your AI Conversations

**Open-source Chrome extension for high-quality AI chat history export**  
Preserve **Claude Artifacts**, **ChatGPT Canvas**, code, diagrams, citations, and more — then feed everything into your personal knowledge systems.

> **Current Status:** Phase 0 complete. Working popup + foundation ready. Full export engine in active development.

## What is EchoForge?

EchoForge is a **privacy-first, fully open-source** browser extension that gives you complete ownership of your conversations with AI models.

Instead of losing valuable chats when platforms change or conversations get too long, EchoForge lets you **export them cleanly** so you can archive, search, analyze, and reuse them on your own terms.

It was built by the team behind Sentinel AI Systems for people who treat their AI interactions as real intellectual work worth preserving.

## What Does It Do?

- **One-click export** of the current conversation
- Extracts rich content including:
  - Claude Artifacts (code, documents, flowcharts, interactive elements)
  - ChatGPT Canvas
  - Code blocks with language detection
  - Tables, lists, citations, and Mermaid diagrams
- Exports to clean **Markdown** and structured **JSON** with rich metadata (YAML frontmatter)
- Batch export + organized ZIP downloads (coming soon)
- Designed for seamless integration with:
  - Zettelkasten / personal knowledge management
  - Vector databases (ChromaDB, etc.)
  - n8n / agentic workflows
  - BookForge and SIDLF memory systems
- **100% local processing** — your data never leaves your browser

## How to Try It Live (Right Now)

### Option 1: Load Unpacked from GitHub (Recommended — Works Today)

1. Go to the repository: [https://github.com/jkh2/echo-forge](https://github.com/jkh2/echo-forge)
2. Click the green **Code** button → **Download ZIP**
3. Unzip the downloaded file
4. Open Chrome and navigate to `chrome://extensions/`
5. Turn on **Developer mode** (top right toggle)
6. Click **Load unpacked**
7. Select the `src` folder inside the unzipped directory
8. The EchoForge icon will appear in your extensions toolbar

### Option 2: Clone with Git
```bash
git clone https://github.com/jkh2/echo-forge.git
cd echo-forge
```
Then follow steps 4–8 above using the `src` folder.

### Using the Extension
1. Open a chat on a supported platform (Claude.ai or Grok.x.ai work best right now)
2. Click the EchoForge icon in your toolbar
3. The popup automatically detects the current AI platform
4. Click **Export Current Conversation**
5. The extension will extract the conversation (basic extraction in current Phase 0)

**Note:** Full high-fidelity export (including proper Artifact/Canvas handling and file downloads) is being built in Phase 1.

## Supported Platforms (Current & Planned)

**Working now (Phase 0 stubs):**
- Claude.ai
- Grok (grok.x.ai)

**Planned for Phase 1+:**
- ChatGPT + Canvas
- Gemini
- DeepSeek
- Perplexity
- And more

## Project Status & Roadmap

**Phase 0 (Complete):** Solid foundation — popup UI, message passing, basic content script structure, documentation.

**Upcoming Phases:**
- Phase 1: Robust single-chat Markdown + JSON export engine
- Phase 2: High-fidelity Claude Artifacts & ChatGPT Canvas extraction
- Phase 3: Multiple formats (DOCX, PDF) + batch ZIP
- Phase 4: Notion integration + UI polish
- Phase 5: Local knowledge pipeline (Zettelkasten folders, vector-ready JSON, custom templates)
- Phase 6+: More platforms, in-extension history browser, advanced features

See the full detailed plan in [PLAN.md](PLAN.md).

## Philosophy

Your conversations with AI are part of your intellectual output.  
EchoForge helps you **preserve, structure, and reuse** that output on your own terms — without vendor lock-in or data loss.

Built with care for builders, researchers, and anyone who wants their AI work to last.

## Contributing

We welcome contributions of all kinds!

Especially helpful right now:
- Platform parser improvements
- Better Artifact / Canvas extraction logic
- UI/UX ideas
- Documentation & examples

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

MIT License — see [LICENSE](LICENSE) for details.

---

**Ready to own your AI history?**  
[Star the repo](https://github.com/jkh2/echo-forge) • Load it up • Help us build the future of persistent AI memory.

Built as part of the Sentinel AI Systems ecosystem.