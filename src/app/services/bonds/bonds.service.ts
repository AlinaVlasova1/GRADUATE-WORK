import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IBond} from "../../models/bond";

@Injectable({
  providedIn: 'root'
})
export class BondsService {

  bond: any;
  constructor(private http: HttpClient) { }

  getAllBonds(): Observable<any> {
    return this.http.get('https://iss.moex.com/iss/securities.json?group_by=type&group_by_filter=ofz_bond');
  }

  getBondByISIn(board: string, isin: string): Observable<IBond> {
    return this.http.get<IBond>(`https://iss.moex.com/iss/engines/stock/markets/bonds/boards/${board}/securities/${isin}\\.json`);
  }

  getHistoryBond(board: string, isin: string, startData:string ,currentDay: string): Observable<any> {
    return this.http.get(`https://iss.moex.com/iss/history/engines/stock/markets/bonds/boards/${board}/securities/${isin}/MOEX.json?from=${startData}&till=${currentDay}`)
  }

  rememberBond(bond: any): void {
    this.bond = bond;
  }
}
