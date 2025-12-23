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
        if (overflowX === 'scroll') {
            return true;
        }
        if (overflowX === 'auto') {
            // overflow: auto일 때는 실제로 스크롤이 가능한지 확인
            return element.scrollWidth > element.clientWidth;
        }

        return false;
    },
    isScrollableY(element: HTMLElement): boolean {
        const style = getComputedStyle(element);
        const overflowY = style.overflowY;
        if (overflowY === 'scroll') {
            return true;
        }
        if (overflowY === 'auto') {
            // overflow: auto일 때는 실제로 스크롤이 가능한지 확인
            return element.scrollHeight > element.clientHeight;
        }

        return false;
    },
};
