<p align="center">
    <img alt="Vlossom Logo" width="100" src="https://raw.githubusercontent.com/vlossom-ui/vlossom/main/assets/vlossom-logo.png">
</p>

<h1 align="center">Vlossom</h1>

<p align="center">
    Packages and tooling for building with Vlossom.
</p>

<p align="center">
    <a href="https://github.com/vlossom-ui/vlossom/blob/main/LICENSE"><img src="https://img.shields.io/github/license/vlossom-ui/vlossom.svg" alt="License"></a>
</p>

> [!NOTE]
> You are on the `v2` project. Check out the [v1 project](https://github.com/pubg/vlossom) for Vlossom `v1`.
> Both versions will be maintained in parallel.

## Overview

This repository is the top-level home for Vlossom packages. The root README is intentionally kept as a package index and repository overview. Installation, usage, API references, and package-specific development guides live inside each package.

## Package Index

| Package                               | Purpose                                                                                                                                   | Docs                                     | Registry                                         |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------ |
| [`vlossom`](packages/vlossom)         | Vue 3 UI component library with components, composables, directives, overlay plugins, theming, and validation utilities.                  | [README](packages/vlossom/README.md)     | [npm](https://www.npmjs.com/package/vlossom)     |
| [`vlossom-mcp`](packages/vlossom-mcp) | Model Context Protocol server that helps AI agents discover, reference, scaffold, and validate Vlossom usage from source-backed metadata. | [README](packages/vlossom-mcp/README.md) | [npm](https://www.npmjs.com/package/vlossom-mcp) |

## Documentation Model

Each package owns its detailed documentation:

- purpose and public surface
- installation and setup
- usage examples
- local development commands
- package-specific architecture, changelog, or migration notes when relevant

When adding a new package, add its package directory under `packages/`, include a package README, and add a row to the package index above.

## Quick Links

- [Vlossom UI README](packages/vlossom/README.md)
- [Vlossom UI usage guide](packages/vlossom/VLOSSOM_USAGE_GUIDE.md)
- [Vlossom UI components](packages/vlossom/src/components)
- [Vlossom MCP README](packages/vlossom-mcp/README.md)

## Repository Structure

```txt
vlossom/
├── assets/                    # Repository assets
├── evals/                     # Evaluation assets
├── guidelines/                # Project guidelines
├── packages/                  # Package directories
│   ├── vlossom/               # Vue 3 UI component library
│   └── vlossom-mcp/           # MCP server for Vlossom-aware agents
├── .github/                   # GitHub templates and workflows
├── release-please-config.json # Release automation
└── release-please-manifest.json
```

## Development

Package commands are run from each package directory. Start with the target package README before installing dependencies or running local scripts.

Current package managers:

| Package       | Package manager |
| ------------- | --------------- |
| `vlossom`     | pnpm            |
| `vlossom-mcp` | pnpm            |

## Releasing

Releases are automated with [release-please](https://github.com/googleapis/release-please). Published packages should be configured as separate release targets in [release-please-config.json](release-please-config.json).

Current release targets:

- `packages/vlossom` publishes [`vlossom`](https://www.npmjs.com/package/vlossom)
- `packages/vlossom-mcp` publishes [`vlossom-mcp`](https://www.npmjs.com/package/vlossom-mcp)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, commit conventions, and PR guidelines.

## License

[MIT](LICENSE)
