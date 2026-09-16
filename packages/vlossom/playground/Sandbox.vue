<template>
    <vs-page>
        <template #title>
            <h1>Sandbox</h1>
        </template>
        <template #description>
            <p>vs-table &gt; vs-accordion &gt; vs-table &gt; vs-label-value &gt; vs-input 포커스 재현 지그</p>
        </template>

        <div v-for="scenario in visibleScenarios" :key="scenario.id" class="mb-8">
            <h3 class="mb-4 font-semibold">{{ scenario.id }}. {{ scenario.label }}</h3>
            <vs-table
                :id="`case-${scenario.id}`"
                :columns="groupColumns"
                :items="groups"
                :item-key="scenario.outerItemKey"
            >
                <template #body-details="{ item: group }">
                    <vs-accordion open>
                        <template #title>{{ group.name }}</template>
                        <vs-table
                            :columns="scenario.innerColumns ?? detailColumns"
                            :items="group.details"
                            :item-key="scenario.itemKey"
                            @update:paged-items="emitCounts.pagedItems++"
                            @update:total-items="emitCounts.totalItems++"
                            :draggable="!!scenario.draggable"
                            :pagination="!!scenario.pagination"
                            :page-size="scenario.pagination ? 50 : undefined"
                            :search="!!scenario.search"
                            :sticky-header="!!scenario.stickyHeader"
                            :selectable="!!scenario.selectable"
                        >
                            <template #body-value="{ item: detail }">
                                <vs-label-value>
                                    <template #label>{{ detail.label }}</template>
                                    <vs-input
                                        :model-value="detail.value"
                                        @update:model-value="onUpdate(scenario, group, detail, $event)"
                                    />
                                </vs-label-value>
                            </template>
                        </vs-table>
                    </vs-accordion>
                </template>
            </vs-table>
        </div>

        <div v-if="benchRows" class="mb-8">
            <h3 class="mb-4 font-semibold">Bench: {{ benchRows }} rows</h3>
            <vs-table id="case-bench" :columns="benchColumns" :items="benchItems" item-key="id">
                <template #body-value="{ item }">
                    <vs-input :model-value="item.value" @update:model-value="item.value = $event" />
                </template>
            </vs-table>
        </div>

        <pre id="emit-counts" class="mt-4 text-sm">{{ emitCounts }}</pre>
        <pre class="mt-4 text-sm">{{ groups }}</pre>
    </vs-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import type { VsTableColumnDef } from '@/components/vs-table/types';

class Detail {
    constructor(
        public label: string,
        public value: string,
    ) {}

    setValue(value: string) {
        this.value = value;
    }
}

class Group {
    public details: Detail[];

    constructor(
        public name: string,
        labels: string[],
    ) {
        this.details = labels.map((label) => new Detail(label, ''));
    }

    replaceDetail(label: string, value: string) {
        this.details = this.details.map((detail) =>
            detail.label === label ? new Detail(label, value) : new Detail(detail.label, detail.value),
        );
    }
}

interface Scenario {
    id: string;
    label: string;
    itemKey: string;
    outerItemKey: string;
    innerColumns?: VsTableColumnDef[];
    replaceInstances?: boolean;
    replaceGroups?: boolean;
    draggable?: boolean;
    pagination?: boolean;
    search?: boolean;
    sortable?: boolean;
    stickyHeader?: boolean;
    selectable?: boolean;
}

const sortableColumns: VsTableColumnDef[] = [
    { key: 'label', label: 'label' },
    { key: 'value', label: 'value', sortable: true },
];

const SCENARIOS: Scenario[] = [
    { id: 'a', label: 'item-key + mutate', itemKey: 'label', outerItemKey: 'name' },
    { id: 'b', label: 'item-key + 인스턴스 교체', itemKey: 'label', outerItemKey: 'name', replaceInstances: true },
    { id: 'c', label: 'item-key + draggable', itemKey: 'label', outerItemKey: 'name', draggable: true },
    { id: 'd', label: 'item-key + pagination', itemKey: 'label', outerItemKey: 'name', pagination: true },
    { id: 'e', label: 'item-key + search', itemKey: 'label', outerItemKey: 'name', search: true },
    {
        id: 'f',
        label: 'item-key + value 컬럼 정렬',
        itemKey: 'label',
        outerItemKey: 'name',
        innerColumns: sortableColumns,
        sortable: true,
    },
    { id: 'g', label: 'item-key + selectable', itemKey: 'label', outerItemKey: 'name', selectable: true },
    { id: 'h', label: 'item-key 없음 + mutate', itemKey: '', outerItemKey: '' },
    { id: 'i', label: 'item-key 없음 + 인스턴스 교체 (대조군)', itemKey: '', outerItemKey: '', replaceInstances: true },
    { id: 'j', label: 'item-key + groups 배열 전체 교체', itemKey: 'label', outerItemKey: 'name', replaceGroups: true },
];

export default defineComponent({
    name: 'Sandbox',
    setup() {
        const groupColumns = ['name', 'details'];
        const detailColumns = ['label', 'value'];
        const groups = ref([new Group('Group A', ['alpha', 'beta']), new Group('Group B', ['gamma'])]);

        const requested = new URLSearchParams(location.search).get('cases');
        const visibleScenarios = computed(() =>
            requested ? SCENARIOS.filter((scenario) => requested.includes(scenario.id)) : SCENARIOS,
        );

        function onUpdate(scenario: Scenario, group: Group, detail: Detail, value: string) {
            if (scenario.replaceGroups) {
                detail.setValue(value);
                groups.value = groups.value.map((current) => {
                    const next = new Group(
                        current.name,
                        current.details.map((item) => item.label),
                    );
                    next.details.forEach((item, index) => item.setValue(current.details[index].value));
                    return next;
                });
                return;
            }
            if (scenario.replaceInstances) {
                group.replaceDetail(detail.label, value);
                return;
            }
            detail.setValue(value);
        }

        const emitCounts = ref({ pagedItems: 0, totalItems: 0 });

        const benchRows = Number(new URLSearchParams(location.search).get('bench') ?? 0);
        const benchColumns = ['id', 'name', 'value'];
        const benchItems = ref(
            Array.from({ length: benchRows }, (_, index) => ({
                id: `row-${index}`,
                name: `name-${index}`,
                value: '',
            })),
        );

        return {
            groupColumns,
            detailColumns,
            groups,
            visibleScenarios,
            onUpdate,
            emitCounts,
            benchRows,
            benchColumns,
            benchItems,
        };
    },
});
</script>
