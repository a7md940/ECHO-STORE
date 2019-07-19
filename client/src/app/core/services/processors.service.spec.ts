import { TestBed } from '@angular/core/testing';

import { ProcessorsService } from './processors.service';

describe('ProcessorsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProcessorsService = TestBed.get(ProcessorsService);
    expect(service).toBeTruthy();
  });
});
