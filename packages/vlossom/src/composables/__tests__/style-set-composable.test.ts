import { describe, expect, it } from 'vitest';
import { ref } from 'vue';
import { useStyleSet } from '../style-set-composable';
import { useOptionsStore } from '@/stores';
import { VsComponent } from '@/declaration';

describe('useStyleSet', () => {
    describe('plainStyleSet', () => {
        it('styleSet이 undefined이면 빈 객체를 반환해야 한다', () => {
            // given
            const styleSet = ref(undefined);
            const component = VsComponent.VsButton;

            // when
            const { plainStyleSet } = useStyleSet(component, styleSet);

            // then
            expect(plainStyleSet.value).toEqual({});
        });

        it('문자열 styleSet이 주어지면 옵션스토어에서 해당 컴포넌트의 스타일셋을 가져와야 한다', () => {
            // given
            const component = VsComponent.VsButton;
            const styles = { color: 'red', fontSize: '14px' };
            const styleSet = ref('primary');

            const optionStore = useOptionsStore();
            optionStore.styleSet = { [styleSet.value]: { [component]: styles } };

            // when
            const { plainStyleSet } = useStyleSet(component, styleSet);

            // then
            expect(plainStyleSet.value).toEqual(styles);
        });

        it('객체 styleSet이 주어지면 해당 객체를 그대로 사용해야 한다', () => {
            // given
            const styles = { color: 'green', padding: '10px' };
            const styleSet = ref(styles);
            const component = VsComponent.VsButton;

            // when
            const { plainStyleSet } = useStyleSet(component, styleSet);

            // then
            expect(plainStyleSet.value).toEqual(styles);
        });

        it('추가 스타일셋이 주어지면 기존 스타일셋과 병합되고 추가 스타일셋이 우선되어야 한다', () => {
            // given
            const component = VsComponent.VsButton;
            const styles = { color: 'red', fontSize: '14px' };
            const styleSet = ref('primary');
            const additionalStyleSet = { backgroundColor: 'blue', fontSize: '16px' };

            const optionStore = useOptionsStore();
            optionStore.styleSet = { [styleSet.value]: { [component]: styles } };

            // when
            const { plainStyleSet } = useStyleSet(component, styleSet, additionalStyleSet);

            // then
            expect(plainStyleSet.value).toEqual({
                color: 'red',
                fontSize: '16px',
                backgroundColor: 'blue',
            });
        });

        it('styleSet이 undefined이고 추가 스타일셋만 주어지면 추가 스타일셋만 반환해야 한다', () => {
            // given
            const component = VsComponent.VsButton;
            const styleSet = ref(undefined);
            const additionalStyleSet = { color: 'purple', margin: '8px' };

            // when
            const { plainStyleSet } = useStyleSet(component, styleSet, additionalStyleSet);

            // then
            expect(plainStyleSet.value).toEqual(additionalStyleSet);
        });
    });

    describe('computedStyleSet', () => {
        it('빈 스타일셋에 대해 빈 객체를 반환해야 한다', () => {
            // given
            const component = VsComponent.VsButton;
            const styleSet = ref(undefined);

            // when
            const { computedStyleSet } = useStyleSet(component, styleSet);

            // then
            expect(computedStyleSet.value).toEqual({});
        });

        it('컴포넌트명을 kebab-case로 변환해야 한다', () => {
            // given
            const component = 'VsComplexComponent';
            const styles = { backgroundColor: 'white' };
            const styleSet = ref(styles);

            // when
            const { computedStyleSet } = useStyleSet(component, styleSet);

            // then
            expect(computedStyleSet.value).toEqual({
                '--vs-complex-component-backgroundColor': 'white',
            });
        });

        it('스타일 객체를 CSS 변수로 변환해야 한다', () => {
            // given
            const component = VsComponent.VsButton;
            const styles = { color: 'red', fontSize: '14px' };
            const styleSet = ref(styles);

            // when
            const { computedStyleSet } = useStyleSet(component, styleSet);

            // then
            expect(computedStyleSet.value).toEqual({
                '--vs-button-color': 'red',
                '--vs-button-fontSize': '14px',
            });
        });

        it('중첩된 객체를 플랫한 CSS 변수로 변환해야 한다', () => {
            // given
            const component = 'vs-input';
            const styles = {
                color: 'blue',
                append: {
                    width: '2px',
                    padding: '3px',
                    backgroundColor: 'gray',
                },
            };
            const styleSet = ref(styles);

            // when
            const { computedStyleSet } = useStyleSet(component, styleSet);

            // then
            expect(computedStyleSet.value).toEqual({
                '--vs-input-color': 'blue',
                '--vs-input-append-width': '2px',
                '--vs-input-append-padding': '3px',
                '--vs-input-append-backgroundColor': 'gray',
            });
        });
    });
});
