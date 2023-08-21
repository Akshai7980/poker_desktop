import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SitNGoComponent } from './sit-n-go.component';

const routes: Routes = [{ path: '', component: SitNGoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SitNGoRoutingModule {}
