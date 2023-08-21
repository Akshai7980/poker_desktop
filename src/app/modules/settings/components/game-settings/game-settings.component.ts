import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Paths } from 'projects/shared/src/lib/constants/app-constants';
import {
  BroadcastService,
  SettingsService,
  SfsRequestService,
  UserAccountService,
  UtilityService
} from 'projects/shared/src/public-api';

import { WindowCommService } from 'projects/shared/src/lib/services/window-comm.service';
import { UserPreferencesService } from 'projects/shared/src/lib/services/user-preferences.service';
import { SettingsModelNew } from '../../models/settings-new.model';

@Component({
  selector: 'app-game-settings',
  templateUrl: './game-settings.component.html',
  styleUrls: ['./game-settings.component.scss']
})
export class GameSettingsComponent extends SettingsModelNew implements OnInit, OnDestroy {
  @HostBinding('class') class = 'd-flex flex-column flex-1 pt-1 px-4 pb-4 ovf-y-auto';

  showStackBB: boolean = false;

  cashToggle: boolean = true;

  sngToggle: boolean = true;

  enableSubStackBB: boolean = false;

  assetsImagePath = Paths.imagePath;

  subscription: Subscription;

  constructor(
    public override utilityService: UtilityService,
    public override http: HttpClient,
    public override windowCommService: WindowCommService,
    public override cdr: ChangeDetectorRef,
    public override userAccountService: UserAccountService,
    public override userPreferencesService: UserPreferencesService,
    public override sfsRequestService: SfsRequestService,
    public override broadcastService: BroadcastService,
    public override settingsService: SettingsService
  ) {
    super(
      utilityService,
      http,
      windowCommService,
      cdr,
      userAccountService,
      userPreferencesService,
      sfsRequestService,
      broadcastService
    );
  }

  ngOnInit(): void {
    super.OnInit();

    this.subscription = this.settingsService.userPref.subscribe(
      (userPreference: UserPreferencesService) => {
        this.userPreferencesService = userPreference;
        this.isShowOwnBalloon =
          (userPreference.ownChatBalloons.keyValue &&
            userPreference.ownChatBalloons.keyValue !== 'false') ||
          userPreference.ownChatBalloons.keyValue === 'true';
        this.isShowPlayersBalloon =
          (userPreference.playersChatBalloons.keyValue &&
            userPreference.playersChatBalloons.keyValue !== 'false') ||
          userPreference.playersChatBalloons.keyValue === 'true';
        this.showSendItemEmoji =
          (userPreference.showSendItemAnimation.keyValue &&
            userPreference.showSendItemAnimation.keyValue !== 'false') ||
          userPreference.showSendItemAnimation.keyValue === 'true';
        this.showExpressionEmoji =
          (userPreference.showEmojiAnimation.keyValue &&
            userPreference.showEmojiAnimation.keyValue !== 'false') ||
          userPreference.showEmojiAnimation.keyValue === 'true';
        this.isShowStacksinBBForCash = userPreference.showStackBBForCash;
        this.isShowStacksinBBForMtt = userPreference.showStackBBForMtt;
        this.isShowHandStrength = userPreference.showHandStrength;
        this.isAutoPostBBChecked = userPreference.autoPostBB;
        this.isAutoMuckChecked = userPreference.autoMuck;
        this.autoFocusOnTurn =
          (userPreference.autoFocusOnTurn.keyValue &&
            userPreference.autoFocusOnTurn.keyValue !== 'false') ||
          userPreference.autoFocusOnTurn.keyValue === 'true';
        if (
          !userPreference.showEmojiAnimation.keyValue &&
          !userPreference.showSendItemAnimation.keyValue &&
          !userPreference.ownChatBalloons.keyValue
        ) {
          this.showSendItemEmoji = true;
          this.showExpressionEmoji = true;
          this.isShowOwnBalloon = true;
          this.onChangesshowOwnChat();
          this.changeAnimationEmoji();
        }
      }
    );
  }

  override ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
