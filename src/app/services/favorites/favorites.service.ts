import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IFavorite} from "../../models/favorite";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  constructor(private http: HttpClient) { }

  sendTourData(data: IFavorite): Observable<IFavorite>{
    return  this.http.post<IFavorite>('http://localhost:3000/favorites/', data);
  }

  getFavorites(): Observable<IFavorite[]> {
    return this.http.get<IFavorite[]>(`http://localhost:3000/favorites/`);
  }

  deleteFavourite(SECID: string): Observable<IFavorite> {
    return this.http.delete<IFavorite>(`http://localhost:3000/favorites/${SECID}`);
  }
}
