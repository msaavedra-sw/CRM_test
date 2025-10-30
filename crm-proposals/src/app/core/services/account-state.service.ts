import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

import { InMemoryDataService } from '../data/in-memory-data.service';

@Injectable({ providedIn: 'root' })
export class AccountStateService {
  private readonly inMemory = inject(InMemoryDataService);
  private readonly search$ = new BehaviorSubject<string>('');

  readonly accounts$ = combineLatest([
    this.inMemory.getAccounts(),
    this.search$
  ]).pipe(
    map(([accounts, search]) => {
      const lower = search.toLowerCase();
      return accounts.filter((account) =>
        lower ? account.nombre.toLowerCase().includes(lower) : true
      );
    })
  );

  setSearch(value: string): void {
    this.search$.next(value);
  }
}
