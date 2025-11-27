import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { clipboardUtil } from '../clipboard-util';

describe('clipboard-util', () => {
    let originalClipboard: Clipboard;

    beforeEach(() => {
        originalClipboard = navigator.clipboard;
    });

    afterEach(() => {
        Object.defineProperty(navigator, 'clipboard', {
            value: originalClipboard,
            writable: true,
        });
    });

    describe('copy()', () => {
        it('클립보드에 텍스트를 복사할 수 있다', async () => {
            // given
            const writeTextMock = vi.fn().mockResolvedValue(undefined);
            Object.defineProperty(navigator, 'clipboard', {
                value: { writeText: writeTextMock },
                writable: true,
            });

            // when
            const result = await clipboardUtil.copy('test text');

            // then
            expect(result).toBe(true);
            expect(writeTextMock).toHaveBeenCalledWith('test text');
        });

        it('클립보드 권한이 거부되면 false를 반환한다', async () => {
            // given
            const error = new DOMException('Permission denied', 'NotAllowedError');
            const writeTextMock = vi.fn().mockRejectedValue(error);
            Object.defineProperty(navigator, 'clipboard', {
                value: { writeText: writeTextMock },
                writable: true,
            });

            // when
            const result = await clipboardUtil.copy('test text');

            // then
            expect(result).toBe(false);
        });

        it('Clipboard API가 지원되지 않으면 false를 반환한다', async () => {
            // given
            Object.defineProperty(navigator, 'clipboard', {
                value: undefined,
                writable: true,
            });

            // when
            const result = await clipboardUtil.copy('test text');

            // then
            expect(result).toBe(false);
        });

        it('보안 컨텍스트 에러를 처리할 수 있다', async () => {
            // given
            const error = new DOMException('Document is not focused', 'NotAllowedError');
            const writeTextMock = vi.fn().mockRejectedValue(error);
            Object.defineProperty(navigator, 'clipboard', {
                value: { writeText: writeTextMock },
                writable: true,
            });

            // when
            const result = await clipboardUtil.copy('test text');

            // then
            expect(result).toBe(false);
        });

        it('알 수 없는 에러를 처리할 수 있다', async () => {
            // given
            const error = new Error('Unknown error');
            const writeTextMock = vi.fn().mockRejectedValue(error);
            Object.defineProperty(navigator, 'clipboard', {
                value: { writeText: writeTextMock },
                writable: true,
            });

            // when
            const result = await clipboardUtil.copy('test text');

            // then
            expect(result).toBe(false);
        });
    });
});
