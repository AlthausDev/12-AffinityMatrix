import { readdir, readFile } from 'node:fs/promises';
import { dirname, relative, resolve, sep } from 'node:path';
import process from 'node:process';

const srcRoot = resolve('src');
const layerOrder = ['domain', 'application', 'infrastructure', 'app'];
const allowedDependencies = {
  domain: new Set(['domain']),
  application: new Set(['application', 'domain']),
  infrastructure: new Set(['infrastructure', 'application', 'domain']),
  app: new Set(layerOrder),
};
const browserGlobalPattern = /\b(?:window|document|navigator|localStorage|sessionStorage|indexedDB)\b|\bcrypto\s*\./u;
const importPattern = /(?:from\s+|import\s*\()\s*['"]([^'"]+)['"]/gu;

const files = await collectTypeScriptFiles(srcRoot);
const violations = [];

for (const file of files) {
  const sourceLayer = layerOf(file);
  if (!sourceLayer) continue;

  const content = await readFile(file, 'utf8');
  if ((sourceLayer === 'domain' || sourceLayer === 'application') && browserGlobalPattern.test(content)) {
    violations.push(`${display(file)}: ${sourceLayer} must not access browser globals directly.`);
  }

  for (const match of content.matchAll(importPattern)) {
    const specifier = match[1];
    if (!specifier?.startsWith('.')) continue;

    const target = resolve(dirname(file), specifier);
    const targetLayer = layerOf(target);
    if (targetLayer && !allowedDependencies[sourceLayer].has(targetLayer)) {
      violations.push(
        `${display(file)} imports ${specifier}: ${sourceLayer} cannot depend on ${targetLayer}.`,
      );
    }
  }
}

if (violations.length > 0) {
  console.error('Architecture boundary violations detected:\n');
  for (const violation of violations) console.error(`- ${violation}`);
  process.exitCode = 1;
} else {
  console.log(`Architecture boundaries verified across ${files.length} TypeScript files.`);
}

async function collectTypeScriptFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) return collectTypeScriptFiles(path);
      return entry.isFile() && entry.name.endsWith('.ts') ? [path] : [];
    }),
  );
  return nested.flat();
}

function layerOf(path) {
  const segments = relative(srcRoot, path).split(sep);
  return layerOrder.includes(segments[0]) ? segments[0] : undefined;
}

function display(path) {
  return relative(process.cwd(), path).split(sep).join('/');
}
