> For English documentation, see [README.md](./README.md).

# VsDrawer

화면의 가장자리에서 슬라이드 인/아웃되는 패널 컴포넌트로, 선택적으로 딤드 배경 및 포커스 트래핑을 지원합니다.

**사용 가능 버전**: 2.0.0+

## 기능

- `left`, `right`, `top`, `bottom` 네 가지 방향 지원
- 클릭 시 닫기 기능을 포함한 선택적 딤드 배경
- 접근성 있는 키보드 탐색을 위한 포커스 트래핑
- `layout` prop을 통한 `VsLayout` 통합 opt-in — 설정 시 헤더/푸터 높이를 자동 오프셋하고, 컨테이너 패딩 계산에도 반영
- 부드러운 슬라이드 인/아웃 트랜지션 애니메이션
- `v-model` 또는 `openDrawer` / `closeDrawer` 메서드로 제어 가능

## 기본 사용법

```html
<template>
    <vs-button @click="open = true">드로어 열기</vs-button>
    <vs-drawer v-model="open" placement="left">
        <template #header>헤더</template>
        <p>드로어 내용이 여기에 들어갑니다.</p>
        <template #footer>푸터</template>
    </vs-drawer>
</template>

<script setup>
import { ref } from 'vue';
const open = ref(false);
</script>
```

### 딤드 배경이 있는 오른쪽 드로어

```html
<template>
    <vs-button @click="drawerOpen = true">오른쪽 드로어 열기</vs-button>
    <vs-drawer v-model="drawerOpen" placement="right" dimmed dim-close>
        <p>배경을 클릭하면 닫힙니다.</p>
    </vs-drawer>
</template>

<script setup>
import { ref } from 'vue';
const drawerOpen = ref(false);
</script>
```

### 고정 위치 및 사용자 정의 크기 드로어

```html
<template>
    <vs-drawer v-model="open" placement="top" :size="'30%'" fixed>
        <p>30% 높이의 상단 드로어.</p>
    </vs-drawer>
</template>
```

### VsLayout 내부에서 사용

`layout` prop을 설정하면 드로어가 레이아웃 스토어에 등록됩니다. `pushContainer`와 함께 사용하면 `VsContainer`를 옆으로 밀어 공간을 확보합니다 (overlay 대신). 다른 컴포넌트로 한 번 감싼 경우에도 동작합니다.

```html
<template>
    <vs-layout>
        <vs-drawer v-model="open" layout push-container placement="left" size="240px">
            <p>사이드바</p>
        </vs-drawer>
        <vs-container layout>
            <p>콘텐츠</p>
        </vs-container>
    </vs-layout>
</template>
```

## Props

| Prop | 타입 | 기본값 | 필수 | 설명 |
| ---- | ---- | ------ | ---- | ---- |
| `colorScheme` | `string` | | | 컴포넌트의 색상 스킴 |
| `styleSet` | `string \| VsDrawerStyleSet` | | | 컴포넌트의 사용자 정의 스타일 셋 |
| `callbacks` | `OverlayCallbacks` | `{}` | | 오버레이 이벤트 콜백 함수 |
| `dimClose` | `boolean` | `false` | | 딤드 배경 클릭 시 드로어 닫기 |
| `dimmed` | `boolean` | `false` | | 드로어 뒤에 딤드 배경 표시 |
| `escClose` | `boolean` | `false` | | Escape 키 입력 시 드로어 닫기 |
| `focusLock` | `boolean` | `false` | | 드로어가 열려 있는 동안 포커스 가두기 |
| `hideScroll` | `boolean` | `false` | | 드로어 내부 스크롤바 숨기기 |
| `id` | `string` | `''` | | 드로어의 HTML id 속성 |
| `fixed` | `boolean` | `false` | | `absolute` 대신 `position: fixed` 사용 |
| `open` | `boolean` | `false` | | 마운트 시 드로어 열기 |
| `layout` | `boolean` | `false` | | `VsLayout` 통합 opt-in. `VsLayout` 조상이 있어야 동작하며, 없으면 무시됩니다 |
| `pushContainer` | `boolean` | `false` | | `layout`과 함께 사용 시 드로어가 `VsContainer`를 옆으로 밀어 공간을 확보 (overlay 대신) |
| `placement` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'left'` | | 드로어가 슬라이드 인되는 가장자리 방향 |
| `size` | `string \| number` | | | 드로어 패널의 너비(left/right) 또는 높이(top/bottom). 크기 토큰(`xs`, `sm`, `md`, `lg`, `xl`) 또는 CSS 값 허용 |
| `modelValue` | `boolean` | `false` | | 열기 상태를 제어하는 v-model 바인딩 |

## 타입

```typescript
interface VsDrawerStyleSet {
    variables?: {
        size?: string;
    };
    component?: CSSProperties;
    dimmed?: VsDimmedStyleSet;
    header?: CSSProperties;
    content?: CSSProperties;
    footer?: CSSProperties;
}
```

> [!NOTE]
> `dimmed`는 [VsDimmedStyleSet](../vs-dimmed/README.md)을 사용합니다.

### StyleSet 예시

```html
<template>
    <vs-drawer
        v-model="open"
        :style-set="{
            variables: { size: '400px' },
            component: { backgroundColor: '#1a1a2e' },
            header: { padding: '1.5rem', borderBottom: '1px solid #eee' },
            content: { padding: '1.5rem' },
            footer: { padding: '1rem', borderTop: '1px solid #eee' },
        }"
    >
        <template #header>나의 헤더</template>
        <p>콘텐츠 영역</p>
        <template #footer>나의 푸터</template>
    </vs-drawer>
</template>
```

## 이벤트

| 이벤트 | 페이로드 | 설명 |
| ------ | -------- | ---- |
| `update:modelValue` | `boolean` | 열기 상태가 변경될 때 발생 |
| `open` | - | 드로어가 열릴 때 발생 |
| `close` | - | 드로어가 닫힐 때 발생 |
| `click-dimmed` | - | 딤드 배경이 클릭될 때 발생 |

## 슬롯

| 슬롯 | 설명 |
| ---- | ---- |
| `default` | 드로어의 메인 콘텐츠 |
| `header` | 드로어의 헤더 영역 |
| `footer` | 드로어의 푸터 영역 |

## 메서드

| 메서드 | 파라미터 | 설명 |
| ------ | -------- | ---- |
| `openDrawer` | - | 프로그래밍 방식으로 드로어 열기 |
| `closeDrawer` | - | 프로그래밍 방식으로 드로어 닫기 |
