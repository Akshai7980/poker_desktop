import { ComponentFixture, TestBed } from '@angular/core/testing';
import '@angular/localize/init';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { KnowMoreComponent } from './know-more.component';

describe('KnowMoreComponent', () => {
  let component: KnowMoreComponent;
  let fixture: ComponentFixture<KnowMoreComponent>;
  let mockMatDialogRef: jasmine.SpyObj<MatDialogRef<KnowMoreComponent>>;
  beforeEach(async () => {
    mockMatDialogRef = jasmine.createSpyObj('MatDialogRef', ['']);
    await TestBed.configureTestingModule({
      declarations: [KnowMoreComponent],
      imports: [MatDialogModule],
      providers: [
        HttpClient,
        HttpHandler,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: mockMatDialogRef }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(KnowMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
