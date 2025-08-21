# VsHeader

웹 애플리케이션의 헤더 영역을 담당하는 컴포넌트입니다. `vs-layout`과 함께 사용하면 레이아웃 스토어를 통해 자동으로 상태가 관리됩니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 헤더

```html
<template>
    <vs-header>
        <h1>My App</h1>
        <nav>
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
        </nav>
    </vs-header>
</template>
```

### vs-layout과 함께 사용

```html
<template>
    <vs-layout>
        <vs-header position="fixed" :style-set="{ height: '4rem', backgroundColor: '#2196f3', fontColor: '#ffffff' }">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h1>My App</h1>
                <nav>
                    <button>Home</button>
                    <button>About</button>
                    <button>Contact</button>
                </nav>
            </div>
        </vs-header>
        <vs-container>
            <!-- vs-header가 fixed일 때 자동으로 패딩이 조정됩니다 -->
            <main>Main Content</main>
        </vs-container>
    </vs-layout>
</template>
```

### Primary 헤더

```html
<template>
    <vs-header primary>
        <h1>강조된 헤더</h1>
    </vs-header>
</template>
```

### 고정 헤더

```html
<template>
    <vs-header position="fixed" :style-set="{ height: '4rem', zIndex: '1000' }">
        <div>항상 상단에 고정된 헤더</div>
    </vs-header>
</template>
```

### 커스텀 태그

```html
<template>
    <vs-header tag="div">
        <span>div 태그로 렌더링된 헤더</span>
    </vs-header>
</template>
```

## Props

| Prop          | Type                                                          | Default      | Required | Description                            |
| ------------- | ------------------------------------------------------------- | ------------ | -------- | -------------------------------------- |
| `colorScheme` | `ColorScheme`                                                 | -            | -        | 컴포넌트 색상 테마                     |
| `styleSet`    | `string \| VsHeaderStyleSet`                                  | -            | -        | 커스텀 스타일 설정 객체                |
| `primary`     | `boolean`                                                     | `false`      | -        | 강조 스타일 적용                       |
| `position`    | `'relative' \| 'absolute' \| 'fixed' \| 'sticky' \| 'static'` | `'relative'` | -        | CSS position 속성 설정                 |
| `tag`         | `string`                                                      | `'header'`   | -        | 렌더링할 HTML 태그 지정 (기본: header) |

## Types

```typescript
interface VsHeaderStyleSet {
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
    bottom?: string | number; // 하단 위치
    left?: string | number; // 좌측 위치
    right?: string | number; // 우측 위치
    width?: string; // 너비
    zIndex?: string; // z-index 값
}
```

## Slots

| Slot      | Description               |
| --------- | ------------------------- |
| `default` | 헤더 내부에 표시할 콘텐츠 |

## 특징

- **시멘틱 HTML**: 기본적으로 `<header>` 태그를 사용하여 시멘틱 마크업 지원
- **레이아웃 통합**: `vs-layout`의 자식으로 사용하면 자동으로 레이아웃 스토어에 상태 등록
- **자동 패딩 조정**: `position`이 `fixed`, `absolute`, `sticky`일 때 `vs-container`가 자동으로 패딩 조정
- **기본 높이**: 기본 높이 3rem 제공으로 일관된 헤더 크기 보장
- **유연한 위치 지정**: 다양한 CSS position 옵션 지원
- **Primary 스타일**: 강조가 필요한 헤더에 적용할 수 있는 primary 스타일

## 레이아웃 스토어 연동

`vs-layout`의 자식으로 사용할 때 다음과 같은 동작이 수행됩니다:

1. **자동 등록**: 헤더의 `position`과 `height` 정보가 레이아웃 스토어에 자동 등록
2. **실시간 업데이트**: props나 styleSet이 변경되면 레이아웃 스토어도 자동 업데이트
3. **컨테이너 연동**: `vs-container`가 헤더의 position과 height를 참조하여 적절한 패딩 적용

```html
<template>
    <vs-layout>
        <!-- 이 헤더의 상태는 자동으로 레이아웃 스토어에 등록됩니다 -->
        <vs-header position="fixed" :style-set="{ height: '4rem' }">
            Header Content
        </vs-header>

        <!-- 컨테이너가 자동으로 paddingTop: 4rem을 적용합니다 -->
        <vs-container>
            Main Content
        </vs-container>
    </vs-layout>
</template>
```

## 사용 예시

### 완전한 애플리케이션 헤더

```html
<template>
    <vs-layout>
        <vs-header
            position="sticky"
            primary
            :style-set="{
                height: '4rem',
                padding: '0 2rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }"
        >
            <div style="display: flex; justify-content: space-between; align-items: center; height: 100%;">
                <div style="display: flex; align-items: center;">
                    <img src="/logo.svg" alt="Logo" style="height: 2rem; margin-right: 1rem;">
                    <h1 style="margin: 0; font-size: 1.5rem;">My App</h1>
                </div>

                <nav style="display: flex; gap: 1rem;">
                    <a href="#" style="text-decoration: none; color: inherit;">Home</a>
                    <a href="#" style="text-decoration: none; color: inherit;">Products</a>
                    <a href="#" style="text-decoration: none; color: inherit;">About</a>
                    <a href="#" style="text-decoration: none; color: inherit;">Contact</a>
                </nav>

                <div>
                    <button style="padding: 0.5rem 1rem; border: none; background: rgba(255,255,255,0.2); color: inherit; border-radius: 4px;">
                        Login
                    </button>
                </div>
            </div>
        </vs-header>

        <vs-container>
            <main style="padding: 2rem;">
                <h2>Welcome to My App</h2>
                <p>헤더가 sticky 방식으로 동작하여 스크롤 시 상단에 고정됩니다.</p>
            </main>
        </vs-container>
    </vs-layout>
</template>
```

