import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { ReferNowComponent } from './refer-now.component';

describe('ReferNowComponent', () => {
  let component: ReferNowComponent;
  let fixture: ComponentFixture<ReferNowComponent>;
  let mockMatDialogRef: jasmine.SpyObj<MatDialogRef<ReferNowComponent>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReferNowComponent],
      imports: [MatDialogModule],
      providers: [HttpClient, HttpHandler, { provide: MatDialogRef, useValue: mockMatDialogRef }]
    }).compileComponents();

    fixture = TestBed.createComponent(ReferNowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
