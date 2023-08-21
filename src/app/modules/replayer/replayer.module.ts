import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReplayerComponent } from './replayer/replayer.component';
import { ReplayerRoutingModule } from './replayer-routing.module';

@NgModule({
  declarations: [ReplayerComponent],
  imports: [CommonModule, ReplayerRoutingModule]
})
export class ReplayerModule {}
