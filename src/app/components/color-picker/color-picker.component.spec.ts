import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPickerPage } from './color-picker.page';

describe('ColorPickerPage', () => {
  let component: ColorPickerPage;
  let fixture: ComponentFixture<ColorPickerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorPickerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPickerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
