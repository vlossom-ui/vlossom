import { beforeEach, afterEach, vi } from 'vitest';

import { OptionsStore } from '@/stores';
import * as stores from '@/stores';

beforeEach(() => {
    // Create a mock OptionsStore instance for all tests
    const mockOptionsStore = new OptionsStore();

    // Mock the useOptionsStore function to return the same mock instance
    vi.spyOn(stores, 'useOptionsStore').mockReturnValue(mockOptionsStore);
});

afterEach(() => {
    vi.clearAllMocks();
});

vi.stubGlobal('localStorage', {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
});

vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
}));

vi.stubGlobal('document', {
    documentElement: {
        classList: {
            toggle: vi.fn(),
        },
    },
});

vi.stubGlobal('ResizeObserver', {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
});

vi.stubGlobal('IntersectionObserver', {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
});
