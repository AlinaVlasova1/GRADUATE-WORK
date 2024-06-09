import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InfoBondRoutingModule } from './info-bond-routing.module';
import { InfoBondComponent } from './info-bond.component';
import {PanelModule} from "primeng/panel";
import {ButtonModule} from "primeng/button";


@NgModule({
  declarations: [
    InfoBondComponent
  ],
    imports: [
        CommonModule,
        InfoBondRoutingModule,
        PanelModule,
        ButtonModule
    ]
})
export class InfoBondModule { }
