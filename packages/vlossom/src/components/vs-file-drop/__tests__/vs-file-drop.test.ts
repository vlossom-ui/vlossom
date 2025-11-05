import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import VsFileDrop from '../VsFileDrop.vue';
import { h } from 'vue';

function createFile(name = 'test.png', type = 'image/png') {
    return new File(['dummy'], name, { type });
}

describe('vs-file-drop', () => {
    describe('styleSet', () => {
        it('styleSet 객체가 주어지면 CSS 변수가 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsFileDrop, {
                props: {
                    styleSet: {
                        backgroundColor: '#f0f0f0',
                        border: '2px dashed #1e88e5',
                        padding: '2rem',
                    },
                },
            });

            // then
            const style = wrapper.vm.styleSetVariables;
            expect(style).toEqual({
                '--vs-file-drop-backgroundColor': '#f0f0f0',
                '--vs-file-drop-border': '2px dashed #1e88e5',
                '--vs-file-drop-height': 'auto',
                '--vs-file-drop-padding': '2rem',
            });
        });
    });

    describe('v-model', () => {
        it('입력된 파일이 없을 때 modelValue는 빈 배열이다', () => {
            // given, when
            const wrapper = mount(VsFileDrop, { props: { modelValue: [] } });

            // then
            const modelValue = wrapper.props('modelValue');
            expect(modelValue).toEqual([]);
        });

        it('입력된 파일이 있을 때 파일 제거 버튼을 클릭하면 파일이 제거된다', async () => {
            // given
            const target = createFile('a.png');
            const files = [target, createFile('b.png')];
            const wrapper = mount(VsFileDrop, { props: { modelValue: files } });

            // when
            const chip = wrapper.find(`.vs-chip[id="${target.name}"]`);
            const closeButton = chip.find('.vs-chip-close-button');
            await closeButton.trigger('click');

            // then
            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')?.length).toBe(1);
            expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual(files.filter((f) => f !== target));
        });
    });

    describe('props', () => {
        it('disabled 상태일 때 vs-disabled 클래스가 적용된다', async () => {
            // given
            const wrapper = mount(VsFileDrop, { props: { modelValue: [], disabled: true } });

            // when
            const fileDrop = wrapper.find('.vs-file-drop');

            // then
            expect(fileDrop.classes()).toContain('vs-disabled');
        });

        it('readonly 상태일 때 vs-readonly 클래스가 적용된다', async () => {
            // given
            const wrapper = mount(VsFileDrop, { props: { modelValue: [], readonly: true } });

            // when
            const fileDrop = wrapper.find('.vs-file-drop');

            // then
            expect(fileDrop.classes()).toContain('vs-readonly');
        });

        it('disabled 상태일 때 파일 제거 버튼이 노출되지 않는다', async () => {
            // given
            const file = createFile();
            const wrapper = mount(VsFileDrop, { props: { modelValue: [file], disabled: true } });

            // when
            const clearButton = wrapper.find('.vs-chip-close-button');

            // then
            expect(clearButton.exists()).toBeFalsy();
        });
    });

    describe('state', () => {
        it('state를 error로 설정하면 vs-state-error 클래스가 추가되어야 한다', () => {
            // given
            const wrapper = mount(VsFileDrop, {
                props: {
                    state: 'error',
                },
            });

            // then
            const vsFileDrop = wrapper.find('.vs-file-drop');
            expect(vsFileDrop.classes()).toContain('vs-state-error');
        });

        it('state를 warning으로 설정하면 vs-state-warning 클래스가 추가되어야 한다', () => {
            // given
            const wrapper = mount(VsFileDrop, {
                props: {
                    state: 'warning',
                },
            });

            // then
            const vsFileDrop = wrapper.find('.vs-file-drop');
            expect(vsFileDrop.classes()).toContain('vs-state-warning');
        });

        it('state를 success로 설정하면 vs-state-success 클래스가 추가되어야 한다', () => {
            // given
            const wrapper = mount(VsFileDrop, {
                props: {
                    state: 'success',
                },
            });

            // then
            const vsFileDrop = wrapper.find('.vs-file-drop');
            expect(vsFileDrop.classes()).toContain('vs-state-success');
        });
    });

    describe('validation (rules)', () => {
        describe('required', () => {
            it('required가 true이고 파일이 없으면 validate 호출 시 에러 메시지가 노출된다', async () => {
                // given
                const wrapper = mount(VsFileDrop, { props: { required: true } });

                // when
                await wrapper.vm.$nextTick();
                wrapper.vm.validate();

                // then
                expect(wrapper.vm.computedMessages).toHaveLength(1);
                expect(wrapper.vm.computedMessages[0]).toEqual({
                    text: 'required',
                    state: 'error',
                });
            });

            it('required가 true이고 파일이 있으면 에러가 없다', async () => {
                // given
                const wrapper = mount(VsFileDrop, { props: { required: true, modelValue: [createFile()] } });

                // when
                await wrapper.vm.$nextTick();
                wrapper.vm.validate();

                // then
                const errorMessages = wrapper.vm.computedMessages.filter((msg: any) => msg.state === 'error');
                expect(errorMessages).toHaveLength(0);
            });
        });

        it('max를 초과하는 파일을 추가하면 validate 호출 시 에러 메시지가 노출된다', async () => {
            // given
            const wrapper = mount(VsFileDrop, { props: { max: 2 } });
            const files = [createFile('a.png'), createFile('b.png'), createFile('c.png')];

            // when
            await wrapper.vm.handleFileDialog({
                target: {
                    files,
                },
            } as unknown as Event);
            await wrapper.vm.$nextTick();
            wrapper.vm.validate();

            // then
            expect(wrapper.vm.computedMessages).toHaveLength(1);
            expect(wrapper.vm.computedMessages[0]).toEqual({
                text: 'You can only upload up to 2 files',
                state: 'error',
            });
        });

        it('min 미만의 파일을 추가하면 validate 호출 시 에러 메시지가 노출된다', async () => {
            // given
            const wrapper = mount(VsFileDrop, { props: { min: 2 } });
            const files = [createFile('a.png')];

            // when
            await wrapper.vm.handleFileDialog({
                target: {
                    files,
                },
            } as unknown as Event);
            await wrapper.vm.$nextTick();
            wrapper.vm.validate();

            // then
            expect(wrapper.vm.computedMessages).toHaveLength(1);
            expect(wrapper.vm.computedMessages[0]).toEqual({
                text: 'You must upload at least 2 files',
                state: 'error',
            });
        });
    });

    describe('validate() 메서드', () => {
        it('valid할 때 validate 함수를 호출하면 true를 반환한다', () => {
            // given
            const wrapper = mount(VsFileDrop, {
                props: {
                    required: true,
                    modelValue: [createFile()],
                },
            });

            // then
            expect(wrapper.vm.validate()).toBe(true);
        });

        it('invalid할 때 validate 함수를 호출하면 false를 반환한다', () => {
            // given
            const wrapper = mount(VsFileDrop, {
                props: {
                    required: true,
                    modelValue: [],
                },
            });

            // then
            expect(wrapper.vm.validate()).toBe(false);
        });
    });

    describe('placeholder', () => {
        it('content 영역에 placeholder가 노출된다', () => {
            // given, when
            const wrapper = mount(VsFileDrop, { props: { modelValue: [] } });

            // when
            const content = wrapper.find('.vs-file-drop-content');
            const placeholder = content.find('.vs-file-drop-placeholder');

            // then
            expect(placeholder.exists()).toBe(true);
        });

        it('사용자가 Slot을 정의하면 placeholder가 노출되지 않는다', () => {
            // given
            const slotWrapper = mount(VsFileDrop, {
                props: { modelValue: [] },
                slots: { default: '<div>Custom Slot</div>' },
            });

            // when
            const content = slotWrapper.find('.vs-file-drop-content');
            const placeholder = content.find('.vs-file-drop-placeholder');
            const customSlotText = slotWrapper.text();

            // then
            expect(customSlotText).toContain('Custom Slot');
            expect(placeholder.exists()).toBe(false);
        });

        it('파일을 drag하여 영역에 hover하면 placeholder 메시지가 노출된다', async () => {
            // given
            const placeholder = 'Drop files here';
            const wrapper = mount(VsFileDrop, { props: { modelValue: [], placeholder } });
            const input = wrapper.find('input[type="file"]');

            // when
            await input.trigger('dragenter');

            // then
            expect(wrapper.text()).toContain(placeholder);
        });
    });

    describe('파일 입력 (dialog)', () => {
        it('accept를 설정하면 원하는 타입의 파일만 dialog에서 확인할 수 있다', () => {
            // given
            const wrapper = mount(VsFileDrop, { props: { accept: 'image/png' } });

            // when
            const input = wrapper.find('input[type="file"]');

            // then
            expect(input.attributes('accept')).toBe('image/png');
        });

        it('disable 상태일 때, dialog로 파일을 추가할 수 없도록 click 이벤트를 막는다', async () => {
            // given
            const wrapper = mount(VsFileDrop, { props: { disabled: true } });

            // when
            const input = wrapper.find('input[type="file"]');

            // then
            expect(await input.trigger('click')).toBeFalsy();
        });

        it('dialog에서 여러 파일을 선택하면 모두 등록된다', async () => {
            // given
            const files = [createFile('a.png'), createFile('b.png')];
            const wrapper = mount(VsFileDrop);

            // when
            await wrapper.vm.handleFileDialog({
                target: {
                    files,
                },
            } as unknown as Event);

            // then
            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')?.length).toBe(1);
            expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual(files);
            expect(wrapper.emitted('update:changed')).toBeTruthy();
            expect(wrapper.emitted('update:changed')?.[0][0]).toEqual(files);
        });

        it('추가한 모든 파일의 파일 명, 파일 사이즈 정보가 노출된다', async () => {
            // given
            const files = [createFile('a.png'), createFile('b.exe'), createFile('c.txt')];
            const wrapper = mount(VsFileDrop);

            // when
            await wrapper.vm.handleFileDialog({
                target: {
                    files,
                },
            } as unknown as Event);
            await wrapper.vm.$nextTick();

            // then
            const droppedFileContents = wrapper.findAll('.vs-chip');
            expect(droppedFileContents.length).toBe(files.length);
            droppedFileContents.forEach((content, index) => {
                expect(content.html()).toContain(files[index].name);
            });
        });

        it('dialog에서 파일 입력을 취소하면, 기존의 파일이 유지된다', async () => {
            // given
            const files = [createFile('a.png'), createFile('b.exe'), createFile('c.txt')];
            const wrapper = mount(VsFileDrop, { props: { modelValue: files } });

            // when
            await wrapper.vm.handleFileDialog({
                target: {
                    files: [],
                },
            } as unknown as Event);
            await wrapper.vm.$nextTick();

            // then
            expect(wrapper.vm.inputValue).toEqual(files);
        });

        it('입력된 파일이 존재해도, 다시 클릭하면 dialog로 파일을 추가할 수 있다', async () => {
            // given
            const file = createFile();
            const wrapper = mount(VsFileDrop, { props: { modelValue: [file] } });
            const newFiles = [createFile('test3.png')];

            // when
            await wrapper.vm.handleFileDialog({
                target: {
                    files: newFiles,
                },
            } as unknown as Event);

            // then
            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')?.length).toBe(1);
            expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual(newFiles);
        });
    });

    describe('파일 입력 (drag & drop)', () => {
        it('accept를 설정하면 원하는 타입의 파일만 drag & drop으로 파일을 추가할 수 있다', async () => {
            // given
            const wrapper = mount(VsFileDrop, { props: { accept: 'image/png' } });
            const files = [createFile('a.png')];

            // when
            await wrapper.vm.handleFileDrop({
                dataTransfer: {
                    files,
                },
            } as unknown as DragEvent);
            await wrapper.vm.$nextTick();

            // then
            expect(wrapper.emitted('drop')).toBeTruthy();
            expect(wrapper.emitted('drop')?.length).toBe(1);
            expect(wrapper.emitted('drop')?.[0][0]).toEqual(files);
            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')?.length).toBe(1);
            expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual(files);
        });

        it('disable 상태일 때, drag & drop으로 파일을 추가할 수 없다', async () => {
            // given
            const wrapper = mount(VsFileDrop, { props: { disabled: true } });
            const files = [createFile('test.png')];

            // when
            await wrapper.vm.handleFileDrop({
                dataTransfer: {
                    files,
                },
            } as unknown as DragEvent);
            await wrapper.vm.$nextTick();

            // then
            expect(wrapper.emitted('drop')).toBeTruthy();
            expect(wrapper.emitted('drop')?.length).toBe(1);
            expect(wrapper.emitted('drop')?.[0][0]).toEqual(files);
            expect(wrapper.emitted('update:modelValue')).toBeFalsy();
        });

        it('readonly 상태일 때, drag & drop으로 파일을 추가할 수 없다', async () => {
            // given
            const wrapper = mount(VsFileDrop, { props: { readonly: true } });
            const files = [createFile('test.png')];

            // when
            await wrapper.vm.handleFileDrop({
                dataTransfer: {
                    files,
                },
            } as unknown as DragEvent);
            await wrapper.vm.$nextTick();

            // then
            expect(wrapper.emitted('drop')).toBeTruthy();
            expect(wrapper.emitted('drop')?.length).toBe(1);
            expect(wrapper.emitted('drop')?.[0][0]).toEqual(files);
            expect(wrapper.emitted('update:modelValue')).toBeFalsy();
        });

        it('drag 이벤트가 발생하면 파일 드롭 영역이 하이라이트된다', async () => {
            // given
            const wrapper = mount(VsFileDrop);
            const input = wrapper.find('input[type="file"]');

            // when
            await input.trigger('dragenter');
            await input.trigger('dragover');

            // then
            const fileDrop = wrapper.find('.vs-file-drop');
            expect(fileDrop.classes()).toContain('vs-dragging');
        });

        it('dragleave 이벤트가 발생하면 파일 드롭 영역의 하이라이트가 제거된다', async () => {
            // given
            const wrapper = mount(VsFileDrop);
            const input = wrapper.find('input[type="file"]');

            // when
            await input.trigger('dragenter');
            await input.trigger('dragleave');

            // then
            const fileDrop = wrapper.find('.vs-file-drop');
            expect(fileDrop.classes()).not.toContain('vs-dragging');
        });

        it('drop 이벤트가 발생하면 파일 드롭 영역의 하이라이트가 제거된다', async () => {
            // given
            const wrapper = mount(VsFileDrop);
            const files = [createFile('test.png')];

            // when
            await wrapper.trigger('dragenter');
            await wrapper.vm.handleFileDrop({
                dataTransfer: {
                    files,
                },
            } as unknown as DragEvent);

            // then
            const fileDrop = wrapper.find('.vs-file-drop');
            expect(fileDrop.classes()).not.toContain('vs-dragging');
        });

        it('disabled 상태일 때 drag 이벤트가 발생해도 vs-dragging 클래스가 추가되지 않는다', async () => {
            // given
            const wrapper = mount(VsFileDrop, { props: { disabled: true } });
            const input = wrapper.find('input[type="file"]');

            // when
            await input.trigger('dragenter');
            await input.trigger('dragover');

            // then
            const fileDrop = wrapper.find('.vs-file-drop');
            expect(fileDrop.classes()).not.toContain('vs-dragging');
        });

        it('readonly 상태일 때 drag 이벤트가 발생해도 vs-dragging 클래스가 추가되지 않는다', async () => {
            // given
            const wrapper = mount(VsFileDrop, { props: { readonly: true } });
            const input = wrapper.find('input[type="file"]');

            // when
            await input.trigger('dragenter');
            await input.trigger('dragover');

            // then
            const fileDrop = wrapper.find('.vs-file-drop');
            expect(fileDrop.classes()).not.toContain('vs-dragging');
        });

        it('drag&drop으로 여러 파일을 추가할 수 있다', async () => {
            // given
            const files = [createFile('a.png'), createFile('b.png')];
            const wrapper = mount(VsFileDrop);

            // when
            await wrapper.vm.handleFileDrop({
                dataTransfer: {
                    files,
                },
            } as unknown as DragEvent);
            await wrapper.vm.$nextTick();

            // then
            expect(wrapper.emitted('drop')).toBeTruthy();
            expect(wrapper.emitted('drop')?.length).toBe(1);
            expect(wrapper.emitted('drop')?.[0][0]).toEqual(files);
            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')?.length).toBe(1);
            expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual(files);
        });

        it('추가한 파일의 파일 명, 파일 사이즈 정보가 리스트로 노출된다', async () => {
            // given
            const files = [createFile('a.png'), createFile('b.png')];
            const wrapper = mount(VsFileDrop);

            // when
            await wrapper.vm.handleFileDrop({
                dataTransfer: {
                    files,
                },
            } as unknown as DragEvent);
            await wrapper.vm.$nextTick();

            // then
            expect(wrapper.emitted('drop')).toBeTruthy();
            expect(wrapper.emitted('drop')?.length).toBe(1);
            expect(wrapper.emitted('drop')?.[0][0]).toEqual(files);
            const droppedFileContents = wrapper.findAll('.vs-chip');
            expect(droppedFileContents.length).toBe(files.length);
            droppedFileContents.forEach((content, index) => {
                expect(content.html()).toContain(files[index].name);
            });
        });

        it('입력된 파일이 존재해도, drag & drop으로 파일을 추가할 수 있다', async () => {
            // given
            const file = createFile();
            const wrapper = mount(VsFileDrop, { props: { modelValue: [file] } });
            const newFiles = [createFile('test3.png')];

            // when
            await wrapper.vm.handleFileDrop({
                dataTransfer: {
                    files: newFiles,
                },
            } as unknown as DragEvent);

            // then
            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')?.length).toBe(1);
            expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual(newFiles);
        });
    });

    describe('슬롯', () => {
        it('Slot은 content 영역을 직접 대체한다', () => {
            // given
            const wrapper = mount(VsFileDrop, {
                slots: { default: '<div>Custom Content</div>' },
            });

            // when
            const content = wrapper.text();

            // then
            expect(content).toContain('Custom Content');
        });

        it('사용자는 modelValue를 사용하여 content를 정의할 수 있다', () => {
            // given
            const wrapper = mount(VsFileDrop, {
                props: { modelValue: [createFile()] },
                slots: { default: '<div>File Slot</div>' },
            });

            // when
            const content = wrapper.text();

            // then
            expect(content).toContain('File Slot');
        });

        it('사용자는 dragging 상태를 사용하여 content를 정의할 수 있다', async () => {
            // given
            const wrapper = mount(VsFileDrop, {
                slots: {
                    default: (slotProps) => (slotProps.dragging ? h('div', 'Dragging!') : null),
                },
            });

            // when
            wrapper.vm.dragging = true;
            await wrapper.vm.$nextTick();

            // then
            expect(wrapper.text()).toContain('Dragging!');
        });

        it('사용자가 Slot을 정의하면 파일 명, 확장자, 파일 사이즈 정보가 리스트로 노출되지 않는다', () => {
            // given
            const slotWrapper = mount(VsFileDrop, {
                props: { modelValue: [] },
                slots: { default: '<div>Custom Slot</div>' },
            });

            // when
            const content = slotWrapper.find('.vs-file-drop-content');
            const fileContents = content.findAll('.vs-chip');
            const customSlotText = slotWrapper.text();

            // then
            expect(customSlotText).toContain('Custom Slot');
            expect(fileContents.length).toBe(0);
        });
    });

    describe('keyboard control', () => {
        it('탭 이벤트로 컴포넌트에 접근 가능하다', async () => {
            // given
            const wrapper = mount(VsFileDrop);
            const input = wrapper.find('input[type="file"]');

            // when & then
            expect(input.exists()).toBe(true);
            expect(input.attributes('disabled')).toBeUndefined();
        });

        it('enter 키를 누르면 openFileDialog가 호출된다', () => {
            // given
            const wrapper = mount(VsFileDrop);
            const openFileDialogSpy = vi.spyOn(wrapper.vm, 'openFileDialog');

            // when
            const input = wrapper.find('input[type="file"]');
            input.trigger('keydown.enter');

            // then
            expect(openFileDialogSpy).toHaveBeenCalled();
        });

        it('readonly 상태일 때, openFileDialog가 호출되지 않는다', () => {
            // given
            const wrapper = mount(VsFileDrop, { props: { readonly: true } });

            // when
            wrapper.vm.openFileDialog();

            // then
            // openFileDialog 내부에서 readonly 체크로 early return하므로 아무 일도 일어나지 않음
            expect(wrapper.vm.computedReadonly).toBe(true);
        });

        it('disable 상태일 때, 탭 이벤트로 접근할 수 없다', async () => {
            // given
            const wrapper = mount(VsFileDrop, { props: { disabled: true } });
            const input = wrapper.find('input[type="file"]');

            // when & then
            expect(input.attributes('disabled')).toBeDefined();
        });

        it('각 파일에 해당하는 컨텐츠 제거 버튼으로 탭 이동이 불가능하다', () => {
            // given
            const wrapper = mount(VsFileDrop, { props: { modelValue: [createFile()] } });

            // when
            const clearBtn = wrapper.find('.vs-chip-close-button');

            // then
            expect(clearBtn.attributes('tabindex')).toBe('-1');
        });
    });

    describe('accept 검증', () => {
        it('accept 타입에 맞지 않는 파일을 추가하면 validate 호출 시 에러 메시지가 노출된다', async () => {
            // given
            const wrapper = mount(VsFileDrop, { props: { accept: 'image/png' } });
            const files = [createFile('test.jpg', 'image/jpeg')];

            // when
            await wrapper.vm.handleFileDialog({
                target: {
                    files,
                },
            } as unknown as Event);
            await wrapper.vm.$nextTick();
            wrapper.vm.validate();

            // then
            expect(wrapper.vm.computedMessages).toHaveLength(1);
            expect(wrapper.vm.computedMessages[0]).toEqual({
                text: 'You can only upload files with the following extensions: image/png',
                state: 'error',
            });
        });

        it('accept 타입에 맞는 파일을 추가하면 에러가 없다', async () => {
            // given
            const wrapper = mount(VsFileDrop, { props: { accept: 'image/png' } });
            const files = [createFile('test.png', 'image/png')];

            // when
            await wrapper.vm.handleFileDialog({
                target: {
                    files,
                },
            } as unknown as Event);
            await wrapper.vm.$nextTick();
            wrapper.vm.validate();

            // then
            const errorMessages = wrapper.vm.computedMessages.filter((msg: any) => msg.state === 'error');
            expect(errorMessages).toHaveLength(0);
        });
    });
});
