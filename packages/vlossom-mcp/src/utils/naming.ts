/**
 * PascalCase 문자열의 첫 글자를 소문자로 변환합니다.
 * "VsButton" → "vsButton"
 */
export function toCamelCase(pascalCase: string): string {
    return pascalCase.charAt(0).toLowerCase() + pascalCase.slice(1);
}

/**
 * StyleSet childRef 이름에서 prop 키를 추출합니다.
 * "VsLoadingStyleSet" → "loading"
 * "VsInputWrapperStyleSet" → "inputWrapper"
 */
export function childRefToKey(ref: string): string {
    const withoutVs = ref.startsWith("Vs") ? ref.slice(2) : ref;
    const withoutStyleSet = withoutVs.endsWith("StyleSet")
        ? withoutVs.slice(0, -8)
        : withoutVs;
    return toCamelCase(withoutStyleSet);
}
