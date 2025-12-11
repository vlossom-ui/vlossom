<template>
    <vs-layout>
        <vs-header primary position="sticky">
            <div class="header-content">
                <h1 class="header-title">Vlossom Playground</h1>
                <vs-theme-button />
            </div>
        </vs-header>

        <vs-page>
            <template #title>
                <span>Component Playground</span>
            </template>
            <template #description>
                <span>Vlossom 컴포넌트들을 직접 테스트해볼 수 있는 playground</span>
            </template>

            <vs-tabs v-model="activeTab" :tabs="tabs" primary style="margin-bottom: 2rem" />

            <!-- Basic Components -->
            <section v-show="activeTab === 0" class="section">
                <h2 class="section-title">Basic Components</h2>

                <!-- Button -->
                <vs-block>
                    <template #title>VsButton</template>
                    <div class="component-row">
                        <vs-button>Default</vs-button>
                        <vs-button primary>Primary</vs-button>
                        <vs-button outline>Outline</vs-button>
                        <vs-button ghost>Ghost</vs-button>
                        <vs-button disabled>Disabled</vs-button>
                        <vs-button :loading="buttonLoading" @click="triggerLoading">Loading</vs-button>
                        <vs-button small>Small</vs-button>
                        <vs-button large>Large</vs-button>
                        <vs-button circle>C</vs-button>
                    </div>
                </vs-block>

                <!-- Chip -->
                <vs-block>
                    <template #title>VsChip</template>
                    <div class="component-row">
                        <vs-chip>Default Chip</vs-chip>
                        <vs-chip primary>Primary</vs-chip>
                        <vs-chip outline>Outline</vs-chip>
                        <vs-chip small>Small</vs-chip>
                        <vs-chip closable @close="onChipClose">Closable</vs-chip>
                        <vs-chip color-scheme="red">Red</vs-chip>
                        <vs-chip color-scheme="blue">Blue</vs-chip>
                        <vs-chip color-scheme="green">Green</vs-chip>
                    </div>
                </vs-block>

                <!-- Avatar -->
                <vs-block>
                    <template #title>VsAvatar</template>
                    <div class="component-row">
                        <vs-avatar>A</vs-avatar>
                        <vs-avatar color-scheme="blue">B</vs-avatar>
                        <vs-avatar color-scheme="green">C</vs-avatar>
                        <vs-avatar color-scheme="red">D</vs-avatar>
                        <vs-avatar :style-set="{ width: '60px', height: '60px' }">XL</vs-avatar>
                    </div>
                </vs-block>

                <!-- Loading -->
                <vs-block>
                    <template #title>VsLoading</template>
                    <div class="component-row">
                        <vs-loading width="30px" height="30px" />
                        <vs-loading width="50px" height="50px" color-scheme="blue" />
                        <vs-loading width="70px" height="70px" color-scheme="green" />
                    </div>
                </vs-block>

                <!-- Skeleton -->
                <vs-block>
                    <template #title>VsSkeleton</template>
                    <div class="component-row">
                        <vs-skeleton :style-set="{ width: '100px', height: '20px' }" />
                        <vs-skeleton :style-set="{ width: '150px', height: '20px' }" />
                        <vs-skeleton :style-set="{ width: '50px', height: '50px', borderRadius: '50%' }" />
                    </div>
                </vs-block>

                <!-- Divider -->
                <vs-block>
                    <template #title>VsDivider</template>
                    <div style="display: flex; flex-direction: column; gap: 1rem">
                        <vs-divider />
                        <div style="display: flex; align-items: center; gap: 1rem; height: 40px">
                            <span>Item 1</span>
                            <vs-divider vertical />
                            <span>Item 2</span>
                            <vs-divider vertical />
                            <span>Item 3</span>
                        </div>
                    </div>
                </vs-block>

                <!-- Toggle -->
                <vs-block>
                    <template #title>VsToggle</template>
                    <div class="component-row">
                        <vs-toggle v-model="toggleValue">
                            {{ toggleValue ? 'ON' : 'OFF' }}
                        </vs-toggle>
                        <vs-toggle v-model="toggleValue" primary>Primary</vs-toggle>
                    </div>
                </vs-block>
            </section>

            <!-- Form Components -->
            <section v-show="activeTab === 1" class="section">
                <h2 class="section-title">Form Components</h2>

                <vs-form class="form-container">
                    <!-- Input -->
                    <vs-block>
                        <template #title>VsInput</template>
                        <vs-grid :grid-size="12" column-gap="1rem" row-gap="1rem">
                            <vs-input v-model="inputText" label="Text Input" placeholder="Enter text..." :grid="6" />
                            <vs-input
                                v-model="inputNumber"
                                type="number"
                                label="Number Input"
                                placeholder="Enter number..."
                                :grid="6"
                            />
                            <vs-input
                                v-model="inputPassword"
                                type="password"
                                label="Password"
                                placeholder="Enter password..."
                                :grid="6"
                            />
                            <vs-input label="Disabled" placeholder="Disabled input" disabled :grid="6" />
                            <vs-input
                                label="Readonly"
                                placeholder="Readonly input"
                                readonly
                                model-value="Readonly"
                                :grid="6"
                            />
                            <vs-input label="Required" placeholder="Required field" required :grid="6" />
                        </vs-grid>
                    </vs-block>

                    <!-- Search Input -->
                    <vs-block>
                        <template #title>VsSearchInput</template>
                        <vs-search-input v-model="searchText" placeholder="Search..." />
                    </vs-block>

                    <!-- Textarea -->
                    <vs-block>
                        <template #title>VsTextarea</template>
                        <vs-textarea v-model="textareaValue" label="Description" placeholder="Enter description..." />
                    </vs-block>

                    <!-- Checkbox -->
                    <vs-block>
                        <template #title>VsCheckbox & VsCheckboxSet</template>
                        <div style="display: flex; flex-direction: column; gap: 1rem">
                            <vs-checkbox v-model="checkboxValue" check-label="Single Checkbox" />
                            <vs-checkbox-set
                                v-model="checkboxSetValue"
                                label="Checkbox Set"
                                :options="['Option A', 'Option B', 'Option C']"
                            />
                        </div>
                    </vs-block>

                    <!-- Radio -->
                    <vs-block>
                        <template #title>VsRadioSet</template>
                        <vs-radio-set
                            v-model="radioValue"
                            label="Select Option"
                            :options="['Option 1', 'Option 2', 'Option 3']"
                        />
                    </vs-block>

                    <!-- Switch -->
                    <vs-block>
                        <template #title>VsSwitch</template>
                        <div class="component-row">
                            <vs-switch v-model="switchValue" label="Switch" />
                            <vs-switch v-model="switchValue2" label="Custom Labels" true-label="Yes" false-label="No" />
                        </div>
                    </vs-block>

                    <!-- File Drop -->
                    <vs-block>
                        <template #title>VsFileDrop</template>
                        <vs-file-drop v-model="files" label="Upload Files" placeholder="Drop files here" multiple />
                    </vs-block>
                </vs-form>
            </section>

            <!-- Data Display -->
            <section v-show="activeTab === 2" class="section">
                <h2 class="section-title">Data Display</h2>

                <!-- Progress -->
                <vs-block>
                    <template #title>VsProgress</template>
                    <div style="display: flex; flex-direction: column; gap: 1rem">
                        <vs-progress :value="progressValue" :max="100" :label="`${progressValue}%`" />
                        <vs-progress :value="0.7" color-scheme="green" />
                        <vs-progress :value="0.4" color-scheme="blue" />
                        <vs-button small @click="progressValue = Math.min(100, progressValue + 10)">Increase</vs-button>
                    </div>
                </vs-block>

                <!-- Steps -->
                <vs-block>
                    <template #title>VsSteps</template>
                    <vs-steps v-model="stepValue" :steps="['Step 1', 'Step 2', 'Step 3', 'Step 4']" />
                    <div class="component-row" style="margin-top: 1rem">
                        <vs-button small @click="stepValue = Math.max(0, stepValue - 1)">Prev</vs-button>
                        <vs-button small @click="stepValue = Math.min(3, stepValue + 1)">Next</vs-button>
                    </div>
                </vs-block>

                <!-- Pagination -->
                <vs-block>
                    <template #title>VsPagination</template>
                    <vs-pagination v-model="pageValue" :length="20" :showing-length="5" edge-buttons />
                    <p style="margin-top: 0.5rem">Current Page: {{ pageValue + 1 }}</p>
                </vs-block>

                <!-- Label Value -->
                <vs-block>
                    <template #title>VsLabelValue</template>
                    <vs-grid :grid-size="12" row-gap="0.5rem">
                        <vs-label-value :grid="12">
                            <template #label>Name</template>
                            Vlossom
                        </vs-label-value>
                        <vs-label-value :grid="12">
                            <template #label>Version</template>
                            2.0.0
                        </vs-label-value>
                        <vs-label-value :grid="12" primary>
                            <template #label>Status</template>
                            Active
                        </vs-label-value>
                    </vs-grid>
                </vs-block>

                <!-- Text Wrap -->
                <vs-block>
                    <template #title>VsTextWrap</template>
                    <vs-text-wrap copy>Copy this text to clipboard</vs-text-wrap>
                    <vs-text-wrap link="https://github.com" style="margin-top: 0.5rem">Open GitHub</vs-text-wrap>
                </vs-block>

                <!-- Image -->
                <vs-block>
                    <template #title>VsImage</template>
                    <div class="component-row">
                        <vs-image
                            src="https://picsum.photos/200/200"
                            alt="Sample Image"
                            :style-set="{ width: '150px', height: '150px' }"
                        />
                        <vs-image
                            src="https://picsum.photos/201/201"
                            alt="Lazy Image"
                            lazy
                            :style-set="{ width: '150px', height: '150px' }"
                        />
                    </div>
                </vs-block>

                <!-- Message -->
                <vs-block>
                    <template #title>VsMessage</template>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem">
                        <vs-message state="info" text="This is an info message" />
                        <vs-message state="success" text="This is a success message" />
                        <vs-message state="warning" text="This is a warning message" />
                        <vs-message state="error" text="This is an error message" />
                    </div>
                </vs-block>
            </section>

            <!-- Layout Components -->
            <section v-show="activeTab === 3" class="section">
                <h2 class="section-title">Layout Components</h2>

                <!-- Grid -->
                <vs-block>
                    <template #title>VsGrid</template>
                    <vs-grid :grid-size="12" column-gap="0.5rem" row-gap="0.5rem">
                        <div :style="gridItemStyle" style="grid-column: span 12">12 columns</div>
                        <div :style="gridItemStyle" style="grid-column: span 6">6 columns</div>
                        <div :style="gridItemStyle" style="grid-column: span 6">6 columns</div>
                        <div :style="gridItemStyle" style="grid-column: span 4">4 columns</div>
                        <div :style="gridItemStyle" style="grid-column: span 4">4 columns</div>
                        <div :style="gridItemStyle" style="grid-column: span 4">4 columns</div>
                        <div :style="gridItemStyle" style="grid-column: span 3">3 col</div>
                        <div :style="gridItemStyle" style="grid-column: span 3">3 col</div>
                        <div :style="gridItemStyle" style="grid-column: span 3">3 col</div>
                        <div :style="gridItemStyle" style="grid-column: span 3">3 col</div>
                    </vs-grid>
                </vs-block>

                <!-- Block -->
                <vs-block>
                    <template #title>VsBlock Examples</template>
                    <vs-grid :grid-size="12" column-gap="1rem" row-gap="1rem">
                        <vs-block :grid="4" color-scheme="blue">
                            <template #title>Blue Block</template>
                            Content here
                        </vs-block>
                        <vs-block :grid="4" color-scheme="green">
                            <template #title>Green Block</template>
                            Content here
                        </vs-block>
                        <vs-block :grid="4" color-scheme="red">
                            <template #title>Red Block</template>
                            Content here
                        </vs-block>
                    </vs-grid>
                </vs-block>

                <!-- Bar -->
                <vs-block>
                    <template #title>VsBar</template>
                    <vs-bar primary :style-set="{ padding: '1rem' }">This is a Bar component</vs-bar>
                </vs-block>

                <!-- Accordion -->
                <vs-block>
                    <template #title>VsAccordion</template>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem">
                        <vs-accordion v-model="accordion1">
                            <template #title>Accordion Item 1</template>
                            Content for accordion item 1
                        </vs-accordion>
                        <vs-accordion v-model="accordion2">
                            <template #title>Accordion Item 2</template>
                            Content for accordion item 2
                        </vs-accordion>
                        <vs-accordion v-model="accordion3" disabled>
                            <template #title>Disabled Accordion</template>
                            This content is disabled
                        </vs-accordion>
                    </div>
                </vs-block>

                <!-- Expandable -->
                <vs-block>
                    <template #title>VsExpandable</template>
                    <vs-button small @click="expandableOpen = !expandableOpen">
                        {{ expandableOpen ? 'Collapse' : 'Expand' }}
                    </vs-button>
                    <vs-expandable :open="expandableOpen">
                        <div
                            style="padding: 1rem; background: var(--vs-area-bg); margin-top: 0.5rem; border-radius: 8px"
                        >
                            This content can be expanded or collapsed
                        </div>
                    </vs-expandable>
                </vs-block>

                <!-- Inner Scroll -->
                <vs-block>
                    <template #title>VsInnerScroll</template>
                    <vs-inner-scroll style="height: 150px; border: 1px solid var(--vs-line-color); border-radius: 8px">
                        <template #header>
                            <div style="padding: 0.5rem; background: var(--vs-area-bg)">Fixed Header</div>
                        </template>
                        <div style="padding: 1rem">
                            <p v-for="i in 10" :key="i">Scrollable content line {{ i }}</p>
                        </div>
                        <template #footer>
                            <div style="padding: 0.5rem; background: var(--vs-area-bg)">Fixed Footer</div>
                        </template>
                    </vs-inner-scroll>
                </vs-block>
            </section>

            <!-- Overlay Components -->
            <section v-show="activeTab === 4" class="section">
                <h2 class="section-title">Overlay Components</h2>

                <!-- Modal -->
                <vs-block>
                    <template #title>VsModal</template>
                    <vs-button @click="modalOpen = true">Open Modal</vs-button>
                    <vs-modal v-model="modalOpen" :size="{ width: '500px', height: 'auto' }">
                        <div style="padding: 2rem">
                            <h3 style="margin-bottom: 1rem">Modal Title</h3>
                            <p style="margin-bottom: 1rem">This is modal content. You can put anything here.</p>
                            <vs-button @click="modalOpen = false">Close</vs-button>
                        </div>
                    </vs-modal>
                </vs-block>

                <!-- Drawer -->
                <vs-block>
                    <template #title>VsDrawer</template>
                    <div class="component-row">
                        <vs-button @click="drawerLeft = true">Left Drawer</vs-button>
                        <vs-button @click="drawerRight = true">Right Drawer</vs-button>
                        <vs-button @click="drawerTop = true">Top Drawer</vs-button>
                        <vs-button @click="drawerBottom = true">Bottom Drawer</vs-button>
                    </div>
                    <vs-drawer v-model="drawerLeft" placement="left" dimmed dim-close>
                        <template #header>
                            <div style="padding: 1rem; font-weight: bold">Left Drawer</div>
                        </template>
                        <div style="padding: 1rem">Drawer content here</div>
                    </vs-drawer>
                    <vs-drawer v-model="drawerRight" placement="right" dimmed dim-close>
                        <template #header>
                            <div style="padding: 1rem; font-weight: bold">Right Drawer</div>
                        </template>
                        <div style="padding: 1rem">Drawer content here</div>
                    </vs-drawer>
                    <vs-drawer v-model="drawerTop" placement="top" dimmed dim-close size="200px">
                        <div style="padding: 1rem">Top Drawer content</div>
                    </vs-drawer>
                    <vs-drawer v-model="drawerBottom" placement="bottom" dimmed dim-close size="200px">
                        <div style="padding: 1rem">Bottom Drawer content</div>
                    </vs-drawer>
                </vs-block>

                <!-- Tooltip -->
                <vs-block>
                    <template #title>VsTooltip</template>
                    <div class="component-row">
                        <vs-tooltip placement="top">
                            <vs-button>Top</vs-button>
                            <template #tooltip>Tooltip on top</template>
                        </vs-tooltip>
                        <vs-tooltip placement="right">
                            <vs-button>Right</vs-button>
                            <template #tooltip>Tooltip on right</template>
                        </vs-tooltip>
                        <vs-tooltip placement="bottom">
                            <vs-button>Bottom</vs-button>
                            <template #tooltip>Tooltip on bottom</template>
                        </vs-tooltip>
                        <vs-tooltip placement="left">
                            <vs-button>Left</vs-button>
                            <template #tooltip>Tooltip on left</template>
                        </vs-tooltip>
                        <vs-tooltip clickable>
                            <vs-button>Clickable</vs-button>
                            <template #tooltip>Click to toggle</template>
                        </vs-tooltip>
                    </div>
                </vs-block>

                <!-- Dimmed -->
                <vs-block>
                    <template #title>VsDimmed</template>
                    <vs-button @click="dimmedOpen = true">Show Dimmed</vs-button>
                    <vs-dimmed v-model="dimmedOpen" @click="dimmedOpen = false" />
                </vs-block>

                <!-- Toast (via plugin) -->
                <vs-block>
                    <template #title>Toast Plugin</template>
                    <div class="component-row">
                        <vs-button @click="showToast('info')">Info Toast</vs-button>
                        <vs-button @click="showToast('success')">Success Toast</vs-button>
                        <vs-button @click="showToast('warning')">Warning Toast</vs-button>
                        <vs-button @click="showToast('error')">Error Toast</vs-button>
                    </div>
                </vs-block>
            </section>

            <!-- Utility Components -->
            <section v-show="activeTab === 5" class="section">
                <h2 class="section-title">Utility Components</h2>

                <!-- Index View -->
                <vs-block>
                    <template #title>VsIndexView</template>
                    <vs-tabs
                        v-model="indexViewTab"
                        :tabs="['View 1', 'View 2', 'View 3']"
                        style="margin-bottom: 1rem"
                    />
                    <vs-index-view :index="indexViewTab">
                        <template #0>
                            <div style="padding: 1rem; background: var(--vs-area-bg); border-radius: 8px">
                                Content for View 1
                            </div>
                        </template>
                        <template #1>
                            <div style="padding: 1rem; background: var(--vs-area-bg); border-radius: 8px">
                                Content for View 2
                            </div>
                        </template>
                        <template #2>
                            <div style="padding: 1rem; background: var(--vs-area-bg); border-radius: 8px">
                                Content for View 3
                            </div>
                        </template>
                    </vs-index-view>
                </vs-block>

                <!-- Focus Trap -->
                <vs-block>
                    <template #title>VsFocusTrap</template>
                    <vs-focus-trap :focus-lock="focusTrapActive">
                        <div style="padding: 1rem; border: 2px dashed var(--vs-line-color); border-radius: 8px">
                            <p style="margin-bottom: 0.5rem">
                                Focus trap {{ focusTrapActive ? 'active' : 'inactive' }}
                            </p>
                            <vs-button small @click="focusTrapActive = !focusTrapActive">
                                {{ focusTrapActive ? 'Deactivate' : 'Activate' }} Focus Trap
                            </vs-button>
                            <vs-input label="Input 1" style="margin-top: 0.5rem" />
                            <vs-input label="Input 2" style="margin-top: 0.5rem" />
                        </div>
                    </vs-focus-trap>
                </vs-block>

                <!-- Responsive -->
                <vs-block>
                    <template #title>VsResponsive</template>
                    <vs-responsive width="100%" :grid="12">
                        <div :style="gridItemStyle">Full width responsive container</div>
                    </vs-responsive>
                    <vs-responsive width="50%" style="margin-top: 0.5rem">
                        <div :style="gridItemStyle">50% width responsive container</div>
                    </vs-responsive>
                </vs-block>

                <!-- Visible Render -->
                <vs-block>
                    <template #title>VsVisibleRender</template>
                    <vs-visible-render>
                        <div style="padding: 1rem; background: var(--vs-area-bg); border-radius: 8px">
                            This content renders when visible in viewport (lazy rendering)
                        </div>
                    </vs-visible-render>
                </vs-block>

                <!-- Container -->
                <vs-block>
                    <template #title>VsContainer</template>
                    <vs-container>
                        <div style="padding: 1rem; background: var(--vs-area-bg); border-radius: 8px">
                            Content inside VsContainer
                        </div>
                    </vs-container>
                </vs-block>
            </section>

            <!-- Sandbox Area -->
            <section v-show="activeTab === 6" class="section">
                <h2 class="section-title">Sandbox</h2>
                <vs-block>
                    <template #title>Your Sandbox Area</template>
                    <p style="margin-bottom: 1rem; color: var(--vs-font-color-sub)">
                        자유롭게 컴포넌트를 테스트해보세요. 아래 영역에서 직접 코드를 작성하거나 컴포넌트를 추가할 수
                        있습니다.
                    </p>
                    <div class="sandbox-area">
                        <!-- Add your sandbox components here -->
                        <vs-grid :grid-size="12" column-gap="1rem" row-gap="1rem">
                            <vs-input v-model="sandboxInput" label="Sandbox Input" :grid="6" />
                            <vs-button @click="sandboxAction" :grid="6" style="align-self: end">Action</vs-button>
                        </vs-grid>

                        <vs-divider style="margin: 1rem 0" />

                        <vs-message v-if="sandboxMessage" :state="sandboxMessageState" :text="sandboxMessage" />
                    </div>
                </vs-block>
            </section>
        </vs-page>

        <vs-footer primary position="sticky">
            <div class="footer-content">
                <span>Vlossom Component Library</span>
            </div>
        </vs-footer>
    </vs-layout>
</template>

<script lang="ts">
import { defineComponent, ref, type CSSProperties, type Ref } from 'vue';
import { useVlossom } from '../src/framework';
import type { UIState } from '../src/declaration';

type ToastState = 'info' | 'success' | 'warning' | 'error';

import VsAccordion from '../src/components/vs-accordion/VsAccordion.vue';
import VsAvatar from '../src/components/vs-avatar/VsAvatar.vue';
import VsBar from '../src/components/vs-bar/VsBar.vue';
import VsBlock from '../src/components/vs-block/VsBlock.vue';
import VsButton from '../src/components/vs-button/VsButton.vue';
import VsCheckbox from '../src/components/vs-checkbox/VsCheckbox.vue';
import VsCheckboxSet from '../src/components/vs-checkbox/VsCheckboxSet.vue';
import VsChip from '../src/components/vs-chip/VsChip.vue';
import VsContainer from '../src/components/vs-container/VsContainer.vue';
import VsDimmed from '../src/components/vs-dimmed/VsDimmed.vue';
import VsDivider from '../src/components/vs-divider/VsDivider.vue';
import VsDrawer from '../src/components/vs-drawer/VsDrawer.vue';
import VsExpandable from '../src/components/vs-expandable/VsExpandable.vue';
import VsFileDrop from '../src/components/vs-file-drop/VsFileDrop.vue';
import VsFocusTrap from '../src/components/vs-focus-trap/VsFocusTrap.vue';
import VsFooter from '../src/components/vs-footer/VsFooter.vue';
import VsForm from '../src/components/vs-form/VsForm.vue';
import VsGrid from '../src/components/vs-grid/VsGrid.vue';
import VsHeader from '../src/components/vs-header/VsHeader.vue';
import VsImage from '../src/components/vs-image/VsImage.vue';
import VsIndexView from '../src/components/vs-index-view/VsIndexView.vue';
import VsInnerScroll from '../src/components/vs-inner-scroll/VsInnerScroll.vue';
import VsInput from '../src/components/vs-input/VsInput.vue';
import VsLabelValue from '../src/components/vs-label-value/VsLabelValue.vue';
import VsLayout from '../src/components/vs-layout/VsLayout.vue';
import VsLoading from '../src/components/vs-loading/VsLoading.vue';
import VsMessage from '../src/components/vs-message/VsMessage.vue';
import VsModal from '../src/components/vs-modal/VsModal.vue';
import VsPage from '../src/components/vs-page/VsPage.vue';
import VsPagination from '../src/components/vs-pagination/VsPagination.vue';
import VsProgress from '../src/components/vs-progress/VsProgress.vue';
import VsRadioSet from '../src/components/vs-radio/VsRadioSet.vue';
import VsResponsive from '../src/components/vs-responsive/VsResponsive.vue';
import VsSearchInput from '../src/components/vs-search-input/VsSearchInput.vue';
import VsSkeleton from '../src/components/vs-skeleton/VsSkeleton.vue';
import VsSteps from '../src/components/vs-steps/VsSteps.vue';
import VsSwitch from '../src/components/vs-switch/VsSwitch.vue';
import VsTabs from '../src/components/vs-tabs/VsTabs.vue';
import VsTextarea from '../src/components/vs-textarea/VsTextarea.vue';
import VsTextWrap from '../src/components/vs-text-wrap/VsTextWrap.vue';
import VsThemeButton from '../src/components/vs-theme-button/VsThemeButton.vue';
import VsToggle from '../src/components/vs-toggle/VsToggle.vue';
import VsTooltip from '../src/components/vs-tooltip/VsTooltip.vue';
import VsVisibleRender from '../src/components/vs-visible-render/VsVisibleRender.vue';

export default defineComponent({
    name: 'App',
    components: {
        VsAccordion,
        VsAvatar,
        VsBar,
        VsBlock,
        VsButton,
        VsCheckbox,
        VsCheckboxSet,
        VsChip,
        VsContainer,
        VsDimmed,
        VsDivider,
        VsDrawer,
        VsExpandable,
        VsFileDrop,
        VsFocusTrap,
        VsFooter,
        VsForm,
        VsGrid,
        VsHeader,
        VsImage,
        VsIndexView,
        VsInnerScroll,
        VsInput,
        VsLabelValue,
        VsLayout,
        VsLoading,
        VsMessage,
        VsModal,
        VsPage,
        VsPagination,
        VsProgress,
        VsRadioSet,
        VsResponsive,
        VsSearchInput,
        VsSkeleton,
        VsSteps,
        VsSwitch,
        VsTabs,
        VsTextarea,
        VsTextWrap,
        VsThemeButton,
        VsToggle,
        VsTooltip,
        VsVisibleRender,
    },
    setup() {
        const $vs = useVlossom();

        // Tab navigation
        const tabs = ['Basic', 'Form', 'Data Display', 'Layout', 'Overlay', 'Utility', 'Sandbox'];
        const activeTab = ref(0);

        // Basic components state
        const buttonLoading = ref(false);
        const toggleValue = ref(false);

        // Form components state
        const inputText = ref('');
        const inputNumber: Ref<number | null> = ref(null);
        const inputPassword = ref('');
        const searchText = ref('');
        const textareaValue = ref('');
        const checkboxValue = ref(false);
        const checkboxSetValue: Ref<string[]> = ref([]);
        const radioValue = ref(null);
        const switchValue = ref(false);
        const switchValue2 = ref(false);
        const files: Ref<File[]> = ref([]);

        // Data display state
        const progressValue = ref(30);
        const stepValue = ref(0);
        const pageValue = ref(0);

        // Layout state
        const accordion1 = ref(false);
        const accordion2 = ref(false);
        const accordion3 = ref(false);
        const expandableOpen = ref(false);

        // Overlay state
        const modalOpen = ref(false);
        const drawerLeft = ref(false);
        const drawerRight = ref(false);
        const drawerTop = ref(false);
        const drawerBottom = ref(false);
        const dimmedOpen = ref(false);

        // Utility state
        const indexViewTab = ref(0);
        const focusTrapActive = ref(false);

        // Sandbox state
        const sandboxInput = ref('');
        const sandboxMessage = ref('');
        const sandboxMessageState: Ref<UIState> = ref('info');

        // Grid item style
        const gridItemStyle: CSSProperties = {
            padding: '0.75rem',
            background: 'var(--vs-area-bg)',
            borderRadius: '4px',
            textAlign: 'center',
            fontSize: '0.875rem',
        };

        // Methods
        function triggerLoading() {
            buttonLoading.value = true;
            setTimeout(() => {
                buttonLoading.value = false;
            }, 2000);
        }

        function onChipClose() {
            $vs.toast.info('Chip closed!');
        }

        function showToast(state: ToastState) {
            const messages: Record<ToastState, string> = {
                info: 'This is an info toast message',
                success: 'Operation completed successfully!',
                warning: 'Warning: Please check your input',
                error: 'Error: Something went wrong',
            };
            $vs.toast[state](messages[state]);
        }

        function sandboxAction() {
            if (sandboxInput.value.trim()) {
                sandboxMessage.value = `Input: "${sandboxInput.value}"`;
                sandboxMessageState.value = 'success';
            } else {
                sandboxMessage.value = 'Please enter something in the input field';
                sandboxMessageState.value = 'warning';
            }
        }

        return {
            // Navigation
            tabs,
            activeTab,

            // Basic
            buttonLoading,
            toggleValue,
            triggerLoading,
            onChipClose,

            // Form
            inputText,
            inputNumber,
            inputPassword,
            searchText,
            textareaValue,
            checkboxValue,
            checkboxSetValue,
            radioValue,
            switchValue,
            switchValue2,
            files,

            // Data Display
            progressValue,
            stepValue,
            pageValue,

            // Layout
            accordion1,
            accordion2,
            accordion3,
            expandableOpen,
            gridItemStyle,

            // Overlay
            modalOpen,
            drawerLeft,
            drawerRight,
            drawerTop,
            drawerBottom,
            dimmedOpen,
            showToast,

            // Utility
            indexViewTab,
            focusTrapActive,

            // Sandbox
            sandboxInput,
            sandboxMessage,
            sandboxMessageState,
            sandboxAction,
        };
    },
});
</script>

<style>
.header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0 1.5rem;
    height: 100%;
}

.header-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
}

.footer-content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: 0.875rem;
}

.section {
    margin-bottom: 2rem;
}

.section-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--vs-line-color);
}

.component-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
}

.form-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.sandbox-area {
    padding: 1.5rem;
    background: var(--vs-area-bg);
    border-radius: 8px;
    min-height: 200px;
}
</style>
