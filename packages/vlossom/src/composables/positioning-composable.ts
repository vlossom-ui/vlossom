import { ref, nextTick, type TemplateRef, type Ref } from 'vue';
import { domUtil, functionUtil, logUtil } from '@/utils';
import type { Placement, Alignment } from '@/declaration';

export interface AttachInfo {
    placement?: Exclude<Placement, 'middle'>;
    align?: Alignment;
    margin?: number;
    followWidth?: boolean;
}

export function usePositioning(targetId: string, attachment: TemplateRef<HTMLElement>) {
    const refinedTargetId = targetId.replace('#', '');
    const isVisible = ref(false);
    const computedPlacement: Ref<Exclude<Placement, 'middle'> | null> = ref(null);
    let throttledComputePosition: ((...args: any) => any) | null = null;
    let resizeObserver: ResizeObserver | null = null;

    function getX(align: Alignment, left: number, right: number, width: number, attachmentWidth: number) {
        switch (align) {
            case 'start':
                return left;
            case 'end':
                return right - attachmentWidth;
            case 'center':
                return left + width / 2 - attachmentWidth / 2;
            default:
                throw Error('Align is Invalid Value');
        }
    }

    function getY(align: Alignment, top: number, bottom: number, height: number, attachmentHeight: number) {
        switch (align) {
            case 'start':
                return top;
            case 'end':
                return bottom - attachmentHeight;
            case 'center':
                return top + height / 2 - attachmentHeight / 2;
            default:
                throw Error('Align is Invalid Value');
        }
    }

    function computePosition({ placement = 'top', align = 'center', margin = 0, followWidth = false }: AttachInfo) {
        const target = document.getElementById(refinedTargetId);
        if (!target || !attachment.value) {
            return;
        }

        const { top, right, bottom, left, width, height } = domUtil.getClientRect(target);
        const { width: attachmentWidth, height: attachmentHeight } = domUtil.getClientRect(attachment.value);

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
                throw Error('Placement is Invalid Value');
        }

        const scrollLeft = window.scrollX || document.documentElement.scrollLeft || 0;
        const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;

        attachment.value.style.left = `${x + scrollLeft}px`;
        attachment.value.style.top = `${y + scrollTop}px`;

        if (followWidth) {
            attachment.value.style.width = `${width}px`;
        }
    }

    function appear(attachInfo: AttachInfo = {}) {
        if (isVisible.value) {
            return;
        }

        // make the attachment visible
        isVisible.value = true;

        // for waiting the attachment to be mounted
        nextTick(() => {
            try {
                const target = document.getElementById(refinedTargetId);
                if (!target || !attachment.value) {
                    return;
                }

                attachment.value.style.display = 'block';
                attachment.value.style.position = 'absolute';
                computePosition(attachInfo);

                throttledComputePosition = functionUtil.throttle(
                    { interval: 30 },
                    computePosition.bind(null, attachInfo),
                );

                const hasResizeObserver = window && window.ResizeObserver !== undefined;
                if (hasResizeObserver) {
                    resizeObserver = new ResizeObserver(throttledComputePosition);
                    resizeObserver.observe(target);
                    resizeObserver.observe(attachment.value);
                }

                document.addEventListener('scroll', throttledComputePosition, true);
                window.addEventListener('resize', throttledComputePosition, true);
            } catch (error: any) {
                logUtil.error('target positioning', error);
            }
        });
    }

    function disappear() {
        if (!isVisible.value) {
            return;
        }

        if (throttledComputePosition) {
            resizeObserver?.disconnect();
            document.removeEventListener('scroll', throttledComputePosition, true);
            window.removeEventListener('resize', throttledComputePosition, true);
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
