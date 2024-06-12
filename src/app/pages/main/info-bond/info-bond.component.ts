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
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    Chart.register(...registerables);

    this.bond = this.bondsService.bond;
   const emitent = this.bond[8];
   const board = this.bond[14];
   const isin = this.bond[1];
   const currentDay = new Date();
   const currentTransformDate = this.transformDate(currentDay);
   const startData: string = this.getStartData(currentTransformDate);
   console.log("startData", startData)
   this.subscription = this.bondsService.getBondByISIn(board,isin).subscribe((data) => {
     const keys = Object.keys(this.bondFromServer);
     console.log("keys", keys);
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

     this.newBondFromServer.EMITENT = emitent;

     this.newBondFromServer.COUPONVALUE = this.newBondFromServer.COUPONVALUE / 100;
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
     console.log("bondServer", this.newBondFromServer);
   })
     this.subForChart = this.bondsService.getHistoryBond(board, isin, startData, currentTransformDate).subscribe((data) => {
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

        /* keys.map((el, index) => {
             for (let i = 0; i < columns.length; i++) {
               if (el == columns[i]) {
                 for (let j = 0; j < arrayData.length; j++) {
                   if (arrayData[j][i] > 0) {
                     if (el == 'TRADEDATE') {
                       labelsForChart.push(
                         new Date(arrayData[j][i])
                           .toLocaleString('ru-RU',
                             {year: "numeric", month: "short", day: "numeric"})
                       )
                     } else if (el == 'CLOSE') {
                        dataForChart.push(<number>arrayData[j][i]*10);
                     }
                   }

                 }
               }
             }
             this.labels = labelsForChart;
             this.priceDay = dataForChart;
           }
         )*/
       console.log("labels", this.labels);
       console.log("priceDay", this.priceDay);
       const configChart = {
         labels: this.labels,
         datasets: [{
           label: 'My First Dataset',
           data: this.priceDay,
           fill: false,
           borderColor: 'rgb(75, 192, 192)',
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


}
