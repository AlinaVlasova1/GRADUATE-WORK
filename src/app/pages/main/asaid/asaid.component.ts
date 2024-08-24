import { Component, OnDestroy, OnInit} from '@angular/core';
import {IItem} from "../../../models/item";
import {AsaidService} from "../../../services/asaid/asaid.service";
import {Subject, Subscription, takeUntil} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-asaid',
  templateUrl: './asaid.component.html',
  styleUrls: ['./asaid.component.scss']
})
export class AsaidComponent implements OnInit, OnDestroy {
  items: IItem[] = [];
  chapter: string;
  desstroySub: Subject<boolean> = new Subject()
  constructor(
    private router: Router,
    private asaidService: AsaidService) { }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Избранное',
        route: ['favorites'],
        chapter: 'favorites'
      },
      {
        label: 'Облигации',
        route: ['bonds'],
        chapter: 'bonds'
      },
      {
        label: 'Акции',
        route: ['shares'],
        chapter: 'shares'
      },
      {
        label: 'Валюта',
        route: ['currency'],
        chapter: 'currency'
      },
      {
        label: 'Металлы',
        route: ['metals'],
        chapter: 'metals'
      },
     /* {
        label: 'Настройка',
        route: ['']
      }*/
    ];

    this.chapter = 'favorites';

  }

  ngOnDestroy() {
    this.desstroySub.next(true);
  }

  navigateChapter(chapter: string) {
    this.chapter = chapter;
    this.asaidService.chapter = chapter;
    this.router.navigate([`main/${this.chapter}`])
  }
}
