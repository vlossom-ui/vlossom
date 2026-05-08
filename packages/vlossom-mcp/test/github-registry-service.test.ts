import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveVersionContext } from '../dist/internal/version/version-service';
import { resolveGitHubVersionContext } from '../dist/services/github-registry-service';
import { getAllComponentsMeta, getComponentMeta } from '../dist/services/meta-registry';
import { loadComposables, loadCssTokens, loadDirectives } from '../dist/internal/reference/reference-data';

const fixtureVersion = '9.9.9-fixture';
const fixtureRef = `vlossom-v${fixtureVersion}`;

function jsonResponse(data: unknown) {
    return {
        ok: true,
        json: async () => data,
        text: async () => JSON.stringify(data),
    };
}

function textResponse(text: string) {
    return {
        ok: true,
        json: async () => JSON.parse(text),
        text: async () => text,
    };
}

function notFoundResponse() {
    return {
        ok: false,
        status: 404,
        json: async () => ({}),
        text: async () => '',
    };
}

test('GitHub registry parses component, directive, composable, and token fixtures', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async (url: string | URL) => {
        const href = String(url);
        if (href.includes(`/contents/packages/vlossom/src/components?ref=${fixtureRef}`)) {
            return jsonResponse([
                { name: 'vs-fixture', path: 'packages/vlossom/src/components/vs-fixture', type: 'dir' },
            ]);
        }
        if (href.includes(`/contents/packages/vlossom/src/directives?ref=${fixtureRef}`)) {
            return jsonResponse([
                { name: 'vs-tooltip', path: 'packages/vlossom/src/directives/vs-tooltip', type: 'dir' },
            ]);
        }
        if (href.includes(`/contents/packages/vlossom/src/composables?ref=${fixtureRef}`)) {
            return jsonResponse([{ name: 'fixture', path: 'packages/vlossom/src/composables/fixture', type: 'dir' }]);
        }
        if (href.includes(`${fixtureRef}/packages/vlossom/package.json`)) {
            return textResponse(JSON.stringify({ version: fixtureVersion }));
        }
        if (href.includes(`${fixtureRef}/packages/vlossom/src/components/vs-fixture/README.md`)) {
            return textResponse(`# VsFixture

A fixture component.

**Available Version**: 9.9.9+

## Props
| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| \`label\` | \`string\` | - | Yes | Display label |

## Events
| Event | Payload | Description |
| --- | --- | --- |
| \`click\` | \`MouseEvent\` | Fires on click |

## Slots
| Slot | Description |
| --- | --- |
| \`default\` | Default content |

## Methods
| Method | Parameters | Description |
| --- | --- | --- |
| \`focus\` | - | Focus the control |
`);
        }
        if (href.includes(`${fixtureRef}/packages/vlossom/src/components/vs-fixture/types.ts`)) {
            return textResponse(`export interface VsFixtureStyleSet {
  variables?: {
    color?: string;
  };
  component?: CSSProperties;
  icon?: VsIconStyleSet;
}`);
        }
        if (href.includes(`${fixtureRef}/packages/vlossom/src/directives/vs-tooltip/README.md`)) {
            return textResponse(`# v-tooltip

Tooltip directive.

**Available Version**: 9.9.9+

## Basic Usage
\`\`\`vue
<div v-tooltip="'Hello'" />
\`\`\`

## Options
| Binding | Type | Default | Description |
| --- | --- | --- | --- |
| \`value\` | \`string\` | - | Tooltip text |
`);
        }
        if (href.includes(`${fixtureRef}/packages/vlossom/src/composables/fixture/README.md`)) {
            return textResponse(`# useFixture

Fixture composable.

**Available Version**: 9.9.9+

## Args
| Arg | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| \`initial\` | \`string\` | \`''\` | Yes | Initial value |

## Returns
Ref<string>

## Basic Usage
\`\`\`ts
const value = useFixture('demo')
\`\`\`
`);
        }
        if (href.includes(`${fixtureRef}/packages/vlossom/src/styles/variables.css`)) {
            return textResponse(`:root {
  --vs-fixture-color: red;
}
@variant dark {
  :root {
    --vs-fixture-color: blue;
  }
}`);
        }
        if (
            href.includes(`${fixtureRef}/packages/vlossom/src/styles/palette.css`) ||
            href.includes(`${fixtureRef}/packages/vlossom/src/styles/color-scheme-variables.css`)
        ) {
            return textResponse('');
        }
        return notFoundResponse();
    }) as typeof fetch;

    try {
        const versionContext = await resolveGitHubVersionContext(resolveVersionContext({ version: fixtureVersion }));
        const components = await getAllComponentsMeta(versionContext);
        const directives = await loadDirectives(versionContext);
        const composables = await loadComposables(versionContext);
        const tokens = await loadCssTokens(versionContext);

        assert.equal(versionContext.resolvedRef, fixtureRef);
        assert.equal(components[0]?.name, 'VsFixture');
        assert.equal(components[0]?.props[0]?.required, true);
        assert.equal(components[0]?.styleSet.variables.color, 'string');
        assert.deepEqual(components[0]?.styleSet.childRefs, ['VsIconStyleSet']);
        assert.equal(directives[0]?.name, 'v-tooltip');
        assert.equal(directives[0]?.options[0]?.binding, 'value');
        assert.equal(composables[0]?.name, 'useFixture');
        assert.equal(composables[0]?.args[0]?.required, true);
        assert.equal(tokens.find((token) => token.name === '--vs-fixture-color')?.darkValue, 'blue');
    } finally {
        globalThis.fetch = originalFetch;
    }
});

test('getComponentMeta fetches only the requested component files', async () => {
    const version = '9.9.8-direct';
    const ref = `vlossom-v${version}`;
    const calls: string[] = [];
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async (url: string | URL) => {
        const href = String(url);
        calls.push(href);
        if (href.includes(`${ref}/packages/vlossom/package.json`)) {
            return textResponse(JSON.stringify({ version }));
        }
        if (href.includes(`${ref}/packages/vlossom/src/components/vs-direct-only/README.md`)) {
            return textResponse(`# VsDirectOnly

Direct lookup component.

**Available Version**: 9.9.8+
`);
        }
        if (href.includes(`${ref}/packages/vlossom/src/components/vs-direct-only/types.ts`)) {
            return textResponse(`export interface VsDirectOnlyStyleSet {
  variables?: {
    tone?: string;
  };
}`);
        }
        return notFoundResponse();
    }) as typeof fetch;

    try {
        const versionContext = await resolveGitHubVersionContext(resolveVersionContext({ version }));
        const component = await getComponentMeta('VsDirectOnly', versionContext);

        assert.equal(component?.name, 'VsDirectOnly');
        assert.equal(component?.styleSet.variables.tone, 'string');
        assert.equal(
            calls.some((href) => href.includes('/contents/packages/vlossom/src/components?')),
            false,
        );
        assert.equal(
            calls.filter((href) => href.includes(`${ref}/packages/vlossom/src/components/vs-direct-only/README.md`))
                .length,
            1,
        );
        assert.equal(
            calls.filter((href) => href.includes(`${ref}/packages/vlossom/src/components/vs-direct-only/types.ts`))
                .length,
            1,
        );
    } finally {
        globalThis.fetch = originalFetch;
    }
});

test('component lookup shares cold in-flight fetches', async () => {
    const version = '9.9.7-inflight';
    const ref = `vlossom-v${version}`;
    const calls: string[] = [];
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async (url: string | URL) => {
        const href = String(url);
        calls.push(href);
        if (href.includes(`${ref}/packages/vlossom/package.json`)) {
            return textResponse(JSON.stringify({ version }));
        }
        if (href.includes(`${ref}/packages/vlossom/src/components/vs-cached/README.md`)) {
            return textResponse(`# VsCached

Cached component.

**Available Version**: 9.9.7+
`);
        }
        if (href.includes(`${ref}/packages/vlossom/src/components/vs-cached/types.ts`)) {
            return textResponse('export interface VsCachedStyleSet {}');
        }
        return notFoundResponse();
    }) as typeof fetch;

    try {
        const [first, second] = await Promise.all([
            getComponentMeta('VsCached', resolveVersionContext({ version })),
            getComponentMeta('vs-cached', resolveVersionContext({ version })),
        ]);

        assert.equal(first?.name, 'VsCached');
        assert.equal(second?.name, 'VsCached');
        assert.equal(calls.filter((href) => href.includes(`${ref}/packages/vlossom/package.json`)).length, 1);
        assert.equal(
            calls.filter((href) => href.includes(`${ref}/packages/vlossom/src/components/vs-cached/README.md`)).length,
            1,
        );
        assert.equal(
            calls.filter((href) => href.includes(`${ref}/packages/vlossom/src/components/vs-cached/types.ts`)).length,
            1,
        );
    } finally {
        globalThis.fetch = originalFetch;
    }
});
