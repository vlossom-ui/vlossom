import { describe, it, expect, beforeEach } from 'vitest';
import { ContainerStore } from './../container-store';

interface TestItem {
    container: string;
    id: string;
}

describe('container-store', () => {
    let store: ContainerStore<TestItem>;

    beforeEach(() => {
        store = new ContainerStore<TestItem>();
    });

    describe('초기 상태', () => {
        it('size가 0이어야 한다', () => {
            // then
            expect(store.size).toBe(0);
        });

        it('map이 빈 Map이어야 한다', () => {
            // then
            expect(store.map.value).toBeInstanceOf(Map);
            expect(store.map.value.size).toBe(0);
        });
    });

    describe('size', () => {
        it('컨테이너가 추가되면 size가 증가해야 한다', () => {
            // when
            store.set('container1', [{ container: 'container1', id: 'id1' }]);

            // then
            expect(store.size).toBe(1);
        });

        it('여러 컨테이너가 추가되면 size가 그에 맞게 증가해야 한다', () => {
            // when
            store.set('container1', [{ container: 'container1', id: 'id1' }]);
            store.set('container2', [{ container: 'container2', id: 'id2' }]);

            // then
            expect(store.size).toBe(2);
        });
    });

    describe('has', () => {
        it('존재하는 컨테이너에 대해 true를 반환해야 한다', () => {
            // given
            store.set('container1', [{ container: 'container1', id: 'id1' }]);

            // when
            const result = store.has('container1');

            // then
            expect(result).toBe(true);
        });

        it('존재하지 않는 컨테이너에 대해 false를 반환해야 한다', () => {
            // when
            const result = store.has('nonexistent');

            // then
            expect(result).toBe(false);
        });
    });

    describe('get', () => {
        it('존재하는 컨테이너의 배열을 반환해야 한다', () => {
            // given
            const items = [
                { container: 'container1', id: 'id1' },
                { container: 'container1', id: 'id2' },
            ];
            store.set('container1', items);

            // when
            const result = store.get('container1');

            // then
            expect(result).toEqual(items);
        });

        it('존재하지 않는 컨테이너는 빈 배열을 반환해야 한다', () => {
            // when
            const result = store.get('nonexistent');

            // then
            expect(result).toEqual([]);
        });
    });

    describe('set', () => {
        it('컨테이너에 배열을 설정할 수 있어야 한다', () => {
            // given
            const items = [
                { container: 'container1', id: 'id1' },
                { container: 'container1', id: 'id2' },
            ];

            // when
            store.set('container1', items);

            // then
            expect(store.get('container1')).toEqual(items);
            expect(store.has('container1')).toBe(true);
        });

        it('기존 컨테이너를 새로운 값으로 덮어쓸 수 있어야 한다', () => {
            // given
            const items1 = [{ container: 'container1', id: 'id1' }];
            const items2 = [{ container: 'container1', id: 'id2' }];
            store.set('container1', items1);

            // when
            store.set('container1', items2);

            // then
            expect(store.get('container1')).toEqual(items2);
            expect(store.size).toBe(1);
        });
    });

    describe('push', () => {
        it('기존 컨테이너에 아이템을 추가할 수 있어야 한다', () => {
            // given
            const item1 = { container: 'container1', id: 'id1' };
            const item2 = { container: 'container1', id: 'id2' };
            store.set('container1', [item1]);

            // when
            store.push('container1', item2);

            // then
            expect(store.get('container1')).toHaveLength(2);
            expect(store.get('container1')).toContainEqual(item1);
            expect(store.get('container1')).toContainEqual(item2);
        });

        it('존재하지 않는 컨테이너에 아이템을 추가할 수 있어야 한다', () => {
            // given
            const item = { container: 'container1', id: 'id1' };

            // when
            store.push('container1', item);

            // then
            expect(store.get('container1')).toHaveLength(1);
            expect(store.get('container1')).toContainEqual(item);
        });
    });

    describe('add', () => {
        it('아이템의 container 속성을 사용하여 추가해야 한다', () => {
            // given
            const item = { container: 'container1', id: 'id1' };

            // when
            store.add(item);

            // then
            expect(store.get('container1')).toHaveLength(1);
            expect(store.get('container1')).toContainEqual(item);
        });

        it('여러 아이템을 같은 컨테이너에 추가할 수 있어야 한다', () => {
            // given
            const item1 = { container: 'container1', id: 'id1' };
            const item2 = { container: 'container1', id: 'id2' };

            // when
            store.add(item1);
            store.add(item2);

            // then
            expect(store.get('container1')).toHaveLength(2);
        });
    });

    describe('remove', () => {
        it('지정된 컨테이너와 id의 아이템을 제거해야 한다', () => {
            // given
            const item1 = { container: 'container1', id: 'id1' };
            const item2 = { container: 'container1', id: 'id2' };
            store.set('container1', [item1, item2]);

            // when
            store.remove('container1', 'id1');

            // then
            expect(store.get('container1')).toHaveLength(1);
            expect(store.get('container1')).toContainEqual(item2);
            expect(store.get('container1')).not.toContainEqual(item1);
        });

        it('존재하지 않는 아이템을 제거하려고 해도 안전하게 처리해야 한다', () => {
            // given
            const item = { container: 'container1', id: 'id1' };
            store.set('container1', [item]);

            // when
            store.remove('container1', 'nonexistent');

            // then
            expect(store.get('container1')).toHaveLength(1);
        });

        it('존재하지 않는 컨테이너를 제거하려고 해도 안전하게 처리해야 한다', () => {
            // when
            store.remove('nonexistent', 'id1');

            // then
            expect(store.size).toBe(0);
        });

        it('마지막 아이템을 제거하면 컨테이너도 삭제되어야 한다', () => {
            // given
            const item = { container: 'container1', id: 'id1' };
            store.set('container1', [item]);

            // when
            store.remove('container1', 'id1');

            // then
            expect(store.has('container1')).toBe(false);
            expect(store.size).toBe(0);
        });
    });

    describe('pop', () => {
        it('컨테이너의 마지막 아이템을 제거해야 한다', () => {
            // given
            const item1 = { container: 'container1', id: 'id1' };
            const item2 = { container: 'container1', id: 'id2' };
            store.set('container1', [item1, item2]);

            // when
            store.pop('container1');

            // then
            expect(store.get('container1')).toHaveLength(1);
            expect(store.get('container1')[0]).toEqual(item1);
        });

        it('존재하지 않는 컨테이너에서 pop을 시도해도 안전하게 처리해야 한다', () => {
            // when
            store.pop('nonexistent');

            // then
            expect(store.size).toBe(0);
        });

        it('비어있는 컨테이너에서 pop을 시도해도 안전하게 처리해야 한다', () => {
            // given
            store.set('container1', []);

            // when
            store.pop('container1');

            // then
            expect(store.has('container1')).toBe(true);
            expect(store.get('container1')).toHaveLength(0);
        });

        it('마지막 아이템을 제거하면 컨테이너도 삭제되어야 한다', () => {
            // given
            const item = { container: 'container1', id: 'id1' };
            store.set('container1', [item]);

            // when
            store.pop('container1');

            // then
            expect(store.has('container1')).toBe(false);
            expect(store.size).toBe(0);
        });
    });

    describe('delete', () => {
        it('컨테이너를 완전히 삭제해야 한다', () => {
            // given
            store.set('container1', [{ container: 'container1', id: 'id1' }]);
            store.set('container2', [{ container: 'container2', id: 'id2' }]);

            // when
            store.delete('container1');

            // then
            expect(store.has('container1')).toBe(false);
            expect(store.size).toBe(1);
            expect(store.has('container2')).toBe(true);
        });

        it('존재하지 않는 컨테이너를 삭제하려고 해도 안전하게 처리해야 한다', () => {
            // when
            store.delete('nonexistent');

            // then
            expect(store.size).toBe(0);
        });
    });

    describe('clear', () => {
        it('모든 컨테이너를 삭제해야 한다', () => {
            // given
            store.set('container1', [{ container: 'container1', id: 'id1' }]);
            store.set('container2', [{ container: 'container2', id: 'id2' }]);

            // when
            store.clear();

            // then
            expect(store.size).toBe(0);
            expect(store.has('container1')).toBe(false);
            expect(store.has('container2')).toBe(false);
        });

        it('비어있는 상태에서 clear를 호출해도 안전하게 처리해야 한다', () => {
            // when
            store.clear();

            // then
            expect(store.size).toBe(0);
        });
    });

    describe('통합 테스트', () => {
        it('복합 시나리오에서 올바르게 동작해야 한다', () => {
            // given
            const item1 = { container: 'container1', id: 'id1' };
            const item2 = { container: 'container1', id: 'id2' };
            const item3 = { container: 'container2', id: 'id3' };

            // when & then
            // 컨테이너 추가
            store.add(item1);
            store.add(item2);
            store.add(item3);
            expect(store.size).toBe(2);
            expect(store.get('container1')).toHaveLength(2);
            expect(store.get('container2')).toHaveLength(1);

            // 아이템 제거
            store.remove('container1', 'id1');
            expect(store.get('container1')).toHaveLength(1);
            expect(store.get('container1')[0]).toEqual(item2);

            // pop 테스트
            store.push('container1', item1);
            store.pop('container1');
            expect(store.get('container1')).toHaveLength(1);
            expect(store.get('container1')[0]).toEqual(item2);

            // 컨테이너 전체 삭제
            store.delete('container1');
            expect(store.size).toBe(1);
            expect(store.has('container1')).toBe(false);

            // 모든 컨테이너 삭제
            store.clear();
            expect(store.size).toBe(0);
            expect(store.has('container2')).toBe(false);
        });
    });
});
