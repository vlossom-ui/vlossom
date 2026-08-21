/**
 * 각 hue별로 sRGB gamut 안에서 최대 채도가 나타나는 명도(L)를 분석해
 * "bright group" (high-L) vs "standard group"을 구분하는 스크립트.
 */
import { clampChroma } from 'culori';

const HUES = [
    { name: 'red', h: 25 },
    { name: 'brown', h: 25 },
    { name: 'orange', h: 50 },
    { name: 'amber', h: 70 },
    { name: 'yellow', h: 85 },
    { name: 'lime', h: 120 },
    { name: 'green', h: 152.5 },
    { name: 'emerald', h: 151.5 },
    { name: 'teal', h: 185 },
    { name: 'cyan', h: 194.8 },
    { name: 'sky', h: 240 },
    { name: 'blue', h: 262 },
    { name: 'indigo', h: 275 },
    { name: 'violet', h: 295 },
    { name: 'purple', h: 310 },
    { name: 'fuchsia', h: 335 },
    { name: 'pink', h: 350 },
    { name: 'rose', h: 10 },
];

function findPeakChromaL(h) {
    let peakL = 0;
    let peakC = 0;

    for (let lInt = 0; lInt <= 100; lInt++) {
        const l = lInt / 100;
        const clamped = clampChroma({ mode: 'oklch', l, c: 0.5, h }, 'oklch');
        if (clamped.c > peakC) {
            peakC = clamped.c;
            peakL = lInt;
        }
    }
    return { peakL, peakC };
}

function getChromaAt(h, lPct) {
    const clamped = clampChroma({ mode: 'oklch', l: lPct / 100, c: 0.5, h }, 'oklch');
    return clamped.c;
}

const STANDARD_500_L = 60;

console.log('\n=== Hue Peak Chroma Analysis ===\n');
console.log(
    'Color'.padEnd(12),
    'H'.padEnd(7),
    'Peak L'.padEnd(9),
    'Max C'.padEnd(8),
    `C@${STANDARD_500_L}%`.padEnd(8),
    'Retained'.padEnd(10),
    'Verdict',
);
console.log('-'.repeat(72));

for (const { name, h } of HUES) {
    const { peakL, peakC } = findPeakChromaL(h);
    const cAt60 = getChromaAt(h, STANDARD_500_L);
    const retained = cAt60 / peakC;

    // bright 판정: 피크 명도가 높고 표준 명도에서 채도 유지율도 낮아야
    // → 피크 명도 ≥ 80% AND 유지율 ≤ 75%
    const isBright = peakL >= 80 && retained <= 0.75;
    // 중간: 피크 명도 ≥ 70% OR 유지율 ≤ 80%
    const isMid = !isBright && (peakL >= 70 || retained <= 0.8);

    const verdict = isBright ? 'BRIGHT ◀' : isMid ? 'semi    ·' : 'standard';

    console.log(
        name.padEnd(12),
        String(h).padEnd(7),
        `${peakL}%`.padEnd(9),
        peakC.toFixed(3).padEnd(8),
        cAt60.toFixed(3).padEnd(8),
        `${Math.round(retained * 100)}%`.padEnd(10),
        verdict,
    );
}

console.log(`
판정 기준:
  BRIGHT   peak L ≥ 80% AND 유지율 ≤ 75%  → 500을 높은 명도에 배치
  semi     peak L ≥ 70% OR  유지율 ≤ 80%  → 표준보다 약간 높게
  standard 나머지                           → L=60% 기준 고정
`);
