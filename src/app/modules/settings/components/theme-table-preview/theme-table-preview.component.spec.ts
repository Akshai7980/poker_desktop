import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ThemeTablePreviewComponent } from './theme-table-preview.component';

describe('ThemeTablePreviewComponent', () => {
  let component: ThemeTablePreviewComponent;
  let fixture: ComponentFixture<ThemeTablePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThemeTablePreviewComponent],
      imports: [MatDialogModule],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }]
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeTablePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
