import { ComponentFixture, TestBed } from '@angular/core/testing';
import { colors } from 'projects/cashier/src/assets/abstract/colorsConfig';
import { TimelineComponent } from './timeline.component';

describe('TimelineComponent', () => {
  let component: TimelineComponent;
  let fixture: ComponentFixture<TimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimelineComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should add the third element when timelineArray has one element', () => {
    component.timelineArray = [
      {
        color: 'some-color',
        date: '2023-08-01',
        icon: '1',
        reason: 'Some reason',
        status: 'Some status',
        title: 'Some title',
        isIndex: true
      }
    ];

    component.ngOnChanges();

    expect(component.timelineArray.length).toBe(3);

    const thirdElement = component.timelineArray[2];
    expect(thirdElement.color).toBe(colors['secondary-success']);
    expect(thirdElement.date).toBe('');
    expect(thirdElement.icon).toBe('3');
    expect(thirdElement.reason).toBe('');
    expect(thirdElement.status).toBe('');
    expect(thirdElement.title).toBe('Bank Details');
    expect(thirdElement.isIndex).toBe(true);
  });

  it('should add the third element when timelineArray has two elements', () => {
    component.timelineArray = [
      {
        color: 'some-color',
        date: '2023-08-01',
        icon: '1',
        reason: 'Some reason',
        status: 'Some status',
        title: 'Some title',
        isIndex: true
      },
      {
        color: 'another-color',
        date: '2023-08-02',
        icon: '2',
        reason: 'Another reason',
        status: 'Another status',
        title: 'Another title',
        isIndex: true
      }
    ];

    component.ngOnChanges();

    expect(component.timelineArray.length).toBe(3);

    const thirdElement = component.timelineArray[2];
    expect(thirdElement.color).toBe(colors['secondary-success']);
    expect(thirdElement.date).toBe('');
    expect(thirdElement.icon).toBe('3');
    expect(thirdElement.reason).toBe('');
    expect(thirdElement.status).toBe('');
    expect(thirdElement.title).toBe('Bank Details');
    expect(thirdElement.isIndex).toBe(true);
  });
});
