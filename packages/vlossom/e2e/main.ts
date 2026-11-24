import { createApp, type Component } from 'vue';
import ModalBackClose from '@/components/vs-modal/__e2e__/modal-back-close.vue';
import { createVlossom } from '@/framework';
import { VlossomComponents } from '@/components/component-map';
import '@/styles/index.css';
import '@/styles/index.scss';

const fixtures: Record<string, Component> = {
    '/e2e/modal-back-close.html': ModalBackClose,
};

const Root = fixtures[window.location.pathname];
if (!Root) {
    throw new Error(`e2e fixture가 없습니다: ${window.location.pathname}`);
}

createApp(Root)
    .use(
        createVlossom({
            components: VlossomComponents,
        }),
    )
    .mount('#app');
