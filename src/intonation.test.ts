/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest';

import { calculateStepSize } from './intonation';

describe('calculateStepSize', () => {
  it('returns one tenth of the initial pitch span', () => {
    expect(calculateStepSize({ min: 1, max: 6 })).toBeCloseTo(0.5);
    expect(calculateStepSize({ min: -2, max: 8 })).toBeCloseTo(1);
  });

  it('falls back to a small non-zero step when span is zero or negative', () => {
    expect(calculateStepSize({ min: 3, max: 3 })).toBeCloseTo(0.1);
    expect(calculateStepSize({ min: 5, max: 2 })).toBeCloseTo(0.1);
  });
});
