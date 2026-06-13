const { transformFileSync } = require('@babel/core');
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, 'dist');

// Ensure dist exists
if (!fs.existsSync(DIST)) fs.mkdirSync(DIST);

// 1. Compile all .jsx files to .js in dist/
const jsxFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.jsx'));
console.log(`Compiling ${jsxFiles.length} JSX files...`);
for (const file of jsxFiles) {
  const result = transformFileSync(path.join(__dirname, file), {
    presets: ['@babel/preset-react'],
  });
  const outName = file.replace(/\.jsx$/, '.js');
  // Wrap in IIFE to replicate Babel standalone's eval scoping —
  // without this, const/let declarations conflict across files
  const wrapped = `(function(){\n${result.code}\n}).call(this);`;
  fs.writeFileSync(path.join(DIST, outName), wrapped);
  console.log(`  ${file} → ${outName}`);
}

// 2. Copy plain JS files
const jsFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.js') && f !== 'build.js');
for (const file of jsFiles) {
  fs.copyFileSync(path.join(__dirname, file), path.join(DIST, file));
  console.log(`  copied ${file}`);
}

// 3. Process HTML files — remove Babel standalone, change script types
// Map source → output names (lowercase for Vercel case-sensitivity)
const htmlFiles = [
  { src: 'index.html', out: 'index.html' },
  { src: 'Desktop.html', out: 'desktop.html' },
];
for (const { src: srcName, out: outName } of htmlFiles) {
  const srcPath = path.join(__dirname, srcName);
  if (!fs.existsSync(srcPath)) continue;
  let html = fs.readFileSync(srcPath, 'utf8');
  // Remove Babel standalone script tag
  html = html.replace(/<script[^>]*babel\.min\.js[^>]*><\/script>\s*/g, '');
  // Change type="text/babel" src="foo.jsx" → src="foo.js"
  html = html.replace(/type="text\/babel"\s+src="([^"]+)\.jsx(\?[^"]*)?\"/g, 'src="$1.js"');
  // Also handle src="foo.jsx" type="text/babel" (reversed order)
  html = html.replace(/src="([^"]+)\.jsx(\?[^"]*)?\"\s+type="text\/babel\"/g, 'src="$1.js"');
  fs.writeFileSync(path.join(DIST, outName), html);
  console.log(`  ${srcName} → ${outName}`);
}

// 4. Copy static HTML files (no Babel processing needed)
const staticHtml = ['deck.html'];
for (const file of staticHtml) {
  const src = path.join(__dirname, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(DIST, file));
    console.log(`  copied ${file}`);
  }
}

// 5. Copy asset directories
const assetDirs = ['ads', 'assets', 'brand', 'content', 'logos', 'lots', 'sets', 'screenshots', 'shots', 'uploads'];
for (const dir of assetDirs) {
  const src = path.join(__dirname, dir);
  if (!fs.existsSync(src)) continue;
  copyDirSync(src, path.join(DIST, dir));
  console.log(`  copied ${dir}/`);
}

console.log('Build complete!');

function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}
