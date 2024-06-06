import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SharesComponent} from "./shares.component";

const routes: Routes = [
  {path:'', component: SharesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharesRoutingModule { }
