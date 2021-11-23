import { TestBed } from '@angular/core/testing';

import { DetailPageService } from './detail-page.service';

describe('DetailPageService', () => {
  let service: DetailPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
