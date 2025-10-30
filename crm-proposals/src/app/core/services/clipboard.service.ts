import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ClipboardService {
  async copy(text: string): Promise<void> {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    }
  }

  async read(): Promise<string | undefined> {
    if (navigator.clipboard?.readText) {
      return navigator.clipboard.readText();
    }
    return undefined;
  }
}
