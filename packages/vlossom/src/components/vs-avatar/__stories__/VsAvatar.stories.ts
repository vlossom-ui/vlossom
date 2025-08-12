import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { colorScheme, getColorSchemeTemplate, chromaticParameters } from '@/storybook';
import { useVlossom } from '@/framework';
import VsAvatar from './../VsAvatar.vue';
import type { VsAvatarStyleSet } from '../types';

const meta: Meta<typeof VsAvatar> = {
    title: 'Components/Base Components/VsAvatar',
    component: VsAvatar,
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

export const Default: Story = {};

export const Image: Story = {
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
    parameters: {
        chromatic: chromaticParameters.theme,
    },
};

export const StyleSet: Story = {
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
    args: {
        styleSet: 'myStyleSet',
    },
};
