/**
 * OKLCH 팔레트 생성기
 *
 * 3그룹:
 *   standard  L-500 = 60%  (red, brown, green, teal, blue, indigo, violet, purple, fuchsia, pink, rose)
 *   semi      L-500 = 70%  (orange, amber, emerald, sky)
 *   bright    L-500 = 80%  (yellow, lime, cyan)
 *
 * 채도: 각 stop의 명도에서 culori clampChroma로 sRGB 최대치를 구한 뒤
 *       그룹별 피크 비율(GROUP_PEAK_FRACTION) × stop별 스케일(CHROMA_SCALE) 적용
 */
import { clampChroma } from 'culori';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = resolve(__dirname, '../src/styles/palette.css');

const STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

// ── 명도 스케줄 (각 stop의 고정 L 목표값) ──────────────────────────
const L_SCHEDULE = {
    //          50   100  200  300  400  500  600  700  800  900  950
    standard: [97, 94, 88, 80, 70, 60, 50, 40, 30, 22, 14],
    semi: [97, 95, 90, 83, 77, 70, 59, 48, 37, 27, 17],
    bright: [98, 96, 92, 88, 84, 80, 70, 60, 49, 37, 25],
    vivid: [98, 96, 93, 90, 87, 85, 75, 64, 52, 39, 27], // yellow 전용: L-500=85%
};

// ── 그룹별 피크 채도 비율 (500 stop에서 gamut 최대치의 몇 %) ─────────
const GROUP_PEAK_FRACTION = {
    standard: 0.8,
    semi: 0.85,
    bright: 0.9,
    vivid: 1.0,
};

// ── stop별 채도 스케일 (500 기준 1.0) ──────────────────────────────
//          50    100   200   300   400   500   600   700   800   900   950
const CHROMA_SCALE = [0.05, 0.15, 0.35, 0.6, 0.85, 1.0, 0.9, 0.75, 0.55, 0.35, 0.2];

// ── 색상 정의 ────────────────────────────────────────────────────────
// maxC:        의도적으로 채도 상한을 줄 때 (e.g. brown, teal)
// peakFraction: 그룹 기본값 대신 이 색만 다른 비율을 쓸 때
const COLORS = [
    { name: 'gray', h: null, group: 'standard', maxC: 0 },
    { name: 'red', h: 25, group: 'standard' },
    { name: 'brown', h: 40, group: 'standard', maxC: 0.13 }, // H=25(red)에서 H=40으로 → 흙갈색
    { name: 'orange', h: 50, group: 'semi', peakFraction: 1.0 }, // max chroma → 싱싱한 주황
    { name: 'amber', h: 70, group: 'bright', peakFraction: 1.0 },
    { name: 'yellow', h: 85, group: 'vivid' }, // L-500=85%, 황토 방지
    { name: 'lime', h: 120, group: 'bright' },
    { name: 'green', h: 152.5, group: 'semi', peakFraction: 1.0 }, // 싱그럽고 밝은 초록
    { name: 'emerald', h: 151.5, group: 'standard' }, // 깊고 진한 보석 톤
    { name: 'teal', h: 185, group: 'standard' },
    { name: 'cyan', h: 194.8, group: 'bright' },
    { name: 'sky', h: 240, group: 'semi' },
    { name: 'blue', h: 262, group: 'standard' },
    { name: 'indigo', h: 275, group: 'standard' },
    { name: 'violet', h: 295, group: 'standard' },
    { name: 'purple', h: 310, group: 'standard' },
    { name: 'fuchsia', h: 335, group: 'standard' },
    { name: 'pink', h: 350, group: 'standard' },
    { name: 'rose', h: 10, group: 'standard' },
];

// ── 헬퍼 ─────────────────────────────────────────────────────────────

function maxSafeC(h, lPct) {
    if (h === null || lPct <= 0 || lPct >= 100) {
        return 0;
    }
    return clampChroma({ mode: 'oklch', l: lPct / 100, c: 0.5, h }, 'oklch').c;
}

function fmtC(c) {
    if (c < 0.0005) {
        return '0';
    }
    // 소수점 3자리, 불필요한 trailing zero 제거 (JS String이 자동 처리)
    return String(Math.round(c * 1000) / 1000);
}

// ── CSS 생성 ──────────────────────────────────────────────────────────

function generateVars({ name, h, group, maxC, peakFraction }) {
    const schedule = L_SCHEDULE[group];
    const fraction = peakFraction ?? GROUP_PEAK_FRACTION[group];
    const peakL = schedule[5]; // stop 500의 명도

    const rawPeakC = maxSafeC(h, peakL);
    const peakC = Math.min(rawPeakC * fraction, maxC ?? Infinity);

    const hStr = h === null ? '0' : String(h);

    return STOPS.map((stop, i) => {
        const l = schedule[i];
        const targetC = peakC * CHROMA_SCALE[i];
        const safeC = Math.min(targetC, maxSafeC(h, l)); // gamut 안전망
        return `        --vs-${name}-${stop}: oklch(${l}% ${fmtC(safeC)} ${hStr});`;
    }).join('\n');
}

const blocks = COLORS.map(generateVars);

const css =
    '@layer base {\n    :root {\n        --vs-white: var(--color-white);\n        --vs-black: var(--color-black);\n\n' +
    blocks.join('\n\n') +
    '\n    }\n}\n';

writeFileSync(OUT_PATH, css, 'utf8');

// ── 생성 요약 출력 ────────────────────────────────────────────────────
console.log('\n=== Palette generated ===\n');
console.log('Color'.padEnd(11), 'Group'.padEnd(10), 'L-500'.padEnd(7), 'C-500');
console.log('-'.repeat(40));
for (const { name, h, group, maxC, peakFraction } of COLORS) {
    const schedule = L_SCHEDULE[group];
    const fraction = peakFraction ?? GROUP_PEAK_FRACTION[group];
    const peakL = schedule[5];
    const rawPeak = maxSafeC(h, peakL);
    const peakC = Math.min(rawPeak * fraction, maxC ?? Infinity);
    console.log(name.padEnd(11), group.padEnd(10), `${peakL}%`.padEnd(7), fmtC(peakC));
}
console.log('\nWritten:', OUT_PATH, '\n');
