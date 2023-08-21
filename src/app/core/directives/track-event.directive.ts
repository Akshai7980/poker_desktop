import { Directive, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService } from 'projects/shared/src/lib/services/analytics.service';

@Directive({
  selector: '[trackEvents]'
})
export class TrackEventDirective {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly router: Router
  ) {}

  @HostListener('click', ['$event'])
  onClick(event: any) {
    this.analyticsService.trackingEvent({
      event: 'click',
      message: (event.target as HTMLElement).id,
      path: this.router.url
    });
  }

  @HostListener('keyup', ['$event'])
  onInput(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    if (target.value.length === target.maxLength || target.value.length > target.minLength) {
      this.analyticsService.trackingEvent({
        event: 'keyup',
        message: target.id,
        path: ''
      });
    }
  }
}
