import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { BaseResponse, NetworkService } from 'projects/shared/src/public-api';
import { HandHistoryService } from './hand-history.service';

describe('HandHistoryService', () => {
  let service: HandHistoryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HandHistoryService]
    });
    service = TestBed.inject(HandHistoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

describe('HandHistoryService', () => {
  let handHistoryService: HandHistoryService;
  let mockResponse: BaseResponse<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HandHistoryService,
        {
          provide: NetworkService,
          useValue: jasmine.createSpyObj('networkService', ['call'])
        },
        HttpClient,
        HttpHandler
      ]
    });

    handHistoryService = TestBed.inject(HandHistoryService);
  });

  it('should return the API response', () => {
    const count = 10;
    const sDt = '2022-01-01';
    const eDt = '2022-01-31';
    const searchBy = 'player';
    const expectedResponse = mockResponse;

    handHistoryService
      .getHandHistoryData(count, sDt, eDt, searchBy)
      ?.subscribe((response) => expect(response).toEqual(expectedResponse), fail);
  });
});
