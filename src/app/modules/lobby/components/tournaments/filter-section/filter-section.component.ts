import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  OnDestroy,
  OnInit
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { LobbyService, MATDIALOG, Paths } from 'projects/shared/src/public-api';
import { FiltersComponent } from '../../../dialogs/filters/filters.component';
import { TournamentScheduleComponent } from '../../../dialogs/tournament-schedule/tournament-schedule.component';
import { MyTicketsAndOffersComponent } from '../../../dialogs/my-tickets-and-offers/my-tickets-and-offers.component';

@Component({
  selector: 'app-filter-section',
  templateUrl: './filter-section.component.html',
  styleUrls: ['./filter-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterSectionComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'd-flex flex-column flex-1 ovf-y-auto';

  funnelFilled: boolean;

  assetsImagePath = Paths.imagePath;

  isFilterApplied: boolean = false;

  subscriptions: Subscription[] = [];

  constructor(
    public dialog: MatDialog,
    private lobbyService: LobbyService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const filterSub = this.lobbyService.isTournamentFilterSelected.subscribe((val: boolean) => {
      this.isFilterApplied = val;
      this.cdr.detectChanges();
    });

    this.subscriptions.push(filterSub);
  }

  selectedIndex: number | null = 0;

  tournamentTabs: any[] = [
    'All',
    'Featured',
    'Freeroll',
    'Satellite',
    'Guaranted',
    'Godfather',
    'DPT',
    'Nano Poker Series'
  ];

  openMyTicketsAndOffersDialog() {
    this.dialog.open(MyTicketsAndOffersComponent, MATDIALOG.myTicketsAndOffersDialog);
  }

  openScheduleDialog() {
    this.dialog.open(TournamentScheduleComponent, MATDIALOG.tournamentScheduleDialog);
  }

  openFilterDialog() {
    this.dialog.open(FiltersComponent, {
      ...MATDIALOG.filterDialog,
      data: { from: 'TOURNAMENTS' }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
