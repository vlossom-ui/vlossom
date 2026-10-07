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
| `pnpm test`    | Run unit tests for the site helpers          |

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
│   ├── vlossom-css.ts       # Keeps vlossom.css from changing the site outside demos
│   ├── vlossom-css.test.ts
│   └── theme/
│       ├── index.ts         # Default theme, Vlossom app hook, dark mode sync
│       ├── vlossom.ts       # Loads Vlossom in the browser when the first demo needs it
│       ├── layers.css       # Puts the vlossom.css base layer below the VitePress base styles
│       ├── layers.test.ts
│       ├── font.css         # Uses the vlossom font (Pretendard) for the site
│       ├── font.test.ts
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
- A live fence needs a root `<template>`. If a live fence has no `<template>` or has a `<script setup>` that does not parse, `pnpm build` fails with the README path and the fence number.
- Each demo gets a script built from these sources:
    - Everything in the `<script setup>` of its own fence.
    - Declarations from the other live fences on the page, such as variables, functions, and types, that its own fence does not declare. Other statements, such as function calls, stay in their own fence.
    - Names that the examples use without declaring them, from [`demo-scope.ts`](.vitepress/demo-scope.ts), keyed by unit name. A name that the README declares always wins.
    - Imports from all live fences on the page and from `demo-scope.ts`, merged by local name. Relative imports, such as `./MyForm.vue`, are removed because those files are not in the repository.
- The Vlossom script loads only when a page with a demo renders, so other pages do not download it. Vlossom reads `document` and `localStorage` when it loads, so demos render inside `<ClientOnly>`.
- If Vlossom fails to load, the demos stay empty until the page is reloaded. The code blocks and the rest of the page still work.
- The site's dark mode switches the Vlossom theme.

### Vlossom Version

Demos use the `vlossom` version from npm that [`package.json`](package.json) pins, not the workspace source. README text comes from the workspace, so a demo of a feature that the pinned version does not have can fail or look different. To update the version:

1. Change the `vlossom` version in `package.json` and run `pnpm install`.
2. Run `pnpm test` and `pnpm build`.
3. Run `pnpm preview` and check the demo pages and a page without demos.

### Styles

Every page loads vlossom.css, because VitePress bundles all CSS of the site into one file. Of the VitePress parts of the site, vlossom.css changes only the font:

- [`vlossom-css.ts`](.vitepress/vlossom-css.ts) removes the vlossom.css rules that style the whole app: the unlayered `html` and `body` rules, and the `::-webkit-` pseudo-element rules without an element, such as the scrollbar rules. It keeps the `@import` of the Pretendard font.
- It also limits the Tailwind utility classes of vlossom.css, such as `.container` and `.outline`, because the VitePress theme uses the same class names. They apply only inside the demo areas and outside the VitePress app root (`#app`), where Vlossom renders dialogs such as the ones from the alert plugin. Vlossom classes (`.vs-*`) and `:root` rules stay global.
- [`layers.css`](.vitepress/theme/layers.css) puts the vlossom.css `base` layer (Tailwind preflight) below the VitePress base styles, so the VitePress base styles stay in effect. The theme entry must load it before the VitePress theme.
- [`font.css`](.vitepress/theme/font.css) sets the VitePress font variable to the font of the vlossom `html` and `body` rules (Pretendard), so the site and the demos use the vlossom font.

`pnpm test` checks these rules on the installed vlossom.css. It fails if an `html`, `body`, or `::-webkit-` rule or an unscoped utility class remains after the transform, or if the Pretendard `@import` is gone. It also fails if vlossom.css declares a layer that `layers.css` does not order, if the theme entry loads `layers.css` after the VitePress theme, or if `font.css` no longer matches the vlossom font.

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
