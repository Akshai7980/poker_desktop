import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { TourneyThemeTablePreviewComponent } from './tourney-theme-table-preview.component';

describe('TourneyThemeTablePreviewComponent', () => {
  let component: TourneyThemeTablePreviewComponent;
  let fixture: ComponentFixture<TourneyThemeTablePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TourneyThemeTablePreviewComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TourneyThemeTablePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
