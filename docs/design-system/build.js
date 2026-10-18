// Builds tokens.css and standalone HTML for every component and page preview.
// Usage: node docs/design-system/build.js  → writes tokens.css and site/
const fs = require("fs"), path = require("path");
const ROOT = __dirname;
const T = JSON.parse(fs.readFileSync(path.join(ROOT, "tokens.json"), "utf8"));

function themeBlock(theme) {
  let out = "";
  for (const t of [...T.color.tokens, ...(T.shadow ? T.shadow.tokens : [])]) {
    const v = typeof t.value === "string" ? t.value : (t.value[theme] ?? t.value[T.color.themes[0].id]);
    out += `  --${t.name}: ${v};\n`;
  }
  return out;
}
const [first, ...rest] = T.color.themes.map(t => t.id);
let css = `/* ${T.name} — generated from tokens.json */\n:root, [data-theme="${first}"] {\n${themeBlock(first)}}\n`;
for (const id of rest) css += `[data-theme="${id}"] {\n${themeBlock(id)}}\n@media (prefers-color-scheme: ${id}) { :root:not([data-theme]) {\n${themeBlock(id)}} }\n`;
css += ":root {\n";
for (const fam of ["spacing", "radius", "layout"]) for (const t of (T[fam] || {}).tokens || []) css += `  --${t.name}: ${t.value};\n`;
for (const [k, v] of Object.entries(T.type.families)) css += `  --font-${k}: ${v};\n`;
css += "}\n";
for (const g of T.type.groups) for (const s of g.styles) {
  css += `.${s.name} { font-family: var(--font-${s.family || g.family}); font-size: ${s.fontSize}; line-height: ${s.lineHeight}; font-weight: ${s.fontWeight}${s.letterSpacing ? `; letter-spacing: ${s.letterSpacing}` : ""}; }\n`;
}
fs.writeFileSync(path.join(ROOT, "tokens.css"), css);

const SITE = path.join(ROOT, "site");
fs.mkdirSync(SITE, { recursive: true });
const cards = [];
for (const name of fs.readdirSync(path.join(ROOT, "components")).sort()) {
  const file = path.join(ROOT, "components", name, "preview.html");
  if (!fs.existsSync(file)) continue;
  const src = fs.readFileSync(file, "utf8");
  const marker = /@dsCard([^>]*)-->/.exec(src);
  const attr = k => { const m = new RegExp(k + '="([^"]*)"').exec(marker ? marker[1] : ""); return m ? m[1] : ""; };
  const isPage = marker && /\bpage\b/.test(marker[1]);
  const group = attr("group") || (name === "Cover" ? "Overview" : "Other");
  const head = (/<head>([\s\S]*?)<\/head>/.exec(src) || [, ""])[1].replace(/<title>[\s\S]*?<\/title>/, "");
  const body = (/<body>([\s\S]*?)<\/body>/.exec(src) || [, ""])[1];
  fs.writeFileSync(path.join(SITE, name + ".html"), `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=${isPage ? 1280 : "device-width, initial-scale=1"}">
<title>${attr("subtitle") || name} · Convie</title>
<link rel="stylesheet" href="../tokens.css">
<link rel="stylesheet" href="../components/bundle.css">
<script src="https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js"></script>
<script src="../components/bundle.js"></script>
${head}</head>
<body>
${body}
</body>
</html>
`);
  cards.push({ name, group, isPage, subtitle: attr("subtitle") });
}

const groups = {};
for (const c of cards) (groups[c.group] = groups[c.group] || []).push(c);
const order = Object.keys(groups).sort((a, b) => (a.startsWith("Pages") - b.startsWith("Pages")) || a.localeCompare(b));
fs.writeFileSync(path.join(SITE, "index.html"), `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Convie design system</title>
<link rel="stylesheet" href="../tokens.css"><link rel="stylesheet" href="../components/bundle.css">
<style>.ds-wrap{max-width:1100px;margin:0 auto;padding:40px 16px}.ds-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;margin:12px 0 32px}.ds-grid a{display:block;padding:14px 16px;border:1px solid var(--line);border-radius:var(--radius-md);background:var(--surface-raised);color:var(--ink);text-decoration:none}.ds-grid a:hover{border-color:var(--brand)}.ds-grid small{display:block;color:var(--ink-muted);margin-top:2px}</style>
</head>
<body><div class="ds-wrap">
<div class="cv-wordmark" style="font-size:40px">convie</div>
<p class="cv-muted">Design system and page designs for the multivendor marketplace. Brand rules: <a class="cv-link" href="../README.md">README.md</a>. Toggle theme: <a class="cv-link" href="#" onclick="var r=document.documentElement;r.dataset.theme=r.dataset.theme==='dark'?'light':'dark';return false">light / dark</a>.</p>
${order.map(g => `<h2 class="cv-h2">${g}</h2><div class="ds-grid">${groups[g].map(c => `<a href="${c.name}.html"><b>${c.name.replace(/^Page/, "")}</b>${c.subtitle ? `<small>${c.subtitle}</small>` : ""}</a>`).join("")}</div>`).join("\n")}
</div></body></html>
`);
console.log(`tokens.css + ${cards.length} pages in site/`);
