import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { colorScheme, getColorSchemeTemplate, chromaticParameters } from '@/storybook';
import { useVlossom } from '@/framework';
import VsAvatar from './../VsAvatar.vue';
import type { VsAvatarStyleSet } from '../types';

const meta: Meta<typeof VsAvatar> = {
    title: 'Components/Base Components/VsAvatar',
    component: VsAvatar,
    parameters: {
        docs: {
            description: {
                component: `VsAvatar는 사용자 프로필 이미지, 이니셜, 아이콘 등을 표시하는 아바타 컴포넌트입니다.
                    다양한 크기와 스타일 커스터마이징을 지원하며, 이미지가 없는 경우 텍스트로 대체할 수 있습니다.`,
            },
        },
    },
    render: (args: any) => ({
        components: { VsAvatar },
        setup() {
            const preDefinedStyleSet: VsAvatarStyleSet = {
                backgroundColor: '#1e88e5',
                borderRadius: '50%',
                fontColor: '#fff',
                fontSize: '1.5rem',
                fontWeight: '600',
                width: '5rem',
            } as const;

            useVlossom().styleSet = {
                myStyleSet: { VsAvatar: { ...preDefinedStyleSet } },
            };

            return { args };
        },
        template: '<vs-avatar v-bind="args">VS</vs-avatar>',
    }),
    tags: ['autodocs'],
    argTypes: {
        colorScheme,
    },
};

export default meta;
type Story = StoryObj<typeof VsAvatar>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: '기본 텍스트 아바타입니다. 이미지 없이 텍스트나 이니셜을 표시할 때 사용합니다.',
            },
        },
    },
};

export const Image: Story = {
    parameters: {
        docs: {
            description: {
                story: '이미지를 포함한 아바타입니다. img 태그를 슬롯에 넣어 프로필 사진을 표시할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsAvatar },
        setup() {
            return { args };
        },
        template: `
            <vs-avatar v-bind="args">
                <img src="https://upload.wikimedia.org/wikipedia/en/a/a6/Pok%C3%A9mon_Pikachu_art.png" alt="pikachu">
            </vs-avatar>`,
    }),
};

export const ColorScheme: Story = {
    parameters: {
        docs: {
            description: {
                story: '다양한 색상 테마가 적용된 아바타들입니다. colorScheme prop을 사용하여 미리 정의된 색상 조합을 적용할 수 있습니다.',
            },
        },
        chromatic: chromaticParameters.theme,
    },
    render: (args: any) => ({
        components: { VsAvatar },
        setup() {
            return { args };
        },
        template: `
            <div>
                ${getColorSchemeTemplate(`
                    <vs-avatar v-bind="args" color-scheme="{{ color }}" :style="{ marginBottom: '0.4rem' }">VS</vs-avatar>
			   `)}
            </div>
        `,
    }),
};

export const StyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: '인라인 스타일 객체를 사용한 커스텀 아바타입니다. styleSet prop에 직접 스타일 객체를 전달하여 세밀한 커스터마이징이 가능합니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsAvatar },
        setup() {
            return { args };
        },
        template: '<vs-avatar v-bind="args">VS</vs-avatar>',
    }),
    args: {
        styleSet: {
            borderRadius: '0.6rem',
            fontSize: '2rem',
            height: '5rem',
            width: '5rem',
            backgroundColor: '#e188e5',
            fontColor: '#fff',
        },
    },
};

export const PreDefinedStyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: '미리 정의된 스타일 세트를 사용한 아바타입니다. useVlossom().styleSet에 등록된 스타일을 문자열로 참조하여 재사용할 수 있습니다.',
            },
        },
    },
    args: {
        styleSet: 'myStyleSet',
    },
};
