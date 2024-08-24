import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {IFavorite} from "../../models/favorite";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  searchValue = new BehaviorSubject<string>('');
  constructor(private http: HttpClient) { }

  sendTourData(data: IFavorite): Observable<IFavorite>{
    return  this.http.post<IFavorite>('http://localhost:3000/favorites/', data);
  }

  getFavorites(): Observable<IFavorite[]> {
    return this.http.get<IFavorite[]>(`http://localhost:3000/favorites/`);
  }

  getFavoritesByUserId(userId: string): Observable<IFavorite[]> {
    const params = new HttpParams({
      fromString: userId,
    });
    return this.http.get<IFavorite[]>(`http://localhost:3000/favorites/`, {params});
  }

  deleteFavourite(SECID: string): Observable<IFavorite> {
    return this.http.delete<IFavorite>(`http://localhost:3000/favorites/${SECID}`);
  }
}
