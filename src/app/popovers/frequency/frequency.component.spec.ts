import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrequencyPage } from './frequency.page';

describe('FrequencyPage', () => {
  let component: FrequencyPage;
  let fixture: ComponentFixture<FrequencyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrequencyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrequencyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
