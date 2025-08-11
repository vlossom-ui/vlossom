import { COLORS } from '@/declaration';

export function getColorSchemeTemplate(templateStr: string) {
    return COLORS.map((color) => templateStr.replace(/{{\s*color\s*}}/g, color)).join('\n');
}
