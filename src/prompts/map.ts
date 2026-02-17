import { input, select, confirm } from '@inquirer/prompts';
import { logger } from '../utils/logger.js';
import type { MapSection } from '../schema/types.js';

export async function promptMap(existing: MapSection): Promise<MapSection> {
  logger.heading('MAP — Context & Risk Identification');
  logger.dim('NIST AI RMF: Identify context and risks related to the AI system\n');

  // Model Overview
  logger.nist('MAP 1.1', 'Model Overview');
  const name = await input({
    message: 'Model name:',
    default: existing.model_overview.name || undefined,
  });
  const version = await input({
    message: 'Model version:',
    default: existing.model_overview.version || undefined,
  });
  const type = await input({
    message: 'Model type (e.g., classification, NLP, computer vision):',
    default: existing.model_overview.type || undefined,
  });
  const architecture = await input({
    message: 'Architecture (e.g., transformer, CNN, random forest, optional):',
    default: existing.model_overview.architecture || undefined,
  });
  const description = await input({
    message: 'High-level description of what the model does:',
    default: existing.model_overview.description || undefined,
  });
  const framework = await input({
    message: 'ML framework (e.g., PyTorch, TensorFlow, optional):',
    default: existing.model_overview.framework || undefined,
  });
  const size = await input({
    message: 'Model size (parameters or file size, optional):',
    default: existing.model_overview.size || undefined,
  });
  const input_format = await input({
    message: 'Input format (optional):',
    default: existing.model_overview.input_format || undefined,
  });
  const output_format = await input({
    message: 'Output format (optional):',
    default: existing.model_overview.output_format || undefined,
  });

  // Intended Use
  logger.nist('MAP 2.1-2.3', 'Intended Use');
  const use_cases = await promptList('Primary use case', existing.intended_use.use_cases);
  const users = await promptList('Intended user group', existing.intended_use.users);
  const deployment_context = await input({
    message: 'Deployment context (e.g., production, research, internal):',
    default: existing.intended_use.deployment_context || undefined,
  });
  const interaction_mode = await select({
    message: 'Human interaction mode:',
    choices: [
      { value: 'autonomous' as const, name: 'Autonomous — system acts independently' },
      { value: 'semi-autonomous' as const, name: 'Semi-autonomous — system acts with occasional human review' },
      { value: 'human-in-the-loop' as const, name: 'Human-in-the-loop — human reviews all decisions' },
      { value: 'decision-support' as const, name: 'Decision support — system informs human decisions' },
    ],
    default: existing.intended_use.interaction_mode,
  });

  // Out of Scope
  logger.nist('MAP 2.2 / MAP 5.1', 'Out-of-Scope Uses & Misuse');
  const excluded_uses = await promptList('Excluded use case', existing.out_of_scope.excluded_uses);
  const misuse_risks = await promptList('Misuse risk', existing.out_of_scope.misuse_risks);
  const geographic_limitations = await input({
    message: 'Geographic limitations (optional):',
    default: existing.out_of_scope.geographic_limitations || undefined,
  });

  // Regulatory
  logger.nist('MAP 3.1 / GOVERN 1.1', 'Regulatory Context');
  const laws = await promptList('Applicable law/regulation', existing.regulatory.laws);
  const policies = await promptList('Applicable agency policy', existing.regulatory.policies);
  const ato_status = await select({
    message: 'Authority to Operate (ATO) status:',
    choices: [
      { value: 'none' as const, name: 'None' },
      { value: 'in_progress' as const, name: 'In Progress' },
      { value: 'granted' as const, name: 'Granted' },
      { value: 'expired' as const, name: 'Expired' },
    ],
    default: existing.regulatory.ato_status,
  });
  const rights_impacting = await confirm({
    message: 'Per OMB M-24-10: Does this AI system impact individual rights?',
    default: existing.regulatory.rights_impacting,
  });
  const safety_impacting = await confirm({
    message: 'Per OMB M-24-10: Does this AI system impact safety?',
    default: existing.regulatory.safety_impacting,
  });

  // Impact Assessment
  logger.nist('MAP 5.1-5.2', 'Impact Assessment');
  const affected_populations = await promptList('Affected population', existing.impact_assessment.affected_populations);
  const benefits = await promptList('Expected benefit', existing.impact_assessment.benefits);
  const harms = await promptList('Potential harm', existing.impact_assessment.harms);
  const severity = await select({
    message: 'Overall harm severity:',
    choices: [
      { value: 'negligible' as const, name: 'Negligible' },
      { value: 'minor' as const, name: 'Minor' },
      { value: 'moderate' as const, name: 'Moderate' },
      { value: 'significant' as const, name: 'Significant' },
      { value: 'critical' as const, name: 'Critical' },
    ],
    default: existing.impact_assessment.severity ?? 'moderate',
  });
  const likelihood = await select({
    message: 'Likelihood of harm:',
    choices: [
      { value: 'rare' as const, name: 'Rare' },
      { value: 'unlikely' as const, name: 'Unlikely' },
      { value: 'possible' as const, name: 'Possible' },
      { value: 'likely' as const, name: 'Likely' },
      { value: 'almost_certain' as const, name: 'Almost Certain' },
    ],
    default: existing.impact_assessment.likelihood ?? 'possible',
  });

  return {
    model_overview: {
      name,
      version,
      type,
      description,
      ...(architecture ? { architecture } : {}),
      ...(framework ? { framework } : {}),
      ...(size ? { size } : {}),
      ...(input_format ? { input_format } : {}),
      ...(output_format ? { output_format } : {}),
    },
    intended_use: {
      use_cases,
      users,
      deployment_context,
      interaction_mode,
    },
    out_of_scope: {
      excluded_uses,
      misuse_risks,
      ...(geographic_limitations ? { geographic_limitations } : {}),
    },
    regulatory: {
      laws,
      policies,
      ato_status,
      rights_impacting,
      safety_impacting,
    },
    impact_assessment: {
      affected_populations,
      benefits,
      harms,
      severity,
      likelihood,
    },
  };
}

async function promptList(label: string, existing: string[]): Promise<string[]> {
  const items = [...existing];
  if (items.length > 0) {
    logger.dim(`  Existing: ${items.join(', ')}`);
  }
  let addMore = items.length === 0
    ? true
    : await confirm({ message: `Add more ${label.toLowerCase()}s?`, default: false });

  while (addMore) {
    const value = await input({ message: `  ${label} (empty to stop):` });
    if (!value) break;
    items.push(value);
    addMore = await confirm({ message: `  Add another?`, default: true });
  }

  return items;
}
