import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Subscription } from 'rxjs';
import { LobbyService, Paths } from 'projects/shared/src/public-api';
import { AuthService } from 'projects/shared/src/lib/services/auth.service';

@Component({
  selector: 'app-lobby-header',
  templateUrl: './lobby-header.component.html',
  styleUrls: ['./lobby-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LobbyHeaderComponent implements OnInit, OnDestroy {
  cashGamesBtnClicked: boolean = true;

  tournamentsBtnClicked: boolean = false;

  sitAndGoBtnClicked: boolean = false;

  privateTablesBtnClicked: boolean = false;

  @Output() OptionSelected = new EventEmitter();

  assetsImagePath = Paths.imagePath;

  subscriptions: Subscription[] = [];

  constructor(private authService: AuthService, public lobbyService: LobbyService) {}

  ngOnInit(): void {
    this.onOptionsSelected(1);
    const userSub = this.authService.isUserLoggingOut.subscribe((resp) => {
      if (resp) {
        this.onOptionsSelected(1);
      }
    });
    this.subscriptions.push(userSub);

    const selectedTabAndDataSub = this.lobbyService
      .getSelectedTabAndData()
      .subscribe((res: any) => {
        const { selectedTab } = res;
        this.onOptionsSelected(selectedTab);
      });
    this.subscriptions.push(selectedTabAndDataSub);
  }

  onOptionsSelected(optionId: number) {
    this.cashGamesBtnClicked = false;
    this.tournamentsBtnClicked = false;
    this.sitAndGoBtnClicked = false;
    this.privateTablesBtnClicked = false;

    if (optionId === 1) this.cashGamesBtnClicked = true;
    else if (optionId === 2) this.tournamentsBtnClicked = true;
    else if (optionId === 3) this.sitAndGoBtnClicked = true;
    else this.privateTablesBtnClicked = true;

    this.OptionSelected.emit(optionId);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
