// Downloads images referenced in content from the old WordPress site into public/media/
// and rewrites content to use local paths. Run once before retiring WordPress:  npm run fetch-media
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { globSync } from 'glob';

const RX = /https:\/\/thelittlegraduates\.in\/wp-content\/uploads\/([^\s"')]+)/g;
mkdirSync('public/media', { recursive: true });
const files = globSync('src/**/*.{md,json,astro}');
const seen = new Set();
for (const f of files) {
  let txt = readFileSync(f, 'utf-8');
  let changed = false;
  txt = txt.replace(RX, (url, path) => {
    const local = 'media/' + path.replace(/\//g, '_');
    if (!seen.has(url)) {
      seen.add(url);
      try {
        if (!existsSync('public/' + local)) execSync(`curl -fsSL '${url}' -o 'public/${local}'`);
        console.log('✓', local);
      } catch { console.error('✗ failed:', url); return url; }
    }
    changed = true;
    return '/' + local;
  });
  if (changed) writeFileSync(f, txt);
}
console.log('Done. Downloaded', seen.size, 'files.');
