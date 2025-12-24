import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import VsOptions from '../VsOptions.vue';
import type { VsOptionsGroup } from '../types';

describe('vs-options', () => {
    let defaultOptions: any[];

    beforeEach(() => {
        defaultOptions = [
            { id: 1, name: '옵션 1', category: 'A' },
            { id: 2, name: '옵션 2', category: 'A' },
            { id: 3, name: '옵션 3', category: 'B' },
            { id: 4, name: '옵션 4', category: 'B' },
            { id: 5, name: '옵션 5', category: 'C' },
        ];
    });

    describe('groupedOptions', () => {
        it('groupBy가 없으면 모든 옵션을 하나의 그룹으로 반환해야 한다', () => {
            // given, when
            const wrapper = mount(VsOptions, {
                props: {
                    options: defaultOptions,
                },
            });

            // then
            const groupedOptions: VsOptionsGroup[] = wrapper.vm.groupedOptions;
            expect(groupedOptions).toHaveLength(1);
            expect(groupedOptions[0].name).toBe('');
            expect(groupedOptions[0].options).toHaveLength(5);
        });

        it('groupBy가 있으면 그룹별로 옵션이 분류되어야 한다', () => {
            // given, when
            const wrapper = mount(VsOptions, {
                props: {
                    options: defaultOptions,
                    groupBy: (option: any) => option.category,
                },
            });

            // then
            const groupedOptions: VsOptionsGroup[] = wrapper.vm.groupedOptions;
            expect(groupedOptions).toHaveLength(3);
            expect(groupedOptions[0].name).toBe('A');
            expect(groupedOptions[0].options).toHaveLength(2);
            expect(groupedOptions[1].name).toBe('B');
            expect(groupedOptions[1].options).toHaveLength(2);
            expect(groupedOptions[2].name).toBe('C');
            expect(groupedOptions[2].options).toHaveLength(1);
        });

        it('groupBy가 null을 반환하면 ungrouped 그룹에 포함되어야 한다', () => {
            // given
            const optionsWithNull = [
                { id: 1, name: '옵션 1', category: 'A' },
                { id: 2, name: '옵션 2', category: null },
                { id: 3, name: '옵션 3', category: 'B' },
            ];

            // when
            const wrapper = mount(VsOptions, {
                props: {
                    options: optionsWithNull,
                    groupBy: (option: any) => option.category,
                },
            });

            // then
            const groupedOptions: VsOptionsGroup[] = wrapper.vm.groupedOptions;
            expect(groupedOptions).toHaveLength(3);
            // ungrouped는 제일 밑에 있어야 함
            expect(groupedOptions[2].name).toBe('');
            expect(groupedOptions[2].options).toHaveLength(1);
            expect(groupedOptions[2].options[0].item.id).toBe(2);
        });

        it('groupOrder가 있으면 그룹 순서가 지정된 순서대로 정렬되어야 한다', () => {
            // given, when
            const wrapper = mount(VsOptions, {
                props: {
                    options: defaultOptions,
                    groupBy: (option: any) => option.category,
                    groupOrder: ['C', 'A', 'B'],
                },
            });

            // then
            const groupedOptions: VsOptionsGroup[] = wrapper.vm.groupedOptions;
            expect(groupedOptions).toHaveLength(3);
            expect(groupedOptions[0].name).toBe('C');
            expect(groupedOptions[1].name).toBe('A');
            expect(groupedOptions[2].name).toBe('B');
        });

        it('groupOrder에 없는 그룹은 등장 순서대로 뒤에 추가되어야 한다', () => {
            // given
            const options = [
                { id: 1, name: '옵션 1', category: 'A' },
                { id: 2, name: '옵션 2', category: 'B' },
                { id: 3, name: '옵션 3', category: 'C' },
                { id: 4, name: '옵션 4', category: 'D' },
            ];

            // when
            const wrapper = mount(VsOptions, {
                props: {
                    options,
                    groupBy: (option: any) => option.category,
                    groupOrder: ['C', 'A'],
                },
            });

            // then
            const groupedOptions: VsOptionsGroup[] = wrapper.vm.groupedOptions;
            expect(groupedOptions).toHaveLength(4);
            expect(groupedOptions[0].name).toBe('C');
            expect(groupedOptions[1].name).toBe('A');
            expect(groupedOptions[2].name).toBe('B'); // 등장 순서대로
            expect(groupedOptions[3].name).toBe('D'); // 등장 순서대로
        });

        it('ungrouped 옵션은 항상 제일 밑에 위치해야 한다', () => {
            // given
            const options = [
                { id: 1, name: '옵션 1', category: 'A' },
                { id: 2, name: '옵션 2', category: null },
                { id: 3, name: '옵션 3', category: 'B' },
                { id: 4, name: '옵션 4', category: null },
            ];

            // when
            const wrapper = mount(VsOptions, {
                props: {
                    options,
                    groupBy: (option: any) => option.category,
                    groupOrder: ['B', 'A'],
                },
            });

            // then
            const groupedOptions: VsOptionsGroup[] = wrapper.vm.groupedOptions;
            expect(groupedOptions).toHaveLength(3);
            expect(groupedOptions[0].name).toBe('B');
            expect(groupedOptions[1].name).toBe('A');
            expect(groupedOptions[2].name).toBe(''); // ungrouped는 제일 밑
            expect(groupedOptions[2].options).toHaveLength(2);
        });

        it('optionLabel과 optionValue가 올바르게 동작해야 한다', () => {
            // given
            const options = [
                { id: 1, text: '옵션 1', val: 100 },
                { id: 2, text: '옵션 2', val: 200 },
            ];

            // when
            const wrapper = mount(VsOptions, {
                props: {
                    options,
                    optionLabel: 'text',
                    optionValue: 'val',
                },
            });

            // then
            const groupedOptions: VsOptionsGroup[] = wrapper.vm.groupedOptions;
            expect(groupedOptions[0].options[0].label).toBe('옵션 1');
            expect(groupedOptions[0].options[0].value).toBe(100);
            expect(groupedOptions[0].options[1].label).toBe('옵션 2');
            expect(groupedOptions[0].options[1].value).toBe(200);
        });

        it('optionLabel과 optionValue가 없으면 객체 자체를 label과 value로 사용해야 한다', () => {
            // given
            const options = ['옵션 1', '옵션 2'];

            // when
            const wrapper = mount(VsOptions, {
                props: {
                    options,
                },
            });

            // then
            const groupedOptions: VsOptionsGroup[] = wrapper.vm.groupedOptions;
            expect(groupedOptions[0].options[0].label).toBe('옵션 1');
            expect(groupedOptions[0].options[0].value).toBe('옵션 1');
            expect(groupedOptions[0].options[1].label).toBe('옵션 2');
            expect(groupedOptions[0].options[1].value).toBe('옵션 2');
        });

        it('disabled prop이 boolean일 때 모든 옵션에 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsOptions, {
                props: {
                    options: defaultOptions,
                    disabled: true,
                },
            });

            // then
            const groupedOptions: VsOptionsGroup[] = wrapper.vm.groupedOptions;
            groupedOptions[0].options.forEach((option) => {
                expect(option.disabled).toBe(true);
            });
        });

        it('disabled prop이 함수일 때 각 옵션에 개별적으로 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsOptions, {
                props: {
                    options: defaultOptions,
                    disabled: (option: any, index: number) => option.id === 2 || index === 3,
                },
            });

            // then
            const groupedOptions: VsOptionsGroup[] = wrapper.vm.groupedOptions;
            expect(groupedOptions[0].options[0].disabled).toBe(false); // id: 1
            expect(groupedOptions[0].options[1].disabled).toBe(true); // id: 2
            expect(groupedOptions[0].options[2].disabled).toBe(false); // id: 3
            expect(groupedOptions[0].options[3].disabled).toBe(true); // index: 3
            expect(groupedOptions[0].options[4].disabled).toBe(false); // id: 5
        });
    });

    describe('vs-options-list 렌더링', () => {
        it('vs-options-list가 올바르게 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsOptions, {
                props: {
                    options: defaultOptions,
                },
            });

            // then
            const optionsList = wrapper.find('.vs-options-list');
            expect(optionsList.exists()).toBe(true);
            const options = optionsList.findAll('.vs-options-option');
            expect(options).toHaveLength(5);
        });

        it('groupBy가 있을 때 그룹 헤더가 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsOptions, {
                props: {
                    options: defaultOptions,
                    groupBy: (option: any) => option.category,
                },
            });

            // then
            const optionsList = wrapper.find('.vs-options-list');
            const groups = optionsList.findAll('.vs-options-group');
            expect(groups).toHaveLength(3);
            const options = optionsList.findAll('.vs-options-option');
            expect(options).toHaveLength(5);
        });

        it('groupBy가 없을 때 그룹 헤더가 렌더링되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsOptions, {
                props: {
                    options: defaultOptions,
                },
            });

            // then
            const optionsList = wrapper.find('.vs-options-list');
            const groups = optionsList.findAll('.vs-options-group');
            expect(groups).toHaveLength(0);
            const options = optionsList.findAll('.vs-options-option');
            expect(options).toHaveLength(5);
        });

        it('각 옵션이 올바른 id를 가져야 한다', () => {
            // given, when
            const wrapper = mount(VsOptions, {
                props: {
                    options: defaultOptions,
                    optionLabel: 'name',
                },
            });

            // then
            const optionsList = wrapper.find('.vs-options-list');
            const options = optionsList.findAll('.vs-options-option');
            const groupedOptions: VsOptionsGroup[] = wrapper.vm.groupedOptions;

            options.forEach((optionElement, index) => {
                const option = groupedOptions[0].options[index];
                expect(optionElement.attributes('id')).toBe(option.id);
            });
        });

        it('disabled 옵션에 vs-disabled 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsOptions, {
                props: {
                    options: defaultOptions,
                    disabled: (option: any) => option.id === 2 || option.id === 4,
                },
            });

            // then
            const optionsList = wrapper.find('.vs-options-list');
            const options = optionsList.findAll('.vs-options-option');
            expect(options[0].classes()).not.toContain('vs-disabled');
            expect(options[1].classes()).toContain('vs-disabled');
            expect(options[2].classes()).not.toContain('vs-disabled');
            expect(options[3].classes()).toContain('vs-disabled');
            expect(options[4].classes()).not.toContain('vs-disabled');
        });

        it('옵션 클릭 시 click-option 이벤트가 발생해야 한다', async () => {
            // given
            const wrapper = mount(VsOptions, {
                props: {
                    options: defaultOptions,
                },
            });

            // when
            const optionsList = wrapper.find('.vs-options-list');
            const firstOption = optionsList.find('.vs-options-option');
            await firstOption.trigger('click');

            // then
            expect(wrapper.emitted('click-option')).toBeTruthy();
            expect(wrapper.emitted('click-option')?.[0]).toBeDefined();
            const emittedData = wrapper.emitted('click-option')?.[0]?.[0];
            expect(emittedData).toHaveProperty('item');
            expect(emittedData).toHaveProperty('index');
            expect(emittedData).toHaveProperty('group');
            expect(emittedData).toHaveProperty('groupIndex');
        });

        it('빈 options 배열일 때 옵션이 렌더링되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsOptions, {
                props: {
                    options: [],
                },
            });

            // then
            const optionsList = wrapper.find('.vs-options-list');
            const options = optionsList.findAll('.vs-options-option');
            expect(options).toHaveLength(0);
            const groupedOptions: VsOptionsGroup[] = wrapper.vm.groupedOptions;
            expect(groupedOptions).toHaveLength(1);
            expect(groupedOptions[0].options).toHaveLength(0);
        });
    });
});
