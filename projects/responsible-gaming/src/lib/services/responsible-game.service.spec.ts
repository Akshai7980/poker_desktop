import { TestBed } from '@angular/core/testing';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { ResponsibleGameService } from './responsible-game.service';

describe('ResponsibleGameService', () => {
  let service: ResponsibleGameService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler]
    }).compileComponents();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponsibleGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
