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
| `pnpm test`    | Run unit tests for the README page helpers   |

## Structure

```txt
packages/vlossom-docs/
├── .vitepress/
│   ├── config.ts            # Site config: source directory, rewrites, sidebar, theme options
│   ├── readme-pages.ts      # Finds README pages, builds the sidebar, rewrites README links
│   └── readme-pages.test.ts
├── pages/                   # Pages that belong only to the site
│   └── index.md             # Home page (/)
├── package.json
└── tsconfig.json
```

VitePress generates `.vitepress/cache` and `.vitepress/dist`. Both are ignored by git.

## README Pages

The site renders README files from `packages/vlossom` in place. They are not copied.

| Source                                              | Route                 |
| --------------------------------------------------- | --------------------- |
| `packages/vlossom/src/components/<name>/README.md`  | `/components/<name>`  |
| `packages/vlossom/src/composables/<name>/README.md` | `/composables/<name>` |
| `packages/vlossom/src/directives/<name>/README.md`  | `/directives/<name>`  |
| `packages/vlossom/src/plugins/<name>/README.md`     | `/plugins/<name>`     |
| `packages/vlossom/src/utils/README.md`              | `/utils`              |

- The VitePress source directory is `packages/`. Markdown files that are not in this table or in `pages/` are excluded, for example templates, `README.ko.md`, and `CHANGELOG.md`.
- The sidebar is built from the same list. A new unit directory with a `README.md` appears without config changes.
- Relative links between READMEs are rewritten to site routes at build time. Links to repository files that are not pages, such as `README.ko.md`, point to the file on GitHub.
- A relative link to a missing file is left as is, so VitePress reports it as a dead link and `pnpm build` fails.

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
