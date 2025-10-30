import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe, PercentPipe, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { combineLatest, map } from 'rxjs';

import { InMemoryDataService } from '../../../core/data/in-memory-data.service';
import { ActivityStateService } from '../../../core/services/activity-state.service';
import { KpiCardComponent } from '../kpi-card/kpi-card.component';
import { MiniChartComponent } from '../mini-chart/mini-chart.component';
import { DataTableComponent, DataTableColumn } from '../data-table/data-table.component';
import { I18nPipe } from '../../utils/i18n.pipe';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    KpiCardComponent,
    MiniChartComponent,
    DataTableComponent,
    I18nPipe,
    DatePipe,
    DecimalPipe,
    PercentPipe,
    CurrencyPipe
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent {
  private readonly data = inject(InMemoryDataService);
  private readonly activities = inject(ActivityStateService);

  readonly activities$ = this.activities.activities$;
  readonly opportunities$ = this.data.getOpportunities();

  readonly kpi$ = combineLatest([this.opportunities$, this.activities$]).pipe(
    map(([opportunities, activities]) => {
      const abiertas = opportunities.filter((item) => item.etapa !== 'Cierre').length;
      const total = opportunities.reduce((acc, item) => acc + item.monto, 0);
      const winRate = 0.31;
      const proximas = activities.filter((activity) => activity.estado === 'Pendiente').length;
      return { abiertas, total, winRate, proximas };
    })
  );

  readonly columns: DataTableColumn[] = [
    { key: 'asunto', title: 'Actividad', sortable: true, filterable: true },
    { key: 'tipo', title: 'Tipo', sortable: true },
    { key: 'fecha', title: 'Fecha', type: 'date', sortable: true },
    { key: 'cuenta', title: 'Cuenta', sortable: true },
    { key: 'estado', title: 'Estado', sortable: true }
  ];
}
