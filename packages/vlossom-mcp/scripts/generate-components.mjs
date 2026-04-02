#!/usr/bin/env node
// Generates src/data/components-data.json from the vlossom components directory.
// Also writes dist/data/components-data.json so the built package can read it at runtime.
// Run before build: npm run generate

import { readdirSync, readFileSync, existsSync, writeFileSync, mkdirSync, rmSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const componentsPath = resolve(__dirname, "../../vlossom/src/components");
const srcDataDir = resolve(__dirname, "../src/data");
const distDataDir = resolve(__dirname, "../dist/data");
const srcJsonPath = join(srcDataDir, "components-data.json");
const legacyTsPath = join(srcDataDir, "components-data.ts");

// 기존 TS 파일 제거
if (existsSync(legacyTsPath)) {
    rmSync(legacyTsPath);
    console.log(`Removed legacy file: ${legacyTsPath}`);
}

if (!existsSync(componentsPath)) {
    console.error(`Components directory not found: ${componentsPath}`);
    process.exit(1);
}

function kebabToPascalCase(kebab) {
    return kebab
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");
}

function readDescription(componentDir) {
    const readmePath = join(componentDir, "README.md");
    if (!existsSync(readmePath)) return "";
    const lines = readFileSync(readmePath, "utf-8").split("\n");
    return (
        lines
            .map((l) => l.trim())
            .find((l) => l.length > 0 && !l.startsWith(">") && !l.startsWith("#")) ?? ""
    );
}

const components = readdirSync(componentsPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("vs-"))
    .map((entry) => {
        const kebabName = entry.name;
        return {
            name: kebabToPascalCase(kebabName),
            kebabName,
            description: readDescription(join(componentsPath, kebabName)),
        };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

const json = JSON.stringify(components, null, 4);

mkdirSync(srcDataDir, { recursive: true });
writeFileSync(srcJsonPath, json, "utf-8");
console.log(`Generated ${components.length} components → ${srcJsonPath}`);

mkdirSync(distDataDir, { recursive: true });
writeFileSync(join(distDataDir, "components-data.json"), json, "utf-8");
console.log(`Copied → ${join(distDataDir, "components-data.json")}`);

// Copy relationships.json (manually maintained) to src/data and dist/data
const relSrc = join(__dirname, "relationships.json");
const relDst = join(srcDataDir, "relationships.json");
const relDistDst = join(distDataDir, "relationships.json");
const relJson = readFileSync(relSrc, "utf-8");
writeFileSync(relDst, relJson, "utf-8");
writeFileSync(relDistDst, relJson, "utf-8");
console.log(`Copied relationships.json → ${relDst}`);
console.log(`Copied relationships.json → ${relDistDst}`);
