import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';

import { Opportunity } from '../models/opportunity.model';
import { Activity } from '../models/activity.model';
import { Account } from '../models/account.model';

const ETAPAS = ['Prospección', 'Calificación', 'Propuesta', 'Negociación', 'Cierre'];
const FUENTES = ['Inbound', 'Outbound', 'Partner', 'Evento', 'Referido'];
const TERRITORIOS = ['Norte', 'Centro', 'Sur', 'LatAm', 'Europa'];
const PROPIETARIOS = ['Carla', 'Mateo', 'Lucía', 'Andrés', 'Paula'];
const SECTORES = ['Tecnología', 'Finanzas', 'Retail', 'Manufactura', 'Salud'];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

@Injectable({ providedIn: 'root' })
export class InMemoryDataService {
  private readonly opportunities$ = new BehaviorSubject<Opportunity[]>([]);
  private readonly activities$ = new BehaviorSubject<Activity[]>([]);
  private readonly accounts$ = new BehaviorSubject<Account[]>([]);

  constructor() {
    this.bootstrap();
  }

  private bootstrap(): void {
    const opportunities: Opportunity[] = Array.from({ length: 200 }).map((_, index) => {
      const etapa = randomItem(ETAPAS);
      const monto = randomInt(15, 250) * 1000;
      return {
        id: `OP-${index + 1}`,
        nombre: `Oportunidad ${index + 1}`,
        cuenta: `Cuenta ${randomInt(1, 80)}`,
        etapa,
        monto,
        probabilidad: randomInt(25, 90),
        cierrePrevisto: new Date(
          Date.now() + randomInt(7, 120) * 24 * 60 * 60 * 1000
        ).toISOString(),
        propietario: randomItem(PROPIETARIOS),
        fuente: randomItem(FUENTES),
        territorio: randomItem(TERRITORIOS)
      } satisfies Opportunity;
    });

    const activities: Activity[] = Array.from({ length: 40 }).map((_, index) => ({
      id: `ACT-${index + 1}`,
      tipo: randomItem(['Llamada', 'Reunión', 'Tarea']),
      asunto: `Seguimiento ${index + 1}`,
      fecha: new Date(Date.now() + randomInt(1, 14) * 24 * 60 * 60 * 1000).toISOString(),
      cuenta: `Cuenta ${randomInt(1, 80)}`,
      oportunidadId: randomItem(opportunities).id,
      estado: 'Pendiente'
    }));

    const accounts: Account[] = Array.from({ length: 120 }).map((_, index) => ({
      id: `AC-${index + 1}`,
      nombre: `Cuenta ${index + 1}`,
      sector: randomItem(SECTORES),
      segmento: randomItem(['Enterprise', 'Mid-Market', 'SMB']),
      territorio: randomItem(TERRITORIOS),
      ingresosAnuales: randomInt(1, 400) * 1000000
    }));

    this.opportunities$.next(opportunities);
    this.activities$.next(activities);
    this.accounts$.next(accounts);
  }

  getOpportunities(): Observable<Opportunity[]> {
    return this.opportunities$.asObservable();
  }

  getOpportunity(id: string): Observable<Opportunity | undefined> {
    return this.opportunities$.pipe(map((items) => items.find((item) => item.id === id)));
  }

  updateOpportunity(partial: Partial<Opportunity> & { id: string }): void {
    const next = this.opportunities$.value.map((item) =>
      item.id === partial.id ? { ...item, ...partial } : item
    );
    this.opportunities$.next(next);
  }

  getActivities(): Observable<Activity[]> {
    return this.activities$.asObservable();
  }

  getAccounts(): Observable<Account[]> {
    return this.accounts$.asObservable();
  }

  getAccount(id: string): Observable<Account | undefined> {
    return this.accounts$.pipe(map((items) => items.find((item) => item.id === id)));
  }

  completeActivity(id: string): Observable<Activity | undefined> {
    const next = this.activities$.value.map((item) =>
      item.id === id ? { ...item, estado: 'Completada' as const } : item
    );
    this.activities$.next(next);
    return of(next.find((item) => item.id === id));
  }
}
