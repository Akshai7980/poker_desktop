import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CashierComponent } from 'projects/cashier/src/public-api';
import { LocalStorageService } from 'projects/shared/src/lib/services/local-storage.service';
import {
  MATDIALOG,
  MatDialogService as MatDialogSharedService
} from 'projects/shared/src/public-api';
import { LoginComponent } from 'src/app/modules/auth/components/login/login.component';
import { ProfileComponent } from 'src/app/modules/profile/profile.component';

@Injectable({
  providedIn: 'root'
})
export class MatDialogService {
  constructor(
    public dialog: MatDialog,
    private localStorageService: LocalStorageService,
    private matDialogSharedService: MatDialogSharedService
  ) {}

  reOpenDialog(param: string) {
    let component:
      | typeof LoginComponent
      | typeof ProfileComponent
      | typeof CashierComponent
      | null = null;
    let dialogConfig;
    // Need Optimize it
    if (param === 'login') {
      if (!this.localStorageService.getItem('token')) {
        component = LoginComponent;
        dialogConfig = MATDIALOG.loginDialog;
      }
    } else if (param === 'profile') {
      component = ProfileComponent;
      dialogConfig = MATDIALOG.profileDialog;
    } else if (param === 'cashier') {
      component = CashierComponent;
      dialogConfig = MATDIALOG.cashierDialog;
    } else {
      component = LoginComponent;
      dialogConfig = MATDIALOG.loginDialog;
    }

    if (component && dialogConfig) {
      this.matDialogSharedService.openDialog(component, param, dialogConfig);
    }
  }
}
