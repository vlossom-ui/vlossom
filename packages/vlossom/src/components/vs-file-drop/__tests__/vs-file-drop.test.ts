import { describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
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

        it('width prop이 주어지면 CSS 변수에 포함된다', () => {
            // given, when
            const wrapper = mount(VsFileDrop, {
                props: {
                    width: '500px',
                },
            });

            // then
            const style = wrapper.vm.styleSetVariables;
            expect(style['--vs-file-drop-width']).toBe('500px');
        });

        it('height prop이 주어지면 CSS 변수에 포함된다', () => {
            // given, when
            const wrapper = mount(VsFileDrop, {
                props: {
                    height: '300px',
                },
            });

            // then
            const style = wrapper.vm.styleSetVariables;
            expect(style['--vs-file-drop-height']).toBe('300px');
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

        it('입력된 파일이 있을 때 clear 버튼을 클릭하면 모든 파일이 제거된다', async () => {
            // given
            const files = [createFile('a.png'), createFile('b.png')];
            const wrapper = mount(VsFileDrop, { props: { modelValue: files } });
            await flushPromises();

            // when
            const clearButton = wrapper.find('.vs-file-drop-close-button');
            await clearButton.trigger('click');

            // then
            const emittedEvents = wrapper.emitted('update:modelValue');
            expect(emittedEvents).toBeTruthy();
            expect(emittedEvents?.length).toBe(2);
            expect(emittedEvents?.[1][0]).toEqual([]);
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
            const clearButton = wrapper.find('.vs-file-drop-close-button');

            // then
            expect(clearButton.exists()).toBeFalsy();
        });

        it('readonly 상태일 때 파일 제거 버튼이 노출되지 않는다', async () => {
            // given
            const file = createFile();
            const wrapper = mount(VsFileDrop, { props: { modelValue: [file], readonly: true } });

            // when
            const clearButton = wrapper.find('.vs-file-drop-close-button');

            // then
            expect(clearButton.exists()).toBeFalsy();
        });

        it('noClear가 true일 때 파일 제거 버튼이 노출되지 않는다', async () => {
            // given
            const file = createFile();
            const wrapper = mount(VsFileDrop, { props: { modelValue: [file], noClear: true } });

            // when
            const clearButton = wrapper.find('.vs-file-drop-close-button');

            // then
            expect(clearButton.exists()).toBeFalsy();
        });

        it('파일이 없을 때 파일 제거 버튼이 노출되지 않는다', () => {
            // given
            const wrapper = mount(VsFileDrop, { props: { modelValue: [] } });

            // when
            const clearButton = wrapper.find('.vs-file-drop-close-button');

            // then
            expect(clearButton.exists()).toBeFalsy();
        });

        it('파일이 있고 noClear가 false일 때 파일 제거 버튼이 노출된다', async () => {
            // given
            const wrapper = mount(VsFileDrop, { props: { modelValue: [createFile()], noClear: false } });
            await flushPromises();

            // when
            const clearButton = wrapper.find('.vs-file-drop-close-button');

            // then
            expect(clearButton.exists()).toBeTruthy();
        });

        it('small prop이 true일 때 vs-small 클래스가 적용된다', () => {
            // given, when
            const wrapper = mount(VsFileDrop, { props: { small: true } });

            // then
            const fileDrop = wrapper.find('.vs-file-drop');
            expect(fileDrop.classes()).toContain('vs-small');
        });

        it('name prop이 input 요소에 올바르게 설정된다', () => {
            // given, when
            const wrapper = mount(VsFileDrop, { props: { name: 'test-file' } });

            // then
            const input = wrapper.find('input[type="file"]');
            expect(input.attributes('name')).toBe('test-file');
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
            const wrapper = mount(VsFileDrop, { props: { max: 2, multiple: true } });
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
            const errorMessages = wrapper.vm.computedMessages.filter((msg: any) => msg.state === 'error');
            expect(errorMessages).toHaveLength(1);
            expect(errorMessages[0]).toEqual({
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

        it('min보다 많은 파일이 있다가 개별 파일을 삭제하여 min 미만이 되면 에러가 발생한다', async () => {
            // given
            const files = [createFile('a.png'), createFile('b.png'), createFile('c.png')];
            const wrapper = mount(VsFileDrop, { props: { modelValue: files, min: 2, multiple: true } });
            await flushPromises();

            // when
            wrapper.vm.handleFileRemove(files[1]);
            wrapper.vm.handleFileRemove(files[2]);
            await wrapper.vm.$nextTick();

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

    describe('clear() 메서드', () => {
        it('clear 메서드를 호출하면 모든 파일이 제거된다', async () => {
            // given
            const files = [createFile('a.png'), createFile('b.png')];
            const wrapper = mount(VsFileDrop, { props: { modelValue: files } });
            await flushPromises();

            // when
            wrapper.vm.clear();
            await wrapper.vm.$nextTick();

            // then
            const emittedEvents = wrapper.emitted('update:modelValue');
            expect(emittedEvents).toBeTruthy();
            expect(emittedEvents?.[1][0]).toEqual([]);
        });

        it('clear 메서드 호출 시 file input의 value도 초기화된다', async () => {
            // given
            const files = [createFile('a.png')];
            const wrapper = mount(VsFileDrop, { props: { modelValue: files } });

            // when
            wrapper.vm.clear();
            await wrapper.vm.$nextTick();

            // then
            const input = wrapper.find('input[type="file"]').element as HTMLInputElement;
            expect(input.value).toBe('');
        });
    });

    describe('이벤트 emit', () => {
        it('file input에 focus 이벤트가 발생하면 focus 이벤트를 emit해야 한다', async () => {
            // given
            const wrapper = mount(VsFileDrop, {
                attachTo: document.body,
            });
            const input = wrapper.find('input[type="file"]');

            // when
            await input.trigger('focus');

            // then
            const focusEvents = wrapper.emitted('focus');
            expect(focusEvents).toBeTruthy();
            expect(focusEvents?.length).toBe(1);
            expect(focusEvents?.[0][0]).toBeInstanceOf(FocusEvent);

            // cleanup
            wrapper.unmount();
        });

        it('file input에 blur 이벤트가 발생하면 blur 이벤트를 emit해야 한다', async () => {
            // given
            const wrapper = mount(VsFileDrop, {
                attachTo: document.body,
            });
            const input = wrapper.find('input[type="file"]');

            // when
            await input.trigger('focus');
            await input.trigger('blur');

            // then
            const blurEvents = wrapper.emitted('blur');
            expect(blurEvents).toBeTruthy();
            expect(blurEvents?.length).toBe(1);
            expect(blurEvents?.[0][0]).toBeInstanceOf(FocusEvent);

            // cleanup
            wrapper.unmount();
        });

        it('disabled 상태에서는 focus/blur 이벤트가 발생하지 않아야 한다', async () => {
            // given
            const wrapper = mount(VsFileDrop, {
                props: {
                    disabled: true,
                },
                attachTo: document.body,
            });
            const input = wrapper.find('input[type="file"]');

            // when
            await input.trigger('focus');
            await input.trigger('blur');

            // then
            expect(wrapper.emitted('focus')).toBeUndefined();
            expect(wrapper.emitted('blur')).toBeUndefined();

            // cleanup
            wrapper.unmount();
        });

        it('readonly 상태에서는 focus/blur 이벤트를 emit해야 한다', async () => {
            // given
            const wrapper = mount(VsFileDrop, {
                props: {
                    readonly: true,
                },
                attachTo: document.body,
            });
            const input = wrapper.find('input[type="file"]');

            // when
            await input.trigger('focus');
            await input.trigger('blur');

            // then
            expect(wrapper.emitted('focus')).toBeTruthy();
            expect(wrapper.emitted('blur')).toBeTruthy();

            // cleanup
            wrapper.unmount();
        });

        it('focus() 메서드 호출 시에도 네이티브 focus 이벤트가 발생하여 focus 이벤트를 emit해야 한다', async () => {
            // given
            const wrapper = mount(VsFileDrop, {
                attachTo: document.body,
            });

            // when
            wrapper.vm.focus();
            await wrapper.vm.$nextTick();

            // then
            const focusEvents = wrapper.emitted('focus');
            expect(focusEvents).toBeTruthy();
            expect(focusEvents?.length).toBe(1);

            // cleanup
            wrapper.unmount();
        });

        it('blur() 메서드 호출 시에도 네이티브 blur 이벤트가 발생하여 blur 이벤트를 emit해야 한다', async () => {
            // given
            const wrapper = mount(VsFileDrop, {
                attachTo: document.body,
            });
            wrapper.vm.focus();
            await wrapper.vm.$nextTick();

            // when
            wrapper.vm.blur();
            await wrapper.vm.$nextTick();

            // then
            const blurEvents = wrapper.emitted('blur');
            expect(blurEvents).toBeTruthy();
            expect(blurEvents?.length).toBe(1);

            // cleanup
            wrapper.unmount();
        });
    });

    describe('focus() / blur() 메서드', () => {
        it('focus 메서드를 호출하면 file input에 포커스가 설정된다', async () => {
            // given
            const wrapper = mount(VsFileDrop, { attachTo: document.body });
            await wrapper.vm.$nextTick();
            const input = wrapper.find('input[type="file"]').element as HTMLInputElement;
            const focusSpy = vi.spyOn(input, 'focus');

            // when
            wrapper.vm.focus();

            // then
            expect(focusSpy).toHaveBeenCalled();
            wrapper.unmount();
        });

        it('blur 메서드를 호출하면 file input의 포커스가 해제된다', async () => {
            // given
            const wrapper = mount(VsFileDrop, { attachTo: document.body });
            await wrapper.vm.$nextTick();
            const input = wrapper.find('input[type="file"]').element as HTMLInputElement;
            const blurSpy = vi.spyOn(input, 'blur');

            // when
            wrapper.vm.blur();

            // then
            expect(blurSpy).toHaveBeenCalled();
            wrapper.unmount();
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

        it('multiple이 true일 때, dialog에서 여러 파일을 선택하면 모두 등록된다', async () => {
            // given
            const files = [createFile('a.png'), createFile('b.png')];
            const wrapper = mount(VsFileDrop, { props: { multiple: true } });

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
            const wrapper = mount(VsFileDrop, { props: { multiple: true } });

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

        it('파일 2개 이상 추가하면 파일 개수가 표시된다', async () => {
            // given
            const files = [createFile('test1.png'), createFile('test2.png')];
            const wrapper = mount(VsFileDrop, { props: { multiple: true } });

            // when
            await wrapper.vm.handleFileDialog({
                target: {
                    files,
                },
            } as unknown as Event);
            await wrapper.vm.$nextTick();

            // then
            const fileCount = wrapper.find('.vs-file-drop-file-count');
            expect(fileCount.exists()).toBe(true);
            expect(fileCount.text()).toBe('2 files selected');
        });

        it('파일 1개를 추가하면 파일 개수가 표시되지 않는다', async () => {
            // given
            const files = [createFile('test.png')];
            const wrapper = mount(VsFileDrop);

            // when
            await wrapper.vm.handleFileDialog({
                target: {
                    files,
                },
            } as unknown as Event);
            await wrapper.vm.$nextTick();

            // then
            const fileCount = wrapper.find('.vs-file-drop-file-count');
            expect(fileCount.exists()).toBe(false);
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

        it('dialog에서 파일을 선택하면 기존 파일이 새 파일로 교체된다', async () => {
            // given
            const existingFile = createFile('existing.png');
            const wrapper = mount(VsFileDrop, { props: { modelValue: [existingFile] } });
            const newFiles = [createFile('new.png')];

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

        it('파일을 삭제한 후 같은 파일을 다시 업로드할 수 있다', async () => {
            // given
            const file = createFile('test.png');
            const wrapper = mount(VsFileDrop, { props: { modelValue: [] } });

            // 첫 번째 파일 업로드
            const mockInput = { files: [file], value: 'test.png' };
            await wrapper.vm.handleFileDialog({
                target: mockInput,
            } as unknown as Event);
            await wrapper.vm.$nextTick();

            expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual([file]);

            // 파일 삭제
            const clearButton = wrapper.find('.vs-file-drop-close-button');
            await clearButton.trigger('click');
            await wrapper.vm.$nextTick();

            expect(wrapper.emitted('update:modelValue')?.[1][0]).toEqual([]);

            // when: 같은 파일 다시 업로드
            const mockInput2 = { files: [file], value: '' };
            await wrapper.vm.handleFileDialog({
                target: mockInput2,
            } as unknown as Event);
            await wrapper.vm.$nextTick();

            // then
            expect(wrapper.emitted('update:modelValue')?.[2][0]).toEqual([file]);
        });

        it('개별 파일의 close 버튼을 클릭하면 해당 파일만 제거된다', async () => {
            // given
            const files = [createFile('a.png'), createFile('b.png'), createFile('c.png')];
            const wrapper = mount(VsFileDrop, { props: { modelValue: files, multiple: true } });
            await flushPromises();

            // when
            const chips = wrapper.findAllComponents({ name: 'VsChip' });
            expect(chips.length).toBe(3);
            await chips[1].vm.$emit('close');
            await wrapper.vm.$nextTick();

            // then
            expect(wrapper.vm.inputValue).toEqual([files[0], files[2]]);
        });

        it('readonly 상태일 때 chip이 closable하지 않다', async () => {
            // given
            const files = [createFile('a.png')];
            const wrapper = mount(VsFileDrop, { props: { modelValue: files, readonly: true } });
            await flushPromises();

            // when
            const chip = wrapper.findComponent({ name: 'VsChip' });

            // then
            expect(chip.props('closable')).toBe(false);
        });

        it('disabled 상태일 때 chip이 closable하지 않다', async () => {
            // given
            const files = [createFile('a.png')];
            const wrapper = mount(VsFileDrop, { props: { modelValue: files, disabled: true } });
            await flushPromises();

            // when
            const chip = wrapper.findComponent({ name: 'VsChip' });

            // then
            expect(chip.props('closable')).toBe(false);
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
            expect(wrapper.emitted('drop')).toBeFalsy();
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
            expect(wrapper.emitted('drop')).toBeFalsy();
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
            const wrapper = mount(VsFileDrop, { props: { multiple: true } });

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
            const wrapper = mount(VsFileDrop, { props: { multiple: true } });

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

        it('drag & drop으로 파일을 추가하면 기존 파일이 새 파일로 교체된다', async () => {
            // given
            const existingFile = createFile('existing.png');
            const wrapper = mount(VsFileDrop, { props: { modelValue: [existingFile] } });
            const newFiles = [createFile('new.png')];

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

        it('space 키를 누르면 openFileDialog가 호출된다', () => {
            // given
            const wrapper = mount(VsFileDrop);
            const openFileDialogSpy = vi.spyOn(wrapper.vm, 'openFileDialog');

            // when
            const input = wrapper.find('input[type="file"]');
            input.trigger('keydown.space');

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

        it('disabled 상태일 때, openFileDialog가 호출되지 않는다', () => {
            // given
            const wrapper = mount(VsFileDrop, { props: { disabled: true } });

            // when
            wrapper.vm.openFileDialog();

            // then
            // openFileDialog 내부에서 disabled 체크로 early return하므로 아무 일도 일어나지 않음
            expect(wrapper.vm.computedDisabled).toBe(true);
        });

        it('disable 상태일 때, 탭 이벤트로 접근할 수 없다', async () => {
            // given
            const wrapper = mount(VsFileDrop, { props: { disabled: true } });
            const input = wrapper.find('input[type="file"]');

            // when & then
            expect(input.attributes('disabled')).toBeDefined();
        });

        it('전체 파일 제거 버튼으로 탭 이동이 불가능하다', async () => {
            // given
            const wrapper = mount(VsFileDrop, { props: { modelValue: [createFile()] } });
            await flushPromises();

            // when
            const clearBtn = wrapper.find('.vs-file-drop-close-button');

            // then
            expect(clearBtn.attributes('tabindex')).toBe('-1');
        });
    });

    describe('accept 검증', () => {
        describe('MIME 타입 형식', () => {
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
                    text: 'Allowed: image/png',
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

        describe('확장자 형식', () => {
            it('accept가 확장자 형식일 때 맞지 않는 파일을 추가하면 에러가 발생한다', async () => {
                // given
                const wrapper = mount(VsFileDrop, { props: { accept: '.png' } });
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
                    text: 'Allowed: .png',
                    state: 'error',
                });
            });

            it('accept가 확장자 형식일 때 맞는 파일을 추가하면 에러가 없다', async () => {
                // given
                const wrapper = mount(VsFileDrop, { props: { accept: '.png' } });
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

            it('accept가 여러 확장자 형식일 때 허용된 파일을 추가하면 에러가 없다', async () => {
                // given
                const wrapper = mount(VsFileDrop, { props: { accept: '.png, .jpg, .jpeg', multiple: true } });
                const files = [createFile('test1.png', 'image/png'), createFile('test2.jpg', 'image/jpeg')];

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

        describe('와일드카드 형식', () => {
            it('accept가 와일드카드 형식일 때 매칭되는 파일을 추가하면 에러가 없다', async () => {
                // given
                const wrapper = mount(VsFileDrop, { props: { accept: 'image/*', multiple: true } });
                const files = [
                    createFile('test1.png', 'image/png'),
                    createFile('test2.jpg', 'image/jpeg'),
                    createFile('test3.gif', 'image/gif'),
                ];

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

            it('accept가 와일드카드 형식일 때 매칭되지 않는 파일을 추가하면 에러가 발생한다', async () => {
                // given
                const wrapper = mount(VsFileDrop, { props: { accept: 'image/*' } });
                const files = [createFile('test.pdf', 'application/pdf')];

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
                    text: 'Allowed: image/*',
                    state: 'error',
                });
            });
        });

        describe('혼합 형식', () => {
            it('MIME 타입과 확장자 형식이 혼합되어 있을 때 허용된 파일을 추가하면 에러가 없다', async () => {
                // given
                const wrapper = mount(VsFileDrop, { props: { accept: 'image/png, .jpg, .pdf', multiple: true } });
                const files = [
                    createFile('test1.png', 'image/png'),
                    createFile('test2.jpg', 'image/jpeg'),
                    createFile('test3.pdf', 'application/pdf'),
                ];

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

            it('MIME 타입, 확장자, 와일드카드가 혼합되어 있을 때 허용되지 않은 파일을 추가하면 에러가 발생한다', async () => {
                // given
                const wrapper = mount(VsFileDrop, { props: { accept: 'image/png, .jpg, video/*' } });
                const files = [createFile('test.pdf', 'application/pdf')];

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
                    text: 'Allowed: image/png, .jpg, video/*',
                    state: 'error',
                });
            });
        });
    });

    describe('multiple prop', () => {
        it('multiple이 false일 때 여러 파일을 추가하면 validate 호출 시 에러 메시지가 노출된다', async () => {
            // given
            const wrapper = mount(VsFileDrop, { props: { multiple: false } });
            const files = [createFile('test1.png'), createFile('test2.png')];

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
            expect(errorMessages).toHaveLength(1);
            expect(errorMessages[0]).toEqual({
                text: 'You can only upload one file',
                state: 'error',
            });
        });

        it('multiple이 false일 때 1개 파일을 추가하면 에러가 없다', async () => {
            // given
            const wrapper = mount(VsFileDrop, { props: { multiple: false } });
            const files = [createFile('test.png')];

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

        it('multiple이 true일 때 여러 파일을 추가하면 에러가 없다', async () => {
            // given
            const wrapper = mount(VsFileDrop, { props: { multiple: true } });
            const files = [createFile('test1.png'), createFile('test2.png'), createFile('test3.png')];

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

        it('multiple 속성이 input 요소에 올바르게 설정된다', () => {
            // given, when
            const wrapperSingle = mount(VsFileDrop, { props: { multiple: false } });
            const wrapperMultiple = mount(VsFileDrop, { props: { multiple: true } });

            // then
            const inputSingle = wrapperSingle.find('input[type="file"]');
            const inputMultiple = wrapperMultiple.find('input[type="file"]');

            expect(inputSingle.attributes('multiple')).toBeUndefined();
            expect(inputMultiple.attributes('multiple')).toBeDefined();
        });
    });
});
