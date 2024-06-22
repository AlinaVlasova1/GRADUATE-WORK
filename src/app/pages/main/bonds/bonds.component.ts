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
import {log10} from "chart.js/helpers";


@Component({
  selector: 'app-bonds',
  templateUrl: './bonds.component.html',
  styleUrls: ['./bonds.component.scss']
})
export class BondsComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  inBonds: boolean;
  subsBond: Subscription;
  subsSearch: Subscription;
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
    COUPONVALUE: 0
}
  newBondFromServer: IAllBonds[]

  constructor(private bondsService: BondsService,
              private router: Router) { }

  ngOnInit(): void {
     this.subsBond = this.bondsService.getAllBonds().subscribe((data) => {
       const keys = Object.keys(this.bondFromServer);
       let newArr: IAllBonds[] = [];
       let newArrArr: any = [];
       const arrayData: DataFromServer[] = data.securities.data.slice(0, 100);
       const columns: string[] = data.securities.columns;
       arrayData.map((el, index) => {
         let k: StringOrNumber[][] = [];
         columns.map((column, index) => {
           for (let i = 0; i < keys.length; i++) {
             if (column == keys[i]){
               if ((el[index]) && ((keys[i] == 'PREVPRICE')|| (keys[i] == 'COUPONVALUE'))){
                 console.log('PREVPRICE',el[index] )
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
           }

         }
         ,
         )

         let s: IAllBonds;
         s = Object.fromEntries(
           k
         )
         if (s) {
           newArr.push(s)
         }
         /*newArrArr.push(newArr)
           console.log("newArrArr", newArrArr)
           return newArrArr;*/
         }
       )
       this.bonds = [...newArr];
       console.log("type", typeof this.bonds )
       console.log("this.bonds", this.bonds )
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
    this.subsSearch = this.bondsService.searchValue.subscribe((searchValue) => {
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
      console.log('this.bonds4', this.bonds)
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
  }

  ngAfterViewInit() {



  }

  ngOnChanges(changes: SimpleChanges) {

  }

  ngOnDestroy() {
    this.subsBond.unsubscribe();
    this.subsSearch.unsubscribe();
  }

  onPageChange(ev:  {page: number , pageCount: number}) {
    console.log("tev.page",ev.page);
     if (ev.page == 0){
       let first = ev.page ;
       let last = first + ev.pageCount;
       this.bondsOnPage = Object.values(this.bonds).slice(first, last);
     }
    else if (((ev.page+1)*12) < this.length) {
       let first = ev.page*ev.pageCount -1 ;
       let last = first + ev.pageCount;
       this.bondsOnPage = this.bonds.slice(first, last);
     } else {
       let first = ev.page *ev.pageCount ;
       let last = this.length;
       this.bondsOnPage = this.bonds.slice(first, last);
     }
  }

  goToBondInfoPage(bond: any): void {
    console.log("bond",bond );
    this.bondsService.rememberBond(bond);
    this.router.navigate([`main/info-bond/${bond[1]}`])
  }
  checkInBonds() {
    this.inBonds = true;
  }

  onSortPrice(ev: {originalEvent: any, value: {label: 'По возрастанию', sortKey: string}}) {
    let array = [...this.bondsCopy]
    if (ev.value.sortKey == 'decrease') {
      console.log("успешно");
      console.log('this.bonds', this.bonds);
      console.log('this.bondsCopy', this.bondsCopy);

      this.bonds = array.sort((a: IAllBonds, b: IAllBonds) => b.PREVPRICE-a.PREVPRICE
      )
      this.bondsOnPage = Object.values(this.bonds).slice(0, 12);
      console.log(' this.bonds',  this.bonds);
    }
    else if (ev.value.sortKey == 'increase') {
      console.log("успешно");
      console.log('this.bonds', this.bonds);
      console.log('this.bondsCopy', this.bondsCopy);
      this.bonds = array.sort((a: IAllBonds, b: IAllBonds) => a.PREVPRICE-b.PREVPRICE
      )
      this.bondsOnPage = Object.values(this.bonds).slice(0, 12);
      console.log(' this.bonds',  this.bonds);
    }
    else {
      this.bonds = [...this.bondsCopy]
      this.bondsOnPage = Object.values(this.bonds).slice(0, 12);
    }
  }

  onSortCoupon(ev: {originalEvent: any, value: {label: 'По возрастанию', key: string}}) {
    let array = [...this.bondsCopy]
    console.log('this.bondsCopy', this.bondsCopy);
    console.log('array',array)
    if (ev.value.key == 'decrease') {
      console.log("успешно");
      console.log('this.bonds', this.bonds);

      this.bonds = array.sort((a: IAllBonds, b: IAllBonds) => b.COUPONVALUE-a.COUPONVALUE
      )
      this.bondsOnPage = Object.values(this.bonds).slice(0, 12);
      console.log(' this.bonds',  this.bonds);
    }
    else if (ev.value.key == 'increase') {
      console.log("успешно");
      console.log('this.bonds', this.bonds);
      console.log('this.bondsCopy', this.bondsCopy);
      this.bonds = array.sort((a: IAllBonds, b: IAllBonds) => a.COUPONVALUE-b.COUPONVALUE
      )
      this.bondsOnPage = Object.values(this.bonds).slice(0, 12);
      console.log(' this.bonds',  this.bonds);
    }
    else {
      console.log('this.bondsCopy', this.bondsCopy);
      this.bonds = [...this.bondsCopy]
      this.bondsOnPage = Object.values(this.bonds).slice(0, 12);
    }
  }

  compareIncrease(a: number, b: number) {
    if (a < b ) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    else {
      return 0;
    }
  }

}
