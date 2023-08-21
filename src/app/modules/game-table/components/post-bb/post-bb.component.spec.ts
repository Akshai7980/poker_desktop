import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBuilder } from '@angular/forms';
import { PostBbComponent } from './post-bb.component';

describe('PostBbComponent', () => {
  let component: PostBbComponent;
  let fixture: ComponentFixture<PostBbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostBbComponent],
      providers: [FormBuilder]
    }).compileComponents();

    fixture = TestBed.createComponent(PostBbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
