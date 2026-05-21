export interface CodingRule {
    id: string;
    category: 'vlossom' | 'styling';
    severity: 'critical' | 'recommended';
    rule: string;
}

/**
 * Scaffolding rules — propositions that nudge an agent toward Vlossom idioms
 * without constraining how it reasons about a specific feature.
 *
 * Keep this list short. Add a rule only when it captures a Vlossom-specific
 * direction that the registry data, source references, or validation output
 * cannot already express on their own.
 */
export const CODING_RULES: CodingRule[] = [
    {
        id: 'R01',
        category: 'vlossom',
        severity: 'recommended',
        rule: 'Use vlossom-mcp when building, refactoring, or reviewing Vlossom components.',
    },
    {
        id: 'R02',
        category: 'vlossom',
        severity: 'recommended',
        rule: 'Discover Vlossom coverage before introducing native HTML controls or third-party UI for the same UI pattern.',
    },
    {
        id: 'R03',
        category: 'vlossom',
        severity: 'recommended',
        rule: 'Read a Vlossom component or composable contract from the registry before relying on its API.',
    },
    {
        id: 'R04',
        category: 'styling',
        severity: 'recommended',
        rule: 'Customize Vlossom components through their StyleSet contract and Vlossom design tokens rather than overriding internal `.vs-*` selectors.',
    },
    {
        id: 'R05',
        category: 'vlossom',
        severity: 'recommended',
        rule: 'Validate generated or edited Vlossom code with `validate_vlossom_usage` before treating it as final.',
    },
];
