import { Dialog } from '@angular/cdk/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'projects/shared/src/lib/services/auth.service';
import { CoreCommonService } from 'src/app/core/services/core-common.service';

import { WelcomeScreenComponent } from './welcome-screen.component';

describe('WelcomeScreenComponent', () => {
  let component: WelcomeScreenComponent;
  let fixture: ComponentFixture<WelcomeScreenComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let commonServiceSpy: jasmine.SpyObj<CoreCommonService>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;
  let dialogRef: MatDialogRef<WelcomeScreenComponent>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getBonusDetails']);
    commonServiceSpy = jasmine.createSpyObj('CommonService', ['navigateTo']);
    matDialogSpy = jasmine.createSpyObj('MatDialog', ['closeAll', 'open']);

    await TestBed.configureTestingModule({
      declarations: [WelcomeScreenComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: CoreCommonService, useValue: commonServiceSpy },
        { provide: MatDialog, useValue: matDialogSpy },
        {
          provide: MatDialogRef,
          useValue: { close: () => {} }
        },
        { provide: Dialog, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeScreenComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('onClose should close the dialog', () => {
    spyOn(dialogRef, 'close');
    component.onClose();
    expect(dialogRef.close).toHaveBeenCalledWith();
  });
});
