import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const htmlFiles = fs.readdirSync(root).filter(name => name.endsWith('.html')).sort();
const brokenReferences = [];
const duplicateDocumentIds = [];
const photoUsage = new Map();

for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const ids = [...html.matchAll(/\sid=["']([^"']+)["']/g)].map(match => match[1]);
  const counts = new Map();
  for (const id of ids) counts.set(id, (counts.get(id) || 0) + 1);
  for (const [id, count] of counts) {
    if (count > 1) duplicateDocumentIds.push({ file, id, count });
  }

  for (const match of html.matchAll(/data-photo-id=["']([^"']+)["']/g)) {
    const id = match[1];
    const uses = photoUsage.get(id) || [];
    uses.push(file);
    photoUsage.set(id, uses);
  }

  for (const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/g)) {
    const raw = match[1];
    if (!raw || /^(?:https?:|mailto:|tel:|data:|javascript:|#)/i.test(raw)) continue;
    const target = raw.split(/[?#]/)[0];
    if (!target) continue;
    const resolved = path.resolve(root, path.dirname(file), target);
    if (!fs.existsSync(resolved)) brokenReferences.push({ file, reference: raw });
  }
}

const duplicatePhotos = [...photoUsage.entries()]
  .filter(([, files]) => files.length > 1)
  .map(([photoId, files]) => ({ photoId, files }));

const requiredFiles = [
  'index.html',
  'assets/css/canby-v19-final-polish.css',
  'assets/css/canby-v20-medical-release.css',
  'assets/css/canby-cell-hero.css',
  'assets/js/canby-cell-hero.js',
  'assets/js/canby-v14-repair.js'
];

const result = {
  build: 'premium-v20-medical-release-20260819',
  generatedAt: new Date().toISOString(),
  htmlPages: htmlFiles.length,
  uniqueEditorialPhotos: photoUsage.size,
  editorialPhotoPlacements: [...photoUsage.values()].reduce((sum, files) => sum + files.length, 0),
  duplicateEditorialPhotos: duplicatePhotos,
  duplicateDocumentIds,
  brokenLocalReferences: brokenReferences,
  requiredFilesPresent: requiredFiles.every(file => fs.existsSync(path.join(root, file))),
  pass: brokenReferences.length === 0 && duplicateDocumentIds.length === 0 && duplicatePhotos.length === 0
};

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
if (!result.pass) process.exitCode = 1;
