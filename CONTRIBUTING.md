# Contributing to EchoForge

Thank you for your interest in EchoForge! We welcome contributions from the community.

## How to Contribute

1. **Fork** the repository
2. Create a feature branch (`git checkout -b feature/amazing-parser`)
3. Make your changes
4. Test thoroughly on real chat pages (Claude, Grok, etc.)
5. Commit with clear messages
6. Open a Pull Request

## What We're Looking For

- Improvements to platform-specific parsers (especially Claude Artifacts and ChatGPT Canvas)
- Better handling of dynamic UI elements and edge cases
- UI/UX enhancements to the popup and options pages
- Documentation improvements and usage examples
- Ideas for the local knowledge pipeline (Phase 5)
- Bug reports with clear reproduction steps

## Code Style

- Keep content scripts focused and modular (one file per major platform)
- Use clear, descriptive variable names
- Add comments for complex DOM selectors or heuristics
- Prefer graceful degradation over hard failures

## Testing

When adding or modifying parsers:
- Test on both short and very long conversations
- Test conversations that contain code, tables, lists, citations, and (when supported) Artifacts/Canvas
- Verify the exported Markdown is readable and well-structured

## Questions?

Open an issue or start a discussion. We're building this together.

---

Thank you for helping make AI conversation history truly ownable and reusable.
