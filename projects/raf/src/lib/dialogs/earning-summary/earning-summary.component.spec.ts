import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarningSummaryComponent } from './earning-summary.component';

describe('EarningSummaryComponent', () => {
  let component: EarningSummaryComponent;
  let fixture: ComponentFixture<EarningSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EarningSummaryComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EarningSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
