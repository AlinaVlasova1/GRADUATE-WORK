import {AfterViewInit, Component, Input, OnInit, Output} from '@angular/core';
import {BondsService} from "../../../services/bonds/bonds.service";
import {FormControl, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {FavoritesService} from "../../../services/favorites/favorites.service";
import {AsaidService} from "../../../services/asaid/asaid.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  searchValue: FormControl;

  constructor(private bondService: BondsService,
              private route: ActivatedRoute,
              private favoriteService: FavoritesService,
              private asaidService: AsaidService) { }

  ngOnInit(): void {
    this.searchValue = new FormControl('', [Validators.required, Validators.minLength(2)]);
  }

  ngAfterViewInit() {
    this.searchValue.valueChanges.subscribe((changes) => {
      const service = this.searchInChapter(this.asaidService.chapter)
      this.sendSearchValue(service, changes);
    })
  }

  searchInChapter(chapter: string){
    switch (chapter){
      case 'favorites': {
      return this.favoriteService
      }
      case 'bonds': {
        return this.bondService
      }
    }
  }

  sendSearchValue(service: any, change: string){
    service.searchValue.next(change)
  }

}
