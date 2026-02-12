# Optional: Scope this rule to specific files

## Rules

- • Props table must document all available component properties
- • Removing styleSet from Props table creates incomplete API documentation

- • Document global style-set configuration via VlossomOptions
- • Link component-level styleSet prop with application-wide settings

- • Check all documentation files for accidental modifications
- • Review changes made during English translation process
- • Ensure only intended content updates are included

## Reviewed Code

File: `packages/vlossom/src/components/vs-inner-scroll/README.md` (lines 79-79)

```
@@ -71,12 +71,55 @@ function checkScroll() {
 </script>
 ```
 
+## Types
+
+```typescript
+interface VsInnerScrollStyleSet {
+    component?: CSSProperties;
+    header?: CSSProperties;
+    content?: CSSProperties;
+    footer?: CSSProperties;
+}
+```
+
+## StyleSet 사용 예시
+
+```html
+<template>
+    <vs-inner-scroll
+        :style-set="{
+            component: {
+                backgroundColor: '#f5f5f5',
+            },
+            header: {
+                padding: '24px',
+            },
+            content: {
+                padding: '24px',
+            },
+            footer: {
+                padding: '16px',
+            },
+        }"
+    >
+        <template #header>
+            <div>Header Content</div>
+        </template>
+
+        <div>Scrollable Content</div>
+
+        <template #footer>
+            <div>Footer Content</div>
+        </template>
+    </vs-inner-scroll>
+</template>
+```
+
 ## Props
 
-| Prop         | Type                              | Default | Required | Description             |
-| ------------ | --------------------------------- | ------- | -------- | ----------------------- |
-| `hideScroll` | `boolean`                         | `false` | -        | 스크롤바 표시/숨김 여부 |
-| `styleSet`   | `string \| VsInnerScrollStyleSet` | -       | -        | 커스텀 스타일 설정 객체 |
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @sunio00000
**Keywords:** git, props-table, api-documentation, component-interface, documentation-completeness
**Category:** documentation

File: `guidelines/STYLE_SET_GUIDELINES.md` (lines 57-57)

```
@@ -0,0 +1,713 @@
+# Vlossom Style-Set 시스템 개발 가이드라인
+
+> 컴포넌트 스타일 커스터마이징을 위한 타입 안전한 인터페이스
+
+**버전**: 2.0.0+
+
+---
+
+## 📖 목차
+
+1. [Style-Set이란?](#style-set이란)
+2. [핵심 개념](#핵심-개념)
+3. [타입 정의 패턴](#타입-정의-패턴)
+4. [구현 방법](#구현-방법)
+5. [사용 가이드](#사용-가이드)
+6. [설계 규칙](#설계-규칙)
+7. [CSS 작성 규칙](#css-작성-규칙)
+8. [FAQ](#faq)
+9. [안티패턴](#안티패턴)
+10. [참고 자료](#참고-자료)
+
+---
+
+## Style-Set이란?
+
+Vlossom의 모든 컴포넌트는 `styleSet` prop을 통해 스타일을 커스터마이징할 수 있습니다.
+
+```vue
+<vs-button
+    :style-set="{
+        variables: { padding: '2rem' },
+        component: { backgroundColor: 'red' },
+        loading: { variables: { color: 'white' } }
+    }"
+>
+    Click
+</vs-button>
+```
+
+**철학**: Variables for Variability, Properties for Predictability
+
+> 💡 **핵심 원칙**: Variables는 최소화하고, CSSProperties로 직접 제어
+
+### 설계 방향 (v2.0.0+)
+
+1. **Variables 최소화**
+
+    - 런타임에 동적으로 변경되는 값만 `variables`로 노출
+    - 한 번 설정하면 변경되지 않는 값은 제외
+
+2. **CSSProperties 우선**
+    - 대부분의 스타일은 `component`, `elementName` CSSProperties로 제어
+    - 더 유연하고, 타입 안전하며, 직관적
+
+---
+
+## 핵심 개념
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** style, vlossomoptions, style-set, global-configuration, plugin-options, documentation-completeness
**Category:** documentation

File: `packages/vlossom/src/components/vs-index-view/README.md` (lines 65-65)

```
@@ -60,9 +60,9 @@ const currentIndex = ref(0);
 
 ## Events
 
-| Event               | Payload  | Description                |
-| ------------------- | -------- | -------------------------- |
-| `update:modelValue` | `number` | 인덱스 값이 변경될 때 발생 |
+| Event               | Payload  | Description             |
+| ------------------- | -------- | ----------------------- |
+| `update:modelValue` | `number` | v-model 값 변경 시 발생 |
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** translation, documentation-review, unintended-changes, i18n-migration
**Category:** documentation