# Optional: Scope this rule to specific files

## Rules

- • Use 'active' or 'enabled' prefix instead of 'checked' for switch states
- • 'checked' implies validation/verification rather than toggle state

- • Place state/modifier suffixes after base names for pattern consistency
- • Align naming with existing pattern: progressActive follows same structure

- • State adjectives like 'active', 'hover' should be suffixed, not prefixed
- • Consistent naming: use 'stepActive' instead of 'activeStep'
- • Apply pattern across all components for uniformity

- • Maintain consistent naming convention for active state modifiers
- • Use either prefix pattern (activeLabel, activeProgress) or suffix pattern
- • Inconsistent naming confuses users about property relationships

- • Consider 'content' instead of 'expand' as property name
- • Name should reflect what it contains rather than its behavior

## Reviewed Code

File: `packages/vlossom/src/components/vs-switch/types.ts` (lines 22-22)

```
@@ -13,13 +13,13 @@ export type { VsSwitch };
 
 export interface VsSwitchRef extends ComponentPublicInstance<typeof VsSwitch>, FocusableRef, FormChildRef {}
 
-export interface VsSwitchStyleSet extends SizeStyleSet {
-    backgroundColor?: string;
-    border?: string;
-    borderRadius?: string;
-    fontColor?: string;
-    handleColor?: string;
-    handleSize?: string;
-
+export interface VsSwitchStyleSet {
+    variables?: {
+        handleColor?: string;
+        handleSize?: string;
+    };
+    switchButton?: CSSProperties;
+    checkedSwitchButton?: CSSProperties;
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** checkedswitchbutton, semantic-naming, toggle-state, active-state, property-naming
**Category:** naming

File: `packages/vlossom/src/components/vs-steps/types.ts` (lines 23-23)

```
@@ -12,11 +11,14 @@ export type { VsSteps };
 
 export interface VsStepsRef extends ComponentPublicInstance<typeof VsSteps> {}
 
-interface StepStyleSet extends BoxStyleSet {
-    size?: string;
-}
-
-export interface VsStepsStyleSet extends SizeStyleSet {
-    step?: StepStyleSet;
-    activeStep?: StepStyleSet;
+export interface VsStepsStyleSet {
+    variables?: {
+        stepSize?: string;
+    };
+    step?: CSSProperties;
+    activeStep?: CSSProperties;
+    label?: CSSProperties;
+    activeLabel?: CSSProperties;
+    progress?: CSSProperties;
+    progressActive?: CSSProperties;
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** label, activelabel, labelactive, accessibility, naming-consistency, modifier-suffix, style-properties
**Category:** naming

File: `packages/vlossom/src/components/vs-steps/types.ts` (lines 23-23)

```
@@ -12,11 +11,14 @@ export type { VsSteps };
 
 export interface VsStepsRef extends ComponentPublicInstance<typeof VsSteps> {}
 
-interface StepStyleSet extends BoxStyleSet {
-    size?: string;
-}
-
-export interface VsStepsStyleSet extends SizeStyleSet {
-    step?: StepStyleSet;
-    activeStep?: StepStyleSet;
+export interface VsStepsStyleSet {
+    variables?: {
+        stepSize?: string;
+    };
+    step?: CSSProperties;
+    activeStep?: CSSProperties;
+    label?: CSSProperties;
+    activeLabel?: CSSProperties;
+    progress?: CSSProperties;
+    progressActive?: CSSProperties;
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** naming-convention, state-modifier, adjective-suffix, consistency
**Category:** naming

File: `packages/vlossom/src/components/vs-steps/types.ts` (lines 23-23)

```
@@ -12,11 +11,14 @@ export type { VsSteps };
 
 export interface VsStepsRef extends ComponentPublicInstance<typeof VsSteps> {}
 
-interface StepStyleSet extends BoxStyleSet {
-    size?: string;
-}
-
-export interface VsStepsStyleSet extends SizeStyleSet {
-    step?: StepStyleSet;
-    activeStep?: StepStyleSet;
+export interface VsStepsStyleSet {
+    variables?: {
+        stepSize?: string;
+    };
+    step?: CSSProperties;
+    activeStep?: CSSProperties;
+    label?: CSSProperties;
+    activeLabel?: CSSProperties;
+    progress?: CSSProperties;
+    progressActive?: CSSProperties;
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** naming-consistency, active-state, property-naming, api-design
**Category:** naming

File: `packages/vlossom/src/components/vs-accordion/README.md` (lines 103-103)

```
@@ -92,31 +92,46 @@ const isOpen = ref(false);
 
 ```typescript
 interface VsAccordionStyleSet {
-    // 아코디언 전용 속성들
-    width?: string; // 아코디언 전체 너비
-    arrowColor?: string; // 화살표 색상
-
-    border?: string; // 테두리 스타일
-    borderRadius?: string; // 모서리 둥글기
-    opacity?: string | number; // 투명도
-
-    // 제목 영역 스타일
-    title?: {
-        backgroundColor?: string; // 제목 영역 배경색
-        fontColor?: string; // 제목 텍스트 색상
-        height?: string; // 제목 영역 높이
-        padding?: string; // 제목 영역 내부 여백
-    };
-
-    // 확장 영역 스타일
-    expand?: {
-        backgroundColor?: string; // 확장 영역 배경색
-        padding?: string; // 확장 영역 내부 여백
-        fontColor?: string; // 확장 영역 텍스트 색상
+    variables?: {
+        arrowColor?: string;
+        arrowSize?: string;
+        arrowSpacing?: string;
+        border?: string;
     };
+    component?: CSSProperties;
+    title?: CSSProperties;
+    expand?: VsExpandableStyleSet;
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** property-naming, semantic-clarity, api-design, accordion-component
**Category:** naming