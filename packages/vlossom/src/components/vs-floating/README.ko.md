> English: [README.md](./README.md)

# VsFloating

특정 요소를 기준으로 위치를 자동 계산하여 표시하는 플로팅 컴포넌트입니다. 툴팁, 드롭다운, 팝오버 등 다양한 오버레이 UI를 구현할 때 사용할 수 있습니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 플로팅

```html
<template>
    <div id="my-button" style="padding: 8px 16px; border: 1px solid #ccc; display: inline-block; cursor: pointer;">
        Hover Me
    </div>
    <vs-floating target="#my-button" v-model="isOpen">
        <div>플로팅 내용</div>
    </vs-floating>
</template>

<script setup>
import { ref } from 'vue';
const isOpen = ref(false);
</script>
```

### 다양한 위치

```html
<template>
    <div style="display: flex; gap: 1rem;">
        <div id="top-button" style="padding: 8px 16px; border: 1px solid #ccc; display: inline-block; cursor: pointer;">
            Top
        </div>
        <vs-floating target="#top-button" v-model="topOpen" placement="top">
            <div>상단 플로팅</div>
        </vs-floating>

        <div id="right-button" style="padding: 8px 16px; border: 1px solid #ccc; display: inline-block; cursor: pointer;">
            Right
        </div>
        <vs-floating target="#right-button" v-model="rightOpen" placement="right">
            <div>오른쪽 플로팅</div>
        </vs-floating>

        <div id="bottom-button" style="padding: 8px 16px; border: 1px solid #ccc; display: inline-block; cursor: pointer;">
            Bottom
        </div>
        <vs-floating target="#bottom-button" v-model="bottomOpen" placement="bottom">
            <div>하단 플로팅</div>
        </vs-floating>

        <div id="left-button" style="padding: 8px 16px; border: 1px solid #ccc; display: inline-block; cursor: pointer;">
            Left
        </div>
        <vs-floating target="#left-button" v-model="leftOpen" placement="left">
            <div>왼쪽 플로팅</div>
        </vs-floating>
    </div>
</template>
```

### 정렬 옵션

```html
<template>
    <div style="display: flex; gap: 1rem;">
        <div id="start-button" style="padding: 8px 16px; border: 1px solid #ccc; display: inline-block; cursor: pointer;">
            Start
        </div>
        <vs-floating target="#start-button" v-model="startOpen" placement="top" align="start">
            <div>시작 정렬</div>
        </vs-floating>

        <div id="center-button" style="padding: 8px 16px; border: 1px solid #ccc; display: inline-block; cursor: pointer;">
            Center
        </div>
        <vs-floating target="#center-button" v-model="centerOpen" placement="top" align="center">
            <div>중앙 정렬</div>
        </vs-floating>

        <div id="end-button" style="padding: 8px 16px; border: 1px solid #ccc; display: inline-block; cursor: pointer;">
            End
        </div>
        <vs-floating target="#end-button" v-model="endOpen" placement="top" align="end">
            <div>끝 정렬</div>
        </vs-floating>
    </div>
</template>
```

### 너비 따라가기

```html
<template>
    <div id="follow-button" style="width: 200px; padding: 8px 16px; border: 1px solid #ccc; display: inline-block; cursor: pointer;">
        Follow Width
    </div>
    <vs-floating target="#follow-button" v-model="followOpen" follow-width>
        <div>타겟 요소의 너비를 따라갑니다</div>
    </vs-floating>
</template>
```

### 애니메이션 제어

```html
<template>
    <!-- 애니메이션 없이 표시 -->
    <div id="no-anim-button" style="padding: 8px 16px; border: 1px solid #ccc; display: inline-block; cursor: pointer;">
        No Animation
    </div>
    <vs-floating target="#no-anim-button" v-model="noAnimOpen" no-animation>
        <div>애니메이션 없음</div>
    </vs-floating>

    <!-- 지연 시간 설정 -->
    <div id="delay-button" style="padding: 8px 16px; border: 1px solid #ccc; display: inline-block; cursor: pointer;">
        Delay
    </div>
    <vs-floating
        target="#delay-button"
        v-model="delayOpen"
        :enter-delay="300"
        :leave-delay="200"
    >
        <div>지연 시간이 적용된 플로팅</div>
    </vs-floating>
</template>
```

### 슬롯에서 placement 사용

```html
<template>
    <div id="slot-button" style="padding: 8px 16px; border: 1px solid #ccc; display: inline-block; cursor: pointer;">
        Placement 사용
    </div>
    <vs-floating target="#slot-button" v-model="slotOpen">
        <template #default="{ placement }">
            <div>현재 위치: {{ placement }}</div>
        </template>
    </vs-floating>
</template>
```

## Props

| Prop          | Type                                                 | Default                  | Required | Description                              |
| ------------- | ---------------------------------------------------- | ------------------------ | -------- | ---------------------------------------- |
| `target`      | `string`                                             | -                        | `true`   | 플로팅을 표시할 대상 요소의 CSS selector |
| `align`       | `'start' \| 'center' \| 'end'`                       | `'start'`                | -        | 플로팅의 정렬 방식                       |
| `disabled`    | `boolean`                                            | `false`                  | -        | 플로팅 비활성화                          |
| `enterDelay`  | `string \| number`                                   | `0`                      | -        | 플로팅 표시 지연 시간 (ms)               |
| `followWidth` | `boolean`                                            | `false`                  | -        | 타겟 요소의 너비를 따라갈지 여부         |
| `leaveDelay`  | `string \| number`                                   | `0`                      | -        | 플로팅 숨김 지연 시간 (ms)               |
| `margin`      | `string \| number`                                   | `5`                      | -        | 플로팅과 타겟 요소 간의 간격             |
| `modelValue`  | `boolean`                                            | `false`                  | -        | 플로팅 표시/숨김 상태 (v-model)          |
| `noAnimation` | `boolean`                                            | `false`                  | -        | 애니메이션 비활성화                      |
| `overlayId`   | `string`                                             | `'#vs-floating-overlay'` | -        | 플로팅이 렌더링될 오버레이 컨테이너의 ID |
| `placement`   | `'top' \| 'right' \| 'bottom' \| 'left' \| 'middle'` | `'bottom'`               | -        | 플로팅 표시 위치                         |

## Events

| Event               | Payload   | Description             |
| ------------------- | --------- | ----------------------- |
| `update:modelValue` | `boolean` | v-model 값 변경 시 발생 |

## Slots

| Slot      | Props                      | Description                                       |
| --------- | -------------------------- | ------------------------------------------------- |
| `default` | `{ placement: Placement }` | 플로팅 내용. placement는 계산된 위치를 제공합니다 |

## 특징

- **자동 위치 계산**: 타겟 요소를 기준으로 자동으로 최적의 위치를 계산하여 표시
- **유연한 위치 설정**: 5가지 위치(`top`, `right`, `bottom`, `left`, `middle`)와 3가지 정렬 옵션(`start`, `center`, `end`) 지원
- **애니메이션 지원**: 부드러운 페이드 인/아웃 효과 (위치별 애니메이션)
- **지연 시간 설정**: 표시/숨김 지연 시간을 커스터마이징할 수 있음
- **너비 따라가기**: `followWidth` prop으로 타겟 요소의 너비를 따라가도록 설정 가능
