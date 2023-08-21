import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { LocalStorageService } from 'projects/shared/src/lib/services/local-storage.service';

import { AvatarComponent } from './avatar.component';

describe('AvatarComponent', () => {
  let component: AvatarComponent;
  let fixture: ComponentFixture<AvatarComponent>;

  beforeEach(async () => {
    const localStorageSpyObj = jasmine.createSpyObj('LocalStorageService', ['getItem']);
    const dialogSpyObj = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
    const dialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);

    await TestBed.configureTestingModule({
      declarations: [AvatarComponent],
      providers: [
        { provide: LocalStorageService, useValue: localStorageSpyObj },
        { provide: MatDialog, useValue: dialogSpyObj },
        { provide: MatDialogRef, useValue: dialogRefSpyObj }
      ],
      imports: [HttpClientModule, MatDialogModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set selectedAvatar and isGoToLobby flag', () => {
    const id = '123';
    component.getAvatarId(id);
    expect(component.selectedAvatar).toEqual(id);
    expect(component.isGoToLobby).toBeFalse();
  });

  it('should set isGoToLobby flag when id is not provided', () => {
    const id: any = null;
    component.getAvatarId(id);
    expect(component.isGoToLobby).toBeTrue();
  });

  it('should close dialog when isGoToLobby is true', () => {
    component.isGoToLobby = true;
    component.startPlaying();
    expect(component.dialog.closeAll).toHaveBeenCalled();
  });
});
