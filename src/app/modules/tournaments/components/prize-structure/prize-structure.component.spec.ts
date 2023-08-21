import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrizeStructureComponent } from './prize-structure.component';

describe('PrizeStructureComponent', () => {
  let component: PrizeStructureComponent;
  let fixture: ComponentFixture<PrizeStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrizeStructureComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PrizeStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
