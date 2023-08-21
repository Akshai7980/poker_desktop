import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { NetworkService } from 'projects/shared/src/public-api';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { KycPendingComponent } from './kyc-pending.component';

describe('KycPendingComponent', () => {
  let component: KycPendingComponent;
  let fixture: ComponentFixture<KycPendingComponent>;
  let mockRouter: Partial<Router>;

  beforeEach(async () => {
    mockRouter = {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };

    await TestBed.configureTestingModule({
      declarations: [KycPendingComponent],
      imports: [HttpClientModule],
      providers: [
        NetworkService,
        {
          provide: Router,
          useValue: mockRouter
        },
        FormBuilder,
        { provide: MatDialog, useValue: {} },
        { provide: Dialog, useValue: {} },
        { provide: ActivatedRoute, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: DialogRef, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(KycPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
