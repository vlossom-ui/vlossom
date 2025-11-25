import type { Meta, StoryObj } from '@storybook/vue3-vite';

import VsInfiniteScroll from './../VsInfiniteScroll.vue';

const meta: Meta<typeof VsInfiniteScroll> = {
    title: 'Components/Layout Components/VsInfiniteScroll',
    component: VsInfiniteScroll,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'VsInfiniteScroll는 IntersectionObserver를 사용하여 자식 요소들의 가시성을 추적하는 무한 스크롤 컨테이너 컴포넌트입니다. ' +
                    '자식 요소가 뷰포트에 보일 때 `data-io-visible="true"` 속성을 자동으로 설정하여 가시성 기반 렌더링 최적화를 지원합니다.',
            },
        },
    },
    argTypes: {
        disabled: {
            control: 'boolean',
            description: 'IntersectionObserver 비활성화 여부',
        },
        height: {
            control: 'text',
            description: '컨테이너 높이',
        },
        rootMargin: {
            control: 'text',
            description: 'IntersectionObserver의 rootMargin 옵션',
        },
        tag: {
            control: 'text',
            description: '렌더링할 HTML 태그',
        },
        threshold: {
            control: { type: 'number', min: 0, max: 1, step: 0.1 },
            description: 'IntersectionObserver의 threshold 옵션 (0~1)',
        },
    },
    args: {
        disabled: false,
        height: '500px',
        rootMargin: '0px',
        tag: 'div',
        threshold: 0,
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 무한 스크롤 컨테이너
export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: '1000개의 div 요소를 포함한 기본 무한 스크롤 컨테이너입니다. 각 요소의 가시성은 IntersectionObserver로 추적됩니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsInfiniteScroll },
        setup() {
            const items = Array.from({ length: 1000 }, (_, i) => i);
            return { args, items };
        },
        template: `
            <div style="border: 2px solid #e5e7eb; border-radius: 8px; padding: 16px;">
                <vs-infinite-scroll v-bind="args">
                    <div
                        v-for="item in items"
                        :key="item"
                        :data-item-index="item"
                        style="
                            padding: 16px;
                            margin-bottom: 8px;
                            background: #ffffff;
                            border: 1px solid #e5e7eb;
                            border-radius: 6px;
                            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
                        "
                    >
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <span style="
                                display: inline-flex;
                                align-items: center;
                                justify-content: center;
                                width: 32px;
                                height: 32px;
                                background: #3b82f6;
                                color: white;
                                border-radius: 50%;
                                font-weight: 600;
                                font-size: 14px;
                            ">{{ item + 1 }}</span>
                            <div style="flex: 1;">
                                <div style="font-weight: 500; color: #1f2937; margin-bottom: 4px;">
                                    항목 {{ item + 1 }}
                                </div>
                                <div style="font-size: 0.875rem; color: #6b7280;">
                                    이 요소는 IntersectionObserver로 가시성이 추적됩니다.
                                </div>
                            </div>
                        </div>
                    </div>
                </vs-infinite-scroll>
            </div>
        `,
    }),
};

// IntersectionObserver 옵션 커스터마이징
export const WithCustomOptions: Story = {
    parameters: {
        docs: {
            description: {
                story:
                    'rootMargin과 threshold 옵션을 커스터마이징한 예제입니다. ' +
                    'rootMargin을 100px로 설정하여 요소가 뷰포트에 들어오기 100px 전에 미리 감지됩니다.',
            },
        },
    },
    args: {
        rootMargin: '100px',
        threshold: 0.5,
    },
    render: (args: any) => ({
        components: { VsInfiniteScroll },
        setup() {
            const items = Array.from({ length: 1000 }, (_, i) => i);
            return { args, items };
        },
        template: `
            <div style="border: 2px solid #e5e7eb; border-radius: 8px; padding: 16px;">
                <vs-infinite-scroll v-bind="args">
                    <div
                        v-for="item in items"
                        :key="item"
                        :data-item-index="item"
                        style="
                            padding: 16px;
                            margin-bottom: 8px;
                            background: #ffffff;
                            border: 1px solid #e5e7eb;
                            border-radius: 6px;
                            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
                        "
                    >
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <span style="
                                display: inline-flex;
                                align-items: center;
                                justify-content: center;
                                width: 32px;
                                height: 32px;
                                background: #8b5cf6;
                                color: white;
                                border-radius: 50%;
                                font-weight: 600;
                                font-size: 14px;
                            ">{{ item + 1 }}</span>
                            <div style="flex: 1;">
                                <div style="font-weight: 500; color: #1f2937; margin-bottom: 4px;">
                                    항목 {{ item + 1 }}
                                </div>
                                <div style="font-size: 0.875rem; color: #6b7280;">
                                    rootMargin: 100px, threshold: 0.5
                                </div>
                            </div>
                        </div>
                    </div>
                </vs-infinite-scroll>
            </div>
        `,
    }),
};

// 비활성화
export const Disabled: Story = {
    parameters: {
        docs: {
            description: {
                story: 'disabled prop을 true로 설정하면 IntersectionObserver가 비활성화되고 모든 자식 요소가 항상 표시됩니다.',
            },
        },
    },
    args: {
        disabled: true,
    },
    render: (args: any) => ({
        components: { VsInfiniteScroll },
        setup() {
            const items = Array.from({ length: 20 }, (_, i) => i);
            return { args, items };
        },
        template: `
            <div style="border: 2px solid #e5e7eb; border-radius: 8px; padding: 16px;">
                <vs-infinite-scroll v-bind="args">
                    <div
                        v-for="item in items"
                        :key="item"
                        :data-item-index="item"
                        style="
                            padding: 16px;
                            margin-bottom: 8px;
                            background: #ffffff;
                            border: 1px solid #e5e7eb;
                            border-radius: 6px;
                            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
                        "
                    >
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <span style="
                                display: inline-flex;
                                align-items: center;
                                justify-content: center;
                                width: 32px;
                                height: 32px;
                                background: #ef4444;
                                color: white;
                                border-radius: 50%;
                                font-weight: 600;
                                font-size: 14px;
                            ">{{ item + 1 }}</span>
                            <div style="flex: 1;">
                                <div style="font-weight: 500; color: #1f2937; margin-bottom: 4px;">
                                    항목 {{ item + 1 }}
                                </div>
                                <div style="font-size: 0.875rem; color: #6b7280;">
                                    IntersectionObserver 비활성화됨 (모든 요소 항상 표시)
                                </div>
                            </div>
                        </div>
                    </div>
                </vs-infinite-scroll>
            </div>
        `,
    }),
};

// 커스텀 태그 사용
export const CustomTag: Story = {
    parameters: {
        docs: {
            description: {
                story: 'tag prop을 사용하여 ul 태그로 렌더링하고, li 요소들을 자식으로 사용한 예제입니다.',
            },
        },
    },
    args: {
        tag: 'ul',
    },
    render: (args: any) => ({
        components: { VsInfiniteScroll },
        setup() {
            const items = Array.from({ length: 1000 }, (_, i) => i);
            return { args, items };
        },
        template: `
            <div style="border: 2px solid #e5e7eb; border-radius: 8px; padding: 16px;">
                <vs-infinite-scroll v-bind="args" style="list-style: none; padding: 0; margin: 0;">
                    <li
                        v-for="item in items"
                        :key="item"
                        :data-item-index="item"
                        style="
                            padding: 16px;
                            margin-bottom: 8px;
                            background: #ffffff;
                            border: 1px solid #e5e7eb;
                            border-radius: 6px;
                            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
                        "
                    >
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <span style="
                                display: inline-flex;
                                align-items: center;
                                justify-content: center;
                                width: 32px;
                                height: 32px;
                                background: #f59e0b;
                                color: white;
                                border-radius: 50%;
                                font-weight: 600;
                                font-size: 14px;
                            ">{{ item + 1 }}</span>
                            <div style="flex: 1;">
                                <div style="font-weight: 500; color: #1f2937; margin-bottom: 4px;">
                                    리스트 항목 {{ item + 1 }}
                                </div>
                                <div style="font-size: 0.875rem; color: #6b7280;">
                                    ul 태그로 렌더링된 리스트
                                </div>
                            </div>
                        </div>
                    </li>
                </vs-infinite-scroll>
            </div>
        `,
    }),
};
