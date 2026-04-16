> For English documentation, see [README.md](./README.md).

# VsTextWrap

텍스트 콘텐츠를 감싸고 클립보드 복사 및 외부 링크 액션 버튼을 제공하는 컨테이너 컴포넌트입니다.

**사용 가능 버전**: 2.0.0+

## 기능

- 성공 시 아이콘이 변경되는 시각적 피드백이 있는 클립보드 복사 버튼
- 새 탭에서 URL을 여는 외부 링크 버튼
- 추가 버튼을 위한 커스텀 액션 슬롯
- CSS 변수를 지원하는 설정 가능한 너비
- 필수 props가 없는 가벼운 래퍼

## 기본 사용법

```html
<template>
    <vs-text-wrap copy>
        <p>이 텍스트를 클립보드에 복사할 수 있습니다.</p>
    </vs-text-wrap>
</template>
```

### 링크 버튼 사용

```html
<template>
    <vs-text-wrap link="https://vlossom.dev">
        웹사이트 방문하기
    </vs-text-wrap>
</template>
```

### 복사 및 링크 함께 사용

```html
<template>
    <vs-text-wrap copy link="https://vlossom.dev" :width="400">
        <code>npm install vlossom</code>
    </vs-text-wrap>
</template>
```

### 커스텀 액션 슬롯

```html
<template>
    <vs-text-wrap>
        <p>콘텐츠</p>
        <template #actions>
            <button @click="doSomething">커스텀 액션</button>
        </template>
    </vs-text-wrap>
</template>
```

## Props

| Prop | 타입 | 기본값 | 필수 | 설명 |
| ---- | ---- | ------ | ---- | ---- |
| `styleSet` | `string \| VsTextWrapStyleSet` | | | 컴포넌트 커스텀 스타일 세트 |
| `copy` | `boolean` | `false` | | 클립보드 복사 버튼 표시 |
| `link` | `string` | `''` | | 링크 버튼 클릭 시 새 탭에서 열 URL |
| `width` | `string \| number` | `''` | | 컴포넌트 너비 |

## 타입

```typescript
interface VsTextWrapStyleSet {
    component?: CSSProperties;
    copyIcon?: CSSProperties;
    linkIcon?: CSSProperties;
}
```

### StyleSet 예시

```html
<template>
    <vs-text-wrap
        copy
        :style-set="{
            component: { backgroundColor: '#f5f5f5', borderRadius: '0.5rem', padding: '1rem' },
            copyIcon: { color: '#1976d2', fontSize: '1.2rem' },
            linkIcon: { color: '#4caf50' },
        }"
    >
        <p>스타일이 적용된 콘텐츠</p>
    </vs-text-wrap>
</template>
```

## 이벤트

| 이벤트 | 페이로드 | 설명 |
| ------ | -------- | ---- |
| `copied` | `string` | 텍스트가 클립보드에 성공적으로 복사될 때 발생 |

## 슬롯

| 슬롯 | 설명 |
| ---- | ---- |
| `default` | 표시할 메인 텍스트 콘텐츠 |
| `actions` | 복사/링크 버튼 앞에 표시되는 추가 액션 버튼 |

## 메서드

| 메서드 | 매개변수 | 설명 |
| ------ | -------- | ---- |

## 주의사항

`link` prop은 `http:` 또는 `https:` URL만 허용합니다. 유효하지 않거나 안전하지 않은 URL은 콘솔 경고와 함께 무시됩니다.
