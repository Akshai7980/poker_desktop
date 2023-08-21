import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

import { BaseResponse } from 'projects/shared/src/public-api';
import { ManageCardsComponent } from './manage-cards.component';
import { ActionDialogComponent } from '../action-dialog/action-dialog.component';
import { ProfileService } from '../../services/profile.service';
import { GetSavedCardsRes } from '../../models/response/get-saved-cards-response';
import { MATDIALOG } from '../../constants/dialog.constants';

describe('ManageCardsComponent', () => {
  let component: ManageCardsComponent;
  let fixture: ComponentFixture<ManageCardsComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let profileServiceSpy: jasmine.SpyObj<ProfileService>;
  let mockMatDialogRef: jasmine.SpyObj<MatDialogRef<ManageCardsComponent>>;

  beforeEach(waitForAsync(() => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    profileServiceSpy = jasmine.createSpyObj('ProfileService', [
      'getSavedCards',
      'toggleAnimationDialog'
    ]);
    mockMatDialogRef = jasmine.createSpyObj('MatDialogRef', ['']);

    TestBed.configureTestingModule({
      declarations: [ManageCardsComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: ProfileService, useValue: profileServiceSpy },
        { provide: MatDialogRef, useValue: mockMatDialogRef }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCardsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize cards array and call getCardDetails on ngOnInit', () => {
    const cardDetails = {
      cardId: 'tkn_0f8f8359c2c14528850857d82e0e764a',
      cardNumber: '5555-XXXXXXXX-4469',
      cardType: 'CREDIT',
      cardIssuer: '',
      cardBrand: 'MASTERCARD'
    };
    const getSavedCardsRes: BaseResponse<GetSavedCardsRes> = {
      code: 200,
      message: 'Success',
      data: {
        list: [cardDetails]
      }
    };

    profileServiceSpy.getSavedCards.and.returnValue(of(getSavedCardsRes));

    component.ngOnInit();

    expect(profileServiceSpy.getSavedCards).toHaveBeenCalled();
    expect(component.allSavedCards).toEqual(getSavedCardsRes.data.list);
  });

  it('should open the action dialog and delete the card on success', () => {
    const card = 'tkn_ade61eb9c9944544b8eeb79b72daf10e';
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({ message: 'Success' }) });
    dialogSpy.open.and.returnValue(dialogRefSpyObj);

    component.openActionDialog(card);

    expect(dialogSpy.open).toHaveBeenCalledWith(ActionDialogComponent, {
      data: card,
      ...MATDIALOG.actionDialog
    });
    expect(dialogRefSpyObj.afterClosed).toHaveBeenCalled();
    expect(component.isShowToast).toBeTrue();
    expect(component.toastValue).toEqual({
      message: 'Success',
      flag: 'error'
    });
  });
});
