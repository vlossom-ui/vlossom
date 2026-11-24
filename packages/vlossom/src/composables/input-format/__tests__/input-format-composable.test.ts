import { afterEach, describe, expect, it, vi } from 'vitest';
import { nextTick, ref } from 'vue';
import { useInputFormat, type VsInputFormatOptions } from './../input-format-composable';

const PHONE = '999-9999-9999';

function setup(initial: string | null = '', format = PHONE, options: VsInputFormatOptions = {}, tag = 'input') {
    const value = ref<string | null>(initial);
    const formatRef = ref(format);
    const optionsRef = ref(options);
    const result = useInputFormat(value, formatRef, optionsRef);

    const el = document.createElement(tag) as HTMLInputElement | HTMLTextAreaElement;
    document.body.appendChild(el);
    Object.entries(result.formatListeners).forEach(([name, listener]) => {
        el.addEventListener(name, listener as EventListener);
    });
    el.value = result.displayValue.value;

    function beforeInput(inputType: string, data: string | null = null) {
        const event = new InputEvent('beforeinput', { inputType, data, cancelable: true, bubbles: true });
        el.dispatchEvent(event);
        return event;
    }

    return {
        el,
        value,
        beforeInput,
        formatRef,
        optionsRef,
        ...result,
        type(text: string) {
            [...text].forEach((char) => beforeInput('insertText', char));
        },
        paste(text: string) {
            beforeInput('insertFromPaste', text);
        },
        backspace: () => beforeInput('deleteContentBackward'),
        del: () => beforeInput('deleteContentForward'),
        select(start: number, end: number) {
            el.setSelectionRange(start, end);
        },
        caret: () => el.selectionStart,
    };
}

describe('useInputFormat', () => {
    afterEach(() => {
        document.body.innerHTML = '';
        vi.restoreAllMocks();
    });

    describe('입력', () => {
        it('입력하는 대로 구분 문자가 자동으로 삽입되어야 한다', () => {
            // given
            const { el, value, type, isComplete } = setup();

            // when
            type('01012345678');

            // then
            expect(el.value).toBe('010-1234-5678');
            expect(value.value).toBe('010-1234-5678');
            expect(isComplete.value).toBe(true);
        });

        it('형식에 맞지 않는 문자는 입력되지 않아야 한다', () => {
            // given
            const { el, value, type } = setup();

            // when
            type('a0b1');

            // then
            expect(value.value).toBe('01');
            expect(el.value).toBe('01_-____-____');
        });

        it('입력 후 커서는 다음 입력 자리로 이동해야 한다', () => {
            // given
            const { type, caret } = setup();

            // when, then
            type('01');
            expect(caret()).toBe(2);
            type('0');
            expect(caret()).toBe(4);
        });

        it('형식을 넘는 입력은 무시해야 한다', () => {
            // given
            const { value, type } = setup();

            // when
            type('0101234567899999');

            // then
            expect(value.value).toBe('010-1234-5678');
        });

        it('영문자와 숫자 토큰(a, *)을 구분해서 검사해야 한다', () => {
            // given
            const { value, type } = setup('', 'a*-999-a999');

            // when
            type('1A1-234-B567');

            // then
            expect(value.value).toBe('A1-234-B567');
        });

        it('중간에 입력하면 뒤의 문자가 밀려나야 한다', () => {
            // given
            const { value, type, select } = setup('010-1234-5678');
            select(1, 1);

            // when
            type('9');

            // then
            expect(value.value).toBe('091-0123-4567');
        });

        it('선택 영역을 덮어쓸 수 있어야 한다', () => {
            // given
            const { value, type, select } = setup('010-1234-5678');
            select(0, 3);

            // when
            type('9');

            // then
            expect(value.value).toBe('912-3456-78');
        });

        it('붙여넣으면 유효한 문자만 순서대로 채워져야 한다', () => {
            // given
            const { el, value, paste } = setup();

            // when
            paste('010 1234 5678');

            // then
            expect(value.value).toBe('010-1234-5678');
            expect(el.value).toBe('010-1234-5678');
        });

        it('textarea에서도 동작하고 줄바꿈은 입력되지 않아야 한다', () => {
            // given
            const { value, type, paste, beforeInput } = setup('', PHONE, {}, 'textarea');

            // when
            type('010');
            beforeInput('insertLineBreak');
            paste('1\n2');

            // then
            expect(value.value).toBe('010-12');
        });
    });

    describe('삭제', () => {
        it('Backspace는 입력한 문자를 지우고 구분 문자는 건너뛰어야 한다', () => {
            // given
            const { value, backspace, select, caret } = setup('010-1234-5678');
            select(4, 4);

            // when
            backspace();

            // then
            expect(value.value).toBe('011-2345-678');
            expect(caret()).toBe(2);
        });

        it('Delete는 커서 뒤의 문자를 지우고 뒤의 문자를 당겨야 한다', () => {
            // given
            const { value, del, select } = setup('010-1234-5678');
            select(0, 0);

            // when
            del();

            // then
            expect(value.value).toBe('101-2345-678');
        });

        it('선택 영역을 지우면 선택된 입력 문자만 지워져야 한다', () => {
            // given
            const { value, backspace, select } = setup('010-1234-5678');
            select(2, 6);

            // when
            backspace();

            // then
            expect(value.value).toBe('013-4567-8');
        });

        it('구분 문자만 선택해서 지우면 아무것도 지워지지 않아야 한다', () => {
            // given
            const { value, backspace, select } = setup('010-1234-5678');
            select(3, 4);

            // when
            backspace();

            // then
            expect(value.value).toBe('010-1234-5678');
        });
    });

    describe('포커스', () => {
        it('빈 값에 포커스하면 슬롯 템플릿이 보이고 커서가 첫 자리로 이동해야 한다', async () => {
            // given
            vi.useFakeTimers();
            const { el, caret } = setup();

            // when
            el.focus();
            vi.runAllTimers();
            vi.useRealTimers();

            // then
            expect(el.value).toBe('___-____-____');
            expect(caret()).toBe(0);
        });

        it('아무것도 입력하지 않고 포커스를 잃으면 빈 값으로 돌아가야 한다', () => {
            // given
            const { el, value } = setup();
            el.focus();

            // when
            el.blur();

            // then
            expect(el.value).toBe('');
            expect(value.value).toBe('');
        });

        it('입력 중에는 채워지지 않은 자리가 slotChar로 표시되고 모델에는 들어가지 않아야 한다', () => {
            // given
            const { el, value, rawValue, formattedValue, type } = setup();

            // when
            type('01012');

            // then
            expect(el.value).toBe('010-12__-____');
            expect(value.value).toBe('010-12');
            expect(formattedValue.value).toBe('010-12');
            expect(rawValue.value).toBe('01012');
        });

        it('미완성 상태로 포커스를 잃으면 autoClear가 true일 때 값을 비워야 한다', () => {
            // given
            const { el, value, type } = setup();
            el.focus();
            type('0101');

            // when
            el.blur();

            // then
            expect(value.value).toBe('');
            expect(el.value).toBe('');
        });

        it('미완성 상태로 포커스를 잃으면 autoClear가 false일 때 입력한 부분까지 남겨야 한다', () => {
            // given
            const { el, value, type } = setup('', PHONE, { autoClear: false });
            el.focus();
            type('0101');

            // when
            el.blur();

            // then
            expect(value.value).toBe('010-1');
            expect(el.value).toBe('010-1___-____');
        });
    });

    describe('옵션', () => {
        it('raw가 true이면 모델에 구분 문자를 제외한 값이 저장되어야 한다', () => {
            // given
            const { el, value, type } = setup('', PHONE, { raw: true });

            // when
            type('01012');

            // then
            expect(value.value).toBe('01012');
            expect(el.value).toBe('010-12__-____');
        });

        it('slotChar가 한 글자면 모든 자리에 반복해서 사용해야 한다', () => {
            // given
            const { el, type } = setup('', PHONE, { slotChar: '#' });

            // when
            type('0');

            // then
            expect(el.value).toBe('0##-####-####');
        });

        it('slotChar가 형식과 길이가 같으면 자리별로 사용해야 한다', () => {
            // given
            const { el, type } = setup('', '9999/99/99', { slotChar: 'yyyy/mm/dd' });

            // when
            type('20');

            // then
            expect(el.value).toBe('20yy/mm/dd');
        });
    });

    describe('선택 입력', () => {
        const EXTENSION = '(999) 999-9999? x99999';

        it('? 앞의 필수 자리만 채워도 완료 상태이고 선택 영역은 입력할 때까지 보이지 않아야 한다', () => {
            // given
            const { el, value, isComplete, type } = setup('', EXTENSION);

            // when
            type('5551234567');

            // then
            expect(isComplete.value).toBe(true);
            expect(value.value).toBe('(555) 123-4567');
            expect(el.value).toBe('(555) 123-4567');
        });

        it('선택 영역을 입력하면 구분 문자가 함께 나타나야 한다', () => {
            // given
            const { el, value, type, select } = setup('', EXTENSION);
            type('5551234567');
            select(14, 14);

            // when
            type('89');

            // then
            expect(value.value).toBe('(555) 123-4567 x89');
            expect(el.value).toBe('(555) 123-4567 x89');
        });

        it('필수 자리를 다 채우지 못하면 완료 상태가 아니어야 한다', () => {
            // given
            const { isComplete, type } = setup('', EXTENSION);

            // when
            type('555123');

            // then
            expect(isComplete.value).toBe(false);
        });
    });

    describe('외부 변경', () => {
        it('외부에서 모델 값을 바꾸면 형식에 맞게 정규화해야 한다', async () => {
            // given
            const { value, displayValue } = setup();

            // when
            value.value = '01012345678';
            await nextTick();

            // then
            expect(value.value).toBe('010-1234-5678');
            expect(displayValue.value).toBe('010-1234-5678');
        });

        it('초기 모델 값도 정규화해야 한다', () => {
            // given, when
            const { value, displayValue } = setup('01012345678');

            // then
            expect(value.value).toBe('010-1234-5678');
            expect(displayValue.value).toBe('010-1234-5678');
        });

        it('raw가 true이면 외부에서 넣은 포맷된 값도 구분 문자를 제외한 값으로 정규화해야 한다', async () => {
            // given
            const { value } = setup('', PHONE, { raw: true });

            // when
            value.value = '010-1234-5678';
            await nextTick();

            // then
            expect(value.value).toBe('01012345678');
        });

        it('null은 빈 값으로 취급하고 모델을 바꾸지 않아야 한다', async () => {
            // given
            const { value, displayValue } = setup(null);

            // when
            await nextTick();

            // then
            expect(value.value).toBeNull();
            expect(displayValue.value).toBe('');
        });

        it('format이 바뀌면 현재 입력된 문자를 새 형식으로 다시 맞춰야 한다', async () => {
            // given
            const { value, formatRef } = setup('010-1234-5678');

            // when
            formatRef.value = '9999/99/99';
            await nextTick();

            // then
            expect(value.value).toBe('0101/23/45');
        });

        it('raw 옵션이 바뀌면 모델 값을 새 형태로 바꿔야 한다', async () => {
            // given
            const { value, optionsRef } = setup('010-1234-5678');

            // when
            optionsRef.value = { raw: true };
            await nextTick();

            // then
            expect(value.value).toBe('01012345678');
        });
    });

    describe('format 없음', () => {
        it('format이 빈 문자열이면 입력을 그대로 모델에 반영해야 한다', () => {
            // given
            const { el, value, displayValue } = setup('abc', '');

            // when
            el.value = 'abcd';
            el.dispatchEvent(new Event('input'));

            // then
            expect(value.value).toBe('abcd');
            expect(displayValue.value).toBe('abcd');
        });

        it('format이 빈 문자열이면 beforeinput을 막지 않아야 한다', () => {
            // given
            const { beforeInput } = setup('', '');

            // when
            const event = beforeInput('insertText', 'a');

            // then
            expect(event.defaultPrevented).toBe(false);
        });
    });

    describe('input 이벤트', () => {
        it('beforeinput으로 막지 못한 입력은 input 이벤트에서 형식에 맞게 정리해야 한다', () => {
            // given
            const { el, value } = setup();

            // when
            el.value = '010 1234 56ab78';
            el.dispatchEvent(new Event('input'));

            // then
            expect(value.value).toBe('010-1234-5678');
            expect(el.value).toBe('010-1234-5678');
        });

        it('취소할 수 없는 beforeinput은 그대로 두어야 한다', () => {
            // given
            const { el } = setup();
            const event = new InputEvent('beforeinput', { inputType: 'insertCompositionText', data: 'ㅎ' });

            // when
            el.dispatchEvent(event);

            // then
            expect(event.defaultPrevented).toBe(false);
        });
    });

    describe('지원하지 않는 input type', () => {
        it('number type에서는 형식을 적용하지 않고 경고해야 한다', () => {
            // given
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
            const { el, value, beforeInput } = setup();
            el.setAttribute('type', 'number');

            // when
            const event = beforeInput('insertText', '1');

            // then
            expect(event.defaultPrevented).toBe(false);
            expect(value.value).toBe('');
            expect(warn).toHaveBeenCalled();
        });
    });
});
