import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBuilder } from '@angular/forms';
import { SearchPlayerComponent } from './search-player.component';

describe('SearchPlayerComponent', () => {
  let component: SearchPlayerComponent;
  let fixture: ComponentFixture<SearchPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchPlayerComponent],
      providers: [FormBuilder]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
