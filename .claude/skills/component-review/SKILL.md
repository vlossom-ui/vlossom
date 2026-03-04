---
name: component-review
description: Evaluate a Vlossom component across props, StyleSet interface, events, slots, accessibility, expose, documentation, and tests
---

# Component Review

Evaluates a Vlossom component holistically and produces a structured report with scores and actionable improvement items.

## When to Use

- Before merging a new component PR
- When auditing existing components for quality
- When onboarding contributors to component standards

## Files to Collect

For the target component, read all of:

- `[Component].vue` — props, emits, expose, template bindings
- `types.ts` — StyleSet interface, Ref interface
- `[Component].css` — CSS variable declarations
- `__tests__/[component].test.ts` — test coverage
- `README.md` — documentation completeness

## Evaluation Criteria

### 1. Props Design

**Clarity**

- [ ] Each prop name clearly expresses its purpose without reading the implementation
- [ ] Boolean props use positive framing (`disabled` not `notEnabled`)

**Redundancy / Conflict**

- [ ] No two props control the same thing
- [ ] When multiple props can conflict (e.g., `open` + `modelValue`), the priority rule is explicit in code and documented

**Initial value logic**

- [ ] When two props both affect initial state, the merge logic is deterministic and intentional
  - Example of bug: `isOpen = ref(open.value || modelValue.value)` — if `open: true, modelValue: false`, `open` wins silently
  - Preferred: define a single source of truth, or explicitly document which wins

**Defaults**

- [ ] Default values match the most common usage pattern
- [ ] No prop has a default that forces users to override it constantly

**Type accuracy**

- [ ] `PropType` matches actual runtime usage

### 2. StyleSet Interface

> Follow the `.claude/rules/` StyleSet philosophy: Variables for Variability, Properties for Predictability.

**variables**

- [ ] Only properties that need CSS variable exposure are in `variables`
- [ ] All `variables` entries correspond 1:1 to `--vs-[component]-*` declarations in CSS
- [ ] Nesting depth is max 2 levels
- [ ] No property appears in `variables` that is already covered by `component?: CSSProperties`

**component / element separation**

- [ ] `component?: CSSProperties` is provided for the root element
- [ ] Named element properties (e.g., `title`, `content`) match actual DOM elements or slots
- [ ] Child component StyleSets are delegated via their own typed property (e.g., `content?: VsExpandableStyleSet`)

**CSS ↔ TypeScript consistency**

- [ ] Every CSS variable declared has a matching TypeScript property in `variables`
- [ ] Every TypeScript `variables` property has a matching CSS variable

### 3. Event Design

- [ ] No two events fire at the same moment with the same payload (duplication)
- [ ] `update:modelValue` is used for v-model support on stateful components
- [ ] Additional events (e.g., `toggle`) have a clear distinct purpose beyond v-model; otherwise consider removing
- [ ] Event payloads give callers all the information they need

### 4. Slot Design

- [ ] Every major visual region that users need to customize has a corresponding slot
- [ ] Slot names are intuitive (`title`, `header`, `footer`, `default`)
- [ ] Each slot has a matching property in the StyleSet (e.g., `title` slot → `styleSet.title`)

### 5. Accessibility

- [ ] Keyboard interactions are implemented (Enter / Space for interactive elements, arrow keys for lists)
- [ ] `tabindex` is managed correctly (`-1` when `disabled`)
- [ ] `aria-expanded` is set on toggle/disclosure elements
- [ ] `aria-disabled` reflects the `disabled` prop
- [ ] Appropriate `role` is applied where native semantics are insufficient (e.g., `role="button"` on non-button elements)

### 6. Expose / Ref Interface

> **Note**: In this project, `expose()` inside `setup()` is currently commented out due to an IDE bug where `expose` causes template refs to stop resolving in the Options API `defineComponent` pattern. This is a known limitation — do not flag commented-out `expose` as a defect. Instead, flag mismatches between `types.ts` Ref interface and what would be exposed once the bug is resolved.

- [ ] Every method declared in `Vs[Name]Ref` in `types.ts` is implemented in `setup()`
- [ ] No method is declared in `Vs[Name]Ref` that has no corresponding implementation
- [ ] When `expose` is re-enabled, there are no surprises (method exists and works)

### 7. Documentation (README.md)

Required sections (in order):

- [ ] `# Vs[ComponentName]` title + brief description
- [ ] `**Available Version**`
- [ ] GitHub Wiki link
- [ ] Preview image
- [ ] Basic Usage (HTML example)
- [ ] Props table (`Prop | Type | Default | Required | Description | Version`)
- [ ] Types (`[ComponentName]StyleSet` interface + other types)
- [ ] Events table (`Event | Payload | Description | Version`)
- [ ] Slots table (`Slot | Description | Version`)
- [ ] Methods table (`Method | Parameters | Description | Version`)

Content quality:

- [ ] Written in English
- [ ] All props in the Props table (including `styleSet`)
- [ ] Behavior of conflicting props is documented (e.g., `open` vs `modelValue` priority)
- [ ] StyleSet example demonstrates meaningful customization

### 8. Tests

- [ ] Happy path for each prop is covered
- [ ] Conflicting prop combinations are tested (e.g., `open: true, modelValue: false`)
- [ ] All emitted events are verified with correct payloads
- [ ] Keyboard interactions are tested
- [ ] `disabled` state prevents interaction
- [ ] Tests use `given / when / then` structure consistently
- [ ] No test only checks DOM structure without verifying behavior

## Scoring

Each criterion passes (✅), has a warning (⚠️), or fails (❌).

| Symbol | Meaning                                        |
| ------ | ---------------------------------------------- |
| ✅     | Meets the standard                             |
| ⚠️     | Works but has a notable issue or inconsistency |
| ❌     | Broken, missing, or misleading                 |

## Report Format

```markdown
# Component Review: [ComponentName]

## Summary

| Area                   | Score        | Notes            |
| ---------------------- | ------------ | ---------------- |
| Props Design           | ✅ / ⚠️ / ❌ | one-line summary |
| StyleSet Interface     | ✅ / ⚠️ / ❌ | one-line summary |
| Event Design           | ✅ / ⚠️ / ❌ | one-line summary |
| Slot Design            | ✅ / ⚠️ / ❌ | one-line summary |
| Accessibility          | ✅ / ⚠️ / ❌ | one-line summary |
| Expose / Ref Interface | ✅ / ⚠️ / ❌ | one-line summary |
| Documentation          | ✅ / ⚠️ / ❌ | one-line summary |
| Tests                  | ✅ / ⚠️ / ❌ | one-line summary |

## Issues (priority order)

### 1. [Issue Title] — ❌ / ⚠️

**File**: `path/to/file.ts:line`

**Problem**:
[What is wrong]

**Why it matters**:
[Impact on users or maintainers]

**Fix**:
[Concrete code suggestion]

---

### 2. ...

## Strengths

- [What is done well]
```

## Usage

```
/component-review VsAccordion
/component-review packages/vlossom/src/components/vs-button
```

The skill reads all relevant files automatically before producing the report.
