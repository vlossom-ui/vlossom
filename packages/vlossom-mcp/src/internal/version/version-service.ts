import type { VersionContext, VersionSupport } from '../types';

export interface VersionContextInput {
    version?: string;
    packageJson?: string;
}

interface ParsedVersion {
    major: number;
    minor: number;
    patch: number;
    prerelease?: string;
}

function parsePackageJson(packageJson: string | undefined): Record<string, string> {
    if (!packageJson) return {};
    try {
        const pkg = JSON.parse(packageJson) as {
            dependencies?: Record<string, string>;
            devDependencies?: Record<string, string>;
            peerDependencies?: Record<string, string>;
        };
        return {
            ...(pkg.dependencies ?? {}),
            ...(pkg.devDependencies ?? {}),
            ...(pkg.peerDependencies ?? {}),
        };
    } catch {
        return {};
    }
}

export function extractVlossomVersionRange(packageJson: string | undefined): string | undefined {
    return parsePackageJson(packageJson).vlossom;
}

export function normalizeVersionRange(value: string | undefined): string | undefined {
    const raw = value?.trim();
    if (!raw) return undefined;
    if (/^(workspace|file|link|portal):/i.test(raw)) return undefined;
    if (/^(latest|next|beta|alpha|\*)$/i.test(raw)) return undefined;

    const match = raw.match(/\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?/);
    return match?.[0];
}

function parseVersion(value: string | undefined): ParsedVersion | undefined {
    const version = normalizeVersionRange(value);
    const match = version?.match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/);
    if (!match) return undefined;
    return {
        major: Number(match[1]),
        minor: Number(match[2]),
        patch: Number(match[3]),
        prerelease: match[4],
    };
}

function compareVersionCores(a: string, b: string): number | undefined {
    const av = parseVersion(a);
    const bv = parseVersion(b);
    if (!av || !bv) return undefined;

    if (av.major !== bv.major) return av.major - bv.major;
    if (av.minor !== bv.minor) return av.minor - bv.minor;
    if (av.patch !== bv.patch) return av.patch - bv.patch;
    return 0;
}

export function resolveVersionContext(input: VersionContextInput = {}): VersionContext {
    const requestedVersion = input.version?.trim() || undefined;
    const packageVersionRange = extractVlossomVersionRange(input.packageJson);
    const source = requestedVersion ? 'input' : packageVersionRange ? 'packageJson' : 'unknown';
    const rawVersion = requestedVersion ?? packageVersionRange;
    const detectedVersion = normalizeVersionRange(rawVersion);
    const warnings: string[] = [];

    if (!rawVersion) {
        warnings.push('No vlossom version was provided. Pass packageJson or version for version-specific guidance.');
    } else if (!detectedVersion) {
        warnings.push(`Could not resolve a concrete vlossom version from '${rawVersion}'. Version support is unknown.`);
    }

    return {
        source,
        requestedVersion,
        packageVersionRange,
        detectedVersion,
        warnings,
    };
}

export function getCandidateRefs(version: string | undefined): string[] {
    if (!version) return ['main'];
    return [...new Set([`vlossom-v${version}`, `v${version}`, version, 'main'])];
}

export function getMinimumVersion(availableVersion: string | undefined): string | undefined {
    return normalizeVersionRange(availableVersion);
}

export function getVersionSupport(availableVersion: string | undefined, context: VersionContext): VersionSupport {
    const minimumVersion = getMinimumVersion(availableVersion);
    const requestedVersion = context.detectedVersion;

    if (!requestedVersion) {
        return {
            status: 'unknown',
            requestedVersion,
            minimumVersion,
            availableVersion,
            message: "Version support is unknown because the project's vlossom version was not detected.",
        };
    }

    if (!minimumVersion) {
        return {
            status: 'unknown',
            requestedVersion,
            minimumVersion,
            availableVersion,
            message: 'Version support is unknown because the registry entry has no minimum version.',
        };
    }

    const comparison = compareVersionCores(requestedVersion, minimumVersion);
    if (comparison === undefined) {
        return {
            status: 'unknown',
            requestedVersion,
            minimumVersion,
            availableVersion,
            message: `Version support is unknown for vlossom v${requestedVersion}.`,
        };
    }

    if (comparison < 0) {
        return {
            status: 'unsupported',
            requestedVersion,
            minimumVersion,
            availableVersion,
            message: `Requires Vlossom ${availableVersion ?? minimumVersion}, but the project uses v${requestedVersion}. Do not use this API unless upgrading Vlossom.`,
        };
    }

    return {
        status: 'supported',
        requestedVersion,
        minimumVersion,
        availableVersion,
        message: `Supported by the detected Vlossom v${requestedVersion}.`,
    };
}

export function findUnsupportedEntries<T extends { name: string; availableVersion?: string }>(
    entries: T[],
    context: VersionContext,
): Array<{ entry: T; support: VersionSupport }> {
    return entries
        .map((entry) => ({ entry, support: getVersionSupport(entry.availableVersion, context) }))
        .filter(({ support }) => support.status === 'unsupported');
}
