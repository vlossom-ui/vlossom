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

// Native HTML controls and semantic elements that have a Vlossom counterpart
// listed in coverage-resolver. Adding an entry here is only useful when the
// pattern map carries a matching `alternatives` keyword.
const NATIVE_TAGS = ['button', 'input', 'textarea', 'select', 'form', 'table', 'dialog', 'progress', 'details'];

const THIRD_PARTY_IMPORTS = [
    'element-plus',
    'vuetify',
    'ant-design-vue',
    'naive-ui',
    'quasar',
    'primevue',
    'bootstrap-vue',
    '@headlessui/vue',
    'radix-vue',
    '@oruga-ui/oruga-next',
    'flowbite-vue-3',
    'varlet-ui',
    'vant',
    'view-ui-plus',
];

const THIRD_PARTY_TAG_PATTERNS = [
    /^el-/, // Element Plus
    /^v-[a-z]/, // Vuetify (v-card, v-row, v-btn, ...) — Vue directives are attributes, not tags, so this is safe
    /^n-/, // Naive UI
    /^a-/, // Ant Design Vue
    /^q-/, // Quasar
    /^p-/, // PrimeVue
    /^o-/, // Oruga
    /^var-/, // Varlet
    /^van-/, // Vant
    /^iv-/, // View UI Plus
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

function detectVlossomInlineStyles(code: string, mode: VlossomFirstMode): VlossomValidationIssue[] {
    // Inline `style="..."` on a Vlossom component bypasses the StyleSet contract,
    // so it is a Vlossom-first violation even though the component itself is
    // a Vlossom component. We only flag inline strings; `:style` bindings can be
    // legitimate (e.g. computed CSS variable maps), so they are left alone.
    const issues: VlossomValidationIssue[] = [];
    const inlineStylePattern = /<\s*(vs-[a-z0-9-]+|Vs[A-Z][A-Za-z0-9]*)\b[^>]*\sstyle\s*=\s*["'][^"']*["']/g;
    for (const match of code.matchAll(inlineStylePattern)) {
        const component = match[1] ?? '';
        issues.push({
            ruleId: 'PREFER_STYLE_SET',
            severity: severityFor(mode),
            message: `Vlossom component <${component}> uses inline style="..." instead of :style-set.`,
            suggestion: 'Move customization into :style-set or --vs-* CSS tokens; inline style bypasses StyleSet.',
            line: lineNumber(code, match.index ?? 0),
            component,
            actions: [
                {
                    tool: 'get_vlossom_reference',
                    input: { type: 'component', id: component.replace(/^vs-/, 'Vs'), include: ['styleSet'] },
                    reason: 'retrieve the StyleSet interface for this component',
                },
            ],
        });
    }
    return issues;
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
    const seenThirdPartyTags = new Set<string>();
    for (const match of code.matchAll(tagPattern)) {
        const tag = match[1] ?? '';
        if (tag.startsWith('vs-')) continue; // Vlossom components themselves
        if (!THIRD_PARTY_TAG_PATTERNS.some((pattern) => pattern.test(tag))) continue;
        const dedupeKey = `${tag}@${match.index}`;
        if (seenThirdPartyTags.has(dedupeKey)) continue;
        seenThirdPartyTags.add(dedupeKey);
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

    issues.push(...detectVlossomInlineStyles(code, mode));

    return issues;
}
