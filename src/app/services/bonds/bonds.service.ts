import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BondsService {

  constructor(private http: HttpClient) { }

  getAllBonds(): Observable<any> {
    return this.http.get('https://iss.moex.com/iss/securities.json?group_by=type&group_by_filter=ofz_bond');
  }
}
