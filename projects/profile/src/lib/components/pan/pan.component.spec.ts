import { Dialog } from '@angular/cdk/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { ProfileService } from '../../services/profile.service';
import { PanComponent } from './pan.component';

describe('PanComponent', () => {
  let component: PanComponent;
  let fixture: ComponentFixture<PanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatDialogModule],
      declarations: [PanComponent],
      providers: [
        HttpClient,
        HttpHandler,
        ProfileService,
        { provide: Dialog, useValue: {} },
        Overlay
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set showImage to false and clear imageSrc', () => {
    component.showImage = true;
    component.imageSrc = 'some-image-src';

    component.onDelete();

    expect(component.showImage).toBe(false);
    expect(component.imageSrc).toBe('');
  });
});
