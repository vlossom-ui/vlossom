import { describe, it, expect, beforeEach } from 'vitest';
import { OverlayStackStore } from '../overlay-stack-store';

interface TestItem {
    id: string;
    container?: string;
}

describe('OverlayStackStore', () => {
    let store: OverlayStackStore<TestItem>;

    beforeEach(() => {
        store = new OverlayStackStore<TestItem>();
    });

    describe('items', () => {
        it('읽기 전용 아이템 배열을 반환해야 한다', () => {
            // given
            const items = store.items;

            // when
            const attemptToModify = () => {
                (items as any).value = [];
            };

            // then
            expect(attemptToModify).toThrow();
        });
    });

    describe('itemsByContainer', () => {
        it('아이템이 없을 때 빈 객체를 반환해야 한다', () => {
            // given
            // when
            const result = store.itemsByContainer.value;

            // then
            expect(result).toEqual({});
        });

        it('컨테이너별로 아이템을 그룹화해야 한다', () => {
            // given
            store.push({ id: '1', container: 'container1' });
            store.push({ id: '2', container: 'container1' });
            store.push({ id: '3', container: 'container2' });
            store.push({ id: '4' }); // 기본 컨테이너

            // when
            const result = store.itemsByContainer.value;

            // then
            expect(result).toEqual({
                container1: [
                    { id: '1', container: 'container1' },
                    { id: '2', container: 'container1' },
                ],
                container2: [{ id: '3', container: 'container2' }],
                body: [{ id: '4' }],
            });
        });
    });

    describe('push', () => {
        it('아이템을 스택에 추가해야 한다', () => {
            // given
            // when
            store.push({ id: 'test' });

            // then
            expect(store.items.value).toEqual([{ id: 'test' }]);
        });

        it('중복된 아이템을 추가하지 않아야 한다', () => {
            // given
            store.push({ id: 'test' });

            // when
            store.push({ id: 'test' });

            // then
            expect(store.items.value).toEqual([{ id: 'test' }]);
        });
    });

    describe('pop', () => {
        it('스택의 마지막 아이템을 제거해야 한다', () => {
            // given
            store.push({ id: '1' });
            store.push({ id: '2' });

            // when
            store.pop();

            // then
            expect(store.items.value).toEqual([{ id: '1' }]);
        });

        it('스택이 비어있을 때 아무것도 하지 않아야 한다', () => {
            // given
            // when
            const attemptToPop = () => store.pop();

            // then
            expect(attemptToPop).not.toThrow();
            expect(store.items.value).toEqual([]);
        });
    });

    describe('remove', () => {
        it('특정 아이템을 스택에서 제거해야 한다', () => {
            // given
            store.push({ id: '1' });
            store.push({ id: '2' });

            // when
            store.remove('1');

            // then
            expect(store.items.value).toEqual([{ id: '2' }]);
        });

        it('아이템이 존재하지 않을 때 아무것도 하지 않아야 한다', () => {
            // given
            // when
            const attemptToRemove = () => store.remove('non-existent');

            // then
            expect(attemptToRemove).not.toThrow();
            expect(store.items.value).toEqual([]);
        });
    });

    describe('clear', () => {
        it('스택의 모든 아이템을 제거해야 한다', () => {
            // given
            store.push({ id: '1' });
            store.push({ id: '2' });

            // when
            store.clear();

            // then
            expect(store.items.value).toEqual([]);
        });
    });
});
