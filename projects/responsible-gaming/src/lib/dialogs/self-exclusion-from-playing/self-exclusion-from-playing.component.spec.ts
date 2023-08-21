import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { SelfExclusionFromPlayingComponent } from './self-exclusion-from-playing.component';

describe('SelfExclusionFromPlayingComponent', () => {
  let component: SelfExclusionFromPlayingComponent;
  let fixture: ComponentFixture<SelfExclusionFromPlayingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelfExclusionFromPlayingComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        HttpClient,
        HttpHandler
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SelfExclusionFromPlayingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
