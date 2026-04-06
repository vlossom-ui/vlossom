import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { recordStep, textResponse } from "../utils/mcp-response.js";
import { resolveComponent } from "../utils/component-resolution.js";
import { childRefToKey } from "../utils/naming.js";


/**
 * StyleSet의 빈 스캐폴드 코드를 생성합니다.
 * LLM이 requirements를 해석해 채워넣을 수 있도록 모든 가능한 슬롯을 노출합니다.
 */
function buildBlankTemplate(
    componentName: string,
    variablesKeys: string[],
    hasComponent: boolean,
    childRefs: string[],
): string {
    const varName =
        componentName.charAt(0).toLowerCase() + componentName.slice(1) + "StyleSet";

    const lines: string[] = [];
    lines.push(`const ${varName}: ${componentName}StyleSet = {`);

    if (variablesKeys.length > 0) {
        lines.push("  variables: {");
        for (const key of variablesKeys) {
            lines.push(`    // ${key}: '',`);
        }
        lines.push("  },");
    }

    if (hasComponent) {
        lines.push("  component: {");
        lines.push("    // Add direct CSSProperties overrides here");
        lines.push("    // e.g. backgroundColor: 'red', padding: '2rem'");
        lines.push("  },");
    }

    for (const ref of childRefs) {
        const key = childRefToKey(ref);
        lines.push(`  ${key}: {`);
        lines.push(`    // Customize the nested ${key} component (${ref})`);
        lines.push("  },");
    }

    lines.push("}");
    return lines.join("\n");
}

/** StyleSet 분류 가이드 — 정적 텍스트, G1 준수 */
const CLASSIFICATION_GUIDE = [
    "variables: CSS custom properties (--vs-*) defined in the component's CSS file. " +
        "Use these for values that should be themeable at runtime or inherited by child elements. " +
        "Only properties listed in the component's StyleSet.variables interface are available here.",

    "component (CSSProperties): Direct inline style applied to the root element. " +
        "Use this for one-off instance overrides — e.g. a specific width, a unique background. " +
        "Accepts any valid CSS property (TypeScript CSSProperties type).",

    "child refs (e.g. loading, wrapper, dimmed): Nested StyleSet objects forwarded to internal sub-components. " +
        "Use the childRef key (e.g. 'loading') to pass a full sub-component StyleSet. " +
        "Check the component's StyleSet interface for available child keys.",

    "Priority rule: variables < user styleSet < additionalStyleSet (from component props). " +
        "component CSSProperties wins over variables when the same CSS property is set in both.",
];

// ---------------------------------------------------------------------------
// Tool registration
// ---------------------------------------------------------------------------

export function registerGenerateStyleSet(server: McpServer): void {
    server.tool(
        "generate_style_set",
        "ALWAYS call get_component before this to get the component's StyleSet interface. " +
            "Call this when the user needs to style a specific Vlossom component using the StyleSet prop. " +
            "Returns the available StyleSet structure (variables, component, child refs) with a blank template and classification guide. " +
            "Then fill the template using the requirements and pass it as :style-set prop.",
        {
            component: z
                .string()
                .describe(
                    'Component name — PascalCase ("VsButton") or kebab-case ("vs-button")',
                ),
            requirements: z
                .string()
                .describe(
                    'Style requirements in plain text — passed through as context. ' +
                    'e.g. "wide padding, red background, small loading spinner"',
                ),
        },
        async ({ component, requirements }) => {
            const start = Date.now();

            const { meta: componentMeta, errorResponse } = resolveComponent(
                component,
                "generate_style_set",
                start,
            );
            if (!componentMeta) return errorResponse!;

            const { styleSet } = componentMeta;
            const variablesKeys = Object.keys(styleSet.variables);
            const childRefs = styleSet.childRefs;

            const blankTemplate = buildBlankTemplate(
                componentMeta.name,
                variablesKeys,
                styleSet.component,
                childRefs,
            );

            const usageExample =
                `// Inline object\n` +
                `<${componentMeta.kebabName} :style-set="${componentMeta.name.charAt(0).toLowerCase() + componentMeta.name.slice(1)}StyleSet">` +
                `...</${componentMeta.kebabName}>\n\n` +
                `// Or as a typed const\n` +
                `const ${componentMeta.name.charAt(0).toLowerCase() + componentMeta.name.slice(1)}StyleSet: ${componentMeta.name}StyleSet = { ... }`;

            const stepMeta = recordStep(
                "generate_style_set",
                `StyleSet: ${componentMeta.name}`,
                Date.now() - start,
            );

            return textResponse(
                {
                    component: componentMeta.name,
                    requirements,
                    availableVariables: variablesKeys,
                    supportsComponent: styleSet.component,
                    childRefs: childRefs.map((ref) => ({
                        key: childRefToKey(ref),
                        type: ref,
                    })),
                    blankTemplate,
                    classificationGuide: CLASSIFICATION_GUIDE,
                    styleSetInterface: styleSet.raw,
                    usageExample,
                    next_action: "get_css_tokens",
                    next_action_message:
                        "Call get_css_tokens to find --vs-* design tokens to use as variable values.",
                },
                stepMeta,
            );
        },
    );
}
