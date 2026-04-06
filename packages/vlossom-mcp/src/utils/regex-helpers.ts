/**
 * 코드 문자열에서 regex 패턴이 매치된 줄 번호들을 반환합니다.
 * g 플래그가 있는 정규식과 함께 사용합니다.
 */
export function findMatchLineNumbers(code: string, pattern: RegExp): number[] {
    const lines: number[] = [];
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(code)) !== null) {
        const before = code.slice(0, match.index);
        lines.push(before.split("\n").length);
    }
    return lines;
}
