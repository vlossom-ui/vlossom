import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import VsLayout from './../VsLayout.vue';
import { LayoutStore } from '@/stores';

// LayoutStore 모킹
vi.mock('@/stores', () => ({
    LayoutStore: {
        getDefaultLayout: vi.fn(),
    },
}));

describe('VsLayout', () => {
    let mockLayoutStore: LayoutStore;

    beforeEach(() => {
        // 각 테스트마다 새로운 mock LayoutStore 인스턴스 생성
        mockLayoutStore = {
            drawers: {
                value: {
                    left: { isOpen: false, placement: 'left', size: '250px', responsive: false },
                    top: { isOpen: false, placement: 'top', size: '60px', responsive: false },
                    right: { isOpen: false, placement: 'right', size: '250px', responsive: false },
                    bottom: { isOpen: false, placement: 'bottom', size: '60px', responsive: false },
                },
            },
        } as unknown as LayoutStore;

        vi.mocked(LayoutStore.getDefaultLayout).mockReturnValue(mockLayoutStore);
    });

    describe('LayoutStore 제공', () => {
        it('LAYOUT_STORE_KEY로 LayoutStore 인스턴스를 제공해야 한다', () => {
            // given, when
            const wrapper = mount(VsLayout);

            // then
            expect(LayoutStore.getDefaultLayout).toHaveBeenCalled();
            expect(wrapper.vm).toBeDefined();
        });

        it('각 컴포넌트 인스턴스마다 새로운 LayoutStore가 생성되어야 한다', () => {
            // given, when
            mount(VsLayout);
            mount(VsLayout);

            // then
            expect(LayoutStore.getDefaultLayout).toHaveBeenCalledTimes(2);
        });
    });

    describe('drawer responsive 속성', () => {
        it('모든 drawer가 responsive가 false일 때 기본 스타일이 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsLayout);

            // then
            const layout = wrapper.find('.vs-layout');
            expect(layout.attributes('style')).toBeUndefined();
        });

        it('responsive가 true인 drawer가 열려있을 때 해당하는 padding이 적용되어야 한다', () => {
            // given
            mockLayoutStore.drawers.value = {
                left: { isOpen: true, placement: 'left', size: '250px', responsive: true },
                top: { isOpen: false, placement: 'top', size: '60px', responsive: false },
                right: { isOpen: true, placement: 'right', size: '250px', responsive: true },
                bottom: { isOpen: false, placement: 'bottom', size: '60px', responsive: false },
            };

            // when
            const wrapper = mount(VsLayout);

            // then
            const layout = wrapper.find('.vs-layout');
            const style = layout.attributes('style');
            expect(style).toContain('padding-left: 250px');
            expect(style).toContain('padding-right: 250px');
            expect(style).not.toContain('padding-top');
            expect(style).not.toContain('padding-bottom');
        });

        it('모든 drawer가 responsive가 true이고 열려있을 때 모든 padding이 적용되어야 한다', () => {
            // given
            mockLayoutStore.drawers.value = {
                left: { isOpen: true, placement: 'left', size: '250px', responsive: true },
                top: { isOpen: true, placement: 'top', size: '60px', responsive: true },
                right: { isOpen: true, placement: 'right', size: '250px', responsive: true },
                bottom: { isOpen: true, placement: 'bottom', size: '60px', responsive: true },
            };

            // when
            const wrapper = mount(VsLayout);

            // then
            const layout = wrapper.find('.vs-layout');
            const style = layout.attributes('style');
            // CSS는 padding 단축 속성을 사용하여 렌더링합니다
            expect(style).toContain('padding: 60px 250px 60px 250px');
        });

        it('모든 drawer가 닫혀있거나 responsive가 false일 때 padding이 적용되지 않아야 한다', () => {
            // given
            mockLayoutStore.drawers.value = {
                left: { isOpen: false, placement: 'left', size: '250px', responsive: false },
                top: { isOpen: false, placement: 'top', size: '60px', responsive: false },
                right: { isOpen: false, placement: 'right', size: '250px', responsive: false },
                bottom: { isOpen: false, placement: 'bottom', size: '60px', responsive: false },
            };

            // when
            const wrapper = mount(VsLayout);

            // then
            const layout = wrapper.find('.vs-layout');
            const style = layout.attributes('style');
            expect(style).toBeUndefined();
        });

        it('일부 drawer만 responsive가 true이고 열려있을 때 해당하는 padding만 적용되어야 한다', () => {
            // given
            mockLayoutStore.drawers.value = {
                left: { isOpen: true, placement: 'left', size: '300px', responsive: true },
                top: { isOpen: false, placement: 'top', size: '80px', responsive: false },
                right: { isOpen: false, placement: 'right', size: '300px', responsive: false },
                bottom: { isOpen: true, placement: 'bottom', size: '80px', responsive: true },
            };

            // when
            const wrapper = mount(VsLayout);

            // then
            const layout = wrapper.find('.vs-layout');
            const style = layout.attributes('style');
            expect(style).toContain('padding-left: 300px');
            expect(style).toContain('padding-bottom: 80px');
            expect(style).not.toContain('padding-top');
            expect(style).not.toContain('padding-right');
        });

        it('drawer size가 빈 문자열일 때 padding이 적용되지 않아야 한다', () => {
            // given
            mockLayoutStore.drawers.value = {
                left: { isOpen: true, placement: 'left', size: '', responsive: true },
                top: { isOpen: true, placement: 'top', size: '', responsive: true },
                right: { isOpen: true, placement: 'right', size: '', responsive: true },
                bottom: { isOpen: true, placement: 'bottom', size: '', responsive: true },
            };

            // when
            const wrapper = mount(VsLayout);

            // then
            const layout = wrapper.find('.vs-layout');
            const style = layout.attributes('style');
            expect(style).toBeUndefined();
        });

        it('drawer가 열려있어도 responsive가 false이면 padding이 적용되지 않아야 한다', () => {
            // given
            mockLayoutStore.drawers.value = {
                left: { isOpen: true, placement: 'left', size: '250px', responsive: false },
                top: { isOpen: true, placement: 'top', size: '60px', responsive: false },
                right: { isOpen: true, placement: 'right', size: '250px', responsive: false },
                bottom: { isOpen: true, placement: 'bottom', size: '60px', responsive: false },
            };

            // when
            const wrapper = mount(VsLayout);

            // then
            const layout = wrapper.find('.vs-layout');
            const style = layout.attributes('style');
            expect(style).toBeUndefined();
        });
    });
});
