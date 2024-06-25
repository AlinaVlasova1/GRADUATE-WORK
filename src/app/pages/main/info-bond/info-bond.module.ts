import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InfoBondRoutingModule } from './info-bond-routing.module';
import { InfoBondComponent } from './info-bond.component';
import {PanelModule} from "primeng/panel";
import {ButtonModule} from "primeng/button";
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";


@NgModule({
  declarations: [
    InfoBondComponent
  ],
    imports: [
        CommonModule,
        InfoBondRoutingModule,
        PanelModule,
        ButtonModule,
        ToastModule
    ],
  providers: [MessageService]
})
export class InfoBondModule { }
