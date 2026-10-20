import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, nextTick, ref } from 'vue';
import { logUtil } from '@/utils';
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

        it('list-style을 없앤 ol도 목록으로 읽히도록 role="list"를 가져야 한다', () => {
            // given, when
            const wrapper = mount(VsBreadcrumb, { props: { paths: PATHS } });

            // then
            expect(wrapper.find('ol').attributes('role')).toBe('list');
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

    describe('events', () => {
        it('조상 항목을 클릭하면 클릭한 단계까지의 paths와 전체 paths로 click 이벤트를 보내야 한다', async () => {
            // given
            const wrapper = mount(VsBreadcrumb, { props: { paths: PATHS } });

            // when
            await wrapper.findAll('button.vs-breadcrumb-link')[1].trigger('click');

            // then
            expect(wrapper.emitted('click')![0]).toEqual([['Home', 'Components'], PATHS]);
        });

        it('현재 항목을 클릭하면 click 이벤트를 보내지 않아야 한다', async () => {
            // given
            const wrapper = mount(VsBreadcrumb, { props: { paths: PATHS } });

            // when
            await wrapper.find('.vs-breadcrumb-current').trigger('click');

            // then
            expect(wrapper.emitted('click')).toBeUndefined();
        });

        it('같은 문자열이 반복돼도 클릭한 위치까지의 paths를 보내야 한다', async () => {
            // given
            const paths = ['Docs', 'Docs', 'Intro'];
            const wrapper = mount(VsBreadcrumb, { props: { paths } });

            // when
            await wrapper.findAll('button.vs-breadcrumb-link')[1].trigger('click');

            // then
            expect(wrapper.emitted('click')![0]).toEqual([['Docs', 'Docs'], paths]);
        });

        it('emit된 배열을 변경해도 paths prop과 다음 emit 값이 바뀌지 않아야 한다', async () => {
            // given
            const wrapper = mount(VsBreadcrumb, { props: { paths: PATHS } });
            const button = wrapper.findAll('button.vs-breadcrumb-link')[1];
            await button.trigger('click');
            const [clicked, all] = wrapper.emitted('click')![0] as string[][];

            // when
            clicked.push('X');
            all.push('Y');
            await button.trigger('click');

            // then
            expect(wrapper.props('paths')).toEqual(PATHS);
            expect(wrapper.emitted('click')![1]).toEqual([['Home', 'Components'], PATHS]);
        });
    });

    describe('disabled', () => {
        it('disabled가 true면 모든 조상 버튼이 비활성화되고 클릭해도 이벤트를 보내지 않아야 한다', async () => {
            // given
            const wrapper = mount(VsBreadcrumb, { props: { paths: PATHS, disabled: true } });
            const buttons = wrapper.findAll('button.vs-breadcrumb-link');

            // when
            await buttons[0].trigger('click');

            // then
            expect(buttons.every((button) => button.attributes('disabled') !== undefined)).toBe(true);
            expect(buttons.every((button) => button.classes().includes('vs-disabled'))).toBe(true);
            expect(wrapper.emitted('click')).toBeUndefined();
        });

        it('disabled 함수는 (path, index)를 받아 해당 조상만 비활성화해야 한다', () => {
            // given
            const disabled = vi.fn((_path: string, index: number) => index === 0);

            // when
            const wrapper = mount(VsBreadcrumb, { props: { paths: PATHS, disabled } });

            // then
            const buttons = wrapper.findAll('button.vs-breadcrumb-link');
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
            expect(wrapper.findAll('button.vs-breadcrumb-link')[0].text()).toBe('Home-0-false-true');
            expect(wrapper.find('.vs-breadcrumb-current').text()).toBe('Breadcrumb-2-true-false');
        });

        it('item 슬롯을 사용해도 조상 항목 클릭 시 click 이벤트를 보내야 한다', async () => {
            // given
            const wrapper = mount(VsBreadcrumb, {
                props: { paths: PATHS },
                slots: { item: '<b class="custom-item">{{ path }}</b>' },
            });

            // when
            await wrapper.findAll('button.vs-breadcrumb-link')[0].find('.custom-item').trigger('click');

            // then
            expect(wrapper.emitted('click')![0]).toEqual([['Home'], PATHS]);
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

    describe('collapse', () => {
        const LONG = ['A', 'B', 'C', 'D', 'E', 'F'];

        afterEach(() => {
            vi.restoreAllMocks();
        });

        it('showingLength보다 항목이 많으면 첫 항목과 마지막 showingLength-1개 사이에 펼치기 버튼을 렌더링해야 한다', () => {
            // given, when
            const wrapper = mount(VsBreadcrumb, {
                props: { paths: LONG, showingLength: 3, styleSet: { $ellipsis: { color: 'red' } } },
            });

            // then
            expect(wrapper.findAll('li.vs-breadcrumb-item')).toHaveLength(4);
            expect(wrapper.findAll('button.vs-breadcrumb-link').map((button) => button.text())).toEqual(['A', 'E']);
            expect(wrapper.find('.vs-breadcrumb-current').text()).toBe('F');

            const ellipsis = wrapper.find('button.vs-breadcrumb-ellipsis');
            expect(ellipsis.attributes('type')).toBe('button');
            expect(ellipsis.attributes('aria-label')).toBe('show hidden paths');
            expect(ellipsis.attributes('style')).toContain('color: red');
        });

        it('showingLength가 항목 수 이상이면 접지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsBreadcrumb, { props: { paths: PATHS, showingLength: 3 } });

            // then
            expect(wrapper.findAll('li.vs-breadcrumb-item')).toHaveLength(3);
            expect(wrapper.find('.vs-breadcrumb-ellipsis').exists()).toBe(false);
        });

        it('showingLength가 없으면 항목이 많아도 접지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsBreadcrumb, { props: { paths: LONG } });

            // then
            expect(wrapper.findAll('li.vs-breadcrumb-item')).toHaveLength(6);
            expect(wrapper.find('.vs-breadcrumb-ellipsis').exists()).toBe(false);
        });

        it('펼치기 버튼을 누르면 모든 항목을 보여주고 첫 번째로 드러난 항목에 focus를 옮겨야 한다', async () => {
            // given
            const wrapper = mount(VsBreadcrumb, {
                props: { paths: LONG, showingLength: 3 },
                attachTo: document.body,
            });

            // when
            await wrapper.find('button.vs-breadcrumb-ellipsis').trigger('click');
            await nextTick();

            // then
            expect(wrapper.findAll('li.vs-breadcrumb-item')).toHaveLength(6);
            expect(wrapper.find('.vs-breadcrumb-ellipsis').exists()).toBe(false);
            expect(document.activeElement?.textContent?.trim()).toBe('B');

            wrapper.unmount();
        });

        it('접힌 상태에서도 click 이벤트는 원래 index 기준으로 paths를 보내야 한다', async () => {
            // given
            const wrapper = mount(VsBreadcrumb, { props: { paths: LONG, showingLength: 3 } });

            // when
            await wrapper.findAll('button.vs-breadcrumb-link')[1].trigger('click');

            // then
            expect(wrapper.emitted('click')![0]).toEqual([['A', 'B', 'C', 'D', 'E'], LONG]);
        });

        it('접힌 상태에서 펼치기 버튼 뒤 separator는 마지막으로 숨겨진 항목의 index를 받아야 한다', () => {
            // given, when
            const wrapper = mount(VsBreadcrumb, {
                props: { paths: LONG, showingLength: 3 },
                slots: { separator: '{{ index }}' },
            });

            // then
            const separators = wrapper.findAll('.vs-breadcrumb-separator');
            expect(separators.map((separator) => separator.text())).toEqual(['0', '3', '4']);
        });

        it('paths가 바뀌면 다시 접혀야 한다', async () => {
            // given
            const wrapper = mount(VsBreadcrumb, { props: { paths: LONG, showingLength: 3 } });
            await wrapper.find('button.vs-breadcrumb-ellipsis').trigger('click');

            // when
            await wrapper.setProps({ paths: ['A', 'B', 'C', 'D', 'E', 'G'] });

            // then
            expect(wrapper.find('.vs-breadcrumb-ellipsis').exists()).toBe(true);
        });

        it('부모가 같은 내용의 새 paths 배열로 다시 렌더링해도 펼친 상태를 유지해야 한다', async () => {
            // given
            const Parent = defineComponent({
                components: { VsBreadcrumb },
                setup() {
                    const counter = ref(0);
                    return { counter };
                },
                template: `
                    <div>
                        <span class="counter">{{ counter }}</span>
                        <vs-breadcrumb :paths="['A', 'B', 'C', 'D', 'E', 'F']" :showing-length="3" />
                    </div>
                `,
            });
            const wrapper = mount(Parent);
            await wrapper.find('button.vs-breadcrumb-ellipsis').trigger('click');

            // when
            (wrapper.vm as unknown as { counter: number }).counter++;
            await nextTick();

            // then
            expect(wrapper.find('.counter').text()).toBe('1');
            expect(wrapper.find('.vs-breadcrumb-ellipsis').exists()).toBe(false);
        });

        it('펼친 뒤 첫 번째로 드러난 항목이 비활성이면 다음 활성 항목에 focus를 옮겨야 한다', async () => {
            // given
            const wrapper = mount(VsBreadcrumb, {
                props: { paths: LONG, showingLength: 3, disabled: (_path: string, index: number) => index === 1 },
                attachTo: document.body,
            });

            // when
            await wrapper.find('button.vs-breadcrumb-ellipsis').trigger('click');
            await nextTick();

            // then
            expect(document.activeElement?.textContent?.trim()).toBe('C');

            wrapper.unmount();
        });

        it('펼친 뒤 활성 항목이 없으면 목록에 focus를 옮겨야 한다', async () => {
            // given
            const wrapper = mount(VsBreadcrumb, {
                props: { paths: LONG, showingLength: 3, disabled: true },
                attachTo: document.body,
            });

            // when
            await wrapper.find('button.vs-breadcrumb-ellipsis').trigger('click');
            await nextTick();

            // then
            expect(document.activeElement).toBe(wrapper.find('ol').element);

            wrapper.unmount();
        });

        it('showingLength가 null이면 접지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsBreadcrumb, {
                props: { paths: LONG, showingLength: null as unknown as number },
            });

            // then
            expect(wrapper.findAll('li.vs-breadcrumb-item')).toHaveLength(6);
            expect(wrapper.find('.vs-breadcrumb-ellipsis').exists()).toBe(false);
        });

        it('showingLength가 유효 범위를 벗어나도 현재 항목과 정수 index를 유지해야 한다', () => {
            // given
            vi.spyOn(logUtil, 'propError').mockImplementation(() => {});
            vi.spyOn(console, 'warn').mockImplementation(() => {});

            // when
            const tooSmall = mount(VsBreadcrumb, {
                props: { paths: LONG, showingLength: 1 },
                slots: { separator: '{{ index }}' },
            });
            const fractional = mount(VsBreadcrumb, {
                props: { paths: LONG, showingLength: 2.5 },
                slots: { separator: '{{ index }}' },
            });

            // then
            expect(tooSmall.find('li[aria-current="page"]').text()).toBe('F');
            expect(tooSmall.findAll('.vs-breadcrumb-separator').map((s) => s.text())).toEqual(['0', '4']);
            expect(fractional.findAll('.vs-breadcrumb-separator').map((s) => s.text())).toEqual(['0', '4']);
        });

        it('showingLength가 2보다 작으면 prop 에러를 기록해야 한다', () => {
            // given
            const propError = vi.spyOn(logUtil, 'propError').mockImplementation(() => {});
            vi.spyOn(console, 'warn').mockImplementation(() => {});

            // when
            mount(VsBreadcrumb, { props: { paths: LONG, showingLength: 1 } });

            // then
            expect(propError).toHaveBeenCalledWith('VsBreadcrumb', 'showingLength', expect.any(String));
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
