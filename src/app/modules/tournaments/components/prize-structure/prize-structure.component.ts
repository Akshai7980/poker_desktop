import { Component } from '@angular/core';
import { Paths } from 'projects/shared/src/lib/constants/app-constants';
import { BlindStructure, PrizeStructure } from '../../models/tournaments.model';
import { blindStructureList, prizeStructureList } from '../../static/static-data';

@Component({
  selector: 'app-prize-structure',
  templateUrl: './prize-structure.component.html',
  styleUrls: ['../../styles/_shared.scss']
})
export class PrizeStructureComponent {
  assetsImagePath = Paths.imagePath;

  blindStructureList: BlindStructure[] = blindStructureList;

  prizeStructureList: PrizeStructure[] = prizeStructureList;
}
