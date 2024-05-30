import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationRoutingModule } from './registration-routing.module';
import {ReactiveFormsModule} from "@angular/forms";
import {RegistrationComponent} from "./registration.component";
import {InputTextModule} from "primeng/inputtext";


@NgModule({
  declarations: [
    RegistrationComponent
  ],
  imports: [
    CommonModule,
    RegistrationRoutingModule,
    ReactiveFormsModule,
    InputTextModule
    ]
})
export class RegistrationModule { }
