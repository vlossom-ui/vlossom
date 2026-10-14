import JSON5 from 'json5';

export type StyleSetValue = Record<string, Record<string, unknown>>;
export type StyleSetInputError = 'syntax' | 'not-object' | 'unknown-component' | 'not-style-object';
export type StyleSetInput =
    | { ok: true; value: StyleSetValue | undefined }
    | { ok: false; error: StyleSetInputError; detail: string };

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// README의 style-set 예제가 JS 객체 문법이라서 JSON5로 읽는다. 입력을 코드로 실행하지 않는다.
export function parseStyleSet(
    source: string,
    components: readonly string[],
    aliases: Readonly<Record<string, string>> = {},
): StyleSetInput {
    if (!source.trim()) {
        return { ok: true, value: undefined };
    }

    let parsed: unknown;
    try {
        parsed = JSON5.parse(source);
    } catch (error) {
        return { ok: false, error: 'syntax', detail: (error as Error).message };
    }

    if (!isPlainObject(parsed)) {
        return { ok: false, error: 'not-object', detail: '' };
    }
    const unknown = Object.keys(parsed).filter((key) => !components.includes(key));
    if (unknown.length > 0) {
        const detail = unknown.map((key) => (aliases[key] ? `${key} → ${aliases[key]}` : key)).join(', ');
        return { ok: false, error: 'unknown-component', detail };
    }
    const invalid = Object.keys(parsed).filter((key) => !isPlainObject(parsed[key]));
    if (invalid.length > 0) {
        return { ok: false, error: 'not-style-object', detail: invalid.join(', ') };
    }
    return { ok: true, value: parsed as StyleSetValue };
}
