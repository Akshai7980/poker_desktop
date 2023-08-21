import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { LobbyService, MATDIALOG, Paths } from 'projects/shared/src/public-api';
import { AuthService } from 'projects/shared/src/lib/services/auth.service';
import { LocalStorageService } from 'projects/shared/src/lib/services/local-storage.service';
import { FiltersComponent } from '../../../dialogs/filters/filters.component';

@Component({
  selector: 'app-filter-section',
  templateUrl: './filter-section.component.html',
  styleUrls: ['./filter-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterSectionComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'd-flex flex-column flex-1 ovf-y-scroll';

  subscriptions: Subscription[] = [];

  assetsImagePath = Paths.imagePath;

  @Input() showFavorites: boolean = false;

  @Output() showFavoritesChange = new EventEmitter();

  @Output() ringVariant = new EventEmitter();

  selectedSubMenu: string;

  subMenus: string[] = ['Hold’em', 'PL Omaha', 'PLO 5', 'PLO 6', 'Crazy Pineapple'];

  starSelect: boolean = true;

  filters: any;

  isFilterSelected: boolean = false;

  isShowFavIcon: boolean = true;

  isUserLoggedIn: boolean;

  userLoggedIn: boolean;

  constructor(
    public dialog: MatDialog,
    private lobbyService: LobbyService,
    private changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.getFilters();
    const userSub = this.authService.userLoginStatusEmitter.subscribe((resp) => {
      if (resp) {
        this.isShowFavIcon = true;
      } else {
        this.isShowFavIcon = false;
        this.lobbyService.addFilters('reset');
      }
    });

    this.userLoggedIn = this.localStorageService.getItem('token');
    if (!this.userLoggedIn) {
      this.isShowFavIcon = false;
    } else {
      this.isShowFavIcon = true;
    }
    this.subscriptions.push(userSub);
    const filterSub = this.lobbyService.filterSelectionChange.subscribe((resp: boolean) => {
      this.isFilterSelected = resp;
      this.changeDetectorRef.detectChanges();
    });
    this.subscriptions.push(filterSub);
    [this.selectedSubMenu] = this.subMenus;
    this.ringVariant.emit(this.selectedSubMenu);
  }

  toggleFavorites() {
    this.showFavorites = !this.showFavorites;
    this.showFavoritesChange.emit(this.showFavorites);
  }

  openFilterDialog() {
    if (this.filters !== 'reset' && (!this.filters || (this.filters && this.filters.length <= 0))) {
      this.lobbyService.addFilters('reset');
    } else {
      this.lobbyService.addFilters(this.filters);
    }
    const dialogRef = this.dialog.open(FiltersComponent, {
      ...MATDIALOG.filterDialog,
      data: {
        from: 'CASH_GAMES',
        filters: this.lobbyService.lastSelectedFilter,
        selectedSubMenu: this.selectedSubMenu
      }
    });

    const dialogRefSub = dialogRef.afterClosed().subscribe((val) => {
      this.filters = val;
    });
    this.subscriptions.push(dialogRefSub);
  }

  getFilters() {
    const filterSub = this.lobbyService.getFilters().subscribe((filter: any) => {
      this.filters = filter;
      this.changeDetectorRef.detectChanges();
    });
    this.subscriptions.push(filterSub);
  }

  onClickSubMenu(sbm: string) {
    this.selectedSubMenu = sbm;
    this.ringVariant.emit(this.selectedSubMenu);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
