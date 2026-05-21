import { getComponentMeta } from '../../services/meta-registry';
import type { ComponentSummary } from '../../types/meta';
import type { CoverageEntry, VersionContext } from '../types';
import { toComponentSummary } from '../types';

interface UiPatternCoverage {
    requirement: string;
    keywords: string[];
    components: string[];
    alternatives?: string[];
}

export const UI_PATTERN_COVERAGE: UiPatternCoverage[] = [
    {
        requirement: 'actions and buttons',
        keywords: ['button', 'submit', 'action', 'cta', 'save', 'cancel', 'delete'],
        components: ['VsButton'],
        alternatives: ['button', 'el-button', 'v-btn', 'n-button', 'a-button', 'q-btn'],
    },
    {
        requirement: 'text input',
        keywords: ['input', 'field', 'text', 'email', 'password', 'search field'],
        components: ['VsInput', 'VsSearchInput'],
        alternatives: ['input', 'el-input', 'v-text-field', 'n-input', 'a-input'],
    },
    {
        requirement: 'textarea',
        keywords: ['textarea', 'multiline', 'comment', 'description'],
        components: ['VsTextarea'],
        alternatives: ['textarea', 'el-input[type=textarea]', 'v-textarea', 'n-input'],
    },
    {
        requirement: 'select and dropdown',
        keywords: ['select', 'dropdown', 'combobox', 'picker', 'option'],
        components: ['VsSelect'],
        alternatives: ['select', 'el-select', 'v-select', 'n-select', 'a-select'],
    },
    {
        requirement: 'checkbox selection',
        keywords: ['checkbox', 'multi select', 'check'],
        components: ['VsCheckbox'],
        alternatives: ['input[type=checkbox]', 'el-checkbox', 'v-checkbox', 'n-checkbox'],
    },
    {
        requirement: 'radio selection',
        keywords: ['radio', 'single choice'],
        components: ['VsRadio'],
        alternatives: ['input[type=radio]', 'el-radio', 'v-radio', 'n-radio'],
    },
    {
        requirement: 'toggle or switch',
        keywords: ['switch', 'toggle', 'on off', 'enable', 'disable'],
        components: ['VsSwitch', 'VsToggle'],
        alternatives: ['input[type=checkbox]', 'el-switch', 'v-switch', 'n-switch'],
    },
    {
        requirement: 'form validation',
        keywords: ['form', 'validation', 'validate', 'required'],
        components: ['VsForm', 'VsInput', 'VsSelect', 'VsCheckbox', 'VsRadio'],
        alternatives: ['form'],
    },
    {
        requirement: 'data table',
        keywords: ['table', 'grid data', 'rows', 'columns', 'pagination'],
        components: ['VsTable', 'VsPagination'],
        alternatives: ['table', 'el-table', 'v-data-table', 'n-data-table', 'a-table'],
    },
    {
        requirement: 'modal dialog',
        keywords: ['modal', 'dialog', 'popup', 'confirm'],
        components: ['VsModal'],
        alternatives: ['dialog', 'el-dialog', 'v-dialog', 'n-modal', 'a-modal'],
    },
    {
        requirement: 'drawer or side panel',
        keywords: ['drawer', 'sidebar', 'side panel', 'offcanvas'],
        components: ['VsDrawer'],
        alternatives: ['el-drawer', 'v-navigation-drawer', 'n-drawer', 'a-drawer'],
    },
    {
        requirement: 'tabs',
        keywords: ['tabs', 'tabbed', 'sections'],
        components: ['VsTabs'],
        alternatives: ['el-tabs', 'v-tabs', 'n-tabs', 'a-tabs'],
    },
    {
        requirement: 'accordion or expandable content',
        keywords: ['accordion', 'collapse', 'expand', 'faq'],
        components: ['VsAccordion', 'VsExpandable'],
        alternatives: ['details', 'el-collapse', 'v-expansion-panels', 'n-collapse'],
    },
    {
        requirement: 'progress and loading',
        keywords: ['progress', 'loading', 'spinner', 'skeleton', 'shimmer'],
        components: ['VsProgress', 'VsLoading', 'VsSkeleton'],
        alternatives: ['progress', 'el-progress', 'v-progress-linear', 'n-progress'],
    },
    {
        requirement: 'file upload',
        keywords: ['file', 'upload', 'dropzone', 'drag and drop'],
        components: ['VsFileDrop'],
        alternatives: ['input[type=file]', 'el-upload', 'v-file-input', 'n-upload'],
    },
    {
        requirement: 'page layout',
        keywords: ['layout', 'page', 'header', 'footer', 'responsive', 'grid'],
        components: ['VsPage', 'VsLayout', 'VsHeader', 'VsFooter', 'VsGrid', 'VsResponsive'],
        alternatives: ['div', 'section', 'header', 'footer'],
    },
];

async function componentSummaries(names: string[], versionContext: VersionContext): Promise<ComponentSummary[]> {
    const metas = await Promise.all(names.map((name) => getComponentMeta(name, versionContext)));
    return metas.filter((meta): meta is NonNullable<typeof meta> => meta !== undefined).map(toComponentSummary);
}

export async function resolveCoverage(description: string, versionContext: VersionContext): Promise<CoverageEntry[]> {
    const query = description.toLowerCase();
    const matchingPatterns = UI_PATTERN_COVERAGE.filter((pattern) =>
        pattern.keywords.some((keyword) => query.includes(keyword)),
    );
    const entries = await Promise.all(
        matchingPatterns.map(async (pattern) => {
            const components = await componentSummaries(pattern.components, versionContext);
            return {
                requirement: pattern.requirement,
                covered: components.length > 0,
                components,
                alternatives: pattern.alternatives,
                confidence: components.length > 0 ? ('direct' as const) : ('none' as const),
                notes:
                    components.length > 0
                        ? 'Covered by registry-backed Vlossom components.'
                        : 'No registry-backed Vlossom component is available for this requirement.',
            };
        }),
    );

    return entries;
}

export async function findCoverageForAlternative(
    tagOrImport: string,
    versionContext: VersionContext,
): Promise<CoverageEntry | undefined> {
    const normalized = tagOrImport.toLowerCase();
    const pattern = UI_PATTERN_COVERAGE.find((entry) =>
        entry.alternatives?.some((alternative) => normalized.includes(alternative.toLowerCase())),
    );
    if (!pattern) return undefined;

    const components = await componentSummaries(pattern.components, versionContext);
    if (components.length === 0) return undefined;

    return {
        requirement: pattern.requirement,
        covered: true,
        components,
        alternatives: pattern.alternatives,
        confidence: 'direct',
        notes: 'A Vlossom equivalent exists for this UI pattern.',
    };
}
