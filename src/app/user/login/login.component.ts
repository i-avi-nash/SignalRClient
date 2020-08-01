import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  @ViewChild('loginForm') loginForm: NgForm;

  user: UserLogin = new UserLogin();

  constructor(private _ctx: UserService, private _toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    if (localStorage.getItem('token') != null)
      this.router.navigateByUrl('/home');
  }

  login(form: NgForm) {
    this._ctx.login(form.form.value)
      .then((data: any) => {
        localStorage.setItem('token', data.token);
        this.router.navigateByUrl('/home');
        this._toastr.success("Login Success", "Login");
      })
      .catch(err => {
        this._toastr.error("Invalid Username or Password!!", "Login");
      });
  }

  register() {
    this.router.navigateByUrl('/user/register');
  }

}

export class UserLogin {
  username: string;
  password: string;
}
