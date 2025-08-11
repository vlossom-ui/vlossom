import type { Meta, StoryObj } from '@storybook/vue3-vite';
import VsGrid from './../VsGrid.vue';

const meta: Meta<typeof VsGrid> = {
    title: 'Components/VsGrid',
    component: VsGrid,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `VsGrid는 CSS Grid 레이아웃을 쉽게 구성할 수 있는 컴포넌트입니다.
                    gridSize, columnGap, rowGap 등의 props를 통해 그리드 시스템을 제어할 수 있습니다.`,
            },
        },
    },
    argTypes: {
        tag: {
            control: 'select',
            options: ['div', 'section', 'main', 'article', 'ul', 'ol'],
            description: '렌더링할 HTML 태그',
        },
        width: {
            control: 'text',
            description: '그리드 컨테이너의 너비',
        },
        height: {
            control: 'text',
            description: '그리드 컨테이너의 높이',
        },
        gridSize: {
            control: { type: 'number', min: 1, max: 12 },
            description: '그리드 컬럼 수',
        },
        columnGap: {
            control: 'text',
            description: '컬럼 간격',
        },
        rowGap: {
            control: 'text',
            description: '행 간격',
        },
        styleSet: {
            control: 'object',
            description: '커스텀 스타일 설정',
        },
    },
    args: {
        tag: 'div',
        width: '100%',
        height: 'auto',
        gridSize: 3,
        columnGap: '16px',
        rowGap: '16px',
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

function gridItem(num: number) {
    return `
        <div style="border: 1px solid #bbb; display: flex; align-items: center; justify-content: center">Grid Item ${num}</div>
    `;
}

// 기본 그리드
export const Default: Story = {
    args: {
        gridSize: 3,
        columnGap: '16px',
        rowGap: '16px',
    },
    render: (args: any) => ({
        components: { VsGrid },
        setup() {
            return { args };
        },
        template: `
            <vs-grid v-bind="args" height="200px">
                ${gridItem(1)}
                ${gridItem(2)}
                ${gridItem(3)}
                ${gridItem(4)}
                ${gridItem(5)}
                ${gridItem(6)}
            </vs-grid>
        `,
    }),
};

// 커스텀 태그 사용
export const CustomTag: Story = {
    args: {
        tag: 'ul',
        gridSize: 3,
        columnGap: '20px',
        rowGap: '20px',
    },
    render: (args: any) => ({
        components: { VsGrid },
        setup() {
            return { args };
        },
        template: `
            <vs-grid v-bind="args" height="200px" style="padding: 0;">
                <li style="padding: 25px; text-align: center; border: 1px solid #d1d5db; list-style: none;">
                    <h3 style="margin: 0 0 10px 0; color: #374151;">List Item 1</h3>
                    <p style="margin: 0; color: #6b7280;">커스텀 태그로 렌더링된 그리드 아이템입니다.</p>
                </li>
                <li style="padding: 25px; text-align: center; border: 1px solid #d1d5db; list-style: none;">
                    <h3 style="margin: 0 0 10px 0; color: #374151;">List Item 2</h3>
                    <p style="margin: 0; color: #6b7280;">li 태그를 사용하여 의미론적으로 더 명확합니다.</p>
                </li>
                <li style="padding: 25px; text-align: center; border: 1px solid #d1d5db; list-style: none;">
                    <h3 style="margin: 0 0 10px 0; color: #374151;">List Item 3</h3>
                    <p style="margin: 0; color: #6b7280;">각 아이템은 독립적인 섹션으로 구성됩니다.</p>
                </li>
            </vs-grid>
        `,
    }),
};
