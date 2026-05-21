import { resolveGitHubVersionContext } from '../../services/github-registry-service';
import type { FacadeResultBase } from '../types';
import { resolveVersionContext } from '../version/version-service';
import { validateProjectSetup, type ProjectFile } from './project-setup-validator';
import { validateSfc } from './sfc-validator';
import { validateStyleSet } from './style-set-validator';
import type { VlossomValidationIssue } from './vlossom-first-validator';
import { buildSummary } from './validation-summary';

export type ValidateKind = 'sfc' | 'snippet' | 'style-set' | 'project-setup';
export type ValidateMode = 'fast' | 'strict' | 'compile';

export interface ValidateVlossomUsageInput {
    kind: ValidateKind;
    code?: string;
    packageJson?: string;
    files?: ProjectFile[];
    context?: {
        framework?: 'vite' | 'nuxt';
        version?: string;
        components?: string[];
        strict?: boolean;
        vlossomFirst?: 'strict' | 'prefer' | 'off';
    };
    mode?: ValidateMode;
}

export interface ValidateVlossomUsageResult extends FacadeResultBase {
    kind: ValidateKind;
    valid: boolean;
    summary: string;
    issues: VlossomValidationIssue[];
    recommendations?: string[];
}

function isEmpty(value: string | undefined): boolean {
    return !value || value.trim().length === 0;
}

export async function validateVlossomUsage(input: ValidateVlossomUsageInput): Promise<ValidateVlossomUsageResult> {
    const vlossomFirst = input.context?.vlossomFirst ?? 'strict';
    const unresolvedVersionContext = resolveVersionContext({
        version: input.context?.version,
        packageJson: input.packageJson,
    });

    try {
        const versionContext = await resolveGitHubVersionContext(unresolvedVersionContext);

        if (input.kind === 'project-setup') {
            const setup = await validateProjectSetup({
                packageJson: input.packageJson,
                files: input.files,
                framework: input.context?.framework,
                version: input.context?.version,
                vlossomFirst,
            });

            if (setup.status === 'skipped') {
                return {
                    status: 'skipped',
                    kind: input.kind,
                    valid: false,
                    summary: 'No packageJson or setup files were provided.',
                    issues: [],
                    recommendations: [
                        'Pass packageJson and setup files such as src/main.ts to validate Vlossom project setup.',
                        ...setup.versionContext.warnings,
                    ],
                    versionContext: setup.versionContext,
                    next_actions: [
                        {
                            tool: 'scaffold_vlossom_code',
                            reason: 'create a Vlossom project setup scaffold to compare against',
                        },
                    ],
                };
            }

            const valid = setup.issues.every((issue) => issue.severity !== 'error');
            return {
                status: valid ? 'ok' : 'error',
                kind: input.kind,
                valid,
                summary: buildSummary(setup.issues),
                issues: setup.issues,
                recommendations: setup.recommendations,
                versionContext: setup.versionContext,
                resourceUris: [
                    {
                        uri: 'vlossom://options/create-vlossom',
                        description: 'Required createVlossom setup reference',
                    },
                ],
                next_actions: valid
                    ? [
                          {
                              tool: 'search_vlossom',
                              reason: 'discover Vlossom coverage before implementing UI',
                          },
                      ]
                    : [
                          {
                              tool: 'get_vlossom_reference',
                              reason: 'retrieve exact createVlossom options and setup example',
                          },
                      ],
            };
        }

        if (isEmpty(input.code)) {
            return {
                status: 'skipped',
                kind: input.kind,
                valid: false,
                summary: 'No code was provided, so validation was skipped.',
                issues: [],
                versionContext,
                next_actions: [
                    {
                        tool: 'scaffold_vlossom_code',
                        reason: 'create a Vlossom-native scaffold to validate',
                    },
                ],
            };
        }

        const code = input.code ?? '';
        const issues =
            input.kind === 'style-set'
                ? await validateStyleSet(code, { components: input.context?.components, versionContext })
                : await validateSfc(code, { vlossomFirst, versionContext });
        const hasErrors = issues.some((issue) => issue.severity === 'error');

        return {
            status: hasErrors ? 'error' : 'ok',
            kind: input.kind,
            valid: !hasErrors,
            summary: buildSummary(issues),
            issues,
            recommendations: versionContext.warnings.length ? versionContext.warnings : undefined,
            versionContext,
            resourceUris: [
                { uri: 'vlossom://rules/vlossom-first', description: 'Vlossom-first policy' },
                ...(input.kind === 'style-set'
                    ? [{ uri: 'vlossom://rules/style-set', description: 'StyleSet rules' }]
                    : []),
                { uri: 'vlossom://rules/coding', description: 'Vlossom coding rules' },
            ],
            next_actions: hasErrors
                ? [
                      {
                          tool: 'get_vlossom_reference',
                          reason: 'retrieve exact component APIs and Vlossom-first rules for the violations',
                      },
                      {
                          tool: 'scaffold_vlossom_code',
                          reason: 'create a corrected Vlossom-native starting point',
                      },
                  ]
                : [
                      {
                          tool: 'search_vlossom',
                          reason: 'check Vlossom coverage before adding more UI patterns',
                      },
                  ],
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'GitHub repository data could not be loaded.';
        return {
            status: 'error',
            kind: input.kind,
            valid: false,
            summary: 'Validation could not load GitHub-backed Vlossom metadata.',
            issues: [],
            recommendations: [message],
            versionContext: {
                ...unresolvedVersionContext,
                warnings: [...unresolvedVersionContext.warnings, message],
            },
            next_actions: [
                {
                    tool: 'validate_vlossom_usage',
                    reason: 'retry when GitHub repository data is reachable, or provide packageJson/version to narrow the lookup',
                },
            ],
        };
    }
}
