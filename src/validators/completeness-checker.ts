import type { ModelCard } from '../schema/types.js';

export interface CompletenessResult {
  required: { filled: number; total: number; percent: number };
  optional: { filled: number; total: number; percent: number };
  missing: string[];
}

// Fields that MUST be filled for a compliant model card
const REQUIRED_FIELDS: string[] = [
  'metadata.card_version',
  'metadata.created_date',
  'metadata.status',
  'govern.ownership.organization',
  'govern.ownership.model_owner',
  'govern.ownership.email',
  'govern.approval.authority',
  'govern.approval.review_cadence',
  'govern.incident_response.has_plan',
  'map.model_overview.name',
  'map.model_overview.version',
  'map.model_overview.type',
  'map.model_overview.description',
  'map.intended_use.use_cases',
  'map.intended_use.users',
  'map.intended_use.deployment_context',
  'map.intended_use.interaction_mode',
  'map.regulatory.rights_impacting',
  'map.regulatory.safety_impacting',
  'measure.training_data.description',
  'measure.evaluation_data.description',
  'measure.performance_metrics.metrics',
  'measure.performance_metrics.primary_metric',
  'measure.bias_evaluation.conducted',
  'manage.limitations.known_limitations',
  'manage.monitoring.has_plan',
];

const OPTIONAL_FIELDS: string[] = [
  'metadata.classification',
  'govern.ownership.chief_ai_officer',
  'govern.ownership.team',
  'govern.approval.date',
  'govern.approval.next_review',
  'govern.incident_response.contact',
  'govern.incident_response.escalation_path',
  'govern.supply_chain.third_party_components',
  'govern.supply_chain.open_source_components',
  'map.model_overview.architecture',
  'map.model_overview.framework',
  'map.model_overview.size',
  'map.model_overview.input_format',
  'map.model_overview.output_format',
  'map.out_of_scope.excluded_uses',
  'map.out_of_scope.misuse_risks',
  'map.regulatory.laws',
  'map.regulatory.policies',
  'map.regulatory.ato_status',
  'map.impact_assessment.affected_populations',
  'map.impact_assessment.benefits',
  'map.impact_assessment.harms',
  'map.impact_assessment.severity',
  'map.impact_assessment.likelihood',
  'measure.training_data.sources',
  'measure.training_data.known_biases',
  'measure.training_data.pii_present',
  'measure.evaluation_data.methodology',
  'measure.performance_metrics.disaggregated_results',
  'measure.bias_evaluation.methodology',
  'measure.bias_evaluation.protected_attributes',
  'measure.bias_evaluation.fairness_metrics',
  'measure.robustness.adversarial_testing',
  'measure.robustness.stress_testing',
  'measure.robustness.data_drift_monitoring',
  'manage.limitations.failure_modes',
  'manage.limitations.edge_cases',
  'manage.mitigations.strategies',
  'manage.mitigations.human_oversight_plan',
  'manage.monitoring.frequency',
  'manage.monitoring.alert_thresholds',
  'manage.lifecycle.update_frequency',
  'manage.lifecycle.retraining_triggers',
  'manage.lifecycle.retirement_criteria',
];

export function checkCompleteness(data: unknown): CompletenessResult {
  const obj = data as Record<string, unknown>;
  const missing: string[] = [];
  let requiredFilled = 0;
  let optionalFilled = 0;

  for (const field of REQUIRED_FIELDS) {
    if (isFieldFilled(obj, field)) {
      requiredFilled++;
    } else {
      missing.push(field);
    }
  }

  for (const field of OPTIONAL_FIELDS) {
    if (isFieldFilled(obj, field)) {
      optionalFilled++;
    }
  }

  return {
    required: {
      filled: requiredFilled,
      total: REQUIRED_FIELDS.length,
      percent: Math.round((requiredFilled / REQUIRED_FIELDS.length) * 100),
    },
    optional: {
      filled: optionalFilled,
      total: OPTIONAL_FIELDS.length,
      percent: Math.round((optionalFilled / OPTIONAL_FIELDS.length) * 100),
    },
    missing,
  };
}

function isFieldFilled(obj: Record<string, unknown>, path: string): boolean {
  const parts = path.split('.');
  let current: unknown = obj;

  for (const part of parts) {
    if (current == null || typeof current !== 'object') return false;
    current = (current as Record<string, unknown>)[part];
  }

  if (current == null) return false;
  if (typeof current === 'string') return current.length > 0;
  if (typeof current === 'boolean') return true; // booleans are always "filled"
  if (Array.isArray(current)) return current.length > 0;
  if (typeof current === 'number') return true;

  return true;
}
