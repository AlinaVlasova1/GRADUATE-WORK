import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  regForm: FormGroup;
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.regForm = new FormGroup<any>({
      firstName: new FormControl('', {validators: Validators.required}),
      lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      cardNumber: new FormControl(''),
      login: new FormControl('', [Validators.required, Validators.minLength(2)]),
      password: new FormControl('', [Validators.required, Validators.minLength(2)]),
      repeatPsw: new FormControl('', [Validators.required, Validators.minLength(2)])
    })
  }
  postUser(): void{
    const userData = this.regForm.getRawValue();
    const postData = { ...userData};
    this.router.navigate(['authorization']);
    // Здесь сделать метод post с отправкой на сервер и сохранением пользователя
  }

}
