# VsDrawer

화면 가장자리에서 슬라이딩하여 나타나는 사이드바 형태의 드로어(서랍) 컴포넌트입니다. 네비게이션 메뉴, 사이드바, 필터 패널 등 다양한 용도로 활용할 수 있으며, `vs-layout`과 함께 사용하면 반응형 레이아웃을 구성할 수 있습니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 드로어

```html
<template>
    <div>
        <vs-button @click="drawerOpen = true">드로어 열기</vs-button>
        <vs-drawer v-model="drawerOpen">
            <h3>드로어 내용</h3>
            <p>여기에 사이드바 내용을 넣어주세요.</p>
        </vs-drawer>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const drawerOpen = ref(false);
</script>
```

### 다양한 위치의 드로어

```html
<template>
    <div>
        <vs-drawer v-model="leftDrawer" placement="left">
            <h3>왼쪽 드로어</h3>
        </vs-drawer>

        <vs-drawer v-model="rightDrawer" placement="right">
            <h3>오른쪽 드로어</h3>
        </vs-drawer>

        <vs-drawer v-model="topDrawer" placement="top">
            <h3>상단 드로어</h3>
        </vs-drawer>

        <vs-drawer v-model="bottomDrawer" placement="bottom">
            <h3>하단 드로어</h3>
        </vs-drawer>
    </div>
</template>
```

### 크기 조절

```html
<template>
    <div>
        <!-- 사전 정의된 크기 (xs, sm, md, lg, xl) -->
        <vs-drawer v-model="smallDrawer" size="sm">Small Drawer</vs-drawer>
        <vs-drawer v-model="mediumDrawer" size="md">Medium Drawer</vs-drawer>
        <vs-drawer v-model="largeDrawer" size="lg">Large Drawer</vs-drawer>

        <!-- 커스텀 크기 -->
        <vs-drawer v-model="customDrawer" size="350px">Custom Size Drawer</vs-drawer>
        <vs-drawer v-model="percentDrawer" size="30%">Percent Size Drawer</vs-drawer>
    </div>
</template>
```

### vs-layout과 함께 사용하기

`vs-layout` 안에 배치하면 두 가지 동작이 자동으로 이루어집니다.

1. **Drawer 내부 위치 보정**: `vs-header` / `vs-footer`가 `absolute` 또는 `fixed`로 배치된 경우, Drawer 자체가 상하 padding 또는 `top` offset을 자동으로 조정해 겹치지 않도록 합니다.
2. **vs-container 패딩 조정**: `vs-container`에 `drawer-responsive`를 설정하면, Drawer가 열릴 때 해당 방향의 padding이 자동으로 추가됩니다.

```html
<template>
    <vs-layout>
        <vs-header position="absolute" primary>Header</vs-header>

        <vs-drawer placement="left" size="280px" open>
            <template #header>
                <h2>네비게이션</h2>
            </template>

            <nav>
                <a href="#">홈</a>
                ...
            </nav>

            <template #footer>
                <small>© 2024 My App</small>
            </template>
        </vs-drawer>

        <!-- drawer-responsive: Drawer 열림 → paddingLeft 자동 추가 -->
        <!-- Header absolute → paddingTop은 drawer-responsive 없이도 자동 적용 -->
        <vs-container drawer-responsive>
            <main>Main Content</main>
        </vs-container>

        <vs-footer position="absolute" primary>Footer</vs-footer>
    </vs-layout>
</template>
```

### 고정 포지션 드로어

```html
<template>
    <vs-drawer v-model="fixedDrawer" fixed>
        <!-- 페이지 스크롤과 관계없이 화면에 고정됩니다 -->
        <h3>고정 드로어</h3>
    </vs-drawer>
</template>
```

## Props

| Prop               | Type                                     | Default  | Required | Description                                                 |
| ------------------ | ---------------------------------------- | -------- | -------- | ----------------------------------------------------------- |
| `colorScheme`      | `ColorScheme`                            | -        | -        | 컴포넌트 색상 테마                                          |
| `styleSet`         | `string \| VsDrawerStyleSet`             | -        | -        | 커스텀 스타일 설정 객체                                     |
| `callbacks`        | `OverlayCallbacks`                       | -        | -        | 오버레이 상태 변화 시 호출될 콜백 함수들                    |
| `dimClose`         | `boolean`                                | `false`  | -        | 배경(dimmed) 클릭 시 드로어를 닫을지 여부                   |
| `dimmed`           | `boolean`                                | `false`  | -        | 배경 어둡게 처리(dimmed overlay) 사용 여부                  |
| `escClose`         | `boolean`                                | `false`  | -        | ESC 키 누를 시 드로어를 닫을지 여부                         |
| `focusLock`        | `boolean`                                | `false`  | -        | 포커스가 드로어 내부에만 머무르도록 제한할지 여부           |
| `id`               | `string`                                 | -        | -        | 고유 식별자                                                 |
| `fixed`            | `boolean`                                | `false`  | -        | 고정 포지션(position: fixed) 사용 여부                      |
| `open`             | `boolean`                                | `false`  | -        | 초기 열림 상태 (제어되지 않는 모드)                         |
| `placement`        | `'left' \| 'right' \| 'top' \| 'bottom'` | `'left'` | -        | 드로어가 나타나는 위치                                      |
| `size`             | `SizeProp`                               | `'sm'`   | -        | 드로어 크기 ('xs'\|'sm'\|'md'\|'lg'\|'xl' 또는 사용자 정의) |
| `modelValue`       | `boolean`                                | `false`  | -        | v-model 바인딩을 위한 값                                    |

## Events

| Event               | Payload   | Description                       |
| ------------------- | --------- | --------------------------------- |
| `update:modelValue` | `boolean` | v-model 값 변경 시 발생           |
| `open`              | -         | 드로어 열림 시 발생               |
| `close`             | -         | 드로어 닫힘 시 발생               |
| `click-dimmed`      | -         | 배경(dimmed overlay) 클릭 시 발생 |

## Types

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

type SizeProp = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string | number;
```

> [!NOTE]
>
> `dimmed`는 [VsDimmedStyleSet](../vs-dimmed/README.md#types)을 사용합니다.

### StyleSet 사용 예시

```html
<template>
    <vs-drawer
        v-model="drawerOpen"
        :style-set="{
            variables: {
                size: '400px',
            },
            content: {
                backgroundColor: '#1e293b',
                color: '#f8fafc',
                borderRadius: '0 16px 16px 0',
                boxShadow: '4px 0 20px rgba(0, 0, 0, 0.3)',
            },
            header: {
                backgroundColor: '#334155',
                borderBottom: '1px solid #475569',
            },
            footer: {
                backgroundColor: '#334155',
                borderTop: '1px solid #475569',
            },
            dimmed: {
                component: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
            },
        }"
    >
        <h3>커스텀 스타일 드로어</h3>
    </vs-drawer>
</template>
```

## Slots

| Slot      | Description               |
| --------- | ------------------------- |
| `default` | 드로어의 메인 콘텐츠 영역 |
| `header`  | 드로어 상단 헤더 영역     |
| `footer`  | 드로어 하단 푸터 영역     |

## Methods

| Method        | Parameters | Description            |
| ------------- | ---------- | ---------------------- |
| `openDrawer`  | -          | 드로어를 프로그래밍 방식으로 엽니다 |
| `closeDrawer` | -          | 드로어를 프로그래밍 방식으로 닫습니다 |

```html
<template>
    <vs-drawer ref="drawerRef" v-model="drawerOpen">
        <p>Drawer content</p>
    </vs-drawer>
    <vs-button @click="drawerRef.openDrawer()">Open</vs-button>
    <vs-button @click="drawerRef.closeDrawer()">Close</vs-button>
</template>

<script setup>
import { ref } from 'vue';
const drawerRef = ref(null);
const drawerOpen = ref(false);
</script>
```

## 특징

- **다양한 위치 지원**: `left`, `right`, `top`, `bottom` 4방향에서 슬라이딩
- **유연한 크기 조절**: 사전 정의된 크기(`xs`~`xl`) 또는 픽셀/퍼센트 등 커스텀 크기 지원
- **오버레이 기능**: 배경 어둡게 처리, 배경 클릭으로 닫기, ESC 키로 닫기 등
- **접근성**: 포커스 트랩 기능으로 키보드 네비게이션 지원
- **애니메이션**: 부드러운 슬라이딩 애니메이션 효과
- **v-model 지원**: 양방향 데이터 바인딩을 통한 상태 관리
- **vs-layout 연동**: `vs-layout` 안에 배치하면 헤더/푸터 포지션에 따라 드로어 내부 padding 및 offset을 자동 조정. `vs-container`에 `drawer-responsive`를 설정하면 드로어 개폐에 따라 컨텐츠 영역 padding도 자동으로 반응
