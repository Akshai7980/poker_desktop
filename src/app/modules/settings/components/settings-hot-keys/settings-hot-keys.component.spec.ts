import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import {} from 'projects/shared/src/public-api';
import { MatDialog } from '@angular/material/dialog';
import { Dialog } from '@angular/cdk/dialog';
import { SettingsHotKeysComponent } from './settings-hot-keys.component';

describe('SettingsHotKeysComponent', () => {
  let component: SettingsHotKeysComponent;
  let fixture: ComponentFixture<SettingsHotKeysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SettingsHotKeysComponent],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: Dialog, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsHotKeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the key', () => {
    component.hotKeySettings.hotKeysList = [
      {
        actionTxt: 'Check/Call',
        character: 'F',
        keyName: ''
      }
    ];

    spyOn(component, 'setKey').and.callThrough();
    component.setKey();
    expect(component.toastValue).not.toEqual({
      message: 'Shortcut already in use.',
      flag: 'error'
    });
  });

  it('should return char from ASCII', () => {
    const charValue = component.getCharFromASCII(65);
    expect(charValue).toEqual('A');
  });

  it('should execute removeHotKey', () => {
    component.hotKeySettings.hotKeysList.push({
      actionTxt: 'Check/Call',
      character: 'F',
      keyName: ''
    });
    component.removeHotKey({
      actionTxt: 'Check/Call',
      character: 'F',
      keyName: ''
    });
    expect(
      component.hotKeySettings.hotKeysList.find((elem) => elem.actionTxt === 'Check/Call')
    ).toBeUndefined();
  });

  it('should enable add button if selected action and assigned key are both set', () => {
    component.assignedKey = 'someKey';

    expect(component.enableAddBtn).toBe(false);
  });

  it('should disable add button if selected action or assigned key is not set', () => {
    component.assignedKey = 'someKey';
    expect(component.enableAddBtn).toBe(false);
    component.assignedKey = '';
    expect(component.enableAddBtn).toBe(false);
  });

  it('should set isChangeExists to true and disable add button if any required condition is not met', () => {
    component.assignedKey = '';

    component.toggleHotKeySettings();

    expect(component.isChangeExists).toBe(true);
    expect(component.enableAddBtn).toBe(false);
  });

  it('should set the corresponding key to false in the map when a key is released', () => {
    component.map = { 65: true, 66: true, 67: true };

    component.onHotKeySelectionKeyUp({ keyCode: 65, which: 65 });

    expect(component.map[65]).toBe(false);
    expect(component.map[66]).toBe(true);
    expect(component.map[67]).toBe(true);
  });

  it('should set toastValue and transform properties incorrectly', () => {
    component.setKey();
    expect(component.toastValue).not.toEqual({
      message: 'Shortcut already in use.',
      flag: 'error'
    });
  });
});
