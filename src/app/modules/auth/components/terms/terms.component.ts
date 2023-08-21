import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Paths, BaseResponse, GetTermOfUseResponse } from 'projects/shared/src/public-api';
import { AuthService } from 'projects/shared/src/lib/services/auth.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html'
})
export class TermsComponent implements OnInit, OnDestroy {
  assetsImagePath = Paths.imagePath;

  termsAndConditions: string;

  subscriptions: Subscription[] = [];

  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<TermsComponent>,
    private authService: AuthService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.getTermsAndConditions();
  }

  onBackOrClose() {
    this.dialogRef.close();
  }

  onClose() {
    this.dialog.closeAll();
  }

  getTermsAndConditions() {
    const getTermsAndConditions$ = this.authService.getTermsAndConditions();
    const getTermsAndConditions: Subscription = getTermsAndConditions$.subscribe({
      next: (resp: BaseResponse<GetTermOfUseResponse>) => {
        this.termsAndConditions = resp.data.page_description_new;
        const timeoutVar = setTimeout(() => {
          const anchorTags: HTMLCollection = document.getElementsByTagName('a');
          const arr = Array.from(anchorTags);
          arr.forEach((element) => {
            const tag: HTMLAnchorElement = element as HTMLAnchorElement;
            const url = element.getAttribute('href');
            if (url) {
              this.executeRenderer(url, tag);
            }
          });
          clearTimeout(timeoutVar);
        }, 100);
      },
      error: () => {}
    });
    this.subscriptions.push(getTermsAndConditions);
  }

  executeRenderer(url: string, element: HTMLAnchorElement) {
    this.renderer.listen(element, 'click', () => {
      const timeoutVar1 = setTimeout(() => {
        if (window.location.href !== url) {
          window.open(url, 'tnc');
        }
        clearTimeout(timeoutVar1);
      }, 500);
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
