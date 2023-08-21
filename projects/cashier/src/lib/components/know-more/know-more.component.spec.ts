import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { KnowMoreComponent } from './know-more.component';

describe('KnowMoreComponent', () => {
  let component: KnowMoreComponent;
  let fixture: ComponentFixture<KnowMoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KnowMoreComponent],
      imports: [HttpClientTestingModule, MatDialogModule]
    }).compileComponents();

    fixture = TestBed.createComponent(KnowMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
