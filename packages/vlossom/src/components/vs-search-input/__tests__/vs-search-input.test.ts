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
            const input = wrapper.find('input');
            await input.setValue('TEST');

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
            const input = wrapper.find('input');
            await input.setValue('TEST');
            await nextTick();

            // when - 토글 활성화
            wrapper.vm.isCaseSensitiveOn = true;
            await nextTick();

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
            const input = wrapper.find('input');
            await input.setValue('^test');
            await nextTick();

            // when - 토글 활성화
            wrapper.vm.isRegexOn = true;
            await nextTick();

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
            const input = wrapper.find('input');
            await input.setValue('[');
            await nextTick();

            // when - 토글 활성화
            wrapper.vm.isRegexOn = true;
            await nextTick();

            const result1 = wrapper.vm.match('[');
            const result2 = wrapper.vm.match('test text');

            // then
            expect(result1).toBe(true);
            expect(result2).toBe(false);
        });
    });
});
