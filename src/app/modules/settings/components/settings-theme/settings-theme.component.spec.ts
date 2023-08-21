import { Dialog } from '@angular/cdk/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { SettingsThemeComponent } from './settings-theme.component';

describe('SettingsThemeComponent', () => {
  let component: SettingsThemeComponent;
  let fixture: ComponentFixture<SettingsThemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsThemeComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: MatDialog, useValue: {} },
        FormBuilder,
        { provide: Dialog, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the selected table and call changePreviewTableColor and onSettingsChange', () => {
    const table: any = { id: 1, name: 'Table 1' };

    spyOn(component, 'changePreviewTableColor');
    spyOn(component, 'onSettingsChange');

    component.onSelectedTable(table);

    expect(component.selectedTable).toBe(table);
    expect(component.changePreviewTableColor).toHaveBeenCalledWith(table.id);
    expect(component.onSettingsChange).toHaveBeenCalledWith('fromTheme');
  });

  it('should set the selected background and call changePreviewBgColor and onSettingsChange', () => {
    const background: any = { id: 1, name: 'Background 1', color: '#FFFFFF' };

    spyOn(component, 'changePreviewBgColor');
    spyOn(component, 'onSettingsChange');

    component.onSelectedBackground(background);

    expect(component.selectedBackground).toBe(background);
    expect(component.changePreviewBgColor).toHaveBeenCalledWith(background.id);
    expect(component.onSettingsChange).toHaveBeenCalledWith('fromTheme');
  });

  it('should set the selected card and call setFrontFaceCard and onSettingsChange for classic-cards', () => {
    spyOn(component, 'setFrontFaceCard');
    spyOn(component, 'onSettingsChange');

    component.onSelectedCards(0);

    expect(component.selectedCard).toBe(0);
    expect(component.selectedCardName).toBe('classic-cards');
    expect(component.setFrontFaceCard).toHaveBeenCalledWith(0);
    expect(component.onSettingsChange).toHaveBeenCalledWith('fromTheme');
  });

  it('should set the selected card and call setFrontFaceCard and onSettingsChange for fourColorDeck', () => {
    spyOn(component, 'setFrontFaceCard');
    spyOn(component, 'onSettingsChange');

    component.onSelectedCards(1);

    expect(component.selectedCard).toBe(1);
    expect(component.selectedCardName).toBe('four-color-deck');
    expect(component.setFrontFaceCard).toHaveBeenCalledWith(1);
    expect(component.onSettingsChange).toHaveBeenCalledWith('fromTheme');
  });

  it('should set the selected card and call setFrontFaceCard and onSettingsChange for fourColorDeck2', () => {
    spyOn(component, 'setFrontFaceCard');
    spyOn(component, 'onSettingsChange');

    component.onSelectedCards(2);

    expect(component.selectedCard).toBe(2);
    expect(component.selectedCardName).toBe('full-color-gloss');
    expect(component.setFrontFaceCard).toHaveBeenCalledWith(2);
    expect(component.onSettingsChange).toHaveBeenCalledWith('fromTheme');
  });

  it('should update selectedThemeTab when onThemesTabSelect is called', () => {
    const expectedTab = 'newThemeTab';
    component.onThemesTabSelect(expectedTab);
    expect(component.selectedThemeTab).toEqual(expectedTab);
  });

  it('should update selectedBackCard and call setBackFaceCard and onSettingsChange when onSelectBackCard is called with a backCard id', () => {
    const expectedBackCardId = 1;
    const expectedSelectedBackCard = 'back-red';
    spyOn(component, 'setBackFaceCard');
    spyOn(component, 'onSettingsChange');
    component.onSelectBackCard(expectedBackCardId);
    expect(component.selectedBackCard).toEqual(expectedSelectedBackCard);
    expect(component.setBackFaceCard).toHaveBeenCalledWith(expectedBackCardId);
    expect(component.onSettingsChange).toHaveBeenCalledWith('fromTheme');
  });
});
