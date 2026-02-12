# Optional: Scope this rule to specific files

## Rules

- • Reviewer curious about rationale behind specific numeric constant
- • Magic number needs explanation or comment for clarity

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @Baejw0111
**Keywords:** magic-number, clarification, percentage, constant-value
**Category:** documentation

- Avoid creating dependencies by extending styleset interfaces
- Reference external component docs instead of inheriting types
- Maintain loose coupling between component style definitions

- • Reference exact type names (e.g., CheckboxStyleSet) not generic StyleSet
- • Improves clarity and precision in technical documentation

- • Example placement should follow user learning flow (basic→advanced)
- • StyleSet example could be introduced earlier with basic props usage

## Reviewed Code

File: `packages/vlossom/src/components/vs-toggle/README.md` (lines 102-102)

```
@@ -88,27 +88,48 @@ const handleToggle = (value: boolean) => {
 ## Types
 
 ```typescript
-interface VsToggleStyleSet {
-    width?: string;
-    height?: string;
-
-    backgroundColor?: string;
-    border?: string;
-    borderRadius?: string;
-    padding?: string;
-    opacity?: string;
-
-    fontColor?: string;
-
-    loading?: {
-        width?: string;
-        height?: string;
-        color?: string;
-        barWidth?: string;
+interface VsToggleStyleSet extends VsButtonStyleSet {}
+```
+
+VsToggle은 VsButton을 래핑하므로 VsButtonStyleSet을 상속받습니다.
+
+```typescript
+interface VsButtonStyleSet {
+    variables?: {
+        padding?: string;
     };
+    component?: CSSProperties;
+    loading?: VsLoadingStyleSet;
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** style, readme, 의존성, documentation, dependencies, vsbuttonstyleset, vsbutton, tight-coupling, interface-inheritance, component-wrapping, cross-reference
**Category:** documentation

File: `packages/vlossom/src/components/vs-checkbox/README.md` (lines 244-244)

```
@@ -233,14 +235,14 @@ const confirmBeforeChange = async (from, to, optionValue) => {
 
 ```typescript
 interface VsCheckboxSetStyleSet {
-    gap?: string;
-    flexWrap?: string;
-
+    component?: CSSProperties;
     checkbox?: Omit<VsCheckboxStyleSet, 'wrapper'>;
     wrapper?: VsInputWrapperStyleSet;
 }
 ```
 
+> **참고**: `component`는 체크박스 세트 컨테이너 스타일이며, `checkbox`는 [VsCheckbox](#vscheckbox)의 StyleSet을 사용하고, `wrapper`는 [VsInputWrapper](../vs-input-wrapper/README.md)의 StyleSet을 사용합니다.
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** style, styleset, checkboxstyleset, naming, type-reference, documentation-clarity, explicit-typing, technical-writing
**Category:** documentation

File: `packages/vlossom/src/components/vs-message/README.md` (lines 50-50)

```
@@ -19,26 +19,36 @@ info, success, warning, error 상태를 지원하며, 각 상태에 맞는 아
 </template>
 ```
 
-### 크기 조정
+## Props
+
+| Prop       | Type                                                    | Default  | Required | Description                        |
+| ---------- | ------------------------------------------------------- | -------- | -------- | ---------------------------------- |
+| `state`    | `'idle' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'idle'` | -        | 메시지의 상태 (아이콘과 색상 결정) |
+| `text`     | `string`                                                | `''`     | -        | 표시할 메시지 텍스트               |
+| `styleSet` | `string \| VsMessageStyleSet`                           | -        | -        | 커스텀 스타일 설정 객체            |
+
+## Types
+
+```typescript
+import type { Size } from '@/declaration';
+
+interface VsMessageStyleSet {
+    size?: Size;
+}
+```
+
+### StyleSet 사용 예시
 
 ```html
 <template>
-    <vs-message size="xs" text="XS 메시지" />
-    <vs-message size="sm" text="SM 메시지" />
-    <vs-message text="기본 크기 메시지" />
-    <vs-message size="lg" text="LG 메시지" />
-    <vs-message size="xl" text="XL 메시지" />
+    <!-- 크기 조정 -->
+    <vs-message :style-set="{ size: 'lg' }" text="큰 메시지" />
+
+    <!-- 사전 정의된 StyleSet 사용 -->
+    <vs-message style-set="myStyleSet" text="커스텀 스타일 메시지" />
 </template>
 ```
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** documentation-structure, example-ordering, readme, user-flow, content-organization
**Category:** documentation