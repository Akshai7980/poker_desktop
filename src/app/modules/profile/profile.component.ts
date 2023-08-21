import { Component } from '@angular/core';
import { UserPreferencesService } from 'projects/shared/src/lib/services/user-preferences.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  constructor(private userPrefService: UserPreferencesService) {}

  triggerAvatarEvent(event: string) {
    this.userPrefService.selectedAvatar.next(event);
  }
}
