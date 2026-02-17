import type { ModelCard } from './types.js';

export function createDefaultModelCard(): ModelCard {
  const now = new Date().toISOString().split('T')[0];
  return {
    metadata: {
      card_version: '1.0.0',
      created_date: now,
      last_updated: now,
      status: 'draft',
      classification: 'unclassified',
      schema_version: '1.0.0',
    },
    govern: {
      ownership: {
        organization: '',
        model_owner: '',
        email: '',
      },
      approval: {
        authority: '',
        review_cadence: 'annually',
      },
      incident_response: {
        has_plan: false,
      },
      supply_chain: {
        third_party_components: [],
        open_source_components: [],
        data_providers: [],
      },
    },
    map: {
      model_overview: {
        name: '',
        version: '',
        type: '',
        description: '',
      },
      intended_use: {
        use_cases: [],
        users: [],
        deployment_context: '',
        interaction_mode: 'human-in-the-loop',
      },
      out_of_scope: {
        excluded_uses: [],
        misuse_risks: [],
      },
      regulatory: {
        laws: [],
        policies: [],
        ato_status: 'none',
        rights_impacting: false,
        safety_impacting: false,
      },
      impact_assessment: {
        affected_populations: [],
        benefits: [],
        harms: [],
      },
    },
    measure: {
      training_data: {
        description: '',
        sources: [],
        known_biases: [],
        pii_present: false,
      },
      evaluation_data: {
        description: '',
      },
      performance_metrics: {
        metrics: [{ name: '', value: '' }],
        primary_metric: '',
        disaggregated_results: [],
      },
      bias_evaluation: {
        conducted: false,
        protected_attributes: [],
        fairness_metrics: [],
      },
      robustness: {
        adversarial_testing: false,
        stress_testing: false,
        data_drift_monitoring: false,
      },
    },
    manage: {
      limitations: {
        known_limitations: [],
        failure_modes: [],
        edge_cases: [],
      },
      mitigations: {
        strategies: [],
      },
      monitoring: {
        has_plan: false,
        alert_thresholds: [],
      },
      lifecycle: {
        retraining_triggers: [],
        retirement_criteria: [],
      },
    },
  };
}
