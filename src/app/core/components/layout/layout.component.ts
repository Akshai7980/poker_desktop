import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  showFooter: boolean = false;

  ngOnInit(): void {
    if (this.showFooter) {
      document.body.classList.add('show-footer');
    } else {
      document.body.classList.remove('show-footer');
    }
  }
}
