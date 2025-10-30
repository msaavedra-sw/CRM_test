import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableComponent } from './data-table.component';

describe('DataTableComponent', () => {
  let component: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    component.columns = [{ key: 'nombre', title: 'Nombre' }];
    component.data = [{ nombre: 'Test' }];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit cell edit events', () => {
    const spy = jasmine.createSpy('cellEdited');
    component.cellEdited.subscribe(spy);
    component.handleCellEdit(0, { key: 'nombre', title: 'Nombre' }, { nombre: 'Test' }, 'Nuevo');
    expect(spy).toHaveBeenCalledWith({
      rowIndex: 0,
      key: 'nombre',
      value: 'Nuevo',
      row: { nombre: 'Test' }
    });
  });
});
