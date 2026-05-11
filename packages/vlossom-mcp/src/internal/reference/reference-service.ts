import { getComponentMeta } from '../../services/meta-registry';
import { getRelationships } from '../../services/relationships-registry';
import { resolveGitHubVersionContext } from '../../services/github-registry-service';
import {
    fetchChangelog,
    fetchComponentSource,
    getComponentSourcePath,
    getComponentSourceUrl,
} from '../../services/github-reference-service';
import type { ComponentMeta } from '../../types/meta';
import type { FacadeResultBase, ReferenceInclude, ReferenceType, ResourceLink, VersionContext } from '../types';
import { getVersionSupport, resolveVersionContext } from '../version/version-service';
import { getRule } from '../validation/rule-registry';
import {
    loadComposables,
    loadCssTokens,
    loadDirectives,
    loadPlugins,
    VLOSSOM_OPTIONS,
    VLOSSOM_SETUP_EXAMPLE,
} from './reference-data';

export interface GetVlossomReferenceInput {
    type: ReferenceType;
    id?: string;
    include?: ReferenceInclude[];
    version?: string;
    packageJson?: string;
    language?: 'ko' | 'en';
}

export interface GetVlossomReferenceResult extends FacadeResultBase {
    found: boolean;
    type: ReferenceType;
    id?: string;
    reference?: Record<string, unknown>;
    message?: string;
}

const DEFAULT_COMPONENT_INCLUDE: ReferenceInclude[] = ['summary', 'api', 'rules', 'relationships'];

function kebabToPascalCase(value: string): string {
    return value
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
}

function componentResourceLinks(meta: ComponentMeta): ResourceLink[] {
    return [
        {
            uri: `vlossom://components/${meta.name}`,
            description: `Component reference for ${meta.name}`,
        },
        {
            uri: 'vlossom://rules/vlossom-first',
            description: 'Vlossom-first policy for generated UI code',
        },
    ];
}

function notFound(type: ReferenceType, id: string | undefined, message: string): GetVlossomReferenceResult {
    return {
        status: 'error',
        found: false,
        type,
        id,
        message,
        next_actions: [
            {
                tool: 'search_vlossom',
                reason: `search registry-backed ${type} entries and retry with a returned id`,
            },
        ],
    };
}

async function includeComponentField(
    meta: ComponentMeta,
    includeSet: Set<ReferenceInclude>,
    versionContext: VersionContext,
): Promise<Record<string, unknown>> {
    const versionSupport = getVersionSupport(meta.availableVersion, versionContext);
    const reference: Record<string, unknown> = {
        name: meta.name,
        kebabName: meta.kebabName,
        versionSupport,
    };

    if (includeSet.has('summary')) {
        reference.summary = {
            description: meta.description,
            availableVersion: meta.availableVersion,
            versionSupport,
            resourceUri: `vlossom://components/${meta.name}`,
        };
    }

    if (includeSet.has('api')) {
        reference.api = {
            props: meta.props,
            slots: meta.slots,
            events: meta.events,
            methods: meta.methods,
            styleSet: meta.styleSet,
        };
    }
    if (includeSet.has('props')) reference.props = meta.props;
    if (includeSet.has('slots')) reference.slots = meta.slots;
    if (includeSet.has('events')) reference.events = meta.events;
    if (includeSet.has('methods')) reference.methods = meta.methods;
    if (includeSet.has('styleSet')) reference.styleSet = meta.styleSet;

    if (includeSet.has('relationships')) {
        reference.relationships = getRelationships(meta.name);
    }

    if (includeSet.has('source')) {
        try {
            reference.source = await fetchComponentSource(meta, versionContext);
        } catch (error) {
            const path = getComponentSourcePath(meta);
            reference.source = {
                path,
                url: getComponentSourceUrl(meta),
                missing: true,
                message: error instanceof Error ? error.message : 'Failed to fetch component source.',
            };
        }
    }

    if (includeSet.has('examples')) {
        reference.examples = [
            `<${meta.kebabName}>Content</${meta.kebabName}>`,
            `import { ${meta.name} } from 'vlossom'`,
        ];
    }

    if (includeSet.has('rules')) {
        reference.rules = [
            'Use registry-backed Vlossom components before native or third-party UI controls.',
            'Use :style-set and --vs-* tokens for customization.',
            'Validate generated code with validate_vlossom_usage before finalizing.',
        ];
    }

    return reference;
}

async function componentReference(
    input: GetVlossomReferenceInput,
    versionContext: VersionContext,
): Promise<GetVlossomReferenceResult> {
    if (!input.id) {
        return notFound('component', input.id, 'Component id is required.');
    }

    const normalized = input.id.includes('-') ? kebabToPascalCase(input.id) : input.id;
    const meta = await getComponentMeta(normalized, versionContext);
    if (!meta) {
        return notFound('component', input.id, `Component '${input.id}' was not found in the Vlossom registry.`);
    }

    const include = input.include?.length ? input.include : DEFAULT_COMPONENT_INCLUDE;
    const reference = await includeComponentField(meta, new Set(include), versionContext);
    const versionSupport = getVersionSupport(meta.availableVersion, versionContext);

    return {
        status: 'ok',
        found: true,
        type: 'component',
        id: meta.name,
        reference,
        resourceUris: componentResourceLinks(meta),
        next_actions: [
            ...(versionSupport.status === 'unsupported'
                ? [
                      {
                          tool: 'get_vlossom_reference',
                          reason: 'review changelog or upgrade guidance before using this API',
                      },
                  ]
                : []),
            {
                tool: 'scaffold_vlossom_code',
                reason: 'create a Vlossom-native starting point using this exact API',
            },
            {
                tool: 'validate_vlossom_usage',
                reason: 'validate code that uses this component before finalizing',
            },
        ],
    };
}

async function directiveReference(
    input: GetVlossomReferenceInput,
    versionContext: VersionContext,
): Promise<GetVlossomReferenceResult> {
    const directives = await loadDirectives(versionContext);
    if (!input.id) {
        return {
            status: 'ok',
            found: true,
            type: 'directive',
            reference: {
                directives: directives.map((directive) => ({
                    ...directive,
                    versionSupport: getVersionSupport(directive.availableVersion, versionContext),
                })),
            },
            next_actions: [
                {
                    tool: 'get_vlossom_reference',
                    reason: 'retry with a directive id for exact binding options and examples',
                },
            ],
        };
    }

    const normalized = input.id.startsWith('v-') ? input.id : `v-${input.id.replace(/^vs-/, '')}`;
    const directive = directives.find((entry) => entry.name === normalized || entry.kebabName === input.id);
    if (!directive) {
        return notFound('directive', input.id, `Directive '${input.id}' was not found.`);
    }

    return {
        status: 'ok',
        found: true,
        type: 'directive',
        id: directive.name,
        reference: {
            ...directive,
            versionSupport: getVersionSupport(directive.availableVersion, versionContext),
        } as unknown as Record<string, unknown>,
        resourceUris: [{ uri: `vlossom://directives/${directive.name}`, description: 'Directive reference' }],
        next_actions: [
            {
                tool: 'get_vlossom_reference',
                reason: 'check composable alternatives when programmatic behavior is needed',
            },
        ],
    };
}

async function composableReference(
    input: GetVlossomReferenceInput,
    versionContext: VersionContext,
): Promise<GetVlossomReferenceResult> {
    const composables = await loadComposables(versionContext);
    if (!input.id) {
        return {
            status: 'ok',
            found: true,
            type: 'composable',
            reference: {
                composables: composables.map((composable) => ({
                    ...composable,
                    versionSupport: getVersionSupport(composable.availableVersion, versionContext),
                })),
            },
            next_actions: [
                {
                    tool: 'get_vlossom_reference',
                    reason: 'retry with a composable id for args, return type, and usage example',
                },
            ],
        };
    }

    const dirName = input.id.startsWith('use')
        ? input.id
              .slice(3)
              .replace(/([A-Z])/g, '-$1')
              .toLowerCase()
              .replace(/^-/, '')
        : input.id;
    const composable =
        composables.find((entry) => entry.name === input.id) ??
        composables.find((entry) => entry.dirName === dirName) ??
        composables.find((entry) => entry.name.toLowerCase() === input.id?.toLowerCase());
    if (!composable) {
        return notFound('composable', input.id, `Composable '${input.id}' was not found.`);
    }

    return {
        status: 'ok',
        found: true,
        type: 'composable',
        id: composable.name,
        reference: {
            ...composable,
            versionSupport: getVersionSupport(composable.availableVersion, versionContext),
        } as unknown as Record<string, unknown>,
        resourceUris: [{ uri: `vlossom://composables/${composable.name}`, description: 'Composable reference' }],
        next_actions: [
            {
                tool: 'get_vlossom_reference',
                reason: 'check directive alternatives when declarative template behavior is preferred',
            },
        ],
    };
}

async function tokenReference(
    input: GetVlossomReferenceInput,
    versionContext: VersionContext,
): Promise<GetVlossomReferenceResult> {
    const tokens = await loadCssTokens(versionContext);
    const matches = input.id
        ? tokens.filter((token) => token.name === input.id || token.name.includes(input.id ?? ''))
        : tokens;
    if (matches.length === 0) {
        return notFound('token', input.id, `CSS token '${input.id}' was not found.`);
    }

    return {
        status: 'ok',
        found: true,
        type: 'token',
        id: input.id,
        reference: { tokens: matches, count: matches.length },
        resourceUris: [{ uri: 'vlossom://tokens/css', description: 'CSS token reference' }],
        next_actions: [
            {
                tool: 'scaffold_vlossom_code',
                reason: 'scaffold a StyleSet using token-backed values',
            },
        ],
    };
}

async function optionReference(
    input: GetVlossomReferenceInput,
    versionContext: VersionContext,
): Promise<GetVlossomReferenceResult> {
    const option = input.id ? VLOSSOM_OPTIONS.find((entry) => entry.name === input.id) : undefined;
    if (input.id && !option) {
        return notFound('option', input.id, `createVlossom option '${input.id}' was not found.`);
    }

    const plugins = (await loadPlugins(versionContext)).map((plugin) => ({
        ...plugin,
        versionSupport: getVersionSupport(plugin.availableVersion, versionContext),
    }));

    return {
        status: 'ok',
        found: true,
        type: 'option',
        id: input.id,
        reference: {
            options: option ? [option] : VLOSSOM_OPTIONS,
            plugins,
            fullExample: VLOSSOM_SETUP_EXAMPLE,
        },
        resourceUris: [
            {
                uri: 'vlossom://options/create-vlossom',
                description: 'createVlossom options reference',
            },
        ],
        next_actions: [
            {
                tool: 'validate_vlossom_usage',
                reason: 'validate package.json and setup files against required Vlossom setup',
            },
        ],
    };
}

async function changelogReference(input: GetVlossomReferenceInput): Promise<GetVlossomReferenceResult> {
    const data = await fetchChangelog();
    const entries = input.id ? data.entries.filter((entry) => entry.version === input.id) : data.entries.slice(0, 10);
    if (input.id && entries.length === 0) {
        return notFound('changelog', input.id, `Changelog version '${input.id}' was not found.`);
    }

    return {
        status: 'ok',
        found: true,
        type: 'changelog',
        id: input.id,
        reference: {
            currentVersion: data.currentVersion,
            latestStable: data.latestStable,
            latestPrerelease: data.latestPrerelease,
            versions: entries,
        },
        resourceUris: [{ uri: 'vlossom://changelog', description: 'Vlossom changelog' }],
        next_actions: [
            {
                tool: 'validate_vlossom_usage',
                reason: 'validate project setup after reviewing version or migration guidance',
            },
        ],
    };
}

function ruleReference(input: GetVlossomReferenceInput): GetVlossomReferenceResult {
    if (input.id) {
        const rule = getRule(input.id);
        if (!rule) return notFound('rule', input.id, `Rule '${input.id}' was not found.`);
        return {
            status: 'ok',
            found: true,
            type: 'rule',
            id: rule.id,
            reference: { rule },
            resourceUris: [
                {
                    uri:
                        rule.id === 'PREFER_VLOSSOM_COMPONENT'
                            ? 'vlossom://rules/vlossom-first'
                            : 'vlossom://rules/coding',
                    description: 'Vlossom coding rule',
                },
            ],
            next_actions: [
                {
                    tool: 'validate_vlossom_usage',
                    reason: 'apply this rule to generated or user-written code',
                },
            ],
        };
    }

    return {
        status: 'ok',
        found: true,
        type: 'rule',
        reference: { rules: [getRule('PREFER_VLOSSOM_COMPONENT')] },
        resourceUris: [
            { uri: 'vlossom://rules/vlossom-first', description: 'Vlossom-first policy' },
            { uri: 'vlossom://rules/coding', description: 'Coding rules' },
        ],
        next_actions: [
            {
                tool: 'validate_vlossom_usage',
                reason: 'validate code against Vlossom-first and coding rules',
            },
        ],
    };
}

export async function getVlossomReference(input: GetVlossomReferenceInput): Promise<GetVlossomReferenceResult> {
    const unresolvedVersionContext = resolveVersionContext({
        version: input.version,
        packageJson: input.packageJson,
    });

    try {
        const versionContext = await resolveGitHubVersionContext(unresolvedVersionContext);

        const result = await (async (): Promise<GetVlossomReferenceResult> => {
            switch (input.type) {
                case 'component':
                    return componentReference(input, versionContext);
                case 'directive':
                    return directiveReference(input, versionContext);
                case 'composable':
                    return composableReference(input, versionContext);
                case 'token':
                    return tokenReference(input, versionContext);
                case 'option':
                    return optionReference(input, versionContext);
                case 'changelog':
                    return changelogReference(input);
                case 'rule':
                    return ruleReference(input);
            }
        })();

        return { ...result, versionContext };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'GitHub repository data could not be loaded.';
        return {
            status: 'error',
            found: false,
            type: input.type,
            id: input.id,
            message,
            versionContext: {
                ...unresolvedVersionContext,
                warnings: [...unresolvedVersionContext.warnings, message],
            },
            next_actions: [
                {
                    tool: 'search_vlossom',
                    reason: 'retry when GitHub repository data is reachable or verify the requested Vlossom version/ref',
                },
            ],
        };
    }
}
