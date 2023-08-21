import { NgModule } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { TimelineModule } from 'primeng/timeline';
import { TooltipModule } from 'primeng/tooltip';
import { SliderModule } from 'primeng/slider';
import { PanelModule } from 'primeng/panel';
import { AccordionModule } from 'primeng/accordion';

@NgModule({
  imports: [
    RadioButtonModule,
    DropdownModule,
    InputSwitchModule,
    CarouselModule,
    TableModule,
    TimelineModule,
    ProgressBarModule,
    InputTextModule,
    StepsModule,
    MenuModule,
    FileUploadModule,
    TooltipModule,
    SliderModule
  ],
  exports: [
    RadioButtonModule,
    DropdownModule,
    InputSwitchModule,
    CarouselModule,
    TableModule,
    TimelineModule,
    ProgressBarModule,
    ProgressSpinnerModule,
    InputTextModule,
    StepsModule,
    MenuModule,
    FileUploadModule,
    TooltipModule,
    SliderModule,
    PanelModule,
    AccordionModule
  ]
})
export default class PrimengModule {}
