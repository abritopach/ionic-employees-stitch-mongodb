import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationChartComponent } from './organization-chart.component';

describe('OrganizationChartComponent', () => {
  let component: OrganizationChartComponent;
  let fixture: ComponentFixture<OrganizationChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
