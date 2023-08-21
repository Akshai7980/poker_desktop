import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { NetworkService } from 'projects/shared/src/public-api';
import { MatDialog } from '@angular/material/dialog';
import { Dialog } from '@angular/cdk/dialog';
import { PrivateTableDetailsComponent } from './private-table-details.component';

describe('PrivateTableDetailsComponent', () => {
  let component: PrivateTableDetailsComponent;
  let fixture: ComponentFixture<PrivateTableDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrivateTableDetailsComponent],
      providers: [
        NetworkService,
        HttpClient,
        HttpHandler,
        { provide: MatDialog, useValue: {} },
        { provide: Dialog, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PrivateTableDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
