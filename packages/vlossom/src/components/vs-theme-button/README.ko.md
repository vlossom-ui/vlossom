> For English documentation, see [README.md](./README.md).

# VsThemeButton

애플리케이션을 라이트와 다크 테마 사이에서 전환하는 토글 버튼 컴포넌트입니다.

**사용 가능 버전**: 2.0.0+

## 기능

- 라이트와 다크 모드 사이에서 전역 Vlossom 테마 전환
- 테마 변경 시 해/달 아이콘의 애니메이션 전환
- `VsToggle`에 모든 버튼 동작 위임
- 로딩 및 비활성화 상태 지원
- `styleSet`을 통한 크기 및 아이콘 색상 커스터마이징

## 기본 사용법

```html
<template>
    <vs-theme-button />
</template>
```

### 커스텀 크기

```html
<template>
    <vs-theme-button
        :style-set="{
            variables: { width: '3rem', height: '3rem', iconColor: '#ff9800' },
        }"
    />
</template>
```

### 비활성화 상태

```html
<template>
    <vs-theme-button disabled />
</template>
```

## Props

| Prop | 타입 | 기본값 | 필수 | 설명 |
| ---- | ---- | ------ | ---- | ---- |
| `colorScheme` | `string` | | | 컴포넌트 색상 스키마 |
| `styleSet` | `string \| VsThemeButtonStyleSet` | | | 컴포넌트 커스텀 스타일 세트 |
| `circle` | `boolean` | `false` | | 버튼을 원형으로 렌더링 |
| `disabled` | `boolean` | `false` | | 버튼 비활성화 |
| `ghost` | `boolean` | `false` | | 고스트(투명) 스타일 적용 |
| `loading` | `boolean` | `false` | | 로딩 인디케이터 표시 |
| `outline` | `boolean` | `false` | | 아웃라인 스타일 적용 |
| `primary` | `boolean` | `false` | | Primary 색상 스타일 적용 |
| `responsive` | `boolean` | `false` | | 버튼을 반응형으로 설정 |
| `size` | `Size` | `'md'` | | 버튼 크기 (`xs`, `sm`, `md`, `lg`, `xl`) |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | | HTML 버튼 타입 |

## 타입

```typescript
interface VsThemeButtonStyleSet {
    variables?: {
        width?: string;
        height?: string;
        iconColor?: string;
    };
    button?: VsToggleStyleSet;
}
```

> [!NOTE]
> `button`은 [`VsToggleStyleSet`](../vs-toggle/README.ko.md)을 사용합니다.

### StyleSet 예시

```html
<template>
    <vs-theme-button
        :style-set="{
            variables: {
                width: '2.5rem',
                height: '2.5rem',
                iconColor: '#ff9800',
            },
        }"
    />
</template>
```

## 이벤트

| 이벤트 | 페이로드 | 설명 |
| ------ | -------- | ---- |
| `change` | `boolean` | 테마 변경 시 발생. 다크 모드인 경우 `true` |

## 슬롯

| 슬롯 | 설명 |
| ---- | ---- |

## 메서드

| 메서드 | 매개변수 | 설명 |
| ------ | -------- | ---- |
