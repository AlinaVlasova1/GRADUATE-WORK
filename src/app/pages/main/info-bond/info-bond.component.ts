import {Component, OnDestroy, OnInit} from '@angular/core';
import {BondsService} from "../../../services/bonds/bonds.service";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {DataFromServer, IBondTransform, KeysAndValues, ObjectfromKAndV, StringOrNumber} from "../../../models/bond";

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
  newBondFromServer: IBondTransform;
  subscription: Subscription;
  constructor(private bondsService: BondsService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
   this.bond = this.bondsService.bond;
   const emitent = this.bond[8];
   const board = this.bond[14];
   const isin = this.bond[1];
   this.subscription = this.bondsService.getBondByISIn(board,isin).subscribe((data) => {
      const keys = Object.keys(this.bondFromServer);
      console.log("keys" , keys);
      let newArr:ObjectfromKAndV[] = [];
      const arrayData: DataFromServer[] = data.securities.data;
      const values: StringOrNumber[] = arrayData[0];
      const columns: string[] = data.securities.columns;
      keys.map((el, index) => {
         for(let i=0; i < columns.length; i++){
           if(el == columns[i]){
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
         {year:"numeric", month:"short", day:  "numeric"});
     this.newBondFromServer.MATDATE = new Date(this.newBondFromServer.MATDATE)
       .toLocaleString('ru-RU',
         {year:"numeric", month:"short", day:  "numeric"});
     this.newBondFromServer.NEXTCOUPON = new Date(this.newBondFromServer.NEXTCOUPON)
       .toLocaleString('ru-RU',
         {year:"numeric", month:"short", day:  "numeric"});
     console.log("bondServer",this.newBondFromServer )
     /*const oldDate = this.bondFromServer[0][6];
     console.log("oldDate",oldDate );
     this.bondFromServer[6] = new Date(oldDate).toLocaleString('ru-RU',
       {year:"numeric", month:"short", day:  "numeric"});
     console.log("this.bondFromServer[35]",this.bondFromServer[35] );
     this.bondFromServer[35] = (this.bondFromServer[35])*10;
     console.log("this.bondFromServer[3]",this.bondFromServer[3] );
     this.bondFromServer[3] = (this.bondFromServer[3])*10;
     console.log("this.bond[8]",this.bond[8] );
     this.bondFromServer.push(this.bond[8]);*/
   })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getInfArray() {

  }

}
