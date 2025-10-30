import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

import { DetailPageComponent } from './detail-page.component';
import { InMemoryDataService } from '../../../core/data/in-memory-data.service';

@Component({
  selector: 'app-opportunity-detail-page',
  standalone: true,
  imports: [CommonModule, DetailPageComponent],
  template: `
    <app-detail-page
      *ngIf="opportunity$ | async as opportunity"
      [header]="{
        titulo: opportunity.nombre,
        estado: opportunity.etapa,
        propietario: opportunity.propietario,
        monto: opportunity.monto,
        fechaCierre: opportunity.cierrePrevisto
      }"
      [properties]="[
        { label: 'Cuenta', value: opportunity.cuenta },
        { label: 'Fuente', value: opportunity.fuente },
        { label: 'Territorio', value: opportunity.territorio }
      ]"
      [timeline]="[
        { fecha: opportunity.cierrePrevisto, titulo: 'Cierre previsto', descripcion: 'Seguimiento programado' }
      ]"
    ></app-detail-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpportunityDetailPageComponent {
  readonly opportunity$ = this.route.paramMap.pipe(
    switchMap((params) => this.data.getOpportunity(params.get('id') ?? ''))
  );

  constructor(private readonly data: InMemoryDataService, private readonly route: ActivatedRoute) {}
}
