import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { Paths } from 'projects/shared/src/lib/constants/app-constants';
import { BaseResponse, LoginResponseModel } from 'projects/shared/src/public-api';
import { AuthService } from 'projects/shared/src/lib/services/auth.service';

@Component({
  selector: 'app-geo-location-blocked',
  templateUrl: './geo-location-blocked.component.html'
})
export class GeoLocationBlockedComponent implements OnInit, OnDestroy {
  assetsImagePath = Paths.imagePath;

  isShareLocation: boolean = false;

  showGeoBlocked: boolean = true;

  enableIsBlock: boolean = false;

  isNotice: boolean = false;

  responseData: any = [];

  lat: number;

  long: number;

  subscriptions: Subscription[] = [];

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<GeoLocationBlockedComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      data: BaseResponse<LoginResponseModel>;
    },
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getLocation();

    this.isShareLocation = true;
  }

  onClose() {
    this.dialog.closeAll();
  }

  onBackArrowSelect() {
    this.dialogRef.close();
  }

  getUserLocation() {
    const sendLatAndLong = this.authService
      .sendLatAndLong(this.lat, this.long)
      .subscribe((resp: any) => {
        this.responseData = resp;
        if (resp.data.isBlock === false) {
          this.enableIsBlock = false;
          this.dialog.closeAll();
        } else if (resp.data.isBlock === true) {
          this.enableIsBlock = true;
          this.showGeoBlocked = false;
        }
      });
    this.subscriptions.push(sendLatAndLong);
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: any) => {
          if (position) {
            this.lat = position.coords.latitude;
            this.long = position.coords.longitude;
            this.isNotice = false;
            this.enableIsBlock = false;
          }
        },
        () => {
          this.isNotice = true;
          this.showGeoBlocked = false;
        }
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
