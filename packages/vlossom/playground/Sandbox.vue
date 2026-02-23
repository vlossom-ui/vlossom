<template>
    <div class="flex flex-col gap-12 p-6">
        <!-- ① 기본 테이블 -->
        <section>
            <h2 class="section-title">1. 기본 테이블</h2>
            <p class="section-desc">sortable 컬럼을 클릭해 정렬</p>
            <vs-table :columns="empCols" :items="employees" />
        </section>

        <!-- ② 선택 기능 -->
        <section>
            <h2 class="section-title">2. 선택 기능 (selectable)</h2>
            <p class="section-desc">체크박스로 행을 선택합니다</p>
            <div v-if="selectedEmployees.length" class="mb-3 text-sm text-gray-500">
                선택된 항목: {{ selectedEmployees.map((e) => e.name).join(', ') }}
            </div>
            <vs-table
                no-responsive
                :columns="empCols"
                :items="employees"
                :selectable="() => true"
                v-model:selectedItems="selectedEmployees"
            />
        </section>

        <!-- ③ 확장 패널 -->
        <section>
            <h2 class="section-title">3. 확장 패널 (expandable)</h2>
            <p class="section-desc">행을 클릭해 상세 정보를 펼칩니다</p>
            <vs-table :columns="empCols" :items="employees" :expandable="() => true">
                <template #expand="{ cells }">
                    <div class="grid grid-cols-3 gap-4 p-4 text-sm">
                        <div>
                            <span class="font-medium text-gray-500">이름</span>
                            <p>{{ cells[0]?.item.name }}</p>
                        </div>
                        <div>
                            <span class="font-medium text-gray-500">직책</span>
                            <p>{{ cells[0]?.item.role }}</p>
                        </div>
                        <div>
                            <span class="font-medium text-gray-500">부서</span>
                            <p>{{ cells[0]?.item.dept }}</p>
                        </div>
                        <div>
                            <span class="font-medium text-gray-500">연봉</span>
                            <p>{{ cells[0]?.item.salary }}</p>
                        </div>
                        <div>
                            <span class="font-medium text-gray-500">이메일</span>
                            <p>{{ cells[0]?.item.email }}</p>
                        </div>
                    </div>
                </template>
            </vs-table>
        </section>

        <!-- ④ 드래그 정렬 -->
        <section>
            <h2 class="section-title">4. 드래그 정렬 (draggable)</h2>
            <p class="section-desc">행을 드래그해 순서를 변경합니다</p>
            <vs-table :columns="empCols" :items="employees" draggable />
        </section>

        <!-- ⑤ 검색 -->
        <section>
            <h2 class="section-title">5. 검색 (search)</h2>
            <p class="section-desc">검색창에 키워드를 입력해 필터링합니다</p>
            <vs-table :columns="empCols" :items="manyEmployees" search />
        </section>

        <!-- ⑥ 페이지네이션 -->
        <section>
            <h2 class="section-title">6. 페이지네이션 (pagination)</h2>
            <p class="section-desc">페이지당 표시 수를 선택하고 페이지를 이동합니다</p>
            <vs-table :columns="empCols" :items="manyEmployees" pagination v-model:pageSize="pageSize" />
        </section>

        <!-- ⑦ 검색 + 페이지네이션 조합 -->
        <section>
            <h2 class="section-title">7. 검색 + 페이지네이션</h2>
            <p class="section-desc">검색과 페이지네이션을 함께 사용합니다</p>
            <vs-table :columns="empCols" :items="manyEmployees" search pagination />
        </section>

        <!-- ⑧ 로딩 상태 -->
        <section>
            <h2 class="section-title">8. 로딩 상태 (loading)</h2>
            <p class="section-desc">데이터 로딩 중 스켈레톤 UI를 표시합니다</p>
            <div class="mb-3">
                <vs-button @click="toggleLoading">{{ isLoading ? '로딩 중지' : '로딩 시작' }}</vs-button>
            </div>
            <vs-table :columns="empCols" :items="employees" :loading="isLoading" />
        </section>

        <!-- ⑨ 빈 상태 -->
        <section>
            <h2 class="section-title">9. 빈 상태 (empty)</h2>
            <p class="section-desc">데이터가 없을 때의 모습입니다</p>
            <vs-table :columns="empCols" :items="[]" />
        </section>

        <!-- ⑩ 커스텀 셀 슬롯 – 액션 버튼 -->
        <section>
            <h2 class="section-title">10. 커스텀 셀 – 액션 버튼</h2>
            <p class="section-desc">#body-action 슬롯으로 행마다 버튼을 렌더링합니다</p>
            <vs-table :columns="actionCols" :items="employees">
                <template #body-action="{ item }">
                    <div class="flex gap-1">
                        <vs-button @click="handleEdit(item)">편집</vs-button>
                        <vs-button @click="handleDelete(item)">삭제</vs-button>
                    </div>
                </template>
            </vs-table>
            <p v-if="actionLog" class="mt-2 text-sm text-gray-500">{{ actionLog }}</p>
        </section>

        <!-- ⑪ 커스텀 셀 슬롯 – 상태 배지 -->
        <section>
            <h2 class="section-title">11. 커스텀 셀 – 상태 배지</h2>
            <p class="section-desc">#body-status 슬롯으로 상태를 배지로 표시합니다</p>
            <vs-table :columns="statusCols" :items="serverItems">
                <template #body-status="{ item }">
                    <span class="badge" :class="`badge-${item.status}`">{{ item.status }}</span>
                </template>
            </vs-table>
        </section>

        <!-- ⑫ 커스텀 헤더 슬롯 -->
        <section>
            <h2 class="section-title">12. 커스텀 헤더 슬롯</h2>
            <p class="section-desc">#header-[colKey] 슬롯으로 헤더 셀을 커스터마이징합니다</p>
            <vs-table :columns="empCols" :items="employees">
                <template #header-name="{ header }">👤 {{ header.value }}</template>
                <template #header-role="{ header }">🏷️ {{ header.value }}</template>
                <template #header-dept="{ header }">🏢 {{ header.value }}</template>
                <template #header-salary="{ header }">💰 {{ header.value }}</template>
            </vs-table>
        </section>

        <!-- ⑬ state (행별 UI 상태) -->
        <section>
            <h2 class="section-title">13. 행별 UI 상태 (state)</h2>
            <p class="section-desc">직책에 따라 행에 vs-state-* 클래스를 적용합니다 (selectable, expandable과 유사)</p>
            <vs-table
                :columns="empCols"
                :items="employees"
                :state="(row) => (row.role === 'Manager' ? 'info' : row.role === 'Lead' ? 'success' : 'error')"
            />
        </section>

        <!-- ⑭ state (서버 상태별 UI State) -->
        <section>
            <h2 class="section-title">14. 서버 상태별 행 스타일 (state)</h2>
            <p class="section-desc">서버 상태에 따라 UI state 클래스가 적용됩니다</p>
            <vs-table :columns="statusCols" :items="serverItems" :state="getRowState" />
        </section>

        <!-- ⑮ Sticky 헤더 -->
        <section>
            <h2 class="section-title">15. 고정 헤더 (sticky-header)</h2>
            <p class="section-desc">스크롤해도 헤더가 상단에 고정됩니다</p>
            <div style="max-height: 260px; overflow-y: auto; border: 1px solid #e5e7eb; border-radius: 0.5rem">
                <vs-table :columns="empCols" :items="manyEmployees" sticky-header />
            </div>
        </section>

        <!-- ⑯ dense 모드 -->
        <section>
            <h2 class="section-title">16. 컴팩트 모드 (dense)</h2>
            <p class="section-desc">셀 패딩을 줄여 더 많은 데이터를 표시합니다</p>
            <vs-table no-responsive :columns="empCols" :items="employees" dense />
        </section>

        <!-- ⑰ primary 모드 -->
        <section>
            <h2 class="section-title">17. 프라이머리 헤더 (primary)</h2>
            <p class="section-desc">헤더에 primary 컬러 스킴을 적용합니다</p>
            <vs-table :columns="empCols" :items="employees" primary />
        </section>

        <!-- ⑱ 중첩 데이터 (dot notation) -->
        <section>
            <h2 class="section-title">18. 중첩 데이터 (dot notation)</h2>
            <p class="section-desc">key에 "user.name" 형식으로 중첩 객체의 값을 접근합니다</p>
            <vs-table :columns="nestedCols" :items="nestedItems" />
        </section>

        <!-- ⑲ no-responsive -->
        <section>
            <h2 class="section-title">19. 반응형 비활성 (no-responsive)</h2>
            <p class="section-desc">모바일에서도 항상 테이블 레이아웃을 유지합니다</p>
            <vs-table :columns="empCols" :items="employees" no-responsive />
        </section>

        <!-- ⑳ 선택 + 확장 + 드래그 -->
        <section>
            <h2 class="section-title">20. 선택 + 확장 + 드래그</h2>
            <p class="section-desc">selectable + expandable + draggable 조합</p>
            <vs-table
                :columns="empCols"
                :items="employees"
                :selectable="() => true"
                :expandable="() => true"
                draggable
                v-model:selectedItems="selected21"
            >
                <template #expand="{ cells }">
                    <div class="p-4 text-sm text-gray-600">{{ cells[0]?.item.name }} — {{ cells[0]?.item.email }}</div>
                </template>
            </vs-table>
        </section>

        <!-- ㉑ 전체 기능 조합 -->
        <section>
            <h2 class="section-title">21. 전체 기능 조합</h2>
            <p class="section-desc">검색 + 페이지네이션 + 선택 + 확장을 모두 조합합니다</p>
            <vs-table
                :style-set="styleSet"
                :columns="empCols"
                :items="manyEmployees"
                search
                pagination
                :selectable="() => true"
                :expandable="() => true"
                v-model:selectedItems="selected22"
                primary
            >
                <template #expand="{ cells }">
                    <div class="grid grid-cols-2 gap-4 p-4 text-sm">
                        <div>
                            <span class="font-medium text-gray-500">이메일</span>
                            <p>{{ cells[0]?.item.email }}</p>
                        </div>
                        <div>
                            <span class="font-medium text-gray-500">연봉</span>
                            <p>{{ cells[0]?.item.salary }}</p>
                        </div>
                    </div>
                </template>
            </vs-table>
            <div v-if="selected22.length" class="mt-2 text-sm text-gray-500">
                선택: {{ selected22.map((e) => e.name).join(', ') }}
            </div>
        </section>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import type { UIState } from '@/declaration';
import type { Item } from '@/components/vs-table/types';

export default defineComponent({
    name: 'Sandbox',
    setup() {
        // ── 컬럼 정의 ──────────────────────────────
        const empCols = [
            { key: 'name', label: '이름', sortable: true },
            { key: 'role', label: '직책', sortable: true },
            { key: 'dept', label: '부서', sortable: true },
            { key: 'salary', label: '연봉' },
            { key: 'email', label: '이메일' },
        ];

        const actionCols = [...empCols.slice(0, 3), { key: 'action', label: '' }];

        const statusCols = [
            { key: 'name', label: '서버' },
            { key: 'status', label: '상태' },
            { key: 'message', label: '메시지' },
            { key: 'uptime', label: 'Uptime' },
        ];

        const nestedCols = [
            { key: 'user.name', label: '이름', sortable: true },
            { key: 'user.age', label: '나이' },
            { key: 'department.name', label: '부서', sortable: true },
            { key: 'department.level', label: '레벨' },
        ];

        // ── 데이터 ─────────────────────────────────
        const employees: Item[] = [
            { name: 'Alice Kim', role: 'Lead', dept: 'Engineering', salary: '95,000,000', email: 'alice@corp.com' },
            { name: 'Bob Lee', role: 'Developer', dept: 'Engineering', salary: '72,000,000', email: 'bob@corp.com' },
            {
                name: 'Charlie Park',
                role: 'Manager',
                dept: 'Product',
                salary: '88,000,000',
                email: 'charlie@corp.com',
            },
            { name: 'Diana Choi', role: 'Designer', dept: 'Design', salary: '68,000,000', email: 'diana@corp.com' },
            { name: 'Eve Jung', role: 'QA', dept: 'Quality', salary: '65,000,000', email: 'eve@corp.com' },
            { name: 'Frank Oh', role: 'DevOps', dept: 'Infra', salary: '82,000,000', email: 'frank@corp.com' },
        ];

        const roles = ['Developer', 'Designer', 'Lead', 'Manager', 'QA', 'DevOps', 'Analyst'];
        const depts = ['Engineering', 'Design', 'Product', 'Quality', 'Infra', 'Data'];
        const manyEmployees: Item[] = Array.from({ length: 50 }, (_, i) => ({
            name: `User ${String(i + 1).padStart(2, '0')}`,
            role: roles[i % roles.length],
            dept: depts[i % depts.length],
            salary: `${60 + (i % 40)},000,000`,
            email: `user${i + 1}@corp.com`,
        }));

        const serverItems: Item[] = [
            { name: 'Server A', status: 'success', message: '정상 동작 중', uptime: '99.9%' },
            { name: 'Server B', status: 'warning', message: 'CPU 사용량 높음', uptime: '97.2%' },
            { name: 'Server C', status: 'error', message: '연결 끊김', uptime: '0%' },
            { name: 'Server D', status: 'info', message: '점검 예정', uptime: '98.5%' },
            { name: 'Server E', status: 'idle', message: '대기 중', uptime: '100%' },
        ];

        const nestedItems: Item[] = [
            { user: { name: 'Alice', age: 30 }, department: { name: 'Engineering', level: 5 } },
            { user: { name: 'Bob', age: 25 }, department: { name: 'Design', level: 3 } },
            { user: { name: 'Charlie', age: 35 }, department: { name: 'Product', level: 4 } },
            { user: { name: 'Diana', age: 28 }, department: { name: 'Quality', level: 2 } },
            { user: { name: 'Eve', age: 32 }, department: { name: 'Infra', level: 4 } },
        ];

        // ── 상태 ───────────────────────────────────
        const isLoading = ref(false);
        const selectedEmployees = ref<Item[]>([]);
        const selected21 = ref<Item[]>([]);
        const selected22 = ref<Item[]>([]);
        const pageSize = ref(10);
        const actionLog = ref('');
        const pageSizeOpts = [
            { label: '5', value: 5 },
            { label: '10', value: 10 },
            { label: '20', value: 20 },
            { label: '50', value: 50 },
        ];
        const styleSet = ref({
            component: {
                row: {
                    color: 'red',
                },
            },
        });

        // ── 핸들러 ─────────────────────────────────
        function toggleLoading() {
            isLoading.value = !isLoading.value;
        }

        function handleEdit(item: Item) {
            actionLog.value = `편집: ${item.name}`;
        }

        function handleDelete(item: Item) {
            actionLog.value = `삭제: ${item.name}`;
        }

        function getRowState(row: Item): UIState {
            return (row.status as UIState) ?? 'idle';
        }

        return {
            empCols,
            actionCols,
            statusCols,
            nestedCols,
            employees,
            manyEmployees,
            serverItems,
            nestedItems,
            isLoading,
            selectedEmployees,
            selected21,
            selected22,
            pageSize,
            pageSizeOpts,
            actionLog,
            toggleLoading,
            handleEdit,
            handleDelete,
            getRowState,
            styleSet,
        };
    },
});
</script>

<style scoped>
.section-title {
    font-size: 0.9375rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
    color: #111827;
}

.section-desc {
    font-size: 0.8125rem;
    color: #6b7280;
    margin-bottom: 0.75rem;
}

/* 상태 배지 */
.badge {
    display: inline-flex;
    align-items: center;
    padding: 0.125rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
}
.badge-success {
    background-color: #dcfce7;
    color: #166534;
}
.badge-warning {
    background-color: #fef3c7;
    color: #92400e;
}
.badge-error {
    background-color: #fee2e2;
    color: #991b1b;
}
.badge-info {
    background-color: #dbeafe;
    color: #1e40af;
}
.badge-idle {
    background-color: #f3f4f6;
    color: #6b7280;
}
</style>
