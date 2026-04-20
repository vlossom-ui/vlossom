import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { recordStep, textResponse } from "../utils/mcp-response.js";

const GUIDE = {
  installation: {
    title: "Installation",
    steps: [
      "npm install vlossom",
      "// main.ts",
      "import { createApp } from 'vue';",
      "import { createVlossom, VlossomComponents } from 'vlossom';",
      "import 'vlossom/styles';",
      "",
      "const app = createApp(App);",
      "const vlossom = createVlossom({",
      "    components: VlossomComponents, // REQUIRED — register all 50+ components",
      "});",
      "app.use(vlossom);",
      "app.mount('#app');",
    ],
    note: "Vlossom is currently in pre-release (2.0.0-beta.1). `components` is a required option — passing VlossomComponents registers every component. Call get_changelog to check the latest version.",
  },

  configuration: {
    title: "Global Configuration (createVlossom options)",
    options: [
      {
        name: "components",
        required: true,
        description:
          "REQUIRED. Component registry — pass VlossomComponents for all 50+ components, or a partial map for tree-shaking",
      },
      { name: "theme", description: "Set 'light' or 'dark' theme globally" },
      {
        name: "colorScheme",
        description:
          "Define color schemes per component (e.g. { VsButton: 'blue' })",
      },
      {
        name: "styleSet",
        description: "Register named StyleSets for reuse across components",
      },
      {
        name: "radiusRatio",
        description:
          "Scales all component border radii (0 = sharp, 1 = default, 2 = very rounded)",
      },
    ],
    note: "Call get_vlossom_options for full configuration API details. Note: `components` must be provided — createVlossom({}) throws at install time.",
  },

  quickStart: {
    title: "Quick Start — Basic Component Usage",
    example: `<template>
    <vs-page>
        <template #title>My App</template>

        <vs-input v-model="name" label="Name" />
        <vs-button @click="submit" primary>Submit</vs-button>
    </vs-page>
</template>`,
    note: "When `components: VlossomComponents` is passed to createVlossom(), all 50+ components become globally available. No individual imports needed.",
  },

  sellingPoints: {
    title: "Why Vlossom?",
    points: [
      {
        feature: "StyleSet System",
        description:
          "Type-safe styling API with 3-tier merge (base < user < runtime). No CSS-in-JS runtime cost. Define once, reuse everywhere via named StyleSets.",
        learnMore:
          "Call generate_style_set to scaffold a StyleSet for any component.",
      },
      {
        feature: "50+ Production Components",
        description:
          "From VsInput to VsTable (sorting, pagination, drag-and-drop, virtual scroll) to VsDrawer, VsModal, VsTabs — all with consistent API, color schemes, and accessibility.",
        learnMore: "Call list_components to browse all available components.",
      },
      {
        feature: "Built-in Form System",
        description:
          "VsForm propagates validation, disabled, and readonly state to all child inputs. No manual wiring needed.",
        learnMore: "Call get_component with 'VsForm' for full details.",
      },
      {
        feature: "Responsive Layout Primitives",
        description:
          "VsGrid + VsResponsive provide breakpoint-aware 12-column grid without additional CSS frameworks.",
        learnMore: "Call get_component with 'VsGrid' or 'VsResponsive'.",
      },
      {
        feature: "Design Token Control",
        description:
          "40+ CSS custom properties (--vs-*) for theme customization. Override at global or component level.",
        learnMore: "Call get_css_tokens to explore all available tokens.",
      },
    ],
  },

  designGuidance: {
    title: "Design Tips for Better Results",
    tip: "Providing a design reference before generating code significantly improves output quality. If you have a Figma file, use the Figma MCP tools. Otherwise, browse these sites for inspiration:",
    references: [
      {
        name: "Dribbble",
        url: "dribbble.com",
        use: "Search for UI patterns by keyword (e.g. 'dashboard design', 'login form')",
      },
      {
        name: "Behance",
        url: "behance.net",
        use: "Full case studies with layout and typography decisions",
      },
      {
        name: "Mobbin",
        url: "mobbin.com",
        use: "Real-world app screens organized by pattern and flow",
      },
    ],
    defaults:
      "Without a design reference, Vlossom code generation uses: 12-column VsGrid layout, 1.5rem+ spacing, VsBlock for cards, VsDivider for separation, color-scheme prop for visual hierarchy (blue=primary, green=success, red=destructive).",
  },

  mcpCapabilities: {
    title: "What vlossom-mcp Can Do",
    pipelines: [
      {
        name: "Component Discovery",
        flow: "list_components → get_component → get_css_tokens",
        description:
          "Browse all components, inspect props/StyleSet/events, explore CSS tokens.",
      },
      {
        name: "Code Generation",
        flow: "search_components → get_component → generate_component_code",
        description:
          "Find components for your use case, then generate production-ready Vue SFC code with Vlossom coding conventions.",
      },
      {
        name: "Style Customization",
        flow: "get_component → get_css_tokens → generate_style_set",
        description:
          "Understand a component's styling surface, then generate a type-safe StyleSet scaffold.",
      },
      {
        name: "Issue Reporting",
        flow: "check_github_token → report_issue (draft) → report_issue",
        description:
          "Missing a component or found a bug? File a GitHub issue directly from the conversation.",
      },
      {
        name: "Cross-Domain Exploration",
        flow: "get_composables ↔ get_directive",
        description:
          "Discover Vue composables and custom directives that complement component features.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Combinatorial topic generator — domain × pattern × feature
// Produces unique prompts at runtime without a static pool.
// 20 domains × 12 patterns × 15 features = 3,600 combinations
// ---------------------------------------------------------------------------

const DOMAINS = [
  "healthcare",
  "e-commerce",
  "education",
  "fitness",
  "travel",
  "finance",
  "food delivery",
  "music streaming",
  "social media",
  "real estate",
  "project management",
  "HR",
  "logistics",
  "gaming",
  "news media",
  "weather",
  "IoT monitoring",
  "customer support",
  "inventory",
  "analytics",
];

const PATTERNS = [
  "dashboard",
  "settings page",
  "registration form",
  "data table view",
  "detail page",
  "search results page",
  "onboarding wizard",
  "admin panel",
  "landing page",
  "profile page",
  "notification center",
  "report builder",
];

const FEATURES = [
  "with real-time status indicators",
  "with multi-step form validation",
  "with filterable data table and pagination",
  "with drag-and-drop reordering",
  "with modal dialogs and confirmations",
  "with tabs and accordion sections",
  "with responsive grid cards",
  "with toast notifications on actions",
  "with skeleton loading states",
  "with drawer navigation menu",
  "with progress tracking bars",
  "with file upload and preview",
  "with expandable detail rows",
  "with chip-based tag filters",
  "with dark mode support",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickUnique<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

interface TopicSuggestion {
  domain: string;
  pattern: string;
  feature: string;
  prompt: string;
}

function generateTopics(count: number): TopicSuggestion[] {
  const domains = pickUnique(DOMAINS, count);
  return domains.map((domain) => {
    const pattern = pick(PATTERNS);
    const feature = pick(FEATURES);
    return {
      domain,
      pattern,
      feature,
      prompt: `Build a ${domain} ${pattern} ${feature} using Vlossom`,
    };
  });
}

type GuideSection =
  | "all"
  | "install"
  | "config"
  | "quickstart"
  | "selling-points"
  | "design-tips"
  | "mcp-capabilities";

const SECTION_KEY_MAP: Record<
  Exclude<GuideSection, "all">,
  keyof typeof GUIDE
> = {
  install: "installation",
  config: "configuration",
  quickstart: "quickStart",
  "selling-points": "sellingPoints",
  "design-tips": "designGuidance",
  "mcp-capabilities": "mcpCapabilities",
};

function pickGuide(section: GuideSection): Partial<typeof GUIDE> {
  if (section === "all") return GUIDE;
  const key = SECTION_KEY_MAP[section];
  return { [key]: GUIDE[key] } as Partial<typeof GUIDE>;
}

export function registerGetUsageExamples(server: McpServer): void {
  server.tool(
    "get_usage_examples",
    "No prerequisite needed. " +
      "Call this when the user asks how to get started with Vlossom, needs installation instructions, setup guidance, or wants to know what vlossom-mcp can do. " +
      "Returns a Vlossom onboarding guide. Pass `section` to fetch only the relevant part (install, config, quickstart, selling-points, design-tips, mcp-capabilities) instead of the full guide. " +
      "Then call get_changelog / list_components / get_vlossom_options depending on the user's next direction.",
    {
      section: z
        .enum([
          "all",
          "install",
          "config",
          "quickstart",
          "selling-points",
          "design-tips",
          "mcp-capabilities",
        ])
        .optional()
        .default("all")
        .describe(
          "Which section of the guide to return. 'all' (default) returns the full guide; the other keys return only one section for a much smaller response.",
        ),
    },
    ({ section }) => {
      const start = Date.now();
      const tryThese = generateTopics(3);
      const guide = pickGuide(section);
      const label =
        section === "all" ? "Vlossom guide" : `Vlossom guide: ${section}`;
      const meta = recordStep("get_usage_examples", label, Date.now() - start, {
        summary:
          section === "all" ? "guide + 3 topics" : `${section} + 3 topics`,
      });

      return textResponse(
        {
          section,
          guide,
          tryThese: {
            title: "Try These — Example Prompts",
            note: "These are randomly selected. Call this tool again for different suggestions.",
            suggestions: tryThese,
          },
          next_actions: [
            {
              tool: "get_changelog",
              reason: "check the latest version and release notes",
            },
            {
              tool: "list_components",
              reason: "browse all available components",
            },
            {
              tool: "get_vlossom_options",
              reason: "configure Vlossom globally",
            },
          ],
        },
        meta,
      );
    },
  );
}
