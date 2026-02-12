---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Type Reuse Architecture

## Rules

- • Extend SizeStyleSet and BoxStyleSet to avoid duplicating common properties
- • Use Omit utility to exclude unnecessary inherited properties
- • Keeps only component-specific properties in custom interface

## Examples

### ❌ Incorrect

```
export interface VsSwitchStyleSet {
    variables?: {
        width?: string;
        height?: string;
        backgroundColor?: string;
        border?: string;
        borderRadius?: string;
        fontColor?: string;
        handleColor?: string;
        handleSize?: string;
    };
```

Original approach duplicates common style properties

### ✅ Correct

```
interface VsSwitchVariables extends SizeStyleSet, Omit<BoxStyleSet, 'padding' | 'opacity'> {
    fontColor?: string;
    handleColor?: string;
    handleSize?: string;
}
```

Improved approach reuses existing StyleSets with inheritance

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @Baejw0111
**Keywords:** type-reuse, interface-composition, typescript-utility, code-duplication, styleset
**Category:** architecture
