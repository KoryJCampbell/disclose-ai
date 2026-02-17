import { readFile } from 'node:fs/promises';
import { glob } from 'glob';
import { resolve, relative, basename } from 'node:path';
import { AI_SCAN_EXTENSIONS, AI_MAX_FILES, AI_MAX_LINES_PER_FILE, AI_MAX_CHAR_BUDGET } from '../constants.js';
import { logger } from '../utils/logger.js';

export interface RepoContext {
  files: Array<{
    path: string;
    category: string;
    content: string;
  }>;
  summary: string;
}

const CATEGORY_MAP: Record<string, string> = {
  '.py': 'python',
  '.ipynb': 'notebook',
  '.yaml': 'config',
  '.yml': 'config',
  '.json': 'config',
  '.toml': 'config',
  '.cfg': 'config',
  '.txt': 'requirements',
  '.md': 'documentation',
  '.rst': 'documentation',
};

/** Priority patterns — matched files get scanned first */
const PRIORITY_PATTERNS = [
  '**/README*',
  '**/model_card*',
  '**/MODEL_CARD*',
  '**/requirements*.txt',
  '**/setup.py',
  '**/pyproject.toml',
  '**/config*.yaml',
  '**/config*.yml',
  '**/train*.py',
  '**/eval*.py',
  '**/test*.py',
  '**/model*.py',
];

export async function analyzeRepo(repoPath: string): Promise<RepoContext> {
  logger.info('Scanning repository for ML artifacts...');

  const absPath = resolve(repoPath);

  // Glob for relevant files
  const patterns = AI_SCAN_EXTENSIONS.map(ext => `**/${ext}`);
  const allFiles = await glob(patterns, {
    cwd: absPath,
    ignore: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/__pycache__/**', '**/venv/**', '**/.venv/**'],
    absolute: true,
  });

  // Prioritize important files
  const prioritized = prioritizeFiles(allFiles, absPath);
  const selected = prioritized.slice(0, AI_MAX_FILES);
  logger.info(`Found ${allFiles.length} files, selected ${selected.length} for analysis`);

  // Read files within budget
  const files: RepoContext['files'] = [];
  let totalChars = 0;

  for (const filePath of selected) {
    if (totalChars >= AI_MAX_CHAR_BUDGET) break;

    try {
      const raw = await readFile(filePath, 'utf-8');
      const lines = raw.split('\n').slice(0, AI_MAX_LINES_PER_FILE).join('\n');
      const content = lines.slice(0, AI_MAX_CHAR_BUDGET - totalChars);
      totalChars += content.length;

      const ext = filePath.slice(filePath.lastIndexOf('.'));
      files.push({
        path: relative(absPath, filePath),
        category: CATEGORY_MAP[ext] ?? 'other',
        content,
      });
    } catch {
      // Skip unreadable files
    }
  }

  const summary = buildSummary(files);
  logger.success(`Analyzed ${files.length} files (${(totalChars / 1024).toFixed(1)}KB)`);

  return { files, summary };
}

function prioritizeFiles(files: string[], basePath: string): string[] {
  const prioritySet = new Set<string>();

  for (const file of files) {
    const rel = relative(basePath, file);
    const name = basename(file).toLowerCase();
    for (const pattern of PRIORITY_PATTERNS) {
      const simpleName = pattern.replace('**/', '').replace('*', '').toLowerCase();
      if (name.includes(simpleName) || rel.includes(simpleName)) {
        prioritySet.add(file);
      }
    }
  }

  const priority = files.filter(f => prioritySet.has(f));
  const rest = files.filter(f => !prioritySet.has(f));
  return [...priority, ...rest];
}

function buildSummary(files: RepoContext['files']): string {
  const categories = new Map<string, number>();
  for (const f of files) {
    categories.set(f.category, (categories.get(f.category) ?? 0) + 1);
  }

  const parts = Array.from(categories.entries()).map(([cat, count]) => `${count} ${cat}`);
  return `Repository contains: ${parts.join(', ')}`;
}
