import { describe, expect, it } from 'vitest';

import { min } from '../src/statistics/min';

describe('min', () => {
	it('returns Infinity with no arguments', () => {
		expect(min()).toBe(Infinity);
	});

	it('returns the smallest numeric value and preserves negative zero', () => {
		expect(min(3, -2, 1)).toBe(-2);
		expect(Object.is(min(0, -0), -0)).toBe(true);
	});

	it('coerces values to numbers like Math.min', () => {
		expect(min('2', '10')).toBe(2);
		expect(min(undefined, 1)).toBeNaN();
	});

	it('throws for BigInt values like Math.min', () => {
		expect(() => min(1n)).toThrow(TypeError);
	});
});
