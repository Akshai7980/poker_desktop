import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { ResponsibleGameTab, RG_SIT_N_GO } from '../../constants/app-constants';
import { ResponsibleGameService } from '../../services/responsible-game.service';
import { SitNGoComponent } from './sit-n-go.component';

describe('SitNGoComponent', () => {
  let component: SitNGoComponent;
  let fixture: ComponentFixture<SitNGoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SitNGoComponent],
      imports: [ReactiveFormsModule, FormsModule, MatDialogModule, BrowserAnimationsModule],
      providers: [FormBuilder, ResponsibleGameService, MatDialog, HttpClient, HttpHandler]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SitNGoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.sngForm.get('limits')).toBeTruthy();
    expect(component.sngForm.get('limits')?.value).toBe(2);
    expect(component.sngForm.get('buyInLimit')).toBeTruthy();
    expect(component.sngForm.get('buyInLimit')?.value).toBeNull();
  });

  it('should handle selecting limit radio', () => {
    component.selectedOption = ResponsibleGameTab.SET_LIMIT;

    component.onSelectLimitRadio(RG_SIT_N_GO.SET_LIMIT, ResponsibleGameTab.SET_LIMIT);
    expect(component.selectedLimitRadio).toEqual(1);
    expect(component.enableSubmit).toBeFalsy();

    component.onSelectLimitRadio(RG_SIT_N_GO.PLAY_ALL, ResponsibleGameTab.PLAY_ALL);
    expect(component.selectedLimitRadio).toEqual(2);
    expect(component.enableSubmit).toBeTruthy();

    component.onSelectLimitRadio(RG_SIT_N_GO.RESTRICT_ALL, ResponsibleGameTab.RESTRICT_ALL);
    expect(component.selectedLimitRadio).toEqual(3);
    expect(component.enableSubmit).toBeTruthy();
  });

  it('should get the play flag based on selected limit radio', () => {
    component.selectedLimitRadio = RG_SIT_N_GO.SET_LIMIT;
    expect(component.getPlayFlag()).toEqual('LIMIT_SPECIFIC_BUY_IN');

    component.selectedLimitRadio = RG_SIT_N_GO.PLAY_ALL;
    expect(component.getPlayFlag()).toEqual('ALL_PLAY');

    component.selectedLimitRadio = RG_SIT_N_GO.RESTRICT_ALL;
    expect(component.getPlayFlag()).toEqual('NO_PLAY');
  });

  it('should unsubscribe from subscriptions on component destroy', () => {
    component.subscriptions.push(of().subscribe());
    spyOn(component.subscriptions[0], 'unsubscribe').and.callThrough();

    component.ngOnDestroy();

    expect(component.subscriptions[0].unsubscribe).toHaveBeenCalled();
  });

  it('should enable/disable submit button based on selected options', () => {
    component.onSelectLimitRadio(1, 'set_limit');
    expect(component.enableSubmit).toBeTruthy();

    component.onSelectLimitRadio(2, 'play_all');
    expect(component.enableSubmit).toBeFalse();

    component.onSelectLimitRadio(3, 'restrict_all');
    expect(component.enableSubmit).toBeTruthy();
  });

  it('should enable/disable submit button based on entered buy-in limit', () => {
    component.onSelectLimitRadio(2, 'play_all');

    component.sngForm.get('buyInLimit')?.setValue('100');
    expect(component.enableSubmit).toBeFalse();

    component.sngForm.get('buyInLimit')?.setValue('0');
    expect(component.enableSubmit).toBeFalsy();

    component.sngForm.get('buyInLimit')?.setValue('');
    expect(component.enableSubmit).toBeFalsy();
  });
});
