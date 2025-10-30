import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideForms } from '@angular/forms';
import { provideZoneChangeDetection } from '@angular/core';

import { appRoutes } from './app/app.routes';
import { AppShellComponent } from './app/app-shell/app-shell.component';
import { ThemeService } from './app/core/services/theme.service';

bootstrapApplication(AppShellComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    provideForms(),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptorsFromDi()),
    ThemeService
  ]
}).catch((err) => console.error(err));
