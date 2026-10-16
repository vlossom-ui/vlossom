<template>
    <vs-page class="mb-8" :style-set="{ padding: '0' }">
        <template #title>
            <h1>Hello, Sandbox</h1>
        </template>

        <section class="mb-12">
            <h2 class="mb-4">VsDropzone</h2>

            <h3 class="mt-6 mb-2">1. 기본 (overlay 슬롯)</h3>
            <vs-dropzone @drop="onZoneDrop">
                <div class="p-12 text-center">파일을 이 영역에 드롭하세요</div>
                <template #overlay>파일을 놓으면 업로드됩니다</template>
            </vs-dropzone>
            <p class="mt-2">드롭된 파일: {{ zoneFileNames }}</p>

            <h3 class="mt-10 mb-2">2. 폼 전체를 감싼 dropzone (중첩된 VsFileDrop)</h3>
            <vs-dropzone color-scheme="blue" @drop="(files: File[]) => (zoneForm.attachments = files)">
                <vs-form class="p-4">
                    <vs-input v-model="zoneForm.title" label="제목" />
                    <vs-file-drop v-model="zoneForm.attachments" label="첨부 파일" multiple />
                </vs-form>
                <template #overlay><strong>파일을 놓으면 첨부됩니다</strong></template>
            </vs-dropzone>

            <h3 class="mt-10 mb-2">3. no-overlay (default 슬롯의 dragging 사용)</h3>
            <vs-dropzone no-overlay>
                <template #default="{ dragging }">
                    <div class="p-12 text-center" :style="{ background: dragging ? '#e8f4fd' : 'transparent' }">
                        {{ dragging ? '놓으세요!' : '파일을 드래그하세요' }}
                    </div>
                </template>
            </vs-dropzone>

            <h3 class="mt-10 mb-2">4. disabled</h3>
            <vs-dropzone disabled>
                <div class="p-12 text-center">disabled - 드롭해도 브라우저가 파일을 열지 않아야 함</div>
            </vs-dropzone>
        </section>

        <section class="mb-12">
            <h2 class="mb-4">VsFileDrop</h2>

            <h3 class="mt-6 mb-2">1. 기본</h3>
            <vs-file-drop v-model="file1" label="파일 업로드" />

            <h3 class="mt-10 mb-2">2. placeholder / focus-placeholder</h3>
            <vs-file-drop
                v-model="file2"
                label="업로드"
                placeholder="파일을 여기에 드롭하거나 클릭해서 선택하세요"
                focus-placeholder="여기에 놓으세요"
            />

            <h3 class="mt-10 mb-2">3. multiple (파일 선택된 상태)</h3>
            <vs-file-drop v-model="file3" label="다중 파일" multiple placeholder="여러 파일을 선택하세요" />

            <h3 class="mt-10 mb-2">4. height 지정</h3>
            <vs-file-drop v-model="file4" label="height 200px" multiple height="200px" placeholder="드롭 영역" />

            <h3 class="mt-10 mb-2">5. disabled / readonly (파일 선택된 상태)</h3>
            <div class="flex flex-col gap-6">
                <vs-file-drop v-model="file5" label="disabled" multiple disabled placeholder="disabled" />
                <vs-file-drop v-model="file6" label="readonly" multiple readonly placeholder="readonly" />
            </div>

            <h3 class="mt-10 mb-2">6. state</h3>
            <div class="flex flex-col gap-6">
                <vs-file-drop
                    v-for="s in states"
                    :key="s"
                    v-model="stateFiles[s]"
                    :label="s"
                    :state="s"
                    :placeholder="`state: ${s}`"
                />
            </div>

            <h3 class="mt-10 mb-2">7. color-scheme</h3>
            <div class="flex flex-col gap-6">
                <vs-file-drop v-model="file7" label="red" color-scheme="red" multiple placeholder="red" />
                <vs-file-drop v-model="file8" label="green" color-scheme="green" multiple placeholder="green" />
            </div>

            <h3 class="mt-10 mb-2">8. 유효성 검사 (required, accept=image/*, max=2)</h3>
            <vs-file-drop
                v-model="file9"
                label="이미지 업로드"
                required
                multiple
                accept="image/*"
                :max="2"
                placeholder="이미지를 최대 2개까지 선택하세요"
            />

            <h3 class="mt-10 mb-2">9. style-set</h3>
            <vs-file-drop
                v-model="file10"
                label="custom style-set"
                multiple
                placeholder="커스텀 스타일"
                :style-set="{
                    $dragBackgroundColor: '#e8f4fd',
                    $iconColor: '#0066cc',
                    borderRadius: '12px',
                    $placeholder: { color: '#666' },
                }"
            />

            <h3 class="mt-10 mb-2">10. default slot</h3>
            <vs-file-drop v-model="file11" label="custom slot">
                <template #default="{ dragging }">
                    <div class="p-6 text-center">{{ dragging ? '놓으세요!' : '커스텀 슬롯 콘텐츠' }}</div>
                </template>
            </vs-file-drop>
        </section>
        <section class="mb-12">
            <h2 class="mb-4">VsTabs - 선택 / 해제 애니메이션</h2>

            <h3 class="mt-6 mb-2">1. 기본</h3>
            <vs-tabs v-model="tab1" :tabs />

            <h3 class="mt-10 mb-2">2. primary</h3>
            <vs-tabs v-model="tab2" :tabs primary />

            <h3 class="mt-10 mb-2">3. 특정 탭 disabled (Settings, Billing)</h3>
            <vs-tabs v-model="tab3" :tabs :disabled="isPartialDisabled" />
            <div class="mt-6">
                <vs-tabs v-model="tab3" :tabs primary :disabled="isPartialDisabled" />
            </div>

            <h3 class="mt-10 mb-2">4. 모든 탭 disabled</h3>
            <vs-tabs v-model="tab4" :tabs disabled />
            <div class="mt-6">
                <vs-tabs v-model="tab4" :tabs primary disabled />
            </div>

            <h3 class="mt-10 mb-2">5. vertical (기본 / primary) + 특정 탭 disabled</h3>
            <div class="flex gap-8">
                <div style="width: 200px; height: 280px">
                    <vs-tabs v-model="tab5" :tabs vertical :disabled="isPartialDisabled" />
                </div>
                <div style="width: 200px; height: 280px">
                    <vs-tabs v-model="tab5" :tabs vertical primary :disabled="isPartialDisabled" />
                </div>
            </div>

            <h3 class="mt-10 mb-2">6. color-scheme 변화</h3>
            <vs-tabs v-model="tab6" :tabs color-scheme="red" :disabled="isPartialDisabled" />
            <div class="mt-6">
                <vs-tabs v-model="tab6" :tabs color-scheme="green" primary :disabled="isPartialDisabled" />
            </div>
        </section>
    </vs-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'Sandbox',
    setup() {
        const tabs = ['Home', 'Profile', 'Settings', 'Messages', 'Billing'];
        const isPartialDisabled = (_tab: string, index: number) => index === 2 || index === 4;

        const createFiles = () => [
            new File(['a'.repeat(1024)], 'document.pdf', { type: 'application/pdf' }),
            new File(['b'.repeat(2048 * 1024)], 'very-long-file-name-for-overflow-test-image.png', {
                type: 'image/png',
            }),
            new File(['c'.repeat(512)], 'notes.txt', { type: 'text/plain' }),
        ];
        const states = ['idle', 'info', 'success', 'warning', 'error'] as const;

        const zoneFileNames = ref('');
        function onZoneDrop(files: File[]) {
            zoneFileNames.value = files.map((file) => file.name).join(', ');
        }

        return {
            tabs,
            isPartialDisabled,
            tab1: ref(0),
            tab2: ref(0),
            tab3: ref(1),
            tab4: ref(1),
            tab5: ref(0),
            tab6: ref(0),

            zoneFileNames,
            onZoneDrop,
            zoneForm: ref<{ title: string; attachments: File[] }>({ title: '', attachments: [] }),

            states,
            stateFiles: ref<Record<string, File[]>>(Object.fromEntries(states.map((s) => [s, []]))),
            file1: ref<File[]>([]),
            file2: ref<File[]>([]),
            file3: ref<File[]>(createFiles()),
            file4: ref<File[]>([]),
            file5: ref<File[]>(createFiles()),
            file6: ref<File[]>(createFiles()),
            file7: ref<File[]>(createFiles()),
            file8: ref<File[]>(createFiles()),
            file9: ref<File[]>([]),
            file10: ref<File[]>(createFiles()),
            file11: ref<File[]>([]),
        };
    },
});
</script>
