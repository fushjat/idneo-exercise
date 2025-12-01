import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TemperatureStream } from './services/temperature-stream.service';
import { processFields } from '../../../shared/utils/temperature-utils';
import { CurrentTemperature } from './components/current-temperature/current-temperature';
import { ChartTemperature } from './components/chart/chart-temperature';
import { Header } from './components/header/header';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-temperature-dashboard',
  templateUrl: './temperature-dashboard.page.html',
  standalone: true,
  imports: [ChartTemperature, CurrentTemperature, Header, CommonModule],
  styleUrls: ['./temperature-dashboard.page.css'],
})
export class TemperatureDashboardPage implements OnInit, OnDestroy {
  private temperatureStream = inject(TemperatureStream);

  sseActive = toSignal(this.temperatureStream.getIsActive(), { initialValue: false });
  temperatures = toSignal(this.temperatureStream.getTemperatures(), { initialValue: [] });

  currentTemperature = computed(() => this.temperatures().at(-1) ?? 0);
  stats = computed(() => processFields(this.temperatures()));

  isReconnecting = signal(false);
  workerResult = signal<number | null>(null);

  ngOnInit(): void {
    this.startStream();
    this.checkReconnection();
  }

  ngOnDestroy(): void {
    this.stopStream();
  }

  private checkReconnection(): void {
    if (this.sseActive()) {
      this.isReconnecting.set(false);
    }
  }

  startStream(): void {
    this.temperatureStream.startListening();
    this.checkReconnection();
  }

  stopStream(): void {
    this.temperatureStream.stopListening();
    this.checkReconnection();
  }

  reconnect(): void {
    if (this.sseActive()) return;

    this.isReconnecting.set(true);

    this.stopStream();
    this.startStream();
  }

  runHeavyCompute(): void {
    try {
      const worker = new Worker(
        new URL('../../../shared/workers/heavy-compute.worker', import.meta.url),
        { type: 'module' },
      );

      worker.onmessage = ({ data }) => {
        this.workerResult.set(data);
        worker.terminate();
      };

      worker.onerror = () => {
        worker.terminate();
      };

      worker.postMessage(1e7);
    } catch (e) {
      console.error('Failed to create worker', e);
    }
  }
}
