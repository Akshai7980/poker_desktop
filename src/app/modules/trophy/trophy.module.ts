import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrophyComponent } from './trophy.component';
import { TrophyRoutingModule } from './trophy-routing.module';

@NgModule({
  declarations: [TrophyComponent],
  imports: [CommonModule, TrophyRoutingModule]
})
export class TrophyModule {}
