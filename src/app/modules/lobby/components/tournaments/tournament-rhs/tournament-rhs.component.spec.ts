import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TournamentRhsComponent } from './tournament-rhs.component';

describe('TournamentRhsComponent', () => {
  let component: TournamentRhsComponent;
  let fixture: ComponentFixture<TournamentRhsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TournamentRhsComponent],
      imports: [MatTooltipModule, HttpClientModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TournamentRhsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
