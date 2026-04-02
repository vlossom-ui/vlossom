import { createRequire } from "module";
import { dirname } from "path";
import { fileURLToPath } from "url";
import type { ComponentMeta } from "../types/meta.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

let cache: ComponentMeta[] | null = null;

function loadComponentsMeta(): ComponentMeta[] {
    const jsonPath = `${__dirname}/../data/components-meta.json`;
    return require(jsonPath) as ComponentMeta[];
}

export function getAllComponentsMeta(): ComponentMeta[] {
    if (cache) return cache;
    cache = loadComponentsMeta();
    return cache;
}

function kebabToPascalCase(kebab: string): string {
    return kebab
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");
}

export function getComponentMeta(name: string): ComponentMeta | undefined {
    const all = getAllComponentsMeta();
    const normalized = name.includes("-") ? kebabToPascalCase(name) : name;
    return all.find((c) => c.name === normalized || c.kebabName === name);
}
