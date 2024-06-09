import { Component, OnInit } from '@angular/core';
import {SharesService} from "../../../services/shares/shares.service";

@Component({
  selector: 'app-shares',
  templateUrl: './shares.component.html',
  styleUrls: ['./shares.component.scss']
})
export class SharesComponent implements OnInit {
 /* shares = [];*/
  constructor(private sharesService: SharesService) { }

  ngOnInit(): void {
    /*this.shares = this.sharesService.getAllSares().data;*/
  }

}
