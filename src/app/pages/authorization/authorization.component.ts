import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {IUser} from "../../models/users";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../../services/user.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent implements OnInit {

  authForm: FormGroup;
  constructor(private router: Router,
              private http: HttpClient,
              private userService: UserService,
              private messageService: MessageService) { }

  ngOnInit(): void {
    this.authForm = new FormGroup<any>({
      login: new FormControl('', [Validators.required, Validators.minLength(2)]),
      password: new FormControl('', [Validators.required, Validators.minLength(2)]),
    })
  }
  authUser(ev: Event): void {
    const authUser: IUser = this.authForm.getRawValue();
    this.http.post<{ access_token:string, id: string }>('http://localhost:3000/users/'+authUser.login, authUser).subscribe((data) => {
      authUser.id = data.id;
      this.userService.setUser(authUser);
      const token: string = 'user-private-token'+ data.access_token;
      this.userService.setToken(token);
      /* this.userService.setToStore(token);*/


      this.router.navigate(['tickets/tickets-list']);

    }, ()=> {
      this.messageService.add({severity:'warn', summary:"Ошибка"});
    });

    //Здесь нужно сделать проверку пользователя в базе данных//
    this.router.navigate(['main']);
  }

  regUser() {
    this.router.navigate(['registration']);
  }
}
