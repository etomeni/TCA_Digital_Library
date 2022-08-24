import { TestBed } from '@angular/core/testing';

import { LiveRadioService } from './live-radio.service';

describe('LiveRadioService', () => {
  let service: LiveRadioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiveRadioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
