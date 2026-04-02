import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getAllComponentsMeta } from "../services/meta-registry.js";
import { resetSession, recordStep, textResponse } from "../utils/mcp-response.js";
import type { ComponentMeta } from "../types/meta.js";

const STOP_WORDS = new Set(["a", "an", "the", "for", "with", "and", "or", "to", "of", "in", "that", "is", "are"]);

const MAX_RESULTS = 8;

/** 키워드 → 컴포넌트 이름 매핑 */
const HEURISTIC_MAP: Record<string, string[]> = {
    form: ["VsForm", "VsInput", "VsButton"],
    login: ["VsForm", "VsInput", "VsButton"],
    signup: ["VsForm", "VsInput", "VsButton"],
    register: ["VsForm", "VsInput", "VsButton"],
    submit: ["VsForm", "VsInput", "VsButton"],
    table: ["VsTable", "VsPagination"],
    list: ["VsTable", "VsPagination"],
    grid: ["VsTable", "VsPagination"],
    data: ["VsTable", "VsPagination"],
    upload: ["VsFileDrop"],
    file: ["VsFileDrop"],
    drag: ["VsFileDrop"],
    drop: ["VsFileDrop"],
    modal: ["VsModal"],
    dialog: ["VsModal"],
    popup: ["VsModal"],
    drawer: ["VsDrawer"],
    sidebar: ["VsDrawer"],
    panel: ["VsDrawer"],
    toast: ["VsToast"],
    notification: ["VsToast"],
    alert: ["VsToast"],
    loading: ["VsLoading", "VsSkeleton"],
    spinner: ["VsLoading", "VsSkeleton"],
    skeleton: ["VsLoading", "VsSkeleton"],
    select: ["VsSelect"],
    dropdown: ["VsSelect"],
    choose: ["VsSelect"],
    option: ["VsSelect"],
    search: ["VsSearchInput"],
    tab: ["VsTabs"],
    tabs: ["VsTabs"],
    pagination: ["VsPagination"],
    page: ["VsPagination"],
    paging: ["VsPagination"],
    step: ["VsSteps", "VsProgress"],
    wizard: ["VsSteps", "VsProgress"],
    progress: ["VsSteps", "VsProgress"],
    image: ["VsImage", "VsAvatar"],
    photo: ["VsImage", "VsAvatar"],
    avatar: ["VsImage", "VsAvatar"],
    checkbox: ["VsCheckbox"],
    check: ["VsCheckbox"],
    multi: ["VsCheckbox"],
    radio: ["VsRadio"],
    switch: ["VsSwitch", "VsToggle"],
    toggle: ["VsSwitch", "VsToggle"],
    input: ["VsInput"],
    text: ["VsInput"],
    field: ["VsInput"],
    textarea: ["VsTextarea"],
    multiline: ["VsTextarea"],
    paragraph: ["VsTextarea"],
    layout: ["VsLayout", "VsHeader", "VsFooter"],
    header: ["VsLayout", "VsHeader", "VsFooter"],
    footer: ["VsLayout", "VsHeader", "VsFooter"],
    accordion: ["VsAccordion"],
    collapse: ["VsAccordion"],
    expand: ["VsAccordion"],
    chip: ["VsChip"],
    tag: ["VsChip"],
    badge: ["VsChip"],
    tooltip: ["VsTooltip"],
    hint: ["VsTooltip"],
    help: ["VsTooltip"],
    validation: ["VsForm", "VsInput", "VsMessage"],
    rule: ["VsForm", "VsInput", "VsMessage"],
    validate: ["VsForm", "VsInput", "VsMessage"],
    password: ["VsInput", "VsForm", "VsButton"],
    email: ["VsInput", "VsForm", "VsButton"],
    auth: ["VsInput", "VsForm", "VsButton"],
};

function extractKeywords(useCase: string): string[] {
    return useCase
        .toLowerCase()
        .split(/[\s,./]+/)
        .map((w) => w.replace(/[^a-z0-9]/g, ""))
        .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

function searchByKeyword(all: ComponentMeta[], keyword: string): ComponentMeta[] {
    return all.filter((component) => {
        if (component.name.toLowerCase().includes(keyword)) return true;
        if (component.kebabName.toLowerCase().includes(keyword)) return true;
        if (component.description.toLowerCase().includes(keyword)) return true;
        return component.props.some(
            (prop) => prop.name.toLowerCase().includes(keyword) || prop.description.toLowerCase().includes(keyword)
        );
    });
}

function buildReasoning(useCase: string, matchedNames: string[], components: ComponentMeta[]): string {
    if (components.length === 0) {
        return `No components matched for use case: '${useCase}'.`;
    }

    const nameToMeta = new Map(components.map((c) => [c.name, c]));
    const descriptions = matchedNames
        .map((name) => nameToMeta.get(name))
        .filter((c): c is ComponentMeta => c !== undefined)
        .map((c) => `${c.name} (${c.description})`)
        .join(", ");

    return `Based on '${useCase}' use case: ${descriptions}. Call get_component for each to check props/StyleSet, then generate_component_code.`;
}

export function registerSuggestComponents(server: McpServer): void {
    server.tool(
        "suggest_components",
        "No prerequisite needed. " +
            "Call this when the user describes a use case or feature to build (e.g. 'login form', 'file upload', 'data table') rather than asking about a specific component by name. " +
            "Recommends relevant Vlossom components using keyword and heuristic analysis of the use case description. " +
            "Then call get_component for each result to check props/StyleSet, then generate_component_code.",
        { useCase: z.string().describe("Description of the use case or feature to build (e.g. 'login form', 'file upload feature', 'data table with pagination')") },
        async ({ useCase }) => {
            resetSession();
            const start = Date.now();
            const all = getAllComponentsMeta();
            const keywords = extractKeywords(useCase);

            const orderedNames: string[] = [];
            const seen = new Set<string>();

            const addName = (name: string) => {
                if (!seen.has(name)) {
                    seen.add(name);
                    orderedNames.push(name);
                }
            };

            // 1단계: 휴리스틱 맵 매칭
            for (const keyword of keywords) {
                const heuristicMatches = HEURISTIC_MAP[keyword] ?? [];
                for (const name of heuristicMatches) {
                    addName(name);
                }
            }

            // 2단계: 키워드 기반 메타데이터 검색
            for (const keyword of keywords) {
                const searchMatches = searchByKeyword(all, keyword);
                for (const component of searchMatches) {
                    addName(component.name);
                }
            }

            // 3단계: 최대 8개로 제한
            const limitedNames = orderedNames.slice(0, MAX_RESULTS);

            // 메타데이터 조회
            const nameToMeta = new Map(all.map((c) => [c.name, c]));
            const components = limitedNames
                .map((name) => nameToMeta.get(name))
                .filter((c): c is ComponentMeta => c !== undefined);

            const reasoning = buildReasoning(useCase, limitedNames, components);
            const shortUseCase = useCase.length > 28 ? useCase.slice(0, 25) + '…' : useCase;
            const meta = recordStep("suggest_components", `Suggest: ${shortUseCase}`, Date.now() - start);

            if (components.length === 0) {
                return textResponse({
                    components: [],
                    reasoning,
                    message: `No components matched for use case: '${useCase}'. Try search_components with a more specific keyword.`,
                }, meta);
            }

            return textResponse({
                components,
                reasoning,
                total: components.length,
            }, meta);
        }
    );
}
