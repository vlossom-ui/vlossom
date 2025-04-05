import { beforeEach, describe, expect, it } from 'vitest';
import { ref } from 'vue';
import { useStyleSet } from './../style-set-composable';
import { useVlossom } from '@/vlossom-framework';

import type { StyleSet } from '@/declaration';

interface TestStyleSet {
    backgroundColor?: string;
    fontColor?: string;
    fontSize?: string;
}

const vsTestStyleSet: TestStyleSet = {
    backgroundColor: '#1e88e5',
    fontColor: 'white',
};

const styleSet: StyleSet = {
    VsTest: { myStyleSet: vsTestStyleSet },
};

describe('useStyleSet composable', () => {
    beforeEach(() => {
        useVlossom().stores.option.registerStyleSet(styleSet);
    });

    it('parse styleSet object and return custom properties successfully', () => {
        const myStyleSet = { backgroundColor: '#a5d6ad', fontSize: '2rem' };
        const { computedStyleSet } = useStyleSet<TestStyleSet>('VsTest', ref(myStyleSet));

        expect(computedStyleSet.value).toEqual({
            '--vs-button-backgroundColor': '#a5d6ad',
            '--vs-button-fontSize': '2rem',
        });
    });

    it('find pre-defined styleSet and return custom properties successfully', () => {
        const { computedStyleSet } = useStyleSet<TestStyleSet>('VsTest', ref('myStyleSet'));

        expect(computedStyleSet.value).toEqual({
            '--vs-button-backgroundColor': '#1e88e5',
            '--vs-button-fontColor': 'white',
        });
    });

    it('additionalStyleSet이 있다면 덮어쓴다', () => {
        // given
        const myStyleSet = { backgroundColor: '#a5d6ad', fontSize: '2rem' };
        const additionalStyleSet = { fontSize: '3rem' };
        const { computedStyleSet } = useStyleSet<TestStyleSet>('VsTest', ref(myStyleSet), ref(additionalStyleSet));

        // then
        expect(computedStyleSet.value).toEqual({
            '--vs-test-backgroundColor': '#a5d6ad',
            '--vs-test-fontSize': '3rem',
        });
    });
});
