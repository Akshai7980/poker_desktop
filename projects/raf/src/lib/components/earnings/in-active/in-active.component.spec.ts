import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';

import { InActiveComponent } from './in-active.component';

import '@angular/localize/init';

describe('InActiveComponent', () => {
  let component: InActiveComponent;
  let fixture: ComponentFixture<InActiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InActiveComponent],
      imports: [MatDialogModule],
      providers: [HttpClient, HttpHandler]
    }).compileComponents();

    fixture = TestBed.createComponent(InActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
