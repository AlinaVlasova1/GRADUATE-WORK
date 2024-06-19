import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainComponent} from "./main.component";

const routes: Routes = [
  {path: '', component: MainComponent,
  children:[
    {path: 'favorites', loadChildren: () => import('./favorites/favorites.module').then(m => m.FavoritesModule)},
    {path: 'shares' , loadChildren: () => import('./shares/shares.module').then(m => m.SharesModule)},
    {path: 'bonds' , loadChildren: () => import('./bonds/bonds.module').then(m => m.BondsModule)},
    {path: 'info-bond/:id', loadChildren: () => import('./info-bond/info-bond.module').then(m => m.InfoBondModule)}
  ]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
