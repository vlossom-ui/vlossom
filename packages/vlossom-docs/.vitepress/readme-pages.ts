import { existsSync, readdirSync, readFileSync } from 'node:fs';
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
    readFile?: (file: string) => string;
}

export type HasAnchor = (file: string, id: string) => boolean;

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

function docsPageLocale(source: string): ReadmeLocale {
    const prefixed = LOCALES.find(
        (locale) => LOCALE_ROUTE_PREFIX[locale] && source.startsWith(`${DOCS_PAGES_DIR}${LOCALE_ROUTE_PREFIX[locale]}`),
    );
    return prefixed ?? 'root';
}

function inSourceLocale(
    target: ReadmePage,
    source: string,
    pages: ReadmePage[],
    anchor: string,
    hasAnchor: HasAnchor,
): ReadmePage {
    const fromPage = pages.find((page) => page.source === source);
    const fromLocale = fromPage?.locale ?? (source.startsWith(DOCS_PAGES_DIR) ? docsPageLocale(source) : undefined);
    // README 맨 위의 언어 안내(./README.md, ./README.ko.md)는 같은 문서의 다른 언어로 가는 링크라 언어를 바꾸지 않는다.
    if (!fromLocale || fromLocale === target.locale || (fromPage && isSameUnit(fromPage, target))) {
        return target;
    }
    const counterpart = pages.find((page) => page.locale === fromLocale && isSameUnit(page, target));
    // 앵커 id는 언어마다 제목에서 만들어진다(예: "## 타입" → #타입). 대응 페이지에 같은 앵커가 없으면 원래 대상으로 둔다.
    if (!counterpart || (anchor && !hasAnchor(counterpart.source, anchor))) {
        return target;
    }
    return counterpart;
}

function decodeAnchor(hash: string): string {
    try {
        return decodeURIComponent(hash.slice(1));
    } catch {
        return hash.slice(1);
    }
}

export function resolveReadmeLink(
    href: string,
    source: string,
    pages: ReadmePage[],
    exists: (file: string) => boolean,
    hasAnchor: HasAnchor = () => true,
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
        const anchor = hash ? decodeAnchor(hash) : '';
        return `/${inSourceLocale(targetPage, source, pages, anchor, hasAnchor).route}${hash}`;
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
    const {
        srcDir,
        pages,
        exists = (file: string) => existsSync(resolve(srcDir, file)),
        readFile = (file: string) => readFileSync(resolve(srcDir, file), 'utf8'),
    } = options;
    // 제목 id는 VitePress 렌더러가 만든 것과 같아야 하므로, 같은 렌더러로 대상 README를 파싱해 확인한다.
    const hasAnchor: HasAnchor = (file, id) =>
        md.parse(readFile(file), {}).some((token) => token.type === 'heading_open' && token.attrGet('id') === id);

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
                const resolved = href ? resolveReadmeLink(href, source, pages, exists, hasAnchor) : undefined;
                if (resolved) {
                    child.attrSet('href', resolved);
                }
            }
        }
    });
}
