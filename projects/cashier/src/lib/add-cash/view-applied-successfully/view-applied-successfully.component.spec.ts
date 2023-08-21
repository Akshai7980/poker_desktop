import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SpecConstant } from 'projects/shared/src/lib/constants/spec.constants';
import {
  ViewAppliedSuccessfullyComponent,
  BonusDataModel
} from './view-applied-successfully.component';

describe('ViewAppliedSuccessfullyComponent', () => {
  let component: ViewAppliedSuccessfullyComponent;
  let fixture: ComponentFixture<ViewAppliedSuccessfullyComponent>;
  const mockDialogRef = jasmine.createSpyObj<MatDialogRef<ViewAppliedSuccessfullyComponent>>([
    'close'
  ]);
  const { bonusCode } = SpecConstant.cashier.requests;
  const mockData: BonusDataModel = { bonusCode };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewAppliedSuccessfullyComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAppliedSuccessfullyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog on calling close()', () => {
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
