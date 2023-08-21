import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HowToPlayComponent } from './how-to-play/how-to-play.component';
import { HowToPlayRoutingModule } from './how-to-play-routing.module';

@NgModule({
  declarations: [HowToPlayComponent],
  imports: [CommonModule, HowToPlayRoutingModule]
})
export class HowToPlayModule {}
