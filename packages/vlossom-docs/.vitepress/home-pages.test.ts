import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { listMarkdownFiles, pageLink, selectReadmePages, type ReadmeLocale } from './readme-pages.ts';

const PACKAGES_DIR = resolve(import.meta.dirname, '../..');
const HOME_PAGES: [ReadmeLocale, string][] = [
    ['root', 'vlossom-docs/pages/index.md'],
    ['ko', 'vlossom-docs/pages/ko/index.md'],
];
const readmePages = selectReadmePages(listMarkdownFiles(PACKAGES_DIR));

function heroLinks(file: string): string[] {
    const source = readFileSync(resolve(PACKAGES_DIR, file), 'utf8');
    return [...source.matchAll(/^\s+link:\s*(\S+)\s*$/gm)].map((match) => match[1]);
}

describe('홈 페이지', () => {
    it.each(HOME_PAGES)('%s 홈은 내비와 같은 첫 컴포넌트 페이지로 가는 버튼이 있다', (locale, file) => {
        const first = readmePages.find((page) => page.locale === locale && page.section === 'components');

        expect(first).toBeDefined();
        expect(heroLinks(file)).toContain(pageLink(first!));
    });
});
