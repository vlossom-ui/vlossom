import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import VsBreadcrumb from './../VsBreadcrumb.vue';

const PATHS = ['Home', 'Components', 'Breadcrumb'];

describe('VsBreadcrumb', () => {
    describe('rendering', () => {
        it('paths가 비어 있으면 nav를 렌더링하지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsBreadcrumb, { props: { paths: [] } });

            // then
            expect(wrapper.find('nav').exists()).toBe(false);
        });

        it('paths 개수만큼 li를 렌더링해야 한다', () => {
            // given, when
            const wrapper = mount(VsBreadcrumb, { props: { paths: PATHS } });

            // then
            expect(wrapper.findAll('.vs-breadcrumb-item')).toHaveLength(3);
        });

        it('조상 항목인 link는 button[type=button]으로, 마지막 항목은 span으로 렌더링해야 한다', () => {
            // given, when
            const wrapper = mount(VsBreadcrumb, { props: { paths: PATHS } });

            // then
            const buttons = wrapper.findAll('button.vs-breadcrumb-link');
            expect(buttons.map((button) => button.text())).toEqual(['Home', 'Components']);
            expect(buttons.every((button) => button.attributes('type') === 'button')).toBe(true);
            expect(wrapper.find('span.vs-breadcrumb-current').text()).toBe('Breadcrumb');
        });

        it('separator는 항목 수보다 1개 적게, 기본 아이콘으로 렌더링해야 한다', () => {
            // given, when
            const wrapper = mount(VsBreadcrumb, { props: { paths: PATHS } });

            // then
            expect(wrapper.findAll('.vs-breadcrumb-separator')).toHaveLength(2);
            expect(wrapper.findAll('.vs-breadcrumb-separator svg')).toHaveLength(2);
        });

        it('항목이 1개면 separator 없이 현재 항목만 렌더링해야 한다', () => {
            // given, when
            const wrapper = mount(VsBreadcrumb, { props: { paths: ['Home'] } });

            // then
            expect(wrapper.findAll('.vs-breadcrumb-separator')).toHaveLength(0);
            expect(wrapper.findAll('.vs-breadcrumb-link')).toHaveLength(0);
            expect(wrapper.find('.vs-breadcrumb-current').text()).toBe('Home');
        });
    });

    describe('events', () => {
        it('조상 항목인 link 클릭하면 클릭한 단계까지의 paths와 클릭한 path로 click-path 이벤트를 보내야 한다', async () => {
            // given
            const wrapper = mount(VsBreadcrumb, { props: { paths: PATHS } });

            // when
            await wrapper.findAll('.vs-breadcrumb-link')[1].trigger('click');

            // then
            expect(wrapper.emitted('click-path')![0]).toEqual([['Home', 'Components'], 'Components']);
        });

        it('현재 항목인 current 클릭하면 click-path 이벤트를 보내지 않아야 한다', async () => {
            // given
            const wrapper = mount(VsBreadcrumb, { props: { paths: PATHS } });

            // when
            await wrapper.find('.vs-breadcrumb-current').trigger('click');

            // then
            expect(wrapper.emitted('click-path')).toBeUndefined();
        });

        it('같은 문자열이 반복돼도 클릭한 위치까지의 paths를 보내야 한다', async () => {
            // given
            const paths = ['Docs', 'Docs', 'Intro'];
            const wrapper = mount(VsBreadcrumb, { props: { paths } });

            // when
            await wrapper.findAll('.vs-breadcrumb-link')[1].trigger('click');

            // then
            expect(wrapper.emitted('click-path')![0]).toEqual([['Docs', 'Docs'], 'Docs']);
        });

        it('조상 항목 클릭은 부모 요소로 전파되지 않아야 한다', async () => {
            // given
            const onParentClick = vi.fn();
            const wrapper = mount(
                defineComponent({
                    components: { VsBreadcrumb },
                    setup: () => ({ paths: PATHS, onParentClick }),
                    template: '<div @click="onParentClick"><vs-breadcrumb :paths="paths" /></div>',
                }),
            );

            // when
            await wrapper.find('.vs-breadcrumb-link').trigger('click');

            // then
            expect(onParentClick).not.toHaveBeenCalled();
        });
    });

    describe('disabled', () => {
        it('disabled가 true면 모든 조상 버튼이 비활성화되고 클릭해도 이벤트를 보내지 않아야 한다', async () => {
            // given
            const wrapper = mount(VsBreadcrumb, { props: { paths: PATHS, disabled: true } });
            const buttons = wrapper.findAll('.vs-breadcrumb-link');

            // when
            await buttons[0].trigger('click');

            // then
            expect(buttons.every((button) => button.attributes('disabled') !== undefined)).toBe(true);
            expect(buttons.every((button) => button.classes().includes('vs-disabled'))).toBe(true);
            expect(wrapper.emitted('click-path')).toBeUndefined();
        });

        it('disabled 함수는 (path, index)를 받아 해당 조상만 비활성화해야 한다', () => {
            // given
            const disabled = vi.fn((_path: string, index: number) => index === 0);

            // when
            const wrapper = mount(VsBreadcrumb, { props: { paths: PATHS, disabled } });

            // then
            const buttons = wrapper.findAll('.vs-breadcrumb-link');
            expect(buttons[0].attributes('disabled')).toBeDefined();
            expect(buttons[1].attributes('disabled')).toBeUndefined();
            expect(disabled).toHaveBeenCalledWith('Home', 0);
        });
    });

    describe('slot', () => {
        it('item 슬롯은 path, index, isCurrent, isDisabled를 받아야 한다', () => {
            // given, when
            const wrapper = mount(VsBreadcrumb, {
                props: { paths: PATHS, disabled: (_path: string, index: number) => index === 0 },
                slots: {
                    item: '{{ path }}-{{ index }}-{{ isCurrent }}-{{ isDisabled }}',
                },
            });

            // then
            expect(wrapper.findAll('.vs-breadcrumb-link')[0].text()).toBe('Home-0-false-true');
            expect(wrapper.find('.vs-breadcrumb-current').text()).toBe('Breadcrumb-2-true-false');
        });

        it('현재 항목의 item 슬롯은 disabled와 관계없이 isDisabled false를 받아야 한다', () => {
            // given
            const disabled = vi.fn(() => true);

            // when
            const wrapper = mount(VsBreadcrumb, {
                props: { paths: PATHS, disabled },
                slots: { item: '{{ path }}-{{ isDisabled }}' },
            });

            // then
            expect(wrapper.find('.vs-breadcrumb-current').text()).toBe('Breadcrumb-false');
            expect(disabled).not.toHaveBeenCalledWith('Breadcrumb', 2);
        });

        it('item 슬롯을 사용해도 조상 항목 클릭 시 click-path 이벤트를 보내야 한다', async () => {
            // given
            const wrapper = mount(VsBreadcrumb, {
                props: { paths: PATHS },
                slots: { item: '<b class="custom-item">{{ path }}</b>' },
            });

            // when
            await wrapper.findAll('.vs-breadcrumb-link')[0].find('.custom-item').trigger('click');

            // then
            expect(wrapper.emitted('click-path')![0]).toEqual([['Home'], 'Home']);
        });

        it('separator 슬롯은 기본 아이콘을 대체하고 index를 받아야 한다', () => {
            // given, when
            const wrapper = mount(VsBreadcrumb, {
                props: { paths: PATHS },
                slots: { separator: '/{{ index }}' },
            });

            // then
            const separators = wrapper.findAll('.vs-breadcrumb-separator');
            expect(separators.map((separator) => separator.text())).toEqual(['/0', '/1']);
            expect(wrapper.findAll('.vs-breadcrumb-separator svg')).toHaveLength(0);
        });
    });

    describe('reactivity', () => {
        it('paths가 줄어들면 마지막 항목을 현재 항목으로 다시 계산해야 한다', async () => {
            // given
            const wrapper = mount(VsBreadcrumb, { props: { paths: PATHS } });

            // when
            await wrapper.setProps({ paths: ['Home', 'Components'] });

            // then
            expect(wrapper.find('.vs-breadcrumb-current').text()).toBe('Components');
            expect(wrapper.findAll('.vs-breadcrumb-separator')).toHaveLength(1);

            // when
            await wrapper.setProps({ paths: [] });

            // then
            expect(wrapper.find('nav').exists()).toBe(false);
        });
    });

    describe('style', () => {
        it('colorScheme prop이 주어지면 color scheme 클래스를 적용해야 한다', () => {
            // given, when
            const wrapper = mount(VsBreadcrumb, { props: { paths: PATHS, colorScheme: 'red' } });

            // then
            expect(wrapper.find('nav').classes()).toContain('vs-cs-red');
        });

        it('styleSet의 $list, $item, $separator를 해당 요소에 적용해야 한다', () => {
            // given, when
            const wrapper = mount(VsBreadcrumb, {
                props: {
                    paths: PATHS,
                    styleSet: {
                        $list: { gap: '1rem' },
                        $item: { maxWidth: '8rem', color: 'red' },
                        $separator: { opacity: '0.5' },
                    },
                },
            });

            // then
            expect(wrapper.find('ol').attributes('style')).toContain('gap: 1rem');
            expect(wrapper.find('.vs-breadcrumb-link').attributes('style')).toContain('max-width: 8rem');
            expect(wrapper.find('.vs-breadcrumb-link').attributes('style')).toContain('color: red');
            expect(wrapper.find('.vs-breadcrumb-current').attributes('style')).toContain('color: red');
            expect(wrapper.find('.vs-breadcrumb-separator').attributes('style')).toContain('opacity: 0.5');
        });

        it('$item.$current는 현재 항목에만 $item 위에 덮어써야 한다', () => {
            // given, when
            const wrapper = mount(VsBreadcrumb, {
                props: {
                    paths: PATHS,
                    styleSet: { $item: { color: 'red', $current: { color: 'blue', fontWeight: '700' } } },
                },
            });

            // then
            const current = wrapper.find('.vs-breadcrumb-current').attributes('style');
            const link = wrapper.find('.vs-breadcrumb-link').attributes('style');
            expect(current).toContain('color: blue');
            expect(current).toContain('font-weight: 700');
            expect(link).toContain('color: red');
            expect(link).not.toContain('font-weight');
        });
    });
});
