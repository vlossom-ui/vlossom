import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { babelParse } from 'vue/compiler-sfc';

const LAYER_NAMES = /@layer\s+([\w-]+(?:\s*,\s*[\w-]+)*)\s*[;{]/g;
// 컴포넌트와 유틸리티 스타일은 VitePress의 preflight 리셋에 지지 않도록 그보다 위에 남긴다.
const ABOVE_SITE_BASE = new Set(['components', 'utilities']);

function layerNames(css: string): string[] {
    const names = [...css.matchAll(LAYER_NAMES)].flatMap((match) => match[1].split(',').map((name) => name.trim()));
    return [...new Set(names)];
}

function importSources(file: string): string[] {
    const { program } = babelParse(readFileSync(file, 'utf8'), { sourceType: 'module', plugins: ['typescript'] });
    return program.body.flatMap((node) => (node.type === 'ImportDeclaration' ? [node.source.value] : []));
}

describe('layers.css', () => {
    it('vlossom.css의 레이어 중 컴포넌트·유틸리티를 뺀 나머지를 같은 순서로 먼저 선언한다', () => {
        const vlossomCss = readFileSync(createRequire(import.meta.url).resolve('vlossom/styles'), 'utf8');
        const layersCss = readFileSync(resolve(import.meta.dirname, 'layers.css'), 'utf8');

        expect(layerNames(layersCss)).toEqual(layerNames(vlossomCss).filter((name) => !ABOVE_SITE_BASE.has(name)));
    });

    it('테마 진입점이 VitePress 테마보다 먼저 불러온다', () => {
        const sources = importSources(resolve(import.meta.dirname, 'index.ts'));

        expect(sources.indexOf('./layers.css')).toBeGreaterThanOrEqual(0);
        expect(sources.indexOf('./layers.css')).toBeLessThan(sources.indexOf('vitepress/theme'));
    });
});
