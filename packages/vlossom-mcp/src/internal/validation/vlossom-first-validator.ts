import { findCoverageForAlternative } from '../search/coverage-resolver';
import type { VersionContext } from '../types';

export interface VlossomValidationIssue {
    ruleId: string;
    severity: 'error' | 'warning';
    message: string;
    suggestion: string;
    line?: number;
    component?: string;
    actions?: Array<{
        tool: 'search_vlossom' | 'get_vlossom_reference';
        input: Record<string, unknown>;
        reason: string;
    }>;
}

type VlossomFirstMode = 'strict' | 'prefer' | 'off';

const NATIVE_TAGS = ['button', 'input', 'textarea', 'select', 'form', 'table', 'dialog', 'progress'];

const THIRD_PARTY_IMPORTS = [
    'element-plus',
    'vuetify',
    'ant-design-vue',
    'naive-ui',
    'quasar',
    'primevue',
    'bootstrap-vue',
];

const THIRD_PARTY_TAG_PATTERNS = [
    /^el-/,
    /^v-(btn|text-field|select|checkbox|radio|switch|dialog|data-table|tabs)/,
    /^n-/,
    /^a-/,
    /^q-/,
    /^p-/,
];

function lineNumber(code: string, index: number): number {
    return code.slice(0, index).split('\n').length;
}

function severityFor(mode: VlossomFirstMode): 'error' | 'warning' {
    return mode === 'strict' ? 'error' : 'warning';
}

async function issueForAlternative(
    alternative: string,
    line: number,
    mode: VlossomFirstMode,
    versionContext: VersionContext,
): Promise<VlossomValidationIssue | undefined> {
    const coverage = await findCoverageForAlternative(alternative, versionContext);
    if (!coverage || coverage.components.length === 0) return undefined;
    const replacements = coverage.components.map((component) => component.name).join(', ');

    return {
        ruleId: 'PREFER_VLOSSOM_COMPONENT',
        severity: severityFor(mode),
        message: `${alternative} is a UI pattern covered by Vlossom (${coverage.requirement}).`,
        suggestion: `Use ${replacements} unless the user explicitly requested an exception.`,
        line,
        component: replacements,
        actions: [
            {
                tool: 'search_vlossom',
                input: {
                    query: coverage.requirement,
                    target: 'component',
                    intent: 'build-ui',
                },
                reason: 'confirm Vlossom coverage for this UI requirement',
            },
            {
                tool: 'get_vlossom_reference',
                input: {
                    type: 'component',
                    id: coverage.components[0]?.name,
                    include: ['summary', 'api', 'examples', 'rules'],
                },
                reason: 'retrieve exact replacement API',
            },
        ],
    };
}

export async function validateVlossomFirst(
    code: string,
    mode: VlossomFirstMode,
    versionContext: VersionContext,
): Promise<VlossomValidationIssue[]> {
    if (mode === 'off') return [];
    const issues: VlossomValidationIssue[] = [];

    for (const tag of NATIVE_TAGS) {
        const pattern = new RegExp(`<\\s*${tag}(\\s|>|/)`, 'gi');
        for (const match of code.matchAll(pattern)) {
            const issue = await issueForAlternative(tag, lineNumber(code, match.index ?? 0), mode, versionContext);
            if (issue) issues.push(issue);
        }
    }

    const importPattern = /from\s+['"]([^'"]+)['"]/g;
    for (const match of code.matchAll(importPattern)) {
        const source = match[1] ?? '';
        if (!THIRD_PARTY_IMPORTS.some((library) => source === library || source.startsWith(`${library}/`))) {
            continue;
        }
        issues.push({
            ruleId: 'PREFER_VLOSSOM_COMPONENT',
            severity: severityFor(mode),
            message: `Third-party UI library import '${source}' was found in Vlossom-first code.`,
            suggestion:
                'Search Vlossom coverage first and use registry-backed Vlossom components for covered UI patterns.',
            line: lineNumber(code, match.index ?? 0),
            actions: [
                {
                    tool: 'search_vlossom',
                    input: { query: 'ui controls', target: 'component', intent: 'build-ui' },
                    reason: 'find Vlossom replacements for third-party UI components',
                },
            ],
        });
    }

    const tagPattern = /<\s*([a-z][a-z0-9-]*)\b/gi;
    for (const match of code.matchAll(tagPattern)) {
        const tag = match[1] ?? '';
        if (!THIRD_PARTY_TAG_PATTERNS.some((pattern) => pattern.test(tag))) continue;
        const issue = await issueForAlternative(tag, lineNumber(code, match.index ?? 0), mode, versionContext);
        issues.push(
            issue ?? {
                ruleId: 'PREFER_VLOSSOM_COMPONENT',
                severity: severityFor(mode),
                message: `Third-party UI tag <${tag}> was found in Vlossom-first code.`,
                suggestion: 'Use search_vlossom to find a Vlossom equivalent before using third-party UI.',
                line: lineNumber(code, match.index ?? 0),
                actions: [
                    {
                        tool: 'search_vlossom',
                        input: { query: tag, target: 'component', intent: 'build-ui' },
                        reason: 'look up Vlossom coverage for this UI pattern',
                    },
                ],
            },
        );
    }

    return issues;
}
