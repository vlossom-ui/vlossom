import { describe, it, expect, beforeEach } from 'vitest';
import { ref, type Ref, nextTick } from 'vue';
import type { Message, StateMessage, UIState } from '@/declaration';
import { useInputMessages } from './../input-messages-composable';

describe('useInputMessages', () => {
    let inputValue: Ref<string>;
    let messages: Ref<Message<string>[]>;
    let ruleMessages: Ref<StateMessage<Exclude<UIState, 'selected'>>[]>;

    beforeEach(() => {
        inputValue = ref('test');
        messages = ref([]);
        ruleMessages = ref([]);
    });

    it('message가 없을 때 computedMessages가 비어있어야 한다', async () => {
        // given
        messages.value = [];

        // when
        const { computedMessages, checkMessages } = useInputMessages(inputValue, messages, ruleMessages);
        await checkMessages();

        // then
        expect(computedMessages.value.length).toBe(0);
    });

    it('동기 message (객체)가 computedMessages에 포함되어야 한다', async () => {
        // given
        const staticMessage: StateMessage = { state: 'info', text: '정보 메시지' };
        messages.value = [staticMessage];

        // when
        const { computedMessages, checkMessages } = useInputMessages(inputValue, messages, ruleMessages);
        await checkMessages();

        // then
        expect(computedMessages.value.length).toBe(1);
        expect(computedMessages.value[0].state).toBe('info');
        expect(computedMessages.value[0].text).toBe('정보 메시지');
    });

    it('동기 message (함수)가 computedMessages에 포함되어야 한다', async () => {
        // given
        const messageFunc: Message<string> = (value) => ({
            state: 'success',
            text: `입력값: ${value}`,
        });
        messages.value = [messageFunc];

        // when
        const { computedMessages, checkMessages } = useInputMessages(inputValue, messages, ruleMessages);
        await checkMessages();

        // then
        expect(computedMessages.value.length).toBe(1);
        expect(computedMessages.value[0].state).toBe('success');
        expect(computedMessages.value[0].text).toBe('입력값: test');
    });

    it('비동기 message (함수)가 computedMessages에 포함되어야 한다', async () => {
        // given
        const asyncMessageFunc: Message<string> = async (value) => {
            await new Promise((resolve) => setTimeout(resolve, 10));
            return { state: 'warning', text: `비동기 메시지: ${value}` };
        };
        messages.value = [asyncMessageFunc];

        // when
        const { computedMessages, checkMessages } = useInputMessages(inputValue, messages, ruleMessages);
        await checkMessages();
        await new Promise((resolve) => setTimeout(resolve, 20));

        // then
        expect(computedMessages.value.length).toBe(1);
        expect(computedMessages.value[0].state).toBe('warning');
        expect(computedMessages.value[0].text).toBe('비동기 메시지: test');
    });

    it('동기와 비동기 message가 섞여있을 때 모두 처리되어야 한다', async () => {
        // given
        const staticMessage: StateMessage = { state: 'info', text: '정적 메시지' };
        const syncFunc: Message<string> = () => ({ state: 'success', text: '동기 함수 메시지' });
        const asyncFunc: Message<string> = async () => {
            await new Promise((resolve) => setTimeout(resolve, 10));
            return { state: 'warning', text: '비동기 함수 메시지' };
        };
        messages.value = [staticMessage, syncFunc, asyncFunc];

        // when
        const { computedMessages, checkMessages } = useInputMessages(inputValue, messages, ruleMessages);
        await checkMessages();
        await new Promise((resolve) => setTimeout(resolve, 20));

        // then
        expect(computedMessages.value.length).toBe(3);
        expect(computedMessages.value[0].text).toBe('정적 메시지');
        expect(computedMessages.value[1].text).toBe('동기 함수 메시지');
        expect(computedMessages.value[2].text).toBe('비동기 함수 메시지');
    });

    it('여러 비동기 message가 있을 때 모두 처리되어야 한다', async () => {
        // given
        const asyncFunc1: Message<string> = async () => {
            await new Promise((resolve) => setTimeout(resolve, 10));
            return { state: 'info', text: '비동기 1' };
        };
        const asyncFunc2: Message<string> = async () => {
            await new Promise((resolve) => setTimeout(resolve, 10));
            return { state: 'warning', text: '비동기 2' };
        };
        messages.value = [asyncFunc1, asyncFunc2];

        // when
        const { computedMessages, checkMessages } = useInputMessages(inputValue, messages, ruleMessages);
        await checkMessages();
        await new Promise((resolve) => setTimeout(resolve, 20));

        // then
        expect(computedMessages.value.length).toBe(2);
        expect(computedMessages.value[0].text).toBe('비동기 1');
        expect(computedMessages.value[1].text).toBe('비동기 2');
    });

    it('showRuleMessages가 false일 때 ruleMessages가 포함되지 않아야 한다', async () => {
        // given
        const staticMessage: StateMessage = { state: 'info', text: '일반 메시지' };
        messages.value = [staticMessage];
        ruleMessages.value = [{ state: 'error', text: 'rule 에러' }];

        // when
        const { showRuleMessages, computedMessages, checkMessages } = useInputMessages(
            inputValue,
            messages,
            ruleMessages,
        );
        await checkMessages();
        showRuleMessages.value = false;

        // then
        expect(computedMessages.value.length).toBe(1);
        expect(computedMessages.value[0].text).toBe('일반 메시지');
    });

    it('showRuleMessages가 true일 때 ruleMessages가 포함되어야 한다', async () => {
        // given
        const staticMessage: StateMessage = { state: 'info', text: '일반 메시지' };
        messages.value = [staticMessage];
        ruleMessages.value = [{ state: 'error', text: 'rule 에러' }];

        // when
        const { showRuleMessages, computedMessages, checkMessages } = useInputMessages(
            inputValue,
            messages,
            ruleMessages,
        );
        await checkMessages();
        showRuleMessages.value = true;

        // then
        expect(computedMessages.value.length).toBe(2);
        expect(computedMessages.value[0].text).toBe('일반 메시지');
        expect(computedMessages.value[1].text).toBe('rule 에러');
    });

    it('messages가 변경되면 checkMessages가 자동으로 호출되어야 한다', async () => {
        // given
        const { computedMessages } = useInputMessages(inputValue, messages, ruleMessages);
        await nextTick();

        // when
        const newMessage: StateMessage = { state: 'success', text: '새로운 메시지' };
        messages.value = [newMessage];
        await nextTick();

        // then
        expect(computedMessages.value.length).toBe(1);
        expect(computedMessages.value[0].text).toBe('새로운 메시지');
    });
});
