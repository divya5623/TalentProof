import type { HonestyState, ScoreComponents } from '../types';

/** Aligned=100, Weak=60, Conflict=20, Missing=0 */
export function honestyStateToScore(state: HonestyState): number {
  switch (state) {
    case 'aligned':
      return 100;
    case 'weak':
      return 60;
    case 'conflict':
      return 20;
    case 'missing':
      return 0;
  }
}

export function mean(nums: number[]): number | null {
  if (nums.length === 0) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

/**
 * Score blend: L1 40% + L2 35% + evidence alignment 15% + integrity 10%.
 * Overall is weighted only when both L1 and L2 aggregates exist; else null ("In progress").
 */
export function computeScoreComponents(input: {
  l1Scores: number[];
  l2Scores: number[];
  honestyStates: HonestyState[];
  integrity: number;
}): ScoreComponents {
  const weights = { l1: 40, l2: 35, alignment: 15, integrity: 10 } as const;
  const l1 = mean(input.l1Scores);
  const l2 = mean(input.l2Scores);
  const alignmentScores = input.honestyStates.map(honestyStateToScore);
  const alignment = mean(alignmentScores) ?? 0;
  const integrity = input.integrity;

  let overall: number | null = null;
  if (l1 !== null && l2 !== null) {
    overall =
      (l1 * weights.l1 +
        l2 * weights.l2 +
        alignment * weights.alignment +
        integrity * weights.integrity) /
      100;
  }

  return { l1, l2, alignment, integrity, overall, weights };
}

/**
 * DEV self-check: Aarav seeded components should land near overallTarget 94.
 * Example: L1 ~[91,88,90,92], L2 ~[88], honesty mostly aligned + one weak, integrity 96.
 */
if (import.meta.env.DEV) {
  const aaravCheck = computeScoreComponents({
    l1Scores: [91, 95, 94, 96],
    l2Scores: [94],
    honestyStates: ['aligned', 'aligned', 'aligned', 'aligned', 'aligned', 'weak'],
    integrity: 96,
  });
  if (aaravCheck.overall !== null) {
    const delta = Math.abs(aaravCheck.overall - 94);
    if (delta > 3) {
      console.warn(
        `[scores] Aarav seed overall ${aaravCheck.overall.toFixed(1)} drifts from target 94 (Δ=${delta.toFixed(1)})`,
      );
    }
  }
}
