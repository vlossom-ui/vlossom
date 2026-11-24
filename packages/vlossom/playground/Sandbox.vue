<template>
    <vs-page class="mb-8" :style-set="{ padding: '0' }">
        <template #title>
            <h1>Hello, Sandbox</h1>
        </template>
    </vs-page>

    <section class="flex flex-col gap-8">
        <h2 class="border-b-2 pb-2 text-2xl font-semibold">useInputFormat</h2>

        <!-- 1. native input -->
        <div>
            <h3 class="mb-3 font-semibold">1. Native &lt;input&gt; + format 종류</h3>
            <vs-grid :grid-size="12" column-gap="1.5rem" row-gap="1.5rem">
                <vs-responsive v-for="field in presets" :key="field.label" :grid="{ xs: 12, md: 6, lg: 4 }">
                    <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">
                        {{ field.label }} — <code>{{ field.fmt }}</code>
                    </label>
                    <input
                        class="w-full rounded border px-2 py-1"
                        :value="field.displayValue"
                        v-on="field.formatListeners"
                    />
                    <div class="mt-1 text-xs text-gray-500">
                        model: <code>{{ JSON.stringify(field.model) }}</code> · formatted:
                        <code>{{ JSON.stringify(field.formattedValue) }}</code> · raw:
                        <code>{{ JSON.stringify(field.rawValue) }}</code> · complete:
                        <code>{{ field.isComplete }}</code>
                    </div>
                </vs-responsive>
            </vs-grid>
        </div>

        <!-- 2. textarea -->
        <div>
            <h3 class="mb-3 font-semibold">2. Native &lt;textarea&gt; (줄바꿈은 입력되지 않음)</h3>
            <textarea
                class="w-full max-w-md rounded border px-2 py-1"
                rows="2"
                :value="textareaField.displayValue"
                v-on="textareaField.formatListeners"
            />
            <div class="mt-1 text-xs text-gray-500">
                model: <code>{{ JSON.stringify(textareaField.model) }}</code>
            </div>
        </div>

        <!-- 3. options -->
        <div>
            <h3 class="mb-3 font-semibold">3. Options (slotChar / autoClear / raw)</h3>
            <vs-grid :grid-size="12" column-gap="1.5rem" row-gap="1.5rem">
                <vs-responsive v-for="field in optionFields" :key="field.label" :grid="{ xs: 12, md: 6, lg: 4 }">
                    <label class="mb-1 block text-sm text-gray-500 dark:text-gray-400">
                        {{ field.label }} — <code>{{ JSON.stringify(field.opts) }}</code>
                    </label>
                    <input
                        class="w-full rounded border px-2 py-1"
                        :value="field.displayValue"
                        v-on="field.formatListeners"
                    />
                    <div class="mt-1 text-xs text-gray-500">
                        model: <code>{{ JSON.stringify(field.model) }}</code> · complete:
                        <code>{{ field.isComplete }}</code>
                    </div>
                </vs-responsive>
            </vs-grid>
        </div>

        <!-- 4. reactive format / options / external model -->
        <div>
            <h3 class="mb-3 font-semibold">4. format · options · 모델을 런타임에 변경</h3>
            <div class="mb-2 flex flex-wrap items-center gap-2">
                <vs-button
                    v-for="preset in formatPresets"
                    :key="preset"
                    size="sm"
                    :primary="dynamicField.fmt === preset"
                    @click="dynamicField.fmt = preset"
                >
                    {{ preset || '(format 없음)' }}
                </vs-button>
            </div>
            <div class="mb-2 flex flex-wrap items-center gap-2">
                <vs-button size="sm" @click="dynamicField.opts = { ...dynamicField.opts, raw: !dynamicField.opts.raw }">
                    raw: {{ !!dynamicField.opts.raw }}
                </vs-button>
                <vs-button size="sm" @click="toggleAutoClear">
                    autoClear: {{ dynamicField.opts.autoClear !== false }}
                </vs-button>
                <vs-button size="sm" @click="dynamicField.model = '01012345678'">외부에서 '01012345678' 주입</vs-button>
                <vs-button size="sm" @click="dynamicField.model = ''">외부에서 비우기</vs-button>
                <vs-button size="sm" @click="dynamicField.model = null">외부에서 null</vs-button>
            </div>
            <input
                class="w-full max-w-md rounded border px-2 py-1"
                :value="dynamicField.displayValue"
                v-on="dynamicField.formatListeners"
            />
            <div class="mt-1 text-xs text-gray-500">
                model: <code>{{ JSON.stringify(dynamicField.model) }}</code> · complete:
                <code>{{ dynamicField.isComplete }}</code>
            </div>
        </div>

        <!-- 5. 직접 바인딩한 핸들러 + 지원하지 않는 type -->
        <div>
            <h3 class="mb-3 font-semibold">5. 직접 바인딩한 @focus / @blur 와 함께 사용</h3>
            <input
                class="w-full max-w-md rounded border px-2 py-1"
                :value="eventField.displayValue"
                v-on="eventField.formatListeners"
                @focus="eventLog.push('focus')"
                @blur="eventLog.push('blur')"
            />
            <div class="mt-1 text-xs text-gray-500">events: {{ eventLog.join(', ') }}</div>
        </div>
        <div>
            <h3 class="mb-3 font-semibold">6. type="number" (경고 출력, 형식 미적용)</h3>
            <input
                type="number"
                class="w-full max-w-md rounded border px-2 py-1"
                :value="numberField.displayValue"
                v-on="numberField.formatListeners"
            />
        </div>

        <vs-divider style-set="playground" />

        <h2 class="border-b-2 pb-2 text-2xl font-semibold">VsInput format</h2>
        <vs-form :grid-size="12" column-gap="1.5rem" row-gap="3rem">
            <vs-input
                v-model="vsPhone"
                label="휴대폰 번호"
                placeholder="010-0000-0000"
                format="999-9999-9999"
                :grid="{ xs: 12, md: 6, lg: 3 }"
            />
            <vs-input
                v-model="vsDate"
                label="날짜 (slotChar)"
                format="9999-99-99"
                :format-options="{ slotChar: 'yyyy-mm-dd' }"
                :grid="{ xs: 12, md: 6, lg: 3 }"
            />
            <vs-input
                v-model="vsRaw"
                label="raw: true"
                format="999-99-99999"
                :format-options="{ raw: true }"
                :grid="{ xs: 12, md: 6, lg: 3 }"
            />
            <vs-input
                v-model="vsKeep"
                label="autoClear: false"
                format="999-9999-9999"
                :format-options="{ autoClear: false }"
                :grid="{ xs: 12, md: 6, lg: 3 }"
            />
            <vs-input
                v-model="vsExt"
                label="선택 입력 (?)"
                format="(999) 999-9999? x99999"
                :grid="{ xs: 12, md: 6, lg: 3 }"
            />
            <vs-input
                v-model="vsSerial"
                label="시리얼 (a, *, 9)"
                format="a*-999-a999"
                :grid="{ xs: 12, md: 6, lg: 3 }"
            />
            <vs-input
                v-model.upper="vsUpper"
                label="modifier upper"
                format="a*-999-a999"
                :grid="{ xs: 12, md: 6, lg: 3 }"
            />
            <vs-input
                v-model="vsRequired"
                label="Required"
                format="999-9999-9999"
                required
                :grid="{ xs: 12, md: 6, lg: 3 }"
            />
            <vs-input
                v-model="vsPassword"
                type="password"
                label="password type"
                format="9999-9999"
                :grid="{ xs: 12, md: 6, lg: 3 }"
            />
            <vs-input
                v-model="vsNumber"
                type="number"
                label="number type (format 무시)"
                format="999-9999-9999"
                :grid="{ xs: 12, md: 6, lg: 3 }"
            />
            <vs-input
                label="Disabled"
                model-value="010-1234-5678"
                format="999-9999-9999"
                disabled
                :grid="{ xs: 12, md: 6, lg: 3 }"
            />
            <vs-input
                label="Readonly"
                model-value="010-1234-5678"
                format="999-9999-9999"
                readonly
                :grid="{ xs: 12, md: 6, lg: 3 }"
            />
            <vs-input v-model="vsPrepend" label="prepend / append" format="999-9999" :grid="{ xs: 12, md: 6, lg: 3 }">
                <template #prepend>☎</template>
                <template #append>번</template>
            </vs-input>
            <vs-input
                v-model="vsExternal"
                label="외부에서 값 주입"
                format="999-9999-9999"
                :grid="{ xs: 12, md: 6, lg: 3 }"
            />
        </vs-form>
        <div class="flex flex-wrap items-center gap-2">
            <vs-button size="sm" @click="vsExternal = '01099998888'">'01099998888' 주입</vs-button>
            <vs-button size="sm" @click="vsExternal = ''">비우기</vs-button>
            <code class="text-xs">
                phone={{ JSON.stringify(vsPhone) }} · date={{ JSON.stringify(vsDate) }} · raw={{
                    JSON.stringify(vsRaw)
                }}
                · keep={{ JSON.stringify(vsKeep) }} · ext={{ JSON.stringify(vsExt) }} · upper={{
                    JSON.stringify(vsUpper)
                }}
                · external={{ JSON.stringify(vsExternal) }}
            </code>
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { useInputFormat, type VsInputFormatOptions } from '@/composables';

function createField(initial: string | null, fmt: string, opts: VsInputFormatOptions = {}, label = '') {
    const model = ref<string | null>(initial);
    const fmtRef = ref(fmt);
    const optsRef = ref<VsInputFormatOptions>(opts);
    return reactive({ label, model, fmt: fmtRef, opts: optsRef, ...useInputFormat(model, fmtRef, optsRef) });
}

export default defineComponent({
    name: 'Sandbox',
    setup() {
        const presets = [
            createField('', '999-9999-9999', {}, '휴대폰 번호'),
            createField('', '9999-99-99', {}, '날짜'),
            createField('', '999-99-99999', {}, '사업자등록번호'),
            createField('', '(999) 999-9999? x99999', {}, '내선 번호 (선택 입력)'),
            createField('', 'a*-999-a999', {}, '시리얼 번호'),
            createField('01012345678', '999-9999-9999', {}, '초기값 정규화'),
        ];
        const textareaField = createField('', '999-9999-9999');

        const optionFields = [
            createField('', '9999/99/99', { slotChar: 'yyyy/mm/dd' }, '자리별 slotChar'),
            createField('', '999-9999-9999', { slotChar: '#' }, '한 글자 slotChar'),
            createField('', '999-9999-9999', { autoClear: false }, 'autoClear: false'),
            createField('', '999-9999-9999', { autoClear: true }, 'autoClear: true (기본값)'),
            createField('', '9999/99/99', { raw: true }, 'raw: true'),
            createField('19900131', '9999/99/99', { raw: true, slotChar: 'yyyy/mm/dd' }, 'raw + 초기값'),
        ];

        const formatPresets = ['999-9999-9999', '9999-99-99', '999-99-99999', ''];
        const dynamicField = createField('010-1234-5678', '999-9999-9999');

        const eventField = createField('', '999-9999-9999');
        const eventLog = ref<string[]>([]);
        const numberField = createField('', '999-9999-9999');

        function toggleAutoClear() {
            dynamicField.opts = { ...dynamicField.opts, autoClear: dynamicField.opts.autoClear === false };
        }

        return {
            presets,
            textareaField,
            optionFields,
            formatPresets,
            dynamicField,
            toggleAutoClear,
            eventField,
            eventLog,
            numberField,
            vsPhone: ref(''),
            vsDate: ref(''),
            vsRaw: ref(''),
            vsKeep: ref(''),
            vsExt: ref(''),
            vsSerial: ref(''),
            vsUpper: ref(''),
            vsRequired: ref(''),
            vsPassword: ref(''),
            vsNumber: ref(null),
            vsPrepend: ref(''),
            vsExternal: ref(''),
        };
    },
});
</script>
