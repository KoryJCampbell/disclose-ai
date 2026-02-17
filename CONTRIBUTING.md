# Contributing to DiscloseAI

Thanks for your interest in contributing! This tool helps federal agencies comply with NIST AI RMF and OMB M-24-10 requirements for AI system documentation. Every contribution makes compliance easier for government teams.

## Getting Started

```bash
# Clone the repo
git clone https://github.com/KoryJCampbell/disclose-ai.git
cd disclose-ai

# Install dependencies
npm install

# Run the CLI in dev mode
npx tsx src/cli.ts --help

# Run tests
npm test

# Build
npm run build
```

## Project Structure

```
src/
├── cli.ts                  # Entry point (Commander.js)
├── commands/               # init, generate, validate
├── prompts/                # Interactive prompts (Govern, Map, Measure, Manage)
├── schema/                 # Zod schema, types, defaults, NIST mapping
├── templates/              # Handlebars templates (markdown.hbs, html.hbs)
├── render/                 # Output renderers (markdown, json, html)
├── ai/                     # AI-assist mode (optional @anthropic-ai/sdk)
├── validators/             # Schema validation, completeness, NIST scoring
├── utils/                  # YAML, file helpers, logger
└── constants.ts
```

## Ways to Contribute

### Good First Issues

Look for issues labeled [`good first issue`](https://github.com/KoryJCampbell/disclose-ai/labels/good%20first%20issue). These are scoped to be approachable for new contributors.

### NIST Mapping Improvements

The field-to-NIST-subcategory mappings in `src/schema/nist-mapping.ts` can always be refined. If you have expertise in NIST AI RMF, improvements to the mapping accuracy are very valuable.

### New Output Formats

The render pipeline (`src/render/`) is designed to be extensible. Adding new formats (PDF, DOCX, OSCAL) would be welcome.

### Template Improvements

The Handlebars templates in `src/templates/` control the output. Improvements to formatting, accessibility, or additional template variants are welcome.

### Bug Fixes & Testing

More test coverage is always appreciated. Test files live in `test/` and use Vitest.

## Development Workflow

1. **Fork** the repo and create a feature branch from `main`
2. **Write code** — follow the existing TypeScript strict patterns
3. **Add tests** for new functionality
4. **Run checks** before submitting:
   ```bash
   npm test          # All tests pass
   npm run build     # Build succeeds
   ```
5. **Submit a PR** with a clear description of what changed and why

## Code Style

- TypeScript strict mode — no `any` types
- ESM modules (`.js` extensions in imports)
- Zod for all data validation
- Descriptive variable names over comments
- Keep functions focused and small

## Commit Messages

Use conventional commit style:
```
feat: add PDF output format
fix: handle empty arrays in NIST scoring
docs: update CONTRIBUTING with new section
test: add edge case tests for validator
```

## Reporting Issues

When reporting a bug, please include:
- Node.js version (`node --version`)
- OS and version
- Command you ran
- Expected vs actual behavior
- Contents of your `disclosure.yaml` (redact sensitive info)

## Questions?

Open a [Discussion](https://github.com/KoryJCampbell/disclose-ai/discussions) for questions, ideas, or feedback. Issues are for bugs and feature requests.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
