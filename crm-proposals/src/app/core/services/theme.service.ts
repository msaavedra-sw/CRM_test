import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly theme$ = new BehaviorSubject<'light' | 'dark'>('light');

  constructor(@Inject(DOCUMENT) private readonly documentRef: Document) {}

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
