import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  Paths,
  BaseResponse,
  NoOfHandsResponse,
  LobbyService,
  SpinnerService
} from 'projects/shared/src/public-api';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoComponent implements OnInit, OnDestroy {
  timer: ReturnType<typeof setInterval> | undefined;

  noOfHands: NoOfHandsResponse = {} as NoOfHandsResponse;

  assetsImagePath = Paths.imagePath;

  constructor(
    private lobbyService: LobbyService,
    private spinnerService: SpinnerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.timerEnabled();
    this.getNoOfHandsInfo();
  }

  timerEnabled() {
    this.timer = setInterval(() => {
      this.spinnerService.close();
      this.spinnerService.resetSpinnerData();
      this.getNoOfHandsInfo();
    }, 60000);
  }

  getNoOfHandsInfo() {
    if (this.noOfHands) {
      this.noOfHands.tableCount = 0;
      this.noOfHands.userCount = 0;
    }
    this.lobbyService.getNoOfHandsData().subscribe((resp: BaseResponse<NoOfHandsResponse>) => {
      this.noOfHands = resp.data;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  tableCrousels: any[] = [
    {
      imageSrc: 'banner.svg'
    },
    {
      imageSrc: 'banner.svg'
    },
    {
      imageSrc: 'banner.svg'
    }
  ];
}
