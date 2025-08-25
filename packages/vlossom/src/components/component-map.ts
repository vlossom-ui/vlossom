/**
 * 모든 Vlossom 컴포넌트를 포함하는 컴포넌트 맵
 *
 * ⚠️ 주의: 이 객체를 application에서 import하면 모든 Vlossom 컴포넌트가 번들에 포함됩니다.
 * Tree shaking 최적화가 필요한 경우 개별 컴포넌트만 import하세요.
 */

import VsAvatar from './vs-avatar/VsAvatar.vue';
import VsBar from './vs-bar/VsBar.vue';
import VsButton from './vs-button/VsButton.vue';
import VsContainer from './vs-container/VsContainer.vue';
import VsDivider from './vs-divider/VsDivider.vue';
import VsFocusTrap from './vs-focus-trap/VsFocusTrap.vue';
import VsFooter from './vs-footer/VsFooter.vue';
import VsForm from './vs-form/VsForm.vue';
import VsGrid from './vs-grid/VsGrid.vue';
import VsHeader from './vs-header/VsHeader.vue';
import VsImage from './vs-image/VsImage.vue';
import VsInnerScroll from './vs-inner-scroll/VsInnerScroll.vue';
import VsLayout from './vs-layout/VsLayout.vue';
import VsLoading from './vs-loading/VsLoading.vue';
import VsRender from './vs-render/VsRender.vue';
import VsResponsive from './vs-responsive/VsResponsive.vue';
import VsSection from './vs-section/VsSection.vue';
import VsSkeleton from './vs-skeleton/VsSkeleton.vue';

export const VlossomComponents = {
    VsAvatar,
    VsBar,
    VsButton,
    VsContainer,
    VsDivider,
    VsFocusTrap,
    VsFooter,
    VsForm,
    VsGrid,
    VsHeader,
    VsImage,
    VsInnerScroll,
    VsLayout,
    VsLoading,
    VsRender,
    VsResponsive,
    VsSection,
    VsSkeleton,
} as const;
