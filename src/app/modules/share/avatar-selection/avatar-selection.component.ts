import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Avatar, Paths } from 'projects/shared/src/lib/constants/app-constants';

@Component({
  selector: 'app-avatar-selection',
  templateUrl: './avatar-selection.component.html',
  styleUrls: ['./avatar-selection.component.scss']
})
export class AvatarSelectionComponent {
  assetsImagePath = Paths.imagePath;

  avatars: string[] = Avatar.avatars;

  @Output() data = new EventEmitter<string>();

  @Input() from?: string = '';

  currentIndex: number = 0;

  secondLeftImage: number;

  firstLeftImage: number;

  firstRightImage: number;

  secondRightImage: number;

  constructor() {
    this.validateImageSequence();
  }

  getImage(currentIndex: number) {
    return this.avatars[currentIndex];
  }

  previous() {
    if (this.currentIndex > 0) {
      this.currentIndex -= 1;
    } else {
      this.currentIndex = this.avatars.length - 1;
    }
    this.selectAvatar(this.currentIndex);
    this.validateImageSequence();
  }

  next() {
    if (this.currentIndex < this.avatars.length - 1) {
      this.currentIndex += 1;
    } else {
      this.currentIndex = 0;
    }
    this.selectAvatar(this.currentIndex);
  }

  selectAvatar(selectedIndex: number) {
    this.currentIndex = selectedIndex;
    this.avatars.at(this.currentIndex);
    this.data.emit(this.avatars.at(this.currentIndex));
    this.validateImageSequence();
  }

  validateImageSequence() {
    switch (this.currentIndex) {
      case 0:
        this.firstLeftImage = 24;
        this.secondLeftImage = 25;
        this.firstRightImage = 1;
        this.secondRightImage = 2;
        break;
      case 1:
        this.firstLeftImage = 25;
        this.secondLeftImage = 0;
        this.firstRightImage = 2;
        this.secondRightImage = 3;
        break;
      case 25:
        this.firstLeftImage = 23;
        this.secondLeftImage = 24;
        this.firstRightImage = 0;
        this.secondRightImage = 1;
        break;
      case 24:
        this.firstLeftImage = 22;
        this.secondLeftImage = 23;
        this.firstRightImage = 25;
        this.secondRightImage = 0;
        break;
      default:
        this.firstLeftImage = this.currentIndex - 2;
        this.secondLeftImage = this.currentIndex - 1;
        this.firstRightImage = this.currentIndex + 1;
        this.secondRightImage = this.currentIndex + 2;
        break;
    }
  }
}
