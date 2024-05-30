import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import {InputTextModule} from "primeng/inputtext";
import { AsaidComponent } from './asaid/asaid.component';


@NgModule({
  declarations: [
    MainComponent,
    AsaidComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    InputTextModule
  ]
})
export class MainModule { }
