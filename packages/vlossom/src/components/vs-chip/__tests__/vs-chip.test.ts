import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VsChip from './../VsChip.vue';

describe('VsChip', () => {
    describe('props', () => {
        it('closable prop이 true이면 close 버튼이 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsChip, {
                props: {
                    closable: true,
                },
            });

            // then
            const closeButton = wrapper.find('.vs-chip-close-button');
            expect(closeButton.exists()).toBe(true);
        });

        it('size prop이 주어지면 해당 size 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsChip, {
                props: {
                    size: 'xs',
                },
            });

            // then
            expect(wrapper.vm.classObj['vs-xs']).toBe(true);
        });

        it('primary prop이 true이면 vs-primary 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsChip, {
                props: {
                    primary: true,
                },
            });

            // then
            expect(wrapper.vm.classObj['vs-primary']).toBe(true);
        });
    });

    describe('events', () => {
        it('close 버튼을 클릭하면 close 이벤트가 발생해야 한다', async () => {
            // given
            const wrapper = mount(VsChip, {
                props: {
                    closable: true,
                },
            });

            // when
            const closeButton = wrapper.find('.vs-chip-close-button');
            await closeButton.trigger('click');

            // then
            expect(wrapper.emitted('close')).toBeTruthy();
            expect(wrapper.emitted('close')).toHaveLength(1);
        });
    });
});
