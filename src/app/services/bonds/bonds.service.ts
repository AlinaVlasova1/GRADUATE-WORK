import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {IBond} from "../../models/bond";

@Injectable({
  providedIn: 'root'
})
export class BondsService {
  inBonds: boolean;
  bond: any;
  searchValue = new BehaviorSubject<string>('');
  constructor(private http: HttpClient) { }

  getAllBonds(): Observable<any> {
    return this.http.get('https://iss.moex.com/iss/engines/stock/markets/bonds/securities.json');
  }

  getBondByISIn(isin: string): Observable<IBond> {
    return this.http.get<IBond>(`https://iss.moex.com/iss/engines/stock/markets/bonds/securities/${isin}\\.json`);
  }

  getHistoryBond( isin: string, startData:string ,currentDay: string): Observable<any> {
    return this.http.get(`https://iss.moex.com/iss/history/engines/stock/markets/bonds/securities/${isin}/MOEX.json?from=${startData}&till=${currentDay}`)
  }

  rememberBond(bond: any): void {
    this.bond = bond;
  }

  setInBonds(inBonds: boolean) {
    this.inBonds = inBonds;
  }

  checkInBonds() {
    return this.inBonds;
  }
}
