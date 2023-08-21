import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AppConstants } from 'projects/shared/src/public-api';
import { DialogRef } from '@angular/cdk/dialog';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AccountBlockedComponent } from './account-blocked.component';

describe('AccountBlockedComponent', () => {
  let component: AccountBlockedComponent;
  let fixture: ComponentFixture<AccountBlockedComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<AccountBlockedComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [AccountBlockedComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: DialogRef, useValue: {} },
        { provide: MatDialog, useValue: {} },
        HttpClient,
        HttpHandler
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountBlockedComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set isAccountTemparyBlocked to true if data.data.type is AppConstants.TEMP_BLOCK_USER', () => {
    component.data = { data: { type: AppConstants.TEMP_BLOCK_USER } };
    component.ngOnInit();
    expect(component.isAccountTemparyBlocked).toBe(true);
  });

  it('should set isAccountTemparyBlocked to false if data.data.type is not AppConstants.TEMP_BLOCK_USER', () => {
    component.data = { data: { type: 'other' } };
    component.ngOnInit();
    expect(component.isAccountTemparyBlocked).toBe(false);
  });
});
