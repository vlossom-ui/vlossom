import type { Directive } from 'vue';
import { SHAKE_CLASS } from './constants';

function triggerShake(el: HTMLElement): void {
    el.classList.remove(SHAKE_CLASS);
    void el.offsetWidth; // force reflow to retrigger animation
    el.classList.add(SHAKE_CLASS);
    el.addEventListener('animationend', () => el.classList.remove(SHAKE_CLASS), { once: true });
}

export const shake: Directive<HTMLElement, boolean | undefined> = (el, binding) => {
    if (!binding.value === !binding.oldValue) {
        return;
    }
    if (binding.value) {
        triggerShake(el);
    } else {
        el.classList.remove(SHAKE_CLASS);
    }
};
