import { TestBed, inject } from '@angular/core/testing';

import { LogHelperService } from './log-helper.service';

describe('LogHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogHelperService]
    });
  });

  it('should be created', inject([LogHelperService], (service: LogHelperService) => {
    expect(service).toBeTruthy();
  }));
});
