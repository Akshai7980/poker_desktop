import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClient, HttpHandler } from '@angular/common/http';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { PokerProfileComponent } from './profile.component';

describe('PokerProfileComponent', () => {
  let component: PokerProfileComponent;
  let fixture: ComponentFixture<PokerProfileComponent>;
  let mockMatDialogRef: jasmine.SpyObj<MatDialogRef<PokerProfileComponent>>;

  beforeEach(async () => {
    const dialogSpyObj = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
    mockMatDialogRef = jasmine.createSpyObj('MatDialogRef', ['']);
    await TestBed.configureTestingModule({
      declarations: [PokerProfileComponent],
      imports: [MatDialogModule],
      providers: [
        HttpClient,
        HttpHandler,
        { provide: MatDialog, useValue: dialogSpyObj },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: mockMatDialogRef }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PokerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update currentActiveProfilePost with the given title', () => {
    const title = 'Lorem ipsum';
    component.onClickProfiles(title);
    expect(component.currentActiveProfilePost).toEqual(title);
  });

  it('should toggle editProfile when passed "editProfile"', () => {
    component.editProfile = false;
    component.preJump('editProfile');
    expect(component.editProfile).toBe(true);
  });

  it('should toggle chooseAvatar when passed "chooseAvatar"', () => {
    component.chooseAvatar = false;
    component.preJump('chooseAvatar');
    expect(component.chooseAvatar).toBe(true);
  });

  it('should toggle profileCompleteBlackScreen when passed "profileCompleteBlackScreen"', () => {
    component.profileCompleteBlackScreen = false;
    component.preJump('profileCompleteBlackScreen');
    expect(component.profileCompleteBlackScreen).toBe(true);
  });

  it('should update the profileStepsTitle and currentActiveProfilePost when profile steps change', () => {
    const instance = component;
    instance.profileStepsTitle = 'Personal Details';
    instance.currentActiveProfilePost = 'Personal Details';
    instance.showProfilesList = true;
    instance.whenProfileStepsChanges(1);
    expect(instance.profileStepsTitle).toBe('Document Verification');
    expect(instance.currentActiveProfilePost).toBe('Personal Details');
    expect(instance.showProfilesList).toBe(true);
    instance.whenProfileStepsChanges(2);
    expect(instance.profileStepsTitle).toBe('Bank A/C Details');
    expect(instance.currentActiveProfilePost).toBe('Personal Details');
    expect(instance.showProfilesList).toBe(true);
  });

  it('should update showProfilesList', () => {
    const instance = component;
    instance.showProfilesList = true;
    instance.showProfileList(false);
    expect(instance.showProfilesList).toBe(false);
    instance.showProfileList(true);
    expect(instance.showProfilesList).toBe(true);
  });
});
