# vlossom-mcp Philosophy

`vlossom-mcp` exists to expose accurate Vlossom facts to AI agents and keep Vlossom UI work Vlossom-first by default.

Its value is not a large tool catalog or a broad enforcement layer. Its value is a small source-of-truth harness that helps agents discover what Vlossom already provides, reference exact APIs, scaffold setup shapes, and validate metadata-sensitive Vlossom-first code.

## Mission

Provide a compact agent-facing source-of-truth harness for Vlossom-first Vue UI work.

That means:

- agents discover Vlossom coverage without loading every API detail up front
- exact APIs come from GitHub-backed metadata/source references, registries, and the detected project version
- scaffolding produces setup and shape harnesses, not a magical final implementation
- validation reports source-of-truth mismatches and Vlossom-first violations without taking unrelated product judgment away from the calling agent

## Non-Goals

`vlossom-mcp` is not:

- a documentation chatbot
- a generic Vue generator
- a GitHub issue bot
- a public catalog for every helper module
- a substitute for Vlossom source-of-truth data in GitHub

## Four-Tool Contract

The default public MCP surface is intentionally limited to four tools:

1. `search_vlossom`
2. `get_vlossom_reference`
3. `scaffold_vlossom_code`
4. `validate_vlossom_usage`

The workflow is:

```txt
Search -> Reference -> Scaffold -> Validate
```

Resources support that workflow without increasing the public tool count.

## Vlossom-First Harness Policy

When an agent chooses to use `vlossom-mcp`, the default contract is Vlossom-first.

The MCP reports native controls and third-party UI as violations when the detected Vlossom version has a covered alternative. This is not generic code-style enforcement; it is a Vlossom-specific guard grounded in registry-backed coverage and project-version metadata.

Callers may pass `context.vlossomFirst: "off"` only for explicit user exceptions, migration staging, or cases where Vlossom coverage does not satisfy the product requirement.

For new projects, agents can scaffold Vlossom setup first, validate the returned project setup payload, and then search Vlossom coverage for UI requirements.

## Version Policy

Generated JSON metadata is not bundled because it can become stale for the user's installed Vlossom version. Vlossom API guidance should be resolved from the matching GitHub ref whenever `packageJson` or `version` is available.

Agents should provide `packageJson` or an explicit `version` whenever they search, reference, scaffold, or validate Vlossom APIs. Core responses expose `versionContext`; component-like entries expose `versionSupport`; scaffolding and validation report APIs that are unavailable in the detected project version.

## Validation Policy

`validate_vlossom_usage` is a core public tool and must remain available, but it is not a general code-style reviewer.

It validates:

- project setup
- component existence
- component availability in the detected Vlossom version
- prop, slot, event, and `v-model` correctness
- StyleSet correctness
- token naming inside StyleSet values
- native and third-party UI usage by default when Vlossom coverage exists

Empty code is not valid. Empty input returns `status: "skipped"` with actionable next steps.

## Side-Effect Policy

The core tools should not perform external side effects.

Issue drafting/submission and debug stepper workflows are outside the MCP surface. Normal responses use structured metadata such as `structuredContent`, `next_actions`, and validation issues.
