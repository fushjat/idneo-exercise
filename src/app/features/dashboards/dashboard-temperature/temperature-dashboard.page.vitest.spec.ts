import { describe, it, expect, beforeEach, vi } from 'vitest';
import { runInInjectionContext, createEnvironmentInjector } from '@angular/core';
import type { TemperatureDashboardPage } from './temperature.dashboard.page';

class FakeTemperatureStream {
  private tempListeners = new Set<(arr: number[]) => void>();
  private activeListeners = new Set<(b: boolean) => void>();

  startListening() {
    this.emitActive(true);
  }

  stopListening() {
    this.emitActive(false);
  }

  getTemperatures() {
    return {
      subscribe: (
        observerOrNext: ((arr: number[]) => void) | { next?: (arr: number[]) => void },
      ) => {
        const nextFn = typeof observerOrNext === 'function' ? observerOrNext : observerOrNext?.next;
        if (!nextFn) return { unsubscribe() {} };
        this.tempListeners.add(nextFn);
        return { unsubscribe: () => this.tempListeners.delete(nextFn) };
      },
    };
  }

  emit(temps: number[]) {
    this.tempListeners.forEach((cb) => cb(temps));
  }

  getIsActive() {
    return {
      subscribe: (observerOrNext: ((b: boolean) => void) | { next?: (b: boolean) => void }) => {
        const nextFn = typeof observerOrNext === 'function' ? observerOrNext : observerOrNext?.next;
        if (!nextFn) return { unsubscribe() {} };
        this.activeListeners.add(nextFn);
        // emitir estado inicial
        nextFn(false);
        return { unsubscribe: () => this.activeListeners.delete(nextFn) };
      },
    };
  }

  private emitActive(active: boolean) {
    this.activeListeners.forEach((cb) => cb(active));
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
