import type { ComponentMeta, ComponentSummary } from '../types/meta';
import type { NextActionItem } from '../types/next-action';

export type SearchTarget = 'component' | 'directive' | 'composable' | 'token' | 'option' | 'changelog' | 'rule' | 'all';

export type SearchIntent = 'lookup' | 'build-ui' | 'style' | 'setup' | 'migration' | 'validate';

export type ReferenceType = 'component' | 'directive' | 'composable' | 'token' | 'option' | 'changelog' | 'rule';

export type ReferenceInclude =
    | 'summary'
    | 'api'
    | 'props'
    | 'slots'
    | 'events'
    | 'methods'
    | 'styleSet'
    | 'examples'
    | 'source'
    | 'relationships'
    | 'migration'
    | 'rules';

export interface ResourceLink {
    uri: string;
    description: string;
}

export interface SearchableResult {
    type: Exclude<SearchTarget, 'all'>;
    id: string;
    name: string;
    description: string;
    resourceUri: string;
    score?: number;
    versionSupport?: VersionSupport;
}

export interface ComponentSearchResult extends SearchableResult {
    type: 'component';
    kebabName: string;
    availableVersion: string;
    propsCount: number;
    hasVModel: boolean;
    styleSetChildRefs: string[];
}

export interface CoverageEntry {
    requirement: string;
    covered: boolean;
    components: ComponentSummary[];
    alternatives?: string[];
    confidence: 'direct' | 'related' | 'none';
    notes: string;
}

export interface FacadeResultBase {
    status: 'ok' | 'empty' | 'ambiguous' | 'error' | 'skipped';
    next_actions: NextActionItem[];
    resourceUris?: ResourceLink[];
    versionContext?: VersionContext;
}

export type VersionContextSource = 'input' | 'packageJson' | 'unknown';

export interface VersionContext {
    source: VersionContextSource;
    requestedVersion?: string;
    packageVersionRange?: string;
    detectedVersion?: string;
    resolvedRef?: string;
    fallbackRef?: string;
    warnings: string[];
}

export interface VersionSupport {
    status: 'supported' | 'unsupported' | 'unknown';
    requestedVersion?: string;
    minimumVersion?: string;
    availableVersion?: string;
    message: string;
}

export interface DirectiveOption {
    binding: string;
    type: string;
    default: string;
    description: string;
}

export interface DirectiveMeta {
    name: string;
    kebabName: string;
    description: string;
    availableVersion: string;
    options: DirectiveOption[];
    example: string;
}

export interface ComposableArg {
    name: string;
    type: string;
    default: string;
    required: boolean;
    description: string;
}

export interface ComposableMeta {
    name: string;
    dirName: string;
    description: string;
    availableVersion: string;
    isPublic: boolean;
    args: ComposableArg[];
    returns: string;
    example: string;
}

export interface CssToken {
    name: string;
    defaultValue: string;
    darkValue?: string;
    category: string;
}

export interface ChangelogEntryRaw {
    version: string;
    date: string;
    prerelease: boolean;
    breaking: string[];
    features: string[];
    fixes: string[];
    notes?: string;
}

export interface ChangelogData {
    latestStable: string | null;
    latestPrerelease: string | null;
    latestVersion: string;
    currentVersion: string;
    entries: ChangelogEntryRaw[];
}

export interface VlossomOptionMeta {
    name: string;
    type: string;
    default: string;
    required: boolean;
    description: string;
    example: string;
}

export interface VlossomPluginMeta {
    name: string;
    property: string;
    description: string;
    availableVersion: string;
    methods: Array<{ name: string; description: string }>;
    example: string;
}

export function toComponentSummary(meta: ComponentMeta): ComponentSummary {
    const hasVModel =
        meta.props.some((prop) => prop.name === 'modelValue') ||
        meta.events.some((event) => event.name === 'update:modelValue');

    return {
        name: meta.name,
        kebabName: meta.kebabName,
        description: meta.description,
        availableVersion: meta.availableVersion,
        propsCount: meta.props.length,
        hasVModel,
        styleSetChildRefs: meta.styleSet.childRefs,
    };
}
