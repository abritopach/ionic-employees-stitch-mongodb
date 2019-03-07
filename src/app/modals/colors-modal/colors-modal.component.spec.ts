import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorsModalPage } from './colors-modal.page';

describe('ColorsModalPage', () => {
  let component: ColorsModalPage;
  let fixture: ComponentFixture<ColorsModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorsModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorsModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
