---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Merge Priority Architecture

## Rules

- • StyleSet merge order: base → user prop → dynamic component props
- • When same property in variables & component: component wins (spread order)
- • Returns merged componentStyleSet and CSS variables (styleSetVariables)

## Examples

### ✅ Correct

```
typescript
function useStyleSet<T>(
    component: VsComponent | string,
    styleSet: Ref<string | T | undefined>,
    baseStyleSet: Ref<Partial<T>> = ref({}),
    additionalStyleSet: Ref<Partial<T>> = ref({})
), baseStyleSet < styleSet (prop) < additionalStyleSet, - **baseStyleSet**: 하위 컴포넌트 기본값
- **styleSet**: 사용자가 prop으로 전달
- **additionalStyleSet**: 컴포넌트 props에서 오는 동적 값 (height, position 등)

### 반환값
```

Shows useStyleSet signature with 3-tier merge priority system

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @Baejw0111
**Keywords:** merge-priority, style-composition, css-variables, prop-override, vue-composable
**Category:** architecture
