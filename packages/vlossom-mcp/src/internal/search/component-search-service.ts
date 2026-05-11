import { getComponentIndex } from '../../services/meta-registry';
import { resolveGitHubVersionContext } from '../../services/github-registry-service';
import { fetchChangelog } from '../../services/github-reference-service';
import { loadComposables, loadCssTokens, loadDirectives, VLOSSOM_OPTIONS } from '../reference/reference-data';
import type {
    ComponentSearchResult,
    CoverageEntry,
    FacadeResultBase,
    SearchIntent,
    SearchTarget,
    SearchableResult,
    VersionContext,
} from '../types';
import { getVersionSupport, resolveVersionContext } from '../version/version-service';
import { resolveCoverage } from './coverage-resolver';
import { expandQuery, extractKeywords } from '../utils/synonym-expander';
import { getRuleRegistry } from '../validation/rule-registry';

export interface SearchVlossomInput {
    query?: string;
    target?: SearchTarget;
    intent?: SearchIntent;
    limit?: number;
    version?: string;
    packageJson?: string;
    language?: 'ko' | 'en';
}

export interface SearchChoice {
    target: Exclude<SearchTarget, 'all'>;
    count: number;
    sample: string[];
}

export interface SearchVlossomResult extends FacadeResultBase {
    query?: string;
    target: SearchTarget;
    intent: SearchIntent;
    total: number;
    results: SearchableResult[];
    error?: string;
    coverage?: CoverageEntry[];
    choices?: SearchChoice[];
    expandedTerms?: string[];
}

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

function clampLimit(limit: number | undefined): number {
    if (!limit) return DEFAULT_LIMIT;
    return Math.min(Math.max(limit, 1), MAX_LIMIT);
}

function normalizeQuery(query: string | undefined): string {
    return (query ?? '').trim();
}

function resourceUri(type: Exclude<SearchTarget, 'all'>, id: string): string {
    switch (type) {
        case 'component':
            return `vlossom://components/${id}`;
        case 'token':
            return 'vlossom://tokens/css';
        case 'option':
            return 'vlossom://options/create-vlossom';
        case 'rule':
            return id === 'PREFER_VLOSSOM_COMPONENT' ? 'vlossom://rules/vlossom-first' : 'vlossom://rules/coding';
        case 'changelog':
            return 'vlossom://changelog';
        default:
            return `vlossom://${type}s/${id}`;
    }
}

function scoreText(value: string, terms: string[]): number {
    const text = value.toLowerCase();
    return terms.reduce((score, term) => {
        if (text === term) return score + 100;
        if (text.includes(term)) return score + 35;
        return score;
    }, 0);
}

function addVersionSupport<T extends SearchableResult>(
    result: T,
    availableVersion: string | undefined,
    versionContext: VersionContext | undefined,
): T {
    if (!versionContext) return result;
    return {
        ...result,
        versionSupport: getVersionSupport(availableVersion, versionContext),
    };
}

export async function searchComponents(
    query: string,
    limit: number,
    versionContext: VersionContext,
): Promise<ComponentSearchResult[]> {
    const all = await getComponentIndex(versionContext);
    const toResult = (meta: { name: string; kebabName: string }, score: number) =>
        addVersionSupport(
            {
                type: 'component' as const,
                id: meta.name,
                name: meta.name,
                kebabName: meta.kebabName,
                description: 'Compact component index entry. Call get_vlossom_reference for exact API metadata.',
                availableVersion: 'unknown',
                propsCount: 0,
                hasVModel: false,
                styleSetChildRefs: [],
                resourceUri: resourceUri('component', meta.name),
                score,
            },
            undefined,
            versionContext,
        );

    if (!query) {
        return all.slice(0, limit).map((meta) => toResult(meta, 1));
    }

    const terms = [...new Set([...expandQuery(query), ...extractKeywords(query)])];

    return all
        .map((meta) => {
            const score = scoreText(meta.name, terms) + scoreText(meta.kebabName, terms);

            return { meta, score };
        })
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score || a.meta.name.localeCompare(b.meta.name))
        .slice(0, limit)
        .map(({ meta, score }) => toResult(meta, score));
}

async function searchDirectives(
    query: string,
    limit: number,
    versionContext: VersionContext,
): Promise<SearchableResult[]> {
    const terms = query ? expandQuery(query) : [];
    return (await loadDirectives(versionContext))
        .map((directive) => ({
            directive,
            score: query
                ? scoreText(directive.name, terms) +
                  scoreText(directive.kebabName, terms) +
                  scoreText(directive.description, terms)
                : 1,
        }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ directive, score }) =>
            addVersionSupport(
                {
                    type: 'directive' as const,
                    id: directive.name,
                    name: directive.name,
                    description: directive.description,
                    resourceUri: resourceUri('directive', directive.name),
                    score,
                },
                directive.availableVersion,
                versionContext,
            ),
        );
}

async function searchComposables(
    query: string,
    limit: number,
    versionContext: VersionContext,
): Promise<SearchableResult[]> {
    const terms = query ? expandQuery(query) : [];
    return (await loadComposables(versionContext))
        .map((composable) => ({
            composable,
            score: query
                ? scoreText(composable.name, terms) +
                  scoreText(composable.dirName, terms) +
                  scoreText(composable.description, terms)
                : 1,
        }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ composable, score }) =>
            addVersionSupport(
                {
                    type: 'composable' as const,
                    id: composable.name,
                    name: composable.name,
                    description: composable.description,
                    resourceUri: resourceUri('composable', composable.name),
                    score,
                },
                composable.availableVersion,
                versionContext,
            ),
        );
}

async function searchTokens(query: string, limit: number, versionContext: VersionContext): Promise<SearchableResult[]> {
    const terms = query ? expandQuery(query) : [];
    return (await loadCssTokens(versionContext))
        .map((token) => ({
            token,
            score: query ? scoreText(token.name, terms) + scoreText(token.category, terms) : 1,
        }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ token, score }) => ({
            type: 'token' as const,
            id: token.name,
            name: token.name,
            description: `${token.category}; default ${token.defaultValue}`,
            resourceUri: resourceUri('token', token.name),
            score,
        }));
}

function searchOptions(query: string, limit: number): SearchableResult[] {
    const terms = query ? expandQuery(query) : [];
    return VLOSSOM_OPTIONS.map((option) => ({
        option,
        score: query ? scoreText(option.name, terms) + scoreText(option.description, terms) : 1,
    }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ option, score }) => ({
            type: 'option' as const,
            id: option.name,
            name: option.name,
            description: option.description,
            resourceUri: resourceUri('option', option.name),
            score,
        }));
}

async function searchChangelog(query: string, limit: number): Promise<SearchableResult[]> {
    const data = await fetchChangelog();
    const terms = query ? expandQuery(query) : [];
    return data.entries
        .map((entry) => {
            const body = [
                entry.version,
                entry.date,
                entry.breaking.join(' '),
                entry.features.join(' '),
                entry.fixes.join(' '),
                entry.notes ?? '',
            ].join(' ');
            return { entry, score: query ? scoreText(body, terms) : 1 };
        })
        .filter(({ score }) => score > 0)
        .slice(0, limit)
        .map(({ entry, score }) => ({
            type: 'changelog' as const,
            id: entry.version,
            name: entry.version,
            description: `${entry.date}${entry.prerelease ? ' prerelease' : ''}`,
            resourceUri: resourceUri('changelog', entry.version),
            score,
        }));
}

function searchRules(query: string, limit: number): SearchableResult[] {
    const terms = query ? expandQuery(query) : [];
    return getRuleRegistry()
        .map((rule) => ({
            rule,
            score: query
                ? scoreText(rule.id, terms) + scoreText(rule.category, terms) + scoreText(rule.rule, terms)
                : 1,
        }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ rule, score }) => ({
            type: 'rule' as const,
            id: rule.id,
            name: rule.id,
            description: rule.rule,
            resourceUri: resourceUri('rule', rule.id),
            score,
        }));
}

async function searchByTarget(
    target: Exclude<SearchTarget, 'all'>,
    query: string,
    limit: number,
    versionContext: VersionContext,
): Promise<SearchableResult[]> {
    switch (target) {
        case 'component':
            return searchComponents(query, limit, versionContext);
        case 'directive':
            return searchDirectives(query, limit, versionContext);
        case 'composable':
            return searchComposables(query, limit, versionContext);
        case 'token':
            return searchTokens(query, limit, versionContext);
        case 'option':
            return searchOptions(query, limit);
        case 'changelog':
            return searchChangelog(query, limit);
        case 'rule':
            return searchRules(query, limit);
    }
}

export async function searchVlossom(input: SearchVlossomInput): Promise<SearchVlossomResult> {
    const query = normalizeQuery(input.query);
    const target = input.target ?? 'component';
    const intent = input.intent ?? 'lookup';
    const limit = clampLimit(input.limit);
    const expandedTerms = query ? expandQuery(query) : undefined;
    const unresolvedVersionContext = resolveVersionContext({
        version: input.version,
        packageJson: input.packageJson,
    });

    try {
        const versionContext = await resolveGitHubVersionContext(unresolvedVersionContext);

        if (target !== 'all') {
            const results = await searchByTarget(target, query, limit, versionContext);
            const coverage = intent === 'build-ui' && query ? await resolveCoverage(query, versionContext) : undefined;
            return {
                status: results.length > 0 || coverage?.length ? 'ok' : 'empty',
                query: query || undefined,
                target,
                intent,
                total: results.length,
                results,
                versionContext,
                coverage,
                expandedTerms,
                resourceUris: [
                    {
                        uri:
                            target === 'component'
                                ? 'vlossom://components'
                                : target === 'token'
                                  ? 'vlossom://tokens/css'
                                  : target === 'option'
                                    ? 'vlossom://options/create-vlossom'
                                    : `vlossom://${target}s`,
                        description: `Registry-backed Vlossom ${target} reference`,
                    },
                ],
                next_actions:
                    results.length > 0
                        ? [
                              {
                                  tool: 'get_vlossom_reference',
                                  reason: 'retrieve exact API, rules, examples, and source for a selected result',
                              },
                              {
                                  tool: 'scaffold_vlossom_code',
                                  reason: 'create a Vlossom-native starting point from the selected registry-backed results',
                              },
                          ]
                        : [
                              {
                                  tool: 'search_vlossom',
                                  reason: "try a broader query or target:'all' before assuming the feature is unavailable",
                              },
                          ],
            };
        }

        const groupedTargets: Array<Exclude<SearchTarget, 'all'>> = [
            'component',
            'directive',
            'composable',
            'token',
            'option',
            'rule',
        ];
        const grouped = await Promise.all(
            groupedTargets.map(async (groupTarget) => ({
                target: groupTarget,
                results: await searchByTarget(groupTarget, query, limit, versionContext),
            })),
        );
        const nonEmptyGroups = grouped.filter((group) => group.results.length > 0);

        if (query && nonEmptyGroups.length > 1) {
            const coverage = intent === 'build-ui' ? await resolveCoverage(query, versionContext) : undefined;
            return {
                status: 'ambiguous',
                query,
                target,
                intent,
                total: nonEmptyGroups.reduce((sum, group) => sum + group.results.length, 0),
                results: [],
                versionContext,
                coverage,
                choices: nonEmptyGroups.map((group) => ({
                    target: group.target,
                    count: group.results.length,
                    sample: group.results.slice(0, 3).map((result) => result.name),
                })),
                expandedTerms,
                next_actions: [
                    {
                        tool: 'search_vlossom',
                        reason: 'repeat the search with one selected target to avoid mixing reference domains',
                    },
                ],
            };
        }

        const results = nonEmptyGroups.flatMap((group) => group.results).slice(0, limit);
        const coverage = intent === 'build-ui' && query ? await resolveCoverage(query, versionContext) : undefined;

        return {
            status: results.length > 0 || coverage?.length ? 'ok' : 'empty',
            query: query || undefined,
            target,
            intent,
            total: results.length,
            results,
            versionContext,
            coverage,
            expandedTerms,
            resourceUris: [
                { uri: 'vlossom://components', description: 'Vlossom component registry' },
                { uri: 'vlossom://rules/vlossom-first', description: 'Vlossom-first policy' },
            ],
            next_actions:
                results.length > 0
                    ? [
                          {
                              tool: 'get_vlossom_reference',
                              reason: 'retrieve source-of-truth details for a selected result',
                          },
                          {
                              tool: 'validate_vlossom_usage',
                              reason: 'validate generated or user-written code against Vlossom-first rules',
                          },
                      ]
                    : [
                          {
                              tool: 'search_vlossom',
                              reason: 'broaden the search or choose a specific target before using non-Vlossom UI',
                          },
                      ],
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'GitHub repository data could not be loaded.';
        return {
            status: 'error',
            query: query || undefined,
            target,
            intent,
            total: 0,
            results: [],
            error: message,
            versionContext: {
                ...unresolvedVersionContext,
                warnings: [...unresolvedVersionContext.warnings, message],
            },
            next_actions: [
                {
                    tool: 'search_vlossom',
                    reason: 'retry after GitHub repository data is reachable, or pass a concrete packageJson/version and try a narrower target',
                },
            ],
        };
    }
}
