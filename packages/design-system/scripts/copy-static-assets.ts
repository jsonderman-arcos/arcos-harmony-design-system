import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '..');
const SRC_THEME = path.join(ROOT, 'src', 'theme');
const SRC_TAILWIND = path.join(ROOT, 'src', 'tailwind');
const DIST_THEME = path.join(ROOT, 'dist', 'theme');
const DIST_TAILWIND = path.join(ROOT, 'dist', 'tailwind');

function copyMatching(srcDir: string, destDir: string, predicate: (file: string) => boolean) {
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir)) {
    const sourcePath = path.join(srcDir, entry);
    const destPath = path.join(destDir, entry);
    const stat = fs.statSync(sourcePath);
    if (stat.isDirectory()) {
      copyMatching(sourcePath, destPath, predicate);
      continue;
    }
    if (!predicate(entry)) continue;
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(sourcePath, destPath);
  }
}

copyMatching(SRC_THEME, DIST_THEME, (file) => /\.(json|css)$/i.test(file));
copyMatching(SRC_TAILWIND, DIST_TAILWIND, (file) => file.endsWith('.cjs'));

console.log('Copied theme JSON/CSS and tailwind preset into dist/.');
