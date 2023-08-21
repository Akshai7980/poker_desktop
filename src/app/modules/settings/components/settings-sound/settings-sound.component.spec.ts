import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { Dialog } from '@angular/cdk/dialog';
import { SettingsSoundComponent } from './settings-sound.component';

describe('SettingsSoundComponent', () => {
  let component: SettingsSoundComponent;
  let fixture: ComponentFixture<SettingsSoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsSoundComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: Dialog, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsSoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
