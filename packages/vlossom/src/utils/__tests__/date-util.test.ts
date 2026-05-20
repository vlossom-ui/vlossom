import { describe, expect, it } from 'vitest';
import { dateUtil } from '@/utils/date-util';

describe('date-util', () => {
    describe('toIso (UTC 기반 단순 포맷터)', () => {
        const sample = new Date('2026-05-18T15:30:00Z');

        it('YYYY-MM-DD 포맷으로 변환한다', () => {
            expect(dateUtil.toIso(sample, 'YYYY-MM-DD')).toBe('2026-05-18');
        });

        it('YYYY-MM-DDTHH:mm 포맷으로 변환한다', () => {
            expect(dateUtil.toIso(sample, 'YYYY-MM-DDTHH:mm')).toBe('2026-05-18T15:30');
        });

        it('HH:mm 포맷으로 변환한다', () => {
            expect(dateUtil.toIso(sample, 'HH:mm')).toBe('15:30');
        });

        it('YYYY-MM 포맷으로 변환한다', () => {
            expect(dateUtil.toIso(sample, 'YYYY-MM')).toBe('2026-05');
        });
    });

    describe('fromIso (UTC 기반 단순 파서)', () => {
        it('YYYY-MM-DD 문자열을 UTC Date로 변환한다', () => {
            const parsedDate = dateUtil.fromIso('2026-05-18', 'YYYY-MM-DD');
            expect(parsedDate).not.toBeNull();
            expect(parsedDate?.toISOString()).toBe('2026-05-18T00:00:00.000Z');
        });

        it('YYYY-MM-DDTHH:mm 문자열을 UTC Date로 변환한다', () => {
            const parsedDate = dateUtil.fromIso('2026-05-18T15:30', 'YYYY-MM-DDTHH:mm');
            expect(parsedDate).not.toBeNull();
            expect(parsedDate?.toISOString()).toBe('2026-05-18T15:30:00.000Z');
        });

        it('HH:mm 문자열을 1970-01-01 기준 UTC Date로 변환한다', () => {
            const parsedDate = dateUtil.fromIso('15:30', 'HH:mm');
            expect(parsedDate).not.toBeNull();
            expect(parsedDate?.toISOString()).toBe('1970-01-01T15:30:00.000Z');
        });

        it('YYYY-MM 문자열을 UTC Date(1일 00:00)로 변환한다', () => {
            const parsedDate = dateUtil.fromIso('2026-05', 'YYYY-MM');
            expect(parsedDate).not.toBeNull();
            expect(parsedDate?.toISOString()).toBe('2026-05-01T00:00:00.000Z');
        });

        it('invalid 문자열에 대해 null을 반환한다', () => {
            expect(dateUtil.fromIso('invalid', 'YYYY-MM-DD')).toBeNull();
            expect(dateUtil.fromIso('2026/05/18', 'YYYY-MM-DD')).toBeNull();
            expect(dateUtil.fromIso('', 'YYYY-MM-DD')).toBeNull();
        });

        it('윤년 2024-02-29를 정상 처리한다', () => {
            const parsedDate = dateUtil.fromIso('2024-02-29', 'YYYY-MM-DD');
            expect(parsedDate).not.toBeNull();
            expect(parsedDate?.toISOString()).toBe('2024-02-29T00:00:00.000Z');
        });
    });

    describe('toZonedIso (UTC → 지정 timezone의 화면 표시값)', () => {
        const sample = new Date('2026-05-18T15:30:00Z');

        it('UTC timezone은 입력과 동일한 화면 표시값을 반환한다', () => {
            expect(dateUtil.toZonedIso(sample, 'Etc/UTC')).toBe('2026-05-18T15:30');
        });

        it('Asia/Seoul (UTC+9) 화면 표시값으로 변환한다', () => {
            expect(dateUtil.toZonedIso(sample, 'Asia/Seoul')).toBe('2026-05-19T00:30');
        });

        it('America/Los_Angeles (UTC-8/-7 DST) 화면 표시값으로 변환한다', () => {
            // 5월 18일은 PDT (UTC-7)
            expect(dateUtil.toZonedIso(sample, 'America/Los_Angeles')).toBe('2026-05-18T08:30');
        });

        it('Europe/Paris (UTC+1/+2 DST) 화면 표시값으로 변환한다', () => {
            // 5월 18일은 CEST (UTC+2)
            expect(dateUtil.toZonedIso(sample, 'Europe/Paris')).toBe('2026-05-18T17:30');
        });

        it('Pacific/Auckland (UTC+12/+13 DST) 화면 표시값으로 변환한다', () => {
            // 5월 18일 NZ는 NZST (UTC+12)
            expect(dateUtil.toZonedIso(sample, 'Pacific/Auckland')).toBe('2026-05-19T03:30');
        });
    });

    describe('fromZonedIso (화면 표시값 + timezone → UTC instant)', () => {
        it('UTC timezone에서 화면 표시값과 UTC가 동일하다', () => {
            const parsedDate = dateUtil.fromZonedIso('2026-05-18T15:30', 'Etc/UTC');
            expect(parsedDate).not.toBeNull();
            expect(parsedDate?.toISOString()).toBe('2026-05-18T15:30:00.000Z');
        });

        it('Asia/Seoul (UTC+9)의 화면 표시값을 UTC로 변환한다', () => {
            const parsedDate = dateUtil.fromZonedIso('2026-05-19T00:30', 'Asia/Seoul');
            expect(parsedDate).not.toBeNull();
            expect(parsedDate?.toISOString()).toBe('2026-05-18T15:30:00.000Z');
        });

        it('America/Los_Angeles (DST)의 화면 표시값을 UTC로 변환한다', () => {
            const parsedDate = dateUtil.fromZonedIso('2026-05-18T08:30', 'America/Los_Angeles');
            expect(parsedDate).not.toBeNull();
            expect(parsedDate?.toISOString()).toBe('2026-05-18T15:30:00.000Z');
        });

        it('round-trip: UTC → toZonedIso → fromZonedIso 결과가 동일하다', () => {
            const timezones = ['Etc/UTC', 'Asia/Seoul', 'America/Los_Angeles', 'Europe/Paris', 'Pacific/Auckland'];
            const original = new Date('2026-05-18T15:30:00Z');

            for (const timezone of timezones) {
                const displayedIso = dateUtil.toZonedIso(original, timezone);
                const parsedDate = dateUtil.fromZonedIso(displayedIso, timezone);
                expect(parsedDate?.toISOString()).toBe(original.toISOString());
            }
        });

        it('invalid iso 문자열에 대해 null을 반환한다', () => {
            expect(dateUtil.fromZonedIso('invalid', 'Etc/UTC')).toBeNull();
            expect(dateUtil.fromZonedIso('2026/05/18T15:30', 'Etc/UTC')).toBeNull();
        });

        it('invalid timezone에 대해 null을 반환한다', () => {
            expect(dateUtil.fromZonedIso('2026-05-18T15:30', 'Invalid/Zone')).toBeNull();
        });
    });

    describe('isValidTimezone', () => {
        it('유효한 IANA timezone에 대해 true를 반환한다', () => {
            expect(dateUtil.isValidTimezone('Etc/UTC')).toBe(true);
            expect(dateUtil.isValidTimezone('Asia/Seoul')).toBe(true);
            expect(dateUtil.isValidTimezone('America/New_York')).toBe(true);
        });

        it('잘못된 timezone 문자열에 대해 false를 반환한다', () => {
            expect(dateUtil.isValidTimezone('Invalid/Zone')).toBe(false);
            expect(dateUtil.isValidTimezone('Foo/Bar')).toBe(false);
            expect(dateUtil.isValidTimezone('')).toBe(false);
        });
    });

    describe('DST 경계 처리', () => {
        it('America/New_York Spring Forward (2026-03-08 02:30 → skipped)', () => {
            // 2026-03-08 02:30 EST는 존재하지 않음 (02:00 EST → 03:00 EDT로 점프)
            // Intl이 자동으로 03:30 EDT로 처리하거나 그대로 UTC 변환
            const parsedDate = dateUtil.fromZonedIso('2026-03-08T02:30', 'America/New_York');
            // Intl은 존재하지 않는 화면 표시값을 인접한 valid time으로 매핑하거나 그대로 처리
            // 핵심: 라운드 트립이 가능해야 함 (정확한 값보다 일관성이 중요)
            expect(parsedDate).not.toBeNull();
            // 라운드트립 후 다시 New_York 화면 표시값 추출 시 Intl이 정한 값과 일치해야 함
            const displayedIso = dateUtil.toZonedIso(parsedDate!, 'America/New_York');
            const utcAgain = dateUtil.fromZonedIso(displayedIso, 'America/New_York');
            expect(utcAgain?.toISOString()).toBe(parsedDate!.toISOString());
        });
    });
});
