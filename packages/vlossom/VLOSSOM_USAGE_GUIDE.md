# Vlossom Usage Guide

Vlossom supports full tree shaking. Import only the components you need to achieve the optimal bundle size!

## Usage

### 0. Basic Usage (Register All Components)

Import `VlossomComponents` to register all components at once.

```typescript
import { createApp } from 'vue';
import { createVlossom, VlossomComponents } from 'vlossom';
import App from './App.vue';

const app = createApp(App);
app.use(
    createVlossom({
        components: VlossomComponents, // Register all components
        theme: 'dark',
        colorScheme: { default: 'blue' },
    }),
);
app.mount('#app');
```

> **Pros**: Use all Vlossom components with a simple import
>
> **Required**: You must specify either VlossomComponents or individual components.
>
> **Note**: If you don't import VlossomComponents, unused components are completely excluded from the bundle!

### 1. Optimized Usage (Tree Shaking)

Import only the components you need for full tree shaking.

```typescript
import { createApp } from 'vue';
import { createVlossom, VsAvatar, VsButton } from 'vlossom';
import App from './App.vue';

const app = createApp(App);
app.use(
    createVlossom({
        components: { VsAvatar, VsButton }, // Required! Only the components you need
        theme: 'dark',
        colorScheme: { VsButton: 'blue' },
    }),
);
app.mount('#app');
```

### 2. Individual Registration (Minimal Bundle)

Use pure components without Vlossom features.

```typescript
import { createApp } from 'vue';
import { VsAvatar, VsButton } from 'vlossom';
// VlossomComponents is not imported → all other components are excluded!
import App from './App.vue';

const app = createApp(App);

// Register individually using Vue's built-in API
app.component('VsAvatar', VsAvatar);
app.component('VsButton', VsButton);

app.mount('#app');
```

## Comparison

|                        | Basic Usage | Optimized Usage | Individual Registration |
| ---------------------- | :---------: | :-------------: | :---------------------: |
| **Ease of Use**        |    Best     |      Good       |        Moderate         |
| **Tree Shaking**       |   Partial   |      Full       |          Full           |
| **Bundle Size**        |   Largest   |    Smallest     |        Smallest         |
| **Vlossom Features**   |     Yes     |       Yes       |           No            |
| **Component Register** |    Auto     |      Auto       |         Manual          |

## When to Use?

- **Most cases** → Basic Usage (all components available, rapid development)
- **Performance-critical production** → Optimized Usage (full tree shaking)
- **Extreme optimization needed** → Individual Registration (pure components without Vlossom features)

**Highlights:**

- Full tree shaking support
- Optimal bundle size
- Simple API

**Optimization Process:**

1. **User selects**: Import only the components you need
2. **Explicit registration**: Specify only the components to use in the components option
3. **Bundler analysis**: Components not imported are completely removed
4. **Result**: Optimal bundle size achieved

## Optimized Structure

```
src/
├── main.ts
├── framework/
│   └── vlossom-plugin.ts     # Component registration
├── components/
│   ├── index.ts              # Named exports for individual components
│   ├── component-map.ts      # Exports all components
│   ├── component-types.ts    # Exports component types only
│   └── vs-button/
│       ├── VsButton.vue      # Component
│       └── types.ts          # Per-component types
```

---
