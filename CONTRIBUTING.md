# Contributing to Vlossom

Thank you for your interest in contributing to Vlossom! This guide will help you get started.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Component Structure](#component-structure)
- [Scripts](#scripts)
- [Development Workflow](#development-workflow)
- [Commit Convention](#commit-convention)
- [Pull Requests](#pull-requests)
- [Reporting Issues](#reporting-issues)
- [License](#license)

## Prerequisites

- [Node.js](https://nodejs.org/) v24.12.0 (see `.nvmrc`)
- [pnpm](https://pnpm.io/) v10

## Getting Started

```bash
git clone https://github.com/vlossom-ui/vlossom.git
cd vlossom/packages/vlossom
pnpm install
```

## Project Structure

```
vlossom/
├── packages/vlossom/          # Main library package
│   └── src/
│       ├── components/        # UI components
│       ├── composables/       # Shared composables
│       ├── framework/         # Plugin & overlay system
│       ├── icons/             # Icon definitions
│       ├── plugins/           # Toast, Modal, Confirm plugins
│       ├── props/             # Shared prop definitions
│       ├── stores/            # State management
│       ├── styles/            # Global styles
│       └── utils/             # Utility functions
├── .github/                   # GitHub templates & workflows
└── release-please-config.json # Release automation
```

## Component Structure

Each component follows this directory pattern:

```
vs-[name]/
├── Vs[Name].vue                           # Main component
├── Vs[Name].css                           # Styles
├── types.ts                               # TypeScript types
├── README.md                              # Documentation
├── __tests__/
│   └── vs-[name].test.ts                 # Unit tests
└── __stories__/
    ├── vs-[name].stories.ts              # Storybook stories
    └── vs-[name].chromatic.stories.ts    # Visual regression tests
```

For complex components, you may also include:

- `vs-[name]-rules.ts` — validation rules
- `icons.ts` — component-specific icons
- `composables/` — component-specific composables

## Scripts

All scripts run from `packages/vlossom/`:

| Script               | Description               |
| -------------------- | ------------------------- |
| `pnpm dev`           | Start development server  |
| `pnpm storybook`     | Start Storybook           |
| `pnpm test`          | Run all tests             |
| `pnpm test:watch`    | Run tests in watch mode   |
| `pnpm test:coverage` | Run tests with coverage   |
| `pnpm lint`          | Run ESLint & Stylelint    |
| `pnpm format`        | Run Prettier              |
| `pnpm type-check`    | Run TypeScript type check |

## Development Workflow

1. Create a branch from `main`
   ```bash
   git checkout -b feat/vs-component-name
   ```
2. Write tests and implement your changes
3. Verify your work before committing
   ```bash
   pnpm lint
   pnpm type-check
   pnpm test
   ```

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>
```

| Type       | Description              |
| ---------- | ------------------------ |
| `feat`     | New feature              |
| `fix`      | Bug fix                  |
| `refactor` | Code refactoring         |
| `style`    | Code style changes       |
| `test`     | Adding or updating tests |
| `docs`     | Documentation changes    |
| `chore`    | Maintenance tasks        |
| `ci`       | CI/CD changes            |
| `build`    | Build system changes     |
| `perf`     | Performance improvements |
| `revert`   | Revert a previous commit |

**Scope** examples:

| Scope                 | When to use          | Example                                  |
| --------------------- | -------------------- | ---------------------------------------- |
| `VsButton`            | Single component     | `feat(VsButton): add size prop`          |
| `VsButton, VsChip`    | Multiple components  | `feat(VsButton, VsChip): add size prop`  |
| `colors`, `variables` | Feature or topic     | `refactor(colors): update color palette` |
| `Vlossom`, `vlossom`  | Project-wide changes | `chore(Vlossom): improve CSS DX`         |
| `deps`                | Dependency changes   | `revert(deps): rollback dependencies`    |
| `storybook`           | Tooling-specific     | `fix(storybook): fix build error`        |

## Pull Requests

1. Make sure all tests pass and there are no lint errors
2. Fill out the [PR template](.github/pull_request_template.md)
3. Request a review
4. To trigger a Chromatic visual regression build, include `chromatic-build` in a PR review comment

## Reporting Issues

- **Bug reports**: Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md)
- **Feature requests**: Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md)

## License

By contributing to Vlossom, you agree that your contributions will be licensed under the [MIT License](LICENSE).
