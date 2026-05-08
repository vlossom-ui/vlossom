---
name: vlossom-mcp
description: Use Vlossom's compact source-of-truth MCP harness to discover, reference, scaffold setup shapes, and validate Vlossom-first Vue UI code.
---

# vlossom-mcp Skill

Use this skill when an agent is building or reviewing Vue UI in a project that uses Vlossom.

## Public Contract

The default public MCP surface is intentionally limited to four tools:

1. `search_vlossom`
2. `get_vlossom_reference`
3. `scaffold_vlossom_code`
4. `validate_vlossom_usage`

Do not rely on the old granular tool surface; it has been removed instead of kept as an opt-in mode.

## Workflow

```txt
Search -> Reference -> Scaffold -> Validate
```

1. Call `search_vlossom` to discover compact registry-backed ids.
2. Call `get_vlossom_reference` before using component props, slots, events, methods, StyleSet keys, tokens, options, or rules.
3. Call `scaffold_vlossom_code` only for a Vlossom-native starting point, not a guaranteed final implementation.
4. Call `validate_vlossom_usage` before finalizing generated or user-written code.

Component, directive, composable, token, source, and release data are fetched from GitHub on demand, so request exact source or version context through facade tools when needed.

Pass the user's installed Vlossom version whenever available. Use `packageJson` or explicit `version` so tools return `versionContext`, annotate `versionSupport`, and report APIs unavailable in that project version.

## Vlossom-First Harness Policy

When this MCP is used, keep UI work Vlossom-first by default.

Use registry-backed Vlossom components for covered UI patterns. Pass `context.vlossomFirst: "off"` only for explicit user exceptions or migration staging.

## Validation Harness

`validate_vlossom_usage` checks Vlossom source-of-truth mismatches. It checks:

- project setup
- component existence
- component availability in the detected Vlossom version
- prop, slot, event, and v-model correctness
- StyleSet shape and GitHub-resolved metadata keys
- token naming inside StyleSet values
- native and third-party UI usage by default when Vlossom coverage exists

Empty code is not valid. Treat `status: "skipped"` as an actionable missing-input result.

## Resources

Use resources for stable references:

```txt
vlossom://components
vlossom://components/{name}
vlossom://tokens/css
vlossom://options/create-vlossom
vlossom://rules/coding
vlossom://rules/style-set
vlossom://rules/vlossom-first
vlossom://changelog
vlossom://decisions
vlossom://mcp/usage-examples
```
