import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CsvService {
  exportToCsv(filename: string, rows: Record<string, unknown>[]): void {
    const csvContent = rows
      .map((row) =>
        Object.values(row)
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  parseCsv(text: string): string[][] {
    return text
      .trim()
      .split(/\r?\n/)
      .map((line) => line.split(','));
  }
}
