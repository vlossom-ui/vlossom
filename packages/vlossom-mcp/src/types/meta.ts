/**
 * 컴포넌트 전체 메타데이터 타입 정의
 * Phase 0.3.0: rich metadata pipeline
 */

export interface ComponentMeta {
    /** PascalCase 컴포넌트 이름 (예: "VsButton") */
    name: string;
    /** kebab-case 컴포넌트 이름 (예: "vs-button") */
    kebabName: string;
    /** 컴포넌트 기능에 대한 한 줄 설명 */
    description: string;
    /** 이 컴포넌트를 처음 사용할 수 있는 최소 버전 (예: "2.0.0+") */
    availableVersion: string;
    /** 컴포넌트가 허용하는 props 목록 */
    props: PropMeta[];
    /** styleSet prop의 타입 구조 정보 */
    styleSet: StyleSetMeta;
    /** 컴포넌트가 emit하는 이벤트 목록 */
    events: EventMeta[];
    /** 컴포넌트가 지원하는 slot 목록 */
    slots: SlotMeta[];
    /** expose를 통해 노출되는 메서드 목록 */
    methods: MethodMeta[];
}

export interface PropMeta {
    /** prop 이름 (camelCase, 예: "colorScheme") */
    name: string;
    /** TypeScript 타입 문자열 (예: "string | ColorScheme") */
    type: string;
    /** 기본값 설명 문자열 (예: "undefined", "'md'") */
    default: string;
    /** 필수 prop 여부 */
    required: boolean;
    /** prop 역할 및 사용법 설명 */
    description: string;
}

export interface StyleSetMeta {
    /** variables 객체 내부 각 속성명 → TypeScript 타입 문자열 매핑 */
    variables: Record<string, string>;
    /** styleSet에 CSSProperties 타입의 component 속성이 있는지 여부 */
    component: boolean;
    /** 이 styleSet이 참조하는 하위 컴포넌트 StyleSet 이름 목록 (예: ["VsLoadingStyleSet"]) */
    childRefs: string[];
    /** README에서 추출한 원본 TypeScript 인터페이스 문자열 */
    raw: string;
}

export interface EventMeta {
    /** 이벤트 이름 (예: "update:modelValue") */
    name: string;
    /** emit 시 전달되는 payload의 타입 문자열 (예: "string | null") */
    payload: string;
    /** 이벤트가 발생하는 시점 및 용도 설명 */
    description: string;
}

export interface SlotMeta {
    /** slot 이름 (기본 slot은 "default") */
    name: string;
    /** slot에 삽입할 콘텐츠 유형 및 용도 설명 */
    description: string;
}

export interface MethodMeta {
    /** 메서드 이름 (예: "focus", "blur") */
    name: string;
    /** 매개변수 시그니처 문자열 (없으면 빈 문자열, 예: "index: number") */
    parameters: string;
    /** 메서드 동작 및 사용 시점 설명 */
    description: string;
}
