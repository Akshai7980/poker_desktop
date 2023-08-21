import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RafComponent } from './raf.component';

describe('RafComponent', () => {
  let component: RafComponent;
  let fixture: ComponentFixture<RafComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RafComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RafComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
