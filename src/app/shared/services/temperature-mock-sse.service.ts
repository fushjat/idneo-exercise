import { Injectable } from '@angular/core';
import { Observable, Subject, timer, interval, Subscription } from 'rxjs';
import { TemperatureEvent } from '../models/temperature-models';

@Injectable({ providedIn: 'root' })
export class TemperatureMockSse {
  private eventSubject = new Subject<TemperatureEvent>();
  private isStreaming = false;
  private timerSub: Subscription | null = null;

  startStream(): void {
    if (this.isStreaming) return;
    this.isStreaming = true;
    console.log('[TemperatureMockSse] startStream called');

    const emitEvent = () => {
      const random = Math.random();

      // random disconnection
      if (random < 0.03) {
        this.eventSubject.next({ type: 'disconnect', data: 0 });

        this.isStreaming = false;
        this.timerSub?.unsubscribe();
        this.timerSub = null;
        return;
      }

      const temp = +(Math.random() * 70 + 30).toFixed(2);
      this.eventSubject.next({ type: 'temperature', data: temp });
    };

    setTimeout(emitEvent, 0);
    if (this.isStreaming) {
      this.timerSub = interval(1000).subscribe(() => emitEvent());
    }
  }

  // Returns Obeservable
  getTemperatureStream(): Observable<TemperatureEvent> {
    this.startStream();
    return this.eventSubject.asObservable();
  }
  stopStream(): void {
    if (!this.isStreaming && !this.timerSub) return;
    this.isStreaming = false;
    this.timerSub?.unsubscribe();
    this.timerSub = null;
    console.log('[TemperatureMockSse] stopStream called');
  }
}
