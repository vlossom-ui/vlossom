export interface ComponentAdaptationGuide {
    description: string;
    outputShape: string;
    example: (typeName: string) => string;
    rules: string[];
}

export const COMPONENT_ADAPTATION_GUIDES: Record<string, ComponentAdaptationGuide> = {
    VsTable: {
        description:
            "Map interface fields to the columns prop array. Each field becomes one column definition.",
        outputShape: "{ key: string; label: string; width?: string; }[]",
        example: (typeName: string) => `// For interface ${typeName} { id: number; name: string; email: string }
const columns = [
  { key: 'id', label: 'ID', width: '80px' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
]
// Usage:
<vs-table :columns="columns" :items="users" />`,
        rules: [
            "Each field in the interface maps to one column object",
            "key must match the exact field name",
            "label is the display header (humanize the field name)",
            "Add width for ID/short fields, omit for text fields",
            "For boolean fields, consider using a slot for custom rendering",
        ],
    },
    VsSelect: {
        description:
            "Map interface instances to the options prop array with value/label pairs.",
        outputShape: "{ value: unknown; label: string; }[]",
        example: (typeName: string) => `// For interface ${typeName} { id: number; name: string }
const options = items.map(item => ({
  value: item.id,    // unique identifier
  label: item.name,  // display text
}))
// Usage:
<vs-select v-model="selected" :options="options" />`,
        rules: [
            "value should be the unique identifier field (id, code, key)",
            "label should be the human-readable display field (name, title, label)",
            "If the interface has no obvious display field, combine multiple fields: `${item.firstName} ${item.lastName}`",
            "For enum-like types, map each variant directly",
        ],
    },
    VsCheckboxSet: {
        description:
            "Map interface instances to the options prop array similar to VsSelect.",
        outputShape: "{ value: unknown; label: string; }[]",
        example: (typeName: string) => `// For interface ${typeName} { id: string; name: string }
const options = items.map(item => ({
  value: item.id,
  label: item.name,
}))
// Usage:
<vs-checkbox-set v-model="selected" :options="options" />`,
        rules: [
            "Same mapping pattern as VsSelect",
            "value holds what gets stored in v-model array on selection",
            "Multiple selection is the default behavior",
        ],
    },
    VsRadio: {
        description:
            "Map to radioOptions for individual radios or use VsRadioSet with options prop.",
        outputShape: "{ value: unknown; label: string; }[]",
        example: (typeName: string) => `// For type ${typeName} = 'active' | 'inactive' | 'pending'
// Use VsRadioSet with options:
const options = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
]
<vs-radio-set v-model="status" :options="options" />`,
        rules: [
            "For enum/union types, each variant becomes one option",
            "For interface arrays, same as VsSelect mapping",
        ],
    },
    VsPagination: {
        description:
            "Map paginated API response fields to VsPagination props.",
        outputShape: "{ total: number; page: number; pageSize: number }",
        example: (typeName: string) => `// For interface ${typeName} { total: number; items: unknown[]; page: number; size: number }
// Map to VsPagination:
<vs-pagination
  v-model="currentPage"
  :total="response.total"
  :page-size="response.size"
/>`,
        rules: [
            "total = total record count from API",
            "VsPagination manages current page via v-model",
            "pageSize = items per page",
        ],
    },
};
