import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import postcss from 'postcss';
import { describe, expect, it } from 'vitest';

function families(value: string): string[] {
    return postcss.list.comma(value).map((family) => family.replace(/['"]/g, '').trim());
}

describe('font.css', () => {
    it('사이트 글꼴 변수가 vlossom 앱의 html·body 글꼴과 같다', () => {
        const vlossomCss = postcss.parse(
            readFileSync(createRequire(import.meta.url).resolve('vlossom/styles'), 'utf8'),
        );
        const fontCss = postcss.parse(readFileSync(resolve(import.meta.dirname, 'font.css'), 'utf8'));
        const appFonts: string[] = [];
        const siteFonts: string[] = [];

        vlossomCss.each((node) => {
            if (node.type === 'rule' && node.selectors.includes('body')) {
                node.walkDecls('font-family', (declaration) => {
                    appFonts.push(declaration.value);
                });
            }
        });
        fontCss.walkDecls('--vp-font-family-base', (declaration) => {
            siteFonts.push(declaration.value);
        });

        expect(appFonts).toHaveLength(1);
        expect(siteFonts.map(families)).toEqual([families(appFonts[0])]);
    });
});
