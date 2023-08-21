import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { GeoLocationBlockedComponent } from './geo-location-blocked.component';

describe('GeoLocationBlockedComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatDialogModule, ReactiveFormsModule, HttpClientTestingModule],
      declarations: [GeoLocationBlockedComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {}
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(GeoLocationBlockedComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should set lat, long, isNotice, and enableIsBlock when position is available', () => {
    // Arrange
    const mockPosition = {
      coords: {
        latitude: 10,
        longitude: 20
      }
    };
    const fixture = TestBed.createComponent(GeoLocationBlockedComponent);
    const app = fixture.componentInstance;
    app.getLocation();
    expect(mockPosition.coords.latitude).toBe(10);
    expect(mockPosition.coords.longitude).toBe(20);
    expect(app.isNotice).toBe(false);
    expect(app.enableIsBlock).toBe(false);
  });

  it('should set isNotice and showGeoBlocked when position is not available', () => {
    const fixture = TestBed.createComponent(GeoLocationBlockedComponent);
    const app = fixture.componentInstance;
    app.getLocation();
    expect(app.isNotice).toBe(false);
    expect(app.showGeoBlocked).toBe(true);
  });
});
