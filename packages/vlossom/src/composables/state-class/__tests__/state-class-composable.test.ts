import { describe, expect, it } from 'vitest';
import { useStateClass } from '@/composables';
import { ref } from 'vue';
import type { UIState } from '@/declaration';

describe('state-class-composable', () => {
    describe('stateBoxClasses class', () => {
        it('stated', () => {
            // given
            const stated: UIState[] = ['info', 'success', 'error', 'warning'];

            // when
            const classes = stated.map((state) => useStateClass(ref(state)).stateBoxClasses.value);

            // then
            expect(classes).toEqual([
                { 'vs-stated': true, 'vs-state-box': true, 'vs-state-info': true },
                { 'vs-stated': true, 'vs-state-box': true, 'vs-state-success': true },
                { 'vs-stated': true, 'vs-state-box': true, 'vs-state-error': true },
                { 'vs-stated': true, 'vs-state-box': true, 'vs-state-warning': true },
            ]);
        });

        it('not stated', () => {
            // given
            const notStated: UIState[] = ['idle'];

            // when
            const classes = notStated.map((state) => useStateClass(ref(state)).stateBoxClasses.value);

            // then
            expect(classes).toEqual([{}]);
        });
    });
});
