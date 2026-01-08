import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { colorScheme } from '@/storybook';
import { ref } from 'vue';
import VsSelect from './../VsSelect.vue';

const meta: Meta<typeof VsSelect> = {
    title: 'Chromatic/Input Components/VsSelect',
    component: VsSelect,
    render: (args: any) => ({
        components: { VsSelect },
        setup() {
            const basicOptions = ['Apple', 'Banana', 'Orange', 'Mango', 'Pineapple'];
            const objectOptions = [
                { id: 1, name: 'Apple', category: 'Fruits' },
                { id: 2, name: 'Banana', category: 'Fruits' },
                { id: 3, name: 'Carrot', category: 'Vegetables' },
                { id: 4, name: 'Broccoli', category: 'Vegetables' },
            ];
            const messages = [{ state: 'success', text: 'This is success message' }];
            const modelValue = ref('Apple');
            const multipleValue = ref(['Apple', 'Banana']);

            return { args, basicOptions, objectOptions, messages, modelValue, multipleValue };
        },
        template: `
            <div style="display: flex; flex-direction: column; gap: 2rem;">
                <!-- 기본 스타일 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">기본 스타일</h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <vs-select :options="basicOptions" placeholder="Basic Select" model-value="Apple" />
                        <vs-select :options="basicOptions" label="With Label" placeholder="Select an option" model-value="Apple" />
                    </div>
                </div>

                <!-- 상태 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">상태</h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <vs-select :options="basicOptions" label="Disabled" model-value="Apple" disabled />
                        <vs-select :options="basicOptions" label="Readonly" model-value="Apple" readonly />
                        <vs-select :options="basicOptions" label="Required" placeholder="Required field" required />
                    </div>
                </div>

                <!-- 크기 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">크기</h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <vs-select :options="basicOptions" label="Small" placeholder="Small select" model-value="Apple" small />
                    </div>
                </div>

                <!-- 검증 상태 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">검증 상태</h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <vs-select :options="basicOptions" label="Success" model-value="Apple" state="success" />
                        <vs-select :options="basicOptions" label="Error" model-value="Apple" state="error" />
                    </div>
                </div>

                <!-- 추가 기능 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">추가 기능</h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <vs-select :options="basicOptions" label="No Clear" model-value="Apple" no-clear />
                        <vs-select :options="basicOptions" label="With Search" placeholder="Search..." model-value="Apple" search />
                        <vs-select :options="basicOptions" label="With Messages" :messages="messages" model-value="Apple" />
                    </div>
                </div>

                <!-- 다중 선택 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">다중 선택</h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <vs-select :options="basicOptions" label="Multiple" placeholder="Multiple select" :model-value="['Apple', 'Banana']" multiple />
                        <vs-select :options="basicOptions" label="Multiple with Select All" :model-value="['Apple', 'Banana']" multiple select-all />
                        <vs-select :options="basicOptions" label="Multiple with Closable Chips" :model-value="['Apple', 'Banana']" multiple closable-chips />
                        <vs-select :options="basicOptions" label="Multiple with Collapse Chips" :model-value="['Apple', 'Banana', 'Orange']" multiple collapse-chips />
                        <vs-select :options="basicOptions" label="Multiple with Min/Max" :model-value="['Apple']" multiple :min="2" :max="3" />
                    </div>
                </div>

                <!-- 객체 옵션 & 그룹화 -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;">객체 옵션 & 그룹화</h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <vs-select :options="objectOptions" label="With Object Options" option-label="name" option-value="id" :model-value="1" />
                        <vs-select :options="objectOptions" label="With Groups" option-label="name" option-value="id" :group-by="(option) => option.category" :model-value="1" />
                    </div>
                </div>
            </div>
        `,
    }),
    argTypes: {
        colorScheme,
    },
};

export default meta;
type Story = StoryObj<typeof VsSelect>;

export const Default: Story = {};
