import { select } from '@inquirer/prompts';
import { logger } from '../utils/logger.js';
import { analyzeRepo } from './analyzer.js';
import { buildSystemPrompt, buildUserPrompt } from './prompts.js';
import { mergeModelCards } from './merger.js';
import { ModelCardSchema } from '../schema/modelcard.schema.js';
import type { ModelCard } from '../schema/types.js';

export async function analyzeAndDraft(
  repoPath: string,
  existing?: ModelCard,
): Promise<ModelCard> {
  // 1. Scan repo
  const context = await analyzeRepo(repoPath);

  if (context.files.length === 0) {
    logger.warn('No ML artifacts found in repository. Falling back to interactive prompts.');
    const { runAllPrompts } = await import('../prompts/index.js');
    const { createDefaultModelCard } = await import('../schema/defaults.js');
    return runAllPrompts(existing ?? createDefaultModelCard());
  }

  // 2. Dynamic import of Anthropic SDK
  logger.info('Calling Claude API for AI-assisted drafting...');
  let Anthropic: typeof import('@anthropic-ai/sdk').default;
  try {
    const sdk = await import('@anthropic-ai/sdk');
    Anthropic = sdk.default;
  } catch {
    throw new Error(
      'Cannot find module @anthropic-ai/sdk. Install with: npm install @anthropic-ai/sdk',
    );
  }

  // 3. Call Claude
  const client = new Anthropic();
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(context);

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 8192,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  // 4. Parse response
  const textBlock = response.content.find(b => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text response from Claude API');
  }

  let aiData: ModelCard;
  try {
    const parsed = JSON.parse(textBlock.text);
    const result = ModelCardSchema.safeParse(parsed);
    if (result.success) {
      aiData = result.data;
    } else {
      logger.warn('AI response had validation issues, using best-effort parse');
      aiData = parsed as ModelCard;
    }
  } catch {
    throw new Error('Failed to parse AI response as JSON');
  }

  logger.success('AI draft generated');

  // 5. Merge with existing
  const merged = mergeModelCards(existing, aiData);

  // 6. Human review
  return await humanReview(merged);
}

async function humanReview(data: ModelCard): Promise<ModelCard> {
  logger.heading('AI Draft Review');
  logger.info('Review each section of the AI-generated draft.\n');

  const sections = [
    { key: 'govern', label: 'GOVERN' },
    { key: 'map', label: 'MAP' },
    { key: 'measure', label: 'MEASURE' },
    { key: 'manage', label: 'MANAGE' },
  ] as const;

  for (const section of sections) {
    const sectionData = data[section.key];
    logger.nist(section.label, 'Section preview:');
    console.log(JSON.stringify(sectionData, null, 2).slice(0, 500) + '...\n');

    const action = await select({
      message: `${section.label} — what would you like to do?`,
      choices: [
        { value: 'accept', name: 'Accept as-is' },
        { value: 'skip', name: 'Skip (keep empty/defaults)' },
        { value: 'edit', name: 'Edit interactively' },
      ],
    });

    if (action === 'edit') {
      const { runAllPrompts } = await import('../prompts/index.js');
      // Re-run prompts for just this section with AI data as defaults
      const fullData = await runAllPrompts(data);
      Object.assign(data, { [section.key]: fullData[section.key] });
    } else if (action === 'skip') {
      // Keep existing data
    }
    // accept: keep AI data as-is
  }

  return data;
}
