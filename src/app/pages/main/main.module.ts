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


@NgModule({
  declarations: [
    MainComponent,
    AsaidComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    InputTextModule,
    MenuModule,
    TableModule,
    StyleClassModule
  ]
})
export class MainModule { }
