export type IsoFormat = 'YYYY-MM-DD' | 'YYYY-MM-DDTHH:mm' | 'HH:mm' | 'YYYY-MM';

interface DateTimeParts {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
}

const FORMAT_PATTERNS: Record<IsoFormat, RegExp> = {
    'YYYY-MM-DD': /^(\d{4})-(\d{2})-(\d{2})$/,
    'YYYY-MM-DDTHH:mm': /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/,
    'HH:mm': /^(\d{2}):(\d{2})$/,
    'YYYY-MM': /^(\d{4})-(\d{2})$/,
};

const DATE_TIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;

function parseDateTimeIso(iso: string): DateTimeParts | null {
    const match = iso.match(DATE_TIME_PATTERN);
    if (!match) {
        return null;
    }
    return {
        year: Number(match[1]),
        month: Number(match[2]),
        day: Number(match[3]),
        hour: Number(match[4]),
        minute: Number(match[5]),
    };
}

function pad2(value: number): string {
    return String(value).padStart(2, '0');
}

function toUtcTimestamp(dateTime: DateTimeParts): number {
    return Date.UTC(dateTime.year, dateTime.month - 1, dateTime.day, dateTime.hour, dateTime.minute);
}

function createDateTimeFormat(timezone: string): Intl.DateTimeFormat {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
}

function formatDateInTimezone(date: Date, timezone: string): string | null {
    const dateTimeFormat = createDateTimeFormat(timezone);
    const parts = dateTimeFormat.formatToParts(date);
    const getPart = (type: string) => parts.find((part) => part.type === type)?.value ?? '';
    const year = getPart('year');
    const month = getPart('month');
    const day = getPart('day');
    let hour = getPart('hour');
    const minute = getPart('minute');
    if (!year || !month || !day || !hour || !minute) {
        return null;
    }
    if (hour === '24') {
        hour = '00';
    }
    return `${year}-${month}-${day}T${hour}:${minute}`;
}

function getDisplayedTimestamp(date: Date, timezone: string): number | null {
    const displayedIso = formatDateInTimezone(date, timezone);
    if (!displayedIso) {
        return null;
    }
    const displayedDateTime = parseDateTimeIso(displayedIso);
    return displayedDateTime ? toUtcTimestamp(displayedDateTime) : null;
}

function getTimezoneOffsetInMs(date: Date, timezone: string): number | null {
    const displayedTimestamp = getDisplayedTimestamp(date, timezone);
    return displayedTimestamp === null ? null : displayedTimestamp - date.getTime();
}

export const dateUtil = {
    isValidTimezone(timezone: string): boolean {
        if (!timezone) {
            return false;
        }
        try {
            new Intl.DateTimeFormat('en-US', { timeZone: timezone });
            return true;
        } catch {
            return false;
        }
    },

    toIso(date: Date, format: IsoFormat): string {
        const year = date.getUTCFullYear();
        const month = pad2(date.getUTCMonth() + 1);
        const day = pad2(date.getUTCDate());
        const hour = pad2(date.getUTCHours());
        const minute = pad2(date.getUTCMinutes());

        switch (format) {
            case 'YYYY-MM-DD':
                return `${year}-${month}-${day}`;
            case 'YYYY-MM-DDTHH:mm':
                return `${year}-${month}-${day}T${hour}:${minute}`;
            case 'HH:mm':
                return `${hour}:${minute}`;
            case 'YYYY-MM':
                return `${year}-${month}`;
        }
    },

    fromIso(value: string, format: IsoFormat): Date | null {
        const pattern = FORMAT_PATTERNS[format];
        const match = value.match(pattern);
        if (!match) {
            return null;
        }

        let year = 1970;
        let month = 1;
        let day = 1;
        let hour = 0;
        let minute = 0;

        switch (format) {
            case 'YYYY-MM-DD':
                [, year, month, day] = match.map(Number) as [number, number, number, number];
                break;
            case 'YYYY-MM-DDTHH:mm':
                [, year, month, day, hour, minute] = match.map(Number) as [
                    number,
                    number,
                    number,
                    number,
                    number,
                    number,
                ];
                break;
            case 'HH:mm':
                [, hour, minute] = match.map(Number) as [number, number, number];
                break;
            case 'YYYY-MM':
                [, year, month] = match.map(Number) as [number, number, number];
                break;
        }

        const timestamp = Date.UTC(year, month - 1, day, hour, minute);
        if (Number.isNaN(timestamp)) {
            return null;
        }
        return new Date(timestamp);
    },

    // e.g. '2026-05-18T15:30' + 'HH:mm' -> '15:30'
    formatDateTimeIso(dateTimeIso: string, format: IsoFormat): string {
        switch (format) {
            case 'YYYY-MM-DD':
                return dateTimeIso.slice(0, 10);
            case 'YYYY-MM-DDTHH:mm':
                return dateTimeIso.slice(0, 16);
            case 'HH:mm':
                return dateTimeIso.slice(11, 16);
            case 'YYYY-MM':
                return dateTimeIso.slice(0, 7);
        }
    },

    // e.g. '2026-05' + 'YYYY-MM' -> '2026-05-01T00:00'
    expandToDateTimeIso(value: string, format: IsoFormat): string {
        switch (format) {
            case 'YYYY-MM-DD':
                return `${value.slice(0, 10)}T00:00`;
            case 'YYYY-MM-DDTHH:mm':
                return value.slice(0, 16);
            case 'HH:mm':
                return `1970-01-01T${value.slice(0, 5)}`;
            case 'YYYY-MM':
                return `${value.slice(0, 7)}-01T00:00`;
        }
    },

    toZonedIso(date: Date, timezone: string): string {
        if (!dateUtil.isValidTimezone(timezone)) {
            return '';
        }
        return formatDateInTimezone(date, timezone) ?? '';
    },

    /*
     * DST(e.g. 서머타임)가 고려되지 않았다.
     * 엄격하게 처리해야 한다면, Temporal같은 timezone-aware library 사용을 검토한다.
     */
    fromZonedIso(displayedIso: string, timezone: string): Date | null {
        if (!dateUtil.isValidTimezone(timezone)) {
            return null;
        }

        const inputDateTime = parseDateTimeIso(displayedIso);
        if (!inputDateTime) {
            return null;
        }

        const displayedTimestamp = toUtcTimestamp(inputDateTime);
        const timezoneOffset = getTimezoneOffsetInMs(new Date(displayedTimestamp), timezone);
        if (timezoneOffset === null) {
            return null;
        }

        return new Date(displayedTimestamp - timezoneOffset);
    },
};
