import { TestBed } from '@angular/core/testing';

import { StitchMongoService } from './stitch-mongo.service';

describe('StitchMongoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StitchMongoService = TestBed.get(StitchMongoService);
    expect(service).toBeTruthy();
  });
});
