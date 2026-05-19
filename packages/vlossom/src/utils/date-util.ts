export type IsoFormat = 'YYYY-MM-DD' | 'YYYY-MM-DDTHH:mm' | 'HH:mm' | 'YYYY-MM';

const ISO_PATTERNS: Record<IsoFormat, RegExp> = {
    'YYYY-MM-DD': /^(\d{4})-(\d{2})-(\d{2})$/,
    'YYYY-MM-DDTHH:mm': /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/,
    'HH:mm': /^(\d{2}):(\d{2})$/,
    'YYYY-MM': /^(\d{4})-(\d{2})$/,
};

const ZONED_PATTERN = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;

interface ZonedParts {
    yyyy: number;
    mm: number;
    dd: number;
    HH: number;
    MM: number;
}

function pad2(n: number): string {
    return String(n).padStart(2, '0');
}

function parseZoned(iso: string): ZonedParts | null {
    const match = iso.match(ZONED_PATTERN);
    if (!match) {
        return null;
    }
    return {
        yyyy: Number(match[1]),
        mm: Number(match[2]),
        dd: Number(match[3]),
        HH: Number(match[4]),
        MM: Number(match[5]),
    };
}

function formatZoned(d: Date, tz: string): string | null {
    const dtf = new Intl.DateTimeFormat('en-CA', {
        timeZone: tz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
    const parts = dtf.formatToParts(d);
    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
    const yyyy = get('year');
    const mm = get('month');
    const dd = get('day');
    let HH = get('hour');
    const MM = get('minute');
    if (!yyyy || !mm || !dd || !HH || !MM) {
        return null;
    }
    if (HH === '24') {
        HH = '00';
    }
    return `${yyyy}-${mm}-${dd}T${HH}:${MM}`;
}

export const dateUtil = {
    sameDay(a: Date, b: Date): boolean {
        return (
            a.getUTCFullYear() === b.getUTCFullYear() &&
            a.getUTCMonth() === b.getUTCMonth() &&
            a.getUTCDate() === b.getUTCDate()
        );
    },

    toIso(date: Date, format: IsoFormat): string {
        const yyyy = date.getUTCFullYear();
        const mm = pad2(date.getUTCMonth() + 1);
        const dd = pad2(date.getUTCDate());
        const HH = pad2(date.getUTCHours());
        const MM = pad2(date.getUTCMinutes());

        switch (format) {
            case 'YYYY-MM-DD':
                return `${yyyy}-${mm}-${dd}`;
            case 'YYYY-MM-DDTHH:mm':
                return `${yyyy}-${mm}-${dd}T${HH}:${MM}`;
            case 'HH:mm':
                return `${HH}:${MM}`;
            case 'YYYY-MM':
                return `${yyyy}-${mm}`;
        }
    },

    fromIso(str: string, format: IsoFormat): Date | null {
        const pattern = ISO_PATTERNS[format];
        const match = str.match(pattern);
        if (!match) {
            return null;
        }

        let yyyy = 1970;
        let mm = 1;
        let dd = 1;
        let HH = 0;
        let MM = 0;

        switch (format) {
            case 'YYYY-MM-DD':
                [, yyyy, mm, dd] = match.map(Number) as [number, number, number, number];
                break;
            case 'YYYY-MM-DDTHH:mm':
                [, yyyy, mm, dd, HH, MM] = match.map(Number) as [
                    number,
                    number,
                    number,
                    number,
                    number,
                    number,
                ];
                break;
            case 'HH:mm':
                [, HH, MM] = match.map(Number) as [number, number, number];
                break;
            case 'YYYY-MM':
                [, yyyy, mm] = match.map(Number) as [number, number, number];
                break;
        }

        const ms = Date.UTC(yyyy, mm - 1, dd, HH, MM);
        if (Number.isNaN(ms)) {
            return null;
        }
        return new Date(ms);
    },

    normalizeMinutes(date: Date): Date {
        const d = new Date(date.getTime());
        d.setUTCSeconds(0, 0);
        return d;
    },

    toZonedIso(d: Date, tz: string): string {
        return formatZoned(d, tz) ?? '';
    },

    fromZonedIso(iso: string, tz: string): Date | null {
        if (!dateUtil.isValidTimezone(tz)) {
            return null;
        }

        const target = parseZoned(iso);
        if (!target) {
            return null;
        }

        let candidate = Date.UTC(target.yyyy, target.mm - 1, target.dd, target.HH, target.MM);

        for (let i = 0; i < 2; i++) {
            const formatted = formatZoned(new Date(candidate), tz);
            if (!formatted) {
                return null;
            }
            const back = parseZoned(formatted);
            if (!back) {
                return null;
            }

            const guessMs = Date.UTC(back.yyyy, back.mm - 1, back.dd, back.HH, back.MM);
            const targetMs = Date.UTC(
                target.yyyy,
                target.mm - 1,
                target.dd,
                target.HH,
                target.MM,
            );
            const diff = targetMs - guessMs;
            if (diff === 0) {
                return new Date(candidate);
            }
            candidate += diff;
        }

        return new Date(candidate);
    },

    isValidTimezone(tz: string): boolean {
        if (!tz) {
            return false;
        }
        try {
            new Intl.DateTimeFormat('en-US', { timeZone: tz });
            return true;
        } catch {
            return false;
        }
    },
};
