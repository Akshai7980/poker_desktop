import { Component } from '@angular/core';
import { Paths } from '../../constants/app-constants';

interface AccordionItem {
  title: string;
  body: string;
}

interface Panel {
  header: string;
  accordionData: AccordionItem[];
}

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: [
    '../../../assets/abstract/_utilities.scss',
    '../../../assets/components/cashier-common.scss'
  ]
})
export class TermsAndConditionsComponent {
  assetsImagePath = Paths.imagePath;

  termsPoints: string[] = [
    'To make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with ',
    'To make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with ',
    'To make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with '
  ];

  panel1: Panel = {
    header: 'To make a type specimen book. It has survived not only five centuries?',
    accordionData: [
      {
        title:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry.s standard dummy?',
        body: 'Powered by the insights derived in the research stage, we then work towards building a customer-centric product roadmap aimed at enhancing growth, product stickiness & market capture, through increased user engagement.'
      },
      {
        title:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry.s standard dummy?',
        body: 'Powered by the insights derived in the research stage, we then work towards building a customer-centric product roadmap aimed at enhancing growth, product stickiness & market capture, through increased user engagement.'
      }
    ]
  };

  panel2: Panel = {
    header: 'Cashier',
    accordionData: [
      {
        title:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry.s standard dummy?',
        body: 'Powered by the insights derived in the research stage, we then work towards building a customer-centric product roadmap aimed at enhancing growth, product stickiness & market capture, through increased user engagement.'
      },
      {
        title:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry.s standard dummy?',
        body: 'Powered by the insights derived in the research stage, we then work towards building a customer-centric product roadmap aimed at enhancing growth, product stickiness & market capture, through increased user engagement.'
      }
    ]
  };
}
