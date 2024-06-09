import {Component, OnDestroy, OnInit} from '@angular/core';
import {BondsService} from "../../../services/bonds/bonds.service";
import {first, map, Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-bonds',
  templateUrl: './bonds.component.html',
  styleUrls: ['./bonds.component.scss']
})
export class BondsComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  bonds: any ;
  rows: number;
  first = 1;
  length: number;
  bondsOnPage: any;
  constructor(private bondsService: BondsService,
              private router: Router) { }

  ngOnInit(): void {
     this.subscription = this.bondsService.getAllBonds().subscribe((data) => {
       console.log("data",data.securities.data);
       this.bonds = data.securities.data;
       this.rows = Math.ceil((this.bonds.length)/12);
       if (this.bonds) {
         this.length = this.bonds.length;
       }
       this.bondsOnPage = this.bonds.slice(0, 12);

       console.log("length", this.length);
     }
    )
    console.log("length", this.length);

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onPageChange(ev:  {page: number , pageCount: number}) {
     if (((ev.page+1)*12) < this.length) {
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



}
