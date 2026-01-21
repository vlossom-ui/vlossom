// Mock implementation of sortablejs for testing
export default class Sortable {
    constructor() { }
    option() { }
    destroy() { }
    save() { }
    toArray() {
        return [];
    }
}

export type { SortableEvent, Options } from 'sortablejs';
