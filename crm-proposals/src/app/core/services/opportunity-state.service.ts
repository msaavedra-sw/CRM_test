import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';

import { Opportunity } from '../models/opportunity.model';
import { InMemoryDataService } from '../data/in-memory-data.service';

export interface OpportunityFilters {
  search: string;
  etapa?: string;
  propietario?: string;
  territorio?: string;
}

@Injectable({ providedIn: 'root' })
export class OpportunityStateService {
  private readonly filters$ = new BehaviorSubject<OpportunityFilters>({ search: '' });
  private readonly selectedIds$ = new BehaviorSubject<Set<string>>(new Set());

  constructor(private readonly data: InMemoryDataService) {}

  readonly opportunities$ = combineLatest([
    this.data.getOpportunities(),
    this.filters$
  ]).pipe(
    map(([opportunities, filters]) => {
      const { search, etapa, propietario, territorio } = filters;
      const searchLower = search.toLowerCase();
      return opportunities.filter((item) => {
        const matchesSearch =
          !searchLower ||
          item.nombre.toLowerCase().includes(searchLower) ||
          item.cuenta.toLowerCase().includes(searchLower);
        const matchesEtapa = !etapa || item.etapa === etapa;
        const matchesPropietario = !propietario || item.propietario === propietario;
        const matchesTerritorio = !territorio || item.territorio === territorio;
        return matchesSearch && matchesEtapa && matchesPropietario && matchesTerritorio;
      });
    })
  );

  updateFilters(filters: Partial<OpportunityFilters>): void {
    this.filters$.next({ ...this.filters$.value, ...filters });
  }

  toggleSelect(id: string, multi = false): void {
    const current = new Set(this.selectedIds$.value);
    if (!multi) {
      current.clear();
    }
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    this.selectedIds$.next(current);
  }

  selectRange(ids: string[]): void {
    this.selectedIds$.next(new Set(ids));
  }

  clearSelection(): void {
    this.selectedIds$.next(new Set());
  }

  selectedIds(): Observable<Set<string>> {
    return this.selectedIds$.asObservable();
  }

  update(opportunity: Partial<Opportunity> & { id: string }): void {
    this.data.updateOpportunity(opportunity);
  }
}
