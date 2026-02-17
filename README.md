# @legacybridge/modelcard

NIST AI RMF Model Card Generator CLI — Generate compliant AI system documentation for federal agencies.

## Why

Federal agencies are required by **OMB M-24-10** to document all AI systems with risk assessments, bias evaluations, and intended use documentation aligned to the **NIST AI Risk Management Framework**. Existing tools don't map to NIST AI RMF functions. This CLI fills that gap.

## Features

- **Template-based** — Interactive prompts walk through each NIST AI RMF section (works air-gapped)
- **AI-assisted** — Optional `--ai` flag uses Claude API to analyze a model repo and auto-draft sections
- **NIST AI RMF aligned** — Sections map to Govern, Map, Measure, Manage functions
- **Multiple formats** — Markdown (primary), JSON, HTML output
- **Validation** — Schema validation + NIST subcategory coverage scoring
- **Traceability matrix** — Auto-generated appendix mapping fields to NIST subcategories

## Quick Start

```bash
# Initialize a starter template
npx @legacybridge/modelcard init

# Generate via interactive prompts
npx @legacybridge/modelcard generate

# Validate and check NIST coverage
npx @legacybridge/modelcard validate
```

## Installation

```bash
npm install -g @legacybridge/modelcard

# Or use without installing
npx @legacybridge/modelcard
```

For AI-assist mode, install the optional peer dependency:

```bash
npm install @anthropic-ai/sdk
```

## Commands

### `modelcard init`

Creates a starter `modelcard.yaml` with NIST AI RMF section comments.

```bash
modelcard init              # Create in current directory
modelcard init --quick      # Create with quick-fill prompts for basic fields
modelcard init --dir ./out  # Create in specified directory
```

### `modelcard generate`

Generates a model card via interactive prompts or from existing YAML.

```bash
modelcard generate                    # Interactive prompts → Markdown
modelcard generate --format json      # Output as JSON
modelcard generate --format html      # Output as HTML
modelcard generate --input card.yaml  # From existing YAML (skip prompts with --no-interactive)
modelcard generate --ai               # AI-assisted drafting via Claude API
modelcard generate --ai --repo ./ml   # Scan specific repo directory
```

### `modelcard validate`

Validates a `modelcard.yaml` against the schema and reports NIST coverage.

```bash
modelcard validate                    # Validate in current directory
modelcard validate --input card.yaml  # Validate specific file
modelcard validate --strict           # Fail on warnings (missing optional fields)
```

Example output:

```
Schema Validation
✓ Schema validation passed

Completeness
ℹ Required fields: 26/26 (100%)
ℹ Optional fields: 44/44 (100%)

NIST AI RMF Coverage
ℹ Overall: 100% (28/28 subcategories)
[GOVERN]  [████████████████████] 100% (8/8)
[MAP]     [████████████████████] 100% (8/8)
[MEASURE] [████████████████████] 100% (6/6)
[MANAGE]  [████████████████████] 100% (6/6)
```

## NIST AI RMF Alignment

The model card sections map directly to the four NIST AI RMF functions:

| Function | Section | Subcategories |
|----------|---------|---------------|
| **GOVERN** | Ownership, Approval, Incident Response, Supply Chain | GOVERN 1.1–1.7, 6.1–6.2 |
| **MAP** | Model Overview, Intended Use, Out-of-Scope, Regulatory, Impact | MAP 1.1–5.2 |
| **MEASURE** | Training Data, Evaluation, Metrics, Bias, Robustness | MEASURE 2.5–2.11 |
| **MANAGE** | Limitations, Mitigations, Monitoring, Lifecycle | MANAGE 2.1–4.2 |

Each generated model card includes an **Appendix A: NIST AI RMF Traceability Matrix** showing which subcategories are addressed and overall coverage percentage.

## AI-Assist Mode

When using `--ai`, the tool:

1. **Scans** the repository for ML artifacts (Python files, notebooks, configs, READMEs)
2. **Sends** file contents to Claude API with NIST context and JSON schema
3. **Generates** a draft model card with as many fields filled as possible
4. **Presents** each section for human review: accept, edit interactively, or skip

The Claude API SDK is an **optional peer dependency** — the tool works fully without it. Air-gapped environments use interactive prompts only.

```bash
# Requires ANTHROPIC_API_KEY environment variable
export ANTHROPIC_API_KEY=sk-ant-...
modelcard generate --ai --repo /path/to/ml-repo
```

## Schema

The `modelcard.yaml` schema covers ~100 fields across 5 top-level sections:

- **metadata** — Version, dates, status, classification
- **govern** — Ownership, approval, incident response, supply chain
- **map** — Model overview, intended use, out-of-scope, regulatory, impact
- **measure** — Training data, evaluation, metrics, bias, robustness
- **manage** — Limitations, mitigations, monitoring, lifecycle

The full Zod schema is exported as a TypeScript type for programmatic use:

```typescript
import { ModelCardSchema, type ModelCard } from '@legacybridge/modelcard';
```

## Development

```bash
npm install
npm run dev -- --help      # Run CLI in dev mode
npm test                   # Run tests
npm run build              # Build with tsup
```

## References

- [NIST AI 100-1: AI Risk Management Framework](https://www.nist.gov/artificial-intelligence/executive-order-safe-secure-and-trustworthy-artificial-intelligence)
- [OMB M-24-10: Advancing Governance, Innovation, and Risk Management for Agency Use of AI](https://www.whitehouse.gov/omb/information-regulatory-affairs/memoranda/)
- [EO 14110: Safe, Secure, and Trustworthy AI](https://www.whitehouse.gov/briefing-room/presidential-actions/2023/10/30/executive-order-on-the-safe-secure-and-trustworthy-development-and-use-of-artificial-intelligence/)

## License

MIT
