import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getComponentMeta } from "../services/meta-registry.js";
import { recordStep, textResponse } from "../utils/mcp-response.js";

interface ComponentAdaptationGuide {
    description: string;
    outputShape: string;
    example: (typeName: string) => string;
    rules: string[];
}

const COMPONENT_ADAPTATION_GUIDES: Record<string, ComponentAdaptationGuide> = {
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
        outputShape: "{ value: any; label: string; }[]",
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
        outputShape: "{ value: any; label: string; }[]",
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
        outputShape: "{ value: any; label: string; }[]",
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
        example: (typeName: string) => `// For interface ${typeName} { total: number; items: any[]; page: number; size: number }
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

export function registerAdaptTypeToComponent(server: McpServer): void {
    server.tool(
        "adapt_type_to_component",
        "ALWAYS call get_component before this to confirm the target component's props. " +
            "Call this when the user has an existing TypeScript interface and wants to use it with a specific Vlossom component. " +
            "Returns converted component data (e.g. columns array for VsTable, options array for VsSelect) with a usage example. " +
            "Then pass the converted data to generate_component_code for the final scaffold.",
        {
            userType: z
                .string()
                .describe(
                    'TypeScript interface or type definition, e.g. "interface User { id: number; name: string; email: string }"'
                ),
            targetComponent: z
                .string()
                .describe(
                    'Target Vlossom component — PascalCase ("VsTable") or kebab-case ("vs-table")'
                ),
        },
        async ({ userType, targetComponent }) => {
            const start = Date.now();

            const meta = getComponentMeta(targetComponent);
            const componentName = meta ? meta.name : targetComponent;

            const match = userType.match(/(?:interface|type)\s+(\w+)/);
            const userTypeName = match ? match[1] : "YourType";

            const meta_ = recordStep(
                "adapt_type_to_component",
                `Adapt: ${userTypeName} → ${componentName}`,
                Date.now() - start
            );

            if (!meta) {
                return textResponse(
                    {
                        error: `Component '${targetComponent}' not found. Use list_components to see available components.`,
                        next_action: "list_components",
                        next_action_message:
                            "Component not found. Call list_components to verify the exact name.",
                    },
                    meta_
                );
            }

            const guide = COMPONENT_ADAPTATION_GUIDES[componentName];

            if (!guide) {
                return textResponse(
                    {
                        component: componentName,
                        userTypeName,
                        guide:
                            `No specific adaptation guide for ${componentName}. ` +
                            "Review the component's props via get_component, then map your interface fields to the relevant props. " +
                            "Common patterns: array data → items/options prop, single value → modelValue, display config → dedicated prop.",
                        outputShape: "varies",
                        example: "",
                        rules: [],
                        next_action: "generate_component_code",
                        next_action_message:
                            "Now call generate_component_code with the converted data to get the full component scaffold.",
                    },
                    meta_
                );
            }

            return textResponse(
                {
                    component: componentName,
                    userTypeName,
                    guide: guide.description,
                    outputShape: guide.outputShape,
                    example: guide.example(userTypeName),
                    rules: guide.rules,
                    next_action: "generate_component_code",
                    next_action_message:
                        "Now call generate_component_code with the converted data to get the full component scaffold.",
                },
                meta_
            );
        }
    );
}
