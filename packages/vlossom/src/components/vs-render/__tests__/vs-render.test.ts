import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VsRender from './../VsRender.vue';
import { markRaw } from 'vue';

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

        it('Vue 컴포넌트와 props가 주어지고, props가 전달되어 렌더링되어야 한다', () => {
            //given
            const TestComponent = markRaw({
                props: ['message'],
                template: '<div class="test-component">{{ message }}</div>',
            });

            const wrapper = mount(VsRender, {
                props: {
                    content: TestComponent,
                    props: {
                        message: 'props로 전달된 메시지',
                    },
                },
            });

            expect(wrapper.find('.test-component').exists()).toBe(true);
            expect(wrapper.find('.test-component').text()).toBe('props로 전달된 메시지');
        });
    });

    describe('props 검증', () => {
        it('문자열 content와 props가 주어지고, props는 무시되고 문자열만 렌더링되어야 한다', () => {
            //given
            const wrapper = mount(VsRender, {
                props: {
                    content: '텍스트',
                    props: { someProp: 'value' },
                },
            });

            expect(wrapper.find('span').exists()).toBe(true);
            expect(wrapper.find('span').text()).toBe('텍스트');
        });

        it('컴포넌트와 null props가 주어지고, 기본 빈 객체 props가 사용되어야 한다', () => {
            //given
            const TestComponent = markRaw({
                template: '<div class="test">기본 렌더링</div>',
            });

            const wrapper = mount(VsRender, {
                props: {
                    content: TestComponent,
                    props: undefined,
                },
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
