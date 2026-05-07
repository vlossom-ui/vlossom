import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import * as stores from '@/stores';
import { OptionsStore } from '@/stores';
import { VsComponent } from '@/declaration';
import { useStyleSet } from './../style-set-composable';

describe('useStyleSet', () => {
    let optionsStore: OptionsStore;

    beforeEach(() => {
        optionsStore = new OptionsStore();
        vi.spyOn(stores, 'useOptionsStore').mockReturnValue(optionsStore);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('componentStyleSet', () => {
        it('styleSet이 undefined이면 빈 객체를 반환해야 한다', () => {
            // given
            const styleSet = ref(undefined);
            const component = VsComponent.VsButton;

            // when
            const { componentStyleSet } = useStyleSet(component, styleSet);

            // then
            expect(componentStyleSet.value).toEqual({});
        });

        it('문자열 styleSet이 주어지면 옵션스토어에서 해당 컴포넌트의 스타일셋을 가져와야 한다', () => {
            // given
            const component = VsComponent.VsButton;
            const styles = { color: 'red', fontSize: '14px' };
            const styleSet = ref('primary');

            optionsStore.setStyleSet({ [styleSet.value]: { [component]: styles } });

            // when
            const { componentStyleSet } = useStyleSet(component, styleSet);

            // then
            expect(componentStyleSet.value).toEqual(styles);
        });

        it('객체 styleSet이 주어지면 해당 객체를 그대로 사용해야 한다', () => {
            // given
            const styles = { color: 'green', padding: '10px' };
            const styleSet = ref(styles);
            const component = VsComponent.VsButton;

            // when
            const { componentStyleSet } = useStyleSet(component, styleSet);

            // then
            expect(componentStyleSet.value).toEqual(styles);
        });

        it('추가 스타일셋이 주어지면 기존 스타일셋과 병합되고 추가 스타일셋이 우선되어야 한다', () => {
            // given
            const component = VsComponent.VsButton;
            const styles = { color: 'red', fontSize: '14px' };
            const styleSet = ref('primary');
            const additionalStyleSet = ref({ backgroundColor: 'blue', fontSize: '16px' });

            optionsStore.setStyleSet({ [styleSet.value]: { [component]: styles } });

            // when
            const { componentStyleSet } = useStyleSet(component, styleSet, ref({}), additionalStyleSet);

            // then
            expect(componentStyleSet.value).toEqual({
                color: 'red',
                fontSize: '16px',
                backgroundColor: 'blue',
            });
        });

        it('styleSet이 undefined이고 추가 스타일셋만 주어지면 추가 스타일셋만 반환해야 한다', () => {
            // given
            const component = VsComponent.VsButton;
            const styleSet = ref(undefined);
            const additionalStyleSet = ref({ color: 'purple', margin: '8px' });

            // when
            const { componentStyleSet } = useStyleSet(component, styleSet, ref({}), additionalStyleSet);

            // then
            expect(componentStyleSet.value).toEqual(additionalStyleSet.value);
        });

        it('additionalStyleSet이 중첩된 객체라도 componentStyleSet에 병합되어야 한다', () => {
            // given
            const component = VsComponent.VsButton;
            const styleSet = ref({ padding: '10px', nested: { color: 'blue', backgroundColor: 'green' } });
            const additionalStyleSet: any = ref({ color: 'purple', nested: { color: 'red' } });

            // when
            const { componentStyleSet } = useStyleSet(component, styleSet, ref({}), additionalStyleSet);

            // then
            expect(componentStyleSet.value).toEqual({
                padding: '10px',
                color: 'purple',
                nested: { color: 'red', backgroundColor: 'green' },
            });
        });

        it('baseStyleSet이 주어지면 styleSet과 병합되고 styleSet이 우선되어야 한다', () => {
            // given
            const component = VsComponent.VsButton;
            const baseStyleSet = ref({ color: 'blue', padding: '5px' });
            const styleSet = ref({ color: 'red', fontSize: '14px' });

            // when
            const { componentStyleSet } = useStyleSet(component, styleSet, baseStyleSet);

            // then
            expect(componentStyleSet.value).toEqual({
                color: 'red',
                fontSize: '14px',
                padding: '5px',
            });
        });

        it('baseStyleSet, styleSet, additionalStyleSet이 모두 주어지면 올바른 우선순위로 병합되어야 한다', () => {
            // given
            const component = VsComponent.VsButton;
            const baseStyleSet = ref({ color: 'blue', padding: '5px', margin: '10px' });
            const styleSet = ref({ color: 'red', fontSize: '14px' });
            const additionalStyleSet = ref({ color: 'green', fontWeight: 'bold' });

            // when
            const { componentStyleSet } = useStyleSet(component, styleSet, baseStyleSet, additionalStyleSet);

            // then
            expect(componentStyleSet.value).toEqual({
                color: 'green',
                padding: '5px',
                margin: '10px',
                fontSize: '14px',
                fontWeight: 'bold',
            });
        });

        it('baseStyleSet, styleSet, additionalStyleSet에 중첩된 객체가 있으면 깊은 병합이 되어야 한다', () => {
            // given
            const component = VsComponent.VsButton;
            const baseStyleSet = ref({
                color: 'blue',
                nested: {
                    padding: '5px',
                    margin: '10px',
                    border: '1px solid black',
                },
            });
            const styleSet = ref({
                color: 'red',
                nested: {
                    padding: '8px',
                    backgroundColor: 'white',
                },
            });
            const additionalStyleSet = ref({
                fontSize: '14px',
                nested: {
                    margin: '15px',
                    fontWeight: 'bold',
                },
            });

            // when
            const { componentStyleSet } = useStyleSet<any>(component, styleSet, baseStyleSet, additionalStyleSet);

            // then
            expect(componentStyleSet.value).toEqual({
                color: 'red',
                fontSize: '14px',
                nested: {
                    padding: '8px',
                    margin: '15px',
                    border: '1px solid black',
                    backgroundColor: 'white',
                    fontWeight: 'bold',
                },
            });
        });

        it('$ prefix가 붙은 primitive 값도 우선순위대로 병합되어야 한다', () => {
            // given
            const component = VsComponent.VsSelect;
            const baseStyleSet = ref({ $height: '2rem', $padding: '0.5rem' });
            const styleSet = ref({ $height: '3rem', $margin: '1rem' });
            const additionalStyleSet = ref({ $height: '4rem', $fontSize: '14px' });

            // when
            const { componentStyleSet, styleSetVariables } = useStyleSet<any>(
                component,
                styleSet,
                baseStyleSet,
                additionalStyleSet,
            );

            // then
            expect(componentStyleSet.value).toEqual({
                $height: '4rem',
                $padding: '0.5rem',
                $margin: '1rem',
                $fontSize: '14px',
            });
            expect(styleSetVariables.value).toEqual({
                '--vs-select-height': '4rem',
                '--vs-select-padding': '0.5rem',
                '--vs-select-margin': '1rem',
                '--vs-select-fontSize': '14px',
            });
        });

        it('$ prefix가 붙은 object 슬롯 값도 깊은 병합이 되어야 한다', () => {
            // given
            const component = VsComponent.VsSelect;
            const baseStyleSet = ref({
                $option: { padding: '0.5rem', color: 'black' },
                $wrapper: { label: { fontSize: '14px' } },
            });
            const styleSet = ref({
                $option: { color: 'red', fontWeight: 'bold' },
                $wrapper: { label: { fontWeight: 'bold' } },
            });
            const additionalStyleSet = ref({
                $option: { padding: '1rem' },
            });

            // when
            const { componentStyleSet } = useStyleSet<any>(component, styleSet, baseStyleSet, additionalStyleSet);

            // then
            expect(componentStyleSet.value).toEqual({
                $option: { padding: '1rem', color: 'red', fontWeight: 'bold' },
                $wrapper: { label: { fontSize: '14px', fontWeight: 'bold' } },
            });
        });
    });

    describe('styleSetVariables', () => {
        it('빈 스타일셋에 대해 빈 객체를 반환해야 한다', () => {
            // given
            const component = VsComponent.VsButton;
            const styleSet = ref(undefined);

            // when
            const { styleSetVariables } = useStyleSet(component, styleSet);

            // then
            expect(styleSetVariables.value).toEqual({});
        });

        it('$ prefix가 붙은 root level primitive 값을 CSS 변수로 emit해야 한다', () => {
            // given
            const component = VsComponent.VsSelect;
            const styles = { $height: '2.5rem', $padding: '1rem' };
            const styleSet = ref(styles);

            // when
            const { styleSetVariables } = useStyleSet(component, styleSet);

            // then
            expect(styleSetVariables.value).toEqual({
                '--vs-select-height': '2.5rem',
                '--vs-select-padding': '1rem',
            });
        });

        it('컴포넌트명을 kebab-case로 변환해야 한다', () => {
            // given
            const component = 'VsComplexComponent';
            const styles = { $backgroundColor: 'white' };
            const styleSet = ref(styles);

            // when
            const { styleSetVariables } = useStyleSet(component, styleSet);

            // then
            expect(styleSetVariables.value).toEqual({
                '--vs-complex-component-backgroundColor': 'white',
            });
        });

        it('$ prefix가 붙어도 값이 객체이면 emit하지 않아야 한다', () => {
            // given
            const component = VsComponent.VsSelect;
            const styles = {
                $height: '2.5rem',
                $focused: { border: '1px solid red', backgroundColor: 'gray' },
                $component: { fontSize: '1rem' },
                $wrapper: { variables: { width: '100%' } },
            };
            const styleSet = ref(styles);

            // when
            const { styleSetVariables } = useStyleSet(component, styleSet);

            // then
            expect(styleSetVariables.value).toEqual({
                '--vs-select-height': '2.5rem',
            });
        });

        it('$ prefix가 없는 root level 키는 emit하지 않아야 한다', () => {
            // given
            const component = VsComponent.VsButton;
            const styles = { color: 'red', fontSize: '14px' };
            const styleSet = ref(styles);

            // when
            const { styleSetVariables } = useStyleSet(component, styleSet);

            // then
            expect(styleSetVariables.value).toEqual({});
        });
    });
});
