import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VsAvatar from './../VsAvatar.vue';

describe('VaAvatar', () => {
    it('text contents를 slot에 넣을 수 있다', () => {
        const text = 'AVATAR';
        const wrapper = mount(VsAvatar, {
            slots: {
                default: text,
            },
        });

        expect(wrapper.html()).toContain(text);
    });

    it('image contents를 slot에 넣을 수 있다', () => {
        const imgTag = '<img src="test-image" alt="avatar">';
        const wrapper = mount(VsAvatar, {
            slots: {
                default: imgTag,
            },
        });

        expect(wrapper.html()).toContain(imgTag);
    });

    describe('styleSet', () => {
        it('styleSet이 적용되어야 한다', () => {
            const wrapper = mount(VsAvatar, {
                props: {
                    styleSet: {
                        variables: {
                            objectFit: 'cover',
                        },
                        component: {
                            width: '5rem',
                            height: '5rem',
                            backgroundColor: '#ff0000',
                        },
                    },
                },
            });

            expect(wrapper.vm.styleSetVariables).toEqual({
                '--vs-avatar-objectFit': 'cover',
            });
            expect(wrapper.vm.componentStyleSet.component).toEqual({
                width: '5rem',
                height: '5rem',
                backgroundColor: '#ff0000',
            });
        });

        it('variables만 설정할 수 있다', () => {
            const wrapper = mount(VsAvatar, {
                props: {
                    styleSet: {
                        variables: {
                            objectFit: 'contain',
                        },
                    },
                },
            });

            expect(wrapper.vm.styleSetVariables).toEqual({
                '--vs-avatar-objectFit': 'contain',
            });
        });

        it('component만 설정할 수 있다', () => {
            const wrapper = mount(VsAvatar, {
                props: {
                    styleSet: {
                        component: {
                            borderRadius: '50%',
                            backgroundColor: '#e188e5',
                        },
                    },
                },
            });

            expect(wrapper.vm.componentStyleSet.component).toEqual({
                borderRadius: '50%',
                backgroundColor: '#e188e5',
            });
        });
    });
});
