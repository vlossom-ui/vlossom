import { ref, nextTick, type Ref } from 'vue';
import { utils } from '@/utils';
import type { AttachInfo, Placement, Align } from '@/declaration';

export function usePositioning(anchor: Ref<HTMLElement>, attachment: Ref<HTMLElement>) {
    const isVisible = ref(false);
    const computedPlacement: Ref<Exclude<Placement, 'middle'> | null> = ref(null);
    let throttledComputePosition: ((attachInfo: AttachInfo) => void) | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let eventHandler: (() => void) | null = null;

    function getX(align: Align, left: number, right: number, width: number, attachmentWidth: number): number {
        switch (align) {
            case 'start':
                return left;
            case 'end':
                return right - attachmentWidth;
            case 'center':
                return left + width / 2 - attachmentWidth / 2;
            default:
                throw new Error('Align is Invalid Value');
        }
    }

    function getY(align: Align, top: number, bottom: number, height: number, attachmentHeight: number): number {
        switch (align) {
            case 'start':
                return top;
            case 'end':
                return bottom - attachmentHeight;
            case 'center':
                return top + height / 2 - attachmentHeight / 2;
            default:
                throw new Error('Align is Invalid Value');
        }
    }

    function computePosition({
        placement = 'top',
        align = 'center',
        margin = 0,
        followWidth = false,
    }: AttachInfo): void {
        if (!anchor.value || !attachment.value) {
            return;
        }

        const { top, right, bottom, left, width, height } = utils.dom.getClientRect(anchor.value);
        const { width: attachmentWidth, height: attachmentHeight } = utils.dom.getClientRect(attachment.value);

        // Change placements when there are no spaces in the viewport.
        if (placement === 'bottom' && bottom + attachmentHeight > window.innerHeight) {
            computedPlacement.value = window.innerHeight - bottom < top ? 'top' : 'bottom';
        } else if (placement === 'top' && top - attachmentHeight < 0) {
            computedPlacement.value = window.innerHeight - bottom > top ? 'bottom' : 'top';
        } else if (placement === 'left' && left - attachmentWidth < 0) {
            computedPlacement.value = window.innerWidth - right > left ? 'right' : 'left';
        } else if (placement === 'right' && right + attachmentWidth > window.innerWidth) {
            computedPlacement.value = window.innerWidth - right < left ? 'left' : 'right';
        } else {
            computedPlacement.value = placement;
        }

        let x: number;
        let y: number;

        switch (computedPlacement.value) {
            case 'top':
                x = getX(align, left, right, width, attachmentWidth);
                y = top - attachmentHeight - margin;
                break;
            case 'right':
                x = right + margin;
                y = getY(align, top, bottom, height, attachmentHeight);
                break;
            case 'bottom':
                x = getX(align, left, right, width, attachmentWidth);
                y = bottom + margin;
                break;
            case 'left':
                x = left - attachmentWidth - margin;
                y = getY(align, top, bottom, height, attachmentHeight);
                break;
            default:
                throw new Error('Placement is Invalid Value');
        }

        const scrollLeft = window.scrollX || document.documentElement.scrollLeft || 0;
        const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;

        attachment.value.style.left = `${x + scrollLeft}px`;
        attachment.value.style.top = `${y + scrollTop}px`;

        if (followWidth) {
            attachment.value.style.width = `${width}px`;
        }
    }

    function appear(attachInfo: AttachInfo = {}): void {
        isVisible.value = true;

        nextTick(() => {
            try {
                attachment.value.style.display = 'block';
                attachment.value.style.position = 'absolute';
                computePosition(attachInfo);

                throttledComputePosition = utils.function.throttle(computePosition.bind(null, attachInfo), 30);

                const hasResizeObserver = window && window.ResizeObserver !== undefined;
                if (hasResizeObserver) {
                    resizeObserver = new ResizeObserver(() => throttledComputePosition?.(attachInfo));
                    resizeObserver.observe(anchor.value);
                    resizeObserver.observe(attachment.value);
                }

                eventHandler = () => throttledComputePosition?.(attachInfo);
                document.addEventListener('scroll', eventHandler, true);
                window.addEventListener('resize', eventHandler, true);
            } catch (error: unknown) {
                utils.log.error('anchor positioning', error instanceof Error ? error.message : String(error));
            }
        });
    }

    function disappear(): void {
        if (throttledComputePosition && eventHandler) {
            resizeObserver?.disconnect();
            document.removeEventListener('scroll', eventHandler, true);
            window.removeEventListener('resize', eventHandler, true);
            eventHandler = null;
        }
        isVisible.value = false;
    }

    return {
        isVisible,
        computedPlacement,
        appear,
        disappear,
    };
}
