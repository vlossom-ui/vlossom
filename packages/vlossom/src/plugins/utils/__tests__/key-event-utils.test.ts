import { describe, it, expect } from 'vitest';
import { keyEventUtils } from './../key-event-utils';

describe('keyEventUtils', () => {
    describe('isEnterOwnedByTarget', () => {
        function dispatchEnter(target: Element): KeyboardEvent {
            let received: KeyboardEvent | undefined;
            target.addEventListener('keydown', (e) => (received = e as KeyboardEvent));
            target.dispatchEvent(new KeyboardEvent('keydown', { code: 'Enter', bubbles: true }));
            return received!;
        }

        it('button, a[href], textarea와 그 자식에서 발생한 Enter는 true를 반환한다', () => {
            const button = document.createElement('button');
            const span = document.createElement('span');
            button.appendChild(span);
            const anchor = document.createElement('a');
            anchor.href = '#';

            expect(keyEventUtils.isEnterOwnedByTarget(dispatchEnter(button))).toBe(true);
            expect(keyEventUtils.isEnterOwnedByTarget(dispatchEnter(span))).toBe(true);
            expect(keyEventUtils.isEnterOwnedByTarget(dispatchEnter(anchor))).toBe(true);
            expect(keyEventUtils.isEnterOwnedByTarget(dispatchEnter(document.createElement('textarea')))).toBe(true);
        });

        it('input이나 일반 요소에서 발생한 Enter는 false를 반환한다', () => {
            expect(keyEventUtils.isEnterOwnedByTarget(dispatchEnter(document.createElement('input')))).toBe(false);
            expect(keyEventUtils.isEnterOwnedByTarget(dispatchEnter(document.createElement('div')))).toBe(false);
            expect(keyEventUtils.isEnterOwnedByTarget(dispatchEnter(document.createElement('a')))).toBe(false);
        });

        it('이벤트가 없으면 false를 반환한다', () => {
            expect(keyEventUtils.isEnterOwnedByTarget()).toBe(false);
        });
    });
});
