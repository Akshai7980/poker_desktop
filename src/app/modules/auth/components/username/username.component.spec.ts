import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'projects/shared/src/lib/services/auth.service';
import { LocalStorageService } from 'projects/shared/src/lib/services/local-storage.service';

import { UsernameComponent } from './username.component';

describe('UsernameComponent', () => {
  let component: UsernameComponent;
  let fixture: ComponentFixture<UsernameComponent>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserName']);
    const localStorageServiceSpy = jasmine.createSpyObj('LocalStorageService', [
      'getItem',
      'setItem'
    ]);
    const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [UsernameComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: LocalStorageService, useValue: localStorageServiceSpy },
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: MatDialogRef, useValue: matDialogRefSpy }
      ]
    });

    fixture = TestBed.createComponent(UsernameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update the userName and enable the submit button', () => {
    const newUserName = 'johndoe123';
    component.changeUserName(newUserName);
    expect(component.userName).toEqual(newUserName);
    expect(component.disableSubmitBtn).toBe(false);
  });

  it('should enable submit button if username is valid', () => {
    component.validateUserName('john');
    expect(component.disableSubmitBtn).toBe(false);
  });

  it('should disable submit button if username contains special characters', () => {
    component.validateUserName('joh#n');
    expect(component.disableSubmitBtn).toBe(true);
  });

  it('should disable submit button if username contains less than 3 characters', () => {
    component.validateUserName('jo');
    expect(component.disableSubmitBtn).toBe(true);
  });

  it('should disable submit button if username contains more than 20 characters', () => {
    component.validateUserName('johnsmithjohndoejohnson');
    expect(component.disableSubmitBtn).toBe(true);
  });
});
