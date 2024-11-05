import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AsaidService {
  chapter: string;
  constructor() { }

  setChapter(menuChapter: string) {
    this.chapter = menuChapter
  }
}
