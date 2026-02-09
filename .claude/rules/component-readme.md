# Component README

MUST follow the rules below when creating or modifying component README files.

## Location

Each component directory: `packages/vlossom/src/components/vs-[name]/README.md`

## Required Sections (in order)

1. **Title**: `# Vs[ComponentName]` + brief description
2. **Available Version**: minimum version (e.g., 2.0.0+)
3. **GitHub Wiki Link**: wiki link
4. **Preview**: component image
5. **Basic Usage**: HTML template code example
6. **Props**: table (Prop | Type | Default | Required | Description)
7. **Types**: `[ComponentName]StyleSet` interface definition
8. **Events**: table (Event | Payload | Description)
9. **Slots**: table (Slot | Description)
10. **Methods**: table (Method | Parameters | Description)

## Rules

- Component names use `Vs` prefix (e.g., VsButton, VsInput)
- ALL 10 sections must be included
- Keep table headers even if the section has no content
- README content must be written in English
