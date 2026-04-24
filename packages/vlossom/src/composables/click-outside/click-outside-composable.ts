export function useClickOutside(excludedSelectors: string[], callback: () => void) {
    function onClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;

        if (excludedSelectors.some((selector) => target.closest(selector))) {
            return;
        }

        callback();
    }

    function addClickOutsideListener() {
        document.addEventListener('click', onClickOutside, true);
    }

    function removeClickOutsideListener() {
        document.removeEventListener('click', onClickOutside, true);
    }

    return { addClickOutsideListener, removeClickOutsideListener };
}
