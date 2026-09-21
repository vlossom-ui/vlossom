import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import VsSearchInput from './../VsSearchInput.vue';

describe('VsSearchInput', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    describe('v-model:modelValue', () => {
        it('입력 시 update:modelValue 이벤트가 emit되어야 한다', async () => {
            // given
            const wrapper = mount(VsSearchInput);
            await nextTick(); // 컴포넌트 초기화 대기

            // when
            const vsInput = wrapper.findComponent({ name: 'VsInput' });
            await vsInput.vm.$emit('change', 'test');

            // then
            expect(wrapper.emitted('update:modelValue')).toBeFalsy();

            // 400ms 후
            vi.advanceTimersByTime(400);
            await nextTick();

            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['test']);
        });

        it('modelValue prop이 변경되면 내부 searchText가 업데이트되어야 한다', async () => {
            // given
            const wrapper = mount(VsSearchInput, {
                props: {
                    modelValue: 'initial',
                },
            });

            // then
            expect(wrapper.vm.searchText).toBe('initial');

            // when
            await wrapper.setProps({ modelValue: 'updated' });
            await nextTick();

            // then
            expect(wrapper.vm.searchText).toBe('updated');
        });
    });

    describe('v-model:caseSensitive', () => {
        it('caseSensitive 토글 클릭 시 update:caseSensitive 이벤트가 emit되어야 한다', async () => {
            // given
            const wrapper = mount(VsSearchInput, {
                props: {
                    useCaseSensitive: true,
                    caseSensitive: false,
                },
            });

            // when
            const toggle = wrapper.find('.vs-search-input-toggle');
            await toggle.trigger('click');
            await nextTick();

            // then
            expect(wrapper.emitted('update:caseSensitive')).toBeTruthy();
            expect(wrapper.emitted('update:caseSensitive')?.[0]).toEqual([true]);
        });

        it('caseSensitive prop이 변경되면 내부 isCaseSensitiveOn이 업데이트되어야 한다', async () => {
            // given
            const wrapper = mount(VsSearchInput, {
                props: {
                    useCaseSensitive: true,
                    caseSensitive: false,
                },
            });

            // then
            expect(wrapper.vm.isCaseSensitiveOn).toBe(false);

            // when
            await wrapper.setProps({ caseSensitive: true });
            await nextTick();

            // then
            expect(wrapper.vm.isCaseSensitiveOn).toBe(true);
        });
    });

    describe('v-model:regex', () => {
        it('regex 토글 클릭 시 update:regex 이벤트가 emit되어야 한다', async () => {
            // given
            const wrapper = mount(VsSearchInput, {
                props: {
                    useRegex: true,
                    regex: false,
                },
            });

            // when
            const toggle = wrapper.find('.vs-search-input-toggle');
            await toggle.trigger('click');
            await nextTick();

            // then
            expect(wrapper.emitted('update:regex')).toBeTruthy();
            expect(wrapper.emitted('update:regex')?.[0]).toEqual([true]);
        });

        it('regex prop이 변경되면 내부 isRegexOn이 업데이트되어야 한다', async () => {
            // given
            const wrapper = mount(VsSearchInput, {
                props: {
                    useRegex: true,
                    regex: false,
                },
            });

            // then
            expect(wrapper.vm.isRegexOn).toBe(false);

            // when
            await wrapper.setProps({ regex: true });
            await nextTick();

            // then
            expect(wrapper.vm.isRegexOn).toBe(true);
        });
    });

    describe('search 이벤트', () => {
        it('입력 시 debounce를 적용하여 400ms 후 search 이벤트가 emit되어야 한다', async () => {
            // given
            const wrapper = mount(VsSearchInput);
            await nextTick(); // 컴포넌트 초기화 대기

            // when
            const vsInput = wrapper.findComponent({ name: 'VsInput' });
            await vsInput.vm.$emit('change', 'test');

            // then
            expect(wrapper.emitted('search')).toBeFalsy();

            // 400ms 후
            vi.advanceTimersByTime(400);
            await nextTick();

            expect(wrapper.emitted('search')).toBeTruthy();
            expect(wrapper.emitted('search')?.[0]).toEqual(['test']);
        });

        it('입력이 빠르게 변경되면 마지막 값만 emit되어야 한다', async () => {
            // given
            const wrapper = mount(VsSearchInput);
            await nextTick(); // 컴포넌트 초기화 대기

            // when
            const vsInput = wrapper.findComponent({ name: 'VsInput' });
            await vsInput.vm.$emit('change', 't');
            vi.advanceTimersByTime(100);
            await vsInput.vm.$emit('change', 'te');
            vi.advanceTimersByTime(100);
            await vsInput.vm.$emit('change', 'tes');
            vi.advanceTimersByTime(100);
            await vsInput.vm.$emit('change', 'test');

            // then
            expect(wrapper.emitted('search')).toBeFalsy();

            // 400ms 후
            vi.advanceTimersByTime(400);
            await nextTick();

            expect(wrapper.emitted('search')).toBeTruthy();
            expect(wrapper.emitted('search')?.length).toBe(1);
            expect(wrapper.emitted('search')?.[0]).toEqual(['test']);
        });
    });

    describe('toggle 버튼', () => {
        it('caseSensitive와 regex가 모두 true일 때 두 토글 버튼이 모두 표시되어야 한다', () => {
            // given
            const wrapper = mount(VsSearchInput, {
                props: {
                    useCaseSensitive: true,
                    useRegex: true,
                },
            });

            // then
            const toggles = wrapper.findAll('.vs-search-input-toggle');
            expect(toggles.length).toBe(2);
        });

        it('caseSensitive 토글을 클릭하면 caseSensitive 상태가 변경되어야 한다', async () => {
            // given
            const wrapper = mount(VsSearchInput, {
                props: {
                    useCaseSensitive: true,
                },
            });

            // when
            const toggle = wrapper.find('.vs-search-input-toggle');
            expect(wrapper.vm.isCaseSensitiveOn).toBe(false);

            await toggle.trigger('click');
            await nextTick();

            // then
            expect(wrapper.vm.isCaseSensitiveOn).toBe(true);
        });

        it('regex 토글을 클릭하면 regex 상태가 변경되어야 한다', async () => {
            // given
            const wrapper = mount(VsSearchInput, {
                props: {
                    useRegex: true,
                },
            });

            // when
            const toggle = wrapper.find('.vs-search-input-toggle');
            expect(wrapper.vm.isRegexOn).toBe(false);

            await toggle.trigger('click');
            await nextTick();

            // then
            expect(wrapper.vm.isRegexOn).toBe(true);
        });
    });

    describe('placeholder', () => {
        function findPlaceholder(props: Record<string, unknown> = {}) {
            return mount(VsSearchInput, { props }).findComponent({ name: 'VsInput' }).props('placeholder');
        }

        it('지정하지 않으면 기본 messages를 사용한다', () => {
            expect(findPlaceholder()).toBe('Search');
        });

        it('빈 문자열을 지정하면 빈 문자열을 그대로 사용한다', () => {
            expect(findPlaceholder({ placeholder: '' })).toBe('');
        });
    });

    describe('state', () => {
        it('state prop이 내부 input에 전달되어야 한다', () => {
            // given
            const wrapper = mount(VsSearchInput, {
                props: {
                    state: 'error',
                },
            });

            // then
            expect(wrapper.find('.vs-input').classes()).toEqual(
                expect.arrayContaining(['vs-state-box', 'vs-stated', 'vs-state-error']),
            );
        });

        it('state 기본값은 idle이어서 state class가 붙지 않아야 한다', () => {
            // given
            const wrapper = mount(VsSearchInput);

            // then
            expect(wrapper.find('.vs-input').classes()).not.toContain('vs-stated');
        });
    });

    describe('match 메서드', () => {
        it('검색어가 없으면 항상 true를 반환해야 한다', () => {
            // given
            const wrapper = mount(VsSearchInput);

            // when
            const result = wrapper.vm.match('test text');

            // then
            expect(result).toBe(true);
        });

        it('기본적으로 대소문자를 구분하지 않고 검색해야 한다', async () => {
            // given
            const wrapper = mount(VsSearchInput);
            await nextTick(); // isInitialized 설정 대기
            const input = wrapper.find('input');
            await input.setValue('TEST');
            vi.advanceTimersByTime(400);
            await nextTick();

            // when
            const result1 = wrapper.vm.match('test text');
            const result2 = wrapper.vm.match('TEST TEXT');
            const result3 = wrapper.vm.match('other text');

            // then
            expect(result1).toBe(true);
            expect(result2).toBe(true);
            expect(result3).toBe(false);
        });

        it('caseSensitive 토글이 활성화되면 대소문자를 구분해야 한다', async () => {
            // given
            const wrapper = mount(VsSearchInput, {
                props: {
                    useCaseSensitive: true,
                },
            });
            await nextTick(); // isInitialized 설정 대기
            const input = wrapper.find('input');
            await input.setValue('TEST');
            wrapper.vm.isCaseSensitiveOn = true;
            vi.advanceTimersByTime(400);
            await nextTick();

            // when
            const result1 = wrapper.vm.match('test text');
            const result2 = wrapper.vm.match('TEST TEXT');
            const result3 = wrapper.vm.match('Test Text');

            // then
            expect(result1).toBe(false);
            expect(result2).toBe(true);
            expect(result3).toBe(false);
        });

        it('regex 토글이 활성화되면 정규식으로 검색해야 한다', async () => {
            // given
            const wrapper = mount(VsSearchInput, {
                props: {
                    useRegex: true,
                },
            });
            await nextTick(); // isInitialized 설정 대기
            const input = wrapper.find('input');
            await input.setValue('^test');
            wrapper.vm.isRegexOn = true;
            vi.advanceTimersByTime(400);
            await nextTick();

            // when
            const result1 = wrapper.vm.match('test text');
            const result2 = wrapper.vm.match('other test');
            const result3 = wrapper.vm.match('text test');

            // then
            expect(result1).toBe(true);
            expect(result2).toBe(false);
            expect(result3).toBe(false);
        });

        it('잘못된 정규식이 입력되면 일반 텍스트 검색으로 fallback해야 한다', async () => {
            // given
            const wrapper = mount(VsSearchInput, {
                props: {
                    useRegex: true,
                },
            });
            await nextTick(); // isInitialized 설정 대기
            const input = wrapper.find('input');
            await input.setValue('[');
            wrapper.vm.isRegexOn = true;
            vi.advanceTimersByTime(400);
            await nextTick();

            // when
            const result1 = wrapper.vm.match('[');
            const result2 = wrapper.vm.match('test text');

            // then
            expect(result1).toBe(true);
            expect(result2).toBe(false);
        });
    });

    describe('match 메서드 - debounce', () => {
        it('입력 직후(debounce 전)에는 match가 이전 검색어 기준으로 동작해야 한다', async () => {
            // given
            const wrapper = mount(VsSearchInput);
            const input = wrapper.find('input');

            // when - 입력했지만 debounce 아직 미완료
            await input.setValue('apple');

            // then - appliedSearchText가 아직 '' 이므로 모두 true
            expect(wrapper.vm.match('apple')).toBe(true);
            expect(wrapper.vm.match('banana')).toBe(true);
        });

        it('400ms 후 match가 새 검색어로 동작해야 한다', async () => {
            // given
            const wrapper = mount(VsSearchInput);
            await nextTick(); // isInitialized 설정 대기
            const input = wrapper.find('input');

            // when
            await input.setValue('apple');
            vi.advanceTimersByTime(400);
            await nextTick();

            // then
            expect(wrapper.vm.match('apple')).toBe(true);
            expect(wrapper.vm.match('banana')).toBe(false);
        });

        it('빠르게 연속 입력 시 마지막 값으로만 match가 적용되어야 한다', async () => {
            // given
            const wrapper = mount(VsSearchInput);
            const input = wrapper.find('input');

            // when - 300ms 안에 연속 입력
            await input.setValue('a');
            vi.advanceTimersByTime(100);
            await input.setValue('ap');
            vi.advanceTimersByTime(100);
            await input.setValue('app');
            vi.advanceTimersByTime(100);

            // then - debounce 미완료 상태: 아직 필터 미적용
            expect(wrapper.vm.match('banana')).toBe(true);

            // 마지막 입력으로부터 400ms 후
            vi.advanceTimersByTime(400);
            await nextTick();

            expect(wrapper.vm.match('apple')).toBe(true);
            expect(wrapper.vm.match('banana')).toBe(false);
        });

        it('clear 시 debounce 없이 즉시 match가 초기화되어야 한다', async () => {
            // given - 검색어가 적용된 상태
            const wrapper = mount(VsSearchInput);
            await nextTick(); // isInitialized 설정 대기
            const input = wrapper.find('input');
            await input.setValue('apple');
            vi.advanceTimersByTime(400);
            await nextTick();
            expect(wrapper.vm.match('banana')).toBe(false);

            // when
            wrapper.vm.clear();
            await nextTick();

            // then - 즉시 전체 일치
            expect(wrapper.vm.match('banana')).toBe(true);
        });

        it('modelValue prop 변경 시 debounce 없이 즉시 match에 반영되어야 한다', async () => {
            // given
            const wrapper = mount(VsSearchInput, {
                props: { modelValue: '' },
            });

            // when
            await wrapper.setProps({ modelValue: 'apple' });
            await nextTick();

            // then - timer advance 없이 즉시 적용
            expect(wrapper.vm.match('apple')).toBe(true);
            expect(wrapper.vm.match('banana')).toBe(false);
        });
    });
});
