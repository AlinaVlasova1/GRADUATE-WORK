import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent implements OnInit {

  authForm: FormGroup;
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.authForm = new FormGroup<any>({
      login: new FormControl('', [Validators.required, Validators.minLength(2)]),
      password: new FormControl('', [Validators.required, Validators.minLength(2)]),
    })
  }
  authUser() {
    //Здесь нужно сделать проверку пользователя в базе данных//
    this.router.navigate(['main']);
  }

  regUser() {
    this.router.navigate(['registration']);
  }
}
