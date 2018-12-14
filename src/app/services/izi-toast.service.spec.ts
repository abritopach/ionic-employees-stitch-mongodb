import { TestBed } from '@angular/core/testing';

import { IziToastService } from './izi-toast.service';

describe('IziToastService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IziToastService = TestBed.get(IziToastService);
    expect(service).toBeTruthy();
  });
});
