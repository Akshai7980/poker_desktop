import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { SngTableDetailsComponent } from './sng-table-details.component';

describe('SngTableDetailsComponent', () => {
  let component: SngTableDetailsComponent;
  let fixture: ComponentFixture<SngTableDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SngTableDetailsComponent],
      imports: [MatTooltipModule, HttpClientModule, MatDialogModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SngTableDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have sngTableHeaders array', () => {
    expect(component.sngTableHeaders).toBeDefined();
    expect(component.sngTableHeaders.length).toBe(4);
    expect(component.sngTableHeaders[0].title).toBe('Level');
  });

  it('should have sngLeaderBoardTableHeaders array', () => {
    expect(component.sngLeaderBoardTableHeaders).toBeDefined();
    expect(component.sngLeaderBoardTableHeaders.length).toBe(3);
    expect(component.sngLeaderBoardTableHeaders[0].title).toBe('RANK');
  });
});
