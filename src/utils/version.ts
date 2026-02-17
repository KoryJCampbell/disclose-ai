import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { getPackageRoot } from './files.js';

let cachedVersion: string | undefined;

export async function getVersion(): Promise<string> {
  if (cachedVersion) return cachedVersion;
  try {
    const pkgPath = resolve(getPackageRoot(), 'package.json');
    const pkg = JSON.parse(await readFile(pkgPath, 'utf-8'));
    cachedVersion = pkg.version as string;
    return cachedVersion;
  } catch {
    return '0.0.0';
  }
}
