import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiAccountingComponent } from './multi-accounting.component';

describe('MultiAccountingComponent', () => {
  let component: MultiAccountingComponent;
  let fixture: ComponentFixture<MultiAccountingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultiAccountingComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MultiAccountingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
