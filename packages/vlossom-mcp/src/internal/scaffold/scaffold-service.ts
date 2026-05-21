import { getComponentMeta } from '../../services/meta-registry';
import { resolveGitHubVersionContext } from '../../services/github-registry-service';
import type { FacadeResultBase, VersionContext, VersionSupport } from '../types';
import { getVersionSupport, resolveVersionContext } from '../version/version-service';
import {
    scaffoldComponentUsage,
    type ComponentUsageScaffoldInput,
    type ScaffoldContext,
    type ScaffoldOutputOptions,
    type ScaffoldPolicy,
} from './component-usage-scaffolder';
import { scaffoldProjectSetup } from './project-setup-scaffolder';
import { scaffoldStyleSet } from './style-set-scaffolder';

export type ScaffoldKind = 'component-usage' | 'style-set' | 'project-setup';

export interface ScaffoldVlossomCodeInput {
    kind: ScaffoldKind;
    description: string;
    components?: string[];
    component?: string;
    context?: ScaffoldContext;
    policy?: ScaffoldPolicy;
    output?: ScaffoldOutputOptions;
}

export interface ScaffoldVlossomCodeResult extends FacadeResultBase {
    kind: ScaffoldKind;
    policy?: Required<ScaffoldPolicy>;
    assumptions: string[];
    coveredRequirements?: unknown[];
    uncoveredRequirements?: unknown[];
    validationPayload?: unknown;
    scaffold?: unknown;
    code?: string;
    error?: string;
    unknownComponents?: string[];
    unsupportedComponents?: Array<{ name: string; versionSupport: VersionSupport }>;
}

async function unsupportedForComponent(
    component: string | undefined,
    fallback: string | undefined,
    versionContext: VersionContext,
): Promise<Array<{ name: string; versionSupport: VersionSupport }>> {
    const meta = await getComponentMeta(component ?? fallback ?? '', versionContext);
    if (!meta) return [];
    const versionSupport = getVersionSupport(meta.availableVersion, versionContext);
    return versionSupport.status === 'unsupported' ? [{ name: meta.name, versionSupport }] : [];
}

function unsupportedScaffoldResult(
    kind: ScaffoldKind,
    unsupportedComponents: Array<{ name: string; versionSupport: VersionSupport }>,
    versionContext: VersionContext,
): ScaffoldVlossomCodeResult {
    return {
        status: 'error',
        kind,
        assumptions: ['Scaffolds are only generated for APIs available in the detected Vlossom version.'],
        error: 'Requested component is not supported by the detected Vlossom version.',
        unsupportedComponents,
        versionContext,
        next_actions: [
            {
                tool: 'search_vlossom',
                reason: 'find components compatible with the detected Vlossom version or confirm an upgrade path',
            },
            {
                tool: 'get_vlossom_reference',
                reason: 'review version support before using this API',
            },
        ],
    };
}

function hasVlossomInstallContext(versionContext: VersionContext): boolean {
    return Boolean(versionContext.requestedVersion || versionContext.packageVersionRange);
}

function missingVlossomInstallResult(
    input: ScaffoldVlossomCodeInput,
    versionContext: VersionContext,
): ScaffoldVlossomCodeResult {
    const hasPackageJson = Boolean(input.context?.packageJson?.trim());
    return {
        status: 'skipped',
        kind: input.kind,
        assumptions: [
            'Vlossom component code is scaffolded only after Vlossom is installed or an explicit Vlossom version is provided.',
            'Use project setup scaffolding first for new projects or migrations without Vlossom.',
        ],
        error: hasPackageJson
            ? 'packageJson does not include vlossom, so Vlossom component code was not scaffolded.'
            : 'No packageJson or Vlossom version was provided, so Vlossom component code was not scaffolded.',
        versionContext,
        resourceUris: [
            {
                uri: 'vlossom://options/create-vlossom',
                description: 'Required createVlossom setup reference',
            },
        ],
        next_actions: [
            {
                tool: 'scaffold_vlossom_code',
                reason: "call kind:'project-setup' to install and configure Vlossom first",
            },
            {
                tool: 'validate_vlossom_usage',
                reason: 'after installing Vlossom, pass packageJson and setup files to validate the project setup',
            },
        ],
    };
}

export async function scaffoldVlossomCode(input: ScaffoldVlossomCodeInput): Promise<ScaffoldVlossomCodeResult> {
    const unresolvedVersionContext = resolveVersionContext({
        version: input.context?.version,
        packageJson: input.context?.packageJson,
    });

    if (input.kind !== 'project-setup' && !hasVlossomInstallContext(unresolvedVersionContext)) {
        return missingVlossomInstallResult(input, unresolvedVersionContext);
    }

    try {
        const versionContext = await resolveGitHubVersionContext(unresolvedVersionContext);

        if (input.kind === 'component-usage') {
            const scaffold = await scaffoldComponentUsage(input as ComponentUsageScaffoldInput);
            return {
                status: scaffold.status,
                kind: input.kind,
                policy: scaffold.policy,
                assumptions: scaffold.assumptions,
                uncoveredRequirements: scaffold.uncoveredRequirements,
                scaffold,
                code: scaffold.code,
                error: scaffold.error,
                unknownComponents: scaffold.unknownComponents,
                unsupportedComponents: scaffold.unsupportedComponents,
                versionContext: scaffold.versionContext,
                resourceUris: [
                    { uri: 'vlossom://components', description: 'Component registry used for scaffolding' },
                    { uri: 'vlossom://rules/vlossom-first', description: 'Vlossom-first policy' },
                ],
                next_actions:
                    scaffold.status === 'ok'
                        ? [
                              {
                                  tool: 'validate_vlossom_usage',
                                  reason: 'validate this scaffold before treating it as final implementation',
                              },
                              {
                                  tool: 'get_vlossom_reference',
                                  reason: 'retrieve exact API details for any component before extending the scaffold',
                              },
                          ]
                        : [
                              {
                                  tool: 'search_vlossom',
                                  reason: 'find registry-backed component names and retry scaffolding',
                              },
                          ],
            };
        }

        if (input.kind === 'style-set') {
            const unsupportedComponents = await unsupportedForComponent(input.component, undefined, versionContext);
            if (unsupportedComponents.length > 0) {
                return unsupportedScaffoldResult(input.kind, unsupportedComponents, versionContext);
            }

            const scaffold = await scaffoldStyleSet(input, versionContext);
            return {
                status: scaffold.status,
                kind: input.kind,
                assumptions: scaffold.assumptions,
                scaffold,
                code: scaffold.code,
                error: scaffold.error,
                versionContext,
                resourceUris: [
                    { uri: 'vlossom://rules/style-set', description: 'StyleSet rules' },
                    { uri: 'vlossom://tokens/css', description: 'CSS token registry' },
                ],
                next_actions:
                    scaffold.status === 'ok'
                        ? [
                              {
                                  tool: 'validate_vlossom_usage',
                                  reason: 'validate the StyleSet shape before applying it',
                              },
                          ]
                        : [
                              {
                                  tool: 'search_vlossom',
                                  reason: 'find the exact component id before scaffolding a StyleSet',
                              },
                          ],
            };
        }

        if (input.kind === 'project-setup') {
            const scaffold = scaffoldProjectSetup(input);
            return {
                status: 'ok',
                kind: input.kind,
                assumptions: scaffold.assumptions,
                coveredRequirements: scaffold.coveredRequirements,
                scaffold,
                validationPayload: scaffold.validationPayload,
                versionContext,
                resourceUris: [
                    {
                        uri: 'vlossom://options/create-vlossom',
                        description: 'createVlossom setup options',
                    },
                ],
                next_actions: [
                    {
                        tool: 'validate_vlossom_usage',
                        reason: 'validate package.json and setup files after applying the scaffold',
                    },
                ],
            };
        }

        return {
            status: 'error',
            kind: input.kind,
            assumptions: ['Only project setup, StyleSet, and explicit component usage harnesses are scaffolded.'],
            error: 'Unsupported scaffold kind.',
            versionContext,
            next_actions: [
                {
                    tool: 'get_vlossom_reference',
                    reason: 'retrieve exact component APIs and let the calling agent adapt domain data',
                },
            ],
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'GitHub repository data could not be loaded.';
        return {
            status: 'error',
            kind: input.kind,
            assumptions: ['Scaffolding needs GitHub repository data for the detected Vlossom version.'],
            error: message,
            versionContext: {
                ...unresolvedVersionContext,
                warnings: [...unresolvedVersionContext.warnings, message],
            },
            next_actions: [
                {
                    tool: 'search_vlossom',
                    reason: 'retry after GitHub repository data is reachable, then scaffold using returned version-aware results',
                },
            ],
        };
    }
}
