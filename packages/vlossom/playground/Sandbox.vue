<template>
    <vs-page class="mb-8" :style-set="{ padding: '0' }">
        <div class="sandbox">
            <h1 class="mb-2 border-b-2 pb-2 text-2xl font-semibold">Sandbox — VsTable2</h1>

            <div class="mb-6 flex flex-wrap items-center gap-3">
                <span class="text-sm text-gray-500 dark:text-gray-400">공통 size</span>
                <vs-radio-set v-model="tableSize" :options="sizeOptions" option-label="label" option-value="value" />
            </div>

            <!-- 1. 전체 기능 -->
            <h3 class="mb-2 font-semibold">1. 전체 기능 (검색 · 정렬 · 선택 · 확장 · 드래그 · 페이지네이션)</h3>
            <p class="mb-3 text-sm text-gray-500 dark:text-gray-400">
                items는 그대로 두고, 화면에 보이는 결과는 paged/total/selected 바인딩으로 가져옵니다. 정렬이 켜져 있어도
                드래그로 순서를 바꿀 수 있습니다.
            </p>
            <vs-table2
                :columns="userColumns"
                :items="users"
                item-key="id"
                :size="tableSize"
                selectable
                draggable
                search
                :pagination="{ pageSizeOptions: pageSizeOptions }"
                v-model:selected-items="selectedUsers"
                v-model:paged-items="pagedUsers"
                v-model:total-items="totalUsers"
                @click-cell="onClickCell"
                @select-row="onSelectRow"
                @expand-row="onExpandRow"
            >
                <template #toolbar>
                    <div class="flex items-center gap-2">
                        <vs-button size="sm" @click="shuffleUsers">Shuffle items</vs-button>
                        <vs-button size="sm" @click="bumpFirstUserScore">첫 행 score +1</vs-button>
                    </div>
                </template>
                <template #expand="{ item }">
                    <div class="p-4 text-sm">
                        <p>{{ item.name }} ({{ item.email }})</p>
                        <p class="text-gray-500 dark:text-gray-400">role: {{ item.role }} / score: {{ item.score }}</p>
                    </div>
                </template>
            </vs-table2>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                paged {{ pagedUsers.length }} / total {{ totalUsers.length }} / selected {{ selectedUsers.length }} ·
                최근 이벤트: {{ lastEvent || '-' }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
                현재 순서:
                {{
                    totalUsers
                        .slice(0, 5)
                        .map((user) => user.name)
                        .join(' → ')
                }}
                {{ totalUsers.length > 5 ? '…' : '' }}
            </p>

            <vs-divider style-set="playground" />

            <!-- 2. 대량 데이터 -->
            <h3 class="mb-2 font-semibold">2. 대량 데이터 ({{ bigItems.length.toLocaleString() }}건)</h3>
            <p class="mb-3 text-sm text-gray-500 dark:text-gray-400">
                아이템 갱신 후 화면이 반영될 때까지 걸린 시간을 표시합니다. 한 아이템만 바꾸면 그 행만 갱신됩니다.
            </p>
            <div class="mb-3 flex flex-wrap items-center gap-2">
                <vs-radio-set
                    v-model="bigItemCount"
                    :options="bigItemCountOptions"
                    option-label="label"
                    option-value="value"
                />
                <vs-button size="sm" @click="measure('한 아이템 수정', updateOneBigItem)">한 아이템 수정</vs-button>
                <vs-button size="sm" @click="measure('맨 앞에 추가', prependBigItem)">맨 앞에 추가</vs-button>
                <vs-button size="sm" @click="measure('전체 재생성', regenerateBigItems)">전체 재생성</vs-button>
                <span class="text-sm text-gray-500 dark:text-gray-400">{{ lastMeasure || '-' }}</span>
            </div>
            <vs-table2
                :columns="bigColumns"
                :items="bigItems"
                item-key="id"
                :size="tableSize"
                selectable
                search
                sticky-header
                :pagination="{ pageSizeOptions: pageSizeOptions }"
                v-model:selected-items="selectedBigItems"
                v-model:paged-items="pagedBigItems"
            />
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                page rows {{ pagedBigItems.length }} / selected {{ selectedBigItems.length }}
            </p>

            <vs-divider style-set="playground" />

            <!-- 3. 중첩 테이블 + input -->
            <h3 class="mb-2 font-semibold">3. 테이블 안의 테이블 안의 input</h3>
            <p class="mb-3 text-sm text-gray-500 dark:text-gray-400">
                확장 패널 안에 다시 VsTable2를 넣고, 그 셀에 VsInput을 바인딩합니다. 바깥 테이블을 정렬하거나 검색해도
                입력값과 입력 포커스가 유지되는지 확인해 보세요.
            </p>
            <vs-table2 :columns="teamColumns" :items="teams" item-key="id" :size="tableSize" search>
                <template #item-name="{ item }">
                    <vs-input v-model="item.name" :size="tableSize" no-label no-messages no-clear />
                </template>
                <template #expand="{ item }">
                    <div class="p-4">
                        <vs-table2 :columns="memberColumns" :items="item.members" item-key="id" :size="tableSize">
                            <template #item-hours="{ item: member }">
                                <vs-input
                                    v-model="member.hours"
                                    type="number"
                                    :size="tableSize"
                                    no-label
                                    no-messages
                                    no-clear
                                />
                            </template>
                            <template #item-memo="{ item: member }">
                                <vs-input
                                    v-model="member.memo"
                                    :size="tableSize"
                                    placeholder="메모를 입력하세요"
                                    no-label
                                    no-messages
                                />
                            </template>
                        </vs-table2>
                        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">합계 {{ getTotalHours(item) }}시간</p>
                    </div>
                </template>
            </vs-table2>

            <vs-divider style-set="playground" />

            <!-- 4. 중첩 테이블 + :model-value/@update:model-value -->
            <h3 class="mb-2 font-semibold">4. 테이블 안의 테이블 안의 input (:model-value / @update:model-value)</h3>
            <p class="mb-3 text-sm text-gray-500 dark:text-gray-400">
                3번과 같은 구조를 v-model 대신 :model-value로 읽고 @update:model-value로 씁니다. 두 테이블이 같은
                데이터를 쓰므로 한쪽에서 바꾼 값이 다른 쪽에도 그대로 보입니다.
            </p>
            <div class="mb-3 flex flex-wrap items-center gap-3">
                <vs-checkbox
                    v-model="immutableMemberUpdate"
                    check-label="member를 새 인스턴스로 교체 (immutable)"
                    no-messages
                />
                <span class="text-sm text-gray-500 dark:text-gray-400">
                    member는 Member 클래스 인스턴스입니다. 켜면 한 글자 입력할 때마다 with()로 새 인스턴스를 만들어
                    교체하므로, 안쪽 테이블에 item-key가 없으면 행이 새로 그려지고 입력 포커스가 풀립니다.
                </span>
            </div>
            <div class="grid gap-6 xl:grid-cols-2">
                <div>
                    <p class="mb-2 text-sm font-semibold">VsTable2</p>
                    <vs-table2 :columns="teamColumns" :items="teams" :size="tableSize" search>
                        <template #item-name="{ item: team }">
                            <vs-input
                                :model-value="team.name"
                                :size="tableSize"
                                no-label
                                no-messages
                                no-clear
                                @update:model-value="(value) => (team.name = value)"
                            />
                        </template>
                        <template #expand="{ item: team }">
                            <div class="p-4">
                                <vs-table2 :columns="memberColumns" :items="team.members" :size="tableSize">
                                    <template #item-hours="{ item: member }">
                                        <vs-input
                                            :model-value="member.hours"
                                            type="number"
                                            :size="tableSize"
                                            no-label
                                            no-messages
                                            no-clear
                                            @update:model-value="
                                                (value) => setMemberField(team, member, 'hours', value)
                                            "
                                        />
                                    </template>
                                    <template #item-memo="{ item: member }">
                                        <vs-input
                                            :model-value="member.memo"
                                            :size="tableSize"
                                            placeholder="메모를 입력하세요"
                                            no-label
                                            no-messages
                                            @update:model-value="(value) => setMemberField(team, member, 'memo', value)"
                                        />
                                    </template>
                                </vs-table2>
                                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    합계 {{ getTotalHours(team) }}시간
                                </p>
                            </div>
                        </template>
                    </vs-table2>
                </div>
                <div>
                    <p class="mb-2 text-sm font-semibold">VsTable (v1)</p>
                    <vs-table :columns="teamColumns" :items="teams" :size="tableSize" search>
                        <template #body-name="{ item: team }">
                            <vs-input
                                :model-value="team.name"
                                :size="tableSize"
                                no-label
                                no-messages
                                no-clear
                                @update:model-value="(value) => (team.name = value)"
                            />
                        </template>
                        <template #expand="{ item: team }">
                            <div class="p-4">
                                <vs-table :columns="memberColumns" :items="team.members" :size="tableSize">
                                    <template #body-hours="{ item: member }">
                                        <vs-input
                                            :model-value="member.hours"
                                            type="number"
                                            :size="tableSize"
                                            no-label
                                            no-messages
                                            no-clear
                                            @update:model-value="
                                                (value) => setMemberField(team, member, 'hours', value)
                                            "
                                        />
                                    </template>
                                    <template #body-memo="{ item: member }">
                                        <vs-input
                                            :model-value="member.memo"
                                            :size="tableSize"
                                            placeholder="메모를 입력하세요"
                                            no-label
                                            no-messages
                                            @update:model-value="(value) => setMemberField(team, member, 'memo', value)"
                                        />
                                    </template>
                                </vs-table>
                                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    합계 {{ getTotalHours(team) }}시간
                                </p>
                            </div>
                        </template>
                    </vs-table>
                </div>
            </div>

            <vs-divider style-set="playground" />

            <!-- 5. 서버 모드 -->
            <h3 class="mb-2 font-semibold">5. 서버 모드</h3>
            <p class="mb-3 text-sm text-gray-500 dark:text-gray-400">
                paginate 이벤트로 받은 페이지만 조회해 렌더링합니다. 클라이언트 페이징은 하지 않습니다.
            </p>
            <vs-table2
                :columns="bigColumns"
                :items="serverItems"
                item-key="id"
                :size="tableSize"
                server-mode
                :loading="serverLoading"
                :pagination="{ totalItemCount: SERVER_TOTAL, pageSizeOptions: pageSizeOptions }"
                v-model:page="serverPage"
                v-model:page-size="serverPageSize"
                @paginate="fetchServerItems"
            />

            <vs-divider style-set="playground" />

            <!-- 6. 상태별 표시 -->
            <h3 class="mb-2 font-semibold">6. 빈 상태 · 로딩 · UI State · 반응형</h3>
            <div class="mb-3 flex flex-wrap items-center gap-2">
                <vs-checkbox-set
                    v-model="stateFlags"
                    :options="stateFlagOptions"
                    option-label="label"
                    option-value="value"
                />
            </div>
            <vs-table2
                :columns="userColumns"
                :items="stateFlags.includes('empty') ? [] : users"
                item-key="id"
                :size="tableSize"
                :loading="stateFlags.includes('loading')"
                :responsive="stateFlags.includes('responsive')"
                :primary="stateFlags.includes('primary')"
                :state="getRowState"
                :expandable="isExpandable"
            >
                <template #empty>
                    <div class="p-6 text-sm">조건에 맞는 팀원이 없습니다.</div>
                </template>
                <template #expand="{ item }">
                    <div class="p-4 text-sm">score 60점 이상인 행만 펼칠 수 있습니다 — {{ item.name }}</div>
                </template>
            </vs-table2>
        </div>
    </vs-page>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref, watch } from 'vue';
import { SIZES, type Size, type UIState } from '@/declaration';
import type { VsTable2Cell, VsTable2ColumnDef, VsTable2Item } from '@/components';

const ROLES = ['Admin', 'Editor', 'Viewer'];
const SERVER_TOTAL = 320;

class Member {
    constructor(
        public id: string,
        public name: string,
        public hours: number,
        public memo: string,
    ) {}

    with(key: 'hours' | 'memo', value: any): Member {
        return Object.assign(new Member(this.id, this.name, this.hours, this.memo), { [key]: value });
    }
}

function createUsers(count: number, startId = 1): VsTable2Item[] {
    return Array.from({ length: count }, (_, index) => {
        const id = startId + index;
        return {
            id,
            name: `User ${id}`,
            email: `user${id}@vlossom.dev`,
            role: ROLES[id % ROLES.length],
            score: (id * 37) % 100,
            joinedAt: new Date(2024, id % 12, (id % 28) + 1),
        };
    });
}

export default defineComponent({
    name: 'Sandbox',
    setup() {
        const tableSize = ref<Size>('md');
        const sizeOptions = SIZES.map((size) => ({ label: size, value: size }));

        const pageSizeOptions = [
            { label: '10개씩', value: 10 },
            { label: '25개씩', value: 25 },
            { label: '50개씩', value: 50 },
        ];

        // 1. 전체 기능
        const userColumns: VsTable2ColumnDef[] = [
            { key: 'name', label: 'Name', sortable: true, minWidth: '8rem' },
            { key: 'email', label: 'Email', sortable: true },
            { key: 'role', label: 'Role', sortable: true, align: 'center', width: '8rem' },
            { key: 'score', label: 'Score', sortable: true, align: 'center', width: '7rem' },
        ];
        const users = ref<VsTable2Item[]>(createUsers(12));
        const selectedUsers = ref<VsTable2Item[]>([]);
        const pagedUsers = ref<VsTable2Item[]>([]);
        const totalUsers = ref<VsTable2Item[]>([]);
        const lastEvent = ref('');

        function shuffleUsers() {
            users.value = [...users.value].sort(() => Math.random() - 0.5);
        }

        function bumpFirstUserScore() {
            const [first, ...rest] = users.value;
            users.value = [{ ...first, score: (first.score + 1) % 100 }, ...rest];
        }

        function onClickCell(cell: VsTable2Cell) {
            lastEvent.value = `click-cell ${cell.colKey}=${String(cell.value)}`;
        }

        function onSelectRow(item: VsTable2Item, index: number, selected: boolean) {
            lastEvent.value = `select-row ${item.name} (${index}) → ${selected}`;
        }

        function onExpandRow(item: VsTable2Item, index: number, expanded: boolean) {
            lastEvent.value = `expand-row ${item.name} (${index}) → ${expanded}`;
        }

        // 2. 대량 데이터
        const bigColumns: VsTable2ColumnDef[] = [
            { key: 'id', label: 'ID', sortable: true, width: '6rem', align: 'center' },
            { key: 'name', label: 'Name', sortable: true },
            { key: 'email', label: 'Email' },
            { key: 'role', label: 'Role', align: 'center', width: '8rem' },
            { key: 'score', label: 'Score', sortable: true, align: 'right', width: '7rem' },
            {
                key: 'joinedAt',
                label: 'Joined',
                sortable: true,
                width: '9rem',
                transform: (value: Date) => value.toLocaleDateString('ko-KR'),
            },
        ];
        const bigItemCountOptions = [
            { label: '1,000건', value: 1000 },
            { label: '10,000건', value: 10000 },
            { label: '50,000건', value: 50000 },
        ];
        const bigItemCount = ref(10000);
        const bigItems = ref<VsTable2Item[]>(createUsers(bigItemCount.value));
        const pagedBigItems = ref<VsTable2Item[]>([]);
        const selectedBigItems = ref<VsTable2Item[]>([]);
        const lastMeasure = ref('');

        watch(bigItemCount, (count) => {
            measure(`${count.toLocaleString()}건 생성`, () => {
                bigItems.value = createUsers(count);
            });
        });

        async function measure(label: string, action: () => void) {
            const start = performance.now();
            action();
            await nextTick();
            lastMeasure.value = `${label}: ${(performance.now() - start).toFixed(1)}ms`;
        }

        function updateOneBigItem() {
            const target = bigItems.value[0];
            bigItems.value = [{ ...target, score: (target.score + 1) % 100 }, ...bigItems.value.slice(1)];
        }

        function prependBigItem() {
            const nextId = bigItems.value.length + 1;
            bigItems.value = [...createUsers(1, nextId), ...bigItems.value];
        }

        function regenerateBigItems() {
            bigItems.value = createUsers(bigItemCount.value);
        }

        // 3. 중첩 테이블 + input
        const teamColumns: VsTable2ColumnDef[] = [
            { key: 'name', label: 'Team', minWidth: '12rem' },
            { key: 'lead', label: 'Lead', sortable: true },
            { key: 'members', label: 'Members', align: 'center', width: '8rem', transform: (value) => value.length },
        ];
        const memberColumns: VsTable2ColumnDef[] = [
            { key: 'name', label: 'Member', minWidth: '8rem' },
            { key: 'hours', label: 'Hours', width: '8rem' },
            { key: 'memo', label: 'Memo', minWidth: '12rem' },
        ];
        const teams = ref<VsTable2Item[]>([
            {
                id: 'team-1',
                name: 'Design',
                lead: 'Alice',
                members: [new Member('m-1', 'Bob', 8, ''), new Member('m-2', 'Carol', 6, '리서치 진행 중')],
            },
            {
                id: 'team-2',
                name: 'Engineering',
                lead: 'Dave',
                members: [
                    new Member('m-3', 'Erin', 7, ''),
                    new Member('m-4', 'Frank', 5, ''),
                    new Member('m-5', 'Grace', 9, '배포 담당'),
                ],
            },
        ]);

        const immutableMemberUpdate = ref(false);

        function setMemberField(team: VsTable2Item, member: Member, key: 'hours' | 'memo', value: any) {
            if (!immutableMemberUpdate.value) {
                Object.assign(member, { [key]: value });
                return;
            }
            team.members = team.members.map((target: Member) => (target === member ? target.with(key, value) : target));
        }

        function getTotalHours(team: VsTable2Item): number {
            return team.members.reduce((total: number, member: VsTable2Item) => total + Number(member.hours || 0), 0);
        }

        // 5. 서버 모드
        const serverItems = ref<VsTable2Item[]>([]);
        const serverPage = ref(0);
        const serverPageSize = ref(10);
        const serverLoading = ref(false);

        function fetchServerItems(page: number, pageSize: number) {
            serverLoading.value = true;
            setTimeout(() => {
                const start = page * pageSize + 1;
                const size = Math.min(pageSize, Math.max(SERVER_TOTAL - page * pageSize, 0));
                serverItems.value = createUsers(size, start);
                serverLoading.value = false;
            }, 400);
        }

        // 6. 상태별 표시
        const stateFlagOptions = [
            { value: 'empty', label: 'Empty' },
            { value: 'loading', label: 'Loading' },
            { value: 'responsive', label: 'Responsive' },
            { value: 'primary', label: 'Primary' },
        ];
        const stateFlags = ref<string[]>([]);

        function getRowState(item: VsTable2Item): UIState {
            if (item.score >= 80) {
                return 'success';
            }
            if (item.score < 30) {
                return 'error';
            }
            return 'idle';
        }

        function isExpandable(item: VsTable2Item): boolean {
            return item.score >= 60;
        }

        return {
            SERVER_TOTAL,
            tableSize,
            sizeOptions,
            pageSizeOptions,
            userColumns,
            users,
            selectedUsers,
            pagedUsers,
            totalUsers,
            lastEvent,
            shuffleUsers,
            bumpFirstUserScore,
            onClickCell,
            onSelectRow,
            onExpandRow,
            bigColumns,
            bigItemCount,
            bigItemCountOptions,
            bigItems,
            pagedBigItems,
            selectedBigItems,
            lastMeasure,
            measure,
            updateOneBigItem,
            prependBigItem,
            regenerateBigItems,
            teamColumns,
            memberColumns,
            teams,
            immutableMemberUpdate,
            setMemberField,
            getTotalHours,
            serverItems,
            serverPage,
            serverPageSize,
            serverLoading,
            fetchServerItems,
            stateFlags,
            stateFlagOptions,
            getRowState,
            isExpandable,
        };
    },
});
</script>
