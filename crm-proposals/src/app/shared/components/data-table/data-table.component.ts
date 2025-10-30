import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { BehaviorSubject, combineLatest, map, startWith } from 'rxjs';

import { ColumnResizeDirective } from '../../directives/column-resize.directive';
import { DragDropColumnsDirective } from '../../directives/drag-drop-columns.directive';
import { InlineEditCellComponent } from '../inline-edit-cell/inline-edit-cell.component';

type ColumnType = 'text' | 'number' | 'date' | 'select';

export interface DataTableColumn {
  key: string;
  title: string;
  type?: ColumnType;
  width?: number;
  pinned?: 'left' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  summary?: 'sum' | 'avg' | 'count';
  options?: Array<{ label: string; value: unknown }>;
}

interface SortState {
  key: string;
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    ColumnResizeDirective,
    DragDropColumnsDirective,
    InlineEditCellComponent,
    ScrollingModule
  ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent implements OnChanges, AfterViewInit {
  @Input() columns: DataTableColumn[] = [];
  @Input() data: Record<string, unknown>[] = [];
  @Input() pageSize = 50;
  @Input() density: 'compact' | 'regular' | 'spacious' = 'regular';
  @Input() enableColumnReorder = true;
  @Input() enableColumnResize = true;
  @Input() enableInlineEdit = true;
  @Input() keyboardShortcuts = true;
  @Output() cellEdited = new EventEmitter<{
    rowIndex: number;
    key: string;
    value: unknown;
    row: Record<string, unknown>;
  }>();
  @Output() rowSelected = new EventEmitter<{ row: Record<string, unknown>; index: number }>();

  @ViewChild(CdkVirtualScrollViewport) viewport?: CdkVirtualScrollViewport;

  readonly search$ = new BehaviorSubject<string>('');
  readonly columnFilters$ = new BehaviorSubject<Record<string, string>>({});
  readonly sort$ = new BehaviorSubject<SortState | null>(null);
  readonly page$ = new BehaviorSubject<number>(0);
  readonly selection$ = new BehaviorSubject<Set<number>>(new Set());
  readonly focusCell$ = new BehaviorSubject<{ row: number; col: number } | null>(null);

  readonly displayedColumns$ = new BehaviorSubject<DataTableColumn[]>([]);
  readonly rows$ = new BehaviorSubject<Record<string, unknown>[]>([]);

  readonly viewModel$ = combineLatest([
    this.rows$,
    this.displayedColumns$,
    this.search$,
    this.columnFilters$,
    this.sort$,
    this.page$
  ]).pipe(
    map(([rows, columns, search, columnFilters, sort, page]) => {
      const filtered = rows.filter((row) => {
        const searchLower = search.toLowerCase();
        const matchesSearch =
          !searchLower ||
          columns.some((column) =>
            String(row[column.key] ?? '')
              .toLowerCase()
              .includes(searchLower)
          );

        const matchesColumns = Object.entries(columnFilters).every(([key, value]) => {
          if (!value) {
            return true;
          }
          const cell = String(row[key] ?? '').toLowerCase();
          return cell.includes(value.toLowerCase());
        });

        return matchesSearch && matchesColumns;
      });

      const sorted = sort
        ? [...filtered].sort((a, b) => {
            const av = a[sort.key];
            const bv = b[sort.key];
            if (av === bv) {
              return 0;
            }
            if (av == null) {
              return 1;
            }
            if (bv == null) {
              return -1;
            }
            const result = av > bv ? 1 : -1;
            return sort.direction === 'asc' ? result : -result;
          })
        : filtered;

      const startIndex = page * this.pageSize;
      const paginated = sorted.slice(startIndex, startIndex + this.pageSize);

      const summaries = columns.map((column) => {
        if (!column.summary) {
          return null;
        }
        const values = sorted.map((row) => Number(row[column.key]) || 0);
        switch (column.summary) {
          case 'sum':
            return values.reduce((acc, value) => acc + value, 0);
          case 'avg':
            return values.reduce((acc, value) => acc + value, 0) / (values.length || 1);
          case 'count':
            return sorted.length;
          default:
            return null;
        }
      });

      return {
        columns,
        rows: paginated,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / this.pageSize),
        summaries
      };
    })
  );

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns']) {
      this.displayedColumns$.next([...(this.columns ?? [])]);
    }
    if (changes['data']) {
      this.rows$.next(this.data ?? []);
    }
  }

  ngAfterViewInit(): void {
    this.viewport?.scrolledIndexChange.pipe(startWith(0)).subscribe((index) => {
      this.focusCell$.next({ row: index, col: 0 });
    });
  }

  updateSearch(value: string): void {
    this.search$.next(value);
    this.page$.next(0);
  }

  updateColumnFilter(key: string, value: string): void {
    const next = { ...this.columnFilters$.value, [key]: value };
    this.columnFilters$.next(next);
    this.page$.next(0);
  }

  sortBy(column: DataTableColumn): void {
    if (!column.sortable) {
      return;
    }
    const current = this.sort$.value;
    if (current?.key === column.key) {
      this.sort$.next({ key: column.key, direction: current.direction === 'asc' ? 'desc' : 'asc' });
    } else {
      this.sort$.next({ key: column.key, direction: 'asc' });
    }
  }

  goToPage(page: number): void {
    this.page$.next(page);
    this.viewport?.scrollToIndex(page * this.pageSize);
  }

  dropColumns(event: CdkDragDrop<DataTableColumn[]>): void {
    if (!this.enableColumnReorder) {
      return;
    }
    const columns = [...this.displayedColumns$.value];
    moveItemInArray(columns, event.previousIndex, event.currentIndex);
    this.displayedColumns$.next(columns);
  }

  handleCellFocus(rowIndex: number, colIndex: number): void {
    this.focusCell$.next({ row: rowIndex, col: colIndex });
  }

  handleCellEdit(
    rowIndex: number,
    column: DataTableColumn,
    row: Record<string, unknown>,
    value: unknown
  ): void {
    this.cellEdited.emit({ rowIndex, key: column.key, value, row });
  }

  onRowClick(
    row: Record<string, unknown>,
    rowIndex: number,
    event: MouseEvent,
    totalRows: number
  ): void {
    const multi = event.ctrlKey || event.metaKey;
    if (event.shiftKey && this.selection$.value.size) {
      const last = Array.from(this.selection$.value).pop() ?? 0;
      const [start, end] = [Math.min(last, rowIndex), Math.max(last, rowIndex)];
      const range = Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
      this.selectRange(range);
    } else {
      this.toggleRowSelection(rowIndex, !multi);
    }
    this.rowSelected.emit({ row, index: rowIndex });
  }

  toggleRowSelection(rowIndex: number, single: boolean): void {
    const next = new Set(this.selection$.value);
    if (single) {
      next.clear();
    }
    if (next.has(rowIndex)) {
      next.delete(rowIndex);
    } else {
      next.add(rowIndex);
    }
    this.selection$.next(next);
  }

  selectRange(range: number[]): void {
    this.selection$.next(new Set(range));
  }

  clearSelection(): void {
    this.selection$.next(new Set());
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.keyboardShortcuts) {
      return;
    }
    const focus = this.focusCell$.value;
    if (!focus) {
      return;
    }
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusCell$.next({ row: focus.row + 1, col: focus.col });
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.focusCell$.next({ row: Math.max(focus.row - 1, 0), col: focus.col });
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.focusCell$.next({ row: focus.row, col: Math.min(focus.col + 1, this.columns.length - 1) });
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.focusCell$.next({ row: focus.row, col: Math.max(focus.col - 1, 0) });
        break;
      case 'Escape':
        this.clearSelection();
        break;
      default:
        break;
    }
  }

  mathMax(a: number, b: number): number {
    return Math.max(a, b);
  }

  mathMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement)?.value || '';
  }
}
