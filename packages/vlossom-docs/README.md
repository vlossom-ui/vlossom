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

## Deployment

[`docs.yml`](../../.github/workflows/docs.yml) builds the site and deploys it to GitHub Pages on every push to `main`. You can also run it manually from `main` in the Actions tab. Runs from other branches skip both jobs.

The workflow passes the Pages base path to `vitepress build --base`. Without a custom domain, the site is served at [vlossom-ui.github.io/vlossom](https://vlossom-ui.github.io/vlossom/). With a custom domain, the base becomes `/` without code changes. Changing the domain does not start the workflow, so run it again from `main` after you configure the domain.

The workflow only builds and deploys the site. It does not publish packages or create commits, tags, or releases.

To check a build under the Pages base path locally:

```bash
pnpm build --base /vlossom/
pnpm preview --base /vlossom/
```

In Git Bash on Windows, prefix both commands with `MSYS_NO_PATHCONV=1`. Otherwise Git Bash rewrites `/vlossom/` to a Windows path.

## Requirements

- Node.js (version in the repository [`.nvmrc`](../../.nvmrc))
- pnpm 10
