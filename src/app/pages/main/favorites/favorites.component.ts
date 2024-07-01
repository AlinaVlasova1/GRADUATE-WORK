import {Component, OnDestroy, OnInit} from '@angular/core';
import {FavoritesService} from "../../../services/favorites/favorites.service";
import {BondsService} from "../../../services/bonds/bonds.service";
import {DataFromServer, IAllBonds, IBond, KeysAndValues, ObjectfromKAndV, StringOrNumber} from "../../../models/bond";
import {Router} from "@angular/router";
import {IFavoriteFromServer} from "../../../models/favorite";
import {log10} from "chart.js/helpers";
import {AsaidService} from "../../../services/asaid/asaid.service";

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit, OnDestroy {
  userId: string;
  favorites: IFavoriteFromServer[] = [];
  favoriteFromServer: IFavoriteFromServer = {
    SECID: '',
    COUPONVALUE: 0,
    PREVPRICE: 0,
  }
  newfavoriteFromServer: IFavoriteFromServer

  constructor(private favoriteService: FavoritesService,
              private bondsService: BondsService,
              private router: Router,
              private asaidService: AsaidService) {
  }

  ngOnInit(): void {
    this.asaidService.setChapter('favorites');
    this.initFavorites();
  }

  ngOnDestroy() {
    this.asaidService.setChapter('');
  }

  initFavorites() {
    const userFromStorage = localStorage.getItem('user');
    this.userId = JSON.parse(userFromStorage).id;
    this.favoriteService.getFavorites().subscribe((data) => {
      data.map((el) => {
        this.bondsService.getBondByISIn(el.SECID).subscribe((bond) => {
          const keys = Object.keys(this.favoriteFromServer);
          let newArr: ObjectfromKAndV[] = [];
          const arrayData: DataFromServer[] = bond.securities.data;
          const values: StringOrNumber[] = arrayData[0];
          const columns: string[] = bond.securities.columns;
          keys.map((el, index) => {
              for (let i = 0; i < columns.length; i++) {
                if (el == columns[i]) {
                  let j: KeysAndValues[] = [el, values[i]];
                  newArr.push(j);
                }
              }
              return newArr;
            }
          )
          this.newfavoriteFromServer = Object.fromEntries(
            newArr
          );
          this.newfavoriteFromServer.PREVPRICE = Math.ceil(this.newfavoriteFromServer.PREVPRICE * 10)
          this.favorites.push(this.newfavoriteFromServer);
        })
      })
    })
  }

  goToBondInfoPage(bond: any): void {
    this.bondsService.rememberBond(bond);
    this.router.navigate([`main/info-bond/${bond.SECID}`])
  }

  deleteFavourite(bond: IFavoriteFromServer) {
    this.favoriteService.deleteFavourite(bond.SECID).subscribe(() => {
    })
    const deleteEl =  this.favorites.find((el) => el.SECID == bond.SECID);
    const indexDeleteEl = this.favorites.indexOf(deleteEl);
    this.favorites.splice(indexDeleteEl, 1)
  }
}
