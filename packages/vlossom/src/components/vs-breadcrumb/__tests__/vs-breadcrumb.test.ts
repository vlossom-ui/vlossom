import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
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
            expect(wrapper.findAll('li.vs-breadcrumb-item')).toHaveLength(3);
        });

        it('조상 항목은 button[type=button]으로, 마지막 항목은 span으로 렌더링해야 한다', () => {
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
            expect(wrapper.findAll('button.vs-breadcrumb-link')).toHaveLength(0);
            expect(wrapper.find('.vs-breadcrumb-current').text()).toBe('Home');
        });

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

    describe('a11y', () => {
        it('nav > ol > li 구조와 기본 aria-label "Breadcrumb"을 가져야 한다', () => {
            // given, when
            const wrapper = mount(VsBreadcrumb, { props: { paths: PATHS } });

            // then
            expect(wrapper.find('nav > ol > li').exists()).toBe(true);
            expect(wrapper.find('nav').attributes('aria-label')).toBe('Breadcrumb');
        });

        it('aria-label 속성을 전달하면 기본값을 덮어써야 한다', () => {
            // given, when
            const wrapper = mount(VsBreadcrumb, {
                props: { paths: PATHS },
                attrs: { 'aria-label': 'Location' },
            });

            // then
            expect(wrapper.find('nav').attributes('aria-label')).toBe('Location');
        });

        it('마지막 li에만 aria-current="page"를 적용해야 한다', () => {
            // given, when
            const wrapper = mount(VsBreadcrumb, { props: { paths: PATHS } });

            // then
            const items = wrapper.findAll('li.vs-breadcrumb-item');
            expect(items[0].attributes('aria-current')).toBeUndefined();
            expect(items[1].attributes('aria-current')).toBeUndefined();
            expect(items[2].attributes('aria-current')).toBe('page');
        });

        it('separator에 aria-hidden="true"를 적용해야 한다', () => {
            // given, when
            const wrapper = mount(VsBreadcrumb, { props: { paths: PATHS } });

            // then
            const separators = wrapper.findAll('.vs-breadcrumb-separator');
            expect(separators.every((separator) => separator.attributes('aria-hidden') === 'true')).toBe(true);
        });
    });

    describe('style', () => {
        it('colorScheme prop이 주어지면 color scheme 클래스를 적용해야 한다', () => {
            // given, when
            const wrapper = mount(VsBreadcrumb, { props: { paths: PATHS, colorScheme: 'red' } });

            // then
            expect(wrapper.find('nav').classes()).toContain('vs-cs-red');
        });

        it('styleSet의 각 키를 해당 요소에 적용해야 한다', () => {
            // given, when
            const wrapper = mount(VsBreadcrumb, {
                props: {
                    paths: PATHS,
                    styleSet: {
                        $list: { gap: '1rem' },
                        $item: { maxWidth: '8rem' },
                        $link: { color: 'red' },
                        $current: { fontWeight: '700' },
                        $separator: { opacity: '0.5' },
                    },
                },
            });

            // then
            expect(wrapper.find('ol').attributes('style')).toContain('gap: 1rem');
            expect(wrapper.find('li.vs-breadcrumb-item').attributes('style')).toContain('max-width: 8rem');
            expect(wrapper.find('button.vs-breadcrumb-link').attributes('style')).toContain('color: red');
            expect(wrapper.find('.vs-breadcrumb-current').attributes('style')).toContain('font-weight: 700');
            expect(wrapper.find('.vs-breadcrumb-separator').attributes('style')).toContain('opacity: 0.5');
        });
    });
});
