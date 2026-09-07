import { describe, it, expect } from 'vitest';
import type { ObjectDirective } from 'vue';
import { shake } from './../shake-directive';
import { SHAKE_CLASS } from './../constants';

const directive = shake as ObjectDirective<HTMLElement, boolean | undefined>;

function createBinding(value?: boolean, oldValue?: boolean) {
    return {
        value,
        oldValue,
        arg: undefined,
        modifiers: {},
        instance: null,
        dir: directive,
    } as any;
}

describe('v-shake', () => {
    describe('mounted', () => {
        it('value가 true일 때 shake-horizontal 클래스가 추가되어야 한다', () => {
            const el = document.createElement('div');
            directive.mounted!(el, createBinding(true), null as any, null as any);
            expect(el.classList.contains(SHAKE_CLASS)).toBe(true);
        });

        it('value가 false일 때 shake-horizontal 클래스가 추가되지 않아야 한다', () => {
            const el = document.createElement('div');
            directive.mounted!(el, createBinding(false), null as any, null as any);
            expect(el.classList.contains(SHAKE_CLASS)).toBe(false);
        });

        it('value가 없을 때 shake-horizontal 클래스가 추가되지 않아야 한다', () => {
            const el = document.createElement('div');
            directive.mounted!(el, createBinding(undefined), null as any, null as any);
            expect(el.classList.contains(SHAKE_CLASS)).toBe(false);
        });
    });

    describe('updated', () => {
        it('value가 false에서 true로 변경되면 shake-horizontal 클래스가 추가되어야 한다', () => {
            const el = document.createElement('div');
            directive.updated!(el, createBinding(true, false), null as any, null as any);
            expect(el.classList.contains(SHAKE_CLASS)).toBe(true);
        });

        it('value가 true에서 false로 변경되면 shake-horizontal 클래스가 제거되어야 한다', () => {
            const el = document.createElement('div');
            el.classList.add(SHAKE_CLASS);
            directive.updated!(el, createBinding(false, true), null as any, null as any);
            expect(el.classList.contains(SHAKE_CLASS)).toBe(false);
        });

        it('value가 변경되지 않으면 shake가 재실행되지 않아야 한다', () => {
            const el = document.createElement('div');
            directive.updated!(el, createBinding(true, true), null as any, null as any);
            expect(el.classList.contains(SHAKE_CLASS)).toBe(false);
        });
    });

    describe('animationend', () => {
        it('애니메이션이 끝나면 shake-horizontal 클래스가 제거되어야 한다', () => {
            const el = document.createElement('div');
            directive.mounted!(el, createBinding(true), null as any, null as any);
            expect(el.classList.contains(SHAKE_CLASS)).toBe(true);

            el.dispatchEvent(new Event('animationend'));

            expect(el.classList.contains(SHAKE_CLASS)).toBe(false);
        });
    });
});
