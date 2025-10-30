import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-saved-views',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './saved-views.component.html',
  styleUrl: './saved-views.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SavedViewsComponent {
  readonly views$ = new BehaviorSubject(
    ['Q1 Enterprise', 'Calientes > 100k', 'En riesgo', 'Territorio Norte'].map((name) => ({
      name,
      active: false
    }))
  );

  activate(viewName: string): void {
    const updated = this.views$.value.map((view) => ({
      ...view,
      active: view.name === viewName
    }));
    this.views$.next(updated);
  }
}
