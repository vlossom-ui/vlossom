import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { colorScheme, getColorSchemeTemplate, chromaticParameters } from '@/storybook';
import { useVlossom } from '@/framework';
import VsSteps from './../VsSteps.vue';
import VsGrid from '@/components/vs-grid/VsGrid.vue';
import type { VsStepsStyleSet } from './../types';

const meta: Meta<typeof VsSteps> = {
    title: 'Components/Base Components/VsSteps',
    component: VsSteps,
    parameters: {
        docs: {
            description: {
                component:
                    'VsSteps는 다단계 프로세스를 나타내는 스텝 인디케이터 컴포넌트입니다. 수평/수직 레이아웃과 키보드 네비게이션을 지원합니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsSteps },
        setup() {
            const preDefinedStyleSet: VsStepsStyleSet = {
                variables: {
                    stepSize: '2.5rem',
                },
                step: {
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #e0e0e0',
                    borderRadius: '50%',
                    padding: '0.5rem',
                    width: '2.5rem',
                    height: '2.5rem',
                },
                activeStep: {
                    backgroundColor: '#1e88e5',
                    border: '2px solid #1565c0',
                },
                label: {
                    color: '#666',
                },
                activeLabel: {
                    color: '#1e88e5',
                    fontWeight: '700',
                },
            } as const;

            useVlossom().styleSet = {
                myStyleSet: { VsSteps: { ...preDefinedStyleSet } },
            };

            const currentStep = ref(args.modelValue || 0);

            return { args, currentStep };
        },
        template: `
            <div>
                <vs-steps v-bind="args" v-model="currentStep" />
                <div style="margin-top: 2rem; padding: 1rem; background-color: #f5f5f5; border-radius: 4px;">
                    <p style="margin: 0;">현재 스텝 인덱스: <strong>{{ currentStep }}</strong></p>
                    <p style="margin: 0.5rem 0 0 0;">현재 스텝: <strong>{{ args.steps[currentStep] }}</strong></p>
                </div>
            </div>
        `,
    }),
    tags: ['autodocs'],
    argTypes: {
        colorScheme,
        steps: {
            control: 'object',
            description: '스텝 항목 배열',
        },
        modelValue: {
            control: 'number',
            description: '현재 선택된 스텝 인덱스 (v-model)',
        },
        width: {
            control: 'text',
            description: '스텝 너비 (반응형 지원)',
        },
        grid: {
            control: 'text',
            description: '그리드 컬럼 수 (반응형 지원)',
        },
        height: {
            control: 'text',
            description: '스텝 높이',
        },
        gap: {
            control: 'text',
            description: '스텝 간격',
        },
        noLabel: {
            control: 'boolean',
            description: '레이블 숨김',
        },
        disabled: {
            control: false,
            description:
                '스텝 비활성화 여부. boolean이면 전체 스텝에 적용되고, (step: string, index: number) => boolean 함수면 각 스텝마다 조건부 적용',
        },
        vertical: {
            control: 'boolean',
            description: '수직 레이아웃',
        },
    },
};

export default meta;
type Story = StoryObj<typeof VsSteps>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: '기본 스텝 인디케이터입니다. 스텝을 클릭하거나 키보드 화살표 키로 이동할 수 있습니다.',
            },
        },
    },
    args: {
        steps: ['Account', 'Profile', 'Settings', 'Complete'],
        modelValue: 0,
    },
};

export const WithProgress: Story = {
    parameters: {
        docs: {
            description: {
                story: '진행 상황을 표시하는 스텝 인디케이터입니다. 현재 스텝까지 진행 바가 표시됩니다.',
            },
        },
    },
    args: {
        steps: ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5'],
        modelValue: 2,
    },
};

export const NoLabel: Story = {
    parameters: {
        docs: {
            description: {
                story: '레이블 없이 번호만 표시하는 스텝 인디케이터입니다. 좁은 공간에 적합합니다.',
            },
        },
    },
    args: {
        steps: ['Step 1', 'Step 2', 'Step 3', 'Step 4'],
        noLabel: true,
    },
};

export const DisabledAll: Story = {
    parameters: {
        docs: {
            description: {
                story: '모든 스텝이 비활성화된 상태입니다. disabled prop에 true를 전달하면 전체 스텝을 비활성화할 수 있습니다.',
            },
        },
    },
    args: {
        steps: ['Step 1', 'Step 2', 'Step 3', 'Step 4'],
        disabled: true,
        modelValue: 0,
    },
};

export const DisabledSteps: Story = {
    parameters: {
        docs: {
            description: {
                story:
                    '일부 스텝이 비활성화된 상태입니다. disabled prop에 함수를 전달하여 조건부로 비활성화할 수 있습니다. ' +
                    '비활성화된 스텝은 클릭할 수 없으며 키보드 네비게이션에서도 건너뜁니다.',
            },
        },
    },
    args: {
        steps: ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5'],
        disabled: (step: string, index: number) => [1, 3].includes(index),
        modelValue: 0,
    },
};

export const DisabledByCondition: Story = {
    parameters: {
        docs: {
            description: {
                story: 'disabled 함수를 사용하여 조건에 따라 동적으로 스텝을 비활성화할 수 있습니다. 이 예시에서는 짝수 인덱스의 스텝을 비활성화합니다.',
            },
        },
    },
    args: {
        steps: ['Step 0', 'Step 1', 'Step 2', 'Step 3', 'Step 4'],
        disabled: (step: string, index: number) => index % 2 === 0,
        modelValue: 1,
    },
};

export const Vertical: Story = {
    parameters: {
        docs: {
            description: {
                story: '수직 레이아웃의 스텝 인디케이터입니다. 세로 방향으로 배치되며 위/아래 화살표 키로 이동할 수 있습니다.',
            },
        },
    },
    args: {
        steps: ['Account', 'Profile', 'Settings', 'Review', 'Complete'],
        vertical: true,
        modelValue: 1,
        height: '300px',
    },
};

export const WithGap: Story = {
    parameters: {
        docs: {
            description: {
                story: 'gap prop을 사용하여 스텝 간 간격을 조절할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsSteps },
        setup() {
            const step0 = ref(1);
            const step1 = ref(1);
            const step2 = ref(1);
            const step3 = ref(1);
            const step4 = ref(1);
            return { args, step0, step1, step2, step3, step4 };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 2rem;">
                <div>
                    <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; color: #666;">gap: 0 (기본값)</p>
                    <vs-steps :steps="args.steps" v-model="step0" gap="0" />
                </div>
                <div>
                    <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; color: #666;">gap: 1rem</p>
                    <vs-steps :steps="args.steps" v-model="step1" gap="1rem" />
                </div>
                <div>
                    <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; color: #666;">gap: 3rem</p>
                    <vs-steps :steps="args.steps" v-model="step2" gap="3rem" />
                </div>
                <div>
                    <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; color: #666;">gap: 6rem</p>
                    <vs-steps :steps="args.steps" v-model="step3" gap="6rem" />
                </div>
                <div>
                    <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; color: #666;">gap: 10rem</p>
                    <vs-steps :steps="args.steps" v-model="step4" gap="10rem" />
                </div>
            </div>
        `,
    }),
    args: {
        steps: ['Step 1', 'Step 2', 'Step 3', 'Step 4'],
    },
};

export const CustomSlot: Story = {
    parameters: {
        docs: {
            description: {
                story:
                    '커스텀 슬롯을 사용하여 스텝 번호와 레이블을 커스터마이징할 수 있습니다. ' +
                    'isSelected, isPrevious, isDisabled 상태를 활용하여 동적인 UI를 구현할 수 있습니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsSteps },
        setup() {
            const currentStep = ref(1);
            return { args, currentStep };
        },
        template: `
            <div>
                <vs-steps v-bind="args" v-model="currentStep">
                    <template #step="{ step, index, isSelected, isPrevious }">
                        <span>{{ isPrevious ? '✓' : isSelected ? '●' : '○' }}</span>
                    </template>
                    <template #label="{ step, index, isSelected }">
                        <span :style="{ fontWeight: isSelected ? '700' : '400' }">{{ step }}</span>
                    </template>
                </vs-steps>
                <div style="margin-top: 2rem; padding: 1rem; background-color: #f5f5f5; border-radius: 4px;">
                    <p style="margin: 0;">현재 스텝: <strong>{{ args.steps[currentStep] }}</strong></p>
                </div>
            </div>
        `,
    }),
    args: {
        steps: ['Preparing', 'Processing', 'Review', 'Complete'],
    },
};

export const Width: Story = {
    parameters: {
        docs: {
            description: {
                story: 'width prop을 사용하여 스텝 너비를 제한할 수 있습니다.',
            },
        },
    },
    args: {
        steps: ['Step 1', 'Step 2', 'Step 3', 'Step 4'],
        width: '400px',
        modelValue: 1,
    },
};

export const Height: Story = {
    parameters: {
        docs: {
            description: {
                story: 'height prop을 사용하여 수직 모드에서 스텝의 높이를 제한할 수 있습니다.',
            },
        },
    },
    args: {
        steps: ['Step 1', 'Step 2', 'Step 3', 'Step 4'],
        vertical: true,
        height: '400px',
        modelValue: 1,
    },
};

export const Grid: Story = {
    parameters: {
        docs: {
            description: {
                story: 'grid prop을 사용하여 12컬럼 그리드 시스템 내에서 스텝이 차지할 컬럼 수를 지정할 수 있습니다. vs-grid 컴포넌트와 함께 사용됩니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsSteps, VsGrid },
        setup() {
            const currentStep = ref(1);
            return { args, currentStep };
        },
        template: `
            <vs-grid column-gap="16px" row-gap="16px">
                <vs-steps v-bind="args" v-model="currentStep" :grid="8" />
                <vs-steps v-bind="args" v-model="currentStep" :grid="4" />
                <vs-steps v-bind="args" v-model="currentStep" :grid="6" />
                <vs-steps v-bind="args" v-model="currentStep" :grid="6" />
            </vs-grid>
        `,
    }),
    args: {
        steps: ['Step 1', 'Step 2', 'Step 3'],
    },
};

export const ResponsiveWidth: Story = {
    parameters: {
        docs: {
            description: {
                story: '반응형 width를 사용하여 화면 크기에 따라 스텝 너비를 조절할 수 있습니다. 브레이크포인트 객체를 전달합니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsSteps, VsGrid },
        setup() {
            const currentStep = ref(1);
            return { args, currentStep };
        },
        template: `
            <vs-grid>
                <vs-steps v-bind="args" v-model="currentStep" />
            </vs-grid>
            <div style="margin-top: 2rem; padding: 1rem; background-color: #f5f5f5; border-radius: 4px;">
                <p style="margin: 0;">현재 스텝: <strong>{{ args.steps[currentStep] }}</strong></p>
                <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #666;">
                    화면 크기를 조절하면 스텝 너비가 자동으로 변경됩니다.
                </p>
            </div>
        `,
    }),
    args: {
        steps: ['Account', 'Profile', 'Settings', 'Complete'],
        width: {
            xs: '100%',
            sm: '90%',
            md: '70%',
            lg: '50%',
            xl: '30%',
        },
        modelValue: 1,
    },
};

export const ResponsiveGrid: Story = {
    parameters: {
        docs: {
            description: {
                story:
                    '반응형 grid를 사용하여 화면 크기에 따라 스텝이 차지할 그리드 컬럼 수를 조절할 수 있습니다. ' +
                    '모바일(xs/sm)에서는 전체 너비(12컬럼), 태블릿(md)에서는 8컬럼, 데스크톱(lg/xl)에서는 6컬럼을 차지합니다.',
            },
        },
    },
    render: (args: any) => ({
        components: { VsSteps, VsGrid },
        setup() {
            return { args };
        },
        template: `
            <vs-grid column-gap="16px" row-gap="16px">
                <vs-steps 
                    v-bind="args" 
                />
                <vs-steps 
                    v-bind="args" 
                />
                <vs-steps 
                    v-bind="args" 
                />
                <vs-steps 
                    v-bind="args" 
                />
                <vs-steps 
                    v-bind="args" 
                />
                <vs-steps 
                    v-bind="args" 
                />
            </vs-grid>
        `,
    }),
    args: {
        steps: ['Step 1', 'Step 2', 'Step 3'],
        grid: {
            xs: 12,
            sm: 6,
            md: 4,
            lg: 3,
            xl: 2,
        },
        modelValue: 1,
    },
};

export const ColorScheme: Story = {
    parameters: {
        docs: {
            description: {
                story: '다양한 색상 테마가 적용된 스텝들입니다. colorScheme prop을 사용하여 미리 정의된 색상 조합을 적용할 수 있습니다.',
            },
        },
        chromatic: chromaticParameters.theme,
    },
    render: (args: any) => ({
        components: { VsSteps },
        setup() {
            return { args };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                ${getColorSchemeTemplate(`
                    <vs-steps v-bind="args" color-scheme="{{ color }}" :steps="['Step 1', 'Step 2', 'Step 3']" :model-value="1" />
                `)}
            </div>
        `,
    }),
};

export const StyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: '인라인 스타일 객체를 사용한 커스텀 스텝입니다. styleSet prop에 직접 스타일 객체를 전달하여 세밀한 커스터마이징이 가능합니다.',
            },
        },
    },
    args: {
        steps: ['Custom 1', 'Custom 2', 'Custom 3'],
        styleSet: {
            variables: {
                stepSize: '3rem',
            },
            step: {
                backgroundColor: '#f0f0f0',
                border: '2px dashed #999',
                borderRadius: '8px',
                width: '3rem',
                height: '3rem',
            },
            activeStep: {
                backgroundColor: '#e91e63',
                border: '3px solid #c2185b',
                borderRadius: '50%',
            },
            label: {
                fontSize: '0.875rem',
                color: '#999',
            },
            activeLabel: {
                fontSize: '1rem',
                color: '#e91e63',
                fontWeight: 'bold',
            },
            progress: {
                backgroundColor: '#e0e0e0',
            },
            progressActive: {
                backgroundColor: '#e91e63',
            },
        },
        modelValue: 1,
    },
};

export const PreDefinedStyleSet: Story = {
    parameters: {
        docs: {
            description: {
                story: '미리 정의된 스타일 세트를 사용한 스텝입니다. useVlossom().styleSet에 등록된 스타일을 문자열로 참조하여 재사용할 수 있습니다.',
            },
        },
    },
    args: {
        steps: ['Step 1', 'Step 2', 'Step 3'],
        styleSet: 'myStyleSet',
        modelValue: 1,
    },
};
