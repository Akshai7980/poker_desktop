import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-post-bb',
  templateUrl: './post-bb.component.html',
  styleUrls: ['./post-bb.component.scss']
})
export class PostBbComponent {
  postBBForm: FormGroup = new FormGroup({});

  selectedRadio: string = '';

  showBottomTxt: boolean = false;

  constructor(private formBuilder: FormBuilder) {
    this.postBBForm = this.formBuilder.group({
      postBBRadio: ['']
    });
  }

  onSelectRadio(value: string) {
    this.selectedRadio = value;
  }
}
