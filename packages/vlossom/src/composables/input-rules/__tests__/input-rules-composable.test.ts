import { describe, it, expect, beforeEach } from 'vitest';
import { ref, type Ref, nextTick } from 'vue';
import type { Rule } from '@/declaration';
import { useInputRules } from './../input-rules-composable';

describe('useInputRules', () => {
    let inputValue: Ref<string>;
    let rules: Ref<Rule<string>[]>;
    let defaultRules: Ref<Rule<string>[]>;
    let noDefaultRules: Ref<boolean>;

    beforeEach(() => {
        inputValue = ref('ab');
        rules = ref([]);
        defaultRules = ref([]);
        noDefaultRules = ref(false);
    });

    it('noDefaultRules가 false일 때 defaultRules와 rules가 합쳐져야 한다', async () => {
        // given
        const defaultRule: Rule<string> = (value) => (value.length < 3 ? 'default error' : '');
        const customRule: Rule<string> = (value) => (value.includes('@') ? '' : 'custom error');
        defaultRules.value = [defaultRule];
        rules.value = [customRule];

        // when
        const { ruleMessages, checkRules } = useInputRules(inputValue, rules, defaultRules, noDefaultRules);
        await checkRules();

        // then
        expect(ruleMessages.value.length).toBe(2);
        expect(ruleMessages.value[0].text).toBe('default error');
        expect(ruleMessages.value[1].text).toBe('custom error');
    });

    it('noDefaultRules가 true일 때 rules만 사용해야 한다', async () => {
        // given
        const defaultRule: Rule<string> = (value) => (value.length < 3 ? 'default error' : '');
        const customRule: Rule<string> = (value) => (value.includes('@') ? '' : 'custom error');
        defaultRules.value = [defaultRule];
        rules.value = [customRule];
        noDefaultRules.value = true;

        // when
        const { ruleMessages, checkRules } = useInputRules(inputValue, rules, defaultRules, noDefaultRules);
        await checkRules();

        // then
        expect(ruleMessages.value.length).toBe(1);
        expect(ruleMessages.value[0].text).toBe('custom error');
    });

    it('동기 규칙이 통과하면 ruleMessages가 비어있어야 한다', async () => {
        // given
        const passingRule: Rule<string> = (value) => (value.length >= 3 ? '' : 'error');
        rules.value = [passingRule];
        inputValue.value = 'hello';

        // when
        const { ruleMessages, checkRules } = useInputRules(inputValue, rules, defaultRules, noDefaultRules);
        await checkRules();

        // then
        expect(ruleMessages.value.length).toBe(0);
    });

    it('동기 규칙이 실패하면 에러 메시지가 추가되어야 한다', async () => {
        // given
        const failingRule: Rule<string> = (value) => (value.length >= 3 ? '' : '최소 3자 이상 입력해주세요');
        rules.value = [failingRule];

        // when
        const { ruleMessages, checkRules } = useInputRules(inputValue, rules, defaultRules, noDefaultRules);
        await checkRules();

        // then
        expect(ruleMessages.value.length).toBe(1);
        expect(ruleMessages.value[0].state).toBe('error');
        expect(ruleMessages.value[0].text).toBe('최소 3자 이상 입력해주세요');
    });

    it('비동기 규칙이 통과하면 ruleMessages가 비어있어야 한다', async () => {
        // given
        const asyncPassingRule: Rule<string> = async (value) => {
            await new Promise((resolve) => setTimeout(resolve, 10));
            return value.length >= 3 ? '' : 'error';
        };
        rules.value = [asyncPassingRule];
        inputValue.value = 'hello';

        // when
        const { ruleMessages, checkRules } = useInputRules(inputValue, rules, defaultRules, noDefaultRules);
        await checkRules();
        await new Promise((resolve) => setTimeout(resolve, 20));

        // then
        expect(ruleMessages.value.length).toBe(0);
    });

    it('비동기 규칙이 실패하면 에러 메시지가 추가되어야 한다', async () => {
        // given
        const asyncFailingRule: Rule<string> = async (value) => {
            await new Promise((resolve) => setTimeout(resolve, 10));
            return value.length >= 3 ? '' : '비동기 검증 실패';
        };
        rules.value = [asyncFailingRule];

        // when
        const { ruleMessages, checkRules } = useInputRules(inputValue, rules, defaultRules, noDefaultRules);
        await checkRules();
        await new Promise((resolve) => setTimeout(resolve, 20));

        // then
        expect(ruleMessages.value.length).toBe(1);
        expect(ruleMessages.value[0].state).toBe('error');
        expect(ruleMessages.value[0].text).toBe('비동기 검증 실패');
    });

    it('동기와 비동기 규칙이 섞여있을 때 모두 처리되어야 한다', async () => {
        // given
        const syncRule: Rule<string> = (value) => (value.length >= 3 ? '' : '동기 에러');
        const asyncRule: Rule<string> = async (value) => {
            await new Promise((resolve) => setTimeout(resolve, 10));
            return value.includes('@') ? '' : '비동기 에러';
        };
        rules.value = [syncRule, asyncRule];

        // when
        const { ruleMessages, checkRules } = useInputRules(inputValue, rules, defaultRules, noDefaultRules);
        await checkRules();
        await new Promise((resolve) => setTimeout(resolve, 20));

        // then
        expect(ruleMessages.value.length).toBe(2);
        expect(ruleMessages.value[0].text).toBe('동기 에러');
        expect(ruleMessages.value[1].text).toBe('비동기 에러');
    });

    it('여러 비동기 규칙이 있을 때 모두 처리되어야 한다', async () => {
        // given
        const asyncRule1: Rule<string> = async (value) => {
            await new Promise((resolve) => setTimeout(resolve, 10));
            return value.length >= 3 ? '' : '비동기 에러 1';
        };
        const asyncRule2: Rule<string> = async (value) => {
            await new Promise((resolve) => setTimeout(resolve, 10));
            return value.includes('@') ? '' : '비동기 에러 2';
        };
        rules.value = [asyncRule1, asyncRule2];

        // when
        const { ruleMessages, checkRules } = useInputRules(inputValue, rules, defaultRules, noDefaultRules);
        await checkRules();
        await new Promise((resolve) => setTimeout(resolve, 20));

        // then
        expect(ruleMessages.value.length).toBe(2);
        expect(ruleMessages.value[0].text).toBe('비동기 에러 1');
        expect(ruleMessages.value[1].text).toBe('비동기 에러 2');
    });

    it('rules가 변경되면 checkRules가 자동으로 호출되어야 한다', async () => {
        // given
        const { ruleMessages } = useInputRules(inputValue, rules, defaultRules, noDefaultRules);

        // when
        const newRule: Rule<string> = (value) => (value.length >= 5 ? '' : '5자 이상 필요');
        rules.value = [newRule];
        await nextTick();

        // then
        expect(ruleMessages.value.length).toBe(1);
        expect(ruleMessages.value[0].text).toBe('5자 이상 필요');
    });

    it('규칙이 빈 문자열을 반환하면 통과로 처리되어야 한다', async () => {
        // given
        const emptyStringRule: Rule<string> = () => '';
        rules.value = [emptyStringRule];

        // when
        const { ruleMessages, checkRules } = useInputRules(inputValue, rules, defaultRules, noDefaultRules);
        await checkRules();

        // then
        expect(ruleMessages.value.length).toBe(0);
    });

    it('비동기 규칙이 빈 문자열을 반환하면 통과로 처리되어야 한다', async () => {
        // given
        const asyncEmptyStringRule: Rule<string> = async () => {
            await new Promise((resolve) => setTimeout(resolve, 10));
            return '';
        };
        rules.value = [asyncEmptyStringRule];

        // when
        const { ruleMessages, checkRules } = useInputRules(inputValue, rules, defaultRules, noDefaultRules);
        await checkRules();
        await new Promise((resolve) => setTimeout(resolve, 20));

        // then
        expect(ruleMessages.value.length).toBe(0);
    });
});
