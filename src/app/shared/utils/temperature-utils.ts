export function processFields(arr: number[]) {
  return {
    minTemperature: +Math.min(...arr).toFixed(2),
    maxTemperature: +Math.max(...arr).toFixed(2),
    avgTemperature: +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2),
  };
}

export function keepLast20Temperatures(values: number[], v: number): number[] {
  const result = [...values, v];
  if (result.length > 20) result.shift();
  return result;
}
