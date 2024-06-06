import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SharesService {

  constructor(private http: HttpClient) { }

  getAllSares(): any {
    this.http.get('https://iss.moex.com/iss/securities.json?group_by=type&group_by_filter=common_share');
  }
}
