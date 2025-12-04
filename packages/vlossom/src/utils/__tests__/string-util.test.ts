import { describe, expect, it } from 'vitest';
import { stringUtil } from '@/utils/string-util';

describe('string-util', () => {
    describe('createID', () => {
        it('기본 크기(10)로 ID를 생성한다', () => {
            const id = stringUtil.createID();
            expect(id).toHaveLength(10);
            expect(/^[A-Za-z]+$/.test(id)).toBe(true);
        });

        it('지정된 크기로 ID를 생성한다', () => {
            const id = stringUtil.createID(5);
            expect(id).toHaveLength(5);
            expect(/^[A-Za-z]+$/.test(id)).toBe(true);
        });

        it('숫자로 시작하지 않는 ID를 생성한다', () => {
            // 여러 번 테스트하여 확률적으로 확인
            for (let i = 0; i < 100; i++) {
                const id = stringUtil.createID();
                expect(/^\d/.test(id)).toBe(false);
            }
        });

        it('매번 다른 ID를 생성한다', () => {
            const id1 = stringUtil.createID();
            const id2 = stringUtil.createID();
            expect(id1).not.toBe(id2);
        });

        it('알파벳 문자만 포함한다', () => {
            const id = stringUtil.createID(20);
            expect(/^[A-Za-z]+$/.test(id)).toBe(true);
        });
    });

    describe('convertToString', () => {
        it('문자열을 그대로 반환한다', () => {
            expect(stringUtil.convertToString('hello')).toBe('hello');
        });

        it('숫자를 문자열로 변환한다', () => {
            expect(stringUtil.convertToString(123)).toBe('123');
            expect(stringUtil.convertToString(0)).toBe('0');
            expect(stringUtil.convertToString(-456)).toBe('-456');
            expect(stringUtil.convertToString(3.14)).toBe('3.14');
        });

        it('boolean을 문자열로 변환한다', () => {
            expect(stringUtil.convertToString(true)).toBe('true');
            expect(stringUtil.convertToString(false)).toBe('false');
        });

        it('객체를 JSON 문자열로 변환한다', () => {
            const obj = { name: 'John', age: 30 };
            expect(stringUtil.convertToString(obj)).toBe(JSON.stringify(obj));
        });

        it('배열을 JSON 문자열로 변환한다', () => {
            const arr = [1, 2, 3];
            expect(stringUtil.convertToString(arr)).toBe(JSON.stringify(arr));
        });

        it('null을 문자열로 변환한다', () => {
            expect(stringUtil.convertToString(null)).toBe('null');
        });

        it('undefined를 문자열로 변환한다', () => {
            expect(stringUtil.convertToString(undefined)).toBe('undefined');
        });
    });

    describe('toStringSize', () => {
        it('숫자를 px 단위 문자열로 변환한다', () => {
            expect(stringUtil.toStringSize(100)).toBe('100px');
            expect(stringUtil.toStringSize(0)).toBe('0px');
        });

        it('소수점이 있는 숫자를 px 단위 문자열로 변환한다', () => {
            expect(stringUtil.toStringSize(10.5)).toBe('10.5px');
            expect(stringUtil.toStringSize(3.14)).toBe('3.14px');
        });

        it('숫자 문자열을 px 단위 문자열로 변환한다', () => {
            expect(stringUtil.toStringSize('100')).toBe('100px');
            expect(stringUtil.toStringSize('50.5')).toBe('50.5px');
        });

        it('이미 단위가 있는 문자열은 그대로 반환한다', () => {
            expect(stringUtil.toStringSize('100px')).toBe('100px');
            expect(stringUtil.toStringSize('50%')).toBe('50%');
            expect(stringUtil.toStringSize('2rem')).toBe('2rem');
            expect(stringUtil.toStringSize('1.5em')).toBe('1.5em');
        });

        it('단위가 없는 숫자 외의 문자열은 그대로 반환한다', () => {
            expect(stringUtil.toStringSize('auto')).toBe('auto');
            expect(stringUtil.toStringSize('inherit')).toBe('inherit');
        });
    });

    describe('parseSizeValue', () => {
        it('숫자를 px 단위로 파싱한다', () => {
            expect(stringUtil.parseSizeValue(100)).toEqual({ value: 100, unit: 'px' });
            expect(stringUtil.parseSizeValue(0)).toEqual({ value: 0, unit: 'px' });
        });

        it('숫자 문자열을 px 단위로 파싱한다', () => {
            expect(stringUtil.parseSizeValue('100')).toEqual({ value: 100, unit: 'px' });
            expect(stringUtil.parseSizeValue('50.5')).toEqual({ value: 50.5, unit: 'px' });
        });

        it('px 단위 문자열을 파싱한다', () => {
            expect(stringUtil.parseSizeValue('100px')).toEqual({ value: 100, unit: 'px' });
            expect(stringUtil.parseSizeValue('50.5px')).toEqual({ value: 50.5, unit: 'px' });
        });

        it('%  단위 문자열을 파싱한다', () => {
            expect(stringUtil.parseSizeValue('50%')).toEqual({ value: 50, unit: '%' });
            expect(stringUtil.parseSizeValue('100%')).toEqual({ value: 100, unit: '%' });
        });

        it('다양한 CSS 단위를 파싱한다', () => {
            expect(stringUtil.parseSizeValue('2rem')).toEqual({ value: 2, unit: 'rem' });
            expect(stringUtil.parseSizeValue('1.5em')).toEqual({ value: 1.5, unit: 'em' });
            expect(stringUtil.parseSizeValue('10vh')).toEqual({ value: 10, unit: 'vh' });
            expect(stringUtil.parseSizeValue('50vw')).toEqual({ value: 50, unit: 'vw' });
        });

        it('음수 값을 파싱한다', () => {
            expect(stringUtil.parseSizeValue(-100)).toEqual({ value: -100, unit: 'px' });
            expect(stringUtil.parseSizeValue('-100')).toEqual({ value: -100, unit: 'px' });
            expect(stringUtil.parseSizeValue('-2rem')).toEqual({ value: -2, unit: 'rem' });
            expect(stringUtil.parseSizeValue('-1.5em')).toEqual({ value: -1.5, unit: 'em' });
            expect(stringUtil.parseSizeValue('-10vh')).toEqual({ value: -10, unit: 'vh' });
            expect(stringUtil.parseSizeValue('-50vw')).toEqual({ value: -50, unit: 'vw' });
        });

        it('소수점이 있는 값을 파싱한다', () => {
            expect(stringUtil.parseSizeValue('3.14px')).toEqual({ value: 3.14, unit: 'px' });
            expect(stringUtil.parseSizeValue('1.5rem')).toEqual({ value: 1.5, unit: 'rem' });
        });

        it('파싱할 수 없는 문자열은 기본값을 반환한다', () => {
            expect(stringUtil.parseSizeValue('auto')).toEqual({ value: 0, unit: '' });
            expect(stringUtil.parseSizeValue('inherit')).toEqual({ value: 0, unit: '' });
            expect(stringUtil.parseSizeValue('invalid')).toEqual({ value: 0, unit: '' });
        });
    });

    describe('toFileSizeFormat', () => {
        it('0 바이트를 포맷한다', () => {
            expect(stringUtil.toFileSizeFormat(0)).toBe('0 Bytes');
        });

        it('바이트 단위를 포맷한다', () => {
            expect(stringUtil.toFileSizeFormat(500)).toBe('500 Bytes');
            expect(stringUtil.toFileSizeFormat(1023)).toBe('1023 Bytes');
        });

        it('KB 단위를 포맷한다', () => {
            expect(stringUtil.toFileSizeFormat(1024)).toBe('1 KB');
            expect(stringUtil.toFileSizeFormat(1536)).toBe('1.5 KB');
            expect(stringUtil.toFileSizeFormat(2048)).toBe('2 KB');
        });

        it('MB 단위를 포맷한다', () => {
            expect(stringUtil.toFileSizeFormat(1048576)).toBe('1 MB'); // 1024 * 1024
            expect(stringUtil.toFileSizeFormat(1572864)).toBe('1.5 MB'); // 1024 * 1024 * 1.5
            expect(stringUtil.toFileSizeFormat(5242880)).toBe('5 MB'); // 1024 * 1024 * 5
        });

        it('GB 단위를 포맷한다', () => {
            expect(stringUtil.toFileSizeFormat(1073741824)).toBe('1 GB'); // 1024^3
            expect(stringUtil.toFileSizeFormat(2147483648)).toBe('2 GB'); // 1024^3 * 2
        });

        it('TB 단위를 포맷한다', () => {
            expect(stringUtil.toFileSizeFormat(1099511627776)).toBe('1 TB'); // 1024^4
        });

        it('소수점 이하 2자리까지 반올림한다', () => {
            expect(stringUtil.toFileSizeFormat(1234567)).toBe('1.18 MB');
            expect(stringUtil.toFileSizeFormat(123456789)).toBe('117.74 MB');
        });
    });

    describe('kebabCase', () => {
        it('camelCase를 kebab-case로 변환한다', () => {
            expect(stringUtil.kebabCase('camelCase')).toBe('camel-case');
            expect(stringUtil.kebabCase('myVariableName')).toBe('my-variable-name');
        });

        it('PascalCase를 kebab-case로 변환한다', () => {
            expect(stringUtil.kebabCase('PascalCase')).toBe('pascal-case');
            expect(stringUtil.kebabCase('MyComponentName')).toBe('my-component-name');
        });

        it('공백이 있는 문자열을 kebab-case로 변환한다', () => {
            expect(stringUtil.kebabCase('hello world')).toBe('hello-world');
            expect(stringUtil.kebabCase('foo bar baz')).toBe('foo-bar-baz');
        });

        it('이미 kebab-case인 문자열은 그대로 반환한다', () => {
            expect(stringUtil.kebabCase('kebab-case')).toBe('kebab-case');
            expect(stringUtil.kebabCase('already-kebab')).toBe('already-kebab');
        });

        it('특수문자가 있는 문자열을 변환한다', () => {
            expect(stringUtil.kebabCase('hello_world')).toBe('hello-world');
            expect(stringUtil.kebabCase('foo.bar')).toBe('foo-bar');
        });
    });
});
