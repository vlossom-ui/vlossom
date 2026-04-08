<template>
    <section>
        <h2 class="mb-6 border-b-2 pb-2 text-2xl font-semibold">Dashboard</h2>

        <!-- 통계 카드 -->
        <vs-grid :grid-size="12" column-gap="1.5rem" row-gap="1.5rem">
            <vs-responsive v-for="(stat, index) in stats" :key="index" :grid="{ xs: 12, md: 6, lg: 3 }">
                <vs-block :color-scheme="stat.colorScheme">
                    <template #title>
                        <div class="flex items-center justify-between">
                            <span>{{ stat.title }}</span>
                            <vs-chip :color-scheme="stat.trend > 0 ? 'green' : 'red'">
                                {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
                            </vs-chip>
                        </div>
                    </template>
                    <div class="py-2">
                        <p class="text-3xl font-bold">{{ stat.value }}</p>
                        <p class="mt-1 text-sm opacity-70">vs last month</p>
                    </div>
                </vs-block>
            </vs-responsive>
        </vs-grid>

        <vs-divider style-set="playground" />

        <!-- 성과 지표 -->
        <h3 class="mb-4 font-semibold">Performance Metrics</h3>
        <vs-grid :grid-size="12" column-gap="1.5rem" row-gap="1.5rem">
            <vs-responsive :grid="{ xs: 12, lg: 6 }">
                <vs-block>
                    <template #title>Monthly Goals</template>
                    <div class="flex flex-col gap-4 py-2">
                        <div v-for="(goal, index) in goals" :key="index">
                            <div class="mb-1 flex justify-between text-sm">
                                <span>{{ goal.label }}</span>
                                <span class="font-semibold">{{ goal.current }} / {{ goal.target }}</span>
                            </div>
                            <vs-progress
                                :value="(goal.current / goal.target) * 100"
                                :color-scheme="goal.colorScheme"
                            />
                        </div>
                    </div>
                </vs-block>
            </vs-responsive>

            <vs-responsive :grid="{ xs: 12, lg: 6 }">
                <vs-block>
                    <template #title>System Status</template>
                    <div class="flex flex-col gap-3 py-2">
                        <div v-for="(service, index) in services" :key="index" class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <vs-chip :color-scheme="service.status === 'Operational' ? 'green' : 'orange'">
                                    {{ service.status }}
                                </vs-chip>
                                <span>{{ service.name }}</span>
                            </div>
                            <span class="text-sm opacity-70">{{ service.uptime }}% uptime</span>
                        </div>
                    </div>
                </vs-block>
            </vs-responsive>
        </vs-grid>

        <vs-divider style-set="playground" />

        <!-- 탭 기반 데이터 뷰 -->
        <h3 class="mb-4 font-semibold">Data Overview</h3>
        <vs-tabs v-model="activeTab" :tabs="['Recent Orders', 'Top Products', 'User Activity']" class="mb-4" />

        <vs-index-view v-model="activeTab">
            <!-- Recent Orders -->
            <div>
                <vs-table
                    :columns="orderColumns"
                    :items="orderItems"
                    :pagination="{ edgeButtons: true }"
                    :page-size="5"
                    dense
                >
                    <template #body-status="{ value }">
                        <vs-chip :color-scheme="getStatusColor(value)">{{ value }}</vs-chip>
                    </template>
                    <template #body-amount="{ value }">
                        <span class="font-semibold">${{ value.toLocaleString() }}</span>
                    </template>
                </vs-table>
            </div>

            <!-- Top Products -->
            <div>
                <vs-table :columns="productColumns" :items="productItems" dense>
                    <template #body-sales="{ value }">
                        <div class="flex items-center gap-2">
                            <vs-progress
                                :value="(value / maxSales) * 100"
                                color-scheme="blue"
                                :style-set="{ component: { width: '80px', height: '0.5rem' } }"
                            />
                            <span>{{ value }}</span>
                        </div>
                    </template>
                    <template #body-revenue="{ value }">
                        <span class="font-semibold">${{ value.toLocaleString() }}</span>
                    </template>
                </vs-table>
            </div>

            <!-- User Activity -->
            <div>
                <vs-table :columns="activityColumns" :items="activityItems" dense>
                    <template #body-user="{ value }">
                        <div class="flex items-center gap-2">
                            <vs-avatar :style-set="{ component: { width: '28px', height: '28px', fontSize: '0.7rem' } }">
                                {{ value.charAt(0) }}
                            </vs-avatar>
                            <span>{{ value }}</span>
                        </div>
                    </template>
                    <template #body-action="{ value }">
                        <vs-chip :color-scheme="getActionColor(value)">{{ value }}</vs-chip>
                    </template>
                </vs-table>
            </div>
        </vs-index-view>
    </section>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
    name: 'Dashboard',
    setup() {
        const activeTab = ref(0);

        const stats = [
            { title: 'Total Revenue', value: '$48,250', trend: 12.5, colorScheme: 'blue' },
            { title: 'Active Users', value: '2,340', trend: 8.1, colorScheme: 'green' },
            { title: 'Orders', value: '1,892', trend: -3.2, colorScheme: 'orange' },
            { title: 'Conversion', value: '4.6%', trend: 1.8, colorScheme: 'indigo' },
        ];

        const goals = [
            { label: 'Revenue', current: 48250, target: 60000, colorScheme: 'blue' },
            { label: 'New Users', current: 340, target: 500, colorScheme: 'green' },
            { label: 'Orders', current: 1892, target: 2000, colorScheme: 'orange' },
            { label: 'Support Tickets', current: 45, target: 50, colorScheme: 'red' },
        ];

        const services = [
            { name: 'API Server', status: 'Operational', uptime: 99.9 },
            { name: 'Database', status: 'Operational', uptime: 99.8 },
            { name: 'CDN', status: 'Degraded', uptime: 98.2 },
            { name: 'Auth Service', status: 'Operational', uptime: 99.9 },
            { name: 'Storage', status: 'Operational', uptime: 99.7 },
        ];

        // Recent Orders
        const orderColumns = [
            { key: 'id', label: 'Order ID' },
            { key: 'customer', label: 'Customer' },
            { key: 'amount', label: 'Amount' },
            { key: 'status', label: 'Status' },
            { key: 'date', label: 'Date' },
        ];

        const orderItems = [
            { id: '#ORD-001', customer: 'Alice Kim', amount: 1250, status: 'Completed', date: '2026-04-08' },
            { id: '#ORD-002', customer: 'Bob Lee', amount: 890, status: 'Processing', date: '2026-04-08' },
            { id: '#ORD-003', customer: 'Carol Park', amount: 2100, status: 'Completed', date: '2026-04-07' },
            { id: '#ORD-004', customer: 'David Choi', amount: 450, status: 'Cancelled', date: '2026-04-07' },
            { id: '#ORD-005', customer: 'Emma Jung', amount: 3200, status: 'Shipped', date: '2026-04-06' },
            { id: '#ORD-006', customer: 'Frank Han', amount: 780, status: 'Processing', date: '2026-04-06' },
            { id: '#ORD-007', customer: 'Grace Yoon', amount: 1650, status: 'Completed', date: '2026-04-05' },
            { id: '#ORD-008', customer: 'Henry Shin', amount: 920, status: 'Shipped', date: '2026-04-05' },
        ];

        function getStatusColor(status: string): string {
            const colors: Record<string, string> = {
                Completed: 'green',
                Processing: 'blue',
                Shipped: 'indigo',
                Cancelled: 'red',
            };
            return colors[status] || '';
        }

        // Top Products
        const productColumns = [
            { key: 'rank', label: '#' },
            { key: 'name', label: 'Product' },
            { key: 'sales', label: 'Sales' },
            { key: 'revenue', label: 'Revenue' },
        ];

        const productItems = [
            { rank: 1, name: 'Wireless Headphones', sales: 842, revenue: 42100 },
            { rank: 2, name: 'USB-C Hub', sales: 654, revenue: 32700 },
            { rank: 3, name: 'Mechanical Keyboard', sales: 521, revenue: 39075 },
            { rank: 4, name: 'Monitor Stand', sales: 398, revenue: 15920 },
            { rank: 5, name: 'Webcam HD', sales: 312, revenue: 18720 },
        ];

        const maxSales = computed(() => Math.max(...productItems.map((p) => p.sales)));

        // User Activity
        const activityColumns = [
            { key: 'user', label: 'User' },
            { key: 'action', label: 'Action' },
            { key: 'detail', label: 'Detail' },
            { key: 'time', label: 'Time' },
        ];

        const activityItems = [
            { user: 'Alice Kim', action: 'Purchase', detail: 'Wireless Headphones', time: '2 min ago' },
            { user: 'Bob Lee', action: 'Sign Up', detail: 'New account created', time: '15 min ago' },
            { user: 'Carol Park', action: 'Review', detail: 'USB-C Hub - 5 stars', time: '32 min ago' },
            { user: 'David Choi', action: 'Refund', detail: 'Order #ORD-004', time: '1 hour ago' },
            { user: 'Emma Jung', action: 'Purchase', detail: 'Mechanical Keyboard', time: '2 hours ago' },
        ];

        function getActionColor(action: string): string {
            const colors: Record<string, string> = {
                Purchase: 'green',
                'Sign Up': 'blue',
                Review: 'indigo',
                Refund: 'red',
            };
            return colors[action] || '';
        }

        return {
            activeTab,
            stats,
            goals,
            services,
            orderColumns,
            orderItems,
            getStatusColor,
            productColumns,
            productItems,
            maxSales,
            activityColumns,
            activityItems,
            getActionColor,
        };
    },
});
</script>
