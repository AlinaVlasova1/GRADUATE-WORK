import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AsaidService {
  chapter: string;
  constructor() { }

  setChapter(menuChapter: string) {
    this.chapter = menuChapter
  }

  getChapter(): Observable<string> {
    return of(this.chapter);
  }
}
