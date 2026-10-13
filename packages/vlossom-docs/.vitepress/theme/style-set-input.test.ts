import { describe, expect, it } from 'vitest';
import { parseStyleSet } from './style-set-input.ts';

const COMPONENTS = ['VsButton', 'VsInput'];

describe('parseStyleSet', () => {
    it('README 예제의 객체 문법(따옴표 없는 키, 작은따옴표, 끝 쉼표)을 읽는다', () => {
        const source = "{ VsButton: { backgroundColor: '#e11d48', $content: { padding: '0 2rem' }, }, }";

        expect(parseStyleSet(source, COMPONENTS)).toEqual({
            ok: true,
            value: { VsButton: { backgroundColor: '#e11d48', $content: { padding: '0 2rem' } } },
        });
    });

    it('빈 입력은 style-set을 지우는 값으로 읽는다', () => {
        expect(parseStyleSet('  \n', COMPONENTS)).toEqual({ ok: true, value: undefined });
    });

    it('객체 문법이 아니면 syntax 오류를 돌려준다', () => {
        const result = parseStyleSet('{ VsButton: { color: }', COMPONENTS);

        expect(result).toMatchObject({ ok: false, error: 'syntax' });
    });

    it.each([['[]'], ["'red'"], ['42'], ['null']])(
        '최상위가 객체가 아니면(%s) not-object 오류를 돌려준다',
        (source) => {
            expect(parseStyleSet(source, COMPONENTS)).toEqual({ ok: false, error: 'not-object', detail: '' });
        },
    );

    it('style-set을 받지 않거나 없는 컴포넌트 이름은 unknown-component 오류로 알려 준다', () => {
        expect(parseStyleSet('{ VsButton: {}, VsFoo: {}, button: {} }', COMPONENTS)).toEqual({
            ok: false,
            error: 'unknown-component',
            detail: 'VsFoo, button',
        });
    });

    it('컴포넌트의 값이 객체가 아니면 not-style-object 오류로 알려 준다', () => {
        expect(parseStyleSet("{ VsButton: 'red', VsInput: [] }", COMPONENTS)).toEqual({
            ok: false,
            error: 'not-style-object',
            detail: 'VsButton, VsInput',
        });
    });

    it('코드를 실행하지 않는다', () => {
        const result = parseStyleSet('{ VsButton: { color: (() => "red")() } }', COMPONENTS);

        expect(result).toMatchObject({ ok: false, error: 'syntax' });
    });
});
