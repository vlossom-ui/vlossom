import { existsSync, readdirSync } from 'node:fs';
import { posix, relative, resolve, sep } from 'node:path';
import type { DefaultTheme, MarkdownRenderer } from 'vitepress';

export type ReadmeLocale = 'root' | 'ko';

export interface ReadmePage {
    source: string;
    route: string;
    section: string;
    name: string;
    locale: ReadmeLocale;
}

export interface ReadmeLinksOptions {
    srcDir: string;
    pages: ReadmePage[];
    exists?: (file: string) => boolean;
}

const LOCALES: ReadmeLocale[] = ['root', 'ko'];
const LOCALE_ROUTE_PREFIX: Record<ReadmeLocale, string> = { root: '', ko: 'ko/' };

const SECTIONS = [
    { dir: 'components', text: { root: 'Components', ko: '컴포넌트' } },
    { dir: 'composables', text: { root: 'Composables', ko: '컴포저블' } },
    { dir: 'directives', text: { root: 'Directives', ko: '디렉티브' } },
    { dir: 'plugins', text: { root: 'Plugins', ko: '플러그인' } },
    { dir: 'utils', text: { root: 'Utils', ko: '유틸리티' } },
] as const;

const UTILS_SECTION = 'utils';
const UNIT_SECTIONS = SECTIONS.map((section) => section.dir).filter((dir) => dir !== UTILS_SECTION);
const UNIT_README = new RegExp(`^vlossom/src/(${UNIT_SECTIONS.join('|')})/([^/]+)/README(\\.ko)?\\.md$`);
const UTILS_README = new RegExp(`^vlossom/src/${UTILS_SECTION}/README(\\.ko)?\\.md$`);
const DOCS_PAGES_DIR = 'vlossom-docs/pages/';
const REPOSITORY_BLOB_URL = 'https://github.com/vlossom-ui/vlossom/blob/main';
const URL_SCHEME = /^[a-z][a-z\d+.-]*:/i;

// VitePress 페이지 탐색(glob)이 건너뛰는 디렉터리와 같다.
const SKIPPED_DIRS = new Set(['node_modules', 'dist']);

export function listMarkdownFiles(root: string, dir = ''): string[] {
    return readdirSync(resolve(root, dir), { withFileTypes: true }).flatMap((entry) => {
        const path = dir ? `${dir}/${entry.name}` : entry.name;
        if (entry.isDirectory()) {
            return SKIPPED_DIRS.has(entry.name) ? [] : listMarkdownFiles(root, path);
        }
        return entry.name.endsWith('.md') ? [path] : [];
    });
}

function createPage(source: string, section: string, name: string, korean: string | undefined): ReadmePage {
    const locale: ReadmeLocale = korean ? 'ko' : 'root';
    const path = section === UTILS_SECTION ? UTILS_SECTION : `${section}/${name}`;
    return { source, route: `${LOCALE_ROUTE_PREFIX[locale]}${path}.md`, section, name, locale };
}

function toPage(source: string): ReadmePage | undefined {
    const utils = UTILS_README.exec(source);
    if (utils) {
        return createPage(source, UTILS_SECTION, UTILS_SECTION, utils[1]);
    }
    const unit = UNIT_README.exec(source);
    if (!unit) {
        return undefined;
    }
    const [, section, name, korean] = unit;
    return createPage(source, section, name, korean);
}

function sectionIndex(page: ReadmePage): number {
    return SECTIONS.findIndex((section) => section.dir === page.section);
}

function comparePages(a: ReadmePage, b: ReadmePage): number {
    const byLocale = LOCALES.indexOf(a.locale) - LOCALES.indexOf(b.locale);
    if (byLocale !== 0) {
        return byLocale;
    }
    const bySection = sectionIndex(a) - sectionIndex(b);
    if (bySection !== 0) {
        return bySection;
    }
    if (a.name === b.name) {
        return 0;
    }
    return a.name < b.name ? -1 : 1;
}

export function selectReadmePages(files: string[]): ReadmePage[] {
    return files
        .map(toPage)
        .filter((page): page is ReadmePage => page !== undefined)
        .sort(comparePages);
}

export function toSrcExclude(files: string[], pages: ReadmePage[]): string[] {
    const sources = new Set(pages.map((page) => page.source));
    return files.filter((file) => !file.startsWith(DOCS_PAGES_DIR) && !sources.has(file));
}

export function toRewrites(files: string[], pages: ReadmePage[]): Record<string, string> {
    const docsPages = files
        .filter((file) => file.startsWith(DOCS_PAGES_DIR))
        .map((file) => [file, file.slice(DOCS_PAGES_DIR.length)]);
    return Object.fromEntries([...docsPages, ...pages.map((page) => [page.source, page.route])]);
}

export function pageLink(page: ReadmePage): string {
    return `/${page.route.replace(/\.md$/, '')}`;
}

function pascalCase(kebab: string): string {
    return kebab
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
}

export function toSidebar(pages: ReadmePage[], locale: ReadmeLocale): DefaultTheme.SidebarItem[] {
    const localePages = pages.filter((page) => page.locale === locale);
    return SECTIONS.map((section) => ({
        text: section.text[locale],
        collapsed: section.dir !== 'components',
        items: localePages
            .filter((page) => page.section === section.dir)
            .map((page) => ({
                text: section.dir === 'components' ? pascalCase(page.name) : page.name,
                link: pageLink(page),
            })),
    })).filter((group) => group.items.length > 0);
}

function isSameUnit(a: ReadmePage, b: ReadmePage): boolean {
    return a.section === b.section && a.name === b.name;
}

function inSourceLocale(target: ReadmePage, source: string, pages: ReadmePage[]): ReadmePage {
    const from = pages.find((page) => page.source === source);
    // README 맨 위의 언어 안내(./README.md, ./README.ko.md)는 같은 문서의 다른 언어로 가는 링크라 언어를 바꾸지 않는다.
    if (!from || from.locale === target.locale || isSameUnit(from, target)) {
        return target;
    }
    return pages.find((page) => page.locale === from.locale && isSameUnit(page, target)) ?? target;
}

export function resolveReadmeLink(
    href: string,
    source: string,
    pages: ReadmePage[],
    exists: (file: string) => boolean,
): string | undefined {
    if (!href || href.startsWith('#') || href.startsWith('/') || URL_SCHEME.test(href)) {
        return undefined;
    }

    const hashIndex = href.indexOf('#');
    const path = hashIndex === -1 ? href : href.slice(0, hashIndex);
    const hash = hashIndex === -1 ? '' : href.slice(hashIndex);
    const target = posix.normalize(posix.join(posix.dirname(source), path));

    const targetPage = pages.find((candidate) => candidate.source === target);
    if (targetPage) {
        return `/${inSourceLocale(targetPage, source, pages).route}${hash}`;
    }
    if (target.startsWith(DOCS_PAGES_DIR)) {
        return undefined;
    }
    if (exists(target)) {
        return `${REPOSITORY_BLOB_URL}/${posix.normalize(`packages/${target}`)}${hash}`;
    }
    return undefined;
}

export function readmeLinks(md: MarkdownRenderer, options: ReadmeLinksOptions): void {
    const { srcDir, pages, exists = (file: string) => existsSync(resolve(srcDir, file)) } = options;

    md.core.ruler.push('vlossom_readme_links', (state) => {
        // env.path는 rewrites가 적용된 경로다. README 기준 상대 링크는 원본 위치(env.realPath)로 풀어야 한다.
        const file: string | undefined = state.env?.realPath ?? state.env?.path;
        if (!file) {
            return;
        }
        const source = relative(srcDir, file).split(sep).join('/');

        for (const token of state.tokens) {
            for (const child of token.children ?? []) {
                if (child.type !== 'link_open') {
                    continue;
                }
                const href = child.attrGet('href');
                const resolved = href ? resolveReadmeLink(href, source, pages, exists) : undefined;
                if (resolved) {
                    child.attrSet('href', resolved);
                }
            }
        }
    });
}
