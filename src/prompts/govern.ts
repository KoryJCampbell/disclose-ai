import { input, select, confirm } from '@inquirer/prompts';
import { logger } from '../utils/logger.js';
import type { Govern } from '../schema/types.js';

export async function promptGovern(existing: Govern): Promise<Govern> {
  logger.heading('GOVERN — Policies, Processes & Oversight');
  logger.dim('NIST AI RMF: Establish governance structures for AI risk management\n');

  // Ownership
  logger.nist('GOVERN 1.1-1.2', 'Ownership & Accountability');
  const organization = await input({
    message: 'Organization responsible for this AI system:',
    default: existing.ownership.organization || undefined,
  });
  const model_owner = await input({
    message: 'Model owner (individual name):',
    default: existing.ownership.model_owner || undefined,
  });
  const email = await input({
    message: 'Contact email:',
    default: existing.ownership.email || undefined,
  });
  const chief_ai_officer = await input({
    message: 'Chief AI Officer (optional, press Enter to skip):',
    default: existing.ownership.chief_ai_officer || undefined,
  });
  const team = await input({
    message: 'Team or division (optional):',
    default: existing.ownership.team || undefined,
  });

  // Approval
  logger.nist('GOVERN 1.4-1.5', 'Approval & Review');
  const authority = await input({
    message: 'Approval authority (name/role):',
    default: existing.approval.authority || undefined,
  });
  const approval_date = await input({
    message: 'Approval date (YYYY-MM-DD, optional):',
    default: existing.approval.date || undefined,
  });
  const review_cadence = await select({
    message: 'Review cadence:',
    choices: [
      { value: 'monthly' as const, name: 'Monthly' },
      { value: 'quarterly' as const, name: 'Quarterly' },
      { value: 'semi-annually' as const, name: 'Semi-annually' },
      { value: 'annually' as const, name: 'Annually' },
    ],
    default: existing.approval.review_cadence,
  });
  const next_review = await input({
    message: 'Next scheduled review date (YYYY-MM-DD, optional):',
    default: existing.approval.next_review || undefined,
  });

  // Incident Response
  logger.nist('GOVERN 1.7', 'Incident Response');
  const has_incident_plan = await confirm({
    message: 'Does an incident response plan exist for this AI system?',
    default: existing.incident_response.has_plan,
  });
  let ir_contact: string | undefined;
  let escalation_path: string | undefined;
  let reporting_url: string | undefined;
  if (has_incident_plan) {
    ir_contact = await input({
      message: 'Incident response contact:',
      default: existing.incident_response.contact || undefined,
    });
    escalation_path = await input({
      message: 'Escalation path:',
      default: existing.incident_response.escalation_path || undefined,
    });
    reporting_url = await input({
      message: 'Reporting URL (optional):',
      default: existing.incident_response.reporting_url || undefined,
    });
  }

  // Supply Chain
  logger.nist('GOVERN 6.1-6.2', 'Supply Chain Risk');
  const hasThirdParty = await confirm({
    message: 'Does this system use third-party AI components?',
    default: existing.supply_chain.third_party_components.length > 0,
  });
  const third_party_components = hasThirdParty
    ? await promptComponents('third-party', existing.supply_chain.third_party_components)
    : existing.supply_chain.third_party_components;

  const hasOpenSource = await confirm({
    message: 'Does this system use open-source AI components?',
    default: existing.supply_chain.open_source_components.length > 0,
  });
  const open_source_components = hasOpenSource
    ? await promptComponents('open-source', existing.supply_chain.open_source_components)
    : existing.supply_chain.open_source_components;

  return {
    ownership: {
      organization,
      model_owner,
      email,
      ...(chief_ai_officer ? { chief_ai_officer } : {}),
      ...(team ? { team } : {}),
    },
    approval: {
      authority,
      review_cadence,
      ...(approval_date ? { date: approval_date } : {}),
      ...(next_review ? { next_review } : {}),
    },
    incident_response: {
      has_plan: has_incident_plan,
      ...(ir_contact ? { contact: ir_contact } : {}),
      ...(escalation_path ? { escalation_path } : {}),
      ...(reporting_url ? { reporting_url } : {}),
    },
    supply_chain: {
      third_party_components,
      open_source_components,
      data_providers: existing.supply_chain.data_providers,
    },
  };
}

async function promptComponents(
  label: string,
  existing: Array<{ name: string; version?: string; provider?: string; license?: string; risk_assessment?: string }>,
): Promise<Array<{ name: string; version?: string; provider?: string; license?: string; risk_assessment?: string }>> {
  const components = [...existing];
  let addMore = true;

  if (components.length > 0) {
    logger.dim(`  Existing ${label} components: ${components.map(c => c.name).join(', ')}`);
    addMore = await confirm({ message: `Add more ${label} components?`, default: false });
  }

  while (addMore) {
    const name = await input({ message: `  Component name (or empty to stop):` });
    if (!name) break;
    const version = await input({ message: `  Version (optional):` });
    const provider = await input({ message: `  Provider (optional):` });
    components.push({
      name,
      ...(version ? { version } : {}),
      ...(provider ? { provider } : {}),
    });
    addMore = await confirm({ message: `Add another ${label} component?`, default: false });
  }

  return components;
}
