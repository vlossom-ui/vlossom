import { describe, it, expect } from 'vitest';
import type { FunctionDirective } from 'vue';
import { shake } from './../shake-directive';
import { SHAKE_CLASS } from './../constants';

const directive = shake as FunctionDirective<HTMLElement, boolean | undefined>;

function createBinding(value?: boolean, oldValue?: boolean) {
    return { value, oldValue, arg: undefined, modifiers: {}, instance: null, dir: directive } as any;
}

describe('v-shake', () => {
    it('value가 true가 되면 shake-horizontal 클래스가 추가되어야 한다', () => {
        const el = document.createElement('div');
        directive(el, createBinding(true, false), null as any, null as any);
        expect(el.classList.contains(SHAKE_CLASS)).toBe(true);
    });

    it('value가 false가 되면 shake-horizontal 클래스가 제거되어야 한다', () => {
        const el = document.createElement('div');
        el.classList.add(SHAKE_CLASS);
        directive(el, createBinding(false, true), null as any, null as any);
        expect(el.classList.contains(SHAKE_CLASS)).toBe(false);
    });

    it('value가 변경되지 않으면 shake가 재실행되지 않아야 한다', () => {
        const el = document.createElement('div');
        directive(el, createBinding(true, true), null as any, null as any);
        expect(el.classList.contains(SHAKE_CLASS)).toBe(false);
    });

    it('초기값이 true이면 shake-horizontal 클래스가 추가되어야 한다', () => {
        const el = document.createElement('div');
        directive(el, createBinding(true, undefined), null as any, null as any);
        expect(el.classList.contains(SHAKE_CLASS)).toBe(true);
    });

    it('초기값이 false이면 shake-horizontal 클래스가 추가되지 않아야 한다', () => {
        const el = document.createElement('div');
        directive(el, createBinding(false, undefined), null as any, null as any);
        expect(el.classList.contains(SHAKE_CLASS)).toBe(false);
    });

    it('애니메이션이 끝나면 shake-horizontal 클래스가 제거되어야 한다', () => {
        const el = document.createElement('div');
        directive(el, createBinding(true, undefined), null as any, null as any);
        el.dispatchEvent(new Event('animationend'));
        expect(el.classList.contains(SHAKE_CLASS)).toBe(false);
    });
});
