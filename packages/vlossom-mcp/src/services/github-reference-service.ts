import { fetchGitHubJson, fetchGitHubRawText, getRawGitHubUrl } from './github-client';
import type { ChangelogData, ChangelogEntryRaw } from '../internal/types';
import type { ComponentMeta } from '../types/meta';
import type { VersionContext } from '../internal/types';
import { getCandidateRefs } from '../internal/version/version-service';

interface GitHubRelease {
    tag_name: string;
    name: string | null;
    draft: boolean;
    prerelease: boolean;
    published_at: string | null;
    body: string | null;
}

let changelogCache: ChangelogData | null = null;
const sourceCache = new Map<string, string>();

export interface ComponentSourceFetchResult {
    path: string;
    ref: string;
    url: string;
    source: string;
    fallback?: boolean;
}

function tagToVersion(tag: string): string {
    return tag.replace(/^(?:.*-)?v/, '');
}

function parseSemver(version: string): [number, number, number] {
    const [major, minor, patch] = version
        .replace(/[^0-9.]/g, '')
        .split('.')
        .map(Number);
    return [major ?? 0, minor ?? 0, patch ?? 0];
}

function compareSemverDesc(a: string, b: string): number {
    const av = parseSemver(a);
    const bv = parseSemver(b);
    for (let i = 0; i < 3; i += 1) {
        if (av[i] !== bv[i]) return bv[i] - av[i];
    }
    return 0;
}

function parseReleaseBody(body: string | null): Pick<ChangelogEntryRaw, 'breaking' | 'features' | 'fixes'> {
    const breaking: string[] = [];
    const features: string[] = [];
    const fixes: string[] = [];
    if (!body) return { breaking, features, fixes };

    let section: 'breaking' | 'features' | 'fixes' | null = null;
    for (const rawLine of body.split('\n')) {
        const line = rawLine.trim();
        const lower = line.toLowerCase();

        if (/^#+\s/.test(line)) {
            if (lower.includes('break') || lower.includes('migration')) section = 'breaking';
            else if (lower.includes('feat') || lower.includes('new') || lower.includes('add')) section = 'features';
            else if (lower.includes('fix') || lower.includes('bug') || lower.includes('patch')) section = 'fixes';
            else section = null;
            continue;
        }

        const item = line.replace(/^[-*]\s*/, '').trim();
        if (!item) continue;

        if (section === 'breaking') breaking.push(item);
        else if (section === 'features') features.push(item);
        else if (section === 'fixes') fixes.push(item);
    }

    return { breaking, features, fixes };
}

function getCurrentVersion(latestVersion: string): string {
    return latestVersion;
}

export async function fetchChangelog(): Promise<ChangelogData> {
    if (changelogCache) return changelogCache;

    const releases = await fetchGitHubJson<GitHubRelease[]>('/releases?per_page=100');
    const entries = releases
        .filter((release) => !release.draft)
        .map((release) => {
            const version = tagToVersion(release.tag_name);
            const parsed = parseReleaseBody(release.body);
            return {
                version,
                date: release.published_at?.slice(0, 10) ?? '',
                prerelease: release.prerelease,
                ...parsed,
                notes: release.body?.trim() || undefined,
            } satisfies ChangelogEntryRaw;
        })
        .sort((a, b) => compareSemverDesc(a.version, b.version));

    const latestStable = entries.find((entry) => !entry.prerelease)?.version ?? null;
    const latestPrerelease = entries.find((entry) => entry.prerelease)?.version ?? null;
    const latestVersion = entries[0]?.version ?? 'unknown';

    changelogCache = {
        latestStable,
        latestPrerelease,
        latestVersion,
        currentVersion: getCurrentVersion(latestVersion),
        entries,
    };
    return changelogCache;
}

export function getComponentSourcePath(meta: ComponentMeta): string {
    return `packages/vlossom/src/components/${meta.kebabName}/${meta.name}.vue`;
}

export function getComponentSourceUrl(meta: ComponentMeta, ref = 'main'): string {
    return getRawGitHubUrl(getComponentSourcePath(meta), ref);
}

async function fetchComponentSourceFromRef(path: string, ref: string): Promise<string> {
    const cacheKey = `${ref}:${path}`;
    const cached = sourceCache.get(cacheKey);
    if (cached) return cached;

    const source = await fetchGitHubRawText(path, ref);
    sourceCache.set(cacheKey, source);
    return source;
}

export async function fetchComponentSource(
    meta: ComponentMeta,
    versionContext?: VersionContext,
): Promise<ComponentSourceFetchResult> {
    const path = getComponentSourcePath(meta);
    let lastError: unknown;
    const refs = versionContext?.resolvedRef
        ? [versionContext.resolvedRef]
        : getCandidateRefs(versionContext?.detectedVersion);

    for (const ref of refs) {
        try {
            return {
                path,
                ref,
                url: getRawGitHubUrl(path, ref),
                source: await fetchComponentSourceFromRef(path, ref),
                fallback: Boolean(versionContext?.detectedVersion) && ref === 'main',
            };
        } catch (error) {
            lastError = error;
        }
    }

    throw lastError instanceof Error ? lastError : new Error('Failed to fetch component source.');
}
