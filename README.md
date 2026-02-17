# DiscloseAI

**AI compliance reports that write themselves.** NIST AI RMF-aligned disclosure generator for federal AI systems.

## Why

The government requires a safety report for every AI system (OMB M-24-10). Most teams are doing this in Word docs and spreadsheets. DiscloseAI generates compliant disclosures in 10 minutes — think TurboTax for federal AI compliance paperwork.

## Features

- **Interactive prompts** — Walk through each NIST AI RMF section (works air-gapped)
- **AI-assisted** — Optional `--ai` flag uses Claude API to analyze a model repo and auto-draft sections
- **NIST AI RMF aligned** — Sections map to Govern, Map, Measure, Manage functions
- **Multiple formats** — Markdown (primary), JSON, HTML output
- **Validation** — Schema validation + NIST subcategory coverage scoring
- **Traceability matrix** — Auto-generated appendix mapping fields to 28 NIST subcategories

## Quick Start

```bash
# Initialize a starter template
npx @koryjcampbell/disclose-ai init

# Generate via interactive prompts
npx @koryjcampbell/disclose-ai generate

# Validate and check NIST coverage
npx @koryjcampbell/disclose-ai validate
```

## Installation

```bash
npm install -g @koryjcampbell/disclose-ai

# Or use without installing
npx @koryjcampbell/disclose-ai
```

For AI-assist mode, install the optional peer dependency:

```bash
npm install @anthropic-ai/sdk
```

## Commands

### `disclose-ai init`

Creates a starter `disclosure.yaml` with NIST AI RMF section comments.

```bash
disclose-ai init              # Create in current directory
disclose-ai init --quick      # Create with quick-fill prompts for basic fields
disclose-ai init --dir ./out  # Create in specified directory
```

### `disclose-ai generate`

Generates a disclosure via interactive prompts or from existing YAML.

```bash
disclose-ai generate                    # Interactive prompts → Markdown
disclose-ai generate --format json      # Output as JSON
disclose-ai generate --format html      # Output as HTML
disclose-ai generate --input data.yaml  # From existing YAML (skip prompts with --no-interactive)
disclose-ai generate --ai               # AI-assisted drafting via Claude API
disclose-ai generate --ai --repo ./ml   # Scan specific repo directory
```

### `disclose-ai validate`

Validates a `disclosure.yaml` against the schema and reports NIST coverage.

```bash
disclose-ai validate                    # Validate in current directory
disclose-ai validate --input data.yaml  # Validate specific file
disclose-ai validate --strict           # Fail on warnings (missing optional fields)
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

The disclosure sections map directly to the four NIST AI RMF functions:

| Function | Section | Subcategories |
|----------|---------|---------------|
| **GOVERN** | Ownership, Approval, Incident Response, Supply Chain | GOVERN 1.1–1.7, 6.1–6.2 |
| **MAP** | Model Overview, Intended Use, Out-of-Scope, Regulatory, Impact | MAP 1.1–5.2 |
| **MEASURE** | Training Data, Evaluation, Metrics, Bias, Robustness | MEASURE 2.5–2.11 |
| **MANAGE** | Limitations, Mitigations, Monitoring, Lifecycle | MANAGE 2.1–4.2 |

Each generated disclosure includes an **Appendix A: NIST AI RMF Traceability Matrix** showing which subcategories are addressed and overall coverage percentage.

## AI-Assist Mode

When using `--ai`, the tool:

1. **Scans** the repository for ML artifacts (Python files, notebooks, configs, READMEs)
2. **Sends** file contents to Claude API with NIST context and JSON schema
3. **Generates** a draft disclosure with as many fields filled as possible
4. **Presents** each section for human review: accept, edit interactively, or skip

The Claude API SDK is an **optional peer dependency** — the tool works fully without it. Air-gapped environments use interactive prompts only.

```bash
# Requires ANTHROPIC_API_KEY environment variable
export ANTHROPIC_API_KEY=sk-ant-...
disclose-ai generate --ai --repo /path/to/ml-repo
```

## Schema

The `disclosure.yaml` schema covers ~100 fields across 5 top-level sections:

- **metadata** — Version, dates, status, classification
- **govern** — Ownership, approval, incident response, supply chain
- **map** — Model overview, intended use, out-of-scope, regulatory, impact
- **measure** — Training data, evaluation, metrics, bias, robustness
- **manage** — Limitations, mitigations, monitoring, lifecycle

The full Zod schema is exported as a TypeScript type for programmatic use:

```typescript
import { ModelCardSchema, type ModelCard } from '@koryjcampbell/disclose-ai';
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
