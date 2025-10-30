import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
    @if (opportunity$ | async; as opportunity) {
      <app-detail-page
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
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpportunityDetailPageComponent {
  private readonly data = inject(InMemoryDataService);
  private readonly route = inject(ActivatedRoute);

  readonly opportunity$ = this.route.paramMap.pipe(
    switchMap((params) => this.data.getOpportunity(params.get('id') ?? ''))
  );
}
