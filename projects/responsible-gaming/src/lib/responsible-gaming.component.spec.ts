import { ComponentFixture, TestBed } from '@angular/core/testing';
import '@angular/localize/init';
import { ResponsibleGamingComponent } from './responsible-gaming.component';

describe('ResponsibleGamingComponent', () => {
  let component: ResponsibleGamingComponent;
  let fixture: ComponentFixture<ResponsibleGamingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResponsibleGamingComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ResponsibleGamingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
