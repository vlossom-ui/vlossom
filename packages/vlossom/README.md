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

- **19 Color Schemes** — One prop to paint any component
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

## Setup

```typescript
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import { createVlossom } from 'vlossom';
import { VlossomComponents } from 'vlossom';
import 'vlossom/styles';

const app = createApp(App);
app.use(
    createVlossom({
        components: VlossomComponents,
    }),
);
app.mount('#app');
```

> [!TIP]
> Vlossom supports per-component tree shaking. See [VLOSSOM_USAGE_GUIDE.md](VLOSSOM_USAGE_GUIDE.md).

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

[vs-container](src/components/vs-container/README.md) · [vs-grid](src/components/vs-grid/README.md) · [vs-layout](src/components/vs-layout/README.md) · [vs-page](src/components/vs-page/README.md) · [vs-responsive](src/components/vs-responsive/README.md) · [vs-block](src/components/vs-block/README.md) · [vs-header](src/components/vs-header/README.md) · [vs-footer](src/components/vs-footer/README.md)

### Form

[vs-input](src/components/vs-input/README.md) · [vs-textarea](src/components/vs-textarea/README.md) · [vs-checkbox](src/components/vs-checkbox/README.md) · [vs-radio](src/components/vs-radio/README.md) · [vs-select](src/components/vs-select/README.md) · [vs-switch](src/components/vs-switch/README.md) · [vs-toggle](src/components/vs-toggle/README.md) · [vs-file-drop](src/components/vs-file-drop/README.md) · [vs-search-input](src/components/vs-search-input/README.md) · [vs-form](src/components/vs-form/README.md) · [vs-input-wrapper](src/components/vs-input-wrapper/README.md)

### Display

[vs-accordion](src/components/vs-accordion/README.md) · [vs-avatar](src/components/vs-avatar/README.md) · [vs-bar](src/components/vs-bar/README.md) · [vs-button](src/components/vs-button/README.md) · [vs-chip](src/components/vs-chip/README.md) · [vs-divider](src/components/vs-divider/README.md) · [vs-expandable](src/components/vs-expandable/README.md) · [vs-grouped-list](src/components/vs-grouped-list/README.md) · [vs-image](src/components/vs-image/README.md) · [vs-label-value](src/components/vs-label-value/README.md) · [vs-skeleton](src/components/vs-skeleton/README.md) · [vs-table](src/components/vs-table/README.md) · [vs-text-wrap](src/components/vs-text-wrap/README.md)

### Feedback

[vs-loading](src/components/vs-loading/README.md) · [vs-message](src/components/vs-message/README.md) · [vs-modal](src/components/vs-modal/README.md) · [vs-drawer](src/components/vs-drawer/README.md) · [vs-dimmed](src/components/vs-dimmed/README.md) · [vs-progress](src/components/vs-progress/README.md) · [vs-toast](src/components/vs-toast/README.md)

### Navigation

[vs-tabs](src/components/vs-tabs/README.md) · [vs-pagination](src/components/vs-pagination/README.md) · [vs-steps](src/components/vs-steps/README.md) · [vs-index-view](src/components/vs-index-view/README.md)

### Utility

[vs-floating](src/components/vs-floating/README.md) · [vs-focus-trap](src/components/vs-focus-trap/README.md) · [vs-inner-scroll](src/components/vs-inner-scroll/README.md) · [vs-render](src/components/vs-render/README.md) · [vs-visible-render](src/components/vs-visible-render/README.md) · [vs-theme-button](src/components/vs-theme-button/README.md) · [vs-tooltip](src/components/vs-tooltip/README.md)

## Styling & Theming

### Color Schemes

Apply any of 19 built-in colors to any component:

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
