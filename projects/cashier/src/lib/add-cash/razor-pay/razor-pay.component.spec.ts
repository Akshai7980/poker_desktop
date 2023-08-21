import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SpecConstant } from 'projects/shared/src/lib/constants/spec.constants';
import { NetworkService } from 'projects/shared/src/public-api';

import { CashierService } from '../../cashier.service';
import { RazorPayComponent } from './razor-pay.component';

describe('RazorPayComponent', () => {
  let component: RazorPayComponent;
  let fixture: ComponentFixture<RazorPayComponent>;
  let mockRouter: Partial<Router>;

  beforeEach(async () => {
    mockRouter = {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };

    await TestBed.configureTestingModule({
      declarations: [RazorPayComponent],
      imports: [HttpClientModule, MatDialogModule],
      providers: [
        CashierService,
        NetworkService,
        {
          provide: Router,
          useValue: mockRouter
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RazorPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to "addcash" on onClickBack()', () => {
    const { addcash } = SpecConstant.cashier.responses;
    component.onClickBack();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(addcash);
  });
});
