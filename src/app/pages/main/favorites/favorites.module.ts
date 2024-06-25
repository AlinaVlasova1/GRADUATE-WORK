import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FavoritesRoutingModule } from './favorites-routing.module';
import { FavoritesComponent } from './favorites.component';
import {CardModule} from "primeng/card";


@NgModule({
  declarations: [
    FavoritesComponent
  ],
    imports: [
        CommonModule,
        FavoritesRoutingModule,
        CardModule
    ]
})
export class FavoritesModule { }
