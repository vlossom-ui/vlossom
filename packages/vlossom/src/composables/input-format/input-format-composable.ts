import { computed, ref, watch, type ComputedRef, type Ref } from 'vue';
import { logUtil } from '@/utils';

export interface VsInputFormatOptions {
    slotChar?: string;
    autoClear?: boolean;
    raw?: boolean;
}

export interface VsInputFormatListeners {
    beforeinput: (event: InputEvent) => void;
    input: (event: Event) => void;
    focus: (event: FocusEvent) => void;
    blur: (event: FocusEvent) => void;
}

// 슬롯 토큰이면 test가 있고, 구분 문자 토큰이면 char만 있다. index는 format 문자열에서의 위치
interface FormatToken {
    char: string;
    index: number;
    test?: RegExp;
}

const SLOT_TESTS: Record<string, RegExp> = {
    '9': /^[0-9]$/,
    a: /^[A-Za-z]$/,
    '*': /^[A-Za-z0-9]$/,
};
const OPTIONAL_MARK = '?';
const SUPPORTED_INPUT_TYPES = ['text', 'tel', 'search', 'url', 'password'];

function isFormattable(el: HTMLInputElement | HTMLTextAreaElement) {
    return el instanceof HTMLTextAreaElement || SUPPORTED_INPUT_TYPES.includes(el.type);
}

export function useInputFormat(
    value: Ref<string | null | undefined>,
    format: Ref<string>,
    formatOptions?: Ref<VsInputFormatOptions>,
) {
    // 사용자가 입력한 문자만 순서대로 담는다. 화면 값과 모델 값은 모두 이 값에서 만든다
    const chars = ref('');
    const focused = ref(false);
    let warned = false;

    const options = computed(() => ({ slotChar: '_', autoClear: true, raw: false, ...formatOptions?.value }));

    // optionalStart: 이 위치부터는 선택 입력 영역
    const parsed = computed(() => {
        const tokens: FormatToken[] = [];
        let optionalStart = -1;
        [...format.value].forEach((char, index) => {
            if (char === OPTIONAL_MARK) {
                optionalStart = optionalStart < 0 ? tokens.length : optionalStart;
            } else {
                tokens.push({ char, index, test: SLOT_TESTS[char] });
            }
        });
        return { tokens, optionalStart: optionalStart < 0 ? tokens.length : optionalStart };
    });
    const tokens = computed(() => parsed.value.tokens);
    const hasFormat = computed(() => tokens.value.length > 0);

    // slotPositions[k] = k번째 슬롯의 토큰 위치
    const slotPositions = computed(() => tokens.value.flatMap((token, position) => (token.test ? [position] : [])));
    const requiredCount = computed(() => slotPositions.value.filter((p) => p < parsed.value.optionalStart).length);

    // 형식에 맞지 않는 문자는 버리고, 맞는 문자만 슬롯에 순서대로 채운다
    function fit(text: string) {
        const slots = slotPositions.value.map((p) => tokens.value[p].test!);
        let result = '';
        for (const char of text) {
            if (result.length < slots.length && slots[result.length].test(char)) {
                result += char;
            }
        }
        return result;
    }

    function slotCharOf(token: FormatToken) {
        const { slotChar } = options.value;
        return (slotChar.length === format.value.length ? slotChar[token.index] : slotChar[0]) || '_';
    }

    function render(end: number, empty: (token: FormatToken) => string) {
        let filled = 0;
        return tokens.value
            .slice(0, end)
            .map((token) => (token.test ? (chars.value[filled++] ?? empty(token)) : token.char))
            .join('');
    }

    const formattedValue = computed(() => {
        if (!hasFormat.value || !chars.value) {
            return '';
        }
        return render(slotPositions.value[chars.value.length - 1] + 1, () => '');
    });
    const rawValue = computed(() => chars.value);
    const isComplete = computed(() => chars.value.length >= requiredCount.value);

    const displayValue = computed(() => {
        if (!hasFormat.value) {
            return value.value ?? '';
        }
        if (!chars.value && !focused.value) {
            return '';
        }
        // 선택 입력 영역은 입력이 시작된 만큼만 보여준다
        const lastFilled = chars.value ? slotPositions.value[chars.value.length - 1] + 1 : 0;
        return render(Math.max(parsed.value.optionalStart, lastFilled), slotCharOf);
    });

    const modelText = computed(() => (options.value.raw ? rawValue.value : formattedValue.value));

    function commit(next: string) {
        chars.value = next;
        if ((value.value ?? '') !== modelText.value) {
            value.value = modelText.value;
        }
    }

    // 화면 위치 → 그 앞에 있는 입력 문자 수
    function charIndexAt(position: number) {
        return Math.min(slotPositions.value.filter((p) => p < position).length, chars.value.length);
    }

    // 입력 문자 수 → 다음에 입력될 자리의 화면 위치
    function positionAt(count: number) {
        return Math.min(slotPositions.value[count] ?? Infinity, displayValue.value.length);
    }

    function paint(el: HTMLInputElement | HTMLTextAreaElement, count: number) {
        el.value = displayValue.value;
        el.setSelectionRange(positionAt(count), positionAt(count));
    }

    function usable(el: HTMLInputElement | HTMLTextAreaElement) {
        if (!hasFormat.value) {
            return false;
        }
        if (!isFormattable(el)) {
            if (!warned) {
                warned = true;
                logUtil.warning('useInputFormat', `<input type="${el.type}"> does not support format. Ignored.`);
            }
            return false;
        }
        return true;
    }

    function onBeforeInput(event: InputEvent) {
        const el = event.target as HTMLInputElement | HTMLTextAreaElement;
        // 취소할 수 없는 입력(IME 조합 등)은 input 이벤트에서 정리한다
        if (!event.cancelable || !usable(el)) {
            return;
        }
        event.preventDefault();

        const { inputType } = event;
        const collapsed = el.selectionStart === el.selectionEnd;
        let from = charIndexAt(el.selectionStart ?? 0);
        const to = charIndexAt(el.selectionEnd ?? 0);
        let inserted = '';
        if (inputType.startsWith('insert')) {
            inserted = event.data ?? event.dataTransfer?.getData('text/plain') ?? '';
        } else if (inputType.startsWith('delete') && collapsed) {
            // 선택 영역이 없으면 커서 앞(Backspace) 또는 뒤(Delete)의 문자 하나를 지운다
            const backward = inputType.endsWith('Backward');
            from = backward ? Math.max(from - 1, 0) : from;
            commitRange(el, from, backward ? to : to + 1, '');
            return;
        } else if (!inputType.startsWith('delete')) {
            return; // undo/redo, 서식 입력 등은 지원하지 않는다
        }
        commitRange(el, from, to, inserted);
    }

    function commitRange(el: HTMLInputElement | HTMLTextAreaElement, from: number, to: number, inserted: string) {
        const head = fit(chars.value.slice(0, from) + inserted);
        commit(fit(head + chars.value.slice(to)));
        paint(el, head.length);
    }

    function onInput(event: Event) {
        const el = event.target as HTMLInputElement | HTMLTextAreaElement;
        if (!hasFormat.value) {
            value.value = el.value;
            return;
        }
        if (!usable(el)) {
            return;
        }
        // beforeinput에서 막지 못한 입력(IME 조합, 자동완성 등)을 현재 값 기준으로 다시 맞춘다
        // ponytail: slotChar가 형식 토큰과 같은 종류의 문자(예: 'a' 형식에 'x')면 입력으로 오인한다
        commit(fit(el.value));
        paint(el, chars.value.length);
    }

    function onFocus(event: FocusEvent) {
        const el = event.target as HTMLInputElement | HTMLTextAreaElement;
        if (!usable(el)) {
            return;
        }
        focused.value = true;
        el.value = displayValue.value;
        // 포커스를 만든 클릭이 커서를 옮긴 뒤에 다음 입력 자리로 이동시킨다
        setTimeout(() => {
            if (focused.value) {
                paint(el, chars.value.length);
            }
        });
    }

    function onBlur(event: FocusEvent) {
        const el = event.target as HTMLInputElement | HTMLTextAreaElement;
        if (!usable(el)) {
            return;
        }
        focused.value = false;
        if (options.value.autoClear && !isComplete.value) {
            commit('');
        }
        el.value = displayValue.value;
    }

    // 외부에서 모델 값이 바뀌었거나 형식 설정이 바뀌면 입력 문자를 다시 맞춘다
    watch(
        value,
        (next) => {
            if (hasFormat.value && (next ?? '') !== modelText.value) {
                commit(fit(next ?? ''));
            }
        },
        { immediate: true },
    );
    watch(
        [format, formatOptions ?? ref({})],
        (_, [oldFormat]) => {
            commit(fit(oldFormat ? chars.value : (value.value ?? '')));
        },
        { deep: true },
    );

    const formatListeners: VsInputFormatListeners = {
        beforeinput: onBeforeInput,
        input: onInput,
        focus: onFocus,
        blur: onBlur,
    };

    return {
        displayValue: displayValue as ComputedRef<string>,
        formattedValue,
        rawValue,
        isComplete,
        formatListeners,
    };
}
