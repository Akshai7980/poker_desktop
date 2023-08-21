import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ToastModel } from 'projects/shared/src/lib/models/common/toast.model';
import { UserPreferencesService } from 'projects/shared/src/lib/services/user-preferences.service';
import { WindowCommService } from 'projects/shared/src/lib/services/window-comm.service';
import {
  BroadcastService,
  HotKey,
  HotKeySettings,
  MessageConstant,
  Paths,
  SettingsConstants,
  SettingsForSFSArray,
  SettingsForSFSModel,
  SettingsService,
  SfsRequestService,
  UserAccountService,
  UtilityService
} from 'projects/shared/src/public-api';

import { SettingsModelNew } from '../../models/settings-new.model';

@Component({
  selector: 'app-settings-hot-keys',
  templateUrl: './settings-hot-keys.component.html',
  styleUrls: ['./settings-hot-keys.component.scss']
})
export class SettingsHotKeysComponent extends SettingsModelNew implements OnInit {
  @HostBinding('class') class = 'd-flex flex-column flex-1 pt-1 px-4 pb-4 ovf-y-auto';

  assetsImagePath = Paths.imagePath;

  selectedAction: HotKey | undefined;

  toastValue: ToastModel;

  isShowToast: boolean = false;

  isChangeExists: boolean = false;

  enableAddBtn: boolean = false;

  showHotKeyList: boolean = false;

  hotKeySettings: HotKeySettings;

  dropDownList: HotKey[] = SettingsConstants.HOT_KEYS_DROPDOWN_LIST;

  isHotKeyPressed: boolean = false;

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
    this.map = {
      16: false // shift
    };
    this.hotKeySettings = new HotKeySettings(false, []);
    this.settingsService.hotKeySettingsFromParent.subscribe((resp: SettingsForSFSArray) => {
      this.hotKeySettings.setDataModel(resp);
      if (this.hotKeySettings.hotKeysList.find((item) => item.character !== '')) {
        this.showHotKeyList = true;
      }
    });
  }

  setKey() {
    if (this.selectedAction && this.assignedKey !== '') {
      if (this.hotKeySettings.hotKeysList.find((elem) => elem.character === this.assignedKey)) {
        this.isShowToast = true;
        this.toastValue = {
          message: MessageConstant.HotKeyAlreadyInUse,
          flag: 'error'
        };
      } else if (
        this.hotKeySettings.hotKeysList.find(
          (elem) => elem.actionTxt === this.selectedAction?.actionTxt
        )
      ) {
        this.hotKeySettings.hotKeysList = this.hotKeySettings.hotKeysList.map((element) => {
          if (element.actionTxt === this.selectedAction?.actionTxt) {
            const updatedElement = { ...element };
            updatedElement.character = this.assignedKey;
            return updatedElement;
          }
          return element;
        });

        this.selectedAction = {} as HotKey;
        this.assignedKey = '';
        this.enableAddBtn = false;
        this.isHotKeyPressed = false;
        this.onListChanged();
      } else {
        this.hotKeySettings.hotKeysList.push({
          actionTxt: this.selectedAction.actionTxt,
          character: this.assignedKey,
          keyName: this.selectedAction.keyName
        });
        this.selectedAction = {} as HotKey;
        this.assignedKey = '';
        this.enableAddBtn = false;
        this.isHotKeyPressed = false;
        this.onListChanged();
      }
    }
  }

  getCharFromASCII(asciiCode: number) {
    return String.fromCharCode(asciiCode);
  }

  showOutput(event: SelectItem & { keyName: string }) {
    if (this.selectedAction && this.assignedKey && this.assignedKey !== '') {
      this.enableAddBtn = true;
    } else this.enableAddBtn = false;

    const existedAction = this.hotKeySettings.hotKeysList.find((x) => x.keyName === event.keyName);
    if (existedAction?.character !== '') {
      this.assignedKey = existedAction?.character;
    } else if (!this.isHotKeyPressed) {
      this.assignedKey = '';
      this.enableAddBtn = false;
    }
  }

  removeHotKey(hotKey: HotKey) {
    const index = this.hotKeySettings.hotKeysList.indexOf(hotKey);
    this.hotKeySettings.hotKeysList.splice(index, 1);
    this.onListChanged();
  }

  saveHotKeySettings() {
    this.sfsRequestService.setHotKeysData(this.hotKeySettings.getDataModel());
    this.isChangeExists = false;
    this.isShowToast = true;
    this.toastValue = {
      message: MessageConstant.savedSuccessMessage,
      flag: SettingsConstants.Flag.SUCCESS
    };
  }

  onListChanged() {
    this.isChangeExists = true;
    if (this.hotKeySettings.hotKeysList.find((item) => item.character !== '')) {
      this.showHotKeyList = true;
    } else this.showHotKeyList = false;
  }

  isListChanged(list1: Array<SettingsForSFSModel>, list2: Array<HotKey>) {
    let changedItemCount = 0;
    list1.forEach((element) => {
      if (list2.find((item) => item.keyName === element.keyName)) {
        changedItemCount += 1;
      }
    });
    if (list1.length === changedItemCount && list2.length === changedItemCount) return false;
    return true;
  }

  toggleHotKeySettings() {
    this.isChangeExists = true;
    if (this.selectedAction && this.assignedKey && this.hotKeySettings.isHotKeysEnabled) {
      this.enableAddBtn = true;
    } else {
      this.enableAddBtn = false;
    }
  }

  onHotKeySelectionKeyDown(e: any) {
    const existedAction = this.hotKeySettings.hotKeysList.find(
      (x) => x.keyName === this.selectedAction?.keyName
    );
    if (existedAction?.character === e.key) {
      this.enableAddBtn = false;
      return;
    }

    /** preventing -, =  and f1 characters */
    if (e.keyCode === 189 || e.keyCode === 187 || e.keyCode === 173) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    this.isHotKeyPressed = true;
    let keynum: any;

    if (e.event) {
      /** IE */
      keynum = e.keyCode;
    } else if (e.which) {
      /** Netscape/Firefox/Opera */
      keynum = e.which;
    }
    /** Adding code TO make Numpad Working */
    if (keynum >= 96 && keynum <= 105) {
      keynum -= 48;
    }
    /** Adding code TO make Numpad Working */

    this.map[keynum] = true;
    let IsAlphaNumeric =
      (keynum >= 37 && keynum <= 40) ||
      (keynum >= 48 && keynum <= 57) ||
      (keynum >= 65 && keynum <= 90) ||
      keynum === 187 ||
      keynum === 189;
    if (keynum === 61 || keynum === 173) {
      IsAlphaNumeric = true;
    }
    if (IsAlphaNumeric) {
      if (this.map[16]) {
        this.assignedKey = 'Shift+';
      } else {
        this.assignedKey = '';
      }
      this.assignedKey += this.utilityService.getKeyNameFromKeyCode(keynum).toLowerCase();
      if (this.selectedAction) this.enableAddBtn = true;
      return;
    }
    if (keynum === 8) {
      this.assignedKey = '';
    }
    this.enableAddBtn = false;
  }

  onHotKeySelectionKeyUp(e: { keyCode: any; which: any }) {
    let keynum: any;
    if (e.keyCode) {
      /** IE */
      keynum = e.keyCode;
    } else if (e.which) {
      keynum = e.which;
    }
    if (keynum in this.map) {
      this.map[keynum] = false;
    }
  }
}
