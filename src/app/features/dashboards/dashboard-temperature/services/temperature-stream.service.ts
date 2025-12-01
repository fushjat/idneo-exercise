import { Injectable, inject, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { TemperatureMockSse } from '../../../../shared/services/temperature-mock-sse.service';
import { keepLast20Temperatures } from '../../../../shared/utils/temperature-utils';

@Injectable({
  providedIn: 'root',
})
export class TemperatureStream implements OnDestroy {
  private sse = inject(TemperatureMockSse);

  private temperatures$ = new BehaviorSubject<number[]>([]);
  private active$ = new BehaviorSubject<boolean>(false);

  private sub: Subscription | null = null;

  startListening(): void {
    if (this.sub) return;

    console.log('TemperatureStream startListening');

    this.active$.next(true);

    this.sub = this.sse.getTemperatureStream().subscribe({
      next: (event) => {
        if (event.type === 'temperature') {
          this.temperatures$.next(keepLast20Temperatures(this.temperatures$.value, event.data));
        }

        if (event.type === 'disconnect') {
          this.stopListening();
        }
      },

      error: (err) => {
        this.stopListening();
      },

      complete: () => {
        this.stopListening();
      },
    });
  }

  stopListening(): void {
    console.log('TemperatureStream stopListening');

    this.sub?.unsubscribe();
    this.sub = null;

    try {
      this.sse.stopStream();
    } catch (e) {
      console.error('TemperatureStream stopListening error', e);
    }

    this.active$.next(false);
  }

  getTemperatures() {
    return this.temperatures$.asObservable();
  }

  getIsActive() {
    return this.active$.asObservable();
  }

  ngOnDestroy(): void {
    this.stopListening();
  }
}
