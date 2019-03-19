import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DaysWeekPickerPage } from './days-week-picker.page';

describe('DaysWeekPickerPage', () => {
  let component: DaysWeekPickerPage;
  let fixture: ComponentFixture<DaysWeekPickerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaysWeekPickerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaysWeekPickerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
