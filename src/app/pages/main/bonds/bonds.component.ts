import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {BondsService} from "../../../services/bonds/bonds.service";
import {debounceTime, first, map, Observable, Subject, Subscription, takeUntil} from "rxjs";
import {Router} from "@angular/router";
import {DataFromServer, IAllBonds, KeysAndValues, ObjectfromKAndV, StringOrNumber} from "../../../models/bond";
import {AsaidService} from "../../../services/asaid/asaid.service";




@Component({
  selector: 'app-bonds',
  templateUrl: './bonds.component.html',
  styleUrls: ['./bonds.component.scss']
})
export class BondsComponent implements OnInit, OnDestroy {
  destroySub: Subject<boolean> = new Subject<boolean>()
  inBonds: boolean;
  bonds: any ;
  rows: number;
  first = 1;
  length: number;
  bondsOnPage: any[];
  bondsCopy: any[];
  sortOptions: any;
  options: any;
  sortKey: any;
  key: any;
  bondFromServer: IAllBonds = {
    SECID: '',
    PREVPRICE: 0,
    COUPONVALUE: 0,
    BOARDID: ''
}
  newBondFromServer: IAllBonds[]

  constructor(private bondsService: BondsService,
              private router: Router,
              private asaidService: AsaidService) { }

  ngOnInit(): void {
    this.first = 1;
    this.asaidService.setChapter('bonds');
    this.initBonds();
    this.bondsService.searchValue.pipe(takeUntil(this.destroySub)).subscribe((searchValue) => {
      if (searchValue) {
        this.bonds = Object.values(this.bondsCopy).filter((el: any) => {
          return  el.SECID.toLowerCase().includes(searchValue.toLowerCase())
        });
      } else {
        this.bonds = {...this.bondsCopy};
      }
      if (this.bonds.length !=0){
        this.bondsOnPage = Object.values(this.bonds).slice(0, 12);
      }
      else {
        this.bondsOnPage = [];
      }
      this.length = this.bonds.length;
    })
    this.checkInBonds();
    this.bondsService.setInBonds(this.inBonds);
    this.sortOptions = [
      {
        label: 'По возрастанию',
        sortKey: 'increase'
      },
      {
        label: 'По убыванию',
        sortKey: 'decrease'
      },
      {
        label: 'Не выбрано',
        sortKey: 'nothing'
      }
    ]
    this.options = [
      {
        label: 'По возрастанию',
        key: 'increase'
      },
      {
        label: 'По убыванию',
        key: 'decrease'
      },
      {
        label: 'Не выбрано',
        key: 'nothing'
      }
    ]
    console.log('first', this.first)
  }

  ngOnDestroy() {
    this.destroySub.next(true)
    this.asaidService.setChapter('');
  }

  onPageChange(ev:  {page: number , pageCount: number}) {
    console.log('ev', ev)
     if (ev.page === 0){
       let first = ev.page ;
       let last = first + ev.pageCount;
       this.bondsOnPage = Object.values(this.bonds).slice(first, last);
       this.first = ev.page + 1;
     }
    else if (((ev.page+1)*12) < this.length) {
       let first = ev.page * ev.pageCount - 1 ;
       let last = first + ev.pageCount;
       this.bondsOnPage = this.bonds.slice(first, last);
       this.first = ev.page * ev.pageCount - 1 ;
       console.log('this.first1', this.first)
     } else {
       let first = ev.page * ev.pageCount ;
       let last = this.length;
       this.bondsOnPage = this.bonds.slice(first, last);
       this.first = ev.page * ev.pageCount;
       console.log('this.first2', this.first)
     }
  }

  goToBondInfoPage(bond: any): void {
    this.bondsService.rememberBond(bond);
    this.router.navigate([`main/info-bond/${bond[1]}`])
  }
  checkInBonds() {
    this.inBonds = true;
  }

  onSortPrice(ev: {originalEvent: any, value: {label: 'По возрастанию', sortKey: string}}) {
    let array = [...this.bondsCopy]
    if (ev.value.sortKey == 'decrease') {
      this.bonds = array.sort((a: IAllBonds, b: IAllBonds) => b.PREVPRICE-a.PREVPRICE
      )
      this.bondsOnPage = Object.values(this.bonds).slice(0, 12);
    }
    else if (ev.value.sortKey == 'increase') {
      this.bonds = array.sort((a: IAllBonds, b: IAllBonds) => a.PREVPRICE-b.PREVPRICE
      )
      this.bondsOnPage = Object.values(this.bonds).slice(0, 12);
    }
    else {
      this.bonds = [...this.bondsCopy]
      this.bondsOnPage = Object.values(this.bonds).slice(0, 12);
    }
  }

  onSortCoupon(ev: {originalEvent: any, value: {label: 'По возрастанию', key: string}}) {
    let array = [...this.bondsCopy]
    if (ev.value.key == 'decrease') {
      this.bonds = array.sort((a: IAllBonds, b: IAllBonds) => b.COUPONVALUE-a.COUPONVALUE
      )
      this.bondsOnPage = Object.values(this.bonds).slice(0, 12);
    }
    else if (ev.value.key == 'increase') {
      this.bonds = array.sort((a: IAllBonds, b: IAllBonds) => a.COUPONVALUE-b.COUPONVALUE
      )
      this.bondsOnPage = Object.values(this.bonds).slice(0, 12);
    }
    else {
      this.bonds = [...this.bondsCopy]
      this.bondsOnPage = Object.values(this.bonds).slice(0, 12);
    }
  }

  initBonds(){
    this.bondsService.getAllBonds().pipe(takeUntil(this.destroySub)).subscribe((data) => {
        const keys = Object.keys(this.bondFromServer);
        let newArr: IAllBonds[] = [];
        let newArrArr: any = [];
        /*const arrayData: DataFromServer[] = data.securities.data.slice(0, 100);*/
        const arrayData: DataFromServer[] = data.securities.data;
        const columns: string[] = data.securities.columns;
        arrayData.map((el, index) => {
            let k: StringOrNumber[][] = [];
            columns.map((column, index) => {
                for (let i = 0; i < keys.length; i++) {
                  if (column == keys[i]){
                    if (keys[i] == 'PREVPRICE'){
                      let j = Math.ceil(Number(el[index])*10);
                      let c:StringOrNumber[] = [keys[i],j]
                      k.push(c);
                    }
                    else {
                      let c:StringOrNumber[] = [keys[i],el[index]]
                      k.push(c) ;
                    }
                  }
                }
              },
            )
            let s = !(Object.values(Object.fromEntries(k))).includes(null);
            let t = !(Object.values(Object.fromEntries(k))).includes(0);
            let p = !(Object.values(Object.fromEntries(k))).includes('');
            if (s && t && p) {
              newArr.push(Object.fromEntries(k))
            }
          }
        )
        this.bonds = [...newArr];
        this.bondsCopy = [...this.bonds];
        this.bondsOnPage = this.bonds.slice(0, 12);
        this.rows = Math.ceil((this.bonds.length)/12);
        if (this.bonds) {
          this.length = this.bonds.length;
        }
        if (this.bonds.length !=0){
          this.bondsOnPage = this.bonds.slice(0, 12);
        }
        else {
          this.bondsOnPage = [];
        }
        this.bondsCopy = [...this.bonds];
      }
    )
  }

}
