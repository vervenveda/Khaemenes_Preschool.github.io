import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const problems = [];
const notes = [];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if ([".git", "node_modules"].includes(entry.name)) return [];
    const target = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function relative(file) {
  return path.relative(root, file).split(path.sep).join("/");
}

function cleanText(value) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

const files = walk(root);
const htmlFiles = files.filter(file => file.endsWith(".html"));
const jsFiles = files.filter(file => file.endsWith(".js"));
let buttonCount = 0;
let localReferenceCount = 0;
let inlineScriptCount = 0;

for (const file of jsFiles) {
  try {
    const source = fs.readFileSync(file, "utf8");
    const parseable = /^\s*export\s/m.test(source)
      ? source
          .replace(/^\s*export\s+default\s+/gm, "")
          .replace(/^\s*export\s+(?=(?:const|let|var|function|class)\b)/gm, "")
      : source;
    new vm.Script(parseable, { filename: relative(file) });
  } catch (error) {
    problems.push(`${relative(file)}: JavaScript syntax error: ${error.message}`);
  }
}

for (const file of htmlFiles) {
  const source = fs.readFileSync(file, "utf8");
  const fileName = relative(file);
  const ids = [...source.matchAll(/\bid=["']([^"']+)["']/gi)].map(match => match[1]);
  const idSet = new Set(ids);

  for (const id of new Set(ids.filter((id, index) => ids.indexOf(id) !== index))) {
    problems.push(`${fileName}: duplicate HTML id "${id}".`);
  }

  for (const match of source.matchAll(/href=["']#([^"']+)["']/gi)) {
    if (match[1] && !idSet.has(match[1])) {
      problems.push(`${fileName}: unresolved local anchor #${match[1]}.`);
    }
  }

  for (const match of source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attributes = match[1];
    if (/\bsrc\s*=/.test(attributes) || /type=["'](?:application\/ld\+json|application\/json)["']/i.test(attributes)) continue;
    inlineScriptCount += 1;
    try {
      new vm.Script(match[2], { filename: `${fileName}:inline-${inlineScriptCount}` });
    } catch (error) {
      problems.push(`${fileName}: inline JavaScript syntax error: ${error.message}`);
    }
  }

  for (const match of source.matchAll(/\b(href|src)=["']([^"']+)["']/gi)) {
    const value = match[2].trim();
    if (!value || value.includes("${") || value.startsWith("#") || value.startsWith("/") || /^(?:https?:|data:|mailto:|tel:|javascript:|about:)/i.test(value)) continue;
    const pathPart = value.split(/[?#]/)[0];
    if (!pathPart) continue;
    let target = path.resolve(path.dirname(file), pathPart);
    if (pathPart.endsWith("/")) target = path.join(target, "index.html");
    localReferenceCount += 1;
    if (!fs.existsSync(target)) {
      problems.push(`${fileName}: missing ${match[1].toLowerCase()} target "${value}".`);
    }
  }

  for (const match of source.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)) {
    buttonCount += 1;
    const attributes = match[1];
    const label = cleanText(match[2]);
    if (!label && !/\baria-label\s*=|\btitle\s*=/i.test(attributes)) {
      problems.push(`${fileName}: button ${buttonCount} has no accessible name.`);
    }
  }

  if (!source.includes("preschool-playful-theme.css")) {
    problems.push(`${fileName}: playful Preschool theme is not loaded.`);
  }

  if (fileName.startsWith("apps/") && !source.includes("preschool-learner-storage.js")) {
    problems.push(`${fileName}: learner-scoped storage boundary is not loaded.`);
  }

  if (/actions\.google\.com\/sounds|artist1970\.github\.io\/Eiren\.github\.io\/eiren-adapter\.js/.test(source)) {
    problems.push(`${fileName}: forbidden remote runtime dependency remains.`);
  }
}

const primaryCatalog = path.join(root, "assets", "preschool-catalog.js");
const mirrorCatalog = path.join(root, "preschool-catalog.js");
if (!fs.readFileSync(primaryCatalog).equals(fs.readFileSync(mirrorCatalog))) {
  problems.push("The two Preschool catalog copies differ.");
}

const catalogSource = fs.readFileSync(primaryCatalog, "utf8");
const catalogFiles = [...catalogSource.matchAll(/"file"\s*:\s*"([^"]+)"/g)].map(match => match[1]);
if (!catalogFiles.length) problems.push("The Preschool catalog has no app entries.");
for (const appFile of catalogFiles) {
  const appPath = path.join(root, "apps", appFile);
  if (!fs.existsSync(appPath) || !fs.statSync(appPath).isFile()) {
    problems.push(`Catalog entry is missing its app: ${appFile}.`);
  }
}

const bilingualSource = fs.readFileSync(path.join(root, "apps", "ABC_bilingual_index.html"), "utf8");
if (!/Bilingual ABC Garden/.test(bilingualSource) || /Cosmic Arabic Alphabet Quest/.test(bilingualSource)) {
  problems.push("Bilingual ABC catalog identity has drifted from its actual lesson content.");
}

notes.push(`HTML pages: ${htmlFiles.length}`);
notes.push(`JavaScript files parsed: ${jsFiles.length}`);
notes.push(`Inline scripts parsed: ${inlineScriptCount}`);
notes.push(`Static buttons checked: ${buttonCount}`);
notes.push(`Local href/src targets checked: ${localReferenceCount}`);
notes.push(`Catalog apps checked: ${catalogFiles.length}`);

for (const note of notes) console.log(`CHECK: ${note}`);
if (problems.length) {
  for (const problem of problems) console.error(`FAIL: ${problem}`);
  process.exit(1);
}
console.log("PASS: Preschool repository syntax, catalog, theme, IDs, anchors, local targets, and button accessibility contracts.");
