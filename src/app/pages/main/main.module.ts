import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import {InputTextModule} from "primeng/inputtext";
import { AsaidComponent } from './asaid/asaid.component';
import {MenuModule} from "primeng/menu";
import {TableModule} from "primeng/table";
import {StyleClassModule} from "primeng/styleclass";
import { HeaderComponent } from './header/header.component';
import { SharesComponent } from './shares/shares.component';
import { BondsComponent } from './bonds/bonds.component';
import {CardModule} from "primeng/card";
import {PaginatorModule} from "primeng/paginator";
import { InfoBondComponent } from './info-bond/info-bond.component';
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    MainComponent,
    AsaidComponent,
    HeaderComponent,
    SharesComponent,
    BondsComponent
  ],
    imports: [
        CommonModule,
        MainRoutingModule,
        InputTextModule,
        MenuModule,
        TableModule,
        StyleClassModule,
        CardModule,
        PaginatorModule,
        ReactiveFormsModule
    ]
})
export class MainModule { }
