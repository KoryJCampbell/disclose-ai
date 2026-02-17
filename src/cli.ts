#!/usr/bin/env node
import { Command } from 'commander';
import { getVersion } from './utils/version.js';
import { initCommand } from './commands/init.js';
import { generateCommand } from './commands/generate.js';
import { validateCommand } from './commands/validate.js';

const program = new Command();

const version = await getVersion();

program
  .name('modelcard')
  .description('NIST AI RMF Model Card Generator — Generate compliant AI system documentation')
  .version(version);

program
  .command('init')
  .description('Create a starter modelcard.yaml with NIST AI RMF section comments')
  .option('-d, --dir <path>', 'Output directory', process.cwd())
  .option('-q, --quick', 'Quick-fill mode: prompt for basic fields')
  .action(initCommand);

program
  .command('generate')
  .description('Generate a model card via interactive prompts or from existing YAML')
  .option('-f, --format <format>', 'Output format: markdown, json, html', 'markdown')
  .option('-i, --input <path>', 'Path to existing modelcard.yaml')
  .option('-o, --output <path>', 'Output file path')
  .option('-d, --dir <path>', 'Working directory', process.cwd())
  .option('--ai', 'Use AI-assisted drafting (requires @anthropic-ai/sdk)')
  .option('--repo <path>', 'Repository path for AI analysis', process.cwd())
  .option('--no-interactive', 'Skip interactive prompts (use with --input)')
  .action(generateCommand);

program
  .command('validate')
  .description('Validate a modelcard.yaml against the schema and report NIST coverage')
  .option('-i, --input <path>', 'Path to modelcard.yaml')
  .option('-d, --dir <path>', 'Working directory', process.cwd())
  .option('--strict', 'Fail on warnings (missing optional fields)')
  .action(validateCommand);

program.parse();
