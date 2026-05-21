import type { VersionContext, VlossomPluginMeta } from '../internal/types';
import type { ComponentMeta, EventMeta, MethodMeta, PropMeta, SlotMeta, StyleSetMeta } from '../types/meta';
import type { ComposableMeta, CssToken, DirectiveMeta } from '../internal/types';
import { getCandidateRefs } from '../internal/version/version-service';
import { fetchGitHubDirectory, fetchGitHubRawText, type GitHubContentEntry } from './github-client';

const COMPONENTS_PATH = 'packages/vlossom/src/components';
const DIRECTIVES_PATH = 'packages/vlossom/src/directives';
const COMPOSABLES_PATH = 'packages/vlossom/src/composables';
const PLUGINS_PATH = 'packages/vlossom/src/plugins';
const STYLES_PATH = 'packages/vlossom/src/styles';

const componentCache = new Map<string, ComponentMeta[]>();
const componentIndexCache = new Map<string, Promise<ComponentIndexEntry[]>>();
const componentLookupCache = new Map<string, Promise<ComponentMeta | undefined>>();
const directiveCache = new Map<string, DirectiveMeta[]>();
const composableCache = new Map<string, ComposableMeta[]>();
const pluginCache = new Map<string, VlossomPluginMeta[]>();
const publicComposableDirsCache = new Map<string, Promise<Set<string>>>();
const tokenCache = new Map<string, CssToken[]>();
const refCache = new Map<string, VersionContext>();
const rawCache = new Map<string, Promise<string>>();
const directoryCache = new Map<string, Promise<GitHubContentEntry[]>>();
const GITHUB_FETCH_CONCURRENCY = 8;

export interface ComponentIndexEntry {
    name: string;
    kebabName: string;
}

function kebabToPascalCase(kebab: string): string {
    return kebab
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
}

function toKebabCase(name: string): string {
    return name
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
        .toLowerCase();
}

async function mapWithConcurrency<T, R>(
    items: T[],
    limit: number,
    mapper: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
    const results = new Array<R>(items.length);
    let nextIndex = 0;
    const workerCount = Math.min(Math.max(limit, 1), items.length);

    await Promise.all(
        Array.from({ length: workerCount }, async () => {
            while (nextIndex < items.length) {
                const currentIndex = nextIndex;
                nextIndex += 1;
                results[currentIndex] = await mapper(items[currentIndex], currentIndex);
            }
        }),
    );

    return results;
}

function stripBackticks(value: string): string {
    return value.replace(/^`+|`+$/g, '').trim();
}

function parseTableRow(line: string): string[] {
    const placeholder = '\x00PIPE\x00';
    const inner = line.replace(/^\s*\|/, '').replace(/\|\s*$/, '');
    return inner
        .replace(/\\\|/g, placeholder)
        .split('|')
        .map((cell) => cell.trim().replace(new RegExp(placeholder, 'g'), '|'));
}

function isSeparatorRow(line: string): boolean {
    return /^\s*\|[\s|:-]+\|\s*$/.test(line);
}

function parseTable(lines: string[], startIndex: number, headers: string[]): Record<string, string>[] {
    const rows: Record<string, string>[] = [];
    let index = startIndex + 1;
    if (index < lines.length && isSeparatorRow(lines[index] ?? '')) index += 1;

    while (index < lines.length) {
        const line = (lines[index] ?? '').trim();
        if (!line.startsWith('|')) break;
        if (isSeparatorRow(line)) {
            index += 1;
            continue;
        }

        const cells = parseTableRow(line);
        const row: Record<string, string> = {};
        headers.forEach((header, cellIndex) => {
            row[header] = cells[cellIndex]?.trim() ?? '';
        });
        rows.push(row);
        index += 1;
    }

    return rows;
}

function findSectionTable(lines: string[], sectionName: string): number | undefined {
    for (let index = 0; index < lines.length; index += 1) {
        const line = (lines[index] ?? '').trim();
        if (line === `## ${sectionName}` || line.startsWith(`## ${sectionName}`)) {
            for (let tableIndex = index + 1; tableIndex < lines.length; tableIndex += 1) {
                const candidate = (lines[tableIndex] ?? '').trim();
                if (candidate.startsWith('|')) return tableIndex;
                if (candidate.startsWith('## ') && tableIndex > index + 1) break;
            }
        }
    }
    return undefined;
}

function findFirstPropsTable(lines: string[]): number | undefined {
    for (let index = 0; index < lines.length; index += 1) {
        const line = (lines[index] ?? '').trim();
        if (line === '## Props' || /^## Props/.test(line)) {
            for (let tableIndex = index + 1; tableIndex < lines.length; tableIndex += 1) {
                const candidate = (lines[tableIndex] ?? '').trim();
                if (candidate.startsWith('|')) return tableIndex;
                if (candidate.startsWith('### ')) {
                    for (let nestedIndex = tableIndex + 1; nestedIndex < lines.length; nestedIndex += 1) {
                        const nested = (lines[nestedIndex] ?? '').trim();
                        if (nested.startsWith('|')) return nestedIndex;
                        if (nested.startsWith('## ')) break;
                    }
                }
                if (candidate.startsWith('## ') && tableIndex > index + 1) break;
            }
        }
    }
    return undefined;
}

function parseReadmeMeta(readme: string): {
    description: string;
    availableVersion: string;
    props: PropMeta[];
    events: EventMeta[];
    slots: SlotMeta[];
    methods: MethodMeta[];
} {
    const lines = readme.split('\n');
    const description =
        lines.map((line) => line.trim()).find((line) => line && !line.startsWith('>') && !line.startsWith('#')) ?? '';
    const availableVersion = readme.match(/\*\*Available Version\*\*:\s*(.+)/)?.[1]?.trim() ?? '2.0.0+';

    const propsTable = findFirstPropsTable(lines);
    const props =
        propsTable === undefined
            ? []
            : parseTable(
                  lines,
                  propsTable,
                  parseTableRow(lines[propsTable] ?? '').map((header) => header.toLowerCase()),
              )
                  .filter((row) => (row['prop'] ?? '').trim())
                  .map((row) => ({
                      name: stripBackticks(row['prop'] ?? ''),
                      type: stripBackticks(row['type'] ?? ''),
                      default: stripBackticks(row['default'] ?? ''),
                      required: Boolean((row['required'] ?? '').trim() && (row['required'] ?? '').trim() !== '-'),
                      description: (row['description'] ?? '').trim(),
                  }));

    const events = parseSection<EventMeta>(lines, 'Events', 'event', (row) => ({
        name: stripBackticks(row['event'] ?? ''),
        payload: stripBackticks(row['payload'] ?? ''),
        description: (row['description'] ?? '').trim(),
    }));
    const slots = parseSection<SlotMeta>(lines, 'Slots', 'slot', (row) => ({
        name: stripBackticks(row['slot'] ?? ''),
        description: (row['description'] ?? '').trim(),
    }));
    const methods = parseSection<MethodMeta>(lines, 'Methods', 'method', (row) => ({
        name: stripBackticks(row['method'] ?? ''),
        parameters: stripBackticks(row['parameters'] ?? ''),
        description: (row['description'] ?? '').trim(),
    }));

    return { description, availableVersion, props, events, slots, methods };
}

function parseSection<T>(
    lines: string[],
    sectionName: string,
    requiredColumn: string,
    mapRow: (row: Record<string, string>) => T,
): T[] {
    const tableIndex = findSectionTable(lines, sectionName);
    if (tableIndex === undefined) return [];
    const headers = parseTableRow(lines[tableIndex] ?? '').map((header) => header.toLowerCase());
    return parseTable(lines, tableIndex, headers)
        .filter((row) => (row[requiredColumn] ?? '').trim())
        .map(mapRow);
}

function braceDelta(line: string): number {
    const withoutStrings = line.replace(/(['"`])(?:\\.|(?!\1).)*\1/g, '');
    return (withoutStrings.match(/\{/g)?.length ?? 0) - (withoutStrings.match(/\}/g)?.length ?? 0);
}

function extractStyleSetInterface(content: string, componentName: string): string {
    const interfaceName = `${componentName}StyleSet`;
    const match = new RegExp(String.raw`export\s+interface\s+${interfaceName}\s*\{`).exec(content);
    if (!match) return '';

    const startIndex = match.index + match[0].length - 1;
    let depth = 0;
    for (let index = startIndex; index < content.length; index += 1) {
        if (content[index] === '{') depth += 1;
        if (content[index] === '}') {
            depth -= 1;
            if (depth === 0) return content.slice(match.index, index + 1);
        }
    }
    return '';
}

function parseVariablesBlock(content: string): Record<string, string> {
    const result: Record<string, string> = {};
    const nestedParsed = new Set<string>();
    const nestedRegex = /(\w+)\??\s*:\s*\{([^{}]*)\}/g;
    for (const match of content.matchAll(nestedRegex)) {
        const groupName = match[1] ?? '';
        nestedParsed.add(groupName);
        for (const inner of (match[2] ?? '').matchAll(/(\w+)\??\s*:\s*([^;,\n]+)/g)) {
            result[`${groupName}.${inner[1]}`] = (inner[2] ?? '').trim().replace(/;$/, '');
        }
    }

    const flatContent = content.replace(/\w+\??\s*:\s*\{[^{}]*\}/g, '');
    for (const match of flatContent.matchAll(/(\w+)\??\s*:\s*([^;,\n{}]+)/g)) {
        const name = match[1] ?? '';
        if (nestedParsed.has(name)) continue;
        result[name] = (match[2] ?? '').trim().replace(/;$/, '');
    }
    return result;
}

function parseStyleSet(typesContent: string, componentName: string): StyleSetMeta {
    const raw = extractStyleSetInterface(typesContent, componentName);
    if (!raw) return { variables: {}, component: false, childRefs: [], raw: '' };

    const variables: Record<string, string> = {};
    const varStart = raw.indexOf('variables?');
    if (varStart !== -1) {
        const braceStart = raw.indexOf('{', varStart);
        let depth = 0;
        for (let index = braceStart; index < raw.length; index += 1) {
            if (raw[index] === '{') depth += 1;
            if (raw[index] === '}') {
                depth -= 1;
                if (depth === 0) {
                    Object.assign(variables, parseVariablesBlock(raw.slice(braceStart + 1, index)));
                    break;
                }
            }
        }
    }

    const childRefs = new Set<string>();
    const selfName = `${componentName}StyleSet`;
    for (const match of raw.matchAll(/\w+\s*\?\s*:\s*(Vs\w+StyleSet)/g)) {
        const ref = match[1] ?? '';
        if (ref && ref !== selfName) childRefs.add(ref);
    }
    for (const match of raw.matchAll(/Omit\s*<\s*(Vs\w+StyleSet)/g)) {
        const ref = match[1] ?? '';
        if (ref && ref !== selfName) childRefs.add(ref);
    }

    return {
        variables,
        component: /component\s*\?\s*:\s*CSSProperties/.test(raw),
        childRefs: [...childRefs],
        raw,
    };
}

async function fetchRawCached(path: string, ref: string): Promise<string> {
    const cacheKey = `${ref}:raw:${path}`;
    const cached = rawCache.get(cacheKey);
    if (cached) return cached;

    const promise = fetchGitHubRawText(path, ref).catch((error: unknown) => {
        rawCache.delete(cacheKey);
        throw error;
    });
    rawCache.set(cacheKey, promise);
    return promise;
}

async function fetchDirectoryCached(path: string, ref: string): Promise<GitHubContentEntry[]> {
    const cacheKey = `${ref}:dir:${path}`;
    const cached = directoryCache.get(cacheKey);
    if (cached) return cached;

    const promise = fetchGitHubDirectory(path, ref).catch((error: unknown) => {
        directoryCache.delete(cacheKey);
        throw error;
    });
    directoryCache.set(cacheKey, promise);
    return promise;
}

function isGitHubNotFound(error: unknown): boolean {
    return error instanceof Error && /not found/i.test(error.message);
}

async function fetchRawOptional(path: string, ref: string): Promise<string> {
    try {
        return await fetchRawCached(path, ref);
    } catch (error) {
        if (isGitHubNotFound(error)) return '';
        throw error;
    }
}

function getComponentLookupKey(ref: string, name: string): string {
    return `${ref}:component:${name}`;
}

function normalizeComponentName(name: string): { name: string; kebabName: string } | undefined {
    const trimmed = name.trim();
    if (!trimmed) return undefined;
    const componentName = trimmed.includes('-') ? kebabToPascalCase(trimmed) : trimmed;
    return { name: componentName, kebabName: toKebabCase(componentName) };
}

function parseComponentMeta(name: string, kebabName: string, readme: string, types: string): ComponentMeta {
    const readmeMeta = parseReadmeMeta(readme);
    return {
        name,
        kebabName,
        description: readmeMeta.description,
        availableVersion: readmeMeta.availableVersion,
        props: readmeMeta.props,
        styleSet: parseStyleSet(types, name),
        events: readmeMeta.events,
        slots: readmeMeta.slots,
        methods: readmeMeta.methods,
    };
}

function rememberComponentMeta(ref: string, meta: ComponentMeta): void {
    const resolved = Promise.resolve(meta);
    componentLookupCache.set(getComponentLookupKey(ref, meta.name), resolved);
    componentLookupCache.set(getComponentLookupKey(ref, meta.kebabName), resolved);
}

async function fetchComponentMetaDirect(
    ref: string,
    name: string,
    kebabName: string,
): Promise<ComponentMeta | undefined> {
    try {
        const [readme, types] = await Promise.all([
            fetchRawCached(`${COMPONENTS_PATH}/${kebabName}/README.md`, ref),
            fetchRawOptional(`${COMPONENTS_PATH}/${kebabName}/types.ts`, ref),
        ]);
        return parseComponentMeta(name, kebabName, readme, types);
    } catch (error) {
        if (isGitHubNotFound(error)) return undefined;
        throw error;
    }
}

export async function resolveGitHubVersionContext(context: VersionContext): Promise<VersionContext> {
    if (context.resolvedRef) return context;

    const cacheKey = context.detectedVersion ?? 'main';
    const cached = refCache.get(cacheKey);
    if (cached) return { ...context, ...cached, warnings: [...context.warnings, ...cached.warnings] };

    const refs = getCandidateRefs(context.detectedVersion);
    for (const ref of refs) {
        try {
            await fetchRawCached('packages/vlossom/package.json', ref);
            const resolved: VersionContext = {
                ...context,
                resolvedRef: ref,
                fallbackRef: context.detectedVersion && ref === 'main' ? 'main' : undefined,
                warnings: [...context.warnings],
            };
            if (context.detectedVersion && ref === 'main') {
                resolved.warnings.push(
                    `Could not find a GitHub ref for Vlossom v${context.detectedVersion}; falling back to main, so version-specific guidance may be weakened.`,
                );
            }
            refCache.set(cacheKey, {
                ...resolved,
                warnings: resolved.warnings.filter((warning) => !context.warnings.includes(warning)),
            });
            return resolved;
        } catch {
            // try the next candidate ref
        }
    }

    throw new Error('GitHub repository data could not be loaded for Vlossom.');
}

export async function getAllComponentsMeta(versionContext: VersionContext): Promise<ComponentMeta[]> {
    const resolved = await resolveGitHubVersionContext(versionContext);
    const ref = resolved.resolvedRef ?? 'main';
    const cached = componentCache.get(ref);
    if (cached) return cached;

    const dirs = await getComponentIndex(resolved);
    const components = await mapWithConcurrency(dirs, GITHUB_FETCH_CONCURRENCY, async (entry) => {
        const name = entry.name;
        const [readme, types] = await Promise.all([
            fetchRawOptional(`${COMPONENTS_PATH}/${entry.kebabName}/README.md`, ref),
            fetchRawOptional(`${COMPONENTS_PATH}/${entry.kebabName}/types.ts`, ref),
        ]);
        return parseComponentMeta(name, entry.kebabName, readme, types);
    });
    const sorted = components.sort((a, b) => a.name.localeCompare(b.name));
    componentCache.set(ref, sorted);
    for (const component of sorted) rememberComponentMeta(ref, component);
    return sorted;
}

export async function getComponentIndex(versionContext: VersionContext): Promise<ComponentIndexEntry[]> {
    const resolved = await resolveGitHubVersionContext(versionContext);
    const ref = resolved.resolvedRef ?? 'main';
    const cached = componentIndexCache.get(ref);
    if (cached) return cached;

    const promise = fetchDirectoryCached(COMPONENTS_PATH, ref)
        .then((entries) =>
            entries
                .filter((entry) => entry.type === 'dir' && entry.name.startsWith('vs-'))
                .map((entry) => ({ name: kebabToPascalCase(entry.name), kebabName: entry.name }))
                .sort((a, b) => a.name.localeCompare(b.name)),
        )
        .catch((error: unknown) => {
            componentIndexCache.delete(ref);
            throw error;
        });
    componentIndexCache.set(ref, promise);
    return promise;
}

export async function getComponentMeta(
    name: string,
    versionContext: VersionContext,
): Promise<ComponentMeta | undefined> {
    const normalized = normalizeComponentName(name);
    if (!normalized) return undefined;

    const resolved = await resolveGitHubVersionContext(versionContext);
    const ref = resolved.resolvedRef ?? 'main';
    const all = componentCache.get(ref);
    if (all) {
        return all.find(
            (component) => component.name === normalized.name || component.kebabName === normalized.kebabName,
        );
    }

    const lookupKey = getComponentLookupKey(ref, normalized.name);
    const cached = componentLookupCache.get(lookupKey);
    if (cached) return cached;

    const promise = fetchComponentMetaDirect(ref, normalized.name, normalized.kebabName)
        .then((meta) => {
            if (meta) rememberComponentMeta(ref, meta);
            return meta;
        })
        .catch((error: unknown) => {
            componentLookupCache.delete(lookupKey);
            throw error;
        });
    componentLookupCache.set(lookupKey, promise);
    componentLookupCache.set(getComponentLookupKey(ref, normalized.kebabName), promise);
    return promise;
}

function parseDirectiveReadme(readme: string, name: string, kebabName: string): DirectiveMeta {
    const lines = readme.split('\n');
    const h1Index = lines.findIndex((line) => /^# /.test(line));
    const description =
        lines
            .slice(h1Index + 1)
            .map((line) => line.trim())
            .find(Boolean) ?? '';
    const availableVersion = readme.match(/\*\*Available Version\*\*[:\s]+([^\n]+)/)?.[1]?.trim() ?? '2.0.0+';
    const basicUsageIndex = lines.findIndex((line) => /^## Basic Usage/.test(line));
    const example = extractFenceAfter(lines, basicUsageIndex);
    const options = parseSection(lines, 'Options', 'binding', (row) => ({
        binding: stripBackticks(row['binding'] ?? row['name'] ?? ''),
        type: stripBackticks(row['type'] ?? ''),
        default: stripBackticks(row['default'] ?? ''),
        description: row['description'] ?? '',
    }));
    return { name, kebabName, description, availableVersion, options, example };
}

function extractFenceAfter(lines: string[], startIndex: number): string {
    if (startIndex < 0) return '';
    const body: string[] = [];
    let inFence = false;
    for (let index = startIndex + 1; index < lines.length; index += 1) {
        const line = lines[index] ?? '';
        if (line.startsWith('```')) {
            if (!inFence) {
                inFence = true;
                continue;
            }
            break;
        }
        if (inFence) body.push(line);
    }
    return body.join('\n').trim();
}

export async function loadDirectives(versionContext: VersionContext): Promise<DirectiveMeta[]> {
    const resolved = await resolveGitHubVersionContext(versionContext);
    const ref = resolved.resolvedRef ?? 'main';
    const cached = directiveCache.get(ref);
    if (cached) return cached;

    const entries = await fetchGitHubDirectory(DIRECTIVES_PATH, ref).catch(() => []);
    const directives = await mapWithConcurrency(
        entries.filter((entry) => entry.type === 'dir' && entry.name.startsWith('vs-')),
        GITHUB_FETCH_CONCURRENCY,
        async (entry) => {
            const readme = await fetchRawOptional(`${DIRECTIVES_PATH}/${entry.name}/README.md`, ref);
            return parseDirectiveReadme(readme, `v-${entry.name.slice(3)}`, entry.name);
        },
    );
    directiveCache.set(ref, directives);
    return directives;
}

function parseComposableReadme(readme: string, dirName: string, isPublic: boolean): ComposableMeta {
    const lines = readme.split('\n');
    const name =
        lines
            .find((line) => /^# /.test(line))
            ?.replace(/^# /, '')
            .trim() ?? '';
    const h1Index = lines.findIndex((line) => /^# /.test(line));
    const description =
        lines
            .slice(h1Index + 1)
            .map((line) => line.trim())
            .find((line) => line && !line.startsWith('#') && !line.startsWith('**')) ?? '';
    const availableVersion = readme.match(/\*\*Available Version\*\*[:\s]+([^\n]+)/)?.[1]?.trim() ?? '2.0.0+';
    const args = parseSection(lines, 'Args', 'arg', (row) => ({
        name: stripBackticks(row['arg'] ?? row['name'] ?? ''),
        type: stripBackticks(row['type'] ?? ''),
        default: stripBackticks(row['default'] ?? ''),
        required: row['required'] === 'Yes',
        description: row['description'] ?? '',
    }));
    const returnsIndex = lines.findIndex((line) => /^## Returns/.test(line));
    const returns =
        returnsIndex === -1
            ? ''
            : (lines
                  .slice(returnsIndex + 1)
                  .map((line) => line.trim())
                  .find((line) => line && !line.startsWith('#'))
                  ?.replace(/^[-*]\s*/, '') ?? '');
    const example = extractFenceAfter(
        lines,
        lines.findIndex((line) => /^## Basic Usage/.test(line)),
    );
    return {
        name,
        dirName,
        description,
        availableVersion,
        isPublic,
        args,
        returns,
        example,
    };
}

// Derive the public composable directory list from composables/index.ts so the
// surface follows whatever vlossom exports for the resolved version, instead of
// going stale against a hand-maintained allowlist.
async function loadPublicComposableDirs(ref: string): Promise<Set<string>> {
    const cached = publicComposableDirsCache.get(ref);
    if (cached) return cached;

    const promise = fetchRawCached(`${COMPOSABLES_PATH}/index.ts`, ref)
        .then((content) => {
            const dirs = new Set<string>();
            for (const match of content.matchAll(/from\s+['"]\.\/([^/'"]+)\/[^'"]+['"]/g)) {
                if (match[1]) dirs.add(match[1]);
            }
            return dirs;
        })
        .catch(() => new Set<string>());
    publicComposableDirsCache.set(ref, promise);
    return promise;
}

export async function loadComposables(versionContext: VersionContext): Promise<ComposableMeta[]> {
    const resolved = await resolveGitHubVersionContext(versionContext);
    const ref = resolved.resolvedRef ?? 'main';
    const cached = composableCache.get(ref);
    if (cached) return cached;

    const [publicDirs, entries] = await Promise.all([
        loadPublicComposableDirs(ref),
        fetchGitHubDirectory(COMPOSABLES_PATH, ref).catch(() => []),
    ]);
    const composables = await mapWithConcurrency(
        entries.filter((entry) => entry.type === 'dir' && !entry.name.includes('.') && entry.name !== '__tests__'),
        GITHUB_FETCH_CONCURRENCY,
        async (entry) => {
            const readme = await fetchRawOptional(`${COMPOSABLES_PATH}/${entry.name}/README.md`, ref);
            return parseComposableReadme(readme, entry.name, publicDirs.has(entry.name));
        },
    );
    composableCache.set(ref, composables);
    return composables;
}

// Plugin README contract (same as components): `# {Name} Plugin`, then a
// description paragraph, `## Methods` table (Method / Parameters /
// Description), and a fenced `## Basic Usage` example. We parse these into
// VlossomPluginMeta so reference-service stops needing a hand-curated copy
// that drifts as Vlossom plugin APIs evolve.
function simplifyPluginParameters(parameters: string): string {
    const cleaned = parameters.trim();
    if (!cleaned || cleaned === '-') return '';
    return cleaned
        .split(',')
        .map((part) => {
            const trimmed = part.trim();
            const colonIndex = trimmed.indexOf(':');
            return colonIndex === -1 ? trimmed : trimmed.slice(0, colonIndex).trim();
        })
        .filter(Boolean)
        .join(', ');
}

function parsePluginReadme(readme: string, property: string): VlossomPluginMeta {
    const lines = readme.split('\n');
    const h1Index = lines.findIndex((line) => /^# /.test(line));
    const description =
        lines
            .slice(h1Index === -1 ? 0 : h1Index + 1)
            .map((line) => line.trim())
            .find(
                (line) => line && !line.startsWith('#') && !line.startsWith('**') && !line.startsWith('>'),
            ) ?? '';
    const availableVersion = readme.match(/\*\*Available Version\*\*[:\s]+([^\n]+)/)?.[1]?.trim() ?? '2.0.0+';
    const methods = parseSection(lines, 'Methods', 'method', (row) => {
        const methodName = stripBackticks(row['method'] ?? '');
        const params = simplifyPluginParameters(stripBackticks(row['parameters'] ?? ''));
        return {
            name: methodName ? `${methodName}(${params})` : '',
            description: (row['description'] ?? '').trim(),
        };
    }).filter((method) => method.name);
    const example = extractFenceAfter(
        lines,
        lines.findIndex((line) => /^## Basic Usage/.test(line)),
    );

    return {
        name: `$vs.${property}`,
        property,
        description,
        availableVersion,
        methods,
        example,
    };
}

export async function loadPlugins(versionContext: VersionContext): Promise<VlossomPluginMeta[]> {
    const resolved = await resolveGitHubVersionContext(versionContext);
    const ref = resolved.resolvedRef ?? 'main';
    const cached = pluginCache.get(ref);
    if (cached) return cached;

    const entries = await fetchGitHubDirectory(PLUGINS_PATH, ref).catch(() => []);
    const plugins = await mapWithConcurrency(
        entries.filter((entry) => entry.type === 'dir' && entry.name.endsWith('-plugin')),
        GITHUB_FETCH_CONCURRENCY,
        async (entry) => {
            const readme = await fetchRawOptional(`${PLUGINS_PATH}/${entry.name}/README.md`, ref);
            const property = entry.name.replace(/-plugin$/, '');
            return parsePluginReadme(readme, property);
        },
    );
    const sorted = plugins.sort((a, b) => a.property.localeCompare(b.property));
    pluginCache.set(ref, sorted);
    return sorted;
}

const setupExampleCache = new Map<string, Promise<string>>();

const SETUP_EXAMPLE_FALLBACK = `import { createApp } from 'vue'
import { createVlossom, VlossomComponents } from 'vlossom'
import 'vlossom/styles'
import App from './App.vue'

const app = createApp(App)
app.use(createVlossom({ components: VlossomComponents }))
app.mount('#app')`;

// Pull the install snippet from vlossom's main package README so the
// example shown by get_vlossom_reference({type:'option'}) tracks whatever
// setup pattern the resolved Vlossom version documents. Falls back to a
// minimal createVlossom call when the README is unreachable or the
// `## Setup` section is missing.
export async function loadSetupExample(versionContext: VersionContext): Promise<string> {
    const resolved = await resolveGitHubVersionContext(versionContext);
    const ref = resolved.resolvedRef ?? 'main';
    const cached = setupExampleCache.get(ref);
    if (cached) return cached;

    const promise = fetchRawCached('packages/vlossom/README.md', ref)
        .then((readme) => {
            const lines = readme.split('\n');
            const setupIndex = lines.findIndex((line) => /^##\s+Setup\b/i.test(line));
            const fenced = extractFenceAfter(lines, setupIndex);
            return fenced || SETUP_EXAMPLE_FALLBACK;
        })
        .catch(() => SETUP_EXAMPLE_FALLBACK);
    setupExampleCache.set(ref, promise);
    return promise;
}

function categorizeToken(name: string): string {
    if (
        /--vs-(white|black|gray|red|brown|orange|amber|yellow|lime|green|teal|cyan|blue|indigo|violet|purple|pink)-/.test(
            name,
        )
    )
        return 'palette';
    if (/--vs-(comp|area|line|font|shadow)-/.test(name) || /--vs-cs-/.test(name)) return 'color-scheme';
    if (/--vs-(font-size|font-weight|line-height|white-space)/.test(name)) return 'typography';
    if (/--vs-radius/.test(name)) return 'radius';
    if (/--vs-padding/.test(name)) return 'spacing';
    if (/--vs-(comp-height|size|default-comp)/.test(name)) return 'size';
    if (/--vs-(bar|modal|toast|floating)-z-index/.test(name)) return 'z-index';
    if (/--vs-(app-bg|no-color)/.test(name)) return 'color-scheme';
    return 'misc';
}

function parseCssVars(cssText: string): Array<{ name: string; value: string; inDark: boolean }> {
    const tokens: Array<{ name: string; value: string; inDark: boolean }> = [];
    let inDarkBlock = false;
    let braceDepth = 0;
    let darkBraceDepth = 0;
    for (const rawLine of cssText.split('\n')) {
        const line = rawLine.trim();
        if (/@variant dark/.test(line)) {
            inDarkBlock = true;
            darkBraceDepth = braceDepth + 1;
        }
        braceDepth += (line.match(/\{/g)?.length ?? 0) - (line.match(/\}/g)?.length ?? 0);
        if (inDarkBlock && braceDepth < darkBraceDepth) inDarkBlock = false;
        const match = line.match(/^(--vs-[\w-]+)\s*:\s*([^;]+)\s*;/);
        if (match) tokens.push({ name: match[1] ?? '', value: (match[2] ?? '').trim(), inDark: inDarkBlock });
    }
    return tokens;
}

export async function loadCssTokens(versionContext: VersionContext): Promise<CssToken[]> {
    const resolved = await resolveGitHubVersionContext(versionContext);
    const ref = resolved.resolvedRef ?? 'main';
    const cached = tokenCache.get(ref);
    if (cached) return cached;

    const files = ['variables.css', 'palette.css', 'color-scheme-variables.css'];
    const map = new Map<string, CssToken>();
    for (const file of files) {
        const css = await fetchRawCached(`${STYLES_PATH}/${file}`, ref).catch(() => '');
        for (const token of parseCssVars(css)) {
            const entry = map.get(token.name) ?? {
                name: token.name,
                defaultValue: '',
                darkValue: undefined,
                category: categorizeToken(token.name),
            };
            if (token.inDark) entry.darkValue = token.value;
            else entry.defaultValue = token.value;
            map.set(token.name, entry);
        }
    }

    const tokens = [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
    tokenCache.set(ref, tokens);
    return tokens;
}

export { toKebabCase };
