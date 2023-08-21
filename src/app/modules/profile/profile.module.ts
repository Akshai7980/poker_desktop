import { NgModule } from '@angular/core';
import { NgxProfileModule } from 'projects/profile/src/public-api';
import { ProfileComponent } from './profile.component';

@NgModule({
  declarations: [ProfileComponent],
  imports: [NgxProfileModule]
})
export class ProfileModule {}
