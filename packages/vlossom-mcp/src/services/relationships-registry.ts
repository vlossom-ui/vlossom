import { createRequire } from "module";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

interface RelationshipEntry {
    children?: string[];
    siblings?: string[];
}

type RelationshipsData = Record<string, RelationshipEntry>;

let cache: RelationshipsData | null = null;

function loadRelationships(): RelationshipsData {
    const jsonPath = `${__dirname}/../data/relationships.json`;
    return require(jsonPath) as RelationshipsData;
}

function getRelationshipsData(): RelationshipsData {
    if (cache) return cache;
    cache = loadRelationships();
    return cache;
}

function kebabToPascalCase(kebab: string): string {
    return kebab
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");
}

export interface ComponentRelationships {
    parent: string[];
    children: string[];
    siblings: string[];
}

export function getRelationships(name: string): ComponentRelationships {
    const data = getRelationshipsData();
    const normalized = name.includes("-") ? kebabToPascalCase(name) : name;

    const entry = data[normalized];
    const children = entry?.children ?? [];
    const siblings = entry?.siblings ?? [];

    const parent = Object.entries(data)
        .filter(([, rel]) => rel.children?.includes(normalized))
        .map(([key]) => key);

    return { parent, children, siblings };
}
