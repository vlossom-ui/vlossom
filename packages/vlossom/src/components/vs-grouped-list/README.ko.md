> For English documentation, see [README.md](./README.md).

# VsGroupedList

선택적 그룹핑, 대량 목록을 위한 자동 가상 스크롤, 완전한 슬롯 커스터마이징을 지원하는 스크롤 가능한 목록 컴포넌트입니다.

**사용 가능 버전**: 2.0.0+

## 기능

- `OptionItem` 배열에서 플랫 또는 그룹화된 목록 렌더링
- `groupBy` 함수 및 `groupOrder` 배열을 통한 선택적 그룹핑
- 임베디드 `VsInnerScroll` 컴포넌트를 통한 스크롤 가능
- 항목이 100개를 초과하면 플랫/그룹 목록 모두 자동으로 가상 스크롤로 전환
- 그룹 헤더 및 개별 항목에 대한 완전한 슬롯 커스터마이징
- 프로그래밍 방식 제어를 위한 `scrollToItem` 및 `hasScroll` 메서드 노출

## 기본 사용법

```html
<template>
    <vs-grouped-list :items="items" @click-item="onClickItem" />
</template>

<script setup>
const items = [
    { id: '1', label: '사과', item: { category: '과일' } },
    { id: '2', label: '바나나', item: { category: '과일' } },
    { id: '3', label: '당근', item: { category: '채소' } },
];

function onClickItem(item) {
    console.log('클릭됨:', item.label);
}
</script>
```

### 그룹화된 목록

```html
<template>
    <vs-grouped-list
        :items="items"
        :group-by="(item) => item.category"
        :group-order="['과일', '채소']"
    >
        <template #group="{ group }">
            <div class="group-header">{{ group.toUpperCase() }}</div>
        </template>
        <template #item="{ label }">
            <div class="list-item">{{ label }}</div>
        </template>
    </vs-grouped-list>
</template>
```

### 사용자 정의 높이와 스크롤

```html
<template>
    <vs-grouped-list
        :items="longList"
        :style-set="{ maxHeight: '300px' }"
        @click-item="handleClick"
    />
</template>
```

### 가상 스크롤

`items`가 100개를 초과하면 보이는 영역 근처의 행만 렌더링합니다. 그룹 헤더와 항목이 함께 가상화되고 행 높이는 렌더링 후 측정되므로, 높이가 다른 `group`, `item` 슬롯도 사용할 수 있습니다. 스크롤이 생기도록 목록 높이를 제한(예: `maxHeight`)해 주세요.

```html
<template>
    <vs-grouped-list :items="largeList" :style-set="{ maxHeight: '300px' }" />

    <!-- 모든 항목을 한 번에 렌더링 -->
    <vs-grouped-list :items="largeList" :style-set="{ maxHeight: '300px' }" no-virtual />
</template>
```

## Props

| Prop | 타입 | 기본값 | 필수 | 설명 |
| ---- | ---- | ------ | ---- | ---- |
| `styleSet` | `string \| VsGroupedListStyleSet` | | | 컴포넌트의 사용자 정의 스타일 셋 |
| `items` | `OptionItem[]` | `[]` | | 표시할 항목 배열 |
| `groupBy` | `(item: any, index: number) => string` | | | 각 항목의 그룹 이름을 반환하는 함수 |
| `groupOrder` | `string[]` | | | 그룹이 표시될 순서 |
| `noVirtual` | `boolean` | `false` | | 자동 가상 스크롤을 끄고 모든 항목을 렌더링 |

## 타입

```typescript
interface VsGroupedListStyleSet extends CSSProperties {
    $header?: CSSProperties;
    $content?: CSSProperties;
    $footer?: CSSProperties;
    $group?: CSSProperties;
    $item?: CSSProperties;
}
```

### StyleSet 예시

```html
<template>
    <vs-grouped-list
        :items="items"
        :style-set="{
            maxHeight: '400px',
            $group: { backgroundColor: '#f0f0f0', fontWeight: 'bold', padding: '0.5rem 1rem' },
            $item: { padding: '0.4rem 1.2rem' },
        }"
    />
</template>
```

## 이벤트

| 이벤트 | 페이로드 | 설명 |
| ------ | -------- | ---- |
| `click-item` | `OptionItem & { groupedIndex: number; group: VsGroupedListGroup; groupIndex: number }` | 항목이 클릭될 때 발생 |

## 슬롯

| 슬롯 | 설명 |
| ---- | ---- |
| `header` | 스크롤 가능한 목록 헤더의 콘텐츠 |
| `footer` | 스크롤 가능한 목록 푸터의 콘텐츠 |
| `empty` | `items`가 비어 있을 때 목록 본문에 표시되는 콘텐츠 |
| `group` | 그룹 헤더의 사용자 정의 렌더링. `{ group: string, groupIndex: number, items: OptionItem[] }` 제공 |
| `item` | 항목의 사용자 정의 렌더링. `OptionItem` 필드와 `{ groupedIndex, group, groupIndex }` 제공 |

## 메서드

| 메서드 | 파라미터 | 설명 |
| ------ | -------- | ---- |
| `scrollToItem` | `id: string, offset?: number` | 주어진 id를 가진 항목으로 목록 스크롤. 가상 스크롤로 아직 렌더링되지 않은 항목도 지원. `offset`만큼 스크롤 위치를 위로 당겨 여백을 확보 (기본값: `0`) |
| `hasScroll` | - | `boolean` 반환 — 목록에 스크롤바가 있으면 `true` |
