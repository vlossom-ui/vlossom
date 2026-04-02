#!/usr/bin/env node
// Generates three data files bundled into the npm package:
//   src/data/components-source.json  — raw Vue source per component
//   src/data/directives.json         — directive docs parsed from README
//   src/data/composables.json        — composable docs parsed from README
// Run before build: npm run generate

import { readdirSync, existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const vlossomSrc = resolve(__dirname, "../../vlossom/src");
const componentsPath = join(vlossomSrc, "components");
const directivesPath = join(vlossomSrc, "directives");
const composablesPath = join(vlossomSrc, "composables");
const srcDataDir = resolve(__dirname, "../src/data");
const distDataDir = resolve(__dirname, "../dist/data");

function ensureDir(dir) {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function kebabToPascalCase(kebab) {
    return kebab
        .split("-")
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join("");
}

function write(filename, data) {
    const json = JSON.stringify(data, null, 2);
    ensureDir(srcDataDir);
    writeFileSync(join(srcDataDir, filename), json, "utf-8");
    console.log(`  Wrote src/data/${filename} (${Object.keys(data).length ?? data.length} entries)`);
    if (existsSync(distDataDir)) {
        writeFileSync(join(distDataDir, filename), json, "utf-8");
        console.log(`  Wrote dist/data/${filename}`);
    }
}

// ---------------------------------------------------------------------------
// 1. components-source.json
// ---------------------------------------------------------------------------
function buildComponentsSource() {
    console.log("\n[1/3] Building components-source.json…");
    const result = {};

    const dirs = readdirSync(componentsPath).filter((d) => d.startsWith("vs-"));
    for (const dir of dirs) {
        const name = kebabToPascalCase(dir); // VsButton
        const vuePath = join(componentsPath, dir, `${name}.vue`);
        if (!existsSync(vuePath)) continue;
        const source = readFileSync(vuePath, "utf-8");
        result[name] = {
            name,
            kebabName: dir,
            source,
            path: `packages/vlossom/src/components/${dir}/${name}.vue`,
        };
    }

    write("components-source.json", result);
    console.log(`  ✓ ${Object.keys(result).length} components`);
}

// ---------------------------------------------------------------------------
// 2. directives.json
// ---------------------------------------------------------------------------
function parseDirectiveReadme(readmeText, name, kebabName) {
    const lines = readmeText.split("\n");

    // description — first non-empty line after the h1
    let description = "";
    let inDesc = false;
    for (const line of lines) {
        if (/^# /.test(line)) { inDesc = true; continue; }
        if (inDesc && line.trim()) { description = line.trim(); break; }
    }

    // availableVersion
    let availableVersion = "2.0.0+";
    const avMatch = readmeText.match(/\*\*Available Version\*\*[:\s]+([^\n]+)/);
    if (avMatch) availableVersion = avMatch[1].trim();

    // Basic Usage — first fenced code block after "## Basic Usage"
    let example = "";
    const buIdx = lines.findIndex((l) => /^## Basic Usage/.test(l));
    if (buIdx !== -1) {
        let inFence = false;
        const buf = [];
        for (let i = buIdx + 1; i < lines.length; i++) {
            if (lines[i].startsWith("```")) {
                if (!inFence) { inFence = true; continue; }
                else { break; }
            }
            if (inFence) buf.push(lines[i]);
        }
        example = buf.join("\n").trim();
    }

    // Binding / Options table
    const options = [];
    const bindIdx = lines.findIndex((l) => /^## Binding|^## Options/.test(l));
    if (bindIdx !== -1) {
        for (let i = bindIdx + 1; i < lines.length; i++) {
            const line = lines[i];
            if (/^## /.test(line)) break;
            if (!/^\|/.test(line) || /^[\s|:-]+$/.test(line.replace(/\|/g, ""))) continue;
            const cells = line.split("|").map((c) => c.trim()).filter(Boolean);
            if (cells.length >= 3 && !/^Binding|^Name|^Option/.test(cells[0])) {
                options.push({ binding: cells[0], type: cells[1], default: cells[2], description: cells[3] ?? "" });
            }
        }
    }

    return { name, kebabName, description, availableVersion, options, example };
}

function buildDirectives() {
    console.log("\n[2/3] Building directives.json…");
    const result = [];

    if (!existsSync(directivesPath)) {
        console.log("  No directives directory found, skipping.");
        write("directives.json", result);
        return;
    }

    const dirs = readdirSync(directivesPath).filter((d) => d.startsWith("vs-"));
    for (const dir of dirs) {
        const readmePath = join(directivesPath, dir, "README.md");
        if (!existsSync(readmePath)) continue;
        const text = readFileSync(readmePath, "utf-8");
        // kebab → directive name: vs-scroll-shadow → v-scroll-shadow
        const kebabName = dir; // "vs-scroll-shadow"
        const directiveName = "v-" + dir.slice(3); // "v-scroll-shadow"
        result.push(parseDirectiveReadme(text, directiveName, kebabName));
    }

    write("directives.json", result);
    console.log(`  ✓ ${result.length} directives`);
}

// ---------------------------------------------------------------------------
// 3. composables.json
// ---------------------------------------------------------------------------

// Determine "public" composables: those whose README exists
// and whose name doesn't start with internal-only patterns.
const PUBLIC_COMPOSABLES = new Set([
    "click-outside",
    "color-scheme",
    "focusable",
    "input",
    "input-form",
    "input-messages",
    "input-option",
    "input-rules",
    "list-index-selector",
    "option-label-value",
    "option-list",
    "overlay-callback",
    "overlay-dom",
    "positioning",
    "scroll-lock",
    "state-class",
    "string-modifier",
    "style-set",
    "value-matcher",
]);

function parseComposableReadme(text, dirName) {
    const lines = text.split("\n");

    // Name — first h1
    let name = "";
    const h1 = lines.find((l) => /^# /.test(l));
    if (h1) name = h1.replace(/^# /, "").trim();

    // description — first non-empty line after h1
    let description = "";
    let inDesc = false;
    for (const line of lines) {
        if (/^# /.test(line)) { inDesc = true; continue; }
        if (inDesc && line.trim() && !line.startsWith("#") && !line.startsWith("**")) {
            description = line.trim();
            break;
        }
    }

    // availableVersion
    let availableVersion = "2.0.0+";
    const avMatch = text.match(/\*\*Available Version\*\*[:\s]+([^\n]+)/);
    if (avMatch) availableVersion = avMatch[1].trim();

    // signature — Args table
    const args = [];
    const argsIdx = lines.findIndex((l) => /^## Args/.test(l));
    if (argsIdx !== -1) {
        for (let i = argsIdx + 1; i < lines.length; i++) {
            const line = lines[i];
            if (/^## /.test(line)) break;
            if (!/^\|/.test(line) || /^[\s|:-]+$/.test(line.replace(/\|/g, ""))) continue;
            const cells = line.split("|").map((c) => c.trim()).filter(Boolean);
            if (cells.length >= 3 && !/^Arg|^Name/.test(cells[0])) {
                args.push({
                    name: cells[0].replace(/`/g, ""),
                    type: cells[1].replace(/`/g, ""),
                    default: cells[2].replace(/`/g, ""),
                    required: cells[3] === "Yes",
                    description: cells[4] ?? "",
                });
            }
        }
    }

    // returns — first line of Returns section
    let returns = "";
    const retIdx = lines.findIndex((l) => /^## Returns/.test(l));
    if (retIdx !== -1) {
        for (let i = retIdx + 1; i < lines.length; i++) {
            const l = lines[i].trim();
            if (!l) continue;
            if (l.startsWith("#")) break;
            returns = l.replace(/^[-*]\s*/, "");
            break;
        }
    }

    // Basic Usage example
    let example = "";
    const buIdx = lines.findIndex((l) => /^## Basic Usage/.test(l));
    if (buIdx !== -1) {
        let inFence = false;
        const buf = [];
        for (let i = buIdx + 1; i < lines.length; i++) {
            if (lines[i].startsWith("```")) {
                if (!inFence) { inFence = true; continue; }
                else { break; }
            }
            if (inFence) buf.push(lines[i]);
        }
        example = buf.join("\n").trim();
    }

    const isPublic = PUBLIC_COMPOSABLES.has(dirName);

    return { name, dirName, description, availableVersion, isPublic, args, returns, example };
}

function buildComposables() {
    console.log("\n[3/3] Building composables.json…");
    const result = [];

    if (!existsSync(composablesPath)) {
        console.log("  No composables directory found, skipping.");
        write("composables.json", result);
        return;
    }

    const dirs = readdirSync(composablesPath).filter(
        (d) => !d.includes(".") && d !== "__tests__"
    );

    for (const dir of dirs) {
        const readmePath = join(composablesPath, dir, "README.md");
        if (!existsSync(readmePath)) continue;
        const text = readFileSync(readmePath, "utf-8");
        result.push(parseComposableReadme(text, dir));
    }

    write("composables.json", result);
    console.log(`  ✓ ${result.length} composables (${result.filter((c) => c.isPublic).length} public)`);
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------
buildComponentsSource();
buildDirectives();
buildComposables();
console.log("\nDone.");
