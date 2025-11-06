import { COLORS } from '@/declaration';

export const colorScheme = {
    control: 'select' as any,
    options: COLORS,
};

// Model argTypes
export const modelValueArgType = { control: false as any, table: { category: 'Model' } };
export const changedArgType = { control: 'boolean' as any, table: { category: 'Model' } };
export const validArgType = { control: 'boolean' as any, table: { category: 'Model' } };
export const modelModifiersArgType = { control: 'object' as any, table: { category: 'Model' } };

// Common Props argTypes
export const labelArgType = { control: 'text' as any, table: { category: 'Common Props' } };
export const noLabelArgType = { control: 'boolean' as any, table: { category: 'Common Props' } };
export const disabledArgType = { control: 'boolean' as any, table: { category: 'Common Props' } };
export const readonlyArgType = { control: 'boolean' as any, table: { category: 'Common Props' } };
export const hiddenArgType = { control: 'boolean' as any, table: { category: 'Common Props' } };
export const requiredArgType = { control: 'boolean' as any, table: { category: 'Common Props' } };
export const smallArgType = { control: 'boolean' as any, table: { category: 'Common Props' } };
export const stateArgType = {
    control: 'select' as any,
    options: ['idle', 'success', 'error', 'info', 'warning'],
    table: { category: 'Common Props' },
};

// Validation argTypes
export const minArgType = { control: 'number' as any, table: { category: 'Validation' } };
export const maxArgType = { control: 'number' as any, table: { category: 'Validation' } };
export const rulesArgType = { control: 'object' as any, table: { category: 'Validation' } };
export const noDefaultRulesArgType = { control: 'boolean' as any, table: { category: 'Validation' } };

// Message argTypes
export const messagesArgType = { control: 'object' as any, table: { category: 'Message' } };
export const noMessagesArgType = { control: 'boolean' as any, table: { category: 'Message' } };

// Layout argTypes
export const widthArgType = { control: 'text' as any, table: { category: 'Layout' } };
export const gridArgType = { control: 'text' as any, table: { category: 'Layout' } };

// Style argTypes
export const styleSetArgType = { control: 'object' as any, table: { category: 'Style' } };

// Native Props argTypes
export const idArgType = { control: 'text' as any, table: { category: 'Native Props' } };
export const nameArgType = { control: 'text' as any, table: { category: 'Native Props' } };

// argTypes 그룹
export const modelArgTypes = {
    modelValue: modelValueArgType,
    changed: changedArgType,
    valid: validArgType,
};

export const commonPropsArgTypes = {
    label: labelArgType,
    noLabel: noLabelArgType,
    disabled: disabledArgType,
    readonly: readonlyArgType,
    hidden: hiddenArgType,
    required: requiredArgType,
    small: smallArgType,
    state: stateArgType,
};

export const validationArgTypes = {
    min: minArgType,
    max: maxArgType,
    rules: rulesArgType,
    noDefaultRules: noDefaultRulesArgType,
};

export const messageArgTypes = {
    messages: messagesArgType,
    noMessages: noMessagesArgType,
};

export const layoutArgTypes = {
    width: widthArgType,
    grid: gridArgType,
};

export const styleArgTypes = {
    styleSet: styleSetArgType,
};

export const nativePropsArgTypes = {
    id: idArgType,
    name: nameArgType,
};
