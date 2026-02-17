import { zodToJsonSchema } from 'zod-to-json-schema';
import { ModelCardSchema } from '../schema/modelcard.schema.js';
import type { RepoContext } from './analyzer.js';

export function buildSystemPrompt(): string {
  const schema = zodToJsonSchema(ModelCardSchema, 'ModelCard');
  return `You are an AI governance expert specializing in NIST AI Risk Management Framework (AI RMF).
Your task is to analyze a machine learning repository and generate an AI disclosure that complies with NIST AI RMF and OMB M-24-10.

The model card must cover four NIST AI RMF functions:
1. GOVERN — Policies, processes, and oversight structures
2. MAP — Context identification, intended use, and risk mapping
3. MEASURE — Risk assessment, performance metrics, and bias evaluation
4. MANAGE — Risk mitigation, monitoring, and lifecycle management

Output a JSON object matching this schema:

${JSON.stringify(schema, null, 2)}

Guidelines:
- Fill in as many fields as you can infer from the repository contents
- For fields you cannot determine, use reasonable defaults or leave empty strings/arrays
- Be specific about model architecture, training data, and performance when visible in code
- Flag potential risks and biases based on the model type and domain
- Use "draft" status for metadata
- Set rights_impacting and safety_impacting based on the model's apparent use case
- Include relevant federal regulations if the domain suggests government use

Output ONLY valid JSON. No markdown, no explanation.`;
}

export function buildUserPrompt(context: RepoContext): string {
  const fileContents = context.files
    .map(f => `### ${f.path} (${f.category})\n\`\`\`\n${f.content}\n\`\`\``)
    .join('\n\n');

  return `Analyze this ML repository and generate a NIST AI RMF-compliant AI disclosure.

${context.summary}

## Repository Files

${fileContents}

Generate the disclosure JSON now.`;
}
