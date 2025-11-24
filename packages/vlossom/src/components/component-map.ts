/**
 * 모든 Vlossom 컴포넌트를 포함하는 컴포넌트 맵
 *
 * ⚠️ 주의: 이 객체를 application에서 import하면 모든 Vlossom 컴포넌트가 번들에 포함됩니다.
 * Tree shaking 최적화가 필요한 경우 개별 컴포넌트만 import하세요.
 */

import VsAccordion from './vs-accordion/VsAccordion.vue';
import VsAvatar from './vs-avatar/VsAvatar.vue';
import VsBar from './vs-bar/VsBar.vue';
import VsBlock from './vs-block/VsBlock.vue';
import VsButton from './vs-button/VsButton.vue';
import VsCheckbox from './vs-checkbox/VsCheckbox.vue';
import VsCheckboxSet from './vs-checkbox/VsCheckboxSet.vue';
import VsChip from './vs-chip/VsChip.vue';
import VsContainer from './vs-container/VsContainer.vue';
import VsDimmed from './vs-dimmed/VsDimmed.vue';
import VsDivider from './vs-divider/VsDivider.vue';
import VsDrawer from './vs-drawer/VsDrawer.vue';
import VsExpandable from './vs-expandable/VsExpandable.vue';
import VsFileDrop from './vs-file-drop/VsFileDrop.vue';
import VsFocusTrap from './vs-focus-trap/VsFocusTrap.vue';
import VsFooter from './vs-footer/VsFooter.vue';
import VsForm from './vs-form/VsForm.vue';
import VsGrid from './vs-grid/VsGrid.vue';
import VsHeader from './vs-header/VsHeader.vue';
import VsImage from './vs-image/VsImage.vue';
import VsIndexView from './vs-index-view/VsIndexView.vue';
import VsInfiniteScroll from './vs-infinite-scroll/VsInfiniteScroll.vue';
import VsInnerScroll from './vs-inner-scroll/VsInnerScroll.vue';
import VsInput from './vs-input/VsInput.vue';
import VsInputWrapper from './vs-input-wrapper/VsInputWrapper.vue';
import VsLabelValue from './vs-label-value/VsLabelValue.vue';
import VsLayout from './vs-layout/VsLayout.vue';
import VsLoading from './vs-loading/VsLoading.vue';
import VsMessage from './vs-message/VsMessage.vue';
import VsModal from './vs-modal/VsModal.vue';
import VsModalNode from './vs-modal/VsModalNode.vue';
import VsModalView from './vs-modal/VsModalView.vue';
import VsPage from './vs-page/VsPage.vue';
import VsPagination from './vs-pagination/VsPagination.vue';
import VsProgress from './vs-progress/VsProgress.vue';
import VsRadio from './vs-radio/VsRadio.vue';
import VsRadioSet from './vs-radio/VsRadioSet.vue';
import VsRender from './vs-render/VsRender.vue';
import VsResponsive from './vs-responsive/VsResponsive.vue';
import VsSearchInput from './vs-search-input/VsSearchInput.vue';
import VsSkeleton from './vs-skeleton/VsSkeleton.vue';
import VsSwitch from './vs-switch/VsSwitch.vue';
import VsTabs from './vs-tabs/VsTabs.vue';
import VsTextarea from './vs-textarea/VsTextarea.vue';
import VsThemeButton from './vs-theme-button/VsThemeButton.vue';
import VsToast from './vs-toast/VsToast.vue';
import VsToastView from './vs-toast/VsToastView.vue';
import VsToggle from './vs-toggle/VsToggle.vue';
import VsTooltip from './vs-tooltip/VsTooltip.vue';

export const VlossomComponents = {
    VsAccordion,
    VsAvatar,
    VsBar,
    VsButton,
    VsBlock,
    VsCheckbox,
    VsCheckboxSet,
    VsChip,
    VsContainer,
    VsDimmed,
    VsDivider,
    VsDrawer,
    VsExpandable,
    VsFileDrop,
    VsFocusTrap,
    VsFooter,
    VsForm,
    VsGrid,
    VsHeader,
    VsImage,
    VsIndexView,
    VsInfiniteScroll,
    VsInnerScroll,
    VsInput,
    VsInputWrapper,
    VsLabelValue,
    VsLayout,
    VsLoading,
    VsMessage,
    VsModal,
    VsModalNode,
    VsModalView,
    VsPage,
    VsPagination,
    VsProgress,
    VsRadio,
    VsRadioSet,
    VsRender,
    VsResponsive,
    VsSearchInput,
    VsSkeleton,
    VsSwitch,
    VsTabs,
    VsTextarea,
    VsThemeButton,
    VsToast,
    VsToastView,
    VsToggle,
    VsTooltip,
} as const;
