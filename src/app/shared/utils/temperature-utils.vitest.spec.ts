import { describe, it, expect } from 'vitest';
import { processFields, keepLast20Temperatures } from './temperature-utils';

describe('temperature-utils', () => {
  it('processFields returns correct min, max and avg to 2 decimals', () => {
    const arr = [20, 30, 40];
    const r = processFields(arr);
    expect(r.minTemperature).toBe(20.0);
    expect(r.maxTemperature).toBe(40.0);
    expect(r.avgTemperature).toBe(30.0);
  });

  it('keepLast20Temperatures keeps at most 20 values', () => {
    let values: number[] = [];
    for (let i = 20; i <= 41; i++) values = keepLast20Temperatures(values, i);
    expect(values.length).toBe(20);
    expect(values[0]).toBe(22);
    expect(values[values.length - 1]).toBe(41);
  });
});
