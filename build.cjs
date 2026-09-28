'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = __dirname;
const files = fs.readdirSync(root).filter(file => /\.(html|css|js)$/.test(file));
const pages = new Map();
for (const file of files.filter(file => file.endsWith('.js'))) {
  execFileSync(process.execPath, ['--check', path.join(root, file)], { stdio: 'inherit' });
}
for (const file of files.filter(file => file.endsWith('.html'))) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  if (new Set(ids).size !== ids.length) throw new Error(`IDs duplicados em ${file}.`);
  pages.set(file, { html, ids });
}
function checkReference(value, from) {
  if (/^(https?:|data:|mailto:|tel:|\/\/)/.test(value)) return;
  const url = new URL(value, `https://local.invalid/${from}`);
  const target = decodeURIComponent(url.pathname.slice(1));
  if (!fs.existsSync(path.join(root, target))) throw new Error(`Arquivo não encontrado em ${from}: ${value}`);
  if (url.hash && pages.has(target) && !pages.get(target).ids.includes(decodeURIComponent(url.hash.slice(1)))) {
    throw new Error(`Âncora não encontrada em ${from}: ${value}`);
  }
}
for (const [file, { html }] of pages) {
  for (const [, , value] of html.matchAll(/\b(src|href|poster)="([^"]+)"/g)) checkReference(value, file);
}
for (const file of files.filter(file => file.endsWith('.css'))) {
  const css = fs.readFileSync(path.join(root, file), 'utf8');
  for (const [, value] of css.matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g)) checkReference(value, file);
}
const dist = path.join(root, 'dist');
fs.mkdirSync(dist, { recursive: true });
for (const file of files) {
  fs.copyFileSync(path.join(root, file), path.join(dist, file));
}
fs.cpSync(path.join(root, 'assets'), path.join(dist, 'assets'), { recursive: true });
console.log(`Build concluído: ${pages.size} páginas, JavaScript válido, arquivos e âncoras entre páginas verificados. Arquivos em dist/.`);
