import type { Preview } from '@storybook/vue3-vite';
import { setup } from '@storybook/vue3-vite';
import { createVlossom, useVlossom } from '@/framework';
import '@/styles/index.css';
import '@/styles/index.scss';

const vlossom = createVlossom();

setup((app) => {
    app.use(vlossom);
});

const decorators = [
    (story: any, context: any) => {
        const backgrounds = context.globals.backgrounds;

        if (backgrounds) {
            useVlossom().theme = backgrounds.value;
        }

        return {
            components: { story },
            template: '<div style="margin: 2rem;"><story /></div>',
        };
    },
];

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
        backgrounds: {
            default: 'light',
            values: [
                {
                    name: 'light',
                    value: '#f8f8f8',
                },
                {
                    name: 'dark',
                    value: '#24252a',
                },
            ],
        },
        viewport: {
            viewports: {
                mobile: { name: 'Mobile', styles: { width: '390px', height: '800px' } },
                tablet: { name: 'Tablet', styles: { width: '834px', height: '1000px' } },
                desktop: { name: 'Desktop', styles: { width: '1440px', height: '1000px' } },
            },
        },
        a11y: {
            config: {
                rules: [
                    {
                        id: 'label',
                        enabled: false,
                    },
                ],
            },
        },
    },

    decorators,
    tags: ['autodocs'],
};

export default preview;
