import { getComponentMeta } from "../services/meta-registry.js";
import { recordStep, textResponse } from "./mcp-response.js";
import type { ComponentMeta } from "../types/meta.js";

interface ResolveSuccess {
    meta: ComponentMeta;
    errorResponse?: never;
}

interface ResolveFailure {
    meta: null;
    errorResponse: ReturnType<typeof textResponse>;
}

type ResolveResult = ResolveSuccess | ResolveFailure;

/**
 * 컴포넌트 이름으로 메타데이터를 조회하고, 없으면 에러 응답을 반환합니다.
 * tool 핸들러의 공통 not-found 패턴을 추출합니다.
 */
export function resolveComponent(
    component: string,
    toolName: string,
    start: number,
): ResolveResult {
    const meta = getComponentMeta(component);
    if (!meta) {
        const stepMeta = recordStep(toolName, `Lookup: ${component}`, Date.now() - start, { summary: "component not found" });
        return {
            meta: null,
            errorResponse: textResponse(
                {
                    error: `Component '${component}' not found. Use list_components to see available components.`,
                    next_actions: [
                        { tool: "list_components", reason: "verify the exact component name" },
                    ],
                },
                stepMeta,
            ),
        };
    }
    return { meta };
}
