import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Paths } from 'projects/shared/src/public-api';
import { EarningsPointsResponse } from '../../models/response/earnings-point.response';

@Component({
  selector: 'app-referral-points',
  templateUrl: './referral-points.component.html',
  styleUrls: ['./referral-points.component.scss']
})
export class ReferralPointsComponent implements OnInit {
  constructor(private router: Router) {}

  assetsImagePath = Paths.imagePath;

  data: EarningsPointsResponse;

  links = [
    { title: 'earnings', path: 'earnings' },
    { title: 'leaderboard', path: 'leader-board' }
  ];

  ngOnInit(): void {
    const data = window.history.state;
    if (data) {
      this.router.navigateByUrl('invite-earn/referral-points/earnings', { state: data });
    }
  }

  navigateTo() {
    this.router.navigate(['invite-earn']);
  }
}
