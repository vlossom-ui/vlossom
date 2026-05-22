import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VsRender from './../VsRender.vue';
import { markRaw, h } from 'vue';

describe('VsRender', () => {
    describe('문자열 content 렌더링', () => {
        it('일반 텍스트 문자열이 주어지면 span 태그로 텍스트가 렌더링되어야 한다', () => {
            //given, when
            const wrapper = mount(VsRender, {
                props: {
                    content: '안녕하세요',
                },
            });

            // then
            expect(wrapper.find('span').exists()).toBe(true);
            expect(wrapper.find('span').text()).toBe('안녕하세요');
        });

        it('HTML 태그가 포함된 문자열이 주어지면 파싱된 HTML 요소가 렌더링되어야 한다', () => {
            //given, when
            const wrapper = mount(VsRender, {
                props: {
                    content: '<div class="test-class">테스트 내용</div>',
                },
            });

            // then
            expect(wrapper.find('div').exists()).toBe(true);
            expect(wrapper.find('div').classes()).toContain('test-class');
            expect(wrapper.find('div').text()).toBe('테스트 내용');
        });

        it('복잡한 HTML 구조가 주어지면 올바른 구조로 렌더링되어야 한다', () => {
            //given, when
            const wrapper = mount(VsRender, {
                props: {
                    content: '<button id="btn" data-test="value">클릭하세요</button>',
                },
            });

            // then
            const button = wrapper.find('button');
            expect(button.exists()).toBe(true);
            expect(button.attributes('id')).toBe('btn');
            expect(button.attributes('data-test')).toBe('value');
            expect(button.text()).toBe('클릭하세요');
        });

        it('잘못된 HTML이 주어지더라도, 원본 텍스트가 보정된다', () => {
            //given, when
            const wrapper = mount(VsRender, {
                props: {
                    content: '<div>닫히지 않은 div',
                },
            });

            // then
            expect(wrapper.find('div').exists()).toBe(true);
            expect(wrapper.find('div').text()).toBe('닫히지 않은 div');
        });
    });

    describe('컴포넌트 content 렌더링', () => {
        it('Vue 컴포넌트가 주어지고, 해당 컴포넌트가 렌더링되어야 한다', () => {
            //given
            const TestComponent = markRaw({
                template: '<div class="test-component">테스트 컴포넌트</div>',
            });

            const wrapper = mount(VsRender, {
                props: {
                    content: TestComponent,
                },
            });

            expect(wrapper.find('.test-component').exists()).toBe(true);
            expect(wrapper.find('.test-component').text()).toBe('테스트 컴포넌트');
        });

        it('Vue 컴포넌트와 attrs가 주어지고, attrs가 전달되어 렌더링되어야 한다', () => {
            //given
            const TestComponent = markRaw({
                props: ['message'],
                template: '<div class="test-component">{{ message }}</div>',
            });

            const wrapper = mount(VsRender, {
                props: {
                    content: TestComponent,
                },
                attrs: {
                    message: 'attrs로 전달된 메시지',
                },
            });

            expect(wrapper.find('.test-component').exists()).toBe(true);
            expect(wrapper.find('.test-component').text()).toBe('attrs로 전달된 메시지');
        });

        it('함수형 컴포넌트가 주어지고, 해당 컴포넌트가 렌더링되어야 한다', () => {
            //given
            function TestFunctionalComponent() {
                return h('div', { class: 'functional-component' }, '함수형 컴포넌트');
            }

            const wrapper = mount(VsRender, {
                props: {
                    content: TestFunctionalComponent,
                },
            });

            expect(wrapper.find('.functional-component').exists()).toBe(true);
            expect(wrapper.find('.functional-component').text()).toBe('함수형 컴포넌트');
        });

        it('함수형 컴포넌트와 attrs가 주어지고, attrs가 전달되어 렌더링되어야 한다', () => {
            //given
            function TestFunctionalComponent(props: any) {
                return h('div', { class: 'functional-component', id: props.id }, props.message || '기본 메시지');
            }

            const wrapper = mount(VsRender, {
                props: {
                    content: TestFunctionalComponent,
                },
                attrs: {
                    id: 'test-id',
                    message: 'attrs로 전달된 메시지',
                },
            });

            expect(wrapper.find('.functional-component').exists()).toBe(true);
            expect(wrapper.find('.functional-component').attributes('id')).toBe('test-id');
            expect(wrapper.find('.functional-component').text()).toBe('attrs로 전달된 메시지');
        });
    });

    describe('componentProps 바인딩', () => {
        it('컴포넌트 content에 componentProps가 전달되어야 한다', () => {
            //given
            const TestComponent = markRaw({
                props: ['message', 'count'],
                template: '<div class="test-component">{{ message }} - {{ count }}</div>',
            });

            const wrapper = mount(VsRender, {
                props: {
                    content: TestComponent,
                    componentProps: { message: '안녕', count: 3 },
                },
            });

            expect(wrapper.find('.test-component').text()).toBe('안녕 - 3');
        });

        it('componentProps와 attrs가 동시에 주어지면 둘 다 컴포넌트에 전달되어야 한다', () => {
            //given
            const TestComponent = markRaw({
                props: ['message'],
                template: '<div class="test-component">{{ message }}</div>',
            });

            const wrapper = mount(VsRender, {
                props: {
                    content: TestComponent,
                    componentProps: { message: 'from props' },
                },
                attrs: {
                    id: 'attr-id',
                },
            });

            expect(wrapper.find('.test-component').text()).toBe('from props');
            expect(wrapper.find('.test-component').attributes('id')).toBe('attr-id');
        });

        it('동일한 키가 attrs와 componentProps 모두에 있으면 attrs가 우선되어야 한다 (Vue 기본 동작)', () => {
            //given
            const TestComponent = markRaw({
                props: ['message'],
                template: '<div class="test-component">{{ message }}</div>',
            });

            const wrapper = mount(VsRender, {
                props: {
                    content: TestComponent,
                    componentProps: { message: 'from componentProps' },
                },
                attrs: {
                    message: 'from attrs',
                },
            });

            expect(wrapper.find('.test-component').text()).toBe('from attrs');
        });

        it('문자열 content가 주어지면 componentProps가 무시되고 attrs만 적용되어야 한다', () => {
            //given
            const wrapper = mount(VsRender, {
                props: {
                    content: '<div class="text">텍스트</div>',
                    componentProps: { id: 'ignored', message: 'ignored' },
                },
                attrs: {
                    'data-test': 'value',
                },
            });

            // componentProps는 DOM에 새지 않음
            expect(wrapper.find('.text').attributes('id')).toBeUndefined();
            expect(wrapper.find('.text').attributes('message')).toBeUndefined();
            // attrs는 정상 적용 (자동 상속)
            expect(wrapper.find('.text').attributes('data-test')).toBe('value');
        });

        it('HTML 문자열의 class와 부모 attrs의 class가 자동 머지되어야 한다', () => {
            //given
            const wrapper = mount(VsRender, {
                props: {
                    content: '<button class="btn-primary">Click</button>',
                },
                attrs: {
                    class: 'size-4',
                },
            });

            // 자동 상속이 class를 머지: btn-primary + size-4
            const classes = wrapper.find('button').classes();
            expect(classes).toContain('btn-primary');
            expect(classes).toContain('size-4');
        });
    });

    describe('attrs 바인딩', () => {
        it('문자열 content와 attrs가 주어지고, attrs가 최상위 엘리먼트에 바인딩되어야 한다', () => {
            //given
            const wrapper = mount(VsRender, {
                props: {
                    content: '텍스트',
                },
                attrs: {
                    class: 'custom-class',
                    'data-test': 'value',
                },
            });

            expect(wrapper.find('span').exists()).toBe(true);
            expect(wrapper.find('span').text()).toBe('텍스트');
            expect(wrapper.find('span').classes()).toContain('custom-class');
            expect(wrapper.find('span').attributes('data-test')).toBe('value');
        });

        it('컴포넌트와 attrs가 주어지고, attrs가 컴포넌트에 전달되어야 한다', () => {
            //given
            const TestComponent = markRaw({
                props: ['message'],
                template: '<div class="test">{{ message || "기본 렌더링" }}</div>',
            });

            const wrapper = mount(VsRender, {
                props: {
                    content: TestComponent,
                },
                attrs: {},
            });

            expect(wrapper.find('.test').exists()).toBe(true);
            expect(wrapper.find('.test').text()).toBe('기본 렌더링');
        });
    });

    describe('에러 처리', () => {
        it('빈 문자열이 주어지고, 빈 span 태그가 렌더링되어야 한다', () => {
            //given
            const wrapper = mount(VsRender, {
                props: {
                    content: '',
                },
            });

            expect(wrapper.find('span').exists()).toBe(true);
            expect(wrapper.find('span').text()).toBe('');
        });

        it('빈 string이 주어지면 빈 span 태그가 렌더링되어야 한다', () => {
            //given
            const wrapper = mount(VsRender, {
                props: {
                    content: '',
                },
            });

            expect(wrapper.find('span').exists()).toBe(true);
            expect(wrapper.find('span').text()).toBe('');
        });
    });

    describe('HTML 파싱 엣지 케이스', () => {
        it('자체 닫힌 태그가 주어지고, 올바르게 파싱되어야 한다', () => {
            //given
            const wrapper = mount(VsRender, {
                props: {
                    content: '<img src="test.jpg" alt="테스트" />',
                },
            });

            const img = wrapper.find('img');
            expect(img.exists()).toBe(true);
            expect(img.attributes('src')).toBe('test.jpg');
            expect(img.attributes('alt')).toBe('테스트');
        });

        it('대문자 태그가 주어지고, 소문자로 변환되어 렌더링되어야 한다', () => {
            //given
            const wrapper = mount(VsRender, {
                props: {
                    content: '<DIV class="test">대문자 태그</DIV>',
                },
            });

            expect(wrapper.find('div').exists()).toBe(true);
            expect(wrapper.find('div').classes()).toContain('test');
            expect(wrapper.find('div').text()).toBe('대문자 태그');
        });
    });
});
