import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import VsLayout from './../VsLayout.vue';
import { LayoutStore } from '@/stores';

describe('VsLayout', () => {
    let layoutStore: LayoutStore;

    beforeEach(() => {
        layoutStore = new LayoutStore();

        vi.spyOn(LayoutStore, 'getDefaultLayoutStore').mockImplementation(() => layoutStore);
    });

    describe('LayoutStore 제공', () => {
        it('LAYOUT_STORE_KEY로 LayoutStore 인스턴스를 제공해야 한다', () => {
            // given, when
            const wrapper = mount(VsLayout);

            // then
            expect(wrapper.vm).toBeDefined();
        });
    });

    describe('drawer responsive 속성', () => {
        it('모든 drawer가 responsive가 false일 때 기본 스타일이 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsLayout);

            // then
            const layout = wrapper.find('.vs-layout');
            expect(layout.attributes('style')).toBeUndefined();
            expect(wrapper.vm.layoutStyle).toEqual({});
        });

        it('responsive가 true인 drawer가 열려있을 때 해당하는 padding이 적용되어야 한다', () => {
            // given
            layoutStore.drawers = {
                left: { isOpen: true, placement: 'left', size: '250px', responsive: true },
                top: { isOpen: false, placement: 'top', size: '60px', responsive: false },
                right: { isOpen: true, placement: 'right', size: '250px', responsive: true },
                bottom: { isOpen: false, placement: 'bottom', size: '60px', responsive: false },
            };

            // when
            const wrapper = mount(VsLayout);

            // then
            expect(wrapper.vm.layoutStyle).toEqual({
                paddingLeft: '250px',
                paddingRight: '250px',
            });
        });

        it('모든 drawer가 responsive가 true이고 열려있을 때 모든 padding이 적용되어야 한다', () => {
            // given
            layoutStore.drawers = {
                left: { isOpen: true, placement: 'left', size: '250px', responsive: true },
                top: { isOpen: true, placement: 'top', size: '60px', responsive: true },
                right: { isOpen: true, placement: 'right', size: '250px', responsive: true },
                bottom: { isOpen: true, placement: 'bottom', size: '60px', responsive: true },
            };

            // when
            const wrapper = mount(VsLayout);

            // then
            expect(wrapper.vm.layoutStyle).toEqual({
                paddingLeft: '250px',
                paddingRight: '250px',
                paddingTop: '60px',
                paddingBottom: '60px',
            });
        });

        it('모든 drawer가 닫혀있거나 responsive가 false일 때 padding이 적용되지 않아야 한다', () => {
            // given
            layoutStore.drawers = {
                left: { isOpen: false, placement: 'left', size: '250px', responsive: false },
                top: { isOpen: false, placement: 'top', size: '60px', responsive: false },
                right: { isOpen: false, placement: 'right', size: '250px', responsive: false },
                bottom: { isOpen: false, placement: 'bottom', size: '60px', responsive: false },
            };

            // when
            const wrapper = mount(VsLayout);

            // then
            expect(wrapper.vm.layoutStyle).toEqual({});
        });

        it('일부 drawer만 responsive가 true이고 열려있을 때 해당하는 padding만 적용되어야 한다', () => {
            // given
            layoutStore.drawers = {
                left: { isOpen: true, placement: 'left', size: '300px', responsive: true },
                top: { isOpen: false, placement: 'top', size: '80px', responsive: false },
                right: { isOpen: false, placement: 'right', size: '300px', responsive: false },
                bottom: { isOpen: true, placement: 'bottom', size: '80px', responsive: true },
            };

            // when
            const wrapper = mount(VsLayout);

            // then
            expect(wrapper.vm.layoutStyle).toEqual({
                paddingLeft: '300px',
                paddingBottom: '80px',
            });
        });

        it('drawer size가 빈 문자열일 때 padding이 적용되지 않아야 한다', () => {
            // given
            layoutStore.drawers = {
                left: { isOpen: true, placement: 'left', size: '', responsive: true },
                top: { isOpen: true, placement: 'top', size: '', responsive: true },
                right: { isOpen: true, placement: 'right', size: '', responsive: true },
                bottom: { isOpen: true, placement: 'bottom', size: '', responsive: true },
            };

            // when
            const wrapper = mount(VsLayout);

            // then
            expect(wrapper.vm.layoutStyle).toEqual({});
        });

        it('drawer가 열려있어도 responsive가 false이면 padding이 적용되지 않아야 한다', () => {
            // given
            layoutStore.drawers = {
                left: { isOpen: true, placement: 'left', size: '250px', responsive: false },
                top: { isOpen: true, placement: 'top', size: '60px', responsive: false },
                right: { isOpen: true, placement: 'right', size: '250px', responsive: false },
                bottom: { isOpen: true, placement: 'bottom', size: '60px', responsive: false },
            };

            // when
            const wrapper = mount(VsLayout);

            // then
            expect(wrapper.vm.layoutStyle).toEqual({});
        });
    });
});
