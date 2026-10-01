import { existsSync, readdirSync } from 'node:fs';
import { posix, relative, resolve, sep } from 'node:path';
import type { DefaultTheme, MarkdownRenderer } from 'vitepress';

export interface ReadmePage {
    source: string;
    route: string;
    section: string;
    name: string;
}

export interface ReadmeLinksOptions {
    srcDir: string;
    pages: ReadmePage[];
    exists?: (file: string) => boolean;
}

const SECTIONS = [
    { dir: 'components', text: 'Components' },
    { dir: 'composables', text: 'Composables' },
    { dir: 'directives', text: 'Directives' },
    { dir: 'plugins', text: 'Plugins' },
    { dir: 'utils', text: 'Utils' },
] as const;

const UTILS_SECTION = 'utils';
const UNIT_SECTIONS = SECTIONS.map((section) => section.dir).filter((dir) => dir !== UTILS_SECTION);
const UNIT_README = new RegExp(`^vlossom/src/(${UNIT_SECTIONS.join('|')})/([^/]+)/README\\.md$`);
const UTILS_README = `vlossom/src/${UTILS_SECTION}/README.md`;
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

function toPage(source: string): ReadmePage | undefined {
    if (source === UTILS_README) {
        return { source, route: `${UTILS_SECTION}.md`, section: UTILS_SECTION, name: UTILS_SECTION };
    }
    const match = UNIT_README.exec(source);
    if (!match) {
        return undefined;
    }
    const [, section, name] = match;
    return { source, route: `${section}/${name}.md`, section, name };
}

function sectionIndex(page: ReadmePage): number {
    return SECTIONS.findIndex((section) => section.dir === page.section);
}

function comparePages(a: ReadmePage, b: ReadmePage): number {
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

export function toSidebar(pages: ReadmePage[]): DefaultTheme.SidebarItem[] {
    return SECTIONS.map((section) => ({
        text: section.text,
        collapsed: section.dir !== 'components',
        items: pages
            .filter((page) => page.section === section.dir)
            .map((page) => ({
                text: section.dir === 'components' ? pascalCase(page.name) : page.name,
                link: pageLink(page),
            })),
    })).filter((group) => group.items.length > 0);
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

    const page = pages.find((candidate) => candidate.source === target);
    if (page) {
        return `/${page.route}${hash}`;
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
