import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { recordStep, textResponse } from "../utils/mcp-response.js";

interface ValidationIssue {
    ruleId: string;
    severity: "error" | "warning";
    message: string;
    suggestion: string;
    line?: number;
}

function getLineNumber(code: string, pattern: RegExp): number | undefined {
    const lines = code.split("\n");
    for (let i = 0; i < lines.length; i++) {
        if (pattern.test(lines[i])) {
            return i + 1;
        }
    }
    return undefined;
}

function validateCode(code: string, strict: boolean): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // R01 — Critical: Named import only
    const defaultImportPattern = /import\s+\w+\s+from\s+['"]vlossom['"]/;
    const namespaceImportPattern = /import\s+\*\s+as\s+\w+\s+from\s+['"]vlossom['"]/;
    const componentMapPattern = /import\s*\{[^}]*VlossomComponents[^}]*\}\s*from\s*['"]vlossom['"]/;

    if (defaultImportPattern.test(code)) {
        issues.push({
            ruleId: "R01",
            severity: "error",
            message: "Default import from 'vlossom' is not allowed.",
            suggestion: "Use named imports only: import { VsButton, VsInput } from 'vlossom'",
            line: getLineNumber(code, defaultImportPattern),
        });
    } else if (namespaceImportPattern.test(code)) {
        issues.push({
            ruleId: "R01",
            severity: "error",
            message: "Namespace import (import * as ...) from 'vlossom' is not allowed.",
            suggestion: "Use named imports only: import { VsButton, VsInput } from 'vlossom'",
            line: getLineNumber(code, namespaceImportPattern),
        });
    } else if (componentMapPattern.test(code)) {
        issues.push({
            ruleId: "R01",
            severity: "error",
            message: "Importing VlossomComponents map from 'vlossom' is not allowed.",
            suggestion: "Use named imports only: import { VsButton, VsInput } from 'vlossom'",
            line: getLineNumber(code, componentMapPattern),
        });
    }

    // R03 — Critical: No <style> block
    const styleBlockPattern = /<style[\s>]/i;
    if (styleBlockPattern.test(code)) {
        issues.push({
            ruleId: "R03",
            severity: "error",
            message: "SFC contains a <style> block.",
            suggestion: "Remove the <style> block. All custom styles must go through the :style-set prop on Vlossom components.",
            line: getLineNumber(code, styleBlockPattern),
        });
    }

    // R04 — Critical: No inline style on Vlossom components
    const inlineStylePattern = /<(?:vs-\w+|Vs\w+)[^>]*\sstyle\s*=/g;
    let match: RegExpExecArray | null;
    const inlineStyleLines: number[] = [];
    while ((match = inlineStylePattern.exec(code)) !== null) {
        const before = code.slice(0, match.index);
        inlineStyleLines.push(before.split("\n").length);
    }
    if (inlineStyleLines.length > 0) {
        issues.push({
            ruleId: "R04",
            severity: "error",
            message: "Inline style attribute found on a Vlossom component.",
            suggestion: "Remove the inline style= attribute. Use :style-set prop or CSS tokens instead.",
            line: inlineStyleLines[0],
        });
    }

    // R07 — Critical: <script setup lang="ts">
    const hasScript = /<script/i.test(code);
    if (hasScript) {
        const hasScriptSetup = /<script\s+setup/i.test(code);
        const hasLangTs = /lang\s*=\s*["']ts["']/i.test(code);

        if (!hasScriptSetup) {
            issues.push({
                ruleId: "R07",
                severity: "error",
                message: "Script block is missing the 'setup' attribute.",
                suggestion: "Change <script> to <script setup lang=\"ts\">. Avoid Options API or defineComponent.",
                line: getLineNumber(code, /<script/i),
            });
        }
        if (!hasLangTs) {
            issues.push({
                ruleId: "R07",
                severity: "error",
                message: "Script block is missing lang=\"ts\".",
                suggestion: "Change <script setup> to <script setup lang=\"ts\"> for TypeScript support.",
                line: getLineNumber(code, /<script/i),
            });
        }
    }

    // R08 — Critical: Business logic in component (heuristic)
    const fetchPattern = /\bfetch\s*\(|axios\.|await\s+fetch|this\.\$http/g;
    const fetchMatches: number[] = [];
    let fetchMatch: RegExpExecArray | null;
    while ((fetchMatch = fetchPattern.exec(code)) !== null) {
        const before = code.slice(0, fetchMatch.index);
        fetchMatches.push(before.split("\n").length);
    }
    if (fetchMatches.length > 0) {
        issues.push({
            ruleId: "R08",
            severity: "error",
            message: "API call or data fetching logic detected inside the component.",
            suggestion: "Consider moving API calls to a composable (use{Feature}.ts) or service ({feature}.service.ts).",
            line: fetchMatches[0],
        });
    }

    // R10 — Critical: VsForm without validate pattern
    const hasVsForm = /vs-form|VsForm/i.test(code);
    const hasValidate = /\.validate\s*\(\)/.test(code);
    if (hasVsForm && !hasValidate) {
        issues.push({
            ruleId: "R10",
            severity: "error",
            message: "VsForm is used but formRef.value?.validate() call was not found.",
            suggestion: "Add a ref to VsForm and call formRef.value?.validate() in your submit handler. Pattern: const formRef = useTemplateRef('formRef')",
            line: getLineNumber(code, /vs-form|VsForm/i),
        });
    }

    // R11 — Critical: rules prop type check
    const invalidRulesPattern = /:rules\s*=\s*["'][^"']*["']|:rules\s*=\s*(\w+)(?!\s*[\[(])/g;
    const invalidRulesMatches: number[] = [];
    let rulesMatch: RegExpExecArray | null;
    while ((rulesMatch = invalidRulesPattern.exec(code)) !== null) {
        const before = code.slice(0, rulesMatch.index);
        invalidRulesMatches.push(before.split("\n").length);
    }
    if (invalidRulesMatches.length > 0) {
        issues.push({
            ruleId: "R11",
            severity: "error",
            message: ":rules prop is not bound to an array.",
            suggestion: "Pass an array of validator functions: :rules=\"[requiredRule, emailRule]\". Each function signature: (v: unknown) => string | true",
            line: invalidRulesMatches[0],
        });
    }

    // Strict mode additional checks
    if (strict) {
        // R05 — Warning: Hardcoded colors
        const hardcodedColorPattern = /#[0-9a-fA-F]{3,6}\b|rgb\s*\(|hsl\s*\(/g;
        const colorMatches: number[] = [];
        let colorMatch: RegExpExecArray | null;
        while ((colorMatch = hardcodedColorPattern.exec(code)) !== null) {
            const before = code.slice(0, colorMatch.index);
            colorMatches.push(before.split("\n").length);
        }
        if (colorMatches.length > 0) {
            issues.push({
                ruleId: "R05",
                severity: "warning",
                message: "Hardcoded color value (hex/rgb/hsl) detected.",
                suggestion: "Use color-scheme prop or --vs-* CSS tokens instead of hardcoded colors.",
                line: colorMatches[0],
            });
        }

        // R06 — Warning: Line count
        const lineCount = code.split("\n").length;
        if (lineCount > 200) {
            issues.push({
                ruleId: "R06",
                severity: "warning",
                message: `SFC exceeds 200 lines (current: ${lineCount} lines).`,
                suggestion: "Extract logic to a composable or split into smaller child components.",
            });
        }

        // R13 — Warning: Plugin import
        const pluginImportPattern = /import\s*\{[^}]*\$vs\w+[^}]*\}/;
        if (pluginImportPattern.test(code)) {
            issues.push({
                ruleId: "R13",
                severity: "warning",
                message: "Plugin API ($vsModal, $vsToast, etc.) imported directly.",
                suggestion: "Access plugin APIs via the vlossom plugin instance, not direct imports.",
                line: getLineNumber(code, pluginImportPattern),
            });
        }
    }

    return issues;
}

function buildSummary(issues: ValidationIssue[]): string {
    const errors = issues.filter((i) => i.severity === "error").length;
    const warnings = issues.filter((i) => i.severity === "warning").length;

    if (errors === 0 && warnings === 0) {
        return "✅ No violations found.";
    }

    const parts: string[] = [];
    if (errors > 0) {
        parts.push(`${errors} error${errors > 1 ? "s" : ""}`);
    }
    if (warnings > 0) {
        parts.push(`${warnings} warning${warnings > 1 ? "s" : ""}`);
    }
    return parts.join(", ");
}

export function registerValidateComponentUsage(server: McpServer): void {
    server.tool(
        "validate_component_usage",
        "No prerequisite needed. " +
            "Call this when the user wants to check if their Vue SFC follows Vlossom coding conventions. " +
            "Statically analyzes the code string for rule violations (import style, StyleSet usage, forbidden patterns). " +
            "Then call generate_component_code to get the corrected scaffold if critical violations are found.",
        {
            code: z.string().describe("Raw Vue SFC string to validate"),
            strict: z
                .boolean()
                .optional()
                .default(false)
                .describe(
                    "When true, also check recommended rules (R02, R05, R06, R09, R12, R13, R14). Default: false checks only critical rules."
                ),
        },
        async ({ code, strict }) => {
            const start = Date.now();

            if (!code || code.trim().length === 0) {
                const meta_ = recordStep("validate_component_usage", "Validate SFC", Date.now() - start);
                return textResponse(
                    {
                        valid: true,
                        issues: [],
                        summary: "✅ No violations found.",
                        next_action: "get_component",
                        next_action_message:
                            "Code looks good. Call get_component to explore more components or get_css_tokens for design tokens.",
                    },
                    meta_
                );
            }

            const issues = validateCode(code, strict);
            const hasErrors = issues.some((i) => i.severity === "error");
            const summary = buildSummary(issues);

            const meta_ = recordStep("validate_component_usage", "Validate SFC", Date.now() - start);

            return textResponse(
                {
                    valid: !hasErrors,
                    issues,
                    summary,
                    next_action: hasErrors ? "generate_component_code" : "get_component",
                    next_action_message: hasErrors
                        ? "Critical violations found. Call generate_component_code to get a corrected scaffold following Vlossom conventions."
                        : "Code looks good. Call get_component to explore more components or get_css_tokens for design tokens.",
                },
                meta_
            );
        }
    );
}
