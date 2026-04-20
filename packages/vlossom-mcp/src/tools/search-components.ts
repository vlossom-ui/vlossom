import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getAllComponentsMeta } from "../services/meta-registry.js";
import {
  recordStep,
  resetSession,
  textResponse,
} from "../utils/mcp-response.js";
import { SYNONYM_MAP } from "../data/search-synonyms.js";
import type { ComponentMeta, ComponentSummary } from "../types/meta.js";

/**
 * ComponentMeta → ComponentSummary 변환.
 * search 응답을 경량화해 get_component와의 역할을 분리한다 (G3 단일 책임).
 */
function toSummary(meta: ComponentMeta): ComponentSummary {
  const hasVModel =
    meta.props.some((p) => p.name === "modelValue") ||
    meta.events.some((e) => e.name === "update:modelValue");

  return {
    name: meta.name,
    kebabName: meta.kebabName,
    description: meta.description,
    availableVersion: meta.availableVersion,
    propsCount: meta.props.length,
    hasVModel,
    styleSetChildRefs: meta.styleSet.childRefs,
  };
}

const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "for",
  "with",
  "and",
  "or",
  "to",
  "of",
  "in",
  "that",
  "is",
  "are",
]);

const MAX_RESULTS = 8;

/** Expands a query string by appending synonym keywords. */
function expandQuery(query: string): string[] {
  const lower = query.toLowerCase();
  const terms = new Set([lower]);

  for (const [synonym, targets] of Object.entries(SYNONYM_MAP)) {
    if (lower.includes(synonym)) {
      for (const target of targets) {
        terms.add(target);
      }
    }
  }

  return [...terms];
}

function extractKeywords(useCase: string): string[] {
  return useCase
    .toLowerCase()
    .split(/[\s,./]+/)
    .map((w) => w.replace(/[^a-z0-9\uAC00-\uD7A3]/g, ""))
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

function searchByKeyword(
  all: ComponentMeta[],
  keyword: string,
): ComponentMeta[] {
  return all.filter((component) => {
    if (component.name.toLowerCase().includes(keyword)) return true;
    if (component.kebabName.toLowerCase().includes(keyword)) return true;
    if (component.description.toLowerCase().includes(keyword)) return true;
    return component.props.some(
      (prop) =>
        prop.name.toLowerCase().includes(keyword) ||
        prop.description.toLowerCase().includes(keyword),
    );
  });
}

function buildReasoning(
  useCase: string,
  matchedNames: string[],
  components: ComponentSummary[],
): string {
  if (components.length === 0) {
    return `No components matched for use case: '${useCase}'.`;
  }

  const nameToSummary = new Map(components.map((c) => [c.name, c]));
  const descriptions = matchedNames
    .map((name) => nameToSummary.get(name))
    .filter((c): c is ComponentSummary => c !== undefined)
    .map((c) => `${c.name} (${c.description})`)
    .join(", ");

  return `Based on '${useCase}' use case: ${descriptions}. Call get_component for each component you plan to use to get full props/StyleSet, then generate_component_code.`;
}

export function registerSearchComponents(server: McpServer): void {
  server.tool(
    "search_components",
    "No prerequisite needed. " +
      "Call this when the user provides a specific component keyword or describes a use case to build. " +
      "Returns lightweight ComponentSummary objects (name, description, propsCount, hasVModel, styleSetChildRefs) — NOT full metadata. " +
      "Then call get_component for each component you actually plan to use to get full props/StyleSet/events.",
    {
      query: z.string().describe("Search term or keyword"),
      useCase: z
        .string()
        .optional()
        .describe(
          "Description of the use case to build (e.g. 'login form'). When provided, uses keyword extraction instead of direct search.",
        ),
    },
    async ({ query, useCase }) => {
      resetSession();
      const start = Date.now();
      const all = getAllComponentsMeta();

      // useCase 경로: 키워드 추출 기반 검색
      if (useCase) {
        const keywords = extractKeywords(useCase);

        const seen = new Set<string>();
        const orderedNames: string[] = [];

        const addName = (name: string) => {
          if (!seen.has(name)) {
            seen.add(name);
            orderedNames.push(name);
          }
        };

        for (const keyword of keywords) {
          const searchMatches = searchByKeyword(all, keyword);
          for (const component of searchMatches) {
            addName(component.name);
          }
        }

        const limitedNames = orderedNames.slice(0, MAX_RESULTS);

        const nameToMeta = new Map(all.map((c) => [c.name, c]));
        const components: ComponentSummary[] = limitedNames
          .map((name) => nameToMeta.get(name))
          .filter((c): c is ComponentMeta => c !== undefined)
          .map(toSummary);

        const reasoning = buildReasoning(useCase, limitedNames, components);
        const shortUseCase =
          useCase.length > 28 ? useCase.slice(0, 25) + "\u2026" : useCase;

        if (components.length === 0) {
          const meta = recordStep(
            "search_components",
            `Suggest: ${shortUseCase}`,
            Date.now() - start,
            { summary: "no matches" },
          );
          return textResponse(
            {
              components: [],
              reasoning,
              message: `No components matched for use case: '${useCase}'.`,
              next_actions: [
                {
                  tool: "clarify_intent",
                  reason: "rephrase the use case to match existing components",
                },
                {
                  tool: "check_github_token",
                  reason: "file an enhancement issue for the missing feature",
                },
              ],
            },
            meta,
          );
        }

        const meta = recordStep(
          "search_components",
          `Suggest: ${shortUseCase}`,
          Date.now() - start,
          {
            summary: `suggested ${components.length}: ${components
              .slice(0, 3)
              .map((c) => c.name)
              .join(", ")}${components.length > 3 ? "\u2026" : ""}`,
          },
        );

        return textResponse(
          {
            components,
            reasoning,
            total: components.length,
            tryNext:
              components.length > 0
                ? `Try: "Build a ${useCase} page using ${components
                    .slice(0, 3)
                    .map((c) => c.name)
                    .join(", ")}" to generate code`
                : undefined,
            avoid: [
              "Do not recommend or mention Vlossom components that were not returned in this response",
              "Do not suggest third-party UI libraries as alternatives without the user asking",
              "Do not infer props/events/StyleSet from these summaries — call get_component for the ones you will actually use",
            ],
            next_actions: [
              {
                tool: "get_component",
                reason:
                  "REQUIRED — call for each component you will actually use to get full props/StyleSet/events",
              },
              {
                tool: "generate_component_code",
                reason:
                  "generate a code scaffold once relevant component details are gathered",
              },
              {
                tool: "report_issue",
                reason:
                  "file an enhancement or bug report for the use case (draft=true)",
              },
            ],
          },
          meta,
        );
      }

      // query 경로: 동의어 확장 기반 검색
      const expandedTerms = expandQuery(query);

      const matched = all.filter((component) => {
        return expandedTerms.some((term) => {
          if (component.name.toLowerCase().includes(term)) return true;
          if (component.kebabName.toLowerCase().includes(term)) return true;
          if (component.description.toLowerCase().includes(term)) return true;

          return component.props.some(
            (prop) =>
              prop.name.toLowerCase().includes(term) ||
              prop.description.toLowerCase().includes(term),
          );
        });
      });

      if (matched.length === 0) {
        const meta = recordStep(
          "search_components",
          `Search: ${query}`,
          Date.now() - start,
          { summary: "no results" },
        );
        return textResponse(
          {
            results: [],
            expandedTerms: expandedTerms.length > 1 ? expandedTerms : undefined,
            message: `No components found for query '${query}'`,
            next_actions: [
              {
                tool: "clarify_intent",
                reason:
                  "rephrase the query to match existing components before giving up",
              },
              {
                tool: "check_github_token",
                reason:
                  "file an enhancement issue if the feature genuinely does not exist",
              },
            ],
          },
          meta,
        );
      }

      const results: ComponentSummary[] = matched.map(toSummary);
      const meta = recordStep(
        "search_components",
        `Search: ${query}`,
        Date.now() - start,
        { summary: `${results.length} results` },
      );

      return textResponse(
        {
          results,
          total: results.length,
          expandedTerms: expandedTerms.length > 1 ? expandedTerms : undefined,
          avoid: [
            "Do not recommend or mention Vlossom components that were not returned in this response",
            "Do not suggest third-party UI libraries as alternatives without the user asking",
            "Do not infer props/events/StyleSet from these summaries — call get_component for the ones you will actually use",
          ],
          next_actions: [
            {
              tool: "get_component",
              reason:
                "REQUIRED — call for each matching component you will actually use to get full props/StyleSet/events",
            },
            {
              tool: "generate_component_code",
              reason:
                "generate code once relevant component details are gathered",
            },
            {
              tool: "report_issue",
              reason:
                "file an enhancement or bug report for the search results (draft=true)",
            },
          ],
        },
        meta,
      );
    },
  );
}
