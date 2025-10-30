import { Routes } from '@angular/router';

import { DashboardPageComponent } from './shared/components/dashboard/dashboard-page.component';
import { OpportunitiesPageComponent } from './variants/variant-a/opportunities-page.component';
import { OpportunityDetailPageComponent } from './shared/components/detail/opportunity-detail-page.component';
import { AccountsPageComponent } from './variants/variant-a/accounts-page.component';
import { AccountDetailPageComponent } from './shared/components/detail/account-detail-page.component';
import { VariantAPageComponent } from './variants/variant-a/variant-a-page.component';
import { VariantBPageComponent } from './variants/variant-b/variant-b-page.component';
import { VariantCPageComponent } from './variants/variant-c/variant-c-page.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardPageComponent },
  {
    path: 'oportunidades',
    children: [
      { path: '', component: OpportunitiesPageComponent },
      { path: ':id', component: OpportunityDetailPageComponent }
    ]
  },
  {
    path: 'cuentas',
    children: [
      { path: '', component: AccountsPageComponent },
      { path: ':id', component: AccountDetailPageComponent }
    ]
  },
  { path: 'propuesta/a', component: VariantAPageComponent },
  { path: 'propuesta/b', component: VariantBPageComponent },
  { path: 'propuesta/c', component: VariantCPageComponent },
  { path: '**', redirectTo: 'dashboard' }
];
