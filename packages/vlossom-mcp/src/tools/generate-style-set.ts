import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getComponentMeta } from "../services/meta-registry.js";
import { recordStep, textResponse } from "../utils/mcp-response.js";
import type { StyleSetMeta } from "../types/meta.js";

// ---------------------------------------------------------------------------
// Keyword → CSS property mapping helpers
// ---------------------------------------------------------------------------

interface StyleEntry {
    target: "variables" | "component";
    key: string;
    value: string;
    reason: string;
}

const KEYWORD_MAP: Array<{
    patterns: string[];
    target: "variables" | "component";
    key: string;
    sampleValue: string;
}> = [
    {
        patterns: ["padding", "넓은", "여백", "wide"],
        target: "variables",
        key: "padding",
        sampleValue: "1rem 2rem",
    },
    {
        patterns: ["background", "배경", "빨간", "red", "blue", "파란", "색상", "color", "bg"],
        target: "component",
        key: "backgroundColor",
        sampleValue: "var(--vs-comp-bg)",
    },
    {
        patterns: ["border", "테두리", "outline"],
        target: "variables",
        key: "border",
        sampleValue: "1px solid var(--vs-line-color)",
    },
    {
        patterns: ["radius", "둥근", "round", "rounded"],
        target: "variables",
        key: "borderRadius",
        sampleValue: "0.5rem",
    },
    {
        patterns: ["width", "너비", "가로"],
        target: "variables",
        key: "width",
        sampleValue: "100%",
    },
    {
        patterns: ["height", "높이", "세로"],
        target: "variables",
        key: "height",
        sampleValue: "2.5rem",
    },
    {
        patterns: ["color", "색상", "font-color", "fontcolor", "글자색", "텍스트색"],
        target: "variables",
        key: "fontColor",
        sampleValue: "var(--vs-comp-font)",
    },
    {
        patterns: ["opacity", "투명", "transparent"],
        target: "variables",
        key: "opacity",
        sampleValue: "0.8",
    },
    {
        patterns: ["shadow", "그림자", "box-shadow"],
        target: "variables",
        key: "boxShadow",
        sampleValue: "0 2px 8px rgba(0,0,0,0.12)",
    },
    {
        patterns: ["gap", "간격", "spacing"],
        target: "variables",
        key: "gap",
        sampleValue: "0.5rem",
    },
    {
        patterns: ["font-size", "fontsize", "글자크기", "size"],
        target: "variables",
        key: "fontSize",
        sampleValue: "1rem",
    },
    {
        patterns: ["font-weight", "fontweight", "bold", "굵기"],
        target: "variables",
        key: "fontWeight",
        sampleValue: "600",
    },
    {
        patterns: ["z-index", "zindex", "레이어"],
        target: "variables",
        key: "zIndex",
        sampleValue: "10",
    },
];

/**
 * requirements 문자열에서 관련 StyleEntry 배열을 추출합니다.
 * variables에 노출된 속성은 variables로, 나머지는 component로 분류합니다.
 */
function extractStyleEntries(
    requirements: string,
    styleSetMeta: StyleSetMeta,
): StyleEntry[] {
    const lower = requirements.toLowerCase();
    const entries: StyleEntry[] = [];
    const seenKeys = new Set<string>();

    for (const mapping of KEYWORD_MAP) {
        const matched = mapping.patterns.some((p) => lower.includes(p));
        if (!matched) continue;
        if (seenKeys.has(mapping.key)) continue;

        // variables에 선언된 속성이면 variables로, 아니면 component로
        const isInVariables = mapping.key in styleSetMeta.variables;
        const target = isInVariables ? "variables" : mapping.target;

        // backgroundColor는 변수에 없으면 항상 component
        const finalTarget =
            mapping.key === "backgroundColor" ? "component" : target;

        let reason: string;
        if (finalTarget === "variables") {
            reason = `${mapping.key} → variables: This component exposes --vs-*-${mapping.key} as a CSS custom property, making it themeable at runtime.`;
        } else {
            reason = `${mapping.key} → component (CSSProperties): This is a one-off override for this instance, applied directly to the root element.`;
        }

        entries.push({
            target: finalTarget,
            key: mapping.key,
            value: mapping.sampleValue,
            reason,
        });
        seenKeys.add(mapping.key);
    }

    return entries;
}

/**
 * childRef 이름(예: "VsLoadingStyleSet")에서 prop 키를 추출합니다.
 * "VsLoadingStyleSet" → "loading"
 */
function childRefToKey(ref: string): string {
    // "VsLoadingStyleSet" → remove "Vs" prefix and "StyleSet" suffix → "Loading" → lowercase first char
    const withoutVs = ref.startsWith("Vs") ? ref.slice(2) : ref;
    const withoutStyleSet = withoutVs.endsWith("StyleSet")
        ? withoutVs.slice(0, -8)
        : withoutVs;
    return withoutStyleSet.charAt(0).toLowerCase() + withoutStyleSet.slice(1);
}

/**
 * StyleSet 객체 코드 문자열을 생성합니다.
 */
function buildStyleSetCode(
    componentName: string,
    entries: StyleEntry[],
    styleSetMeta: StyleSetMeta,
): string {
    const varName =
        componentName.charAt(0).toLowerCase() + componentName.slice(1) + "StyleSet";

    const variablesEntries = entries.filter((e) => e.target === "variables");
    const componentEntries = entries.filter((e) => e.target === "component");

    const lines: string[] = [];
    lines.push(`const ${varName} = {`);

    // variables 섹션
    if (variablesEntries.length > 0) {
        lines.push("  variables: {");
        for (const entry of variablesEntries) {
            lines.push(`    ${entry.key}: '${entry.value}',`);
        }
        lines.push("  },");
    }

    // component 섹션 (항상 포함)
    if (componentEntries.length > 0) {
        lines.push("  component: {");
        for (const entry of componentEntries) {
            lines.push(`    ${entry.key}: '${entry.value}',`);
        }
        lines.push("  },");
    } else if (styleSetMeta.component) {
        lines.push("  component: {");
        lines.push("    // Add direct CSSProperties overrides here");
        lines.push("  },");
    }

    // childRefs 섹션
    for (const ref of styleSetMeta.childRefs) {
        const key = childRefToKey(ref);
        lines.push(`  ${key}: {`);
        lines.push(`    // ${ref} — customize the nested ${key} component`);
        lines.push("  },");
    }

    lines.push("}");
    return lines.join("\n");
}

/**
 * 분류 근거 explanation 문자열을 생성합니다.
 */
function buildExplanation(
    entries: StyleEntry[],
    styleSetMeta: StyleSetMeta,
): string {
    const parts: string[] = [];

    for (const entry of entries) {
        parts.push(entry.reason);
    }

    if (styleSetMeta.childRefs.length > 0) {
        for (const ref of styleSetMeta.childRefs) {
            const key = childRefToKey(ref);
            parts.push(
                `${key} → child StyleSet: This component uses ${ref.replace("StyleSet", "")} internally; ` +
                    `pass nested styles via the '${key}' key.`,
            );
        }
    }

    if (parts.length === 0) {
        parts.push(
            "No specific style requirements matched known variables. " +
                "Use the 'component' CSSProperties field for direct inline overrides.",
        );
    }

    return parts.join("\n");
}

/**
 * 사용 예시 코드 문자열을 생성합니다.
 */
function buildUsageExample(
    componentName: string,
    kebabName: string,
): string {
    const varName =
        componentName.charAt(0).toLowerCase() + componentName.slice(1) + "StyleSet";
    const styleSetType = `${componentName}StyleSet`;

    return (
        `// Inline object\n` +
        `<${kebabName} :style-set="${varName}">...</${kebabName}>\n\n` +
        `// Or as a typed ref\n` +
        `const ${varName}: ${styleSetType} = { ... }`
    );
}

// ---------------------------------------------------------------------------
// Tool registration
// ---------------------------------------------------------------------------

export function registerGenerateStyleSet(server: McpServer): void {
    server.tool(
        "generate_style_set",
        "ALWAYS call get_component before this to get the component's StyleSet interface. " +
            "Call this when the user needs to style a specific Vlossom component using the StyleSet prop. " +
            "Returns a correctly structured StyleSet object following the variables/component/child-ref philosophy with explanation. " +
            "Then use the generated styleSet as the :style-set prop value in the component.",
        {
            component: z
                .string()
                .describe(
                    'Component name — PascalCase ("VsButton") or kebab-case ("vs-button")',
                ),
            requirements: z
                .string()
                .describe(
                    'Style requirements in plain text, e.g. "wide padding, red background, small loading spinner"',
                ),
        },
        async ({ component, requirements }) => {
            const start = Date.now();

            const meta = getComponentMeta(component);
            const componentName = meta?.name ?? component;
            const meta_ = recordStep(
                "generate_style_set",
                `StyleSet: ${componentName}`,
                Date.now() - start,
            );

            if (!meta) {
                return textResponse(
                    {
                        error: `Component '${component}' not found. Use list_components to see available components.`,
                        next_action: "list_components",
                        next_action_message:
                            "Component not found. Call list_components to verify the exact name.",
                    },
                    meta_,
                );
            }

            const entries = extractStyleEntries(requirements, meta.styleSet);
            const styleSetCode = buildStyleSetCode(
                meta.name,
                entries,
                meta.styleSet,
            );
            const explanation = buildExplanation(entries, meta.styleSet);
            const usageExample = buildUsageExample(meta.name, meta.kebabName);

            return textResponse(
                {
                    component: meta.name,
                    requirements,
                    styleSetCode,
                    explanation,
                    usageExample,
                    styleSetInterface: meta.styleSet.raw,
                    next_action: "get_css_tokens",
                    next_action_message:
                        "Call get_css_tokens to find --vs-* design tokens to use as variable values.",
                },
                meta_,
            );
        },
    );
}
