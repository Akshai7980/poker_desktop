import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ViewSummaryComponent } from './view-summary.component';

describe('ViewSummaryComponent', () => {
  let component: ViewSummaryComponent;
  let fixture: ComponentFixture<ViewSummaryComponent>;
  let mockMatDialogRef: jasmine.SpyObj<MatDialogRef<ViewSummaryComponent>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewSummaryComponent],
      imports: [MatDialogModule],
      providers: [HttpClient, HttpHandler, { provide: MatDialogRef, useValue: mockMatDialogRef }]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
