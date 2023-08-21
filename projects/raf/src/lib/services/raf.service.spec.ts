import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { RAFService } from './raf.service';

describe('LeaderBoardService', () => {
  let service: RAFService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [HttpClient, HttpHandler] });
    service = TestBed.inject(RAFService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
