<p>
    <img alt="Vlossom Logo" width="100" src="./assets/vlossom-logo.png">
</p>

# Vlossom [![Version](https://img.shields.io/npm/v/vlossom.svg)](https://www.npmjs.com/package/vlossom) [![License](https://img.shields.io/npm/l/vlossom.svg)](https://github.com/pubg/vlossom/blob/main/CONTRIBUTING.md#license)

Vlossom is a vibrant and versatile **[Vue](https://vuejs.org/) UI library** designed to blossom your web applications with elegance and ease.

> [!NOTE]
> You are on the `v2` project. Check out the [v1 project](https://github.com/pubg/vlossom) for Vlossom `v1`. Both versions will be maintained in parallel.

- **18 Color Schemes** — One prop to paint any component
- **Layered Style Sets** — Global, named, or per-instance style overrides via CSS variables
- **Overlay System** — Modal, Toast, Confirm as plugins with full app context inheritance
- **Declarative Responsive** — Breakpoint objects instead of media queries
- **Async Validation** — Sync and async rules with built-in defaults per component
- **Dark / Light Theme** — One-line global toggle, auto-persisted

## Quick Start

```bash
# Install
npm install vlossom
# or
pnpm add vlossom
```

```typescript
// main.ts
import { createApp } from "vue";
import App from "./App.vue";
import { createVlossom } from "vlossom";
import "vlossom/styles";

const app = createApp(App);
app.use(createVlossom());
app.mount("#app");
```

> [!TIP]
> For detailed usage guide including color schemes, style sets, and plugin configuration, see [VLOSSOM_USAGE_GUIDE.md](/packages/vlossom/VLOSSOM_USAGE_GUIDE.md).

```vue
<template>
  <vs-button primary>Hello Vlossom</vs-button>
</template>

<script setup lang="ts">
// Components are globally registered via createVlossom — no import needed
</script>
```

## Component Overview

### Layout

| Component                                                                | Description                                  |
| ------------------------------------------------------------------------ | -------------------------------------------- |
| [vs-container](packages/vlossom/src/components/vs-container/README.md)   | Responsive content container                 |
| [vs-grid](packages/vlossom/src/components/vs-grid/README.md)             | Grid layout system                           |
| [vs-layout](packages/vlossom/src/components/vs-layout/README.md)         | Page layout with header, footer, and content |
| [vs-page](packages/vlossom/src/components/vs-page/README.md)             | Full page wrapper                            |
| [vs-responsive](packages/vlossom/src/components/vs-responsive/README.md) | Responsive breakpoint wrapper                |
| [vs-block](packages/vlossom/src/components/vs-block/README.md)           | Block-level section wrapper                  |
| [vs-header](packages/vlossom/src/components/vs-header/README.md)         | Page header                                  |
| [vs-footer](packages/vlossom/src/components/vs-footer/README.md)         | Page footer                                  |

### Form

| Component                                                                      | Description                     |
| ------------------------------------------------------------------------------ | ------------------------------- |
| [vs-input](packages/vlossom/src/components/vs-input/README.md)                 | Text input field                |
| [vs-textarea](packages/vlossom/src/components/vs-textarea/README.md)           | Multi-line text input           |
| [vs-checkbox](packages/vlossom/src/components/vs-checkbox/README.md)           | Checkbox and checkbox set       |
| [vs-radio](packages/vlossom/src/components/vs-radio/README.md)                 | Radio button and radio set      |
| [vs-select](packages/vlossom/src/components/vs-select/README.md)               | Dropdown select                 |
| [vs-switch](packages/vlossom/src/components/vs-switch/README.md)               | Toggle switch                   |
| [vs-toggle](packages/vlossom/src/components/vs-toggle/README.md)               | Toggle button                   |
| [vs-file-drop](packages/vlossom/src/components/vs-file-drop/README.md)         | Drag and drop file upload       |
| [vs-search-input](packages/vlossom/src/components/vs-search-input/README.md)   | Search input with suggestions   |
| [vs-form](packages/vlossom/src/components/vs-form/README.md)                   | Form wrapper with validation    |
| [vs-input-wrapper](packages/vlossom/src/components/vs-input-wrapper/README.md) | Input label and message wrapper |

### Display

| Component                                                                    | Description                  |
| ---------------------------------------------------------------------------- | ---------------------------- |
| [vs-accordion](packages/vlossom/src/components/vs-accordion/README.md)       | Collapsible content panel    |
| [vs-avatar](packages/vlossom/src/components/vs-avatar/README.md)             | User avatar                  |
| [vs-bar](packages/vlossom/src/components/vs-bar/README.md)                   | Horizontal bar               |
| [vs-chip](packages/vlossom/src/components/vs-chip/README.md)                 | Compact label chip           |
| [vs-divider](packages/vlossom/src/components/vs-divider/README.md)           | Visual divider line          |
| [vs-expandable](packages/vlossom/src/components/vs-expandable/README.md)     | Expandable section           |
| [vs-grouped-list](packages/vlossom/src/components/vs-grouped-list/README.md) | Grouped list of items        |
| [vs-image](packages/vlossom/src/components/vs-image/README.md)               | Image with fallback          |
| [vs-label-value](packages/vlossom/src/components/vs-label-value/README.md)   | Label-value pair display     |
| [vs-skeleton](packages/vlossom/src/components/vs-skeleton/README.md)         | Loading skeleton placeholder |
| [vs-text-wrap](packages/vlossom/src/components/vs-text-wrap/README.md)       | Text with overflow handling  |

### Feedback

| Component                                                            | Description           |
| -------------------------------------------------------------------- | --------------------- |
| [vs-loading](packages/vlossom/src/components/vs-loading/README.md)   | Loading spinner       |
| [vs-message](packages/vlossom/src/components/vs-message/README.md)   | Inline message banner |
| [vs-modal](packages/vlossom/src/components/vs-modal/README.md)       | Modal dialog          |
| [vs-drawer](packages/vlossom/src/components/vs-drawer/README.md)     | Slide-in drawer panel |
| [vs-dimmed](packages/vlossom/src/components/vs-dimmed/README.md)     | Dimmed overlay        |
| [vs-progress](packages/vlossom/src/components/vs-progress/README.md) | Progress bar          |
| [vs-toast](packages/vlossom/src/components/vs-toast/README.md)       | Toast notification    |

### Navigation

| Component                                                                | Description               |
| ------------------------------------------------------------------------ | ------------------------- |
| [vs-tabs](packages/vlossom/src/components/vs-tabs/README.md)             | Tab navigation            |
| [vs-pagination](packages/vlossom/src/components/vs-pagination/README.md) | Page pagination           |
| [vs-steps](packages/vlossom/src/components/vs-steps/README.md)           | Step indicator            |
| [vs-index-view](packages/vlossom/src/components/vs-index-view/README.md) | Index-based view switcher |

### Utility

| Component                                                                        | Description                  |
| -------------------------------------------------------------------------------- | ---------------------------- |
| [vs-floating](packages/vlossom/src/components/vs-floating/README.md)             | Floating positioned element  |
| [vs-focus-trap](packages/vlossom/src/components/vs-focus-trap/README.md)         | Focus trap for accessibility |
| [vs-inner-scroll](packages/vlossom/src/components/vs-inner-scroll/README.md)     | Inner scrollable area        |
| [vs-render](packages/vlossom/src/components/vs-render/README.md)                 | Conditional renderer         |
| [vs-visible-render](packages/vlossom/src/components/vs-visible-render/README.md) | Visibility-based renderer    |
| [vs-theme-button](packages/vlossom/src/components/vs-theme-button/README.md)     | Dark/light theme toggle      |
| [vs-tooltip](packages/vlossom/src/components/vs-tooltip/README.md)               | Tooltip popup                |

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

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, commit conventions, and PR guidelines.

## Releasing

Releases are automated via [release-please](https://github.com/googleapis/release-please). When a `feat`, `fix`, or `chore` commit is pushed to `main`:

1. release-please creates a release PR with version bump and changelog
2. Merging the release PR triggers npm publish automatically

## Credits

- **[Pretendard](https://github.com/orioncactus/pretendard)** - Default font ([SIL Open Font License 1.1](https://github.com/orioncactus/pretendard/blob/main/LICENSE))

## License

[MIT](LICENSE)
