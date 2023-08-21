import { Injectable } from '@angular/core';
import { LocalStorageService } from 'projects/shared/src/lib/services/local-storage.service';
import { MATDIALOG, MatDialogService, SideMenu } from 'projects/shared/src/public-api';
import { LoginComponent } from 'src/app/modules/auth/components/login/login.component';

import { sideMenus } from '../static/data';

@Injectable({
  providedIn: 'root'
})
export class CoreCommonService {
  sideMenus: SideMenu[];

  constructor(
    private localStorageService: LocalStorageService,
    private matDialogService: MatDialogService
  ) {
    this.sideMenus = sideMenus;
  }

  loginForCTA(func: Function) {
    if (this.localStorageService.getItem('token')) {
      func();
    } else {
      this.matDialogService.openDialog(LoginComponent, 'login', MATDIALOG.loginDialog);
    }
  }
}
