# Optional: Scope this rule to specific files

## Rules

- • Only 'size' property is needed in the variables object
- • Other properties (backgroundColor, border, borderRadius, padding, etc.) unnecessary

- • messageSize property is redundant since message CSSProperties can control sizing
- • Simplify API by removing dedicated size property in favor of direct styling

## Reviewed Code

File: `packages/vlossom/src/components/vs-drawer/types.ts` (lines 21-21)

```
@@ -16,11 +16,17 @@ export interface VsDrawerRef extends ComponentPublicInstance<typeof VsDrawer> {
     closeDrawer: () => void;
 }
 
-export interface VsDrawerStyleSet extends BoxStyleSet {
-    position?: 'absolute' | 'fixed';
-    size?: string;
-    boxShadow?: string;
-    zIndex?: number;
-
+export interface VsDrawerStyleSet {
+    variables?: {
+        backgroundColor?: string;
+        border?: string;
+        borderRadius?: string;
+        padding?: string;
+        opacity?: number;
+        size?: string;
+        boxShadow?: string;
+    };
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** interface-design, minimal-api, property-removal, type-definition
**Category:** api

File: `packages/vlossom/src/components/vs-input-wrapper/README.md` (lines 101-101)

```
@@ -92,18 +92,13 @@ interface StateMessage<T extends string = UIState> {
 
 type UIState = 'idle' | 'info' | 'success' | 'warning' | 'error';
 
+type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
+
 interface VsInputWrapperStyleSet {
-    label?: {
-        marginBottom?: string;
-        fontColor?: string;
-        fontSize?: string;
-        fontWeight?: string;
-    };
-
-    messages?: {
-        marginTop?: string;
-        size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
-    };
+    component?: CSSProperties; // 루트 컴포넌트 스타일
+    label?: CSSProperties; // 라벨 영역 스타일
+    message?: CSSProperties; // 메시지 영역 스타일
+    messageSize?: Size; // 메시지 크기 (기본값: 'sm')
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** api-simplification, redundant-property, css-properties, style-interface
**Category:** api