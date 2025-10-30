import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

import { InMemoryDataService } from '../data/in-memory-data.service';
import { Activity } from '../models/activity.model';

@Injectable({ providedIn: 'root' })
export class ActivityStateService {
  private readonly search$ = new BehaviorSubject<string>('');

  readonly activities$ = this.inMemory
    .getActivities()
    .pipe(
      map((activities) =>
        activities
          .slice()
          .sort((a, b) => a.fecha.localeCompare(b.fecha))
          .filter((activity) =>
            this.search$.value
              ? activity.asunto.toLowerCase().includes(this.search$.value.toLowerCase())
              : true
          )
      )
    );

  constructor(private readonly inMemory: InMemoryDataService) {}

  setSearch(value: string): void {
    this.search$.next(value);
  }

  complete(id: string): void {
    this.inMemory.completeActivity(id).subscribe();
  }
}
