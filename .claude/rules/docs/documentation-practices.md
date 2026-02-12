# Optional: Scope this rule to specific files

## Rules

- • Remove redundant inline comments that merely describe obvious property names
- • Comments should provide value beyond what the code itself reveals

- • Avoid duplicating interface definitions when extending or referencing
- • Use links to source documentation instead of repeating content

## Reviewed Code

File: `packages/vlossom/src/components/vs-drawer/README.md` (lines 154-154)

```
@@ -144,26 +144,57 @@ const drawerOpen = ref(false);
 
 ```typescript
 interface VsDrawerStyleSet {
-    backgroundColor?: string;
-    border?: string;
-    borderRadius?: string;
-    padding?: string;
-    opacity?: string | number;
-
-    position?: 'absolute' | 'fixed';
-    size?: string;
-    boxShadow?: string;
-    zIndex?: number;
-
-    dimmed?: {
-        backgroundColor?: string;
-        opacity?: number;
+    variables?: {
+        size?: string; // 드로어 크기 (width 또는 height)
     };
+    component?: CSSProperties; // .vs-drawer (최상위 컨테이너) 스타일
+    dimmed?: VsDimmedStyleSet; // 배경 딤드 스타일
+    header?: CSSProperties; // 헤더 슬롯 영역 스타일
+    content?: CSSProperties; // 드로어 컨텐츠 컨테이너 스타일 (backgroundColor, borderRadius 등)
+    footer?: CSSProperties; // 푸터 슬롯 영역 스타일
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** documentation, code-comments, redundancy, self-documenting, interface-definition
**Category:** documentation

File: `packages/vlossom/src/components/vs-toggle/README.md` (lines 103-103)

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
+> **Note**: VsButton의 모든 스타일링 props를 지원합니다. 자세한 내용은 [VsButton README](../vs-button/README.md)를 참조하세요.
+
+```typescript
+interface VsButtonStyleSet {
+    variables?: {
+        padding?: string;
     };
+    component?: CSSProperties;
+    loading?: VsLoadingStyleSet;
 }
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** documentation, duplication, cross-reference, interface-extension, dry-principle
**Category:** documentation