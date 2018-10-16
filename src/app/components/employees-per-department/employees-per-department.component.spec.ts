import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesPerDepartmentComponent } from './employees-per-department.component';

describe('EmployeesPerDepartmentComponent', () => {
  let component: EmployeesPerDepartmentComponent;
  let fixture: ComponentFixture<EmployeesPerDepartmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeesPerDepartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesPerDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
