import { describe, it, expect, vi, beforeEach } from 'vitest';
import { componentRegistryUtil } from '../component-registry';
import type { App } from 'vue';

describe('component registry util', () => {
    let mockApp: App;

    beforeEach(() => {
        // Mock Vue App instance
        mockApp = {
            component: vi.fn(),
        } as unknown as App;
    });

    describe('extractComponentNameFromPath', () => {
        it('should extract component name from path', () => {
            const path = 'src/components/Button.vue';
            const result = componentRegistryUtil.extractComponentNameFromPath(path);
            expect(result).toBe('Button');
        });

        it('should handle empty path', () => {
            const path = '';
            const result = componentRegistryUtil.extractComponentNameFromPath(path);
            expect(result).toBe('');
        });
    });

    describe('registerSingleComponent', () => {
        it('should register a component successfully', async () => {
            const mockComponent = {
                name: 'TestComponent',
                default: {
                    name: 'TestComponent',
                },
            };

            const mockModules = {
                'test/path.vue': () => Promise.resolve(mockComponent),
            };

            await componentRegistryUtil.registerSingleComponent(mockApp, 'test/path.vue', mockModules, []);

            expect(mockApp.component).toHaveBeenCalledWith('TestComponent', mockComponent.default);
        });

        it('should skip registration if component is not in the provided list', async () => {
            const mockComponent = {
                name: 'TestComponent',
                default: {
                    name: 'TestComponent',
                },
            };

            const mockModules = {
                'test/path.vue': () => Promise.resolve(mockComponent),
            };

            await componentRegistryUtil.registerSingleComponent(mockApp, 'test/path.vue', mockModules, [
                'OtherComponent',
            ]);

            expect(mockApp.component).not.toHaveBeenCalled();
        });

        it('should use filename as component name if component.name is not available', async () => {
            const mockComponent = {
                default: {},
            };

            const mockModules = {
                'test/Button.vue': () => Promise.resolve(mockComponent),
            };

            await componentRegistryUtil.registerSingleComponent(mockApp, 'test/Button.vue', mockModules, []);

            expect(mockApp.component).toHaveBeenCalledWith('Button', mockComponent.default);
        });

        it('should handle registration errors gracefully', async () => {
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const mockModules = {
                'test/path.vue': () => Promise.reject(new Error('Test error')),
            };

            await componentRegistryUtil.registerSingleComponent(mockApp, 'test/path.vue', mockModules, []);

            expect(consoleErrorSpy).toHaveBeenCalled();
            consoleErrorSpy.mockRestore();
        });
    });

    describe('registerComponents', () => {
        it('should register all components successfully', async () => {
            const mockModules = {
                'test/Button.vue': () =>
                    Promise.resolve({
                        default: { name: 'Button' },
                    }),
                'test/Input.vue': () =>
                    Promise.resolve({
                        default: { name: 'Input' },
                    }),
            };

            vi.stubGlobal('import.meta.glob', () => mockModules);

            await componentRegistryUtil.registerComponents(mockApp);

            expect(mockApp.component).toHaveBeenCalledTimes(2);
            vi.unstubAllGlobals();
        });

        it('should handle registration errors gracefully', async () => {
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const mockModules = {
                'test/path.vue': () => Promise.reject(new Error('Test error')),
            };

            vi.stubGlobal('import.meta.glob', () => mockModules);

            await expect(componentRegistryUtil.registerComponents(mockApp)).rejects.toThrow();
            expect(consoleErrorSpy).toHaveBeenCalled();

            consoleErrorSpy.mockRestore();
            vi.unstubAllGlobals();
        });
    });
});
