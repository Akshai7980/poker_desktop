import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InfoPopupComponent } from './info-popup.component';

describe('InfoPopupComponent', () => {
  let component: InfoPopupComponent;
  let fixture: ComponentFixture<InfoPopupComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<InfoPopupComponent>>;

  beforeEach(async () => {
    const dialogMock = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [InfoPopupComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPopupComponent);
    component = fixture.componentInstance;
    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<InfoPopupComponent>>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call dialogRef.close with true when userConsent is called with true', () => {
    component.userConsent(true);
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('should call dialogRef.close with false when userConsent is called with false', () => {
    component.userConsent(false);
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });
});
