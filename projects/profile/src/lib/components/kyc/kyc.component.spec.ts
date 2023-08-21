import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { KycComponent } from './kyc.component';

describe('KycComponent', () => {
  let component: KycComponent;
  let fixture: ComponentFixture<KycComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatDialogModule],
      declarations: [KycComponent],
      providers: [HttpClient, HttpHandler]
    }).compileComponents();

    fixture = TestBed.createComponent(KycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show DL section when DL is selected', () => {
    component.selectedDocument = { code: 'DL', name: '' };
    component.onSelectDocument();
    expect(component.showDL).toBe(true);
    expect(component.showAadhaar).toBe(false);
  });

  it('should show Aadhaar section when Aadhaar is selected', () => {
    component.selectedDocument = { code: 'Aadhaar', name: '' };
    component.onSelectDocument();
    expect(component.showAadhaar).toBe(false);
    expect(component.showDL).toBe(true);
  });

  it('should set showImage to false and clear imageSrcFront when side is Front', () => {
    component.showImage = true;
    component.imageSrcFront = 'some-image-src';
    component.onDelete('Front');
    expect(component.showImage).toBe(false);
    expect(component.imageSrcFront).toBe('');
  });

  it('should clear imageSrcBack when side is Back', () => {
    component.imageSrcBack = 'some-image-src';
    component.onDelete('Back');
    expect(component.imageSrcBack).toBe('');
  });
});
