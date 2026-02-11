import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VsMessage from './../VsMessage.vue';

describe('VsMessage', () => {
    describe('colorClass', () => {
        it('state가 설정되지 않으면 기본 idle 색상 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsMessage);

            // then
            expect(wrapper.vm.colorClass).toBe('vs-color-scheme-default');
        });

        it('idle state일 때 기본 색상 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsMessage, {
                props: {
                    state: 'idle',
                },
            });

            // then
            expect(wrapper.vm.colorClass).toBe('vs-color-scheme-default');
        });

        it('info state일 때 파란색 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsMessage, {
                props: {
                    state: 'info',
                },
            });

            // then
            expect(wrapper.vm.colorClass).toBe('vs-color-scheme-blue');
        });

        it('success state일 때 초록색 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsMessage, {
                props: {
                    state: 'success',
                },
            });

            // then
            expect(wrapper.vm.colorClass).toBe('vs-color-scheme-green');
        });

        it('warning state일 때 노란색 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsMessage, {
                props: {
                    state: 'warning',
                },
            });

            // then
            expect(wrapper.vm.colorClass).toBe('vs-color-scheme-amber');
        });

        it('error state일 때 빨간색 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsMessage, {
                props: {
                    state: 'error',
                },
            });

            // then
            expect(wrapper.vm.colorClass).toBe('vs-color-scheme-red');
        });
    });

    describe('icon', () => {
        it('각 state별로 다른 아이콘이 반환되어야 한다', () => {
            // given
            const states = ['idle', 'info', 'success', 'warning', 'error'] as const;
            const wrappers = states.map((state) => mount(VsMessage, { props: { state } }));

            // when, then
            const icons = wrappers.map((wrapper) => wrapper.vm.icon);
            const uniqueIcons = new Set(icons);

            // 각 state별로 고유한 아이콘이 있어야 함
            expect(uniqueIcons.size).toBe(states.length);
        });
    });
});
