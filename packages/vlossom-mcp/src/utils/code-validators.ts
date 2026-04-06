import { findMatchLineNumbers } from "./regex-helpers.js";

export interface ValidationIssue {
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

// R01 — Named import only
function validateImports(code: string): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const defaultImport = /import\s+\w+\s+from\s+['"]vlossom['"]/;
    const namespaceImport = /import\s+\*\s+as\s+\w+\s+from\s+['"]vlossom['"]/;
    const componentMap = /import\s*\{[^}]*VlossomComponents[^}]*\}\s*from\s*['"]vlossom['"]/;

    if (defaultImport.test(code)) {
        issues.push({ ruleId: "R01", severity: "error",
            message: "Default import from 'vlossom' is not allowed.",
            suggestion: "Use named imports only: import { VsButton, VsInput } from 'vlossom'",
            line: getLineNumber(code, defaultImport) });
    } else if (namespaceImport.test(code)) {
        issues.push({ ruleId: "R01", severity: "error",
            message: "Namespace import (import * as ...) from 'vlossom' is not allowed.",
            suggestion: "Use named imports only: import { VsButton, VsInput } from 'vlossom'",
            line: getLineNumber(code, namespaceImport) });
    } else if (componentMap.test(code)) {
        issues.push({ ruleId: "R01", severity: "error",
            message: "Importing VlossomComponents map from 'vlossom' is not allowed.",
            suggestion: "Use named imports only: import { VsButton, VsInput } from 'vlossom'",
            line: getLineNumber(code, componentMap) });
    }
    return issues;
}

// R03 — No <style> block
function validateStyleBlock(code: string): ValidationIssue[] {
    const pattern = /<style[\s>]/i;
    if (!pattern.test(code)) return [];
    return [{ ruleId: "R03", severity: "error",
        message: "SFC contains a <style> block.",
        suggestion: "Remove the <style> block. All custom styles must go through the :style-set prop on Vlossom components.",
        line: getLineNumber(code, pattern) }];
}

// R04 — No inline style on Vlossom components
function validateInlineStyle(code: string): ValidationIssue[] {
    const pattern = /<(?:vs-\w+|Vs\w+)[^>]*\sstyle\s*=/g;
    const lines = findMatchLineNumbers(code, pattern);
    if (lines.length === 0) return [];
    return [{ ruleId: "R04", severity: "error",
        message: "Inline style attribute found on a Vlossom component.",
        suggestion: "Remove the inline style= attribute. Use :style-set prop or CSS tokens instead.",
        line: lines[0] }];
}

// R07 — <script setup lang="ts">
function validateScriptSetup(code: string): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    if (!/<script/i.test(code)) return issues;

    if (!/<script\s+setup/i.test(code)) {
        issues.push({ ruleId: "R07", severity: "error",
            message: "Script block is missing the 'setup' attribute.",
            suggestion: 'Change <script> to <script setup lang="ts">. Avoid Options API or defineComponent.',
            line: getLineNumber(code, /<script/i) });
    }
    if (!/lang\s*=\s*["']ts["']/i.test(code)) {
        issues.push({ ruleId: "R07", severity: "error",
            message: 'Script block is missing lang="ts".',
            suggestion: 'Change <script setup> to <script setup lang="ts"> for TypeScript support.',
            line: getLineNumber(code, /<script/i) });
    }
    return issues;
}

// R08 — Business logic in component (heuristic)
function validateFetchPatterns(code: string): ValidationIssue[] {
    const pattern = /\bfetch\s*\(|axios\.|await\s+fetch|this\.\$http/g;
    const lines = findMatchLineNumbers(code, pattern);
    if (lines.length === 0) return [];
    return [{ ruleId: "R08", severity: "error",
        message: "API call or data fetching logic detected inside the component.",
        suggestion: "Consider moving API calls to a composable (use{Feature}.ts) or service ({feature}.service.ts).",
        line: lines[0] }];
}

// R10 — VsForm without validate pattern
function validateFormUsage(code: string): ValidationIssue[] {
    if (!/vs-form|VsForm/i.test(code)) return [];
    if (/\.validate\s*\(\)/.test(code)) return [];
    return [{ ruleId: "R10", severity: "error",
        message: "VsForm is used but formRef.value?.validate() call was not found.",
        suggestion: "Add a ref to VsForm and call formRef.value?.validate() in your submit handler. Pattern: const formRef = useTemplateRef('formRef')",
        line: getLineNumber(code, /vs-form|VsForm/i) }];
}

// R11 — rules prop bound to array
function validateRulesProp(code: string): ValidationIssue[] {
    const pattern = /:rules\s*=\s*["'][^"']*["']|:rules\s*=\s*(\w+)(?!\s*[\[(])/g;
    const lines = findMatchLineNumbers(code, pattern);
    if (lines.length === 0) return [];
    return [{ ruleId: "R11", severity: "error",
        message: ":rules prop is not bound to an array.",
        suggestion: 'Pass an array of validator functions: :rules="[requiredRule, emailRule]". Each function signature: (v: unknown) => string | true',
        line: lines[0] }];
}

// R05 — Hardcoded colors (strict mode)
function validateHardcodedColors(code: string): ValidationIssue[] {
    const pattern = /#[0-9a-fA-F]{3,6}\b|rgb\s*\(|hsl\s*\(/g;
    const lines = findMatchLineNumbers(code, pattern);
    if (lines.length === 0) return [];
    return [{ ruleId: "R05", severity: "warning",
        message: "Hardcoded color value (hex/rgb/hsl) detected.",
        suggestion: "Use color-scheme prop or --vs-* CSS tokens instead of hardcoded colors.",
        line: lines[0] }];
}

// R06 — Line count (strict mode)
function validateLineCount(code: string): ValidationIssue[] {
    const lineCount = code.split("\n").length;
    if (lineCount <= 200) return [];
    return [{ ruleId: "R06", severity: "warning",
        message: `SFC exceeds 200 lines (current: ${lineCount} lines).`,
        suggestion: "Extract logic to a composable or split into smaller child components." }];
}

// R13 — Plugin import (strict mode)
function validatePluginImport(code: string): ValidationIssue[] {
    const pattern = /import\s*\{[^}]*\$vs\w+[^}]*\}/;
    if (!pattern.test(code)) return [];
    return [{ ruleId: "R13", severity: "warning",
        message: "Plugin API ($vsModal, $vsToast, etc.) imported directly.",
        suggestion: "Access plugin APIs via the vlossom plugin instance, not direct imports.",
        line: getLineNumber(code, pattern) }];
}

/** 코드에서 Vlossom 규칙 위반을 검사합니다. */
export function validateCode(code: string, strict: boolean): ValidationIssue[] {
    const issues = [
        ...validateImports(code),
        ...validateStyleBlock(code),
        ...validateInlineStyle(code),
        ...validateScriptSetup(code),
        ...validateFetchPatterns(code),
        ...validateFormUsage(code),
        ...validateRulesProp(code),
    ];

    if (strict) {
        issues.push(
            ...validateHardcodedColors(code),
            ...validateLineCount(code),
            ...validatePluginImport(code),
        );
    }

    return issues;
}

/** 이슈 목록에서 요약 문자열을 생성합니다. */
export function buildSummary(issues: ValidationIssue[]): string {
    const errors = issues.filter((i) => i.severity === "error").length;
    const warnings = issues.filter((i) => i.severity === "warning").length;
    if (errors === 0 && warnings === 0) return "✅ No violations found.";
    const parts: string[] = [];
    if (errors > 0) parts.push(`${errors} error${errors > 1 ? "s" : ""}`);
    if (warnings > 0) parts.push(`${warnings} warning${warnings > 1 ? "s" : ""}`);
    return parts.join(", ");
}
