import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { BaseResponse } from 'projects/shared/src/public-api';
import { FaqDialogComponent } from './faq-dialog.component';
import { FaqResponse } from '../../../models/response/faq.resonse';

describe('ViewFaqDialogComponent', () => {
  let component: FaqDialogComponent;
  let fixture: ComponentFixture<FaqDialogComponent>;

  const dialogMock = {
    close: () => {}
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FaqDialogComponent],
      providers: [{ provide: MatDialogRef, useValue: dialogMock }, HttpClient, HttpHandler]
    }).compileComponents();

    fixture = TestBed.createComponent(FaqDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate faqList on successful API response', () => {
    const faqListResponse: BaseResponse<FaqResponse[]> = {
      code: 200,
      message: 'Success',
      data: [
        {
          title: 'How do I get on the Cash Games Leaderboard?',
          answer:
            '<p>We have various Cash Games Leaderboards where you can play on the cash table and on the basis of the stakes you are playing, you can compete for available Cash games leaderboard for which you will get prize money based on the prize structure.</p>\n<p><em>Note: Private Tables are not counted for Leaderboard Points.</em></p>'
        },
        {
          title: 'How Do I Check My Leaderboard Progress for Cash Games and Tournaments?',
          answer:
            '<p>Please follow the below-mentioned steps to check the leaderboard progress:</p>\n<ul>\n<li>Login to your Adda52 account on the Phone/Desktop browser.</li>\n<li>Click section</li>\n<li>Click on the button to see the joined leaderboards, here you can also check your progress of the leaderboard.</li>\n</ul>'
        }
      ]
    };

    component.getFaqList();
    expect(faqListResponse).toBeDefined();
    expect(component.isShowToast).toBeTrue();
  });

  it('should call on close()', () => {
    const spy = spyOn(component.dialogRef, 'close').and.callThrough();
    component.dialogRef.close();
    expect(spy).toHaveBeenCalled();
  });
});
