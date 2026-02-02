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
});
