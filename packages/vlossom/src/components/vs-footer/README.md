# VsFooter

웹 애플리케이션의 푸터 영역을 담당하는 컴포넌트입니다. `vs-layout`과 함께 사용하면 레이아웃 스토어를 통해 자동으로 상태가 관리됩니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 푸터

```html
<template>
    <vs-footer>
        <p>&copy; 2024 My App. All rights reserved.</p>
        <nav>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact</a>
        </nav>
    </vs-footer>
</template>
```

### vs-layout과 함께 사용

```html
<template>
    <vs-layout>
        <vs-container>
            <!-- vs-footer가 fixed일 때 자동으로 패딩이 조정됩니다 -->
            <main>Main Content</main>
        </vs-container>
        <vs-footer position="fixed" :style-set="{ height: '4rem', backgroundColor: '#1976d2', fontColor: '#ffffff' }">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <p>&copy; 2024 My App</p>
                <nav>
                    <button>Privacy</button>
                    <button>Terms</button>
                    <button>Contact</button>
                </nav>
            </div>
        </vs-footer>
    </vs-layout>
</template>
```

### Primary 푸터

```html
<template>
    <vs-footer primary>
        <p>강조된 푸터</p>
    </vs-footer>
</template>
```

### 고정 푸터

```html
<template>
    <vs-footer position="fixed" :style-set="{ height: '4rem', zIndex: '1000' }">
        <div>항상 하단에 고정된 푸터</div>
    </vs-footer>
</template>
```

### 커스텀 태그

```html
<template>
    <vs-footer tag="div">
        <span>div 태그로 렌더링된 푸터</span>
    </vs-footer>
</template>
```

## Props

| Prop          | Type                                                          | Default      | Required | Description                            |
| ------------- | ------------------------------------------------------------- | ------------ | -------- | -------------------------------------- |
| `colorScheme` | `ColorScheme`                                                 | -            | -        | 컴포넌트 색상 테마                     |
| `styleSet`    | `string \| VsFooterStyleSet`                                  | -            | -        | 커스텀 스타일 설정 객체                |
| `position`    | `'relative' \| 'absolute' \| 'fixed' \| 'sticky' \| 'static'` | `'relative'` | -        | CSS position 속성 설정                 |
| `height`      | `string`                                                      | -            | -        | 푸터의 높이 설정                       |
| `primary`     | `boolean`                                                     | `false`      | -        | 강조 스타일 적용                       |
| `tag`         | `string`                                                      | `'footer'`   | -        | 렌더링할 HTML 태그 지정 (기본: footer) |

## Types

```typescript
interface VsFooterStyleSet {
    backgroundColor?: string; // 배경색
    border?: string; // 테두리 스타일
    borderRadius?: string; // 테두리 반지름
    boxShadow?: string; // 그림자 효과
    fontColor?: string; // 텍스트 색상
    fontSize?: string; // 폰트 크기
    fontWeight?: string; // 폰트 두께
    height?: string; // 높이 (기본: 3rem)
    padding?: string; // 내부 여백
    position?: 'fixed' | 'absolute' | 'relative' | 'sticky' | 'static'; // 위치 지정
    top?: string | number; // 상단 위치
    bottom?: string | number; // 하단 위치 (footer는 bottom 값을 보정)
    left?: string | number; // 좌측 위치
    right?: string | number; // 우측 위치
    width?: string; // 너비
    zIndex?: string; // z-index 값
}
```

## Slots

| Slot      | Description               |
| --------- | ------------------------- |
| `default` | 푸터 내부에 표시할 콘텐츠 |

## 특징

- **시멘틱 HTML**: 기본적으로 `<footer>` 태그를 사용하여 시멘틱 마크업 지원 (tag props로 변경 가능)
- **레이아웃 통합**: `vs-layout`의 자식으로 사용하면 자동으로 레이아웃 스토어에 상태 등록
- **자동 패딩 조정**: `position`이 `fixed`, `absolute`, `sticky`일 때 `vs-container`가 자동으로 패딩 조정
- **Primary 스타일**: 강조가 필요한 푸터에 적용할 수 있는 primary 스타일
- **Bottom 보정**: footer는 top보다는 bottom 값을 보정하는 것이 중요

## 레이아웃 스토어 연동

`vs-layout`의 자식으로 사용할 때 다음과 같은 동작이 수행됩니다:

1. **자동 등록**: 푸터의 `position`과 `height` 정보가 레이아웃 스토어에 자동 등록
2. **실시간 업데이트**: props나 styleSet이 변경되면 레이아웃 스토어도 자동 업데이트
3. **컨테이너 연동**: `vs-container`가 푸터의 position과 height를 참조하여 적절한 패딩 적용

## Header와의 차이점

- **기본 태그**: `footer` (vs-header는 `header`)
- **위치 보정**: `bottom` 값을 보정 (vs-header는 `top` 값을 보정)
- **용도**: 페이지나 섹션의 하단 영역을 담당
