import { OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { Paths } from 'projects/shared/src/lib/constants/app-constants';
import {
  Component,
  DoCheck,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { OverlayService } from '../overlay/overlay.service';

@Component({
  selector: 'app-progress-spinner',
  templateUrl: './progress-spinner.component.html',
  styleUrls: ['./progress-spinner.component.scss']
})
export class ProgressSpinnerComponent implements OnInit, DoCheck {
  assetsImagePath = Paths.imagePath;

  @Input() backdropEnabled = true;

  @Input() positionGloballyCenter = true;

  @Input() displayProgressSpinner: boolean;

  @Input() message?: string;

  @Input() status?: string;

  @ViewChild('progressSpinnerRef')
  private progressSpinnerRef: TemplateRef<any>;

  private progressSpinnerOverlayConfig: OverlayConfig;

  private overlayRef: OverlayRef;

  constructor(private vcRef: ViewContainerRef, private overlayService: OverlayService) {}

  ngOnInit() {
    // Config for Overlay Service
    this.progressSpinnerOverlayConfig = {
      hasBackdrop: this.backdropEnabled,
      backdropClass: 'spinner-backdrop'
    };
    if (this.positionGloballyCenter) {
      this.progressSpinnerOverlayConfig.positionStrategy =
        this.overlayService.positionGloballyCenter();
    }
    // Create Overlay for progress spinner
    this.overlayRef = this.overlayService.createOverlay(this.progressSpinnerOverlayConfig);
  }

  ngDoCheck() {
    // Based on status of displayProgressSpinner attach/detach overlay to progress spinner template
    if (this.displayProgressSpinner && !this.overlayRef.hasAttached()) {
      this.overlayService.attachTemplatePortal(
        this.overlayRef,
        this.progressSpinnerRef,
        this.vcRef
      );
    } else if (!this.displayProgressSpinner && this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }
  }
}
