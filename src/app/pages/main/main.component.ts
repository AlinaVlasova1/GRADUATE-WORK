import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {AsaidService} from "../../services/asaid/asaid.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  desstroySub: Subject<boolean> = new Subject();
  chapter: string;
  constructor(private asaidService: AsaidService) { }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.desstroySub.next(true);
  }
}
