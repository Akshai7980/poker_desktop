import { HttpClient } from '@angular/common/http';
import {
  Component,
  HostBinding,
  HostListener,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { Paths } from 'projects/shared/src/lib/constants/app-constants';
import { UserPreferencesService } from 'projects/shared/src/lib/services/user-preferences.service';
import {
  DataStorage,
  SettingsService,
  SfsCommService,
  SfsRequestService,
  SpinnerService
} from 'projects/shared/src/public-api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SettingsComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'd-flex flex-column hp100 pt-1 ovf-y-auto';

  assetsImagePath = Paths.imagePath;

  checked: boolean = false;

  checked1: boolean = false;

  checked2: boolean = false;

  checked3: boolean = false;

  checked4: boolean = false;

  checked5: boolean = false;

  checked6: boolean = false;

  checked7: boolean = false;

  checked8: boolean = false;

  enableSubStackBB: boolean = false;

  showStackBB: boolean = false;

  cashToggle: boolean = true;

  sngToggle: boolean = true;

  themeImges: any;

  subscription: Subscription;

  private dataStorage = DataStorage.getInstance();

  @HostListener('document:keydown.control.shift.r', ['$event'])
  @HostListener('document:keydown.control.r', ['$event'])
  onKeyCombinationPressed(event: KeyboardEvent) {
    event.preventDefault(); // Prevent the default browser behavior
  }

  constructor(
    private spinnerService: SpinnerService,
    private sfsCommService: SfsCommService,
    private sfsRequestService: SfsRequestService,
    public userPreferencesService: UserPreferencesService,
    private settingsService: SettingsService,
    public http: HttpClient,
    private titleService: Title,
    private router: Router
  ) {
    this.titleService.setTitle('Settings');
  }

  ngOnInit(): void {
    window.childWindow = {
      setData: this.setData.bind(this),
      setUserPreference: this.setUserPreference.bind(this),
      setSmartFox: this.setSmartFox.bind(this)
    };

    this.spinnerService.open();

    this.subscription = this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.sfsRequestService.getUserSettingsData();
        this.sfsRequestService.getHotKeysData();
        this.spinnerService.open();
        const navTimeout = setTimeout(() => {
          this.setUserPreference(this.userPreferencesService);
          this.spinnerService.close();
          clearTimeout(navTimeout);
        }, 2000);
      }
    });

    this.triggerLoadEventToParent();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  setUserPreference(userPreferencesService: UserPreferencesService) {
    this.userPreferencesService = userPreferencesService;
    this.settingsService.userPref.next(userPreferencesService);
  }

  setData(dataStorage: DataStorage, themeData: any) {
    this.sfsRequestService.setDataStorageObject(dataStorage);
    this.dataStorage = dataStorage;
    this.settingsService.themeData = themeData;
  }

  private setSmartFox(smartfox: any, childSFS2X: any) {
    this.dataStorage.sfs2X = childSFS2X;
    this.sfsCommService.removeSfsListeners();
    this.sfsCommService.sfs = smartfox;
    this.dataStorage.sfs = smartfox;
    this.sfsCommService.addSfsListeners();

    const timeOut = setTimeout(() => {
      this.sfsRequestService.getHotKeysData();
      this.sfsRequestService.getUserSettingsData();
      this.spinnerService.close();
      this.spinnerService.resetSpinnerData();
      clearTimeout(timeOut);
    }, 1000);
  }

  triggerLoadEventToParent() {
    const loadEvent = new CustomEvent('ngLoad');
    window.dispatchEvent(loadEvent);
  }
}
