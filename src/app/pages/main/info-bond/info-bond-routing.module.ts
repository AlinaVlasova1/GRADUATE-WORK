import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {InfoBondComponent} from "./info-bond.component";

const routes: Routes = [
  {
    path: '',
    component: InfoBondComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfoBondRoutingModule { }
