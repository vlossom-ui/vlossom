import { COMPONENT_RELATIONSHIPS } from '../data/component-relationships';

function kebabToPascalCase(kebab: string): string {
    return kebab
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
}

export interface ComponentRelationships {
    parent: string[];
    children: string[];
    siblings: string[];
}

export function getRelationships(name: string): ComponentRelationships {
    const normalized = name.includes('-') ? kebabToPascalCase(name) : name;
    const entry = COMPONENT_RELATIONSHIPS[normalized];
    const children = entry?.children ?? [];
    const siblings = entry?.siblings ?? [];
    const parent = Object.entries(COMPONENT_RELATIONSHIPS)
        .filter(([, rel]) => rel.children?.includes(normalized))
        .map(([key]) => key);
    return { parent, children, siblings };
}
