import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SettingsBetOptionComponent } from './settings-bet-option.component';

describe('SettingsBetOptionComponent', () => {
  let component: SettingsBetOptionComponent;
  let fixture: ComponentFixture<SettingsBetOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsBetOptionComponent],
      imports: [HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsBetOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set selectedTab to the given id', () => {
    const id = 1;
    component.selectTab(id);
    expect(component.selectedTab).toBe(id);
  });

  it('should set isPostFlop to true when selectedTab is 2', () => {
    const id = 2;
    component.selectTab(id);
    expect(component.isPostFlop).toBe(true);
  });

  it('should set isPostFlop to false when selectedTab is not 2', () => {
    const id = 1;
    component.selectTab(id);
    expect(component.isPostFlop).toBe(false);
  });
});
