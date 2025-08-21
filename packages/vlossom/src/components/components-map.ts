import { defineAsyncComponent, type Component } from 'vue';
import { VsComponent } from '@/declaration';

export function createAsyncComponent(componentName: VsComponent): Component {
    switch (componentName) {
        case VsComponent.VsAvatar:
            return defineAsyncComponent(() => import('./vs-avatar/VsAvatar.vue'));
        case VsComponent.VsBar:
            return defineAsyncComponent(() => import('./vs-bar/VsBar.vue'));
        case VsComponent.VsButton:
            return defineAsyncComponent(() => import('./vs-button/VsButton.vue'));
        case VsComponent.VsContainer:
            return defineAsyncComponent(() => import('./vs-container/VsContainer.vue'));
        case VsComponent.VsDivider:
            return defineAsyncComponent(() => import('./vs-divider/VsDivider.vue'));
        case VsComponent.VsFocusTrap:
            return defineAsyncComponent(() => import('./vs-focus-trap/VsFocusTrap.vue'));
        case VsComponent.VsForm:
            return defineAsyncComponent(() => import('./vs-form/VsForm.vue'));
        case VsComponent.VsGrid:
            return defineAsyncComponent(() => import('./vs-grid/VsGrid.vue'));
        case VsComponent.VsHeader:
            return defineAsyncComponent(() => import('./vs-header/VsHeader.vue'));
        case VsComponent.VsImage:
            return defineAsyncComponent(() => import('./vs-image/VsImage.vue'));
        case VsComponent.VsInnerScroll:
            return defineAsyncComponent(() => import('./vs-inner-scroll/VsInnerScroll.vue'));
        case VsComponent.VsLayout:
            return defineAsyncComponent(() => import('./vs-layout/VsLayout.vue'));
        case VsComponent.VsLoading:
            return defineAsyncComponent(() => import('./vs-loading/VsLoading.vue'));
        case VsComponent.VsRender:
            return defineAsyncComponent(() => import('./vs-render/VsRender.vue'));
        case VsComponent.VsResponsive:
            return defineAsyncComponent(() => import('./vs-responsive/VsResponsive.vue'));
        case VsComponent.VsSection:
            return defineAsyncComponent(() => import('./vs-section/VsSection.vue'));
        case VsComponent.VsSkeleton:
            return defineAsyncComponent(() => import('./vs-skeleton/VsSkeleton.vue'));
        default:
            throw new Error(`[Vlossom] Unknown component: ${componentName}`);
    }
}
