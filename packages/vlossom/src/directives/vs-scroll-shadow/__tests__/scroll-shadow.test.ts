import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { ObjectDirective } from 'vue';
import { scrollShadow } from '../scroll-shadow';

const SCROLL_SHADOW_CLASS = 'vs-scroll-shadow';
const SCROLL_STATE_VALUE = 'scroll-state';

const directive = scrollShadow as ObjectDirective<HTMLElement, boolean | undefined>;

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

function createScrollableElement(): HTMLElement {
    const el = document.createElement('div');
    Object.defineProperty(el, 'scrollHeight', { value: 500, configurable: true });
    Object.defineProperty(el, 'clientHeight', { value: 200, configurable: true });
    el.style.overflowY = 'scroll';
    return el;
}

function createNonScrollableElement(): HTMLElement {
    return document.createElement('div');
}

describe('v-scroll-shadow', () => {
    let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('mounted', () => {
        it('value가 없을 때 vs-scroll-shadow 클래스가 추가되어야 한다', () => {
            // given
            const el = createScrollableElement();

            // when
            directive.mounted!(el, createBinding(undefined), null as any, null as any);

            // then
            expect(el.classList.contains(SCROLL_SHADOW_CLASS)).toBe(true);
        });

        it('value가 true일 때 vs-scroll-shadow 클래스가 추가되어야 한다', () => {
            // given
            const el = createScrollableElement();

            // when
            directive.mounted!(el, createBinding(true), null as any, null as any);

            // then
            expect(el.classList.contains(SCROLL_SHADOW_CLASS)).toBe(true);
        });

        it('value가 false일 때 vs-scroll-shadow 클래스가 추가되지 않아야 한다', () => {
            // given
            const el = createScrollableElement();

            // when
            directive.mounted!(el, createBinding(false), null as any, null as any);

            // then
            expect(el.classList.contains(SCROLL_SHADOW_CLASS)).toBe(false);
        });

        it('스크롤이 불가능한 요소에 적용하면 경고가 출력되어야 한다', () => {
            // given
            const el = createNonScrollableElement();

            // when
            directive.mounted!(el, createBinding(undefined), null as any, null as any);

            // then
            expect(consoleWarnSpy).toHaveBeenCalled();
        });

        it('container-type에 scroll-state가 설정되어야 한다', () => {
            // given
            const el = createScrollableElement();

            // when
            directive.mounted!(el, createBinding(undefined), null as any, null as any);

            // then
            expect(el.style.containerType).toContain(SCROLL_STATE_VALUE);
        });

        it('기존 container-type이 있는 경우 scroll-state가 추가되어야 한다', () => {
            // given
            const el = createScrollableElement();
            vi.spyOn(window, 'getComputedStyle').mockReturnValue({
                overflowX: '',
                overflowY: 'scroll',
                getPropertyValue: (prop: string) => {
                    if (prop === 'container-type') {
                        return 'inline-size';
                    }
                    return '';
                },
            } as any);

            // when
            directive.mounted!(el, createBinding(undefined), null as any, null as any);

            // then
            expect(el.style.containerType).toContain('inline-size');
            expect(el.style.containerType).toContain(SCROLL_STATE_VALUE);
        });
    });

    describe('updated', () => {
        it('value가 true에서 false로 변경되면 vs-scroll-shadow 클래스가 제거되어야 한다', () => {
            // given
            const el = createScrollableElement();
            directive.mounted!(el, createBinding(true), null as any, null as any);
            expect(el.classList.contains(SCROLL_SHADOW_CLASS)).toBe(true);

            // when
            directive.updated!(el, createBinding(false, true), null as any, null as any);

            // then
            expect(el.classList.contains(SCROLL_SHADOW_CLASS)).toBe(false);
        });

        it('value가 false에서 true로 변경되면 vs-scroll-shadow 클래스가 추가되어야 한다', () => {
            // given
            const el = createScrollableElement();
            directive.mounted!(el, createBinding(false), null as any, null as any);
            expect(el.classList.contains(SCROLL_SHADOW_CLASS)).toBe(false);

            // when
            directive.updated!(el, createBinding(true, false), null as any, null as any);

            // then
            expect(el.classList.contains(SCROLL_SHADOW_CLASS)).toBe(true);
        });
    });

    describe('unmounted', () => {
        it('unmounted 시 vs-scroll-shadow 클래스가 제거되어야 한다', () => {
            // given
            const el = createScrollableElement();
            directive.mounted!(el, createBinding(undefined), null as any, null as any);
            expect(el.classList.contains(SCROLL_SHADOW_CLASS)).toBe(true);

            // when
            directive.unmounted!(el, null as any, null as any, null as any);

            // then
            expect(el.classList.contains(SCROLL_SHADOW_CLASS)).toBe(false);
        });

        it('unmounted 시 container-type이 복구되어야 한다', () => {
            // given
            const el = createScrollableElement();
            directive.mounted!(el, createBinding(undefined), null as any, null as any);
            expect(el.style.containerType).toContain(SCROLL_STATE_VALUE);

            // when
            directive.unmounted!(el, null as any, null as any, null as any);

            // then
            expect(el.style.containerType).not.toContain(SCROLL_STATE_VALUE);
        });

        it('원래 container-type이 있던 경우 복구되어야 한다', () => {
            // given
            const el = createScrollableElement();
            el.style.containerType = 'inline-size';
            vi.spyOn(window, 'getComputedStyle').mockReturnValue({
                overflowX: '',
                overflowY: 'scroll',
                getPropertyValue: (prop: string) => {
                    if (prop === 'container-type') {
                        return 'inline-size';
                    }
                    return '';
                },
            } as any);
            directive.mounted!(el, createBinding(undefined), null as any, null as any);
            vi.restoreAllMocks();

            // when
            directive.unmounted!(el, null as any, null as any, null as any);

            // then
            expect(el.style.containerType).toBe('inline-size');
        });

        it('value가 false였던 경우에도 unmounted 시 에러 없이 동작해야 한다', () => {
            // given
            const el = createScrollableElement();
            directive.mounted!(el, createBinding(false), null as any, null as any);

            // when & then
            expect(() => {
                directive.unmounted!(el, null as any, null as any, null as any);
            }).not.toThrow();
        });
    });
});
