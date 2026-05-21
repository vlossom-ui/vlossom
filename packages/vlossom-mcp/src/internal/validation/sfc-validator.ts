import { getComponentMeta } from '../../services/meta-registry';
import type { ComponentMeta } from '../../types/meta';
import type { VersionContext } from '../types';
import { getVersionSupport } from '../version/version-service';
import type { VlossomValidationIssue } from './vlossom-first-validator';
import { validateVlossomFirst } from './vlossom-first-validator';

interface SfcValidationOptions {
    vlossomFirst: 'strict' | 'prefer' | 'off';
    versionContext?: VersionContext;
}

// Universal template-context attributes the validator must ignore: anything
// any tag can accept (HTML special attributes and Vue's tag-level specials).
// We do not enumerate Vue directives here — they are caught by the `v-*`
// prefix check at the call site, which keeps Vue-owned knowledge out of this
// package.
const UNIVERSAL_TEMPLATE_ATTRIBUTES = new Set(['id', 'key', 'ref', 'class', 'style', 'slot']);

function kebabToPascalCase(value: string): string {
    return value
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
}

function kebabToCamelCase(value: string): string {
    return value.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());
}

function lineNumber(code: string, index: number): number {
    return code.slice(0, index).split('\n').length;
}

function issue(ruleId: string, message: string, suggestion: string, line?: number): VlossomValidationIssue {
    return { ruleId, severity: 'error', message, suggestion, line };
}

function extractVlossomImports(code: string): string[] {
    return extractVlossomImportEntries(code).map((entry) => entry.name);
}

function extractVlossomImportEntries(code: string): Array<{ name: string; line: number }> {
    const entries: Array<{ name: string; line: number }> = [];
    const pattern = /import\s*\{([^}]+)\}\s*from\s*['"]vlossom['"]/g;
    for (const match of code.matchAll(pattern)) {
        const names = (match[1] ?? '')
            .split(',')
            .map(
                (name) =>
                    name
                        .trim()
                        .split(/\s+as\s+/)[0]
                        ?.trim() ?? '',
            )
            .filter((name) => /^Vs[A-Z]/.test(name));
        entries.push(
            ...names.map((name) => ({
                name,
                line: lineNumber(code, match.index ?? 0),
            })),
        );
    }
    return entries;
}

function extractTags(code: string): Array<{ tag: string; body: string; line: number }> {
    const tags: Array<{ tag: string; body: string; line: number }> = [];
    const pattern = /<\s*(vs-[a-z0-9-]+|Vs[A-Z][A-Za-z0-9]*)\b([^>]*)>/g;
    for (const match of code.matchAll(pattern)) {
        const rawTag = match[1] ?? '';
        tags.push({
            tag: rawTag.includes('-') ? kebabToPascalCase(rawTag) : rawTag,
            body: match[2] ?? '',
            line: lineNumber(code, match.index ?? 0),
        });
    }
    return tags;
}

async function validateComponentExistence(
    code: string,
    versionContext: VersionContext,
): Promise<VlossomValidationIssue[]> {
    const issues: VlossomValidationIssue[] = [];
    const seen = new Set<string>();
    for (const name of [...extractVlossomImports(code), ...extractTags(code).map((tag) => tag.tag)]) {
        if (seen.has(name)) continue;
        seen.add(name);
        if (!(await getComponentMeta(name, versionContext))) {
            issues.push({
                ruleId: 'COMPONENT_EXISTS',
                severity: 'error',
                message: `Component '${name}' is not present in the Vlossom registry.`,
                suggestion: 'Call search_vlossom and use only returned registry-backed component ids.',
                actions: [
                    {
                        tool: 'search_vlossom',
                        input: { query: name, target: 'component', intent: 'lookup' },
                        reason: 'verify the exact component name',
                    },
                ],
            });
        }
    }
    return issues;
}

async function validateComponentVersions(
    code: string,
    versionContext: VersionContext | undefined,
): Promise<VlossomValidationIssue[]> {
    if (!versionContext?.detectedVersion) return [];

    const issues: VlossomValidationIssue[] = [];
    const seen = new Set<string>();
    const entries = [
        ...extractVlossomImportEntries(code),
        ...extractTags(code).map((tag) => ({ name: tag.tag, line: tag.line })),
    ];

    for (const entry of entries) {
        if (seen.has(entry.name)) continue;
        seen.add(entry.name);
        const meta = await getComponentMeta(entry.name, versionContext);
        if (!meta) continue;

        const support = getVersionSupport(meta.availableVersion, versionContext);
        if (support.status !== 'unsupported') continue;

        issues.push({
            ruleId: 'VERSION_UNSUPPORTED',
            severity: 'error',
            message: `${meta.name} is not available in detected Vlossom v${versionContext.detectedVersion}.`,
            suggestion: support.message,
            line: entry.line,
            component: meta.name,
            actions: [
                {
                    tool: 'get_vlossom_reference',
                    input: {
                        type: 'component',
                        id: meta.name,
                        include: ['summary', 'api', 'rules'],
                        version: versionContext.detectedVersion,
                    },
                    reason: 'confirm version support and replacement guidance',
                },
            ],
        });
    }

    return issues;
}

function validateVModel(meta: ComponentMeta, body: string, line: number): VlossomValidationIssue[] {
    const issues: VlossomValidationIssue[] = [];
    const modelPattern = /\bv-model(?::([a-zA-Z0-9-]+))?/g;
    for (const match of body.matchAll(modelPattern)) {
        const modelName = match[1] ? kebabToCamelCase(match[1]) : 'modelValue';
        const eventName = `update:${modelName}`;
        const hasProp = meta.props.some((prop) => prop.name === modelName);
        const hasEvent = meta.events.some((event) => event.name === eventName);
        if (!hasProp || !hasEvent) {
            issues.push(
                issue(
                    'VMODEL_SUPPORT',
                    `${meta.name} does not declare v-model support for '${modelName}'.`,
                    `Check get_vlossom_reference for ${meta.name} props/events before using v-model.`,
                    line,
                ),
            );
        }
    }
    return issues;
}

function validatePropsAndEvents(meta: ComponentMeta, body: string, line: number): VlossomValidationIssue[] {
    const issues: VlossomValidationIssue[] = [];
    const propNames = new Set(meta.props.map((prop) => prop.name));
    const eventNames = new Set(meta.events.map((event) => event.name));
    const providedProps = new Set<string>();
    const attrPattern = /(?:^|\s)([@:]?[\w:-]+)(?=\s*(?:=|\s|$))/g;

    for (const match of body.matchAll(/\bv-model(?::([a-zA-Z0-9-]+))?/g)) {
        providedProps.add(match[1] ? kebabToCamelCase(match[1]) : 'modelValue');
    }

    for (const match of body.matchAll(attrPattern)) {
        const raw = match[1] ?? '';
        if (!raw || raw.startsWith('#')) continue;
        if (raw.startsWith('@')) {
            const event = kebabToCamelCase(raw.slice(1));
            // Skip events that look like single-word lowercase listeners.
            // Vue passes those through to the underlying element, so we
            // can't tell from Vlossom metadata alone whether they are valid;
            // flagging them would create constant false positives.
            if (/^[a-z]+$/.test(event)) continue;
            if (!eventNames.has(event)) {
                issues.push(
                    issue(
                        'EVENT_EXISTS',
                        `${meta.name} does not declare event '${event}'.`,
                        `Use get_vlossom_reference(type:'component', id:'${meta.name}', include:['events']) before binding custom events.`,
                        line,
                    ),
                );
            }
            continue;
        }

        const prop = raw.startsWith(':') ? raw.slice(1) : raw;
        // Skip Vue directive bindings (any `v-*`) and the small set of
        // tag-level attributes accepted by every Vue/HTML element. Those
        // surfaces are not owned by Vlossom and should not flow through
        // Vlossom prop validation.
        if (prop.startsWith('v-')) continue;
        if (prop.startsWith('data-') || prop.startsWith('aria-')) continue;
        if (UNIVERSAL_TEMPLATE_ATTRIBUTES.has(prop)) continue;
        const camelProp = kebabToCamelCase(prop);
        providedProps.add(camelProp);
        if (!propNames.has(camelProp)) {
            issues.push(
                issue(
                    'PROP_EXISTS',
                    `${meta.name} does not declare prop '${camelProp}'.`,
                    `Use get_vlossom_reference(type:'component', id:'${meta.name}', include:['props']) and remove or replace this prop.`,
                    line,
                ),
            );
        }
    }

    for (const prop of meta.props) {
        if (!prop.required) continue;
        if (providedProps.has(prop.name)) continue;
        issues.push(
            issue(
                'PROP_REQUIRED',
                `${meta.name} requires prop '${prop.name}'.`,
                `Add '${prop.name}' or choose a different Vlossom component API from get_vlossom_reference.`,
                line,
            ),
        );
    }

    return issues;
}

async function validateSlots(code: string, versionContext: VersionContext): Promise<VlossomValidationIssue[]> {
    const issues: VlossomValidationIssue[] = [];
    const componentBlockPattern = /<\s*(vs-[a-z0-9-]+|Vs[A-Z][A-Za-z0-9]*)\b[^>]*>([\s\S]*?)<\/\s*\1\s*>/g;
    for (const match of code.matchAll(componentBlockPattern)) {
        const rawTag = match[1] ?? '';
        const meta = await getComponentMeta(rawTag.includes('-') ? kebabToPascalCase(rawTag) : rawTag, versionContext);
        if (!meta) continue;
        const allowed = new Set(meta.slots.map((slot) => slot.name));
        const body = match[2] ?? '';
        for (const slotMatch of body.matchAll(/<template\s+#([\w-]+)/g)) {
            const slot = slotMatch[1] ?? '';
            if (!allowed.has(slot)) {
                issues.push(
                    issue(
                        'SLOT_EXISTS',
                        `${meta.name} does not declare slot '${slot}'.`,
                        `Use one of: ${[...allowed].join(', ') || '(no declared slots)'}.`,
                        lineNumber(code, (match.index ?? 0) + (slotMatch.index ?? 0)),
                    ),
                );
            }
        }
    }
    return issues;
}

function validateInternalCssSelectors(code: string): VlossomValidationIssue[] {
    const issues: VlossomValidationIssue[] = [];
    const pattern = /<style[\s\S]*?\.vs-[\w-]+/gi;
    for (const match of code.matchAll(pattern)) {
        issues.push(
            issue(
                'STYLESET_ONLY',
                'CSS targets an internal .vs-* selector.',
                'Use :style-set or --vs-* tokens instead of targeting Vlossom implementation classes.',
                lineNumber(code, match.index ?? 0),
            ),
        );
    }
    return issues;
}

export async function validateSfc(code: string, options: SfcValidationOptions): Promise<VlossomValidationIssue[]> {
    const versionContext = options.versionContext;
    const issues: VlossomValidationIssue[] = [
        ...(versionContext ? await validateComponentExistence(code, versionContext) : []),
        ...(await validateComponentVersions(code, versionContext)),
        ...(versionContext ? await validateSlots(code, versionContext) : []),
        ...validateInternalCssSelectors(code),
        ...(versionContext ? await validateVlossomFirst(code, options.vlossomFirst, versionContext) : []),
    ];

    for (const tag of extractTags(code)) {
        if (!versionContext) continue;
        const meta = await getComponentMeta(tag.tag, versionContext);
        if (!meta) continue;
        issues.push(...validateVModel(meta, tag.body, tag.line));
        issues.push(...validatePropsAndEvents(meta, tag.body, tag.line));
    }

    return issues;
}
