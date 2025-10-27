# VsThemeButton

Vlossom 프레임워크의 Light/Dark 테마를 전환하는 전용 버튼 컴포넌트입니다. 내부적으로 VsToggle을 사용하며, 태양과 달 아이콘으로 현재 테마 상태를 시각적으로 표시합니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 테마 버튼

```html
<template>
    <vs-theme-button @change="handleThemeChange" />
</template>

<script setup>
const handleThemeChange = (isDark: boolean) => {
    console.log('테마 변경:', isDark ? 'Dark' : 'Light');
};
</script>
```

## Props

| Prop          | Type                              | Default | Required | Description             |
| ------------- | --------------------------------- | ------- | -------- | ----------------------- |
| `colorScheme` | `ColorScheme`                     | -       | -        | 컴포넌트 색상 테마      |
| `styleSet`    | `string \| VsThemeButtonStyleSet` | -       | -        | 커스텀 스타일 설정 객체 |

**VsButton에서 상속받은 Props:**

- `circle`, `disabled`, `ghost`, `large`, `outline`, `primary`, `responsive`, `small`

> **Note**: VsButton의 모든 스타일링 props를 지원합니다. 자세한 내용은 [VsButton README](../vs-button/README.md) 및 [VsToggle README](../vs-toggle/README.md)를 참조하세요.

## Events

| Event    | Parameters | Description                                          |
| -------- | ---------- | ---------------------------------------------------- |
| `change` | `boolean`  | 테마가 변경될 때 발생 (`true`: Dark, `false`: Light) |

## Types

```typescript
interface VsThemeButtonStyleSet {
    width?: string; // 너비
    height?: string; // 높이

    backgroundColor?: string; // 배경 색상
    border?: string; // 테두리 스타일
    borderRadius?: string; // 모서리 둥글기
    opacity?: number; // 투명도

    iconColor?: string; // 아이콘 색상
}
```

## 특징

- **자동 테마 감지**: Vlossom 프레임워크의 현재 테마를 자동으로 반영
- **시각적 피드백**: 태양(☀️) 및 달(🌙) 아이콘으로 현재 테마 상태 표시
- **애니메이션 효과**: 부드러운 아이콘 전환 애니메이션 제공
- **VsToggle 기반**: VsToggle의 모든 기능과 스타일링 옵션 지원
- **프레임워크 연동**: `useVlossom().toggleTheme()` 자동 호출
- **이벤트 방출**: `change` 이벤트로 테마 변경 감지 가능

### 스타일 커스터마이징

```html
<template>
    <vs-theme-button :style-set="themeButtonStyle" />
</template>

<script setup>
const themeButtonStyle = {
    toggle: {
        backgroundColor: '#1f2937',
        border: '2px solid #374151',
        borderRadius: '50%',
        width: '3.5rem',
        height: '3.5rem',
    },
    iconColor: '#fcd34d',
};
</script>
```

## 주의사항

- 이 컴포넌트는 Vlossom 프레임워크와 긴밀히 연결되어 있습니다
- `useVlossom()` 훅을 통해 전역 테마 상태를 관리합니다
- 테마 변경은 전체 애플리케이션에 즉시 반영됩니다
