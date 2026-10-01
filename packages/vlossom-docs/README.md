# vlossom-docs

The Vlossom documentation site, built with [VitePress](https://vitepress.dev/).

This package is private. It is not published to npm.

## Local Development

```bash
cd packages/vlossom-docs
pnpm install
pnpm dev
```

| Command        | Description                                              |
| -------------- | -------------------------------------------------------- |
| `pnpm dev`     | Start the dev server with hot reload                     |
| `pnpm build`   | Build the static site into `.vitepress/dist`             |
| `pnpm preview` | Serve the built site from `.vitepress/dist`              |
| `pnpm test`    | Run unit tests for the README page and live demo helpers |

## Structure

```txt
packages/vlossom-docs/
├── .vitepress/
│   ├── config.ts            # Site config: source directory, rewrites, locales, theme options
│   ├── readme-pages.ts      # Finds README pages, builds the sidebar, rewrites README links
│   ├── readme-pages.test.ts
│   ├── live-demo.ts         # Turns `live` code fences into demo components
│   ├── live-demo.test.ts
│   ├── demo-scope.ts        # Names that README examples use without declaring them
│   └── theme/
│       ├── index.ts         # Default theme + Vlossom install + dark mode sync
│       ├── vlossom.ts       # Installs Vlossom in the browser
│       └── demo.css         # Demo area styles
├── pages/                   # Pages that belong only to the site
│   ├── index.md             # English home page (/)
│   └── ko/
│       └── index.md         # Korean home page (/ko/)
├── package.json
└── tsconfig.json
```

VitePress generates `.vitepress/cache` and `.vitepress/dist`. Both are ignored by git.

## README Pages

The site renders README files from `packages/vlossom` in place. They are not copied.

| Source directory                           | `README.md` route     | `README.ko.md` route     |
| ------------------------------------------ | --------------------- | ------------------------ |
| `packages/vlossom/src/components/<name>/`  | `/components/<name>`  | `/ko/components/<name>`  |
| `packages/vlossom/src/composables/<name>/` | `/composables/<name>` | `/ko/composables/<name>` |
| `packages/vlossom/src/directives/<name>/`  | `/directives/<name>`  | `/ko/directives/<name>`  |
| `packages/vlossom/src/plugins/<name>/`     | `/plugins/<name>`     | `/ko/plugins/<name>`     |
| `packages/vlossom/src/utils/`              | `/utils`              | `/ko/utils`              |

- The VitePress source directory is `packages/`. Markdown files that are not in this table or in `pages/` are excluded, for example templates and `CHANGELOG.md`.
- Each language has its own sidebar and nav, built from the same list. A new unit directory with README files appears without config changes. The list is read when the config loads, so restart `pnpm dev` after adding or removing README files.
- Relative links between READMEs are rewritten to site routes at build time.
    - A link to another unit opens that unit in the language of the current page. For example, a link to `../vs-input/README.md` in a Korean README opens `/ko/components/vs-input`. Korean site pages under `pages/ko/` follow the same rule.
    - If the link has an anchor that the page in the current language does not have, the link keeps its original target. Headings differ by language, so `#types` may not exist on a Korean page whose heading is `## 타입`.
    - A link to the other language of the same README, such as the language note at the top of each README, opens that language.
    - A link to a repository file that is not a page points to the file on GitHub.
- A relative link to a missing file is left as is, so VitePress reports it as a dead link and `pnpm build` fails.

## Live Demos

Add `live` to an `html` code fence in a README to render the example as a working demo above its code:

````md
```html live
<template>
    <vs-button primary>Primary Button</vs-button>
</template>
```
````

- GitHub uses only the first word of the fence info as the language, so the README looks the same there. vlossom-mcp reads fences by their opening backticks, so its README parsing does not change.
- Each fence becomes its own component, so demos on the same page do not share state.
- A demo uses the `<script setup>` of its own fence first, then the scripts of the other fences on the page. Names that the examples use without declaring them come from [`demo-scope.ts`](.vitepress/demo-scope.ts), keyed by unit name. Names declared in the README always win.
- Vlossom reads `document` and `localStorage` when it loads, so it is installed only in the browser and demos render inside `<ClientOnly>`.
- The site's dark mode switches the Vlossom theme.

## Languages

The site uses VitePress `locales`: English at `/` and Korean at `/ko/`. The language menu in the nav opens the same page in the other language. On Korean pages, theme labels such as the outline title and the previous and next page links are in Korean.

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
