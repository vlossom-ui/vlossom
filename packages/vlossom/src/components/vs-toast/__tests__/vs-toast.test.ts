import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import VsToast from './../VsToast.vue';

describe('VsToast', () => {
    let defaultOptions: any;

    beforeEach(() => {
        vi.useFakeTimers();
        defaultOptions = {};
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    describe('close 이벤트', () => {
        it('close 버튼 클릭 시 close 이벤트가 emit되어야 한다', async () => {
            // given
            const wrapper = mount(VsToast, defaultOptions);

            // when
            const closeButton = wrapper.find('.vs-toast-close');
            await closeButton.trigger('click');

            // then
            expect(wrapper.emitted('close')).toBeTruthy();
            expect(wrapper.emitted('close')).toHaveLength(1);
        });
    });

    describe('autoClose 기능', () => {
        it('autoClose가 true이고 timeout이 설정되면 timeout 후에 close 이벤트가 emit되어야 한다', async () => {
            // given
            const wrapper = mount(VsToast, {
                props: {
                    autoClose: true,
                    timeout: 1000,
                },
            });

            // when
            vi.advanceTimersByTime(1000);

            // then
            expect(wrapper.emitted('close')).toBeTruthy();
            expect(wrapper.emitted('close')).toHaveLength(1);
        });

        it('autoClose가 false이면 timeout이 설정되어도 close 이벤트가 emit되지 않아야 한다', async () => {
            // given
            const wrapper = mount(VsToast, {
                props: {
                    autoClose: false,
                    timeout: 1000,
                },
            });

            // when
            vi.advanceTimersByTime(2000);

            // then
            expect(wrapper.emitted('close')).toBeFalsy();
        });

        it('timeout이 0이면 close 이벤트가 emit되지 않아야 한다', async () => {
            // given
            const wrapper = mount(VsToast, {
                props: {
                    autoClose: true,
                    timeout: 0,
                },
            });

            // when
            vi.advanceTimersByTime(1000);

            // then
            expect(wrapper.emitted('close')).toBeFalsy();
        });

        it('timeout 기본값은 5000이어야 한다', () => {
            // given, when
            const wrapper = mount(VsToast, {
                props: {
                    autoClose: true,
                },
            });

            // then
            expect(wrapper.props('timeout')).toBe(5000);
        });

        it('custom timeout 값이 설정되면 해당 값으로 close 이벤트가 emit되어야 한다', async () => {
            // given
            const wrapper = mount(VsToast, {
                props: {
                    autoClose: true,
                    timeout: 2000,
                },
            });

            // when
            vi.advanceTimersByTime(1000);
            expect(wrapper.emitted('close')).toBeFalsy();

            vi.advanceTimersByTime(1000);

            // then
            expect(wrapper.emitted('close')).toBeTruthy();
            expect(wrapper.emitted('close')).toHaveLength(1);
        });
    });

    describe('mouseenter/mouseleave 기능', () => {
        it('mouseenter 시 holdToClose가 true가 되어야 한다', async () => {
            // given
            const wrapper = mount(VsToast, {
                props: {
                    autoClose: true,
                    timeout: 1000,
                },
            });

            // when
            await wrapper.find('.vs-toast').trigger('mouseenter');

            // then
            expect(wrapper.vm.holdToClose).toBe(true);
        });

        it('autoClose가 false일 때 mouseenter 시 holdToClose가 변경되지 않아야 한다', async () => {
            // given
            const wrapper = mount(VsToast, {
                props: {
                    autoClose: false,
                    timeout: 1000,
                },
            });

            // when
            await wrapper.find('.vs-toast').trigger('mouseenter');

            // then
            expect(wrapper.vm.holdToClose).toBe(false);
        });

        it('mouseenter 후 timeout이 지나도 close 이벤트가 emit되지 않아야 한다', async () => {
            // given
            const wrapper = mount(VsToast, {
                props: {
                    autoClose: true,
                    timeout: 1000,
                },
            });

            // when
            await wrapper.find('.vs-toast').trigger('mouseenter');
            vi.advanceTimersByTime(1000);

            // then
            expect(wrapper.emitted('close')).toBeFalsy();
            expect(wrapper.vm.holdToClose).toBe(true);
        });

        it('mouseleave 시 holdToClose가 false가 되어야 한다', async () => {
            // given
            const wrapper = mount(VsToast, {
                props: {
                    autoClose: true,
                    timeout: 1000,
                },
            });
            await wrapper.find('.vs-toast').trigger('mouseenter');
            expect(wrapper.vm.holdToClose).toBe(true);

            // when
            await wrapper.find('.vs-toast').trigger('mouseleave');

            // then
            expect(wrapper.vm.holdToClose).toBe(false);
        });

        it('timeout이 지난 후 mouseleave 시 close 이벤트가 즉시 emit되어야 한다', async () => {
            // given
            const wrapper = mount(VsToast, {
                props: {
                    autoClose: true,
                    timeout: 1000,
                },
            });

            // when
            await wrapper.find('.vs-toast').trigger('mouseenter');
            vi.advanceTimersByTime(1000);
            await wrapper.find('.vs-toast').trigger('mouseleave');

            // then
            expect(wrapper.emitted('close')).toBeTruthy();
            expect(wrapper.emitted('close')).toHaveLength(1);
            expect(wrapper.vm.holdToClose).toBe(false);
        });

        it('timeout 전에 mouseleave 시 close 이벤트가 emit되지 않아야 한다', async () => {
            // given
            const wrapper = mount(VsToast, {
                props: {
                    autoClose: true,
                    timeout: 1000,
                },
            });

            // when
            await wrapper.find('.vs-toast').trigger('mouseenter');
            vi.advanceTimersByTime(500);
            await wrapper.find('.vs-toast').trigger('mouseleave');

            // then
            expect(wrapper.emitted('close')).toBeFalsy();
            expect(wrapper.vm.holdToClose).toBe(false);
        });
    });
});
