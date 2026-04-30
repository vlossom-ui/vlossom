import { describe, it, expect } from 'vitest';
import { arrayUtil } from './../array-util';

describe('array-util', () => {
    describe('uniqBy()', () => {
        it('지정된 필드 값이 중복된 객체를 제거한다', () => {
            // given
            const items = [
                { id: 1, name: 'a' },
                { id: 2, name: 'b' },
                { id: 1, name: 'c' },
            ];

            // when
            const result = arrayUtil.uniqBy(items, 'id');

            // then
            expect(result).toHaveLength(2);
            expect(result.map((item) => item.id)).toEqual([1, 2]);
        });

        it('중복된 항목 중 처음 등장한 항목을 유지한다', () => {
            // given
            const items = [
                { id: 1, name: 'first' },
                { id: 1, name: 'second' },
                { id: 1, name: 'third' },
            ];

            // when
            const result = arrayUtil.uniqBy(items, 'id');

            // then
            expect(result).toEqual([{ id: 1, name: 'first' }]);
        });

        it('모든 항목이 고유하면 원본과 동일한 길이를 반환한다', () => {
            // given
            const items = [
                { id: 1, name: 'a' },
                { id: 2, name: 'b' },
                { id: 3, name: 'c' },
            ];

            // when
            const result = arrayUtil.uniqBy(items, 'id');

            // then
            expect(result).toHaveLength(3);
            expect(result).toEqual(items);
        });

        it('빈 배열을 입력하면 빈 배열을 반환한다', () => {
            // given
            const items: { id: number }[] = [];

            // when
            const result = arrayUtil.uniqBy(items, 'id');

            // then
            expect(result).toEqual([]);
        });

        it('문자열 필드 값을 기준으로 중복을 제거한다', () => {
            // given
            const items = [
                { name: 'apple', count: 1 },
                { name: 'banana', count: 2 },
                { name: 'apple', count: 3 },
            ];

            // when
            const result = arrayUtil.uniqBy(items, 'name');

            // then
            expect(result).toHaveLength(2);
            expect(result.map((item) => item.name)).toEqual(['apple', 'banana']);
        });
    });
});
