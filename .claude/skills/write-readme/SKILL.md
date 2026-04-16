---
name: write-readme
description: >
  Invoked manually via /write-readme. Generates README.md (English) and README.ko.md (Korean)
  from Vlossom source code. Supports all document types: components (vs-*), plugins, directives,
  composables (use*), and utility functions.
  Do NOT trigger automatically — only run when explicitly called with /write-readme <target>.
disable-model-invocation: true
---

# write-readme

Reads source code and produces paired README.md (English) + README.ko.md (Korean) files.
After writing, runs a self-verification checklist and returns either `✅ OK` or `❌ FAIL`.

> **Quality reference file**: This skill uses `packages/vlossom/src/.claude/README_CHECK_LIST.md`
> as its source of truth for all quality checks. Read that file in Step 0 to get the latest criteria.

## Step 0: Read the checklist file

Before doing anything else, read the following file:

```
packages/vlossom/src/.claude/README_CHECK_LIST.md
```

The `rules`, `common check list`, and per-type check lists defined there govern the Step 8 verification.
If the file's content differs from anything written in this SKILL.md, **the file takes precedence**.

## Step 1: Determine document type

Identify the **document type** from the input (component name, path, or filename).

| Type        | Detection rule                                        | Template file                                                                   |
| ----------- | ----------------------------------------------------- | ------------------------------------------------------------------------------- |
| component   | Under `components/vs-*` or name starts with `Vs`     | `packages/vlossom/src/components/COMPONENT_README_TEMPLATE.md`                  |
| composable  | Under `composables/` or name starts with `use`        | `packages/vlossom/src/composables/COMPOSABLE_README_TEMPLATE.md`                |
| plugin      | Under `plugins/`                                      | `packages/vlossom/src/plugins/PLUGIN_REAMDE_TEMPLATE.md`                        |
| directive   | Under `directives/` or name starts with `v-`          | `packages/vlossom/src/directives/DIRECTIVE_README_TEMPLATE.md`                  |
| util        | Under `utils/`                                        | `packages/vlossom/src/utils/UTIL_REAMDE_TEMPLATE.md`                            |

Once the type is determined, read the corresponding template file to confirm the expected section order.

## Step 2: Collect source files

Read the following files for the target. Skip any that don't exist.

### Component (`vs-[name]/`)

```
[ComponentName].vue     — props, emits, expose, template structure, slots
types.ts                — StyleSet interface, Ref interface, other exported types
[ComponentName].css     — CSS custom property declarations
__stories__/            — usage examples (if present)
```

Key information to extract:
- **Props**: name, type, default, required — from the `props` object in `defineComponent`
- **Events**: the `emits` array or object
- **Slots**: `<slot>` tags and their `name` attributes in the template
- **Expose**: methods/refs passed to `expose()`, or methods declared in `Vs[Name]Ref` in `types.ts`
- **StyleSet**: the full `Vs[Name]StyleSet` interface from `types.ts`
- **Ref interface**: methods declared in `Vs[Name]Ref`

### Composable (`use[Name].ts`)

```
use[Name].ts    — function signature, arguments, return values, internal hooks
types.ts        — related types (if present)
```

### Plugin, Directive, Util

Read the main file in the directory (`index.ts` or the file matching the name).

## Step 3: Write README.md (English)

Fill in the template sections in order, based solely on what the source code contains.

### Component section order (per COMPONENT_README_TEMPLATE.md)

```
# Vs[ComponentName]
<one-sentence description>

**Available Version**: 2.0.0+

## Feature
<3–5 bullet points covering the key capabilities>

## Basic Usage
<minimal working HTML example>

### <Additional scenarios — one subsection per notable prop or feature>

## Props
| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |

## Types
```typescript
interface [Name]StyleSet { … }
```
> [!NOTE] — link to nested StyleSet docs if applicable

### StyleSet Example
<example binding :style-set with variables, component, and child StyleSets>

## Events
| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots
| Slot | Description |
| ---- | ----------- |

## Methods
| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Caution
<only include this section if there are genuine usage warnings; omit entirely if not>
```

### Writing rules

- **Props table**: list every prop including `colorScheme` and `styleSet`. The `styleSet` type should read `string | Vs[Name]StyleSet`.
- **Types**: copy the interface verbatim from `types.ts`. For nested StyleSets (e.g. `loading?: VsLoadingStyleSet`), add a `> [!NOTE]` callout linking to that type's docs.
- **StyleSet example**: show meaningful usage covering `variables`, `component`, and any child component StyleSets.
- **Events**: if there are no emits, keep the table header but leave the body empty.
- **Slots**: if there are no slots, keep the table header but leave the body empty.
- **Methods**: if nothing is exposed, keep the table header but leave the body empty. Include methods declared in `Vs[Name]Ref` even if `expose()` is not explicitly called.
- **Caution**: include only when there are real warnings. Omit the section entirely if there are none.
- Write all descriptions in **English**.

## Step 4: Write README.ko.md (Korean)

Mirror the structure and content of README.md, translated into Korean.

- Code blocks (HTML, TypeScript) must be identical to those in README.md.
- Translate section headings and table headers into Korean.
- Write all prose in natural Korean.

## Step 5: Save files

| Type        | README.md path                                              | README.ko.md path    |
| ----------- | ----------------------------------------------------------- | -------------------- |
| component   | `packages/vlossom/src/components/vs-[name]/README.md`       | same directory       |
| composable  | `packages/vlossom/src/composables/[name]/README.md`         | same directory       |
| plugin      | `packages/vlossom/src/plugins/[name]/README.md`             | same directory       |
| directive   | `packages/vlossom/src/directives/[name]/README.md`          | same directory       |
| util        | `packages/vlossom/src/utils/README.md`                      | same directory       |

If a README already exists, read it before overwriting to preserve any existing content (image links, wiki links, etc.).

## Step 6: Add cross-links

At the top of README.md:
```markdown
> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.
```

At the top of README.ko.md:
```markdown
> For English documentation, see [README.md](./README.md).
```

## Step 7: Run the code formatter

After saving both files, run:

```bash
cd packages/vlossom && pnpm format
```

If the command exits with an error (e.g. no matching `.json` files), print the error and continue — `.md` files are not in the format target, so this is expected when only documentation changes were made.

## Step 8: Self-verification checklist

Use the items from `packages/vlossom/src/.claude/README_CHECK_LIST.md` read in Step 0.
Do not copy the checklist into this file — reading it fresh every time ensures the latest criteria are always applied.

Verification procedure:
1. Go through every item in the `common check list`
2. Go through every item in the type-specific check list (e.g. `component check list`)
3. Mark each item ✅ or ❌ and print the results

### Pass criteria

80% or more passing → `✅ OK`
Below 80% → `❌ FAIL` — list the failing items

### Handling a FAIL

When `❌ FAIL` occurs:
1. Identify the root cause of each failing item
2. Fix the documentation to resolve the failures
3. Re-run `pnpm format`
4. Re-run the checklist — repeat until `✅ OK`
5. If the same pattern keeps failing, update this SKILL.md to prevent recurrence

## Usage

```
/write-readme VsButton
/write-readme vs-input
/write-readme useStyleSet
/write-readme packages/vlossom/src/components/vs-accordion
```

Accepts PascalCase component names, kebab-case directory names, or full paths.
