import type { TimezoneOption } from './types';

export const DEFAULT_TIMEZONE_OPTIONS: TimezoneOption[] = [
    { value: 'Etc/UTC', label: 'Etc/UTC (UTC+00:00)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (UTC-08:00 / -07:00 DST)' },
    { value: 'America/New_York', label: 'New York (UTC-05:00 / -04:00 DST)' },
    { value: 'Europe/London', label: 'London (UTC+00:00 / +01:00 DST)' },
    { value: 'Europe/Paris', label: 'Paris (UTC+01:00 / +02:00 DST)' },
    { value: 'Asia/Dubai', label: 'Dubai (UTC+04:00)' },
    { value: 'Asia/Kolkata', label: 'Kolkata (UTC+05:30)' },
    { value: 'Asia/Shanghai', label: 'Shanghai (UTC+08:00)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (UTC+09:00)' },
    { value: 'Asia/Seoul', label: 'Seoul (UTC+09:00)' },
    { value: 'Australia/Sydney', label: 'Sydney (UTC+10:00 / +11:00 DST)' },
    { value: 'Pacific/Auckland', label: 'Auckland (UTC+12:00 / +13:00 DST)' },
];
