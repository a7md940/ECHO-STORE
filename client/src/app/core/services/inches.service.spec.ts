import { TestBed } from '@angular/core/testing';

import { InchesService } from './inches.service';

describe('InchesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InchesService = TestBed.get(InchesService);
    expect(service).toBeTruthy();
  });
});
