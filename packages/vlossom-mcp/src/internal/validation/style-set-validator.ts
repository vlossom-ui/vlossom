import { getComponentMeta } from '../../services/meta-registry';
import type { ComponentMeta } from '../../types/meta';
import type { VersionContext } from '../types';
import { getVersionSupport } from '../version/version-service';
import type { VlossomValidationIssue } from './vlossom-first-validator';

export interface StyleSetValidationOptions {
    components?: string[];
    versionContext?: VersionContext;
}

interface KeyOccurrence {
    key: string;
    line: number;
}

const CSS_PROPERTY_VARIABLE_NAMES = new Set([
    'alignItems',
    'background',
    'backgroundColor',
    'borderRadius',
    'display',
    'flex',
    'height',
    'justifyContent',
    'margin',
    'maxHeight',
    'maxWidth',
    'minHeight',
    'minWidth',
    'opacity',
    'padding',
    'position',
    'width',
    'zIndex',
]);

function kebabToPascalCase(value: string): string {
    return value
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
}

function normalizeComponentId(value: string): string {
    const withoutStyleSet = value.replace(/StyleSet$/, '');
    return withoutStyleSet.includes('-') ? kebabToPascalCase(withoutStyleSet) : withoutStyleSet;
}

function lineNumber(code: string, index: number): number {
    return code.slice(0, index).split('\n').length;
}

function issue(
    ruleId: string,
    severity: 'error' | 'warning',
    message: string,
    suggestion: string,
    line?: number,
): VlossomValidationIssue {
    return { ruleId, severity, message, suggestion, line };
}

async function inferComponentMeta(
    code: string,
    options: StyleSetValidationOptions,
): Promise<{ meta?: ComponentMeta; issues: VlossomValidationIssue[] }> {
    const candidates = [
        ...(options.components ?? []),
        ...[...code.matchAll(/\b(Vs[A-Z][A-Za-z0-9]*StyleSet)\b/g)].map((match) => match[1] ?? ''),
    ]
        .map(normalizeComponentId)
        .filter(Boolean);

    for (const candidate of candidates) {
        const meta = options.versionContext ? await getComponentMeta(candidate, options.versionContext) : undefined;
        if (meta) return { meta, issues: [] };
    }

    if (candidates.length > 0) {
        return {
            issues: [
                issue(
                    'COMPONENT_EXISTS',
                    'error',
                    `StyleSet component '${candidates[0]}' is not present in the Vlossom registry.`,
                    'Call search_vlossom and validate against a registry-backed component StyleSet.',
                ),
            ],
        };
    }

    return {
        issues: [
            issue(
                'STYLESET_COMPONENT_CONTEXT',
                'error',
                'StyleSet validation needs a component context or a Vs*StyleSet type annotation.',
                'Pass context.components or annotate the object with the exact resolved StyleSet type.',
            ),
        ],
    };
}

function braceDelta(line: string): number {
    const withoutStrings = line.replace(/(['"`])(?:\\.|(?!\1).)*\1/g, '');
    return (withoutStrings.match(/\{/g)?.length ?? 0) - (withoutStrings.match(/\}/g)?.length ?? 0);
}

function findStyleSetObjectStart(code: string): number {
    const typed = /\bVs[A-Z][A-Za-z0-9]*StyleSet\b[\s\S]{0,160}=\s*\{/.exec(code);
    if (typed?.index !== undefined) {
        return code.indexOf('{', typed.index);
    }

    const returned = /return\s*\{/.exec(code);
    if (returned?.index !== undefined) {
        return code.indexOf('{', returned.index);
    }

    return code.indexOf('{');
}

function keysFromObject(code: string, openBraceIndex: number): KeyOccurrence[] {
    if (openBraceIndex < 0) return [];

    const keys: KeyOccurrence[] = [];
    const startLine = lineNumber(code, openBraceIndex);
    const lines = code.slice(openBraceIndex + 1).split('\n');
    let depth = 1;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i] ?? '';
        if (depth === 1) {
            const match = /^\s*(?:"([^"]+)"|'([^']+)'|([A-Za-z_$][\w$]*))\s*:/.exec(line);
            const key = match?.[1] ?? match?.[2] ?? match?.[3];
            if (key) keys.push({ key, line: startLine + i + 1 });
        }

        depth += braceDelta(line);
        if (depth <= 0) break;
    }

    return keys;
}

function findBlockStart(code: string, blockName: string): number {
    const match = new RegExp(`\\b${blockName}\\s*:\\s*\\{`).exec(code);
    return match?.index === undefined ? -1 : code.indexOf('{', match.index);
}

function interfaceTopLevelKeys(raw: string): Set<string> {
    const keys = new Set<string>();
    const lines = raw.split('\n');
    let depth = 0;

    for (const line of lines) {
        if (depth === 1) {
            const match = /^\s*([A-Za-z_$][\w$]*)\??\s*:/.exec(line);
            if (match?.[1]) keys.add(match[1]);
        }
        depth += braceDelta(line);
    }

    return keys;
}

function cssVariableNames(code: string): KeyOccurrence[] {
    return [...code.matchAll(/--[A-Za-z0-9_-]+/g)].map((match) => ({
        key: match[0] ?? '',
        line: lineNumber(code, match.index ?? 0),
    }));
}

function validateInterfaceKeys(code: string, meta: ComponentMeta): VlossomValidationIssue[] {
    const issues: VlossomValidationIssue[] = [];
    const allowedTopLevel = interfaceTopLevelKeys(meta.styleSet.raw);
    const topLevelKeys = keysFromObject(code, findStyleSetObjectStart(code));
    const variableKeys = keysFromObject(code, findBlockStart(code, 'variables'));
    const allowedVariables = new Set(Object.keys(meta.styleSet.variables));

    for (const occurrence of topLevelKeys) {
        if (!allowedTopLevel.has(occurrence.key)) {
            issues.push(
                issue(
                    'STYLESET_INTERFACE_KEY',
                    'error',
                    `${meta.name}StyleSet does not declare top-level key '${occurrence.key}'.`,
                    `Use get_vlossom_reference(type:'component', id:'${meta.name}', include:['styleSet']) and remove unsupported StyleSet keys.`,
                    occurrence.line,
                ),
            );
        }

        if (/StyleSet$/.test(occurrence.key)) {
            issues.push(
                issue(
                    'STYLESET_CHILD_REF',
                    'error',
                    `Child StyleSet '${occurrence.key}' is used as an object key instead of the resolved child ref key.`,
                    `Use one of the declared top-level keys: ${[...allowedTopLevel].join(', ')}.`,
                    occurrence.line,
                ),
            );
        }
    }

    if (variableKeys.length > 0 && allowedVariables.size === 0) {
        issues.push(
            issue(
                'STYLESET_VARIABLES_UNSUPPORTED',
                'error',
                `${meta.name}StyleSet does not expose a variables object.`,
                'Move direct CSSProperties into a declared component or child key.',
                variableKeys[0]?.line,
            ),
        );
    }

    for (const occurrence of variableKeys) {
        if (allowedVariables.has(occurrence.key)) continue;

        if (CSS_PROPERTY_VARIABLE_NAMES.has(occurrence.key)) {
            issues.push(
                issue(
                    'STYLESET_COMPONENT_PROPERTY_IN_VARIABLES',
                    'error',
                    `CSS property '${occurrence.key}' is exposed through variables but is not declared by ${meta.name}StyleSet.`,
                    'Put CSSProperties-style values under component or a declared child StyleSet key.',
                    occurrence.line,
                ),
            );
            continue;
        }

        issues.push(
            issue(
                'STYLESET_VARIABLE_KEY',
                'error',
                `${meta.name}StyleSet variables does not declare key '${occurrence.key}'.`,
                `Use only resolved variable keys: ${[...allowedVariables].join(', ') || '(none)'}.`,
                occurrence.line,
            ),
        );
    }

    if (variableKeys.length > Math.max(allowedVariables.size + 3, 8)) {
        issues.push(
            issue(
                'STYLESET_VARIABLES_OVEREXPOSED',
                'warning',
                'StyleSet variables exposes many keys beyond the generated interface.',
                'Keep variables limited to the resolved StyleSet contract and use component CSSProperties for local layout values.',
                variableKeys[0]?.line,
            ),
        );
    }

    return issues;
}

function validateTokensAndNaming(code: string): VlossomValidationIssue[] {
    const issues: VlossomValidationIssue[] = [];

    for (const match of code.matchAll(/#[0-9a-fA-F]{3,8}\b|rgb\s*\(|hsl\s*\(/g)) {
        issues.push(
            issue(
                'STYLESET_TOKEN',
                'warning',
                'Hardcoded color value found in StyleSet.',
                'Prefer --vs-* CSS tokens for theme-aware styling.',
                lineNumber(code, match.index ?? 0),
            ),
        );
    }

    for (const occurrence of cssVariableNames(code)) {
        if (occurrence.key.startsWith('--vs-')) continue;
        issues.push(
            issue(
                'STYLESET_CSS_VARIABLE_NAME',
                'error',
                `CSS variable '${occurrence.key}' does not follow the Vlossom token naming rule.`,
                'Use --vs-* tokens or a resolved StyleSet variable key instead of arbitrary CSS variables.',
                occurrence.line,
            ),
        );
    }

    return issues;
}

function validateComponentVersion(
    meta: ComponentMeta,
    versionContext: VersionContext | undefined,
): VlossomValidationIssue[] {
    if (!versionContext?.detectedVersion) return [];

    const support = getVersionSupport(meta.availableVersion, versionContext);
    if (support.status !== 'unsupported') return [];

    return [
        issue(
            'VERSION_UNSUPPORTED',
            'error',
            `${meta.name}StyleSet is not available in detected Vlossom v${versionContext.detectedVersion}.`,
            support.message,
        ),
    ];
}

export async function validateStyleSet(
    code: string,
    options: StyleSetValidationOptions = {},
): Promise<VlossomValidationIssue[]> {
    const issues: VlossomValidationIssue[] = [];

    if (/<style[\s>]/i.test(code)) {
        issues.push(
            issue(
                'STYLESET_ONLY',
                'error',
                'StyleSet validation received a <style> block.',
                'Pass a StyleSet object, not an SFC style block.',
            ),
        );
    }

    if (/variables\s*:\s*\{[\s\S]*variables\s*:/m.test(code)) {
        issues.push(
            issue(
                'STYLESET_SHAPE',
                'error',
                'Nested variables objects are not valid StyleSet shape.',
                'Keep variables at the top level of the component StyleSet object.',
            ),
        );
    }

    const { meta, issues: componentIssues } = await inferComponentMeta(code, options);
    issues.push(...componentIssues);
    if (meta) {
        issues.push(...validateComponentVersion(meta, options.versionContext));
        issues.push(...validateInterfaceKeys(code, meta));
    }
    issues.push(...validateTokensAndNaming(code));

    return issues;
}
