import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { NetworkService } from 'projects/shared/src/public-api';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Dialog } from '@angular/cdk/dialog';
import { BonusComponent } from './bonus.component';

describe('BonusComponent', () => {
  let component: BonusComponent;
  let fixture: ComponentFixture<BonusComponent>;
  let mockRouter: Partial<Router>;

  beforeEach(async () => {
    mockRouter = {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };

    await TestBed.configureTestingModule({
      declarations: [BonusComponent],
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
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BonusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
