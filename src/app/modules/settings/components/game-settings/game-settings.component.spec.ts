import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { Dialog } from '@angular/cdk/dialog';
import { GameSettingsComponent } from './game-settings.component';

describe('GameSettingsComponent', () => {
  let component: GameSettingsComponent;
  let fixture: ComponentFixture<GameSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [GameSettingsComponent],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: Dialog, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GameSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
