import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly documentRef = inject(DOCUMENT);
  private readonly theme$ = new BehaviorSubject<'light' | 'dark'>('light');

  toggleTheme(): void {
    const next = this.theme$.value === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.theme$.next(theme);
    this.documentRef.documentElement.setAttribute('data-theme', theme);
  }

  themeChanges() {
    return this.theme$.asObservable();
  }
}
