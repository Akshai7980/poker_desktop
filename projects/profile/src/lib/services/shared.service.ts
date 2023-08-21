import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public selectedAvatar = new Subject<string>();

  setAvatar(avatar: string) {
    this.selectedAvatar.next(avatar);
  }
}
