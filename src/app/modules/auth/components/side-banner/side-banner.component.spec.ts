import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from 'projects/shared/src/lib/services/auth.service';
import { LocalStorageService } from 'projects/shared/src/lib/services/local-storage.service';
import { CoreCommonService } from 'src/app/core/services/core-common.service';
import { ContactUsComponent } from 'src/app/modules/contact-us/contact-us/contact-us.component';

import { AvatarComponent } from '../avatar/avatar.component';
import { LoginComponent } from '../login/login.component';
import { SideBannerComponent } from './side-banner.component';

describe('SideBannerComponent', () => {
  let component: SideBannerComponent;
  let fixture: ComponentFixture<SideBannerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SideBannerComponent, AvatarComponent, ContactUsComponent, LoginComponent],
      imports: [MatDialogModule, HttpClientModule, BrowserAnimationsModule],
      providers: [
        LocalStorageService,
        AuthService,
        CoreCommonService,
        { provide: MatDialogRef, useValue: { close: () => {} } }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
