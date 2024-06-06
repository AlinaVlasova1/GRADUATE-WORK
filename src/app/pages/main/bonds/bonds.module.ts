import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BondsRoutingModule } from './bonds-routing.module';
import {CardModule} from "primeng/card";
import {PaginatorModule} from "primeng/paginator";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BondsRoutingModule,
    CardModule,
    PaginatorModule
  ]
})
export class BondsModule { }
