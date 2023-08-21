import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InviteEarnComponent } from './invite-earn.component';
import { InviteEarnRoutingModule } from './invite-earn-routing.module';

@NgModule({
  declarations: [InviteEarnComponent],
  imports: [CommonModule, InviteEarnRoutingModule]
})
export class InviteEarnModule {}
