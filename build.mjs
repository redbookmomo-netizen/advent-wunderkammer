import * as esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));

async function bundleEdition(entryRel, templateRel, outRel, label) {
  const result = await esbuild.build({
    entryPoints: [path.join(root, entryRel)],
    bundle: true,
    minify: true,
    format: 'iife',
    target: ['es2020'],
    write: false
  });

  const jsCode = result.outputFiles[0].text;
  const template = fs.readFileSync(path.join(root, templateRel), 'utf8');
  const safeJs = jsCode.replace(/<\/script>/gi, '<\\/script>');
  const finalHtml = template.replace(
    '<!-- BUNDLE_SCRIPT_PLACEHOLDER -->',
    () => `<script>\n${safeJs}\n</script>`
  );

  const outPath = path.join(root, outRel);
  fs.writeFileSync(outPath, finalHtml, 'utf8');
  console.log(`Built ${label}: ${outPath} (${(finalHtml.length / 1024).toFixed(1)} KB)`);
}

await bundleEdition('src/main.js', 'src/template.html', 'index.html', 'Classic v1 (Illustrated Edition)');
await bundleEdition('src/main3d.js', 'src/template3d.html', 'spatial3d.html', 'Spatial v2 (Three.js 3D Edition)');
fs.writeFileSync(path.join(root, '.nojekyll'), '', 'utf8');
