import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Paths } from 'projects/shared/src/lib/constants/app-constants';

export interface SearchPlayerData {
  isSelected: boolean;
  tourney: string;
  game_type: string;
  players: number;
  status: string;
}

@Component({
  selector: 'app-search-player',
  templateUrl: './search-player.component.html',
  styleUrls: ['./search-player.component.scss']
})
export class SearchPlayerComponent implements OnInit {
  assetsImagePath = Paths.imagePath;

  displayedColumns: string[] = [];

  searchPlayerForm: FormGroup = new FormGroup({});

  hideMeChecked: boolean = false;

  constructor(public formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.displayedColumns = ['select all', 'tourney', 'game type', 'players', 'status'];
    this.searchPlayerForm = this.formBuilder.group({
      allSelected: [null, [Validators.required]]
    });
  }

  searchPlayerData: SearchPlayerData[] = [
    {
      isSelected: false,
      tourney: 'Adda52BigGames',
      game_type: 'Hold’em',
      players: 3,
      status: 'finished'
    },
    {
      isSelected: false,
      tourney: 'Blaze200',
      game_type: 'Hold’em',
      players: 6,
      status: 'running'
    },
    {
      isSelected: false,
      tourney: 'The  Mint Satellite',
      game_type: 'Hold’em',
      players: 3,
      status: 'running'
    }
  ];

  onHideMeChange(checked: boolean): void {
    this.hideMeChecked = checked;
  }
}
