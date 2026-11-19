import { describe, it, expect, beforeEach } from 'vitest';
import { computed, ref } from 'vue';
import type { FormInputEntry } from '@/declaration';
import { FormStore } from './../form-store';

function createEntry(valid = true, changed = false): FormInputEntry {
    return {
        valid: ref(valid),
        changed: ref(changed),
        validate: async () => valid,
        clear: () => {},
        reset: () => {},
    };
}

describe('form-store', () => {
    let store: FormStore;

    beforeEach(() => {
        store = new FormStore();
    });

    it('register한 input을 id로 조회할 수 있어야 한다', () => {
        // given
        const entry = createEntry();

        // when
        store.register('field1', entry);

        // then
        expect(store.inputs.get('field1')).toBe(entry);
    });

    it('등록된 input의 Ref가 unwrap되지 않아야 한다', () => {
        // given
        const entry = createEntry(false);

        // when
        store.register('field1', entry);

        // then
        expect(store.inputs.get('field1')?.valid).toBe(entry.valid);
        expect(store.inputs.get('field1')?.valid.value).toBe(false);
    });

    it('unregister하면 input이 registry에서 제거되어야 한다', () => {
        // given
        store.register('field1', createEntry());

        // when
        store.unregister('field1');

        // then
        expect(store.inputs.has('field1')).toBe(false);
    });

    it('input 등록과 해제가 computed에 반영되어야 한다', () => {
        // given
        const ids = computed(() => [...store.inputs.keys()]);
        expect(ids.value).toEqual([]);

        // when
        store.register('field1', createEntry());
        store.register('field2', createEntry());

        // then
        expect(ids.value).toEqual(['field1', 'field2']);

        // when
        store.unregister('field1');

        // then
        expect(ids.value).toEqual(['field2']);
    });

    it('등록된 input의 상태 변경이 computed에 반영되어야 한다', () => {
        // given
        const entry = createEntry(true);
        store.register('field1', entry);
        const valid = computed(() => [...store.inputs.values()].every((input) => input.valid.value));
        expect(valid.value).toBe(true);

        // when
        entry.valid.value = false;

        // then
        expect(valid.value).toBe(false);
    });
});
