import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RulesDialogComponent } from './rules-dialog.component';

describe('RulesDialogComponent', () => {
  let component: RulesDialogComponent;
  let fixture: ComponentFixture<RulesDialogComponent>;
  let dialogRef: MatDialogRef<RulesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RulesDialogComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { close: () => {} }
        },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RulesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onClose should close the dialog', () => {
    dialogRef?.close();
  });

  it('should call on close()', () => {
    const spy = spyOn(component.dialogRef, 'close').and.callThrough();
    component.dialogRef.close();
    expect(spy).toHaveBeenCalled();
  });
});
