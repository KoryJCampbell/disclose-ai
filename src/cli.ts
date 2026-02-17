import { Command } from 'commander';
import { getVersion } from './utils/version.js';
import { initCommand } from './commands/init.js';
import { generateCommand } from './commands/generate.js';
import { validateCommand } from './commands/validate.js';

const program = new Command();

const version = await getVersion();

program
  .name('disclose-ai')
  .description('DiscloseAI — AI compliance reports that write themselves')
  .version(version);

program
  .command('init')
  .description('Create a starter disclosure.yaml with NIST AI RMF section comments')
  .option('-d, --dir <path>', 'Output directory', process.cwd())
  .option('-q, --quick', 'Quick-fill mode: prompt for basic fields')
  .action(initCommand);

program
  .command('generate')
  .description('Generate an AI disclosure via interactive prompts or from existing YAML')
  .option('-f, --format <format>', 'Output format: markdown, json, html', 'markdown')
  .option('-i, --input <path>', 'Path to existing disclosure.yaml')
  .option('-o, --output <path>', 'Output file path')
  .option('-d, --dir <path>', 'Working directory', process.cwd())
  .option('--ai', 'Use AI-assisted drafting (requires @anthropic-ai/sdk)')
  .option('--repo <path>', 'Repository path for AI analysis', process.cwd())
  .option('--no-interactive', 'Skip interactive prompts (use with --input)')
  .action(generateCommand);

program
  .command('validate')
  .description('Validate a disclosure.yaml against the schema and report NIST coverage')
  .option('-i, --input <path>', 'Path to disclosure.yaml')
  .option('-d, --dir <path>', 'Working directory', process.cwd())
  .option('--strict', 'Fail on warnings (missing optional fields)')
  .action(validateCommand);

program.parse();
