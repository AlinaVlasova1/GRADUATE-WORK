import {Component, OnDestroy, OnInit} from '@angular/core';
import {BondsService} from "../../../services/bonds/bonds.service";
import {ActivatedRoute, Data} from "@angular/router";
import {Subscription} from "rxjs";
import {
  DataFromServer,
  IBondHistory,
  IBondTransform,
  KeysAndValues,
  ObjectfromKAndV,
  StringOrNumber
} from "../../../models/bond";
import {Chart, registerables } from "chart.js";
import {FavoritesService} from "../../../services/favorites/favorites.service";
import {MessageService} from "primeng/api";
import {IFavorite} from "../../../models/favorite";

@Component({
  selector: 'app-info-bond',
  templateUrl: './info-bond.component.html',
  styleUrls: ['./info-bond.component.scss']
})
export class InfoBondComponent implements OnInit, OnDestroy {
  bond: any;
  bondFromServer: IBondTransform = {
    SECID: '',
    COUPONVALUE: 0,
    NEXTCOUPON: '',
    PREVPRICE: 0,
    LOTSIZE: 0,
    PREVDATE: '',
    SETTLEDATE: '',
    EMITENT: '',
    MATDATE: ''
  };
  bondHistory: IBondHistory = {
    TRADEDATE: '',
    CLOSE: 0
  }
  newBondFromServer: IBondTransform;
  subscription: Subscription;
  subForChart: Subscription;
  chart: any = [];
  labels: string[] = [];
  priceDay: number[] = [];
  constructor(private bondsService: BondsService,
              private route: ActivatedRoute,
              private favoriteService: FavoritesService,
              private messageService: MessageService) { }

  ngOnInit(): void {
    Chart.register(...registerables);

    this.bond = this.bondsService.bond;
   const isin = this.bond.SECID;
   const currentDay = new Date();
   const currentTransformDate = this.transformDate(currentDay);
   const startData: string = this.getStartData(currentTransformDate);
   this.subscription = this.bondsService.getBondByISIn(isin).subscribe((data) => {
     const keys = Object.keys(this.bondFromServer);
     let newArr: ObjectfromKAndV[] = [];
     const arrayData: DataFromServer[] = data.securities.data;
     const values: StringOrNumber[] = arrayData[0];
     const columns: string[] = data.securities.columns;
     keys.map((el, index) => {
         for (let i = 0; i < columns.length; i++) {
           if (el == columns[i]) {
             let j: KeysAndValues[] = [el, values[i]];
             /*newArr[index] = j;*/
             newArr.push(j);
           }
         }
         return newArr;
       }
     )
     this.newBondFromServer = Object.fromEntries(
       newArr
     );

     this.newBondFromServer.PREVPRICE = Math.ceil(this.newBondFromServer.PREVPRICE * 10);
     this.newBondFromServer.PREVDATE = new Date(this.newBondFromServer.PREVDATE)
       .toLocaleString('ru-RU',
         {year: "numeric", month: "short", day: "numeric"});
     this.newBondFromServer.MATDATE = new Date(this.newBondFromServer.MATDATE)
       .toLocaleString('ru-RU',
         {year: "numeric", month: "short", day: "numeric"});
     this.newBondFromServer.NEXTCOUPON = new Date(this.newBondFromServer.NEXTCOUPON)
       .toLocaleString('ru-RU',
         {year: "numeric", month: "short", day: "numeric"});
   })
     this.subForChart = this.bondsService.getHistoryBond(isin, startData, currentTransformDate).subscribe((data) => {
         const columns: string[] = data.history.columns;
         const keys = Object.keys(this.bondHistory);
         const arrayData: DataFromServer[] = data.history.data;
         let labelsForChart: string[] = [];
         let dataForChart: number[] = [];
         let x: number;
         let y: number;
         for (let i=0; i < columns.length; i++){
           if (columns[i] == "TRADEDATE"){
             x = i;
           }
           else if (columns[i] == 'CLOSE'){
             y = i;
           }
         }

       for (let j = 0; j < arrayData.length; j++){
         if (arrayData[j][y] > 0) {
           labelsForChart.push(
             new Date(arrayData[j][x])
               .toLocaleString('ru-RU',
                 {year: "numeric", month: "short", day: "numeric"})
           );
           dataForChart.push(<number>arrayData[j][y]*10);
         }
       }

       this.labels = labelsForChart;
       this.priceDay = dataForChart;
       const configChart = {
         labels: this.labels,
         datasets: [{
           label: 'Цена облигации',
           data: this.priceDay,
           fill: false,
           borderColor: 'rgb(93, 69, 253)',
           tension: 0.1
         }]
       }

       this.chart = new Chart( <HTMLCanvasElement>document.getElementById('badCanvas1'), {
         type: 'line',
         data: configChart,
         options: {
           scales: {
             y: {
               stacked: true
             }
           }
         }
       });

       }
     )


   }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subForChart.unsubscribe();
  }

   transformDate(date: Date) {
    return ['year', 'month', 'day'].map(e => new Intl.DateTimeFormat('en', {
      [e]: 'numeric',
    }).format(date).padStart(2, '0')).join(`-`);
  }

  getStartData(data: string) {
    let newData = data.split("-");
    let arrayData =  newData.map((el) => Number(el));
    if (arrayData[1] > 3){
      arrayData[1] = arrayData[1] -3;
    }
    else {
      arrayData[1] = 12 + arrayData[1] - 3;
      arrayData[0] = arrayData[0] - 1;
    }
    let newDataString = arrayData.map((el) => String(el)).join("-");
    return newDataString;
  }

  addFavorities(ev: Event){
    const userData = localStorage.getItem('user');
    const userId = JSON.parse(userData).id;
    const postData: IFavorite = {
      SECID: this.bond.SECID,
      userId: userId
    }
    console.log('postData', postData)
    this.favoriteService.sendTourData(postData).subscribe();
    this.messageService.add({
      severity: "success",
      summary: "Облигация добавлена в избранное"
    })
  }


}
