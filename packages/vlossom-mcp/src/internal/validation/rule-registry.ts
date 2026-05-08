import { CODING_RULES, type CodingRule } from '../../data/coding-rules';

export const PREFER_VLOSSOM_COMPONENT_RULE: CodingRule = {
    id: 'PREFER_VLOSSOM_COMPONENT',
    category: 'vlossom',
    severity: 'critical',
    rule: "When using vlossom-mcp, prefer registry-backed Vlossom components for UI patterns covered by the detected Vlossom version. Use context.vlossomFirst:'off' only for explicit user exceptions.",
};

export function getRuleRegistry(): CodingRule[] {
    return [...CODING_RULES, PREFER_VLOSSOM_COMPONENT_RULE];
}

export function getRule(id: string): CodingRule | undefined {
    return getRuleRegistry().find((rule) => rule.id === id);
}
