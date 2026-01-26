import { describe, it, expect, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import VsImage from './../VsImage.vue';

describe('vs-image', () => {
    describe('src', () => {
        it('props로 설정한 src는 error가 발생하지 않았을 때 computedSrc의 값이 되어야 한다', () => {
            // given
            const imagePath = '/images/test.png';
            const wrapper = mount(VsImage, {
                props: {
                    src: imagePath,
                },
            });

            // then
            expect(wrapper.vm.computedSrc).toBe(imagePath);
        });

        it('다양한 이미지 타입을 지원해야 한다 (브라우져 네이티브에 위임)', () => {
            // given
            const imageTypes = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp', 'ico', 'tiff'];

            imageTypes.forEach((ext) => {
                // when
                const imagePath = `/images/test.${ext}`;
                const wrapper = mount(VsImage, {
                    props: {
                        src: imagePath,
                    },
                });
                wrapper.find('img').trigger('load');

                // then
                expect(wrapper.html()).toContain(imagePath);
                expect(wrapper.find('img').attributes('src')).toBe(imagePath);
                expect(wrapper.vm.isLoading).toBe(false);
                expect(wrapper.vm.computedSrc).toBe(imagePath);
            });
        });
    });

    describe('fallback', () => {
        it('<img /> error 발생 시, 설정되어 있는 fallback 이미지를 보여줘야 한다', async () => {
            // given
            const imagePath = '/images/test.png';
            const fallbackPath = '/images/fallback.png';
            const wrapper = mount(VsImage, {
                props: {
                    src: imagePath,
                    fallback: fallbackPath,
                },
            });

            // when
            await wrapper.find('img').trigger('error');

            // then
            expect(wrapper.html()).not.toContain(imagePath);
            expect(wrapper.vm.computedSrc).toBe(fallbackPath);
        });
    });

    describe('lazy', () => {
        const mockIntersectionObserver = class IntersectionObserver {
            constructor() {}
            observe = () => null;
        };
        const originalIntersectionObserver = window.IntersectionObserver;

        it('IntersectionObserver가 존재하면 image를 lazy loading 해야 한다', () => {
            // given
            window.IntersectionObserver = mockIntersectionObserver as any;

            const imagePath = '/images/test.png';
            const wrapper = mount(VsImage, {
                props: {
                    src: imagePath,
                    lazy: true,
                },
            });

            // then
            expect(wrapper.html()).not.toContain(imagePath);
        });

        it('IntersectionObserver를 사용할 수 없는 경우 image를 eager loading 해야 한다', () => {
            // given
            window.IntersectionObserver = undefined as any;

            const imagePath = '/images/test.png';
            const wrapper = mount(VsImage, {
                props: {
                    src: imagePath,
                    lazy: true,
                },
            });

            // then
            expect(wrapper.html()).toContain(imagePath);
        });

        afterEach(() => {
            window.IntersectionObserver = originalIntersectionObserver;
        });
    });

    describe('styleSet', () => {
        it('styleSet 객체가 주어지면 스타일이 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsImage, {
                props: {
                    src: '/images/test.png',
                    styleSet: {
                        variables: {
                            width: '300px',
                            height: '200px',
                            border: '2px solid red',
                        },
                    },
                },
            });

            // then
            expect(wrapper.vm.styleSetVariables).toEqual({
                '--vs-image-width': '300px',
                '--vs-image-height': '200px',
                '--vs-image-border': '2px solid red',
            });
        });
    });

    describe('styleSet 하위 속성 전달', () => {
        it('skeleton styleSet이 componentStyleSet에 설정되어야 한다', () => {
            // given
            const skeletonStyleSet = {
                variables: {
                    backgroundColor: '#e0e0e0',
                },
                component: {
                    borderRadius: '8px',
                },
            };

            // when
            const wrapper = mount(VsImage, {
                props: {
                    src: '/images/test.png',
                    styleSet: {
                        skeleton: skeletonStyleSet,
                    },
                },
            });

            // then
            // 기본 스타일 (width: '100%', height: '100%')과 병합됨
            expect(wrapper.vm.componentStyleSet.skeleton?.variables?.backgroundColor).toBe('#e0e0e0');
            expect(wrapper.vm.componentStyleSet.skeleton?.component?.borderRadius).toBe('8px');
            expect(wrapper.vm.componentStyleSet.skeleton?.component?.width).toBe('100%');
            expect(wrapper.vm.componentStyleSet.skeleton?.component?.height).toBe('100%');
        });

        it('모든 styleSet 하위 속성이 함께 전달되어야 한다', () => {
            // given
            const fullStyleSet = {
                variables: {
                    width: '400px',
                    height: '300px',
                    borderRadius: '12px',
                },
                skeleton: {
                    variables: {
                        backgroundColor: '#f5f5f5',
                    },
                    component: {
                        animation: 'pulse 1.5s ease-in-out infinite',
                    },
                },
            };

            // when
            const wrapper = mount(VsImage, {
                props: {
                    src: '/images/test.png',
                    styleSet: fullStyleSet,
                },
            });

            // then
            expect(wrapper.vm.styleSetVariables['--vs-image-width']).toBe('400px');
            expect(wrapper.vm.styleSetVariables['--vs-image-height']).toBe('300px');
            expect(wrapper.vm.componentStyleSet.skeleton?.variables?.backgroundColor).toBe('#f5f5f5');
            expect(wrapper.vm.componentStyleSet.skeleton?.component?.animation).toBe('pulse 1.5s ease-in-out infinite');
        });
    });
});
