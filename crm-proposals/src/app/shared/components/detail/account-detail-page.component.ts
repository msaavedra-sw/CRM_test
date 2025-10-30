import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

import { DetailPageComponent } from './detail-page.component';
import { InMemoryDataService } from '../../../core/data/in-memory-data.service';

@Component({
  selector: 'app-account-detail-page',
  standalone: true,
  imports: [CommonModule, DetailPageComponent],
  template: `
    <app-detail-page
      *ngIf="account$ | async as account"
      [header]="{
        titulo: account.nombre,
        estado: account.segmento,
        propietario: account.territorio,
        monto: account.ingresosAnuales
      }"
      [properties]="[
        { label: 'Sector', value: account.sector },
        { label: 'Segmento', value: account.segmento }
      ]"
      [timeline]="[{ fecha: (new Date()).toISOString(), titulo: 'Último contacto', descripcion: 'Pendiente de actualizar' }]"
    ></app-detail-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountDetailPageComponent {
  readonly account$ = this.route.paramMap.pipe(
    switchMap((params) => this.data.getAccount(params.get('id') ?? ''))
  );

  constructor(private readonly data: InMemoryDataService, private readonly route: ActivatedRoute) {}
}
