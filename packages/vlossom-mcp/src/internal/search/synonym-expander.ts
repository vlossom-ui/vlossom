import { SYNONYM_MAP } from '../../data/search-synonyms';

const STOP_WORDS = new Set([
    'a',
    'an',
    'the',
    'for',
    'with',
    'and',
    'or',
    'to',
    'of',
    'in',
    'that',
    'is',
    'are',
    'using',
    'use',
]);

export function expandQuery(query: string): string[] {
    const lower = query.toLowerCase().trim();
    const terms = new Set<string>();
    if (lower) terms.add(lower);

    for (const [synonym, targets] of Object.entries(SYNONYM_MAP)) {
        if (lower.includes(synonym)) {
            for (const target of targets) {
                terms.add(target);
            }
        }
    }

    return [...terms];
}

export function extractKeywords(query: string): string[] {
    return query
        .toLowerCase()
        .split(/[\s,./()[\]{}:;]+/)
        .map((word) => word.replace(/[^a-z0-9\uAC00-\uD7A3-]/g, ''))
        .filter((word) => word.length > 1 && !STOP_WORDS.has(word));
}
