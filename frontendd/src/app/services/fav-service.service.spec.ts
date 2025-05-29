import { TestBed } from '@angular/core/testing';

import { FavServiceService } from './fav-service.service';

describe('FavServiceService', () => {
  let service: FavServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
