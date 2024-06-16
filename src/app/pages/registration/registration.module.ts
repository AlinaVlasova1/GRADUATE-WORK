import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationRoutingModule } from './registration-routing.module';
import {ReactiveFormsModule} from "@angular/forms";
import {RegistrationComponent} from "./registration.component";
import {InputTextModule} from "primeng/inputtext";
import {MessagesModule} from "primeng/messages";
import {ToastModule} from "primeng/toast";


@NgModule({
  declarations: [
    RegistrationComponent
  ],
  imports: [
    CommonModule,
    RegistrationRoutingModule,
    ReactiveFormsModule,
    InputTextModule,
    MessagesModule,
    ToastModule
  ]
})
export class RegistrationModule { }
