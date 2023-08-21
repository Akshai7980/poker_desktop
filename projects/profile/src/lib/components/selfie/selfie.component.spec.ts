import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatStepper } from '@angular/material/stepper';
import { SpinnerService } from 'projects/shared/src/public-api';
import { ProfileService } from '../../services/profile.service';
import { SelfieComponent } from './selfie.component';

describe('SelfieComponent', () => {
  let component: SelfieComponent;
  let fixture: ComponentFixture<SelfieComponent>;

  const dummyMatStepper: Partial<MatStepper> = {
    next: () => {}
  };

  beforeEach(() => {
    const profileServiceSpyObj = jasmine.createSpyObj('ProfileService', [
      'getSelfieDetails',
      'uploadSelfie'
    ]);
    const spinnerServiceSpyObj = jasmine.createSpyObj('SpinnerService', ['open', 'close']);

    TestBed.configureTestingModule({
      declarations: [SelfieComponent],
      providers: [
        { provide: MatStepper, useValue: dummyMatStepper },
        { provide: ProfileService, useValue: profileServiceSpyObj },
        { provide: SpinnerService, useValue: spinnerServiceSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SelfieComponent);
    component = fixture.componentInstance;

    spyOn(navigator.mediaDevices, 'getUserMedia').and.returnValue(
      Promise.resolve({
        getTracks: () => [{ stop: () => {} }]
      } as MediaStream)
    );
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should convert base64 to File', () => {
    const base64Data =
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/4QBARXhpZgAATU0AKgAAAAgAAUAAEAA';
    const file = component.convertBase64ToFile(base64Data);
    expect(file instanceof File).toBeTrue();
    expect(file.name).toBe('selfie.jpg');
    expect(file.type).toBe('image/jpeg');
  });

  afterEach(() => {
    fixture.destroy();
  });
});
