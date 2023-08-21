import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { AvatarSelectionComponent } from './avatar-selection.component';

describe('AvatarSelectionComponent', () => {
  let component: AvatarSelectionComponent;
  let fixture: ComponentFixture<AvatarSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AvatarSelectionComponent],
      imports: [MatDialogModule],
      providers: [
        HttpClient,
        HttpHandler,
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialog, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('previous() should select the previous avatar in the list', () => {
    component.previous();
    expect(component.currentIndex).toBe(25);
  });

  it('next() should select the next avatar in the list', () => {
    component.next();
    expect(component.currentIndex).toBe(1);
  });
});
