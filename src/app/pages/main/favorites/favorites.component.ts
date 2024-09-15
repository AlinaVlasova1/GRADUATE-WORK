import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FavoritesService} from "../../../services/favorites/favorites.service";
import {BondsService} from "../../../services/bonds/bonds.service";
import {DataFromServer, IAllBonds, IBond, KeysAndValues, ObjectfromKAndV, StringOrNumber} from "../../../models/bond";
import {Router} from "@angular/router";
import {IFavorite, IFavoriteFromServer} from "../../../models/favorite";
import {log10} from "chart.js/helpers";
import {AsaidService} from "../../../services/asaid/asaid.service";
import {from, map, of, Subject, switchMap, takeUntil, tap} from "rxjs";
import {Paginator} from "primeng/paginator";

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit, OnDestroy {
  destroySub: Subject<boolean> = new Subject<boolean>();
  userId: string;
  firstPage: number = 1;
  rows: number;
  favorites: IFavoriteFromServer[] = [];
  favoritesCopy: IFavoriteFromServer[] = [];
  favoritesInPage: IFavoriteFromServer[] = [];
  length: number;
  arrForCreateRequest: IFavorite[];
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
    this.favoriteService.searchValue.pipe(takeUntil(this.destroySub)).subscribe((searchValue) => {
      if (searchValue) {
        this.favorites = Object.values(this.favoritesCopy).filter((el: any) => {
          return  el.SECID.toLowerCase().includes(searchValue.toLowerCase())
        });
      } else {
        this.favorites = [...this.favoritesCopy];
      }
      if (this.favorites.length !== 0){
        this.favoritesInPage = Object.values(this.favorites).slice(0, 12);
      }
      else {
        this.favoritesInPage = [];
      }
      this.length = this.favorites.length;
    })
  }

  ngOnDestroy() {
    this.asaidService.setChapter('');
    this.destroySub.next(true)
  }

  initFavorites() {
    const userFromStorage = localStorage.getItem('user');
    this.userId = JSON.parse(userFromStorage).id;
    this.favoriteService.getFavorites().pipe(takeUntil(this.destroySub),
      map((data) => {
        const arrDataObservable = from(data);
         /* data.map((el) => {return of(el)});*/
       const resArr: IFavoriteFromServer[] = [];
         arrDataObservable.pipe(
          switchMap((el, index) => {
            return this.bondsService.getBondByISIn(el.SECID).pipe(map(
              (bond) => {
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

                this.newfavoriteFromServer.PREVPRICE = Math.ceil(this.newfavoriteFromServer.PREVPRICE * 10);
                this.favorites.push(this.newfavoriteFromServer);
                resArr.push(this.newfavoriteFromServer);
                return resArr ;
              })
            )
          })
        ).subscribe((res) => {
           this.length = res.length;
           this.rows = Math.ceil((this.length)/12);
         })
        return resArr
      })
    )
      .subscribe((res) => {})
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

  onPageChange(ev:  {page: number , pageCount: number}) {
    if (ev.page === 0){
      let first = ev.page + 1 ;
      let last = (first + ev.pageCount) > 0 ? (first + ev.pageCount) : 1;
      this.favoritesInPage = Object.values(this.favorites).slice(first, last);
    }
    else if (((ev.page+1)*12) < this.length) {
      let first = ev.page*ev.pageCount -1 ;
      let last = (first + ev.pageCount) > 0 ? (first + ev.pageCount) : 1;
      this.favoritesInPage = this.favorites.slice(first, last);
    } else {
      let first = ev.page *ev.pageCount ;
      let last = this.length > 0 ? this.length : 1;
      this.favoritesInPage = this.favorites.slice(first, last);
    }
  }
}
