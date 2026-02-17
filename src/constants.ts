export const DEFAULT_YAML_FILENAME = 'disclosure.yaml';
export const DEFAULT_MD_FILENAME = 'DISCLOSURE.md';
export const DEFAULT_JSON_FILENAME = 'DISCLOSURE.json';
export const DEFAULT_HTML_FILENAME = 'DISCLOSURE.html';

export const NIST_FUNCTIONS = {
  GOVERN: {
    id: 'GOVERN',
    label: 'Govern',
    description: 'Policies, processes, procedures, and practices across the organization related to the mapping, measuring, and managing of AI risks are in place, transparent, and implemented effectively.',
  },
  MAP: {
    id: 'MAP',
    label: 'Map',
    description: 'Context is recognized and risks related to context are identified.',
  },
  MEASURE: {
    id: 'MEASURE',
    label: 'Measure',
    description: 'Identified risks are assessed, analyzed, or tracked.',
  },
  MANAGE: {
    id: 'MANAGE',
    label: 'Manage',
    description: 'Risks are prioritized and acted upon based on a projected impact.',
  },
} as const;

export const AI_SCAN_EXTENSIONS = [
  '*.py',
  '*.ipynb',
  '*.yaml',
  '*.yml',
  '*.json',
  '*.toml',
  '*.cfg',
  '*.txt',
  '*.md',
  '*.rst',
];

export const AI_MAX_FILES = 50;
export const AI_MAX_LINES_PER_FILE = 200;
export const AI_MAX_CHAR_BUDGET = 80_000;
