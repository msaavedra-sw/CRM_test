import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
    @if (account$ | async; as account) {
      <app-detail-page
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
        [timeline]="[{ fecha: currentDate(), titulo: 'Último contacto', descripcion: 'Pendiente de actualizar' }]"
      ></app-detail-page>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountDetailPageComponent {
  private readonly data = inject(InMemoryDataService);
  private readonly route = inject(ActivatedRoute);

  readonly account$ = this.route.paramMap.pipe(
    switchMap((params) => this.data.getAccount(params.get('id') ?? ''))
  );

  currentDate(): string {
    return new Date().toISOString();
  }
}
