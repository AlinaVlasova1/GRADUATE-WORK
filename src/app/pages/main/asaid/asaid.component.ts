import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {IItem} from "../../../models/item";
import {AsaidService} from "../../../services/asaid/asaid.service";
import {Subject, Subscription, takeUntil} from "rxjs";

@Component({
  selector: 'app-asaid',
  templateUrl: './asaid.component.html',
  styleUrls: ['./asaid.component.scss']
})
export class AsaidComponent implements OnInit, OnDestroy, OnChanges {
  items: IItem[] = [];
  chapter: string;
  desstroySub: Subject<boolean> = new Subject()
  constructor(
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
        route: [''],
        chapter: ''
      },
      {
        label: 'Металлы',
        route: [''],
        chapter: ''
      },
     /* {
        label: 'Настройка',
        route: ['']
      }*/
    ];



  }

  ngOnChanges(changes: SimpleChanges) {
    this.asaidService.getChapter().pipe(takeUntil(this.desstroySub)).subscribe((chapter) => {
      this.chapter = chapter;
      console.log('this.chapter',this.chapter)
    });
  }

  ngOnDestroy() {
    this.desstroySub.next(true);
  }
}
