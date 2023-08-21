import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { ToastModel } from 'projects/shared/src/lib/models/common/toast.model';
import { UserPreferencesService } from 'projects/shared/src/lib/services/user-preferences.service';
import { WindowCommService } from 'projects/shared/src/lib/services/window-comm.service';
import {
  BroadcastService,
  MessageConstant,
  SettingsConstants,
  SettingsService,
  SfsRequestService,
  UserAccountService,
  UtilityService
} from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';

import { SettingsModelNew } from '../../models/settings-new.model';

@Component({
  selector: 'app-settings-sound',
  templateUrl: './settings-sound.component.html'
})
export class SettingsSoundComponent extends SettingsModelNew implements OnInit, OnDestroy {
  @HostBinding('class') class = 'd-flex flex-column flex-1 pt-1 px-4 pb-4 ovf-y-auto';

  toastValue: ToastModel;

  override gameSoundObj: any = {};

  private subscription: Subscription;

  isShowToast: boolean = false;

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
    /** Set Games Object */
    this.subscription = this.settingsService.userPref.subscribe(
      (params: UserPreferencesService) => {
        /** parse and stringify is used to deep copy the object without creating reference */
        this.gameSoundObj = JSON.parse(JSON.stringify(params.gameSoundPrefObj));
      }
    );
  }

  override ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onSave() {
    this.isShowToast = true;
    this.toastValue = {
      message: MessageConstant.savedSuccessMessage,
      flag: SettingsConstants.Flag.SUCCESS
    };
  }
}
