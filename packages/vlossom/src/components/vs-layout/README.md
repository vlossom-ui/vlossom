# VsLayout

애플리케이션의 전체 레이아웃을 관리하는 레이아웃 컴포넌트입니다. 각 드로어(drawer)의 `responsive` 속성에 따라 동적으로 패딩을 조정하여 반응형 레이아웃을 제공합니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 레이아웃

```html
<template>
    <vs-layout>
        <vs-header>Header Content</vs-header>
        <vs-container>Main Content</vs-container>
        <vs-drawer>Drawer Content</vs-drawer>
        <vs-footer>Footer Content</vs-footer>
    </vs-layout>
</template>
```

### 반응형 드로어 레이아웃

```html
<template>
    <vs-layout>
        <vs-drawer placement="left" size="250px" open responsive>
            <!-- 왼쪽 드로어 내용 -->
        </vs-drawer>

        <vs-container>
            <!-- 메인 콘텐츠 -->
        </vs-container>

        <vs-drawer placement="right" size="300px" open responsive>
            <!-- 오른쪽 드로어 내용 -->
        </vs-drawer>
    </vs-layout>
</template>
```

## Slots

| Slot      | Description                   |
| --------- | ----------------------------- |
| `default` | 레이아웃 내부에 배치할 콘텐츠 |

## 특징

- **유기적인 layout 제공**: `vs-header`, `vs-container`, `vs-drawer`, `vs-footer`와 함께 사용하면 쉽게 layout 구성 가능
- **레이아웃 스토어 제공**: `LAYOUT_STORE_KEY`를 통해 하위 컴포넌트에 레이아웃 상태를 provide를 이용해 제공
- **동적 패딩 조정**: 각 드로어의 `responsive` 속성이 활성화되면 열린 드로어에 따라 자동으로 패딩 조정 가능
