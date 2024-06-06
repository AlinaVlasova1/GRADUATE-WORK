import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InfoBondRoutingModule } from './info-bond-routing.module';
import { InfoBondComponent } from './info-bond.component';


@NgModule({
  declarations: [
    InfoBondComponent
  ],
  imports: [
    CommonModule,
    InfoBondRoutingModule
  ]
})
export class InfoBondModule { }
