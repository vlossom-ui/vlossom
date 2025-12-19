import { describe, expect, it, afterEach, vi } from 'vitest';
import { clipboardUtil } from './../clipboard-util';

describe('clipboard-util', () => {
    afterEach(() => {
        // 각 테스트 전에 writeText mock을 초기화
        if (navigator.clipboard) {
            vi.mocked(navigator.clipboard.writeText).mockClear();
        }
    });

    describe('copy()', () => {
        it('클립보드에 텍스트를 복사할 수 있다', async () => {
            // when
            const result = await clipboardUtil.copy('test text');

            // then
            expect(result).toBe(true);
            expect(navigator.clipboard!.writeText).toHaveBeenCalledWith('test text');
        });

        it('클립보드 권한이 거부되면 false를 반환한다', async () => {
            // given
            const error = new DOMException('Permission denied', 'NotAllowedError');
            const writeTextMock = vi.mocked(navigator.clipboard!.writeText);
            writeTextMock.mockRejectedValue(error);

            // when
            const result = await clipboardUtil.copy('test text');

            // then
            expect(result).toBe(false);
        });

        it('Clipboard API가 지원되지 않으면 false를 반환한다', async () => {
            // given
            vi.stubGlobal('navigator', {
                ...navigator,
                clipboard: undefined,
            });

            // when
            const result = await clipboardUtil.copy('test text');

            // then
            expect(result).toBe(false);

            // cleanup: test-setup.ts의 기본 mock으로 복원
            vi.stubGlobal('navigator', {
                ...navigator,
                clipboard: {
                    writeText: vi.fn().mockResolvedValue(undefined),
                    readText: vi.fn().mockResolvedValue(''),
                    read: vi.fn(),
                    write: vi.fn(),
                },
            });
        });

        it('보안 컨텍스트 에러를 처리할 수 있다', async () => {
            // given
            const error = new DOMException('Document is not focused', 'NotAllowedError');
            const writeTextMock = vi.mocked(navigator.clipboard!.writeText);
            writeTextMock.mockRejectedValue(error);

            // when
            const result = await clipboardUtil.copy('test text');

            // then
            expect(result).toBe(false);
        });

        it('알 수 없는 에러를 처리할 수 있다', async () => {
            // given
            const error = new Error('Unknown error');
            const writeTextMock = vi.mocked(navigator.clipboard!.writeText);
            writeTextMock.mockRejectedValue(error);

            // when
            const result = await clipboardUtil.copy('test text');

            // then
            expect(result).toBe(false);
        });
    });
});
