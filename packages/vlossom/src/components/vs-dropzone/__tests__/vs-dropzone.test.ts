import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VsDropzone from './../VsDropzone.vue';

function createFile(name: string) {
    return new File(['content'], name, { type: 'text/plain' });
}

function fileDragOptions(files: File[] = []) {
    return { dataTransfer: { types: ['Files'], files, dropEffect: 'none' } };
}

function textDragOptions() {
    return { dataTransfer: { types: ['text/plain'], files: [], dropEffect: 'none' } };
}

describe('vs-dropzone', () => {
    describe('렌더링', () => {
        it('default 슬롯을 렌더링하고, 드래그 전에는 오버레이를 렌더링하지 않는다', () => {
            // given, when
            const wrapper = mount(VsDropzone, {
                slots: { default: '<div class="content">content</div>' },
            });

            // then
            expect(wrapper.find('.content').exists()).toBe(true);
            expect(wrapper.find('.vs-dropzone-overlay').exists()).toBe(false);
        });
    });

    describe('드래그 상태', () => {
        it('파일을 드래그해 들어오면 오버레이와 overlay 슬롯을 표시한다', async () => {
            // given
            const wrapper = mount(VsDropzone, {
                slots: { overlay: '<span class="overlay-content">drop here</span>' },
            });

            // when
            await wrapper.trigger('dragenter', fileDragOptions());

            // then
            expect(wrapper.classes()).toContain('vs-dragging');
            expect(wrapper.find('.vs-dropzone-overlay').exists()).toBe(true);
            expect(wrapper.find('.overlay-content').exists()).toBe(true);
            expect(wrapper.emitted('change-dragging')?.[0]).toEqual([true]);
        });

        it('파일이 아닌 드래그에는 반응하지 않는다', async () => {
            // given
            const wrapper = mount(VsDropzone);

            // when
            await wrapper.trigger('dragenter', textDragOptions());

            // then
            expect(wrapper.classes()).not.toContain('vs-dragging');
            expect(wrapper.emitted('change-dragging')).toBeFalsy();
        });

        it('자식 요소 사이를 이동해도 영역을 벗어나기 전까지 드래그 상태를 유지한다', async () => {
            // given
            const wrapper = mount(VsDropzone, {
                slots: { default: '<div class="child">child</div>' },
            });
            const child = wrapper.find('.child');

            // when
            await wrapper.trigger('dragenter', fileDragOptions());
            await child.trigger('dragenter', fileDragOptions());
            await wrapper.trigger('dragleave', fileDragOptions());

            // then
            expect(wrapper.classes()).toContain('vs-dragging');

            // when
            await child.trigger('dragleave', fileDragOptions());

            // then
            expect(wrapper.classes()).not.toContain('vs-dragging');
            expect(wrapper.emitted('change-dragging')).toEqual([[true], [false]]);
        });

        it('noOverlay가 true이면 드래그 중에도 오버레이를 렌더링하지 않고 default 슬롯에 dragging을 전달한다', async () => {
            // given
            const wrapper = mount(VsDropzone, {
                props: { noOverlay: true },
                slots: {
                    default: '<template #default="{ dragging }"><span class="state">{{ dragging }}</span></template>',
                },
            });

            // when
            await wrapper.trigger('dragenter', fileDragOptions());

            // then
            expect(wrapper.find('.vs-dropzone-overlay').exists()).toBe(false);
            expect(wrapper.find('.state').text()).toBe('true');
        });
    });

    describe('드롭', () => {
        it('파일을 드롭하면 파일 목록과 이벤트를 담아 drop을 emit하고 드래그 상태를 해제한다', async () => {
            // given
            const wrapper = mount(VsDropzone);
            const files = [createFile('a.txt'), createFile('b.txt')];

            // when
            await wrapper.trigger('dragenter', fileDragOptions(files));
            await wrapper.trigger('drop', fileDragOptions(files));

            // then
            const dropEvent = wrapper.emitted('drop')?.[0];
            expect(dropEvent?.[0]).toEqual(files);
            expect(dropEvent?.[1]).toBeInstanceOf(Event);
            expect(wrapper.classes()).not.toContain('vs-dragging');
        });

        it('드롭 이벤트의 기본 동작을 막는다', async () => {
            // given
            const wrapper = mount(VsDropzone);
            const event = new Event('drop', { cancelable: true });
            Object.assign(event, fileDragOptions([createFile('a.txt')]));

            // when
            wrapper.element.dispatchEvent(event);

            // then
            expect(event.defaultPrevented).toBe(true);
        });

        it('중첩된 경우 가장 안쪽 dropzone만 drop을 emit한다', async () => {
            // given
            const wrapper = mount({
                components: { VsDropzone },
                template: `
                    <vs-dropzone class="outer">
                        <vs-dropzone class="inner"><div class="target" /></vs-dropzone>
                    </vs-dropzone>
                `,
            });
            const [outer, inner] = wrapper.findAllComponents(VsDropzone);

            // when
            await wrapper.find('.target').trigger('drop', fileDragOptions([createFile('a.txt')]));

            // then
            expect(inner.emitted('drop')).toBeTruthy();
            expect(outer.emitted('drop')).toBeFalsy();
        });
    });

    describe('disabled', () => {
        it('disabled 상태이면 드래그 상태가 되지 않고 drop을 emit하지 않지만 기본 동작은 막는다', async () => {
            // given
            const wrapper = mount(VsDropzone, { props: { disabled: true } });
            const event = new Event('drop', { cancelable: true });
            Object.assign(event, fileDragOptions([createFile('a.txt')]));

            // when
            await wrapper.trigger('dragenter', fileDragOptions());
            wrapper.element.dispatchEvent(event);

            // then
            expect(wrapper.classes()).not.toContain('vs-dragging');
            expect(wrapper.emitted('drop')).toBeFalsy();
            expect(event.defaultPrevented).toBe(true);
        });

        it('disabled 상태에서도 dragover에서 드롭을 거부하지 않아 브라우저가 파일을 직접 열지 않게 한다', () => {
            // given
            const wrapper = mount(VsDropzone, { props: { disabled: true } });
            const event = new Event('dragover', { cancelable: true });
            Object.assign(event, fileDragOptions());

            // when
            wrapper.element.dispatchEvent(event);

            // then
            expect(event.defaultPrevented).toBe(true);
            expect((event as DragEvent).dataTransfer?.dropEffect).not.toBe('none');
        });

        it('드래그 중 disabled가 되면 드래그 상태를 해제한다', async () => {
            // given
            const wrapper = mount(VsDropzone);
            await wrapper.trigger('dragenter', fileDragOptions());

            // when
            await wrapper.setProps({ disabled: true });

            // then
            expect(wrapper.classes()).not.toContain('vs-dragging');
            expect(wrapper.emitted('change-dragging')).toEqual([[true], [false]]);
        });
    });
});
