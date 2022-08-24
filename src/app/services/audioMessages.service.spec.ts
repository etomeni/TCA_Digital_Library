import { TestBed } from '@angular/core/testing';

import { AudioMessagesService } from './audioMessages.service';

describe('AudioMessagesService', () => {
  let service: AudioMessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioMessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
