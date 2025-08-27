import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import VsIndexView from './../VsIndexView.vue';

describe('VsIndexView', () => {
    describe('modelValue prop', () => {
        it('modelValue가 1이면 두 번째 슬롯 콘텐츠가 표시되어야 한다 (keepAlive: true)', () => {
            // given, when
            const wrapper = mount(VsIndexView, {
                props: {
                    modelValue: 1,
                    keepAlive: true,
                },
                slots: {
                    default: ['<div class="item-0">첫 번째</div>', '<div class="item-1">두 번째</div>'],
                },
            });

            // then - keepAlive일 때는 모든 요소가 존재하지만 display로 제어
            expect(wrapper.find('.item-0').exists()).toBe(true);
            expect(wrapper.find('.item-0').isVisible()).toBe(false); // display: none

            expect(wrapper.find('.item-1').exists()).toBe(true);
            expect(wrapper.find('.item-1').isVisible()).toBe(true);
            expect(wrapper.find('.item-1').text()).toBe('두 번째');
        });

        it('modelValue가 1이면 두 번째 슬롯 콘텐츠만 렌더링되어야 한다 (keepAlive: false)', () => {
            // given, when
            const wrapper = mount(VsIndexView, {
                props: {
                    modelValue: 1,
                    keepAlive: false,
                },
                slots: {
                    default: ['<div class="item-0">첫 번째</div>', '<div class="item-1">두 번째</div>'],
                },
            });

            // then - keepAlive가 false일 때는 현재 인덱스만 DOM에 존재
            expect(wrapper.find('.item-0').exists()).toBe(false);
            expect(wrapper.find('.item-1').exists()).toBe(true);
            expect(wrapper.find('.item-1').text()).toBe('두 번째');
        });

        it('modelValue가 슬롯 개수를 초과하면 아무것도 표시되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsIndexView, {
                props: {
                    modelValue: 5,
                    keepAlive: false, // keepAlive false로 테스트
                },
                slots: {
                    default: ['<div class="item-0">첫 번째</div>', '<div class="item-1">두 번째</div>'],
                },
            });

            // then
            expect(wrapper.find('.item-0').exists()).toBe(false);
            expect(wrapper.find('.item-1').exists()).toBe(false);
        });
    });

    describe('keepAlive prop', () => {
        it('keepAlive가 true이면 KeepAlive 컴포넌트로 래핑되어야 한다', () => {
            // given, when
            const wrapper = mount(VsIndexView, {
                props: {
                    keepAlive: true,
                },
                slots: {
                    default: ['<div>첫 번째</div>', '<div>두 번째</div>'],
                },
            });

            // then
            expect(wrapper.findComponent({ name: 'KeepAlive' }).exists()).toBe(true);
            expect(wrapper.find('.vs-index-view-container').exists()).toBe(true);
        });

        it('keepAlive가 false이면 KeepAlive 컴포넌트가 없어야 한다', () => {
            // given, when
            const wrapper = mount(VsIndexView, {
                props: {
                    keepAlive: false,
                },
                slots: {
                    default: ['<div>첫 번째</div>', '<div>두 번째</div>'],
                },
            });

            // then
            expect(wrapper.findComponent({ name: 'KeepAlive' }).exists()).toBe(false);
            expect(wrapper.find('.vs-index-view-container').exists()).toBe(false);
        });
    });

    describe('반응형 props', () => {
        it('width prop이 주어지면 vs-responsive에 전달되어야 한다', () => {
            // given, when
            const wrapper = mount(VsIndexView, {
                props: {
                    width: '500px',
                },
                slots: {
                    default: '<div>콘텐츠</div>',
                },
            });

            // then
            const responsive = wrapper.findComponent({ name: 'VsResponsive' });
            expect(responsive.exists()).toBe(true);
            expect(responsive.props('width')).toBe('500px');
        });

        it('grid prop이 주어지면 vs-responsive에 전달되어야 한다', () => {
            // given, when
            const wrapper = mount(VsIndexView, {
                props: {
                    grid: 6,
                },
                slots: {
                    default: '<div>콘텐츠</div>',
                },
            });

            // then
            const responsive = wrapper.findComponent({ name: 'VsResponsive' });
            expect(responsive.exists()).toBe(true);
            expect(responsive.props('grid')).toBe(6);
        });
    });

    describe('updateIndex 메서드', () => {
        it('updateIndex 메서드가 노출되어야 한다', () => {
            // given, when
            const wrapper = mount(VsIndexView, {
                slots: {
                    default: ['<div>첫 번째</div>', '<div>두 번째</div>'],
                },
            });

            // then
            expect((wrapper.vm as any).updateIndex).toBeDefined();
            expect(typeof (wrapper.vm as any).updateIndex).toBe('function');
        });

        it('updateIndex 호출 시 update:modelValue 이벤트가 발생해야 한다', async () => {
            // given, when
            const wrapper = mount(VsIndexView, {
                slots: {
                    default: ['<div>첫 번째</div>', '<div>두 번째</div>'],
                },
            });

            (wrapper.vm as any).updateIndex(1);
            await nextTick(); // Vue의 반응성 시스템이 업데이트를 완료할 때까지 대기

            // then
            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')![0]).toEqual([1]);
        });
    });

    describe('Fragment 노드 처리', () => {
        it('v-for로 생성된 여러 요소들이 각각의 인덱스로 인식되어야 한다 (keepAlive: false)', () => {
            // given
            const TestComponent = {
                template: `
                    <vs-index-view v-model="currentIndex" :keep-alive="false">
                        <div v-for="i in 3" :key="i" class="item">{{ i }}</div>
                    </vs-index-view>
                `,
                components: { VsIndexView },
                data() {
                    return { currentIndex: 1 };
                },
            };

            // when
            const wrapper = mount(TestComponent);

            // then - keepAlive가 false일 때는 현재 인덱스만 DOM에 존재
            const items = wrapper.findAll('.item');
            expect(items).toHaveLength(1); // 현재 인덱스(1)의 아이템만 표시
            expect(items[0].text()).toBe('2'); // 두 번째 아이템 (인덱스 1 = "2")
        });

        it('v-for로 생성된 여러 요소들이 모두 렌더링되지만 하나만 표시되어야 한다 (keepAlive: true)', () => {
            // given
            const TestComponent = {
                template: `
                    <vs-index-view v-model="currentIndex" :keep-alive="true">
                        <div v-for="i in 3" :key="i" class="item">{{ i }}</div>
                    </vs-index-view>
                `,
                components: { VsIndexView },
                data() {
                    return { currentIndex: 1 };
                },
            };

            // when
            const wrapper = mount(TestComponent);

            // then - keepAlive가 true일 때는 모든 요소가 DOM에 존재
            const items = wrapper.findAll('.item');
            expect(items).toHaveLength(3); // 모든 아이템이 DOM에 존재

            // 하지만 현재 인덱스(1)만 보임
            expect(items[0].isVisible()).toBe(false); // 인덱스 0: 숨겨짐
            expect(items[1].isVisible()).toBe(true); // 인덱스 1: 표시됨
            expect(items[2].isVisible()).toBe(false); // 인덱스 2: 숨겨짐

            expect(items[1].text()).toBe('2'); // 두 번째 아이템 (인덱스 1 = "2")
        });

        it('template 태그로 그룹화된 요소들이 각각의 인덱스로 인식되어야 한다', () => {
            // given
            const TestComponent = {
                template: `
                    <vs-index-view v-model="currentIndex" :keep-alive="false">
                        <template v-for="i in 3" :key="i">
                            <div class="item">{{ i }}</div>
                        </template>
                    </vs-index-view>
                `,
                components: { VsIndexView },
                data() {
                    return { currentIndex: 2 };
                },
            };

            // when
            const wrapper = mount(TestComponent);

            // then
            const items = wrapper.findAll('.item');
            expect(items).toHaveLength(1); // 현재 인덱스(2)의 아이템만 표시
            expect(items[0].text()).toBe('3'); // 세 번째 아이템 (인덱스 2 = "3")
        });

        it('조건부 렌더링과 v-for가 혼합된 경우에도 정확히 처리되어야 한다', () => {
            // given
            const TestComponent = {
                template: `
                    <vs-index-view v-model="currentIndex" :keep-alive="false">
                        <div v-if="showFirst" class="conditional">조건부 첫 번째</div>
                        <div v-for="i in 2" :key="i" class="item">{{ i }}</div>
                    </vs-index-view>
                `,
                components: { VsIndexView },
                data() {
                    return {
                        currentIndex: 1, // 두 번째 요소 (첫 번째 v-for 아이템)
                        showFirst: true,
                    };
                },
            };

            // when
            const wrapper = mount(TestComponent);

            // then
            const conditionalItems = wrapper.findAll('.conditional');
            const forItems = wrapper.findAll('.item');

            // 조건부 요소는 인덱스 0이므로 숨겨짐
            expect(conditionalItems).toHaveLength(0);

            // v-for의 첫 번째 아이템이 인덱스 1이므로 표시됨
            expect(forItems).toHaveLength(1);
            expect(forItems[0].text()).toBe('1');
        });

        it('중첩된 Fragment (template + v-for)가 올바르게 평면화되어야 한다', () => {
            // given
            const TestComponent = {
                template: `
                    <vs-index-view v-model="currentIndex" :keep-alive="false">
                        <template v-for="group in groups" :key="group.id">
                            <div v-for="item in group.items" :key="item.id" class="nested-item">
                                {{ group.name }}-{{ item.name }}
                            </div>
                        </template>
                    </vs-index-view>
                `,
                components: { VsIndexView },
                data() {
                    return {
                        currentIndex: 2, // 세 번째 항목
                        groups: [
                            {
                                id: 1,
                                name: 'A',
                                items: [
                                    { id: 1, name: '1' },
                                    { id: 2, name: '2' },
                                ],
                            },
                            {
                                id: 2,
                                name: 'B',
                                items: [{ id: 3, name: '1' }],
                            },
                        ],
                    };
                },
            };

            // when
            const wrapper = mount(TestComponent);

            // then - 중첩된 Fragment가 평면화되어 개별 인덱스로 처리됨
            const items = wrapper.findAll('.nested-item');
            expect(items).toHaveLength(1); // 현재 인덱스(2)의 아이템만 표시
            expect(items[0].text()).toBe('B-1'); // 세 번째 아이템 (A-1, A-2, B-1 중 B-1)
        });
    });

    describe('빈 슬롯 처리', () => {
        it('슬롯이 비어있으면 아무것도 렌더링되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsIndexView);

            // then
            expect(wrapper.html()).toBe('');
        });

        it('빈 슬롯 배열이 주어지면 아무것도 렌더링되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsIndexView, {
                slots: {
                    default: [],
                },
            });

            // then
            expect(wrapper.html()).toBe('');
        });
    });

    describe('조건부 렌더링 (v-if)', () => {
        it('v-if가 false인 요소는 index 대상에서 제외되어야 한다', () => {
            // given
            const TestComponent = {
                template: `
                    <vs-index-view v-model="currentIndex" :keep-alive="false">
                        <div v-if="showFirst" class="first-item">첫 번째</div>
                        <div v-if="false" class="second-item">두 번째 (숨겨짐)</div>
                        <div v-if="showThird" class="third-item">세 번째</div>
                    </vs-index-view>
                `,
                components: { VsIndexView },
                data() {
                    return {
                        currentIndex: 1, // 두 번째 인덱스
                        showFirst: true,
                        showThird: true,
                    };
                },
            };

            // when
            const wrapper = mount(TestComponent);

            // then - v-if="false"인 두 번째 요소는 제외되고, 실제로는 "세 번째" 요소가 인덱스 1에 해당
            const items = wrapper.findAll('div[class*="item"]');
            expect(items).toHaveLength(1); // 현재 인덱스(1)의 아이템만 표시

            // v-if="false"인 요소는 DOM에 존재하지 않음
            expect(wrapper.find('.second-item').exists()).toBe(false);

            // 인덱스 1은 실제로는 "세 번째" 요소를 가리킴 (두 번째는 v-if="false"로 제외됨)
            expect(items[0].classes()).toContain('third-item');
            expect(items[0].text()).toBe('세 번째');
        });

        it('v-if가 false인 요소가 있을 때 keepAlive: true에서도 올바르게 동작해야 한다', () => {
            // given
            const TestComponent = {
                template: `
                    <vs-index-view v-model="currentIndex" :keep-alive="true">
                        <div v-if="true" class="item-0">A</div>
                        <div v-if="false" class="item-hidden">숨겨진 요소</div>
                        <div v-if="true" class="item-1">B</div>
                        <div v-if="true" class="item-2">C</div>
                    </vs-index-view>
                `,
                components: { VsIndexView },
                data() {
                    return { currentIndex: 2 }; // 세 번째 인덱스 (실제로는 "C")
                },
            };

            // when
            const wrapper = mount(TestComponent);

            // then - keepAlive가 true이므로 모든 실제 요소(v-if="true")가 DOM에 존재
            const allItems = wrapper.findAll('div[class*="item"]');
            expect(allItems).toHaveLength(3); // A, B, C만 존재 (숨겨진 요소 제외)

            // v-if="false"인 요소는 DOM에 존재하지 않음
            expect(wrapper.find('.item-hidden').exists()).toBe(false);

            // 인덱스 2에 해당하는 요소만 표시됨
            expect(allItems[0].isVisible()).toBe(false); // A (인덱스 0)
            expect(allItems[1].isVisible()).toBe(false); // B (인덱스 1)
            expect(allItems[2].isVisible()).toBe(true); // C (인덱스 2)

            expect(allItems[2].classes()).toContain('item-2');
            expect(allItems[2].text()).toBe('C');
        });

        it('모든 v-if가 false인 경우 아무것도 렌더링되지 않아야 한다', () => {
            // given
            const TestComponent = {
                template: `
                    <vs-index-view v-model="currentIndex" :keep-alive="false">
                        <div v-if="false" class="item-1">첫 번째</div>
                        <div v-if="false" class="item-2">두 번째</div>
                    </vs-index-view>
                `,
                components: { VsIndexView },
                data() {
                    return { currentIndex: 0 };
                },
            };

            // when
            const wrapper = mount(TestComponent);

            // then - 모든 요소가 v-if="false"이므로 아무것도 렌더링되지 않음
            const vsIndexView = wrapper.findComponent({ name: 'VsIndexView' });
            expect(vsIndexView.exists()).toBe(true);

            const items = wrapper.findAll('div[class*="item"]');
            expect(items).toHaveLength(0); // 아무 아이템도 없음
        });
    });
});
