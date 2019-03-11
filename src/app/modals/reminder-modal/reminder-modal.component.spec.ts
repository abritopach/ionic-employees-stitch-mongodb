import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReminderModalPage } from './reminder-modal.page';

describe('ReminderModalPage', () => {
  let component: ReminderModalPage;
  let fixture: ComponentFixture<ReminderModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReminderModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReminderModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
