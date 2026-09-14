import { describe, expect, it } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import VsFileInput from './../VsFileInput.vue';

function createFile(name = 'test.png', type = 'image/png') {
    return new File(['dummy'], name, { type });
}

describe('vs-file-input', () => {
    describe('v-model', () => {
        it('초기 modelValue가 없을 때 파일 목록이 비어있다', () => {
            // given, when
            const wrapper = mount(VsFileInput, { props: { modelValue: [] } });

            // then
            expect(wrapper.props('modelValue')).toEqual([]);
        });

        it('modelValue에 파일이 있을 때 chip으로 표시된다', async () => {
            // given
            const file = createFile('report.pdf', 'application/pdf');

            // when
            const wrapper = mount(VsFileInput, { props: { modelValue: [file] } });
            await flushPromises();

            // then
            const chip = wrapper.find('.vs-chip');
            expect(chip.exists()).toBe(true);
            expect(chip.text()).toContain('report.pdf');
        });

        it('파일을 모두 제거하면 update:modelValue가 빈 배열로 emit된다', async () => {
            // given
            const file = createFile();
            const wrapper = mount(VsFileInput, { props: { modelValue: [file] } });
            await flushPromises();

            // when
            const clearButton = wrapper.find('.vs-file-input-clear');
            await clearButton.trigger('click');

            // then
            const emitted = wrapper.emitted('update:modelValue');
            expect(emitted).toBeTruthy();
            expect(emitted?.[emitted.length - 1][0]).toEqual([]);
        });
    });

    describe('props', () => {
        it('disabled 상태일 때 vs-disabled 클래스가 적용된다', () => {
            // given, when
            const wrapper = mount(VsFileInput, { props: { modelValue: [], disabled: true } });

            // then
            expect(wrapper.find('.vs-file-input').classes()).toContain('vs-disabled');
        });

        it('readonly 상태일 때 vs-readonly 클래스가 적용된다', () => {
            // given, when
            const wrapper = mount(VsFileInput, { props: { modelValue: [], readonly: true } });

            // then
            expect(wrapper.find('.vs-file-input').classes()).toContain('vs-readonly');
        });

        it('파일이 있을 때 clear 버튼이 표시된다', async () => {
            // given
            const file = createFile();
            const wrapper = mount(VsFileInput, { props: { modelValue: [file] } });
            await flushPromises();

            // then
            expect(wrapper.find('.vs-file-input-clear').exists()).toBe(true);
        });

        it('noClear가 true일 때 clear 버튼이 표시되지 않는다', async () => {
            // given
            const file = createFile();
            const wrapper = mount(VsFileInput, { props: { modelValue: [file], noClear: true } });
            await flushPromises();

            // then
            expect(wrapper.find('.vs-file-input-clear').exists()).toBe(false);
        });

        it('disabled 상태일 때 clear 버튼이 표시되지 않는다', async () => {
            // given
            const file = createFile();
            const wrapper = mount(VsFileInput, { props: { modelValue: [file], disabled: true } });
            await flushPromises();

            // then
            expect(wrapper.find('.vs-file-input-clear').exists()).toBe(false);
        });

        it('readonly 상태일 때 clear 버튼이 표시되지 않는다', async () => {
            // given
            const file = createFile();
            const wrapper = mount(VsFileInput, { props: { modelValue: [file], readonly: true } });
            await flushPromises();

            // then
            expect(wrapper.find('.vs-file-input-clear').exists()).toBe(false);
        });

        it('size prop이 적용되면 사이즈 클래스가 추가된다', () => {
            // given, when
            const wrapper = mount(VsFileInput, { props: { modelValue: [], size: 'lg' } });

            // then
            expect(wrapper.find('.vs-file-input').classes()).toContain('vs-lg');
        });

        it('directory prop이 true일 때 native input에 webkitdirectory가 적용된다', () => {
            // given, when
            const wrapper = mount(VsFileInput, { props: { modelValue: [], directory: true } });

            // then
            const nativeInput = wrapper.find('input[type="file"]');
            expect(nativeInput.attributes('webkitdirectory')).toBeDefined();
        });

        it('multiple prop이 true일 때 native input에 multiple이 적용된다', () => {
            // given, when
            const wrapper = mount(VsFileInput, { props: { modelValue: [], multiple: true } });

            // then
            const nativeInput = wrapper.find('input[type="file"]');
            expect(nativeInput.attributes('multiple')).toBeDefined();
        });

        it('directory prop이 true일 때 native input에 multiple이 암묵적으로 적용된다', () => {
            // given, when
            const wrapper = mount(VsFileInput, { props: { modelValue: [], directory: true, multiple: false } });

            // then
            const nativeInput = wrapper.find('input[type="file"]');
            expect(nativeInput.attributes('multiple')).toBeDefined();
        });

        it('파일이 없을 때 placeholder가 표시된다', () => {
            // given, when
            const wrapper = mount(VsFileInput, {
                props: { modelValue: [], placeholder: '파일을 선택하세요' },
            });

            // then
            expect(wrapper.find('.vs-file-input-placeholder').text()).toBe('파일을 선택하세요');
        });
    });

    describe('chip 파일 제거', () => {
        it('chip의 close 버튼을 클릭하면 해당 파일이 제거된다', async () => {
            // given
            const file1 = createFile('a.png');
            const file2 = createFile('b.png');
            const wrapper = mount(VsFileInput, { props: { modelValue: [file1, file2], multiple: true } });
            await flushPromises();

            // when
            const chips = wrapper.findAll('.vs-chip');
            expect(chips).toHaveLength(2);

            // chip 내부 close 버튼 클릭
            const closeButton = chips[0].find('.vs-chip-close-button');
            await closeButton.trigger('click');

            // then
            const emitted = wrapper.emitted('update:modelValue');
            expect(emitted).toBeTruthy();
            const lastValue = emitted?.[emitted.length - 1][0] as File[];
            expect(lastValue).toHaveLength(1);
            expect(lastValue[0].name).toBe('b.png');
        });
    });

    describe('collapseChips', () => {
        it('collapseChips가 true이고 파일이 2개 이상일 때 첫 번째 chip만 표시되고 나머지는 +N으로 표시된다', async () => {
            // given
            const file1 = createFile('a.png');
            const file2 = createFile('b.png');
            const file3 = createFile('c.png');
            const wrapper = mount(VsFileInput, {
                props: { modelValue: [file1, file2, file3], multiple: true, collapseChips: true },
            });
            await flushPromises();

            // then
            const chips = wrapper.findAll('.vs-chip');
            expect(chips).toHaveLength(1);
            expect(chips[0].text()).toContain('a.png');
            expect(wrapper.find('.vs-file-input-collapsed-count').text()).toBe('+2');
        });

        it('collapseChips가 true이어도 파일이 1개일 때는 chip 하나만 표시된다', async () => {
            // given
            const file = createFile('a.png');
            const wrapper = mount(VsFileInput, {
                props: { modelValue: [file], collapseChips: true },
            });
            await flushPromises();

            // then
            expect(wrapper.findAll('.vs-chip')).toHaveLength(1);
            expect(wrapper.find('.vs-file-input-collapsed-count').exists()).toBe(false);
        });
    });

    describe('validation', () => {
        it('required이고 파일이 없을 때 validate()가 false를 반환한다', async () => {
            // given
            const wrapper = mount(VsFileInput, { props: { modelValue: [], required: true } });
            await flushPromises();

            // when
            const result = (wrapper.vm as any).validate();

            // then
            expect(result).toBe(false);
        });

        it('required이고 파일이 있을 때 validate()가 true를 반환한다', async () => {
            // given
            const file = createFile();
            const wrapper = mount(VsFileInput, { props: { modelValue: [file], required: true } });
            await flushPromises();

            // when
            const result = (wrapper.vm as any).validate();

            // then
            expect(result).toBe(true);
        });
    });
});
