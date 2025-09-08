import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { VsThemeButton } from '@/components';

const meta: Meta<typeof VsThemeButton> = {
    title: 'Components/Base Components/VsThemeButton',
    component: VsThemeButton,
    parameters: {
        docs: {
            description: {
                component: 'VsThemeButton은 테마 버튼 컴포넌트입니다.',
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof VsThemeButton>;

export const Default: Story = {};
