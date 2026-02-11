<template>
    <div style="display: flex; flex-direction: column; gap: 3rem">
        <!-- 기본 페이지 -->
        <section>
            <h2 style="margin-bottom: 1rem">1. 기본 페이지</h2>
            <vs-page>
                <template #title><h3>페이지 제목</h3></template>
                <template #description>이 페이지는 Vlossom의 페이지 컴포넌트입니다.</template>
                <p>페이지의 컨텐츠를 여기에 표시합니다.</p>
            </vs-page>
        </section>

        <!-- Component 스타일 커스텀 -->
        <section>
            <h2 style="margin-bottom: 1rem">2. Component 스타일 커스텀</h2>
            <vs-page
                :style-set="{
                    component: {
                        backgroundColor: '#f9f9f9',
                        borderRadius: '8px',
                        padding: '3rem 4rem',
                    },
                }"
            >
                <template #title><h3>커스텀 스타일 페이지</h3></template>
                <template #description>패딩과 배경색이 커스터마이징된 페이지입니다.</template>
                <p>페이지 컨텐츠</p>
            </vs-page>
        </section>

        <!-- Title/Description 스타일 커스텀 -->
        <section>
            <h2 style="margin-bottom: 1rem">3. Title/Description 스타일 커스텀</h2>
            <vs-page
                :style-set="{
                    title: {
                        padding: '0 0 2rem 0',
                        borderBottom: '2px solid #e0e0e0',
                    },
                    description: {
                        padding: '1.5rem 0',
                        color: '#666',
                        fontStyle: 'italic',
                    },
                }"
            >
                <template #title><h3>Title과 Description 커스텀</h3></template>
                <template #description>제목과 설명 영역에 개별적으로 스타일을 적용했습니다.</template>
                <p>메인 콘텐츠 영역입니다.</p>
            </vs-page>
        </section>

        <!-- Content 스타일 커스텀 -->
        <section>
            <h2 style="margin-bottom: 1rem">4. Content 스타일 커스텀</h2>
            <vs-page
                :style-set="{
                    content: {
                        padding: '2rem',
                        backgroundColor: '#f0f8ff',
                        borderRadius: '12px',
                        border: '1px solid #4a90e2',
                    },
                }"
            >
                <template #title><h3>Content 영역 커스텀</h3></template>
                <template #description>본문 콘텐츠 영역에 스타일을 적용했습니다.</template>
                <p>이 영역은 커스텀 배경색과 테두리가 적용되어 있습니다.</p>
            </vs-page>
        </section>

        <!-- 전체 영역 개별 스타일 커스텀 -->
        <section>
            <h2 style="margin-bottom: 1rem">5. 전체 영역 개별 스타일 커스텀</h2>
            <vs-page
                :style-set="{
                    component: {
                        padding: '2rem',
                        backgroundColor: '#fafafa',
                        border: '1px solid #ddd',
                    },
                    title: {
                        padding: '0 0 1.5rem 0',
                        color: '#2c3e50',
                        fontWeight: 'bold',
                    },
                    description: {
                        padding: '0 0 1.5rem 0',
                        color: '#7f8c8d',
                        fontSize: '0.95rem',
                    },
                    content: {
                        padding: '1.5rem',
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    },
                }"
            >
                <template #title><h3>모든 영역 커스터마이징</h3></template>
                <template #description>component, title, description, content 모든 영역에 개별 스타일을 적용했습니다.</template>
                <p>각 영역이 서로 다른 스타일로 세밀하게 조정되어 있습니다.</p>
                <p style="margin-top: 1rem">이렇게 영역별로 독립적인 스타일링이 가능합니다.</p>
            </vs-page>
        </section>

        <!-- 슬롯 없이 사용 -->
        <section>
            <h2 style="margin-bottom: 1rem">6. 슬롯 없이 사용</h2>
            <vs-page>
                <p>제목과 설명 없이 본문 콘텐츠만 있는 페이지입니다.</p>
            </vs-page>
        </section>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VsPage from '@/components/vs-page/VsPage.vue';

export default defineComponent({
    name: 'Sandbox',
    components: {
        VsPage,
    },
});
</script>
