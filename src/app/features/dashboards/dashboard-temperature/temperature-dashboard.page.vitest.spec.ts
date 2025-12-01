import { describe, it, expect, beforeEach, vi } from 'vitest';
import { runInInjectionContext, createEnvironmentInjector } from '@angular/core';
import type { TemperatureDashboardPage } from './temperature.dashboard.page';

type SubscribeObserver<T> = ((value: T) => void) | { next?: (value: T) => void };

class FakeTemperatureStream {
  private listeners: ((arr: number[]) => void)[] = [];
  private activeSubs: ((b: boolean) => void)[] = [];
  startListening() {
    this.activeSubs.forEach((s) => s(true));
  }
  stopListening() {
    this.activeSubs.forEach((s) => s(false));
  }
  getTemperatures(): {
    subscribe: (observerOrNext: SubscribeObserver<number[]>) => { unsubscribe(): void };
  } {
    return {
      subscribe: (observerOrNext: SubscribeObserver<number[]>) => {
        const nextFn =
          typeof observerOrNext === 'function'
            ? observerOrNext
            : observerOrNext?.next?.bind(observerOrNext);
        if (!nextFn) return { unsubscribe() {} };
        this.listeners.push(nextFn as (arr: number[]) => void);
        return {
          unsubscribe: () => {
            const i = this.listeners.indexOf(nextFn);
            if (i >= 0) this.listeners.splice(i, 1);
          },
        };
      },
    } as any;
  }
  emit(temps: number[]) {
    this.listeners.forEach((l) => l(temps));
  }
  getIsActive(): {
    subscribe: (observerOrNext: SubscribeObserver<boolean>) => { unsubscribe(): void };
  } {
    return {
      subscribe: (observerOrNext: SubscribeObserver<boolean>) => {
        const nextFn =
          typeof observerOrNext === 'function'
            ? observerOrNext
            : observerOrNext?.next?.bind(observerOrNext);
        if (!nextFn) return { unsubscribe() {} };
        this.activeSubs.push(nextFn as (b: boolean) => void);
        nextFn(false);
        return {
          unsubscribe: () => {
            const i = this.activeSubs.indexOf(nextFn);
            if (i >= 0) this.activeSubs.splice(i, 1);
          },
        };
      },
    } as any;
  }
}

describe('Test TemperatureDashboardPage components', () => {
  let dashboard: TemperatureDashboardPage;
  let fakeStream: FakeTemperatureStream;

  beforeEach(async () => {
    // mock angular/common and component imports before module import to prevent platform compilation issues
    vi.mock('@angular/common', () => ({ CommonModule: {} }));
    vi.mock('./components/chart/chart-temperature', () => ({ ChartTemperature: {} }));
    vi.mock('./components/current-temperature/current-temperature', () => ({
      CurrentTemperature: {},
    }));
    vi.mock('./components/header/header', () => ({ Header: {} }));

    const module = await import('./temperature.dashboard.page');
    const TemperatureDashboardPage = module.TemperatureDashboardPage;

    fakeStream = new FakeTemperatureStream();
    const injector = createEnvironmentInjector([
      {
        provide: (await import('./services/temperature-stream.service')).TemperatureStream,
        useValue: fakeStream,
      },
    ]);

    dashboard = runInInjectionContext(injector, () => new TemperatureDashboardPage());
    dashboard.ngOnInit?.();
  });

  it('updates statistics when receiving temperatures', () => {
    fakeStream.emit([10, 20, 30]);
    expect(dashboard.temperatures()).toEqual([10, 20, 30]);
  });
});
