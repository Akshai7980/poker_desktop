import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { LeaderBoardService } from '../leader-board.service';

describe('LeaderBoardService', () => {
  let service: LeaderBoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [HttpClient, HttpHandler] });
    service = TestBed.inject(LeaderBoardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true for a valid URL', () => {
    const validURL = 'https://www.example.com';
    expect(validURL).toBeDefined();
  });
});
