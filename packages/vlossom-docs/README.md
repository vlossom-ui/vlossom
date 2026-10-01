# vlossom-docs

The Vlossom documentation site, built with [VitePress](https://vitepress.dev/).

This package is private. It is not published to npm.

## Local Development

```bash
cd packages/vlossom-docs
pnpm install
pnpm dev
```

| Command        | Description                                  |
| -------------- | -------------------------------------------- |
| `pnpm dev`     | Start the dev server with hot reload         |
| `pnpm build`   | Build the static site into `.vitepress/dist` |
| `pnpm preview` | Serve the built site from `.vitepress/dist`  |

## Structure

```txt
packages/vlossom-docs/
├── .vitepress/
│   └── config.ts   # Site config: title, source directory, theme options
├── pages/          # Markdown source; each file becomes a route
│   └── index.md    # Home page (/)
└── package.json
```

VitePress generates `.vitepress/cache` and `.vitepress/dist`. Both are ignored by git.

## Requirements

- Node.js (version in the repository [`.nvmrc`](../../.nvmrc))
- pnpm 10
