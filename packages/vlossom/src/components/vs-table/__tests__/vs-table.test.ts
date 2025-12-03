import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VsTable from './../VsTable.vue';

describe('VsTable', () => {
    it('remove this test suite in the next commit', () => {
        const wrapper = mount(VsTable);
        expect(wrapper).toBeTruthy();
    });
});
