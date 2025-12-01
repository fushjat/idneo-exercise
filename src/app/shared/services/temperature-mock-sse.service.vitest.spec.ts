import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { TemperatureMockSse } from './temperature-mock-sse.service';
import { TemperatureEvent } from '../models/temperature-models';

describe('TemperatureMockSse', () => {
  let service: TemperatureMockSse;

  beforeEach(() => {
    service = new TemperatureMockSse();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    service.stopStream();
  });

  it('emits temperature events when started', () => {
    const events: TemperatureEvent[] = [];
    const sub = service.getTemperatureStream().subscribe((e) => events.push(e));

    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    service.startStream();

    vi.advanceTimersByTime(0);
    expect(events.length).toBe(1);
    expect(events[0].type).toBe('temperature');

    vi.advanceTimersByTime(1000);
    expect(events.length).toBe(2);

    sub.unsubscribe();
    service.stopStream();
  });

  it('stopStream stops further emissions', () => {
    const events: TemperatureEvent[] = [];
    const sub = service.getTemperatureStream().subscribe((e) => events.push(e));
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    service.startStream();
    vi.advanceTimersByTime(0);
    expect(events.length).toBe(1);

    service.stopStream();
    vi.advanceTimersByTime(1000);
    expect(events.length).toBe(1);

    sub.unsubscribe();
  });
});
