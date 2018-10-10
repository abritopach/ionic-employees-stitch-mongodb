import { TestBed } from '@angular/core/testing';

import { StitchMongoServiceService } from './stitch-mongo-service.service';

describe('StitchMongoServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StitchMongoServiceService = TestBed.get(StitchMongoServiceService);
    expect(service).toBeTruthy();
  });
});
