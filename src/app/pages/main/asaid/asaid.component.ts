import { Component, OnInit } from '@angular/core';
import {IItem} from "../../../models/item";

@Component({
  selector: 'app-asaid',
  templateUrl: './asaid.component.html',
  styleUrls: ['./asaid.component.scss']
})
export class AsaidComponent implements OnInit {
  items: IItem[] = [];
  constructor() { }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Личный кабинет',
        route: '',
      },
      {
        label: 'Облигации',
        route: ''
      },
      {
        label: 'Акции',
        route: ''
      },
      {
        label: 'Валюта',
        route: ''
      },
      {
        label: 'Металлы',
        route: ''
      },
      {
        label: 'Настройка',
        route: ''
      }
    ];
  }

}
