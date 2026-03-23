import type { Directive } from 'vue';
import { domUtil } from '@/utils';

const SCROLL_SHADOW_MIXIN_CLASS = 'vs-scroll-shadow';
const SCROLL_STATE_VALUE = 'scroll-state';

// global state
const originalContainerTypeMap = new WeakMap<HTMLElement, string>();

function verifyScrollContainer(el: HTMLElement): boolean {
    const isScrollable = domUtil.isScrollableX(el) || domUtil.isScrollableY(el);
    if (!isScrollable) {
        return false;
    }
    return true;
}

function activate(el: HTMLElement): void {
    const originalContainerType = el.style.containerType;
    const computedStyle = getComputedStyle(el).getPropertyValue('container-type').trim();

    originalContainerTypeMap.set(el, originalContainerType);
    /**
     * @note 'scroll-state' is 반드시 needed for scroll shadow to work.
     * some elements may have already set a other container type, so we need to add 'scroll-state' to the existing container type.
     *
     * e.g. container-type: inline-size; -> container-type: inline-size scroll-state;
     */
    if (!computedStyle.includes(SCROLL_STATE_VALUE)) {
        const activatedContainerType =
            computedStyle && computedStyle !== 'normal' ? `${computedStyle} ${SCROLL_STATE_VALUE}` : SCROLL_STATE_VALUE;
        el.style.containerType = activatedContainerType;
    }

    el.classList.add(SCROLL_SHADOW_MIXIN_CLASS);
}

function deactivate(el: HTMLElement): void {
    el.classList.remove(SCROLL_SHADOW_MIXIN_CLASS);

    const originalContainerType = originalContainerTypeMap.get(el);
    if (originalContainerType) {
        el.style.containerType = originalContainerType;
    } else {
        el.style.removeProperty('container-type');
    }
    originalContainerTypeMap.delete(el);
}

export const scrollShadow: Directive<HTMLElement, boolean | undefined> = {
    mounted(el, binding) {
        if (binding.value === false) {
            return;
        }
        if (!verifyScrollContainer(el)) {
            return;
        }
        activate(el);
    },

    updated(el, binding) {
        if (binding.value === binding.oldValue) {
            return;
        }
        if (binding.value === false) {
            deactivate(el);
            return;
        }
        if (!verifyScrollContainer(el)) {
            return;
        }
        activate(el);
    },

    unmounted(el) {
        deactivate(el);
    },
};
