import { readdirSync, readFileSync, existsSync } from "fs";
import { join, resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { resolveComponentsPath } from "../utils/path-resolver.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export interface ComponentInfo {
    name: string;
    kebabName: string;
    description: string;
}

let cache: ComponentInfo[] | null = null;

function getBundledComponents(): ComponentInfo[] {
    const jsonPath = resolve(__dirname, "../data/components-data.json");
    if (!existsSync(jsonPath)) return [];
    return JSON.parse(readFileSync(jsonPath, "utf-8")) as ComponentInfo[];
}

export function getComponents(): ComponentInfo[] {
    if (cache) return cache;

    const componentsPath = resolveComponentsPath();
    if (!componentsPath) {
        cache = getBundledComponents();
        return cache;
    }

    cache = readdirSync(componentsPath, { withFileTypes: true })
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

    return cache;
}

function kebabToPascalCase(kebab: string): string {
    return kebab
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");
}

function readDescription(componentDir: string): string {
    const readmePath = join(componentDir, "README.md");
    if (!existsSync(readmePath)) return "";

    const lines = readFileSync(readmePath, "utf-8").split("\n");
    return (
        lines
            .map((l) => l.trim())
            .find((l) => l.length > 0 && !l.startsWith(">") && !l.startsWith("#")) ?? ""
    );
}
