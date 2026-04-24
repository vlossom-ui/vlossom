export interface OverlayStyle {
    width?: string;
    height?: string;
    pointerEvents?: string;
    zIndex?: number;
}

export function useOverlayDom() {
    function createOverlayDom(id: string, overlayStyle: OverlayStyle = {}) {
        const overlay = document.createElement('div');
        overlay.setAttribute('id', id);
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';

        overlay.style.width = overlayStyle.width ?? '100%';
        overlay.style.height = overlayStyle.height ?? '100%';
        overlay.style.pointerEvents = overlayStyle.pointerEvents ?? 'none';
        overlay.style.zIndex = (overlayStyle.zIndex ?? 5000).toString();

        return overlay;
    }

    function appendOverlayDom(targetElement: Element, overlayId: string, overlayStyle: OverlayStyle = {}) {
        const overlay = targetElement.querySelector(overlayId);
        if (overlay) {
            return overlay;
        }

        const newOverlay = createOverlayDom(overlayId.replace('#', ''), overlayStyle);
        targetElement.appendChild(newOverlay);
        return newOverlay;
    }

    return { appendOverlayDom };
}
