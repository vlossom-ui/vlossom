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
> vlossom은 컴퍼넌트 단위의 tree shaking을 지원합니다, see [VLOSSOM_USAGE_GUIDE.md](/packages/vlossom/VLOSSOM_USAGE_GUIDE.md).

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

[vs-container](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-container) · [vs-grid](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-grid) · [vs-layout](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-layout) · [vs-page](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-page) · [vs-responsive](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-responsive) · [vs-block](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-block) · [vs-header](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-header) · [vs-footer](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-footer)

### Form

[vs-input](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-input) · [vs-textarea](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-textarea) · [vs-checkbox](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-checkbox) · [vs-radio](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-radio) · [vs-select](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-select) · [vs-switch](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-switch) · [vs-toggle](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-toggle) · [vs-file-drop](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-file-drop) · [vs-search-input](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-search-input) · [vs-form](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-form) · [vs-input-wrapper](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-input-wrapper)

### Display

[vs-accordion](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-accordion) · [vs-avatar](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-avatar) · [vs-bar](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-bar) · [vs-chip](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-chip) · [vs-divider](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-divider) · [vs-expandable](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-expandable) · [vs-grouped-list](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-grouped-list) · [vs-image](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-image) · [vs-label-value](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-label-value) · [vs-skeleton](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-skeleton) · [vs-text-wrap](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-text-wrap)

### Feedback

[vs-loading](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-loading) · [vs-message](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-message) · [vs-modal](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-modal) · [vs-drawer](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-drawer) · [vs-dimmed](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-dimmed) · [vs-progress](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-progress) · [vs-toast](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-toast)

### Navigation

[vs-tabs](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-tabs) · [vs-pagination](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-pagination) · [vs-steps](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-steps) · [vs-index-view](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-index-view)

### Utility

[vs-floating](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-floating) · [vs-focus-trap](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-focus-trap) · [vs-inner-scroll](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-inner-scroll) · [vs-render](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-render) · [vs-visible-render](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-visible-render) · [vs-theme-button](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-theme-button) · [vs-tooltip](https://github.com/vlossom-ui/vlossom/tree/main/packages/vlossom/src/components/vs-tooltip)

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
- [Storybook](https://main--6537e1aa0900e5e159cef498.chromatic.com/) <!-- Chromatic Storybook URL -->
- [Changelog](https://github.com/vlossom-ui/vlossom/blob/main/packages/vlossom/CHANGELOG.md)
- [Contributing Guide](https://github.com/vlossom-ui/vlossom/blob/main/CONTRIBUTING.md)

## License

[MIT](https://github.com/vlossom-ui/vlossom/blob/main/LICENSE)
