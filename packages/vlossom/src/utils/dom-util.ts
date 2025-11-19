export const domUtil = {
    isBrowser(): boolean {
        return typeof window !== 'undefined';
    },
    getClientRect(element: HTMLElement): DOMRect {
        return element.getBoundingClientRect();
    },
    isScrollableX(element: HTMLElement): boolean {
        const style = getComputedStyle(element);
        const overflowX = style.overflowX;
        if (overflowX === 'auto' || overflowX === 'scroll') {
            return true;
        }
        return element.scrollWidth > element.clientWidth;
    },
    isScrollableY(element: HTMLElement): boolean {
        const style = getComputedStyle(element);
        const overflowY = style.overflowY;
        if (overflowY === 'auto' || overflowY === 'scroll') {
            return true;
        }
        return element.scrollHeight > element.clientHeight;
    },
};
