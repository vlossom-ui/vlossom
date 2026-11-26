import { createApp, type Component } from 'vue';
import { createVlossom } from '@/framework';
import { VlossomComponents } from '@/components/component-map';
import '@/styles/index.css';
import '@/styles/index.scss';

const fixtureLoaders = import.meta.glob<Component>('../src/**/__e2e__/*.vue', {
    import: 'default',
});

const fixtures = new Map<string, () => Promise<Component>>();

for (const [path, load] of Object.entries(fixtureLoaders)) {
    const id = path.split('/').pop()?.replace(/\.vue$/, '');
    if (!id) {
        continue;
    }
    if (fixtures.has(id)) {
        throw new Error(`e2e fixture 이름이 중복됩니다: ${id} (${path})`);
    }
    fixtures.set(id, load);
}

const fixtureId = new URLSearchParams(window.location.search).get('fixture');
const loadFixture = fixtureId ? fixtures.get(fixtureId) : undefined;

if (!loadFixture) {
    const available = [...fixtures.keys()].sort().join(', ');
    throw new Error(
        `e2e fixture가 없습니다: ${fixtureId ?? '(없음)'}. __e2e__/*.vue 파일 이름이 fixture 값입니다. 사용 가능: ${available}`,
    );
}

createApp(await loadFixture())
    .use(
        createVlossom({
            components: VlossomComponents,
        }),
    )
    .mount('#app');
