<p align="center">
    <img alt="Vlossom Logo" width="100" src="./assets/vlossom-logo.png">
</p>

<h1 align="center">Vlossom</h1/>

Vlossom is a vibrant and versatile [Vue](https://vuejs.org/) UI library designed to blossom your web applications with elegance and ease.

<p align="center">
    <a href="https://vuejs.org/">
        <img src="https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D" alt="vue3">
    </a>
    <br/>
    <a href="https://www.npmjs.com/package/vlossom">
        <img src="https://img.shields.io/npm/v/vlossom.svg" alt="Version">
    </a>
    <a href="https://github.com/pubg/vlossom/blob/main/CONTRIBUTING.md#license">
        <img src="https://img.shields.io/npm/l/vlossom.svg" alt="License">
    </a>
</p>

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Project Setup

```sh
pnpm install
```

## Configuration Files

This project uses separate Vite configuration files for different build targets:

- `vite.config.common.ts` - Shared configuration for both builds
- `vite.config.ts` - Library build configuration
- `vite.config.sandbox.ts` - Sandbox app build configuration

### Sandbox for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Build Sandbox as Standalone App

```sh
pnpm build:sandbox
```

### Storybook

```sh
pnpm storybook
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test

// test with watch optino
pnpm test:watch

// build test coverage file
pnpm test:coverage

// write test snapshot
pnpm test:snapshot
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

### Apply Prettier

```sh
pnpm format
```
