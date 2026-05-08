import type { VlossomValidationIssue } from './vlossom-first-validator';

export function buildSummary(issues: VlossomValidationIssue[]): string {
    const errors = issues.filter((issue) => issue.severity === 'error').length;
    const warnings = issues.filter((issue) => issue.severity === 'warning').length;
    if (errors === 0 && warnings === 0) return 'No Vlossom metadata issues found.';
    const parts: string[] = [];
    if (errors > 0) parts.push(`${errors} error${errors > 1 ? 's' : ''}`);
    if (warnings > 0) parts.push(`${warnings} warning${warnings > 1 ? 's' : ''}`);
    return parts.join(', ');
}
