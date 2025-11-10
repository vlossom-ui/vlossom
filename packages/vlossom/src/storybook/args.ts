import { COLORS } from '@/declaration';

export const colorScheme = {
    control: 'select' as any,
    options: COLORS,
};

export const modelArgTypes = {
    modelValue: { control: false as any, table: { category: 'Model' } },
    changed: { control: 'boolean' as any, table: { category: 'Model' } },
    valid: { control: 'boolean' as any, table: { category: 'Model' } },
    modelModifiers: { control: 'object' as any, table: { category: 'Model' } },
};

export const inputWrapperPropsArgTypes = {
    disabled: { control: 'boolean' as any, table: { category: 'Input Wrapper Props' } },
    hidden: { control: 'boolean' as any, table: { category: 'Input Wrapper Props' } },
    id: { control: 'text' as any, table: { category: 'Input Wrapper Props' } },
    label: { control: 'text' as any, table: { category: 'Input Wrapper Props' } },
    noLabel: { control: 'boolean' as any, table: { category: 'Input Wrapper Props' } },
    noMessages: { control: 'boolean' as any, table: { category: 'Input Wrapper Props' } },
    required: { control: 'boolean' as any, table: { category: 'Input Wrapper Props' } },
    small: { control: 'boolean' as any, table: { category: 'Input Wrapper Props' } },
};

export const inputPropsArgTypes = {
    messages: { control: 'object' as any, table: { category: 'Input Props' } },
    name: { control: 'text' as any, table: { category: 'Input Props' } },
    noDefaultRules: { control: 'boolean' as any, table: { category: 'Input Props' } },
    placeholder: { control: 'text' as any, table: { category: 'Input Props' } },
    readonly: { control: 'boolean' as any, table: { category: 'Input Props' } },
    rules: { control: 'object' as any, table: { category: 'Input Props' } },
    state: {
        control: 'select' as any,
        options: ['idle', 'success', 'error', 'info', 'warning'],
        table: { category: 'Input Props' },
    },
};

export const inputOptionPropsArgTypes = {
    options: { control: 'object' as any, table: { category: 'Input Option Props' } },
    optionLabel: { control: 'text' as any, table: { category: 'Input Option Props' } },
    optionValue: { control: 'text' as any, table: { category: 'Input Option Props' } },
};

export const validationArgTypes = {
    min: { control: 'number' as any, table: { category: 'Validation' } },
    max: { control: 'number' as any, table: { category: 'Validation' } },
};

export const layoutArgTypes = {
    width: { control: 'text' as any, table: { category: 'Layout' } },
    grid: { control: 'text' as any, table: { category: 'Layout' } },
};

export const styleArgTypes = {
    styleSet: { control: 'object' as any, table: { category: 'Style' } },
};
