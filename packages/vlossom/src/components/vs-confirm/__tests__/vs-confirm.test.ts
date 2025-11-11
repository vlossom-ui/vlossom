import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CONFIRM_OK, CONFIRM_CANCEL } from '@/declaration';
import VsConfirm from '@/components/vs-confirm/VsConfirm.vue';

const getLastOverlayIdMock = vi.fn();
const runMock = vi.fn();

vi.mock('@/stores', () => ({
    useOverlayCallbackStore: () => ({
        getLastOverlayId: getLastOverlayIdMock,
        run: runMock,
    }),
    useOptionsStore: () => ({
        colorScheme: ref({}),
    }),
}));

describe('VsConfirm', () => {
    describe('렌더링', () => {
        it('기본 ok/cancel 텍스트가 렌더링되어야 한다', () => {
            // when
            const wrapper = mount(VsConfirm);

            // then
            const buttons = wrapper.findAllComponents({ name: 'VsButton' });
            expect(buttons).toHaveLength(2);
            expect(buttons[0].text()).toBe('OK');
            expect(buttons[1].text()).toBe('Cancel');
        });

        it('swapButtons가 true이면 버튼 컨테이너에 vs-buttons-swapped 클래스가 적용되어야 한다', () => {
            // when
            const wrapper = mount(VsConfirm, {
                props: { swapButtons: true },
            });

            // then
            expect(wrapper.find('.vs-confirm-buttons').classes()).toContain('vs-buttons-swapped');
        });
    });

    describe('이벤트', () => {
        beforeEach(() => {
            vi.clearAllMocks();
            getLastOverlayIdMock.mockReturnValue('overlay-id');
            runMock.mockResolvedValue(undefined);
        });

        it('확인 버튼 클릭 시 overlay 콜백이 CONFIRM_OK 이벤트로 실행되어야 한다', async () => {
            // when
            const wrapper = mount(VsConfirm, {});
            const okButton = wrapper.findAll('button')[0];
            await okButton.trigger('click');

            // then
            expect(runMock).toHaveBeenCalledWith('overlay-id', CONFIRM_OK);
        });

        it('취소 버튼 클릭 시 overlay 콜백이 CONFIRM_CANCEL 이벤트로 실행되어야 한다', async () => {
            // when
            const wrapper = mount(VsConfirm);
            const cancelButton = wrapper.findAll('button')[1];
            await cancelButton.trigger('click');

            // then
            expect(runMock).toHaveBeenCalledWith('overlay-id', CONFIRM_CANCEL);
        });
    });
});
