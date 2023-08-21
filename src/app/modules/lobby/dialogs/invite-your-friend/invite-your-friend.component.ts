import { Clipboard } from '@angular/cdk/clipboard';
import { Dialog } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MessageConstant } from 'projects/shared/src/lib/constants/message-constant';
import { ToastModel } from 'projects/shared/src/lib/models/common/toast.model';
import { LobbyService, Paths } from 'projects/shared/src/public-api';

@Component({
  selector: 'app-invite-your-friend',
  templateUrl: './invite-your-friend.component.html',
  styleUrls: ['./invite-your-friend.component.scss']
})
export class InviteYourFriendComponent implements OnInit {
  assetsImagePath = Paths.imagePath;

  inviteData: any;

  isShowToast: boolean = false;

  public toastValue: ToastModel;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public clipboard: Clipboard,
    public lobbyService: LobbyService,
    public dialog: Dialog,
    public dialogRef: MatDialogRef<InviteYourFriendComponent>
  ) {}

  ngOnInit(): void {
    this.inviteData = this.data.data;
  }

  onClose() {
    this.dialogRef.addPanelClass('dialog-slide-out-right');
    this.dialogRef.removePanelClass('dialog-slide-in-right');
    setTimeout(() => {
      this.dialog.closeAll();
    }, 1000);
  }

  social: any[] = [
    {
      icon: 'Facebook.svg',
      path: 'facebook'
    },
    {
      icon: 'Linkedin.svg',
      path: 'linkedin'
    },
    {
      icon: 'Telegram.svg',
      path: 'telegram'
    },
    {
      icon: 'Whatsapp.svg',
      path: 'whatsapp'
    }
  ];

  copyToClipBoard(code: string) {
    this.clipboard.copy(code);
    this.isShowToast = true;
    this.toastValue = {
      message: 'Copied Successfully',
      flag: 'success'
    };
  }

  openWindow(url: string): void {
    const win = window.open(url, '_blank');
    if (win) {
      win.focus();
    }
  }

  getSoicalMedialink(event: any, data: any) {
    const message = MessageConstant.inviteMessage.replace('{{id}}', `${this.inviteData?.pnr}`);
    event.preventDefault();
    let shareUrl;

    switch (data.path) {
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${message}`;
        this.openWindow(shareUrl);
        break;

      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          `${message}`
        )}`;
        this.openWindow(shareUrl);
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(`${message}`)}`;
        this.openWindow(shareUrl);
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(`${message}`)}`;
        this.openWindow(shareUrl);
        break;
      default:
        break;
    }
  }
}
