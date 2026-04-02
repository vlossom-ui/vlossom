#!/usr/bin/env node
// Generates src/data/css-tokens.json from Vlossom CSS source files.
// Parses variables.css, palette.css, and color-scheme-variables.css
// to extract all --vs-* custom properties with values and categories.
// Run before build: npm run generate

import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const stylesPath = resolve(__dirname, "../../vlossom/src/styles");
const srcDataDir = resolve(__dirname, "../src/data");
const distDataDir = resolve(__dirname, "../dist/data");

function ensureDir(dir) {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

/**
 * Parse CSS text and extract all --vs-* variable declarations with their values.
 * Returns an array of { name, rawValue, darkValue?, inDark }.
 */
function parseCssVars(cssText, filename) {
    const tokens = [];
    // State tracking for @variant dark {} blocks
    let inDarkBlock = false;
    let braceDepth = 0;
    let darkBraceDepth = 0;

    const lines = cssText.split("\n");
    for (const line of lines) {
        const trimmed = line.trim();

        // Track @variant dark { blocks
        if (/@variant dark/.test(trimmed)) {
            inDarkBlock = true;
            darkBraceDepth = braceDepth + 1;
        }
        // Count braces to track block exits
        const opens = (trimmed.match(/{/g) || []).length;
        const closes = (trimmed.match(/}/g) || []).length;
        braceDepth += opens - closes;
        if (inDarkBlock && braceDepth < darkBraceDepth) {
            inDarkBlock = false;
        }

        // Match --vs-* property declarations
        const match = trimmed.match(/^(--vs-[\w-]+)\s*:\s*([^;]+)\s*;/);
        if (!match) continue;

        const [, name, rawValue] = match;
        const value = rawValue.trim();
        tokens.push({ name, value, inDark: inDarkBlock, source: filename });
    }

    return tokens;
}

/** Categorize a token name. */
function categorize(name) {
    if (/--vs-(white|black|gray|red|brown|orange|amber|yellow|lime|green|teal|cyan|blue|indigo|violet|purple|pink)-/.test(name)) return "palette";
    if (/--vs-(comp|area|line|font|shadow)-/.test(name) || /--vs-cs-/.test(name)) return "color-scheme";
    if (/--vs-(font-size|font-weight|line-height|white-space)/.test(name)) return "typography";
    if (/--vs-radius/.test(name)) return "radius";
    if (/--vs-padding/.test(name)) return "spacing";
    if (/--vs-(comp-height|size|default-comp)/.test(name)) return "size";
    if (/--vs-(bar|modal|toast|floating)-z-index/.test(name)) return "z-index";
    if (/--vs-(app-bg|no-color)/.test(name)) return "color-scheme";
    return "misc";
}

function build() {
    console.log("\n[build-tokens] Building css-tokens.json…");

    const files = [
        { file: "variables.css", desc: "design tokens (spacing, size, radius, z-index, typography)" },
        { file: "palette.css", desc: "color palette (--vs-{color}-{shade})" },
        { file: "color-scheme-variables.css", desc: "color-scheme CSS variables (--vs-cs-*)" },
    ];

    // name → entry map; merge light + dark values
    const map = new Map();

    for (const { file } of files) {
        const path = join(stylesPath, file);
        if (!existsSync(path)) {
            console.warn(`  Skipping ${file} (not found)`);
            continue;
        }
        const text = readFileSync(path, "utf-8");
        const tokens = parseCssVars(text, file);
        for (const { name, value, inDark } of tokens) {
            if (!map.has(name)) {
                map.set(name, { name, defaultValue: "", darkValue: undefined, category: categorize(name) });
            }
            const entry = map.get(name);
            if (inDark) {
                entry.darkValue = value;
            } else {
                entry.defaultValue = value;
            }
        }
    }

    const result = [...map.values()].sort((a, b) => a.name.localeCompare(b.name));

    const json = JSON.stringify(result, null, 2);
    ensureDir(srcDataDir);
    writeFileSync(join(srcDataDir, "css-tokens.json"), json, "utf-8");
    console.log(`  Wrote src/data/css-tokens.json (${result.length} tokens)`);

    if (existsSync(distDataDir)) {
        writeFileSync(join(distDataDir, "css-tokens.json"), json, "utf-8");
        console.log(`  Wrote dist/data/css-tokens.json`);
    }

    // Category breakdown
    const byCategory = {};
    for (const t of result) {
        byCategory[t.category] = (byCategory[t.category] ?? 0) + 1;
    }
    console.log("  Categories:", JSON.stringify(byCategory));
    console.log(`  ✓ ${result.length} tokens total`);
}

build();
