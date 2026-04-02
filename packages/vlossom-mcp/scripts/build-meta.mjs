#!/usr/bin/env node
// Generates src/data/components-meta.json from the vlossom components directory.
// Parses README.md and types.ts for each component to extract rich metadata:
// props, styleSet, events, slots, methods.
// Also writes dist/data/components-meta.json so the built package can read it at runtime.
// Run before build: npm run generate

import { readdirSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { readFile } from "fs/promises";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const componentsPath = resolve(__dirname, "../../vlossom/src/components");
const srcDataDir = resolve(__dirname, "../src/data");
const distDataDir = resolve(__dirname, "../dist/data");

if (!existsSync(componentsPath)) {
    console.error(`Components directory not found: ${componentsPath}`);
    process.exit(1);
}

// kebab-case → PascalCase
function kebabToPascalCase(kebab) {
    return kebab
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");
}

// 마크다운 테이블 행 파싱: 파이프 구분, 이스케이프된 \| 는 유지
function parseTableRow(line) {
    // 앞뒤 파이프 제거 후 이스케이프된 파이프를 플레이스홀더로 치환
    const PIPE_PLACEHOLDER = "\x00PIPE\x00";
    const inner = line.replace(/^\s*\|/, "").replace(/\|\s*$/, "");
    const replaced = inner.replace(/\\\|/g, PIPE_PLACEHOLDER);
    const cells = replaced.split("|").map((cell) =>
        cell.trim().replace(new RegExp(PIPE_PLACEHOLDER, "g"), "|")
    );
    return cells;
}

// 구분선 행(| --- | --- |) 여부 판별
function isSeparatorRow(line) {
    return /^\s*\|[\s|:-]+\|\s*$/.test(line);
}

// 백틱 제거
function stripBackticks(str) {
    return str.replace(/^`+|`+$/g, "").trim();
}

/**
 * 마크다운 테이블을 파싱하여 객체 배열 반환
 * @param {string[]} lines - 파일 전체 라인 배열
 * @param {number} startIndex - 헤더 행 인덱스
 * @param {string[]} headers - 컬럼 헤더 이름 (소문자)
 * @returns {{ rows: object[], nextIndex: number }}
 */
function parseTable(lines, startIndex, headers) {
    const rows = [];
    let i = startIndex + 1; // 구분선 행 건너뜀

    // 구분선 행 스킵
    if (i < lines.length && isSeparatorRow(lines[i])) {
        i++;
    }

    while (i < lines.length) {
        const line = lines[i].trim();
        if (!line.startsWith("|")) break;
        if (isSeparatorRow(line)) {
            i++;
            continue;
        }

        const cells = parseTableRow(line);
        const row = {};
        headers.forEach((header, idx) => {
            row[header] = cells[idx] !== undefined ? cells[idx].trim() : "";
        });
        rows.push(row);
        i++;
    }

    return { rows, nextIndex: i };
}

/**
 * README.md에서 특정 섹션(## SectionName) 이후 테이블을 찾아 반환
 */
function findSectionTable(lines, sectionName) {
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        // ## Props / ### VsXxx Props 같은 형태도 인식
        if (line === `## ${sectionName}` || line.startsWith(`## ${sectionName}`)) {
            // 다음 테이블 헤더 찾기
            for (let j = i + 1; j < lines.length; j++) {
                const candidate = lines[j].trim();
                if (candidate.startsWith("|")) {
                    return { headerLineIndex: j, found: true };
                }
                // 다른 섹션(##)이 나오면 중단
                if (candidate.startsWith("## ") && j > i + 1) {
                    break;
                }
            }
        }
    }
    return { found: false };
}

/**
 * README.md에서 첫 번째 Props 테이블을 찾아 파싱
 * (VsCheckbox처럼 ### VsXxx Props 형태의 중첩 섹션도 처리)
 */
function findFirstPropsTable(lines) {
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === "## Props" || /^## Props/.test(line)) {
            // ## Props 섹션 이후 첫 테이블 찾기
            for (let j = i + 1; j < lines.length; j++) {
                const candidate = lines[j].trim();
                if (candidate.startsWith("|")) {
                    return { headerLineIndex: j, found: true };
                }
                // ### 하위 섹션에서 테이블 찾기
                if (candidate.startsWith("### ")) {
                    for (let k = j + 1; k < lines.length; k++) {
                        const sub = lines[k].trim();
                        if (sub.startsWith("|")) {
                            return { headerLineIndex: k, found: true };
                        }
                        if (sub.startsWith("## ")) break;
                    }
                }
                if (candidate.startsWith("## ") && j > i + 1) break;
            }
        }
    }
    return { found: false };
}

/**
 * README.md 파싱
 */
async function parseReadme(readmePath) {
    const empty = {
        description: "",
        availableVersion: "",
        props: [],
        events: [],
        slots: [],
        methods: [],
    };

    if (!existsSync(readmePath)) {
        return empty;
    }

    let content;
    try {
        content = await readFile(readmePath, "utf-8");
    } catch {
        return empty;
    }

    const lines = content.split("\n");

    // description: 첫 번째 비어있지 않고, > 나 # 로 시작하지 않는 줄
    const description =
        lines
            .map((l) => l.trim())
            .find((l) => l.length > 0 && !l.startsWith(">") && !l.startsWith("#")) ?? "";

    // availableVersion: **Available Version**: 2.0.0+ 형태
    let availableVersion = "";
    for (const line of lines) {
        const match = line.match(/\*\*Available Version\*\*:\s*(.+)/);
        if (match) {
            availableVersion = match[1].trim();
            break;
        }
    }

    // Props 파싱
    let props = [];
    const propsInfo = findFirstPropsTable(lines);
    if (propsInfo.found) {
        const headerCells = parseTableRow(lines[propsInfo.headerLineIndex]);
        // 헤더를 소문자 매핑
        const headers = headerCells.map((h) => h.trim().toLowerCase());
        const { rows } = parseTable(lines, propsInfo.headerLineIndex, headers);
        props = rows
            .filter((row) => {
                const propName = row["prop"] || "";
                return propName.trim().length > 0;
            })
            .map((row) => ({
                name: stripBackticks(row["prop"] || ""),
                type: stripBackticks(row["type"] || ""),
                default: stripBackticks(row["default"] || ""),
                required: (() => {
                    const val = (row["required"] || "").trim();
                    return val.length > 0 && val !== "-";
                })(),
                description: (row["description"] || "").trim(),
            }));
    }

    // Events 파싱
    let events = [];
    const eventsInfo = findSectionTable(lines, "Events");
    if (eventsInfo.found) {
        const headerCells = parseTableRow(lines[eventsInfo.headerLineIndex]);
        const headers = headerCells.map((h) => h.trim().toLowerCase());
        const { rows } = parseTable(lines, eventsInfo.headerLineIndex, headers);
        events = rows
            .filter((row) => (row["event"] || "").trim().length > 0)
            .map((row) => ({
                name: stripBackticks(row["event"] || ""),
                payload: stripBackticks(row["payload"] || ""),
                description: (row["description"] || "").trim(),
            }));
    }

    // Slots 파싱
    let slots = [];
    const slotsInfo = findSectionTable(lines, "Slots");
    if (slotsInfo.found) {
        const headerCells = parseTableRow(lines[slotsInfo.headerLineIndex]);
        const headers = headerCells.map((h) => h.trim().toLowerCase());
        const { rows } = parseTable(lines, slotsInfo.headerLineIndex, headers);
        slots = rows
            .filter((row) => (row["slot"] || "").trim().length > 0)
            .map((row) => ({
                name: stripBackticks(row["slot"] || ""),
                description: (row["description"] || "").trim(),
            }));
    }

    // Methods 파싱
    let methods = [];
    const methodsInfo = findSectionTable(lines, "Methods");
    if (methodsInfo.found) {
        const headerCells = parseTableRow(lines[methodsInfo.headerLineIndex]);
        const headers = headerCells.map((h) => h.trim().toLowerCase());
        const { rows } = parseTable(lines, methodsInfo.headerLineIndex, headers);
        methods = rows
            .filter((row) => (row["method"] || "").trim().length > 0)
            .map((row) => ({
                name: stripBackticks(row["method"] || ""),
                parameters: stripBackticks(row["parameters"] || ""),
                description: (row["description"] || "").trim(),
            }));
    }

    return { description, availableVersion, props, events, slots, methods };
}

/**
 * types.ts에서 Vs{Name}StyleSet 인터페이스 텍스트를 추출
 * 중괄호 매칭으로 전체 interface 블록 추출
 */
// componentName: "VsButton" 형태 (Vs 접두사 포함)
// interfaceName: "VsButtonStyleSet" 형태로 조합
function extractStyleSetInterface(content, componentName) {
    const interfaceName = `${componentName}StyleSet`;
    const startPattern = new RegExp(
        String.raw`export\s+interface\s+${interfaceName}\s*\{`
    );
    const match = startPattern.exec(content);
    if (!match) return null;

    const startIndex = match.index + match[0].length - 1; // '{' 위치
    let depth = 0;
    let i = startIndex;

    while (i < content.length) {
        if (content[i] === "{") depth++;
        else if (content[i] === "}") {
            depth--;
            if (depth === 0) {
                return content.slice(match.index, i + 1);
            }
        }
        i++;
    }

    return null;
}

/**
 * variables 블록 파싱: { ... } 안의 프로퍼티를 path → type 맵으로 반환
 * 중첩 1단계(nested?: { key?: type }) 지원
 */
function parseVariablesBlock(variablesBlockContent) {
    const result = {};

    // 중첩 객체 제거 후 flat 프로퍼티 파싱을 위해 두 패스 수행

    // 1패스: 중첩 객체 블록 찾아서 재귀 파싱
    const nestedRegex = /(\w+)\??\s*:\s*\{([^{}]*)\}/g;
    let nestedMatch;
    const nestedParsed = new Set();

    while ((nestedMatch = nestedRegex.exec(variablesBlockContent)) !== null) {
        const groupName = nestedMatch[1];
        const innerContent = nestedMatch[2];
        nestedParsed.add(groupName);

        // 중첩 내부 프로퍼티 파싱
        const innerPropRegex = /(\w+)\??\s*:\s*([^;,\n]+)/g;
        let innerMatch;
        while ((innerMatch = innerPropRegex.exec(innerContent)) !== null) {
            const propName = innerMatch[1];
            const propType = innerMatch[2].trim().replace(/;$/, "");
            result[`${groupName}.${propName}`] = propType;
        }
    }

    // 2패스: flat 프로퍼티 (중첩 블록이 아닌 것)
    // 중첩 블록을 제거한 버전에서 파싱
    const flatContent = variablesBlockContent.replace(/\w+\??\s*:\s*\{[^{}]*\}/g, "");
    const flatPropRegex = /(\w+)\??\s*:\s*([^;,\n{}]+)/g;
    let flatMatch;
    while ((flatMatch = flatPropRegex.exec(flatContent)) !== null) {
        const propName = flatMatch[1];
        if (nestedParsed.has(propName)) continue;
        const propType = flatMatch[2].trim().replace(/;$/, "");
        result[propName] = propType;
    }

    return result;
}

/**
 * types.ts 파싱 → StyleSetMeta
 */
async function parseTypesTs(typesPath, componentName) {
    const empty = {
        variables: {},
        component: false,
        childRefs: [],
        raw: "",
    };

    if (!existsSync(typesPath)) {
        return empty;
    }

    let content;
    try {
        content = await readFile(typesPath, "utf-8");
    } catch {
        return empty;
    }

    const interfaceText = extractStyleSetInterface(content, componentName);
    if (!interfaceText) {
        return empty;
    }

    // component?: CSSProperties 존재 여부
    const hasComponent = /component\s*\?\s*:\s*CSSProperties/.test(interfaceText);

    // childRefs: Vs{Name}StyleSet 패턴 (단, 자기 자신 제외)
    const childRefRegex = /\w+\s*\?\s*:\s*(Vs\w+StyleSet)/g;
    const childRefs = [];
    let refMatch;
    const selfName = `${componentName}StyleSet`;
    while ((refMatch = childRefRegex.exec(interfaceText)) !== null) {
        const refName = refMatch[1];
        if (refName !== selfName && !childRefs.includes(refName)) {
            childRefs.push(refName);
        }
    }

    // Omit<Vs{Name}StyleSet, ...> 패턴도 childRef로 수집
    const omitRefRegex = /Omit\s*<\s*(Vs\w+StyleSet)/g;
    while ((refMatch = omitRefRegex.exec(interfaceText)) !== null) {
        const refName = refMatch[1];
        if (refName !== selfName && !childRefs.includes(refName)) {
            childRefs.push(refName);
        }
    }

    // variables 블록 파싱
    // variables?: { ... } 추출 (중괄호 매칭)
    let variables = {};
    const varStart = interfaceText.indexOf("variables?");
    if (varStart !== -1) {
        // variables?: { 이후 { 찾기
        const braceStart = interfaceText.indexOf("{", varStart);
        if (braceStart !== -1) {
            let depth = 0;
            let i = braceStart;
            while (i < interfaceText.length) {
                if (interfaceText[i] === "{") depth++;
                else if (interfaceText[i] === "}") {
                    depth--;
                    if (depth === 0) {
                        const variablesContent = interfaceText.slice(braceStart + 1, i);
                        variables = parseVariablesBlock(variablesContent);
                        break;
                    }
                }
                i++;
            }
        }
    }

    return {
        variables,
        component: hasComponent,
        childRefs,
        raw: interfaceText,
    };
}

/**
 * 단일 컴포넌트 메타 생성
 */
async function buildComponentMeta(kebabName) {
    const componentDir = join(componentsPath, kebabName);
    const name = kebabToPascalCase(kebabName);
    const readmePath = join(componentDir, "README.md");
    const typesPath = join(componentDir, "types.ts");

    const readmeMeta = await parseReadme(readmePath);
    const styleSet = await parseTypesTs(typesPath, name);

    return {
        name,
        kebabName,
        description: readmeMeta.description,
        availableVersion: readmeMeta.availableVersion,
        props: readmeMeta.props,
        styleSet,
        events: readmeMeta.events,
        slots: readmeMeta.slots,
        methods: readmeMeta.methods,
    };
}

// 메인 실행
async function main() {
    const entries = readdirSync(componentsPath, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && entry.name.startsWith("vs-"))
        .sort((a, b) => a.name.localeCompare(b.name));

    const results = [];
    let successCount = 0;

    for (const entry of entries) {
        try {
            const meta = await buildComponentMeta(entry.name);
            results.push(meta);
            console.log(`✓ ${meta.name}`);
            successCount++;
        } catch (err) {
            console.error(`✗ ${kebabToPascalCase(entry.name)} (${err.message})`);
        }
    }

    const json = JSON.stringify(results, null, 4);

    mkdirSync(srcDataDir, { recursive: true });
    writeFileSync(join(srcDataDir, "components-meta.json"), json, "utf-8");

    mkdirSync(distDataDir, { recursive: true });
    writeFileSync(join(distDataDir, "components-meta.json"), json, "utf-8");

    console.log(`\nGenerated ${successCount} components-meta entries`);
}

main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
});
