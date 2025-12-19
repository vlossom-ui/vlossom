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

const matchMediaMock = vi.fn((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
}));

vi.stubGlobal('matchMedia', matchMediaMock);

const resizeObserverMock = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

vi.stubGlobal('ResizeObserver', resizeObserverMock);

const intersectionObserverMock = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

vi.stubGlobal('IntersectionObserver', intersectionObserverMock);

const clipboardMock = {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(''),
    read: vi.fn(),
    write: vi.fn(),
};

vi.stubGlobal('navigator', {
    ...navigator,
    clipboard: clipboardMock,
});
