import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherPrizesComponent } from './other-prizes.component';

describe('OtherPrizesComponent', () => {
  let component: OtherPrizesComponent;
  let fixture: ComponentFixture<OtherPrizesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OtherPrizesComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(OtherPrizesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
