import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { useFileRules } from './../file-rules-composable';

function createFile(name: string, type = 'image/png'): File {
    return new File(['dummy'], name, { type });
}

describe('useFileRules', () => {
    describe('requiredCheck', () => {
        it('required가 true이고 파일이 없으면 에러를 반환한다', () => {
            // given
            const { requiredCheck } = useFileRules(ref(''), ref(false), ref(true));

            // when, then
            expect(requiredCheck([])).toBe('required');
        });

        it('required가 true이고 파일이 있으면 빈 문자열을 반환한다', () => {
            // given
            const { requiredCheck } = useFileRules(ref(''), ref(false), ref(true));

            // when, then
            expect(requiredCheck([createFile('a.png')])).toBe('');
        });

        it('required가 false이면 파일이 없어도 빈 문자열을 반환한다', () => {
            // given
            const { requiredCheck } = useFileRules(ref(''), ref(false), ref(false));

            // when, then
            expect(requiredCheck([])).toBe('');
        });
    });

    describe('maxCheck', () => {
        it('max가 없으면 항상 빈 문자열을 반환한다', () => {
            // given
            const { maxCheck } = useFileRules(ref(''), ref(true), ref(false));

            // when, then
            expect(maxCheck([createFile('a.png'), createFile('b.png')])).toBe('');
        });

        it('파일 수가 max를 초과하면 에러를 반환한다', () => {
            // given
            const { maxCheck } = useFileRules(ref(''), ref(true), ref(false), ref(1));

            // when, then
            expect(maxCheck([createFile('a.png'), createFile('b.png')])).toBe('You can only upload up to 1 files');
        });

        it('파일 수가 max 이하이면 빈 문자열을 반환한다', () => {
            // given
            const { maxCheck } = useFileRules(ref(''), ref(true), ref(false), ref(3));

            // when, then
            expect(maxCheck([createFile('a.png'), createFile('b.png')])).toBe('');
        });
    });

    describe('minCheck', () => {
        it('min이 없으면 항상 빈 문자열을 반환한다', () => {
            // given
            const { minCheck } = useFileRules(ref(''), ref(true), ref(false));

            // when, then
            expect(minCheck([])).toBe('');
        });

        it('파일 수가 min 미만이면 에러를 반환한다', () => {
            // given
            const { minCheck } = useFileRules(ref(''), ref(true), ref(false), undefined, ref(2));

            // when, then
            expect(minCheck([createFile('a.png')])).toBe('You must upload at least 2 files');
        });

        it('파일 수가 min 이상이면 빈 문자열을 반환한다', () => {
            // given
            const { minCheck } = useFileRules(ref(''), ref(true), ref(false), undefined, ref(2));

            // when, then
            expect(minCheck([createFile('a.png'), createFile('b.png')])).toBe('');
        });
    });

    describe('acceptCheck', () => {
        it('accept가 비어있으면 항상 빈 문자열을 반환한다', () => {
            // given
            const { acceptCheck } = useFileRules(ref(''), ref(false), ref(false));

            // when, then
            expect(acceptCheck([createFile('a.exe', 'application/octet-stream')])).toBe('');
        });

        it('파일이 없으면 빈 문자열을 반환한다', () => {
            // given
            const { acceptCheck } = useFileRules(ref('image/*'), ref(false), ref(false));

            // when, then
            expect(acceptCheck([])).toBe('');
        });

        it('MIME 타입이 정확히 일치하면 빈 문자열을 반환한다', () => {
            // given
            const { acceptCheck } = useFileRules(ref('image/png'), ref(false), ref(false));

            // when, then
            expect(acceptCheck([createFile('a.png', 'image/png')])).toBe('');
        });

        it('와일드카드 MIME 타입(image/*)이 일치하면 빈 문자열을 반환한다', () => {
            // given
            const { acceptCheck } = useFileRules(ref('image/*'), ref(false), ref(false));

            // when, then
            expect(acceptCheck([createFile('a.jpg', 'image/jpeg')])).toBe('');
        });

        it('확장자(.pdf)가 일치하면 빈 문자열을 반환한다', () => {
            // given
            const { acceptCheck } = useFileRules(ref('.pdf'), ref(false), ref(false));

            // when, then
            expect(acceptCheck([createFile('report.pdf', 'application/pdf')])).toBe('');
        });

        it('허용되지 않는 파일이 있으면 에러를 반환한다', () => {
            // given
            const { acceptCheck } = useFileRules(ref('image/*'), ref(false), ref(false));

            // when, then
            expect(acceptCheck([createFile('doc.pdf', 'application/pdf')])).toBe('Allowed: image/*');
        });

        it('복수 accept 중 하나라도 일치하면 빈 문자열을 반환한다', () => {
            // given
            const { acceptCheck } = useFileRules(ref('image/*, .pdf'), ref(false), ref(false));

            // when, then
            expect(acceptCheck([createFile('report.pdf', 'application/pdf')])).toBe('');
        });
    });

    describe('verifyMultipleFileUpload', () => {
        it('multiple이 false이고 파일이 2개 이상이면 에러를 반환한다', () => {
            // given
            const { verifyMultipleFileUpload } = useFileRules(ref(''), ref(false), ref(false));

            // when, then
            expect(verifyMultipleFileUpload([createFile('a.png'), createFile('b.png')])).toBe(
                'You can only upload one file',
            );
        });

        it('multiple이 false이고 파일이 1개이면 빈 문자열을 반환한다', () => {
            // given
            const { verifyMultipleFileUpload } = useFileRules(ref(''), ref(false), ref(false));

            // when, then
            expect(verifyMultipleFileUpload([createFile('a.png')])).toBe('');
        });

        it('multiple이 true이면 파일이 여러 개여도 빈 문자열을 반환한다', () => {
            // given
            const { verifyMultipleFileUpload } = useFileRules(ref(''), ref(true), ref(false));

            // when, then
            expect(verifyMultipleFileUpload([createFile('a.png'), createFile('b.png')])).toBe('');
        });
    });
});
