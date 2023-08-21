import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { IconsLegendComponent } from './icons-legend.component';

describe('IconsLegendComponent', () => {
  let component: IconsLegendComponent;
  let fixture: ComponentFixture<IconsLegendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IconsLegendComponent],
      imports: [MatDialogModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {}
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IconsLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
