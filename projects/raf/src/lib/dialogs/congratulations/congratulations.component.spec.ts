import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CongratulationsComponent } from './congratulations.component';

describe('CongratulationsComponent', () => {
  let component: CongratulationsComponent;
  let fixture: ComponentFixture<CongratulationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CongratulationsComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }]
    }).compileComponents();

    fixture = TestBed.createComponent(CongratulationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
