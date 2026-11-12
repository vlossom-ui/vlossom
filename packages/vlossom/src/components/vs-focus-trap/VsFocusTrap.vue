<script lang="ts">
import {
    defineComponent,
    ref,
    toRefs,
    cloneVNode,
    h,
    onMounted,
    onBeforeUnmount,
    computed,
    nextTick,
    watch,
    type Ref,
    type ComponentPublicInstance,
} from 'vue';
import { VsComponent } from '@/declaration';
import { logUtil, stringUtil } from '@/utils';

const componentName = VsComponent.VsFocusTrap;
const FOCUSABLE_SELECTOR = `button:not([tabindex="-1"]), [href]:not([tabindex="-1"]), input:not([tabindex="-1"]),
    select:not([tabindex="-1"]), textarea:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])`;

export default defineComponent({
    name: componentName,
    props: {
        disabled: { type: Boolean, default: false },
    },
    setup(props, { slots, expose }) {
        const { disabled } = toRefs(props);

        const focusTrapRef: Ref<HTMLElement | null> = ref(null);
        const focusTrapAnchorRef: Ref<HTMLElement | null> = ref(null);
        const wrapperRef: Ref<HTMLElement | ComponentPublicInstance | null> = ref(null);

        const wrapperElement = computed(() => {
            if (!wrapperRef.value) {
                return null;
            }

            return wrapperRef.value instanceof HTMLElement ? wrapperRef.value : (wrapperRef.value.$el as HTMLElement);
        });

        const previousFocused: HTMLElement | null = document.activeElement as HTMLElement;

        let firstFocusable: HTMLElement | null = null;
        let lastFocusable: HTMLElement | null = null;

        function cycleTabKey(event: KeyboardEvent) {
            if (event.key !== 'Tab') {
                return;
            }

            catchFocusables();

            if (!firstFocusable || !lastFocusable) {
                return;
            }

            if (event.shiftKey && document.activeElement === firstFocusable) {
                event.preventDefault();
                lastFocusable.focus();
            } else if (!event.shiftKey && document.activeElement === lastFocusable) {
                event.preventDefault();
                firstFocusable.focus();
            }
        }

        function activateCycle() {
            if (!firstFocusable || !lastFocusable) {
                return;
            }

            focusTrapRef.value?.addEventListener('keydown', cycleTabKey);
        }

        function deactivateCycle() {
            if (!firstFocusable || !lastFocusable) {
                return;
            }

            focusTrapRef.value?.removeEventListener('keydown', cycleTabKey);
        }

        function catchFocusables() {
            if (!wrapperElement.value) {
                return;
            }

            const focusables = wrapperElement.value.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);

            const shownFocusables = Array.from(focusables).filter(
                (focusable) => focusable.style.display !== 'none' || !focusable.hasAttribute('disabled'),
            );

            if (!shownFocusables.length) {
                firstFocusable = null;
                lastFocusable = null;
                return;
            }

            firstFocusable = shownFocusables[0];
            lastFocusable = shownFocusables[shownFocusables.length - 1];
        }

        function findAutofocusTarget(): HTMLElement | null {
            const autofocusElement = Array.from(
                wrapperElement.value?.querySelectorAll<HTMLElement>('[autofocus]') ?? [],
            ).find((element) => element.closest('.vs-focus-trap') === focusTrapRef.value);

            if (!autofocusElement || autofocusElement.matches(FOCUSABLE_SELECTOR)) {
                return autofocusElement ?? null;
            }
            return autofocusElement.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
        }

        function focus() {
            nextTick(() => {
                const isChildOfFocusTrap = document.activeElement?.closest('.vs-focus-trap') === focusTrapRef.value;
                if (isChildOfFocusTrap) {
                    return;
                }

                // autofocus 대상이 disabled이거나 숨겨져 포커스를 받지 못해도 포커스가 앵커에 남도록 앵커를 먼저 포커스한다
                focusTrapAnchorRef.value?.focus({ preventScroll: true });
                findAutofocusTarget()?.focus({ focusVisible: true });
            });
        }

        function blur() {
            if (previousFocused?.focus) {
                previousFocused.focus();
            }
        }

        onMounted(() => {
            catchFocusables();
            if (!disabled.value) {
                activateCycle();
            }
            focus();
        });

        watch(disabled, (newVal) => {
            if (newVal) {
                deactivateCycle();
            } else {
                catchFocusables();
                activateCycle();
            }
        });

        onBeforeUnmount(() => {
            deactivateCycle();
            blur();
        });

        expose({ focus, blur });

        function render() {
            if (!slots.default) {
                return null;
            }

            const vNodes = slots.default();
            if (vNodes.length !== 1) {
                logUtil.error(VsComponent.VsFocusTrap, 'Focus trap component must contain exactly one child element');

                return vNodes;
            }

            const className = stringUtil.kebabCase(VsComponent.VsFocusTrap);
            return h('div', { class: className, ref: focusTrapRef }, [
                h('div', { id: `${className}-anchor`, tabindex: -1, ref: focusTrapAnchorRef }),
                cloneVNode(vNodes[0], { ref: wrapperRef }),
            ]);
        }

        return () => render();
    },
});
</script>
