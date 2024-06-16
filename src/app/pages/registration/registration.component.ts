import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {IUser} from "../../models/users";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ServerError} from "../../models/errors";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  regForm: FormGroup;
  saveUserInStore: boolean;
  constructor(private router: Router,
              private messageService: MessageService,
              private http: HttpClient) { }

  ngOnInit(): void {
    this.regForm = new FormGroup<any>({
      firstName: new FormControl('', {validators: Validators.required}),
      lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      login: new FormControl('', [Validators.required, Validators.minLength(2)]),
      password: new FormControl('', [Validators.required, Validators.minLength(2)]),
      repeatPsw: new FormControl('', [Validators.required, Validators.minLength(2)])
    })
  }
  postUser(): void | boolean {
    const userData = this.regForm.getRawValue();
    const postData = { ...userData};
    console.log("password", this.regForm.controls['password']);
    console.log("repeatPsw", this.regForm.controls['repeatPsw']);
    if (this.regForm.controls['password'].getRawValue() != this.regForm.controls['repeatPsw'].getRawValue()){
      this.messageService.add({severity: 'error', summary: 'Пароли не совпадают'})
      return false
    }

    const userObj: IUser = this.regForm.getRawValue();

    this.http.post<IUser>('http://localhost:3000/users/', userObj).subscribe((data) => {
      if (this.saveUserInStore) {
        const objUserJsonStr = JSON.stringify(userObj);
        window.localStorage.setItem('user_'+userObj.login, objUserJsonStr);
      }
      this.messageService.add({severity:'success', summary:'Регистрация прошла успешно'});

    }, (err: HttpErrorResponse)=> {
      console.log("err", err);
      const serverError = <ServerError> err.error;
      this.messageService.add({severity:'warn', summary: serverError.errorText});
    });
    this.router.navigate(['authorization']);
    // Здесь сделать метод post с отправкой на сервер и сохранением пользователя
  }

}
