# vlossom-docs

This package contains the Vlossom documentation site. The site uses [VitePress](https://vitepress.dev/).

The site shows the README files of `packages/vlossom` as pages. Component pages also show live demos of the README examples.

This package is private. It is not on npm.

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
| `pnpm test`    | Run the unit tests                           |

## Structure

```txt
packages/vlossom-docs/
├── .vitepress/
│   ├── config.ts            # Site settings: source directory, routes, languages
│   ├── readme-pages.ts      # Finds README pages, makes the sidebar, changes README links
│   ├── readme-pages.test.ts
│   ├── live-demo.ts         # Makes demo components from `live` code blocks
│   ├── live-demo.test.ts
│   ├── readme-demos.test.ts # Compiles all component demos
│   ├── demo-scope.ts        # Names and images for README examples
│   ├── vlossom-css.ts       # Changes vlossom.css for the site
│   ├── vlossom-css.test.ts
│   └── theme/
│       ├── index.ts         # Theme entry: Vlossom app, dark mode, modal cleanup
│       ├── vlossom.ts       # Loads Vlossom when the first demo needs it
│       ├── layers.css       # Puts the vlossom.css base layer below the VitePress styles
│       ├── layers.test.ts
│       ├── vars.css         # Sets the VitePress background to the vlossom background
│       └── demo.css         # Demo area styles
├── pages/                   # Pages that only the site has
│   ├── index.md             # English home page (/)
│   └── ko/
│       └── index.md         # Korean home page (/ko/)
├── package.json
└── tsconfig.json
```

VitePress makes `.vitepress/cache` and `.vitepress/dist`. Git ignores both directories.

## Pages

The site reads the README files from `packages/vlossom`. It does not copy them.

| Source directory                           | `README.md` route     | `README.ko.md` route     |
| ------------------------------------------ | --------------------- | ------------------------ |
| `packages/vlossom/src/components/<name>/`  | `/components/<name>`  | `/ko/components/<name>`  |
| `packages/vlossom/src/composables/<name>/` | `/composables/<name>` | `/ko/composables/<name>` |
| `packages/vlossom/src/directives/<name>/`  | `/directives/<name>`  | `/ko/directives/<name>`  |
| `packages/vlossom/src/plugins/<name>/`     | `/plugins/<name>`     | `/ko/plugins/<name>`     |
| `packages/vlossom/src/utils/`              | `/utils`              | `/ko/utils`              |

- A new directory with README files becomes a page. You do not change the settings. Restart `pnpm dev` after you add or remove README files.
- The language menu opens the same page in the other language.
- The site changes the relative links between README files to site links. A link to a missing file causes an error in `pnpm build`.

## Live Demos

Add `live` to an `html` code block in a component README. The site then shows a live demo above the code. GitHub shows the code block as a normal `html` code block.

````md
```html live
<template>
    <vs-button primary>Primary Button</vs-button>
</template>
```
````

Obey these rules when you write a live example:

- Put a root `<template>` in the example.
- Make sure that the example works as it is. Declare its state and functions in `<script setup>`, or in another live example on the same page.
- Add the controls that open and close the component, for example for a modal or a drawer.
- Mark the same examples in `README.md` and `README.ko.md`.
- Do not mark an example that cannot show anything alone, for example a code fragment.

The [component README template](../vlossom/src/components/COMPONENT_README_TEMPLATE.md) shows the same rules. Composable, directive, plugin, and util pages show only code blocks.

Some examples use names that they do not declare. [`demo-scope.ts`](.vitepress/demo-scope.ts) gives these names to the demos. It also replaces some image URLs that do not exist with a placeholder image.

`pnpm test` compiles all component demos. The test fails if a demo uses a name that nothing declares. It also fails if a demo uses a component that Vlossom does not register. It also fails if `README.md` and `README.ko.md` mark different examples.

### Vlossom Version

The demos use the `vlossom` version that [`package.json`](package.json) pins. They do not use the workspace source. A demo can fail if the README shows a feature that the pinned version does not have.

To update the version:

1. Change the `vlossom` version in `package.json`.
2. Run `pnpm install`.
3. Run `pnpm test`.
4. Run `pnpm build`.
5. Run `pnpm preview`.
6. Examine the demo pages and a page without demos.

## Styles

The site uses some page styles of vlossom.css: the background color, the text color, the font, the font size, and the scrollbar. The VitePress layout does not change. The comments in [`vlossom-css.ts`](.vitepress/vlossom-css.ts) and in the files in `theme/` explain the rules.

## Deployment

[`docs.yml`](../../.github/workflows/docs.yml) builds the site and deploys it to GitHub Pages. It runs on each push to `main`. You can also start it manually on `main`.

The workflow gives the Pages base path to `vitepress build --base`. Without a custom domain, the site is at [vlossom-ui.github.io/vlossom](https://vlossom-ui.github.io/vlossom/). With a custom domain, the base path is `/`. The workflow does not publish packages or make releases.

To examine a build with the Pages base path:

```bash
pnpm build --base /vlossom/
pnpm preview --base /vlossom/
```

## Requirements

- Node.js (the version in the repository [`.nvmrc`](../../.nvmrc))
- pnpm 10
