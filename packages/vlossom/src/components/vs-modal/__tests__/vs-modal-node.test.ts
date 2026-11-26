import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import VsModalNode from './../VsModalNode.vue';

describe('VsModalNode', () => {
    describe('size props', () => {
        it('size가 lg일 때 width에만 lg 크기가 적용되고 height는 지정되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsModalNode, {
                props: { size: 'lg' },
            });

            // then
            expect(wrapper.vm.componentStyleSet).toMatchObject({ width: '70%' });
            expect(wrapper.vm.componentStyleSet).not.toHaveProperty('height');
        });

        it('size가 문자열로 주어지면 width에만 해당 값이 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsModalNode, {
                props: { size: '500px' },
            });

            // then
            expect(wrapper.vm.componentStyleSet).toMatchObject({ width: '500px' });
            expect(wrapper.vm.componentStyleSet).not.toHaveProperty('height');
        });

        it('size가 객체이고 height가 키워드로 주어지면 지정된 height 크기가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsModalNode, {
                props: {
                    size: { width: 'lg', height: 'lg' },
                },
            });

            // then
            expect(wrapper.vm.componentStyleSet).toMatchObject({
                width: '70%',
                height: '66%',
            });
        });

        it('size가 객체로 주어지면 width와 height가 각각 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsModalNode, {
                props: {
                    size: { width: '600px', height: '400px' },
                },
            });

            // then
            expect(wrapper.vm.componentStyleSet).toMatchObject({
                width: '600px',
                height: '400px',
            });
        });

        it('size가 객체이고 width만 주어지면 height는 지정되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsModalNode, {
                props: {
                    size: { width: '600px' },
                },
            });

            // then
            expect(wrapper.vm.componentStyleSet).toMatchObject({ width: '600px' });
            expect(wrapper.vm.componentStyleSet).not.toHaveProperty('height');
        });

        it('size가 객체이고 height만 주어지면 width는 md가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsModalNode, {
                props: {
                    size: { height: '400px' },
                },
            });

            // then
            expect(wrapper.vm.componentStyleSet).toMatchObject({
                width: '45%',
                height: '400px',
            });
        });

        it('너비가 정해진 모달은 내부 반응형 기준이 되도록 query container가 되어야 한다', () => {
            // given, when
            const wrapper = mount(VsModalNode, {
                props: { size: 'md' },
            });

            // then
            expect(wrapper.vm.componentStyleSet.$content).toMatchObject({ containerType: 'inline-size' });
            expect(wrapper.vm.componentInlineStyle).not.toHaveProperty('containerType');
        });

        it('styleSet의 $content는 query container 설정과 합쳐져 콘텐츠 영역에 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsModalNode, {
                props: { size: 'md', styleSet: { padding: '1rem', $content: { padding: '3rem' } } },
            });

            // then
            expect(wrapper.vm.componentInlineStyle).toMatchObject({ padding: '1rem' });
            expect(wrapper.vm.componentStyleSet.$content).toEqual({ padding: '3rem', containerType: 'inline-size' });
            expect(wrapper.find('.vs-modal-content').attributes('style')).toContain('padding: 3rem');
        });

        it.each([undefined, { width: 'auto', height: '400px' }, { width: 'fit-content' }])(
            '콘텐츠로 너비가 정해지는 모달(size: %o)은 query container가 되지 않아야 한다',
            (size) => {
                // given, when
                const wrapper = mount(VsModalNode, {
                    props: { size },
                });

                // then
                expect(wrapper.vm.componentStyleSet.$content).toBeUndefined();
            },
        );
    });

    describe('beforeClose hook', () => {
        it('beforeClose가 false를 반환하면 dimmed 클릭 시 close 이벤트가 발생하지 않아야 한다', async () => {
            // given
            const beforeClose = vi.fn(async () => false);
            const wrapper = mount(VsModalNode, {
                props: {
                    dimmed: true,
                    dimClose: true,
                    beforeClose,
                },
            });

            await wrapper.vm.$nextTick();

            // when
            await wrapper.vm.onClickDimmed();
            await wrapper.vm.$nextTick();

            // then
            expect(beforeClose).toHaveBeenCalled();
            expect(wrapper.emitted('close')).toBeFalsy();
        });

        it('beforeClose가 true를 반환하면 dimmed 클릭 시 close 이벤트가 발생해야 한다', async () => {
            // given
            const beforeClose = vi.fn(async () => true);
            const wrapper = mount(VsModalNode, {
                props: {
                    dimmed: true,
                    dimClose: true,
                    beforeClose,
                },
            });

            await wrapper.vm.$nextTick();

            // when
            await wrapper.vm.onClickDimmed();
            await wrapper.vm.$nextTick();

            // then
            expect(beforeClose).toHaveBeenCalled();
            expect(wrapper.emitted('close')).toBeTruthy();
        });
    });

    describe('dimmed 기능', () => {
        it('dimmed가 true일 때 dimmed 요소가 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsModalNode, {
                props: { dimmed: true },
            });

            // then
            expect(wrapper.findComponent({ name: 'VsDimmed' }).exists()).toBe(true);
        });

        it('dimmed가 false일 때 dimmed 요소가 렌더링되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsModalNode, {
                props: { dimmed: false },
            });

            // then
            expect(wrapper.findComponent({ name: 'VsDimmed' }).exists()).toBe(false);
        });

        it('dimClose가 true일 때 dimmed 클릭 시 close 이벤트가 발생해야 한다', async () => {
            // given
            const wrapper = mount(VsModalNode, {
                props: {
                    dimmed: true,
                    dimClose: true,
                },
            });

            await wrapper.vm.$nextTick();

            // when
            await wrapper.vm.onClickDimmed();
            await wrapper.vm.$nextTick();

            // then
            expect(wrapper.emitted('close')).toBeTruthy();
        });

        it('dimClose가 false일 때 dimmed 클릭 시 close 이벤트가 발생하지 않아야 한다', async () => {
            // given
            const wrapper = mount(VsModalNode, {
                props: {
                    dimmed: true,
                    dimClose: false,
                },
            });

            await wrapper.vm.$nextTick();

            // when
            await wrapper.vm.onClickDimmed();
            await wrapper.vm.$nextTick();

            // then
            expect(wrapper.emitted('close')).toBeFalsy();
        });
    });

    describe('scrollLock 기능', () => {
        beforeEach(() => {
            vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
                cb(0);
                return 0;
            });
        });

        afterEach(() => {
            vi.unstubAllGlobals();
            document.body.style.overflow = '';
        });

        it('scrollLock이 true이면 마운트 시 body 스크롤을 잠그고 언마운트 시 복원해야 한다', () => {
            // given, when
            const wrapper = mount(VsModalNode, {
                props: { scrollLock: true },
            });

            // then
            expect(document.body.style.overflow).toBe('hidden');

            // when
            wrapper.unmount();

            // then
            expect(document.body.style.overflow).toBe('');
        });

        it('scrollLock이 false(기본값)이면 body 스크롤을 잠그지 않아야 한다', () => {
            // given, when
            mount(VsModalNode, {});

            // then
            expect(document.body.style.overflow).toBe('');
        });

        it('scrollLock에 selector 문자열을 주면 해당 요소를 잠그고 body는 잠그지 않아야 한다', () => {
            // given
            const target = document.createElement('div');
            target.id = 'scroll-lock-target';
            document.body.appendChild(target);

            // when
            const wrapper = mount(VsModalNode, {
                props: { scrollLock: '#scroll-lock-target' },
            });

            // then
            expect(target.style.overflow).toBe('hidden');
            expect(document.body.style.overflow).toBe('');

            // when
            wrapper.unmount();

            // then
            expect(target.style.overflow).toBe('');
            target.remove();
        });
    });
});
