/**
 * Maps model card fields to NIST AI RMF subcategory IDs.
 * Reference: NIST AI 100-1 (AI Risk Management Framework)
 *
 * Format: 'dotpath.to.field' → 'FUNCTION X.Y'
 */
export const NIST_FIELD_MAPPING: Record<string, NistSubcategory> = {
  // GOVERN
  'govern.ownership.organization': { id: 'GOVERN 1.1', description: 'Legal and regulatory requirements involving AI are understood, managed, and documented.' },
  'govern.ownership.model_owner': { id: 'GOVERN 1.2', description: 'The characteristics of trustworthy AI are integrated into organizational policies, processes, procedures, and practices.' },
  'govern.ownership.email': { id: 'GOVERN 1.2', description: 'The characteristics of trustworthy AI are integrated into organizational policies, processes, procedures, and practices.' },
  'govern.ownership.chief_ai_officer': { id: 'GOVERN 1.3', description: 'Processes, procedures, and practices are in place to determine the needed level of risk management activities.' },
  'govern.approval.authority': { id: 'GOVERN 1.4', description: 'The risk management process and its outcomes are established through transparent policies, procedures, and other controls.' },
  'govern.approval.review_cadence': { id: 'GOVERN 1.5', description: 'Ongoing monitoring and periodic review of the risk management process and its outcomes are planned.' },
  'govern.incident_response.has_plan': { id: 'GOVERN 1.7', description: 'Processes and procedures are in place for decommissioning and phasing out AI systems safely.' },
  'govern.incident_response.contact': { id: 'GOVERN 1.7', description: 'Processes and procedures are in place for decommissioning and phasing out AI systems safely.' },
  'govern.supply_chain.third_party_components': { id: 'GOVERN 6.1', description: 'Policies and procedures are in place that address AI risks associated with third-party entities.' },
  'govern.supply_chain.open_source_components': { id: 'GOVERN 6.2', description: 'Contingency processes are in place for third-party AI resources.' },

  // MAP
  'map.model_overview.name': { id: 'MAP 1.1', description: 'Intended purposes, potentially beneficial uses, context of use, and design assumptions and goals are understood.' },
  'map.model_overview.type': { id: 'MAP 1.1', description: 'Intended purposes, potentially beneficial uses, context of use, and design assumptions and goals are understood.' },
  'map.model_overview.description': { id: 'MAP 1.1', description: 'Intended purposes, potentially beneficial uses, context of use, and design assumptions and goals are understood.' },
  'map.model_overview.architecture': { id: 'MAP 1.6', description: 'System requirements (e.g., human oversight) are understood.' },
  'map.intended_use.use_cases': { id: 'MAP 2.1', description: 'The specific tasks and methods used to implement the tasks that the AI system will support are defined.' },
  'map.intended_use.users': { id: 'MAP 2.2', description: 'Information about the AI system\'s knowledge limits and how users and relevant AI actors are informed about them.' },
  'map.intended_use.deployment_context': { id: 'MAP 2.3', description: 'Scientific integrity and TEVV considerations are identified and documented.' },
  'map.intended_use.interaction_mode': { id: 'MAP 1.6', description: 'System requirements (e.g., human oversight) are understood.' },
  'map.out_of_scope.excluded_uses': { id: 'MAP 2.2', description: 'Information about the AI system\'s knowledge limits and how users and relevant AI actors are informed about them.' },
  'map.out_of_scope.misuse_risks': { id: 'MAP 5.1', description: 'Likelihood and magnitude of each identified impact based on expected use, past uses of similar systems, and other contextual factors.' },
  'map.regulatory.laws': { id: 'MAP 3.1', description: 'Potential benefits and costs are identified.' },
  'map.regulatory.policies': { id: 'MAP 3.1', description: 'Potential benefits and costs are identified.' },
  'map.regulatory.ato_status': { id: 'GOVERN 1.1', description: 'Legal and regulatory requirements involving AI are understood, managed, and documented.' },
  'map.regulatory.rights_impacting': { id: 'MAP 5.2', description: 'Practices and personnel for supporting regular engagement with relevant AI actors and integrating feedback.' },
  'map.regulatory.safety_impacting': { id: 'MAP 5.2', description: 'Practices and personnel for supporting regular engagement with relevant AI actors and integrating feedback.' },
  'map.impact_assessment.affected_populations': { id: 'MAP 5.1', description: 'Likelihood and magnitude of each identified impact based on expected use, past uses of similar systems, and other contextual factors.' },
  'map.impact_assessment.benefits': { id: 'MAP 3.1', description: 'Potential benefits and costs are identified.' },
  'map.impact_assessment.harms': { id: 'MAP 5.1', description: 'Likelihood and magnitude of each identified impact based on expected use, past uses of similar systems, and other contextual factors.' },

  // MEASURE
  'measure.training_data.description': { id: 'MEASURE 2.6', description: 'The AI system is evaluated regularly for safety risks.' },
  'measure.training_data.sources': { id: 'MEASURE 2.7', description: 'AI system security and resilience — as identified in the MAP function — are evaluated.' },
  'measure.training_data.known_biases': { id: 'MEASURE 2.11', description: 'Fairness and bias — as identified in the MAP function — are evaluated.' },
  'measure.training_data.pii_present': { id: 'MEASURE 2.10', description: 'Privacy risk of the AI system is evaluated.' },
  'measure.evaluation_data.description': { id: 'MEASURE 2.6', description: 'The AI system is evaluated regularly for safety risks.' },
  'measure.evaluation_data.methodology': { id: 'MEASURE 2.6', description: 'The AI system is evaluated regularly for safety risks.' },
  'measure.performance_metrics.metrics': { id: 'MEASURE 2.5', description: 'The AI system being tested is evaluated regularly.' },
  'measure.performance_metrics.primary_metric': { id: 'MEASURE 2.5', description: 'The AI system being tested is evaluated regularly.' },
  'measure.performance_metrics.disaggregated_results': { id: 'MEASURE 2.11', description: 'Fairness and bias — as identified in the MAP function — are evaluated.' },
  'measure.bias_evaluation.conducted': { id: 'MEASURE 2.11', description: 'Fairness and bias — as identified in the MAP function — are evaluated.' },
  'measure.bias_evaluation.methodology': { id: 'MEASURE 2.11', description: 'Fairness and bias — as identified in the MAP function — are evaluated.' },
  'measure.bias_evaluation.protected_attributes': { id: 'MEASURE 2.11', description: 'Fairness and bias — as identified in the MAP function — are evaluated.' },
  'measure.bias_evaluation.fairness_metrics': { id: 'MEASURE 2.11', description: 'Fairness and bias — as identified in the MAP function — are evaluated.' },
  'measure.robustness.adversarial_testing': { id: 'MEASURE 2.7', description: 'AI system security and resilience — as identified in the MAP function — are evaluated.' },
  'measure.robustness.stress_testing': { id: 'MEASURE 2.7', description: 'AI system security and resilience — as identified in the MAP function — are evaluated.' },
  'measure.robustness.data_drift_monitoring': { id: 'MEASURE 2.8', description: 'The AI system is evaluated for risks based on its deployment context.' },

  // MANAGE
  'manage.limitations.known_limitations': { id: 'MANAGE 2.2', description: 'Mechanisms are in place and applied to sustain the value of deployed AI systems.' },
  'manage.limitations.failure_modes': { id: 'MANAGE 2.2', description: 'Mechanisms are in place and applied to sustain the value of deployed AI systems.' },
  'manage.limitations.edge_cases': { id: 'MANAGE 2.2', description: 'Mechanisms are in place and applied to sustain the value of deployed AI systems.' },
  'manage.mitigations.strategies': { id: 'MANAGE 2.1', description: 'Resources required to manage AI risks are taken into account.' },
  'manage.mitigations.human_oversight_plan': { id: 'MANAGE 2.3', description: 'Procedures are followed to respond to and recover from a previously unknown risk.' },
  'manage.monitoring.has_plan': { id: 'MANAGE 4.1', description: 'Post-deployment AI system monitoring plans are implemented.' },
  'manage.monitoring.frequency': { id: 'MANAGE 4.1', description: 'Post-deployment AI system monitoring plans are implemented.' },
  'manage.monitoring.alert_thresholds': { id: 'MANAGE 4.1', description: 'Post-deployment AI system monitoring plans are implemented.' },
  'manage.lifecycle.update_frequency': { id: 'MANAGE 4.2', description: 'Measurable activities for continual improvements are integrated into AI system updates and include regular engagement with interested parties.' },
  'manage.lifecycle.retraining_triggers': { id: 'MANAGE 4.2', description: 'Measurable activities for continual improvements are integrated into AI system updates and include regular engagement with interested parties.' },
  'manage.lifecycle.retirement_criteria': { id: 'MANAGE 3.2', description: 'Pre-defined responses to risks are implemented and documented.' },
};

export interface NistSubcategory {
  id: string;
  description: string;
}

/** Get unique NIST subcategory IDs */
export function getUniqueSubcategories(): NistSubcategory[] {
  const seen = new Set<string>();
  const result: NistSubcategory[] = [];
  for (const sub of Object.values(NIST_FIELD_MAPPING)) {
    if (!seen.has(sub.id)) {
      seen.add(sub.id);
      result.push(sub);
    }
  }
  return result.sort((a, b) => a.id.localeCompare(b.id));
}

/** Get fields mapped to a specific NIST subcategory */
export function getFieldsForSubcategory(subcategoryId: string): string[] {
  return Object.entries(NIST_FIELD_MAPPING)
    .filter(([, sub]) => sub.id === subcategoryId)
    .map(([field]) => field);
}

/** Get the NIST function (GOVERN/MAP/MEASURE/MANAGE) for a field path */
export function getNistFunction(fieldPath: string): string | undefined {
  const sub = NIST_FIELD_MAPPING[fieldPath];
  return sub?.id.split(' ')[0];
}
