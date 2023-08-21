import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import PrimengModule from 'src/app/primeng.module';
import { ResponsibleGameService } from '../../services/responsible-game.service';
import { SelfExclusionComponent } from './self-exclusion.component';

describe('SelfExclusionComponent', () => {
  let component: SelfExclusionComponent;
  let fixture: ComponentFixture<SelfExclusionComponent>;
  let mockResponsibleGameService: jasmine.SpyObj<ResponsibleGameService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    mockResponsibleGameService = jasmine.createSpyObj('ResponsibleGameService', [
      'getRestrictTableTab',
      'toValidateSaveData'
    ]);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    await TestBed.configureTestingModule({
      declarations: [SelfExclusionComponent],
      imports: [
        ReactiveFormsModule,
        PrimengModule,
        FormsModule,
        MatDialogModule,
        BrowserAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: ResponsibleGameService, useValue: mockResponsibleGameService },
        { provide: MatDialog, useValue: dialogSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfExclusionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with required fields', () => {
    expect(component.selfExclusionForm).toBeTruthy();
    expect(component.selfExclusionForm.get('periods')).toBeTruthy();
    expect(component.selfExclusionForm.get('periods')?.value).toBeUndefined();
  });

  it('should call getTableRestrictTabs on component initialization', () => {
    expect(mockResponsibleGameService.getRestrictTableTab).toHaveBeenCalled();
  });
});
