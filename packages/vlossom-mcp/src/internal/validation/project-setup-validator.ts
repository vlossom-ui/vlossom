import type { VlossomValidationIssue } from './vlossom-first-validator';
import { validateVlossomFirst } from './vlossom-first-validator';
import type { VersionContext } from '../types';
import { resolveVersionContext } from '../version/version-service';
import { resolveGitHubVersionContext } from '../../services/github-registry-service';

export interface ProjectFile {
    path: string;
    content: string;
}

export interface ProjectSetupValidationInput {
    packageJson?: string;
    files?: ProjectFile[];
    framework?: 'vite' | 'nuxt';
    version?: string;
    vlossomFirst?: 'strict' | 'prefer' | 'off';
}

export interface ProjectSetupValidationResult {
    status: 'ok' | 'skipped';
    issues: VlossomValidationIssue[];
    recommendations: string[];
    versionContext: VersionContext;
}

const THIRD_PARTY_UI_DEPS = [
    'element-plus',
    'vuetify',
    'ant-design-vue',
    'naive-ui',
    'quasar',
    'primevue',
    'bootstrap-vue',
];

function setupIssue(ruleId: string, message: string, suggestion: string): VlossomValidationIssue {
    return { ruleId, severity: 'error', message, suggestion };
}

function parsePackageJson(packageJson: string | undefined): {
    deps: Record<string, string>;
    issues: VlossomValidationIssue[];
    recommendations: string[];
} {
    if (!packageJson) return { deps: {}, issues: [], recommendations: [] };
    try {
        const pkg = JSON.parse(packageJson) as {
            dependencies?: Record<string, string>;
            devDependencies?: Record<string, string>;
        };
        const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
        const issues: VlossomValidationIssue[] = [];
        const recommendations: string[] = [];

        if (!deps.vlossom) {
            issues.push(
                setupIssue(
                    'PROJECT_SETUP',
                    'package.json does not include vlossom.',
                    'Install vlossom and validate again.',
                ),
            );
        }
        if (!deps.vue) {
            issues.push(
                setupIssue(
                    'PROJECT_SETUP',
                    'package.json does not include Vue.',
                    'Vlossom requires Vue 3. Add vue to dependencies.',
                ),
            );
        }
        if (!deps.tailwindcss) {
            issues.push(
                setupIssue(
                    'PROJECT_SETUP',
                    'package.json does not include tailwindcss.',
                    'Install tailwindcss because Vlossom styles depend on Tailwind CSS.',
                ),
            );
        }

        return { deps, issues, recommendations };
    } catch {
        return {
            deps: {},
            issues: [
                setupIssue('PROJECT_SETUP', 'packageJson could not be parsed.', 'Pass valid package.json contents.'),
            ],
            recommendations: [],
        };
    }
}

function findSetupFile(files: ProjectFile[] | undefined): ProjectFile | undefined {
    return files?.find((file) => /(^|\/|\\)(main|vlossom|plugins\/vlossom)\.(ts|js)$/.test(file.path));
}

function validateThirdPartyUiDependencies(
    deps: Record<string, string>,
    mode: 'strict' | 'prefer' | 'off',
): { issues: VlossomValidationIssue[]; recommendations: string[] } {
    const foundThirdParty = THIRD_PARTY_UI_DEPS.filter((dep) => deps[dep]);
    if (foundThirdParty.length === 0 || mode === 'off') {
        return { issues: [], recommendations: [] };
    }

    const message = `Third-party UI libraries detected: ${foundThirdParty.join(', ')}.`;
    const suggestion =
        'Before using these libraries, search Vlossom coverage and migrate covered UI patterns to Vlossom components.';

    if (mode === 'strict') {
        return {
            issues: [
                setupIssue(
                    'PREFER_VLOSSOM_COMPONENT',
                    `${message} Strict Vlossom-first project setup does not allow third-party UI for covered patterns.`,
                    suggestion,
                ),
            ],
            recommendations: [],
        };
    }

    return {
        issues: [],
        recommendations: [
            `${message} In Vlossom-first prefer mode, treat them as migration candidates when Vlossom coverage exists.`,
        ],
    };
}

async function validateProjectFilesForVlossomFirst(
    files: ProjectFile[] | undefined,
    mode: 'strict' | 'prefer' | 'off',
    versionContext: VersionContext,
): Promise<VlossomValidationIssue[]> {
    if (!files || mode === 'off') return [];

    const fileIssues = await Promise.all(
        files.map(async (file) =>
            (await validateVlossomFirst(file.content, mode, versionContext)).map((issue) => ({
                ...issue,
                message: `${file.path}: ${issue.message}`,
            })),
        ),
    );
    return fileIssues.flat();
}

function validateSetupFile(file: ProjectFile | undefined): VlossomValidationIssue[] {
    if (!file) {
        return [
            setupIssue(
                'PROJECT_SETUP',
                'No Vlossom setup file was provided.',
                'Pass src/main.ts, src/main.js, or plugins/vlossom.ts so createVlossom setup can be validated.',
            ),
        ];
    }

    const issues: VlossomValidationIssue[] = [];
    const code = file.content;

    if (!/createVlossom/.test(code)) {
        issues.push(
            setupIssue(
                'PROJECT_SETUP',
                `${file.path} does not call createVlossom().`,
                'Install the Vlossom plugin with app.use(createVlossom({ components: VlossomComponents })).',
            ),
        );
    }
    if (!/VlossomComponents/.test(code)) {
        issues.push(
            setupIssue(
                'PROJECT_SETUP',
                `${file.path} does not reference VlossomComponents.`,
                'Pass components: VlossomComponents to createVlossom unless deliberately using a partial component registry.',
            ),
        );
    }
    if (!/components\s*:/.test(code)) {
        issues.push(
            setupIssue(
                'PROJECT_SETUP',
                'createVlossom() is missing the required components option.',
                'Use createVlossom({ components: VlossomComponents }).',
            ),
        );
    }
    if (!/['"]vlossom\/styles['"]/.test(code)) {
        issues.push(
            setupIssue(
                'PROJECT_SETUP',
                `${file.path} does not import Vlossom styles.`,
                "Add import 'vlossom/styles' in the setup entry.",
            ),
        );
    }

    return issues;
}

export async function validateProjectSetup(input: ProjectSetupValidationInput): Promise<ProjectSetupValidationResult> {
    const versionContext = await resolveGitHubVersionContext(
        resolveVersionContext({
            version: input.version,
            packageJson: input.packageJson,
        }),
    );

    if (!input.packageJson && (!input.files || input.files.length === 0)) {
        return { status: 'skipped', issues: [], recommendations: [], versionContext };
    }

    const parsed = parsePackageJson(input.packageJson);
    const vlossomFirst = input.vlossomFirst ?? 'strict';
    const setupIssues = input.files ? validateSetupFile(findSetupFile(input.files)) : [];
    const thirdParty = validateThirdPartyUiDependencies(parsed.deps, vlossomFirst);
    const fileIssues = await validateProjectFilesForVlossomFirst(input.files, vlossomFirst, versionContext);

    return {
        status: 'ok',
        issues: [...parsed.issues, ...setupIssues, ...thirdParty.issues, ...fileIssues],
        recommendations: [...parsed.recommendations, ...thirdParty.recommendations, ...versionContext.warnings],
        versionContext,
    };
}
