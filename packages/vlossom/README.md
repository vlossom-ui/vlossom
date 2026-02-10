<p align="center">
    <img alt="Vlossom Logo" width="100" src="https://raw.githubusercontent.com/vlossom-ui/vlossom/main/assets/vlossom-logo.png">
</p>

<h1 align="center">Vlossom</h1>

<p align="center">
    A vibrant and versatile <a href="https://vuejs.org/">Vue 3</a> UI library designed to blossom your web applications with elegance and ease.
</p>

<p align="center">
    <a href="https://www.npmjs.com/package/vlossom"><img src="https://img.shields.io/npm/v/vlossom.svg" alt="Version"></a>
    <a href="https://github.com/vlossom-ui/vlossom/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/vlossom.svg" alt="License"></a>
</p>

## Features

- **Various Color Schemes** — Easily style any component with a single prop
- **Layered Style Sets** — Global, named, or per-instance style overrides via CSS variables
- **Overlay System** — Modal, Toast, Confirm as plugins with full app context inheritance
- **Declarative Responsive** — Breakpoint objects instead of media queries
- **Async Validation** — Sync and async rules with built-in defaults per component
- **Dark / Light Theme** — One-line global toggle, auto-persisted

## Requirements

- Vue 3.5+
- TypeScript 5.8+ (recommended)

## Installation

```bash
npm install vlossom
# or
pnpm add vlossom
# or
yarn add vlossom
```

> [!TIP]
> Vlossom supports per-component tree shaking.
> See [VLOSSOM_USAGE_GUIDE.md](/packages/vlossom/VLOSSOM_USAGE_GUIDE.md).

## Setup

```typescript
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import { createVlossom, VlossomComponents } from 'vlossom';
import 'vlossom/styles';

const app = createApp(App);
app.use(
    createVlossom({
        components: VlossomComponents,
    }),
);
app.mount('#app');
```

## Usage

```vue
<template>
  <vs-button primary>Hello Vlossom</vs-button>
</template>

<script setup lang="ts">
   // Components are globally registered via createVlossom — no import needed
</script>
```

## Deep into

### Basic Components

Mix buttons, inputs, and modals with reactive bindings, props, and slots:

```vue
<template>
    <vs-button primary>Click me</vs-button>

    <vs-input v-model="name" label="Name" color-scheme="blue" />

    <vs-modal v-model="isOpen">
        <template #header>Title</template>
        Modal content here
    </vs-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const name = ref('');
const isOpen = ref(false);
</script>
```

### Declarative Responsive Layout

Use breakpoint objects instead of media queries — no CSS required:

```vue
<template>
    <vs-grid column-gap="16px" row-gap="16px">
        <vs-responsive
            v-for="item in items"
            :key="item.id"
            :grid="{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }"
        >
            <div>{{ item.name }}</div>
        </vs-responsive>
    </vs-grid>
</template>
```

### Form Validation (Sync & Async)

Pass sync and async rules in the same array — Vlossom handles both seamlessly:

```vue
<template>
    <vs-input v-model="email" label="Email" :rules="[required, uniqueEmail]" :max="50" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');

const required = (v: string) => (v ? '' : 'Email is required');

const uniqueEmail = async (v: string) => {
    const res = await fetch(`/api/check-email?email=${v}`);
    const { exists } = await res.json();
    return exists ? 'Already in use' : '';
};
</script>
```

### Overlay Plugins (Toast · Confirm · Modal)

Call overlays from any composable — no template wiring needed:

```vue
<script setup lang="ts">
import { useVlossom } from 'vlossom';
import EditForm from './EditForm.vue';

const $vs = useVlossom();

function notify() {
    $vs.toast.success('Saved successfully');
}

async function remove() {
    const ok = await $vs.confirm.open('Delete this item?', {
        okText: 'Delete',
        cancelText: 'Cancel',
        colorScheme: 'red',
    });
    if (ok) {
        $vs.toast.info('Item deleted');
    }
}

function openEditor() {
    $vs.modal.open(EditForm, {
        size: 'md',
        callbacks: {
            onSave: (data: unknown) => {
                $vs.toast.success('Updated');
                $vs.modal.close();
            },
        },
    });
}
</script>
```

## Components

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

## Styling & Theming

### Color Schemes

Apply any of built-in colors to any component:

```html
<vs-button color-scheme="blue">Blue</vs-button>
<vs-chip color-scheme="emerald">Tag</vs-chip>
```

Available colors: `red` · `orange` · `brown` · `amber` · `yellow` · `lime` · `green` · `emerald` · `teal` · `cyan` · `sky` · `blue` · `indigo` · `violet` · `purple` · `fuchsia` · `pink` · `rose` · `gray`

### Style Sets

Override component styles at global or per-instance level:

```typescript
app.use(
    createVlossom({
        components: VlossomComponents,
        styleSet: {
            mySet: {
                VsButton: { backgroundColor: '#1a1a1a', fontColor: '#fff' },
            },
        },
    }),
);
```

```html
<vs-button style-set="mySet">Styled</vs-button>
```

### Theme

Toggle dark/light theme globally:

```typescript
app.use(
    createVlossom({
        components: VlossomComponents,
        theme: 'dark',
    }),
);
```

Or toggle at runtime with `<vs-theme-button />`.

## Links

- [GitHub Repository](https://github.com/vlossom-ui/vlossom)
- [Changelog](CHANGELOG.md)
- [Contributing Guide](../../CONTRIBUTING.md)

## License

[MIT](../../LICENSE)
