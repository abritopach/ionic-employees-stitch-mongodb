import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestHolidaysModalComponent } from './request-holidays-modal.component';

describe('RequestHolidaysModalComponent', () => {
  let component: RequestHolidaysModalComponent;
  let fixture: ComponentFixture<RequestHolidaysModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestHolidaysModalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestHolidaysModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
