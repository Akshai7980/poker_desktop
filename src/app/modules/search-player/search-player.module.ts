import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchPlayerComponent } from './search-player.component';

const routes: Routes = [
  {
    path: '',
    component: SearchPlayerComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [SearchPlayerComponent],
  imports: [
    CommonModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class SearchPlayerModule {}
