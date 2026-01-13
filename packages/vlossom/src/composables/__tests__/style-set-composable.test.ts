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

        it('variables 프로퍼티가 없으면 빈 객체를 반환해야 한다', () => {
            // given
            const component = VsComponent.VsButton;
            const styles = { color: 'red', fontSize: '14px' };
            const styleSet = ref(styles);

            // when
            const { styleSetVariables } = useStyleSet(component, styleSet);

            // then
            expect(styleSetVariables.value).toEqual({});
        });

        it('컴포넌트명을 kebab-case로 변환해야 한다', () => {
            // given
            const component = 'VsComplexComponent';
            const styles = { variables: { backgroundColor: 'white' } };
            const styleSet = ref(styles);

            // when
            const { styleSetVariables } = useStyleSet(component, styleSet);

            // then
            expect(styleSetVariables.value).toEqual({
                '--vs-complex-component-backgroundColor': 'white',
            });
        });

        it('variables 객체를 CSS 변수로 변환해야 한다', () => {
            // given
            const component = VsComponent.VsButton;
            const styles = { variables: { color: 'red', fontSize: '14px' } };
            const styleSet = ref(styles);

            // when
            const { styleSetVariables } = useStyleSet(component, styleSet);

            // then
            expect(styleSetVariables.value).toEqual({
                '--vs-button-color': 'red',
                '--vs-button-fontSize': '14px',
            });
        });

        it('variables의 중첩된 객체를 플랫한 CSS 변수로 변환해야 한다', () => {
            // given
            const component = 'vs-input';
            const styles = {
                variables: {
                    color: 'blue',
                    append: {
                        width: '2px',
                        padding: '3px',
                        backgroundColor: 'gray',
                    },
                },
            };
            const styleSet = ref(styles);

            // when
            const { styleSetVariables } = useStyleSet(component, styleSet);

            // then
            expect(styleSetVariables.value).toEqual({
                '--vs-input-color': 'blue',
                '--vs-input-append-width': '2px',
                '--vs-input-append-padding': '3px',
                '--vs-input-append-backgroundColor': 'gray',
            });
        });

        it('중첩된 객체가 중첩된 객체를 포함하고 있으면 중첩된 객체의 값을 무시해야 한다', () => {
            // given
            const component = 'vs-input';
            const styles = {
                variables: {
                    color: 'blue',
                    append: {
                        width: '2px',
                        padding: '3px',
                        backgroundColor: 'gray',
                        nested: {
                            color: 'red',
                        },
                    },
                },
            };
            const styleSet = ref(styles);

            // when
            const { styleSetVariables } = useStyleSet(component, styleSet);

            // then
            expect(styleSetVariables.value).toEqual({
                '--vs-input-color': 'blue',
                '--vs-input-append-width': '2px',
                '--vs-input-append-padding': '3px',
                '--vs-input-append-backgroundColor': 'gray',
            });
        });
    });
});
