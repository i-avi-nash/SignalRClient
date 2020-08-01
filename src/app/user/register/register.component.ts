import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

  @ViewChild('registerForm') registerForm: NgForm;

  user: User = new User();

  constructor(private _ctx: UserService, private _toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
  }

  register() {
    this._ctx.register(this.user).then((result: any) => {
      if (result.succeeded) {
        this.registerForm.resetForm();
        this._toastr.success('Registration Successful', 'Registration');
      } else {
        result.errors.forEach(error => {
          this._toastr.error(error.description, "Registration");
        });
      }
    });
  }

  login() {
    this.router.navigateByUrl('/user/login');
  }

}

export class User {
  username: string;
  email: string;
  password: string;
  fullName: string;
}
