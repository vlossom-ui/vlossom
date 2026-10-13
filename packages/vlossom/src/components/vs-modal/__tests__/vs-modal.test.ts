import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, KeepAlive, nextTick, ref } from 'vue';
import { createVlossom, useVlossom } from '@/framework';
import { useModalContainerStore } from '@/stores';
import VsModal from './../VsModal.vue';

describe('VsModal', () => {
    const modalStore = useModalContainerStore();

    beforeEach(() => {
        createVlossom({ components: {} });
    });

    afterEach(() => {
        useVlossom().modal.clear();
    });

    it('modelValue가 처음부터 true이면 마운트 시 모달이 열려야 한다', () => {
        // given, when
        const wrapper = mount(VsModal, { props: { modelValue: true } });

        // then
        expect(modalStore.get('body')).toHaveLength(1);
        expect(wrapper.emitted('open')).toHaveLength(1);
    });

    it('열린 상태로 언마운트되면 모달이 스토어에서 제거되어야 한다', async () => {
        // given
        const wrapper = mount(VsModal, { props: { modelValue: false } });
        await wrapper.setProps({ modelValue: true });
        expect(modalStore.get('body')).toHaveLength(1);

        // when
        wrapper.unmount();

        // then
        expect(modalStore.get('body')).toHaveLength(0);
    });

    it('beforeClose가 false를 반환해도 언마운트 시에는 모달이 제거되어야 한다', () => {
        // given
        const wrapper = mount(VsModal, { props: { modelValue: true, beforeClose: () => false } });

        // when
        wrapper.unmount();

        // then
        expect(modalStore.get('body')).toHaveLength(0);
    });

    it('KeepAlive에서 비활성화되면 모달이 제거되고, 다시 활성화되면 열려야 한다', async () => {
        // given
        const show = ref(true);
        const isOpen = ref(true);
        const Child = defineComponent({
            name: 'Child',
            setup() {
                return () =>
                    h(VsModal, {
                        modelValue: isOpen.value,
                        'onUpdate:modelValue': (v: boolean) => (isOpen.value = v),
                    });
            },
        });
        mount(
            defineComponent({
                setup() {
                    return () => h(KeepAlive, null, [show.value ? h(Child) : h('div')]);
                },
            }),
        );
        expect(modalStore.get('body')).toHaveLength(1);

        // when
        show.value = false;
        await nextTick();

        // then
        expect(modalStore.get('body')).toHaveLength(0);
        expect(isOpen.value).toBe(true);

        // when
        show.value = true;
        await nextTick();

        // then
        expect(modalStore.get('body')).toHaveLength(1);
    });
});
